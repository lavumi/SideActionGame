// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameUIController from "./GameUIController";
import ScoreUIController from "./ScoreUIController"
import Monster from "./Monster";
import Player from "./Player";
const {ccclass, property} = cc._decorator;



enum DIRECTION {
    LEFT = -1,
    RIGHT = 1,
}
@ccclass
export default class GameManager extends cc.Component {

    feverFinishDelay = 0.3;
    gameRestartDelay = 1;





    _menuUI : cc.Node = null!;
    _btnDiff : cc.Node[] = [];

    _gameUI : GameUIController = null!;
    _scoreUI : ScoreUIController = null!;


    //InGame Value
    _difficulty : number = 0;
    _score = 0;
    _fever = 0;
    _comboCount : number= 0;
    _maxCombo : number = 0;
    _timeCount : number = 30;
    _health = 3;
    _feverPerScore = 99;
    _insaneTimer = 0.2;
    _feverMode : boolean = false;

    _blockInput : boolean = false;



    @property(Player)
    player : Player = null!;
    @property(cc.Prefab)
    monsterPrefab : cc.Prefab = null!;



    //GameNode
    _testMonsterAr : number[] = [];
    _monsterArr : Monster[] = [];

    _monsterCount : number = 4;

    onLoad(){
        this.initMenu();

        this._gameUI = cc.find("GameUI").getComponent(GameUIController);
        this._scoreUI = cc.find("ScoreUI").getComponent(ScoreUIController);


        // this.showMain();
    }



