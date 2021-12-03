
import { _decorator, Component, Node, CCObject, find } from 'cc';
import { CharacterController } from './CharacterController';
import { Player } from './Player';
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

    @property(Node)
    monsterAnchor : Node = null!;


    onLoad(){

    }

    start () {
        // [3]
    }




    getInput( input : number ){

        switch ( input ){
            case 0:
                this.player.attack(true);
                break;
            case 1:
                this.player.attack(false);
                break;
        }

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
