
import { _decorator, Component, Node, CCObject, find, log } from 'cc';
import { MonsterController } from './MonsterController';
import { Player } from './Player';
import { DIRECTION } from './Enum';
import { GameUIController } from './GameUIController';
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

    feverFinishDelay = 0.3;
    gameRestartDelay = 1;




    gameUI : GameUIController = null!;



    //InGame Value
    _difficulty : number = 0;
    _score = 0;
    _fever = 0;
    _comboCount : number= 0;
    _maxCombo : number = 0;
    _timeCount : number = 30;
    _maxTimeCount : number = 30;
    _health = 3;
    _feverPerScore = 99;
    _insaneTimer = 0.2;



    _onGame : boolean =false;

    _feverMode : boolean = false;
    _blockInput : boolean = true;
    _blockInputFeverFinish : boolean = true;




    onLoad(){
        this.gameUI = find("Canvas/GameUI").getComponent(GameUIController);
    }
    
    start(){

        this.monsterController.initMonsters();
        this.gameUI.initGameUI(3);

        this.schedule( this._updateTimer );
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



    _gameOver(){
        // this._timeCount = 0;
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
