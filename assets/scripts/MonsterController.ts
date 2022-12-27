
import { _decorator, Component, Node, Prefab, instantiate, tween, Vec2, v2, log, Vec3, v3 } from 'cc';
import { Monster } from './Monster';
import { DIRECTION } from './Enum';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MonsterController
 * DateTime = Fri Dec 03 2021 17:44:20 GMT+0900 (Korean Standard Time)
 * Author = Hexion
 * FileBasename = MonsterController.ts
 * FileBasenameNoExtension = MonsterController
 * URL = db://assets/scripts/MonsterController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('MonsterController')
export class MonsterController extends Component {


    @property(Prefab)
    monsterPrefab = null!;

    @property
    difficulty = 0;


    _monsterCounter: number = 0;
    _maxMonster : number = 5;
    _monsterDistance : number = 64;
    _monsterContainer : Monster[] = [];

    _monsterPosition : DIRECTION[] = [];

    start () {
        this._monsterContainer.length = 0;
        this._monsterPosition.length = 0;
    }



    initMonsters( diff : number ){
        this.difficulty = diff;
        for ( let i = 0 ; i < 5 ; i ++ ){
            this.makeNewMonster();
        }
    }

    makeNewMonster(){

        let direction : DIRECTION = DIRECTION.LEFT;
        let rnd = Math.floor(Math.random() * 2);
        if ( rnd === 1 ) direction = DIRECTION.RIGHT;

        let monsterNode = instantiate(this.monsterPrefab);
        let monster : Monster = monsterNode.getComponent(Monster);
        this.node.addChild( monsterNode );


        this._monsterContainer.push(monster);
        this._monsterPosition.push( direction );


        let initPos = v3(this._monsterDistance * 7 *  direction , 0 ,1);
        let moveTargetPos = v3(this._monsterContainer.length * this._monsterDistance *  direction , 0 ,1);

        monster.initMonster( initPos , moveTargetPos , direction ,this.difficulty);
    }


    getFrontMonsterPosition() : DIRECTION {
        return this._monsterPosition[0];
    }


    attackMonster( direction : DIRECTION , isFever? : boolean) : boolean{
        if ( this.getFrontMonsterPosition() === direction ){
            let dead = this._monsterContainer[0].damaged( isFever === true ? 3 : 1 );
            if ( dead ){
                this._monsterDead();
            }
            return true;
        }
        else {
            return false;
        }
    }

    _monsterDead(){
        this._monsterPosition.splice(0,1);
        this._monsterContainer.splice(0,1);

        this._monsterContainer.forEach( (monster, index) =>{
            let targetPos = new Vec3( (index+1) * this._monsterDistance * this._monsterPosition[ index ] , 0 , 0);
            monster.stepForward( targetPos );
        });
        this.makeNewMonster();
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
