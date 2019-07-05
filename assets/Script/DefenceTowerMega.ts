import GameActor from "./GameAcotr";
import { GameActorStatusBase, GameActorStatusAttack, GameActorStatusType } from "./GameActorStatusMachine";
import { GameDirection } from "./Config";
import Utils from "./Utils";
import GameFlyObject from "./GameFlyObject";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DefenceTowerMega extends GameActor {

    @property(cc.Prefab)
    prefabFlyObject: cc.Prefab = null;

    @property(cc.Sprite)
    spTower: cc.Sprite = null;

    @property(cc.Sprite)
    spMegaShooter: cc.Sprite = null;

    @property(cc.SpriteFrame)
    sfMegaIdleFront: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sfMegaIdleBack: cc.SpriteFrame = null;

    @property([cc.SpriteFrame])
    sfMegaAttackFronts: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfMegaAttackBacks: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    sfTowerIdle: cc.SpriteFrame = null;

    @property([cc.SpriteFrame])
    sfTowerAttacks: cc.SpriteFrame[] = [];


    preferStatus(status: GameActorStatusBase) {
        if (status.status = GameActorStatusType.Attack) {
            let attackStatus = status as GameActorStatusAttack;
            let percent = status.statusTime / this.attackAnimTotalTime;
            let frames = attackStatus.dir == GameDirection.Up ? this.sfMegaAttackBacks : this.sfMegaAttackFronts;
            let currentFrame = Utils.preferAnimFrame(this.spMegaShooter, frames, percent);
            if (!attackStatus.isAttacked && currentFrame == frames[this.attackKeyFrame]) {
                this.attack();
            }

        }


    }

    getEnemyDir(enemys: GameActor[]): GameDirection {
        let enemy = enemys[0];
        if (enemy.node.y > this.node.y) {
            return GameDirection.Up;
        } else {
            return GameDirection.Down;
        }
    }

    attack() {
        super.attack();
        let enemys = this.getEnemysInRange();

        if (enemys && enemys.length > 0) {
            let flyObject = cc.instantiate(this.prefabFlyObject).getComponent("GameFlyObject") as GameFlyObject;
            flyObject.node.parent = this.node.parent;
            flyObject.node.position = cc.v2(this.node.x, this.node.y + 50);
            flyObject.startFly(enemys[0],this);
        }

    }

}
