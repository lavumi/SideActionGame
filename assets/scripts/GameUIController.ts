
import { _decorator, Component, Node, ProgressBar, Label, find } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameUIController
 * DateTime = Sat Dec 04 2021 01:09:53 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = GameUIController.ts
 * FileBasenameNoExtension = GameUIController
 * URL = db://assets/scripts/GameUIController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GameUIController')
export class GameUIController extends Component {

    _gameTimer : ProgressBar = null!;
    _feverGauge : ProgressBar = null!;
    _hearts : Node[] = [];
    _lbScore : Label = null!;
    _lbCombo : Label = null!;


    onLoad(){
        this._gameTimer = find("GameTimer" , this.node ).getComponent(ProgressBar);
        this._feverGauge = find("PlayerStatus/FeverGauge" , this.node ).getComponent(ProgressBar);

        this._hearts = find("PlayerStatus/HeartContainer", this.node ).children;
        this._lbScore = find("lbScore" , this.node ).getComponent(Label);
        this._lbCombo = find("lbCombo/lbComboNumber1" , this.node ).getComponent(Label);

    }



    initGameUI( heart : number ){
        this.setTimer(1);
        this.setFever(0);
        this.setScore(0);
        this.setComboCount( 0 );
        this.setHeart( heart );
    }

    setTimer( time : number ){
        this._gameTimer.progress = time;
    }

    setFever( fever : number ){
        this._feverGauge.progress = fever;
    }

    setScore( score : number ){
        this._lbScore.string = score.toString();
    }

    setComboCount ( combo : number ){
        this._lbCombo.string = combo.toString();
        if ( combo === 0 )
            this._lbCombo.node.parent.active = false;
        else {
            this._lbCombo.node.parent.active = true;
        }
    }

    setHeart( heart : number ){
        
        this._hearts.forEach((heartNode, index)=>{
            if ( index < heart ){
                heartNode.active = true;
            }
            else {
                heartNode.active = false;
            }
        })
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
