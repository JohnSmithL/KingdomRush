import TowerCreator, { TowerCreatorStatus } from "./TowerCreator";
import { DefenceTowerType } from "./Config";
import GameWalker from "./GameWalker";
import { GameActorStatusWalk } from "./GameActorStatusMachine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Prefab)
    // Tower:cc.Prefab = null;

    @property(cc.Prefab)
    prefabEnemy0:cc.Prefab = null;
    


    onLoad () {
        // let towerCreator = cc.instantiate(this.Tower).getComponent<TowerCreator>(TowerCreator);
        // towerCreator.node.parent = this.node;
        // towerCreator.setStatus(TowerCreatorStatus.Common);

        let enemy = cc.instantiate(this.prefabEnemy0).getComponent<GameWalker>(GameWalker);
        enemy.node.parent = this.node;
        let walk = new GameActorStatusWalk;
        enemy.machine.onStatusChange(walk);
    }

}
