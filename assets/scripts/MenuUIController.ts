
import { _decorator, Component, Node, Button, find , Event} from 'cc';
import {GameManager} from "db://assets/scripts/GameManager";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MenuUIController
 * DateTime = Tue Dec 27 2022 21:18:10 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = MenuUIController.ts
 * FileBasenameNoExtension = MenuUIController
 * URL = db://assets/scripts/MenuUIController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('MenuUIController')
export class MenuUIController extends Component {


    _gameUI : GameManager = null!;
    _btnEasy    :Button = null!;
    _btnNormal  :Button = null!;
    _btnHard    :Button = null!;
    _btnHell    :Button = null!;

    onLoad(){
        this._gameUI =find("GameManager").getComponent(GameManager);

        this._btnEasy = find("btnEasy" , this.node ).getComponent(Button);
        this._btnNormal = find("btnNormal" , this.node ).getComponent(Button);
        this._btnHard = find("btnHard" , this.node ).getComponent(Button);
        this._btnHell = find("btnHell" , this.node ).getComponent(Button);

        this._btnEasy.node.on(Button.EventType.CLICK, this.startEasy, this);
        this._btnNormal.node.on(Button.EventType.CLICK, this.startNormal, this);
        this._btnHard.node.on(Button.EventType.CLICK, this.startHard, this);
        this._btnHell.node.on(Button.EventType.CLICK, this.startHell, this);
    }


    startEasy(){

        this._gameUI.startGame(0)
        this.node.active = false;
    }

    startNormal(){
        this._gameUI.startGame(1)
        this.node.active = false;
    }

    startHard(){
        this._gameUI.startGame(2)
        this.node.active = false;
    }

    startHell(){
        this._gameUI.startGame(3)
        this.node.active = false;
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
