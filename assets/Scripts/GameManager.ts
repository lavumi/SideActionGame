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
export default class NewClass extends cc.Component {

    @property(Player)
    player : Player = null!;

    @property(cc.Prefab)
    monsterPrefab : cc.Prefab = null!;
    @property(cc.Prefab)
    heartPrefab : cc.Prefab = null!;




    @property(cc.Label)
    lbScore : cc.Label = null!;

    // @property(cc.Label)
    // lbHealth : cc.Label = null!;

    @property(cc.Label)
    lbTime : cc.Label = null!;

    @property(cc.Node)
    lbGameOver : cc.Node = null!;

    @property(cc.Node)
    lbFever : cc.Node = null!;

    @property(cc.ProgressBar)
    feverGauge : cc.ProgressBar = null!;

    _heartContainer : cc.Node = null!;




    _testMonsterAr = [];
    _monsterArr : Monster[] = [];
    _heartArr : cc.Node[] = [];


    _score = 0;

    _fever = 0;


    _timeCount : number = 99930;
    _health = 99;
    _feverPerScore = 99999;
    _feverMode : boolean = false;

    onLoad(){
        // this.initMenu();
        this.initGame();
    }


    initMenu(){
        this.lbScore.node.active    = false;
        this.lbTime.node.active     = false;
        this.feverGauge.node.active = false;
        this.lbGameOver.active      = false;
        this.lbFever.active         = false;
    }



    initGame(){
        for ( let i = 0 ; i < 7 ; i ++ ){
            this.makeNewMonster();
        }

        this.lbScore.node.active    = true;
        this.lbTime.node.active     = true;
        this.lbGameOver.active      = false;
        this.lbFever.active         = false;
        this.feverGauge.node.active = true;

        this._heartContainer = cc.find("HeartContainer");

        for( let i = 0 ; i < this._health ; i ++ ){
            let heart = cc.instantiate(this.heartPrefab);
            this._heartContainer.addChild(heart);
            this._heartArr.push( heart );
        }


        this.lbTime.string = this._timeCount + "";
        this.lbScore.string = this._score +"";



        this.feverGauge.progress = this._fever;
        this.schedule( this._updateTimeCount , 1 );
    }

    _updateTimeCount(){
        this._timeCount--;
        this.lbTime.string = this._timeCount + "";
        if ( this._timeCount === 0 ){
            this.gameOver();

        }
    }

    leftAction(){
        // cc.log('GameMamager.ts(33)' , "leftAction" )
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
        monster.getComponent(Monster).init(health + 1 , pos === -1 );
    }


    score(){
        this._score++;
        this.lbScore.string = this._score +"";
    }

    addFever(){
        if ( this._feverMode === true ) return;
        this._fever += 1 / this._feverPerScore;
        this.feverGauge.progress = this._fever;
        if ( this._fever >= 1) {
            this.feverOn();
        }
    }

    feverOn(){
        this._feverMode = true;
        this.lbFever.active = true;
        this.lbFever.opacity = 255;
        this.schedule( this._updateFever  );
    }

    _updateFever( dt : number){
        this._fever -= dt * 0.4;
        this.feverGauge.progress = this._fever;
        if ( this._fever <= 0){
            this.unschedule( this._updateFever );
            this._feverMode = false;
            // this.lbFever.active = false;
            this.finishFever();
        }
    }

    finishFever(){
        let self = this;
        cc.tween( this.lbFever )
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
        // this.lbHealth.string = this._health +"";
        this._heartArr[ this._health ].active = false;
        if ( this._health === 0 ){
            this.gameOver();
        }
    }


    gameOver(){
        this.lbGameOver.active = true;
        this.getComponent(InputManager).pauseInput( true );
        this.unschedule( this._updateTimeCount );
        this.unschedule( this._updateFever );
    }
}
