
import { _decorator, Component, Node, CCObject, find, log } from 'cc';
import { MonsterController } from './MonsterController';
import { Player } from './Player';
import { DIRECTION } from './Enum';
import { GameUIController } from './GameUIController';
import { GamebaseWrapper } from './GamebaseWrapper';
const { ccclass, property } = _decorator;




/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Fri Dec 03 2021 16:42:31 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/scripts/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('GameManager')
export class GameManager extends Component {


    @property(Player)
    player : Player = null!;

    @property(MonsterController)
    monsterController : MonsterController = null!;

    @property(Node)



    feverFinishDelay = 0.3;
    gameRestartDelay = 1;




    gameUI : GameUIController = null!;
    // menuUI :



    //InGame Value
    _difficulty : number = 0;
    _score = 0;
    _fever = 0;
    _comboCount : number= 0;
    _maxCombo : number = 0;
    _timeCount : number = 30;
    _maxTimeCount : number = 30;
    _health = 3;
    _feverPerScore = 40;
    _insaneTimer = 0.2;



    _onGame : boolean =false;

    _feverMode : boolean = false;
    _blockInput : boolean = true;
    _blockInputFeverFinish : boolean = true;




    onLoad(){
        this.gameUI = find("Canvas/GameUI").getComponent(GameUIController);
    }

    start(){

        log("game start called");


        // GamebaseWrapper.setGameInit( ()=>{
        //     this.gameUI.initGameUI(3);
        // });
        // let ret = jsb.reflection.callStaticMethod(
        //     "NativeOcClass",
        //     "callNativeUIWithTitle:andContent:",
        //     "cocos2d-js testing",
        //     "GamebaseWrapper.gameInitFinished();"
        // )

        // log(ret );
    }


    startGame(diff : number){

        this.monsterController.initMonsters(diff);
        this.gameUI.node.active = true;
        this.gameUI.initGameUI(3);
        this._onGame = true;
    }


    getInput( input : number ){
        if ( this._onGame === false ) return;
        switch ( input ){
            case 0:
                this._attack( DIRECTION.LEFT);
                break;
            case 1:
                this._attack( DIRECTION.RIGHT);
                break;
        }
    }

    _attack( direction : number ){

        let monsterPosition = this.monsterController.getFrontMonsterPosition();
        if ( this._feverMode === true ){

            this.monsterController.attackMonster( monsterPosition , true )
            this.player.attack( monsterPosition  );


            this._attackSuccess();
        }
        else if ( this.monsterController.attackMonster( direction ) === true ){

            this.player.attack( direction );


            this._attackSuccess();
        }
        else {

            this.player.damaged( monsterPosition );
            this._attackFail();
        }

    }



    _attackSuccess(){
        this.gameUI.setScore(++this._score);


        this.gameUI.setComboCount(++this._comboCount);
        this._maxCombo = this._comboCount > this._maxCombo ? this._comboCount : this._maxCombo;


        this._fever += 1 / this._feverPerScore;
        this.gameUI.setFever( this._fever );
    }

    _attackFail(){
        this._comboCount = 0;
        this.gameUI.setComboCount(0);
        this.gameUI.setHeart( --this._health );


        this._timeCount -= 1;
    }



    update(dt : number ){

        if ( this._onGame === false ) {
            return;
        }

        this._updateTimer( dt);

        if ( this._health <= 0 ||
            this._timeCount <= 0) {
            this._gameOver();
        }

    }

    _updateTimer(dt : number ){
        this._timeCount -= dt;
        this.gameUI.setTimer( this._timeCount / this._maxTimeCount);
    }
    //
    // feverOn(){
    //     this._feverMode = true;
    //     this.gameUI.setFeverMode();
    //     this.unschedule( this._updateTimer );
    //
    //     // this._timeCount--;
    //     // this._updateTimeCount();
    //
    //     this.schedule( this._updateFever  );
    // }
    //
    // _updateFever( dt : number){
    //     this._fever -= dt * 0.4;
    //     this.gameUI.updateFever( this._fever );
    //     if ( this._fever <= 0){
    //         this.unschedule( this._updateFever );
    //         this.finishFever();
    //     }
    // }
    //
    // finishFever(){
    //     cc.log("fever finished" , "block inpug");
    //     this._feverMode = false;
    //     this._blockInputFeverFinish = true;
    //
    //
    //     //몬스터 싹 날리기
    //     this._monsterArr.forEach( element =>{
    //         element.damaged( true );
    //     });
    //     this._monsterDirectionArray.length = 0;
    //     this._monsterArr.length = 0;
    //     //
    //
    //
    //
    //     this._gameUI.finishFeverMode( this.feverFinishDelay , this.gameRestartDelay );
    //
    //
    //
    //
    //     cc.tween( this.node )
    //         .delay( this.feverFinishDelay )
    //         .call(()=>{
    //             for ( let i = 0 ; i < this._monsterCount ; i ++ ){
    //                 this.makeNewMonster();
    //             }
    //         })
    //         .delay( this.gameRestartDelay )
    //         .call( ()=>{
    //             this.schedule( this._updateTimer );
    //             this._blockInputFeverFinish = false;
    //             this.setInsaneTimer();
    //         })
    //         .start();
    // }

    _gameOver(){
        this.unschedule( this._updateTimer );
        this._onGame = false;
    }


}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
