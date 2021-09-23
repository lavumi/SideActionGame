
const {ccclass, property} = cc._decorator;
import GameManager from "./GameManager"

@ccclass
export default class InputManager extends cc.Component {




    _pressA : boolean = false;
    _pressB : boolean = false;


    gameMamager : GameManager = null!;


    _leftPanel : cc.Node = null!;
    _rightPanel : cc.Node = null!;

    onLoad () {

        this.gameMamager = this.getComponent("GameManager");

        this._leftPanel = cc.find("InputPanelLeft");
        this._rightPanel = cc.find("InputPanelRight");




    }

    start () {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);


            cc.log("init event "); 
            this._leftPanel.on('click' , this.gameMamager.leftAction , this.gameMamager );
            this._rightPanel.on('click' , this.gameMamager.rightAction , this.gameMamager);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    onKeyDown(event : cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                if ( this._pressA === false ){
                    this.gameMamager.leftAction();
                }
                this._pressA = true;
                break;
            case cc.macro.KEY.right:
                if ( this._pressB === false ){
                    this.gameMamager.rightAction();
                }
                this._pressB = true;
                break;
        }
    }

    onKeyUp (event : cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._pressA = false;
                break;
            case cc.macro.KEY.right:
                this._pressB = false;
                break;
        }

    }

}
