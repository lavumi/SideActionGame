
import { _decorator, Component, Node, CCObject, Vec3, tween, Color, Animation, find, ProgressBar, Sprite, v2, v3, UIOpacityComponent } from 'cc';
import { DIRECTION } from './Enum';
import { GameManager } from './GameManager';
import GlobalVariables from './GlobalVariables';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Monster
 * DateTime = Fri Dec 03 2021 17:43:41 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = Monster.ts
 * FileBasenameNoExtension = Monster
 * URL = db://assets/scripts/Monster.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Monster')
export class Monster extends Component {
    colorArr: Color[] = [
        new Color(255,255,255),
        new Color(171,251,255),
        new Color(255,171,1),
    ];


    health : number = 1;

    hp : Node[] = [];

    _atkTimer : ProgressBar = null!;


    gameManager : GameManager = null!;

    _characterNode : Sprite = null!;
    _animation : Animation = null!;


    _direction : DIRECTION = null!;

    onLoad(){
        this._atkTimer = find('atkTimer', this.node).getComponent(ProgressBar);
        this._atkTimer.node.active = false;


        this._characterNode = find("CharacterNode", this.node ).getComponent(Sprite);
        this.gameManager = find("GameManager").getComponent(GameManager);


        this._animation = this._characterNode.getComponent(Animation);
        this._animation.on( Animation.EventType.FINISHED , this.onAnimFinishedCallback, this);


    }

    initMonster( initPos : Vec3 , targetPos : Vec3 , direction : DIRECTION , difficulty : number){


        this._direction = direction;

        this.node.setScale(direction,1 );
        this.node.setPosition( initPos );
        tween( this.node )
        .to( 0.3 , {position : targetPos} )
        .start();


        let rnd = difficulty === 0 ? 2 : 3;
        let health = Math.floor(Math.random() * rnd ) + 1;

        let healthContainer = find("HealthContainer" , this.node );

        this.hp.push( healthContainer.children[0]);
        this.hp.push( healthContainer.children[1]);
        this.hp.push( healthContainer.children[2]);

        if ( health === 1 ){
            this._characterNode.color     = this.colorArr[0];
            this.hp[0].getComponent(Sprite).color    = this.colorArr[0];
            this.hp[1].getComponent(Sprite).color    = this.colorArr[0];
            this.hp[2].getComponent(Sprite).color    = this.colorArr[0];
            this.hp[0].active = true;
            this.hp[1].active = false;
            this.hp[2].active = false;
        }
        else if ( health === 2 ){
            this._characterNode.color     = this.colorArr[1];
            this.hp[0].getComponent(Sprite).color    = this.colorArr[1];
            this.hp[1].getComponent(Sprite).color    = this.colorArr[1];
            this.hp[2].getComponent(Sprite).color    = this.colorArr[1];
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = false;
        }
        else if ( health === 3 ){
            this._characterNode.color     = this.colorArr[2];
            this.hp[0].getComponent(Sprite).color    = this.colorArr[2];
            this.hp[1].getComponent(Sprite).color    = this.colorArr[2];
            this.hp[2].getComponent(Sprite).color    = this.colorArr[2];
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = true;
        }

        if ( difficulty >= 2 ){
            this.hp[0].active = false;
            this.hp[1].active = false;
            this.hp[2].active = false;
        }

        if ( difficulty >= 3 ){
            // this._atkTimer.node.active =true;
        }

        this.health = health;



        this._animation.play('monsterIdle');
    }


    damaged( damage : number ) : boolean {
        this.health-=damage;
        this.hp[this.health].active = false;

        if ( this.health <= 0   ){
            if ( this.health <= 0  ){
                this.dieAnimation();
            }
            return true;
        }
        else {
            tween(this.node)
            .delay(GlobalVariables.actionInverval)
            .call( ()=>{
                this._animation.play('monsterDamage');
            })
            .start();
            return false;
        }
    }

    dieAnimation(){
        find("HealthContainer" , this.node ).active = false;
        this._atkTimer.node.active = false;

        this._animation.play('monsterDead');

        let rnd = Math.random() * 300 + 200;

        let targetX = rnd * this._direction;
        let targetPosition= v3( targetX , 300 , 1);


        tween( this.node )
        .to( 0.8 , { position : targetPosition , angle : 1080})
        .removeSelf()
        .start();

        tween(this.node.getComponent(UIOpacityComponent))
        .to( 0.8 , {opacity :0 })
        .start();
        // this.node.removeFromParent();
    }


    stepForward( targetPos : Vec3){
        tween( this.node )
        .to( GlobalVariables.actionInverval , { position : targetPos})
        .start();
    }

    onAnimFinishedCallback(){
        this._animation.play( 'monsterIdle');
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
