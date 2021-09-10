
const {ccclass, property} = cc._decorator;

@ccclass
export default class InputManager extends cc.Component {




    _pressA : boolean = false;
    _pressB : boolean = false;


    _pause : boolean = false;
    gameMamager : any = null!;


    onLoad () {

        this.gameMamager = this.getComponent("GameManager");
    }

    start () {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    pauseInput( pause : boolean ){
        this._pause = pause;
    }


    onKeyDown(event : cc.Event.EventKeyboard) {
        if ( this._pause ) return;
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

    lateUpdate (dt : number) {

    }
}