    start(){
        // this.showResult();
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

    showMain(){
        this.resetGame();
        this._gameUI.node.active = false;
        this._menuUI.active = true;
        this._scoreUI.node.active = false;
    }

    showResult(){
        this._gameUI.node.active = false;
        this._menuUI.active = false;
        this._scoreUI.node.active = true;
        this._scoreUI.showResult(this._score, this._maxCombo , this._health * 100);
    }

    restartGame(){
        this.resetGame();
        this.startGame( this._difficulty );
    }



    startGame( diff : number ){


        this._gameUI.node.active = true;
        this._menuUI.active = false;
        this._scoreUI.node.active = false;



        this._difficulty = diff;


        this._gameUI.initializeGame();
        this._gameUI.updateHealth(      this._health );
        this._gameUI.updateFever(       this._fever);
        this._gameUI.updateRemainTime(  this._timeCount);
        this._gameUI.updateScore(       this._score );
        this._gameUI.updateCombo(       this._comboCount );


        for ( let i = 0 ; i < this._monsterCount ; i ++ ){
            this.makeNewMonster();
        }




        let countDown = 1;
        this._gameUI.startCountDown( countDown  , ()=>{
            this.setInsaneTimer();
            this._blockInput = false;
            this.schedule( this._updateTimeCount , 1 );
        });
    }


    resetGame(){
        this._difficulty = 0;
        this._score = 0;
        this._fever = 0;
        this._timeCount = 30;
        this._health = 3;
        this._feverPerScore = 10;
        this._comboCount = 0;
        this._maxCombo = 0;

        this._testMonsterAr.length = 0;
        this._monsterArr.forEach( element =>{
            element.node.removeFromParent();
        })
        this._monsterArr.length = 0;
    }

    _updateTimeCount(){
        this._timeCount--;
        this._gameUI.updateRemainTime( this._timeCount );
        if ( this._timeCount === 0 ){
            this.gameOver();
        }
    }

    leftAction(){
        if ( this._blockInput === true ) return;

        if ( this._testMonsterAr[0] === DIRECTION.LEFT  || this._feverMode ){
            this.player.leftAction();
            this.attackMonster();
        }
        else {
            this.damaged();
        }
    }

    rightAction(){
        if ( this._blockInput === true ) return;

        if ( this._testMonsterAr[0] === DIRECTION.RIGHT || this._feverMode ){
            this.player.rightAction();
            this.attackMonster();
        }
        else {
            this.damaged();
        }
    }


    attackMonster(){
        cc.log("attack monster " + this._feverMode );
        if ( this._monsterArr.length === 0 ) return; 

        if ( this._monsterArr[0].damaged( this._feverMode )  ){
            this._testMonsterAr.splice(0,1);
            this._monsterArr.splice(0,1);
            this.moveToCenter();
            this.makeNewMonster();
            this.score();
            this.addFever();
            this.setInsaneTimer();
        }

        this._maxCombo = this._maxCombo > this._comboCount ? this._maxCombo : this._comboCount;
        this._gameUI.updateCombo(       this._comboCount++ );
    }

    moveToCenter(){

        this._blockInput = true;
        for( let i = 0 ; i < this._testMonsterAr.length ; i ++ ){
            let targetPos = cc.v2((i + 1) * 100 *  this._testMonsterAr[i] , 0);
            cc.tween( this._monsterArr[i].node )
            .to( 0.1 , { position : targetPos})
            .start();
        }

        cc.tween( this.node )
        .delay(0.1)
        .call(()=>{ this._blockInput = false; })
        .start();
    }

    makeNewMonster(){
        let pos = Math.floor(Math.random() * 2);
        if ( pos === 0 ) pos = -1;
        let index = this._testMonsterAr.length;
        let monster = cc.instantiate(this.monsterPrefab);


        let moveTargetPos = cc.v2((index + 1) * 100 *  pos , 0 );
        monster.setPosition( 5 * 100 *  pos , 0 );

        cc.tween( monster )
        .to( 0.3 , {position : moveTargetPos} )
        .start();

        this.node.addChild( monster );
        this._testMonsterAr.push( pos );
        this._monsterArr.push(monster.getComponent(Monster));

        monster.getComponent(Monster).init( pos === DIRECTION.LEFT , this._difficulty);
    }

    setInsaneTimer(){
        if ( this._difficulty === 3)
            this._monsterArr[0].startInsaneTimer();
    }


    score(){
        this._score++;
        this._gameUI.updateScore( this._score );
    }

    addFever(){
        if ( this._feverMode === true ) return;
        this._fever += 1 / this._feverPerScore;


        this._gameUI.updateFever( this._fever );
        if ( this._fever >= 1) {
            // this.feverOn();
        }
    }

    feverOn(){
        this._feverMode = true;
        this._gameUI.setFeverMode();
        this.schedule( this._updateFever  );
        cc.log("fever start ");
    }



    damaged(){
        this._health--;
        if ( this._health <= 0 ){
            this.gameOver();
        }

        this._gameUI.updateHealth( this._health );


        this._comboCount = 0;
        this._gameUI.updateCombo(       this._comboCount );
        cc.log( this._health );

    }


    gameOver(){
        this._blockInput = true;
        this._monsterArr[0].pauseTimer();
        this._gameUI.gameOver();
        this.unschedule( this._updateTimeCount );
        this.unschedule( this._updateFever );


        setTimeout( ()=>{
            this.showResult();
        } , 1500 );
    }




    _updateFever( dt : number){
        this._fever -= dt * 0.4;
        this._gameUI.updateFever( this._fever );
        if ( this._fever <= 0){
            this.unschedule( this._updateFever );
            this.finishFever();
        }
    }

    finishFever(){
        cc.log("fever finished");
        this._feverMode = false;
        this._blockInput = true;

        //몬스터 싹 날리기
        this._monsterArr.forEach( element =>{
            element.damaged( this._feverMode );
        });
        this._testMonsterAr.length = 0;
        this._monsterArr.length = 0;




        this._gameUI.finishFeverMode( this.feverFinishDelay , this.gameRestartDelay );




        cc.tween( this.node )
        .delay( this.feverFinishDelay )
        .call(()=>{
            for ( let i = 0 ; i < this._monsterCount ; i ++ ){
                this.makeNewMonster();
            }
        })
        .delay( this.gameRestartDelay )
        .call( ()=>{
            this._blockInput = false;
        })
        .start();
    }



}
