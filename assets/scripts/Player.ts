
import { _decorator, Component, Node, find, AnimationComponent, log , Animation } from 'cc';
import { DIRECTION } from './Enum';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Player
 * DateTime = Fri Dec 03 2021 16:49:12 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = Player.ts
 * FileBasenameNoExtension = Player
 * URL = db://assets/scripts/Player.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Player')
export class Player extends Component {



    _animation : AnimationComponent = null!;

    onLoad(){
        this._animation = find('character' , this.node ).getComponent(AnimationComponent);
        this._animation.on( Animation.EventType.FINISHED , this.onAnimFinishedCallback, this);
    }


    //#region [ANIMATION]
    ANIM = {
        ATTACK_0 : "character_attack_01",
        ATTACK_1 : "character_attack_02",
        ATTACK_2 : "character_attack_03",
        IDLE : "character_idle",
        DAMAGE : "character_damaged",
    }

    _atkAnimationInterval : number = 0.2;
    _actionTimeout : number = -1;
    _atkAnimCounter : number = 0;

    attack( attackDirection : DIRECTION){
        if ( attackDirection === DIRECTION.LEFT )
            this.node.setScale(-1,1 );
        else
            this.node.setScale(1,1 );
        this._playAtkAnim();
    }

    damaged( enemyDirection : DIRECTION){
        this.attack( enemyDirection * -1 );
        
        this.scheduleOnce(()=>{
            if ( enemyDirection === DIRECTION.LEFT )
                this.node.setScale(-1,1 );
            else
                this.node.setScale(1,1 );
            this._animation.play( this.ANIM.DAMAGE );

            this._resetAttackAnimation();
        }, 0.15)
    }

    _playAtkAnim(){
        this._animation.play(this.ANIM["ATTACK_" + this._atkAnimCounter ] );
        this.unschedule( this._resetAttackAnimation );
        this._atkAnimCounter++;
        if ( this._atkAnimCounter > 2 ){
            this._atkAnimCounter = 0;
        }
    }


    onAnimFinishedCallback(){
        this._animation.play( this.ANIM.IDLE );
        this.scheduleOnce( this._resetAttackAnimation , this._atkAnimationInterval );
    }

    _resetAttackAnimation(){
        this._atkAnimCounter = 0;
    }



    //#endregion



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
