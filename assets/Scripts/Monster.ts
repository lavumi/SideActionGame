// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    health : number = 1;

    lbHealth : cc.Label = null!;
    hp : cc.Node[] = [];

    init( health : number, direction : boolean ){
        this.node.scale = 1;
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
        if ( health === 2 ){
            this.node.color = cc.Color.GREEN;
            this.hp[0].color = cc.Color.GREEN;
            this.hp[1].color = cc.Color.GREEN;
            this.hp[2].color = cc.Color.GREEN;
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = false;
        }
        if ( health === 3 ){
            this.node.color = cc.Color.BLUE;
            this.hp[0].color = cc.Color.BLUE;
            this.hp[1].color = cc.Color.BLUE;
            this.hp[2].color = cc.Color.BLUE;
            this.hp[0].active = true;
            this.hp[1].active = true;
            this.hp[2].active = true;
        }

        this.health = health;

        this.lbHealth = cc.find( "lbHealth" , this.node ).getComponent(cc.Label);
        this.lbHealth.string = this.health + "";





    }


    damaged(){
        this.health--;
        this.lbHealth.string = this.health + "";
        this.hp[this.health].active = false;
        if ( this.health === 0 ){
            this.node.removeFromParent();
            return true;
        }
        else {
            return false;
        }

    }
}
