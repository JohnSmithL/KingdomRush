import GameActorStatusMachine, { GameActorStatusBase, GameActorStatusAttack } from "./GameActorStatusMachine";
import { GameDirection } from "./Config";
import Utils from "./Utils";
import SelectLevels from "./SelectLevels";
import GameEventListener from "./GameEventListener";

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
export default class GameActor extends GameEventListener {


    machine: GameActorStatusMachine = null;
    attackCoolDownTime: number = 1;
    attackAnimTotalTime: number = 1;

    @property(Number)
    attackKeyFrame: number = 7;

    @property(Number)
    attackRange: number = 400;

    @property(Number)
    power: number = 52;

    @property(Number)
    maxHealthPoint: number = 100;

    currentHealthPoint: number;

    onLoad() {
        super.onLoad();
        this.machine = new GameActorStatusMachine(this);
        this.currentHealthPoint = this.maxHealthPoint;
    }

    preferStatus(status: GameActorStatusBase) {

    }

    getEnemysInRange(): GameActor[] {
        let enemysInRange: GameActor[] = [];
        for (let i = 0, length = SelectLevels.getInstance().enemys.length; i < length; i++) {
            let enemy = SelectLevels.getInstance().enemys[i];
            let distance = Math.sqrt(Math.pow((enemy.node.x - this.node.x), 2) + Math.pow((enemy.node.y - this.node.y), 2));
            if (!enemy.isDie() && distance < this.attackRange) {
                enemysInRange.push(enemy);
            }
        }
        return enemysInRange;
    }

    // getEnemysInRange():GameActor[]{
    //     return null;
    // }

    update(dt: number) {
        this.machine.update(dt);
    }

    getEnemyDir(enemys: GameActor[]): GameDirection {
        let enemy = enemys[0]
        return Utils.getDir((enemy.node.position).sub(this.node.position))
    }

    // preferAnimFrame(sprite: cc.Sprite, frames: cc.SpriteFrame[], percent: number): cc.SpriteFrame {
    //     sprite.spriteFrame = frames[Math.floor(frames.length * percent)];
    //     return sprite.spriteFrame;
    // }

    attack() {
        let attackStatus = this.machine.currentStatus as GameActorStatusAttack;
        attackStatus.isAttacked = true;
        console.log("fire");
    }

    isDie(): boolean {
        return this.currentHealthPoint < 0;
    }

}
