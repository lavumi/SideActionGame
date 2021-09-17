// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    health : number = 1;

    lbHealth : cc.Label = null!;
    hp : cc.Node[] = [];

    _atkTimer : cc.ProgressBar = null!;


    gameManager : GameManager = null!;

    onLoad(){
        this._atkTimer = cc.find('atkTimer', this.node).getComponent(cc.ProgressBar);
        this._atkTimer.node.active = false;

        this.gameManager = cc.find("GameManager").getComponent(GameManager);
    }

    init( direction : boolean  , difficulty : number){

        let rnd = difficulty === 0 ? 2 : 3;
        let health = Math.floor(Math.random() * rnd ) + 1;


        if ( direction ){
            this.node.scaleX = -1;
        }


        this.hp.push( this.node.children[1]);
        this.hp.push( this.node.children[2]);
        this.hp.push( this.node.children[3]);


        if ( health === 1 ){
            this.node.color = cc.Color.RED;
            this.hp[0].color = cc.Color.RED;
            this.hp[1].color = cc.Color.RED;
            this.hp[2].color = cc.Color.RED;
            this.hp[0].active = true;
            this.hp[1].active = false;
            this.hp[2].active = false;
        }
        else if ( health === 2 ){
            this.node.color = cc.Color.GREEN;
            this.hp[0].color = cc.Color.GREEN;
            this.hp[1].color = cc.Color.GREEN;
            this.hp[2].color = cc.Color.GREEN;
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = false;
        }
        else if ( health === 3 ){
            this.node.color = cc.Color.BLUE;
            this.hp[0].color = cc.Color.BLUE;
            this.hp[1].color = cc.Color.BLUE;
            this.hp[2].color = cc.Color.BLUE;
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
            this._atkTimer.node.active =true;
        }

        this.health = health;

        this.lbHealth = cc.find( "lbHealth" , this.node ).getComponent(cc.Label);
        this.lbHealth.string = this.health + "";



    }


    damaged() : boolean {
        this.health--;
        this.lbHealth.string = this.health + "";
        this.hp[this.health].active = false;

        this._atkTimerCur = this._atkTimerBase;


        if ( this.health === 0 ){
            this.node.removeFromParent();
            return true;
        }
        else {
            return false;
        }

    }



    _atkTimerCur : number = 99;
    _atkTimerBase : number = 0.5;
    startInsaneTimer(){
        this._atkTimer.node.active = true;
        this._atkTimerCur = this._atkTimerBase;
        this.schedule( this._insaneModeTimer , 0 );
    }

    _insaneModeTimer( dt : number ){
        this._atkTimerCur -= dt ;
        this._atkTimer.progress = this._atkTimerCur / this._atkTimerBase;
        if ( this._atkTimerCur <= 0 ){
            this._atkTimerCur = this._atkTimerBase;
            this._attack();
        }
    }

    _attack(){
        // cc.log('Monster.ts(118)' , "_attack" );
        this.gameManager.damaged();
    }

    pauseTimer(){
        this.unschedule( this._insaneModeTimer );
        // this._atkTimer.node.active = false;
    }
}
