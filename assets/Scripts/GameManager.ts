// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import InputManager from "./InputManager";
import Monster from "./Monster";
import Player from "./Player";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    _menuUI : cc.Node = null!;
    _btnDiff : cc.Node[] = [];




    _gameUI : cc.Node = null;
    _lbScore    : cc.Label = null!;
    _lbTime     : cc.Label = null!;
    _lbGameOver : cc.Node = null!;
    _btnMain : cc.Node = null;
    _lbReady : cc.Node = null!;
    _lbGo : cc.Node = null!;
    _lbFever    : cc.Node = null!;
    _feverGauge : cc.ProgressBar = null!;
    _heartContainer : cc.Node = null!;






    //InGame Value
    _difficulty : number = 0;
    _score = 0;
    _fever = 0;
    _timeCount : number = 30;
    _health = 3;
    _feverPerScore = 99;
    _feverMode : boolean = false;



    @property(Player)
    player : Player = null!;
    @property(cc.Prefab)
    monsterPrefab : cc.Prefab = null!;
    @property(cc.Prefab)
    heartPrefab : cc.Prefab = null!;


    //GameNode
    _testMonsterAr : number[] = [];
    _monsterArr : Monster[] = [];
    _heartArr : cc.Node[] = [];

    onLoad(){
        this.initMenu();
        this.initGameUI();
        this.showMain();
    }


    initMenu(){
        this._menuUI = cc.find("MenuUI");

        this._menuUI.active = true;
        cc.find( "lbEasy"   , this._menuUI ).on('click' , this.startGame.bind( this , 0) , this );  
        cc.find( "lbHard"   , this._menuUI ).on('click' , this.startGame.bind( this , 1) , this );  
        cc.find( "lbHell"   , this._menuUI ).on('click' , this.startGame.bind( this , 2) , this );  
        cc.find( "lbInsane" , this._menuUI ).on('click' , this.startGame.bind( this , 3) , this );

    }



    initGameUI(){

        this._gameUI = cc.find("GameUI");
        this._lbScore           = cc.find("lbScore", this._gameUI).getComponent(cc.Label);
        this._lbTime            = cc.find("lbTime", this._gameUI).getComponent(cc.Label);
        this._lbGameOver        = cc.find("lbGameOver", this._gameUI);
        this._lbReady           = cc.find("lbReady", this._gameUI);
        this._lbGo              = cc.find("lbGo", this._gameUI);
        this._lbFever           = cc.find("lbFever", this._gameUI);
        this._feverGauge        = cc.find("feverGauge", this._gameUI).getComponent(cc.ProgressBar);
        this._heartContainer    = cc.find("heartContainer", this._gameUI);
        this._btnMain           = cc.find("lbGameOver/btnMain" , this._gameUI );



        this._gameUI.active = false;

        this._lbScore.node.active    = true;
        this._lbTime.node.active     = true;
        this._lbGameOver.active      = false;
        this._lbFever.active         = false;
        this._lbGo.active            = false;
        this._lbReady.active         = false;
        this._feverGauge.node.active = true;

        this._btnMain.on('click', this.showMain , this );


        this._lbTime.string = this._timeCount + "";
        this._lbScore.string = this._score +"";

        this._feverGauge.progress = this._fever;

    }


    showMain(){
        this.resetGame();
        this._gameUI.active = false;
        this._menuUI.active = true;
    }



    startGame( diff : number ){
        this._difficulty = diff;

        this.getComponent(InputManager).pauseInput( false );
        this._lbScore.node.active    = true;
        this._lbTime.node.active     = true;
        this._lbGameOver.active      = false;
        this._lbFever.active         = false;
        this._lbGo.active            = false;
        this._lbReady.active         = false;
        this._feverGauge.node.active = true;
        this._gameUI.active = true;
        this._menuUI.active = false;

        cc.tween(this.node)
        .call(()=>{
            this._lbReady.active = true;
        })
        .delay(1)
        .call(()=>{
            this._lbReady.active = false;

            for( let i = 0 ; i < this._health ; i ++ ){
                let heart = cc.instantiate(this.heartPrefab);
                this._heartContainer.addChild(heart);
                this._heartArr.push( heart );
            }

            for ( let i = 0 ; i < 7 ; i ++ ){
                this.makeNewMonster();
            }
            this.schedule( this._updateTimeCount , 1 );

            this._lbGo.active = true;
        })
        .delay(0.5)
        .call(()=>{
            this._lbGo.active = false;
        })
        .start();

    }


    resetGame(){
        this._difficulty = 0;
        this._score = 0;
        this._fever = 0;
        this._timeCount = 30;
        this._health = 3;
        this._feverPerScore = 10;

        this._testMonsterAr.length = 0;
        this._monsterArr.forEach( element =>{
            element.node.removeFromParent();
        })
        this._monsterArr.length = 0;


        this._heartContainer.removeAllChildren();
        this._heartArr.length = 0;

    }

    _updateTimeCount(){
        this._timeCount--;
        this._lbTime.string = this._timeCount + "";
        if ( this._timeCount === 0 ){
            this.gameOver();

        }
    }

    leftAction(){
        if ( this._testMonsterAr[0] === -1  || this._feverMode ){
            this.player.leftAction();
            if ( this._monsterArr[0].damaged() ){
                this._testMonsterAr.splice(0,1);
                this._monsterArr.splice(0,1);
                this.moveToCenter();
                this.makeNewMonster();
                this.score();
                this.addFever();
            }
        }
        else {
            this.damaged();
        }
    }

    rightAction(){
        // cc.log('GameMamager.ts(37)' , "rightAction" )
        if ( this._testMonsterAr[0] === 1 || this._feverMode ){
            this.player.rightAction();
            if ( this._monsterArr[0].damaged() ){
                this._testMonsterAr.splice(0,1);
                this._monsterArr.splice(0,1);
                this.moveToCenter();
                this.makeNewMonster();
                this.score();
                this.addFever();

            }
        }
        else {
            this.damaged();
        }
    }


    moveToCenter(){
        for( let i = 0 ; i < this._testMonsterAr.length ; i ++ ){
            let targetPos = cc.v2((i + 1) * 100 *  this._testMonsterAr[i] , 0);
            cc.tween( this._monsterArr[i].node ) 
            .to( 0.1 , { position : targetPos})
            .start();
        }
    }

    makeNewMonster(){
        let pos = Math.floor(Math.random() * 2);
        if ( pos === 0 ) pos = -1;
        let index = this._testMonsterAr.length;
        let monster = cc.instantiate(this.monsterPrefab);
        monster.setPosition( (index + 1) * 100 *  pos , 0);


        this.node.addChild( monster );
        this._testMonsterAr.push( pos );
        this._monsterArr.push(monster.getComponent(Monster));

        let health = Math.floor(Math.random() * 3 );
        monster.getComponent(Monster).init(health + 1 , pos === -1  , this._difficulty);
    }


    score(){
        this._score++;
        this._lbScore.string = this._score +"";
    }

    addFever(){
        if ( this._feverMode === true ) return;
        this._fever += 1 / this._feverPerScore;
        this._feverGauge.progress = this._fever;
        if ( this._fever >= 1) {
            this.feverOn();
        }
    }

    feverOn(){
        this._feverMode = true;
        this._lbFever.active = true;
        this._lbFever.opacity = 255;
        this.schedule( this._updateFever  );
    }

    _updateFever( dt : number){
        this._fever -= dt * 0.4;
        this._feverGauge.progress = this._fever;
        if ( this._fever <= 0){
            this.unschedule( this._updateFever );
            this._feverMode = false;
            // this._lbFever.active = false;
            this.finishFever();
        }
    }

    finishFever(){
        let self = this;
        cc.tween( this._lbFever )
        .call( ()=>{
            self.getComponent(InputManager).pauseInput( true );
        })
        .to( 0.3 , {opacity : 0})
        .call( ()=>{
            self.getComponent(InputManager).pauseInput( false );
        })
        .start();
    }


    damaged(){
        this._health--;
        // this._lbHealth.string = this._health +"";
        this._heartArr[ this._health ].active = false;
        if ( this._health === 0 ){
            this.gameOver();
        }
    }


    gameOver(){
        this._lbGameOver.active = true;
        this.getComponent(InputManager).pauseInput( true );
        this.unschedule( this._updateTimeCount );
        this.unschedule( this._updateFever );
    }
}
