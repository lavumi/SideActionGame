
import { _decorator, Component, Node, systemEvent, SystemEvent, EventKeyboard, KeyCode, tween, find} from 'cc';
const { ccclass, property } = _decorator;


import { GameManager } from './GameManager';
/**
 * Predefined variables
 * Name = InputManager
 * DateTime = Fri Dec 03 2021 16:42:25 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = InputManager.ts
 * FileBasenameNoExtension = InputManager
 * URL = db://assets/scripts/InputManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('InputManager')
export class InputManager extends Component {

    _pressA : boolean = false;
    _pressB : boolean = false;


    gameMamager : GameManager = null!;


    _leftPanel : Node = null!;
    _rightPanel : Node = null!;

    _inputDelay : number = 5;
    _blockInput : boolean = false;

    start () {

        this.gameMamager = find("GameManager").getComponent(GameManager);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this._leftPanel.on('click' , this.gameMamager.getInput , this.gameMamager );
        // this._rightPanel.on('click' , this.gameMamager.getInput , this.gameMamager);
    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    onKeyDown(event : EventKeyboard) {
        if ( this._blockInput === true ) return;
        switch(event.keyCode) {
            case KeyCode.ARROW_LEFT:
                if ( this._pressA === false ){
                    this._sendInput(0);
                }
                this._pressA = true;
                this.blockInput();
                
                break;
            case KeyCode.ARROW_RIGHT:
                if ( this._pressB === false ){
                    this._sendInput(1);
                }
                this._pressB = true;
                this.blockInput();
                break;
        }

        
    }

    onKeyUp (event : EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this._pressA = false;
                break;
                case KeyCode.ARROW_RIGHT:
                this._pressB = false;
                break;
        }

    }


    blockInput(){
        this._blockInput = true;
        tween( this.node )
        .delay(0.2)
        .call(()=>{ this._blockInput = false; })
        .start();
    }




    _sendInput( input : number ){
        this.gameMamager.getInput( input );
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
