// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    _animation : cc.Animation = null!
    _animationName : string[] = [
        'characterIdle',
        'characterAtk1',
        'characterAtk2',
        'characterAtk3'
    ];

    //테스트용 임시 변수
    _baseScale : number = 0.5;
    _currentAtkAnim : number = 0;



    _atkAnimationInterval : number = 0.2;
    _actionTimeout : number = -1;

    onLoad(){
        this._animation = this.getComponent(cc.Animation);
        this._animation.on( 'finished' , this.onAnimFinishedCallback, this);
    }

    init(){

    }


    leftAction(){
        this.node.scaleX = this._baseScale * -1;

        this._playAtkAnim();
    }

    rightAction(){
        this.node.scaleX = this._baseScale;
        this._playAtkAnim();
    }

    _playAtkAnim(){
        this._currentAtkAnim++;
        if ( this._currentAtkAnim > 3 ){
            this._currentAtkAnim = 1;
        }
        clearTimeout(this._actionTimeout);
        this._actionTimeout = -1;
        // cc.log('Player.ts(57)' , 'characterAtk' + this._currentAtkAnim );
        this._animation.play('characterAtk' + this._currentAtkAnim );
    }

    onAnimFinishedCallback(){
        this._actionTimeout = setTimeout( ()=>{
            this._animation.play('characterIdle');
            this._currentAtkAnim = 0;
            this._actionTimeout = -1;
        } , this._atkAnimationInterval * 1000);
    }
}
