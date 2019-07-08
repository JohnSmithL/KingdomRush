import { GameDirection } from "./Config";
import GameActor from "./GameAcotr";
import GameWalker from "./GameWalker";
import Utils from "./Utils";
import { GameEventDie } from "./GameEventDefine";
import GameEventDispatcher from "./GameEventDispatcher";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class GameActorStatusMachine {

    actor: GameActor = null;
    currentStatus: GameActorStatusBase = null;

    constructor(actor: GameActor) {
        this.actor = actor;
    }


    onStatusChange(status: GameActorStatusBase) {
        if (this.currentStatus) {
            this.currentStatus.onExitStatus();
        }
        this.currentStatus = status;
        this.currentStatus.machine = this;
        this.currentStatus.onEnterStatus();

    }

    update(dt: number) {
        if (this.currentStatus) {
            this.currentStatus.update(dt);
        }
    }


}

export class GameActorStatusBase {
    status: GameActorStatusType = GameActorStatusType.None;
    machine: GameActorStatusMachine = null;

    statusTime: number = 0;

    onEnterStatus() {

    }

    onExitStatus() {
        this.machine = null;
    }

    update(dt: number) {
        this.statusTime += dt;
    }
}

export class GameActorStatusIdle extends GameActorStatusBase {
    status = GameActorStatusType.Idle;

    onEnterStatus() {
        this.machine.actor.preferStatus(this);
    }

    update(dt: number) {
        super.update(dt);
        let enemys = this.machine.actor.getEnemysInRange();
        if (enemys && enemys.length > 0 && this.statusTime > this.machine.actor.attackCoolDownTime) {
            let attack = new GameActorStatusAttack();
            this.machine.onStatusChange(attack);
            attack.dir = attack.getEnemyDir(enemys);
        }

    }
}

export class GameActorStatusWalk extends GameActorStatusBase {
    status = GameActorStatusType.Walk;
    paths: cc.Vec2[];
    currentPathPointIndex: number = 0;
    nextPathPoint: cc.Vec2;
    moveDir: cc.Vec2;
    dir: GameDirection;

    onEnterStatus() {
        this.paths = (this.machine.actor as GameWalker).getPaths();
        this.currentPathPointIndex = 0;
        this.goToNextPoint();

    }

    goToNextPoint() {
        this.nextPathPoint = this.getNextPathPoint();

        if (this.nextPathPoint) {
            this.moveDir = this.nextPathPoint.sub(this.machine.actor.node.position);
            this.moveDir.normalizeSelf;
            this.dir = this.getDir(this.machine.actor.node.position, this.nextPathPoint);
            this.currentPathPointIndex++;
        }
    }

    getDir(from: cc.Vec2, to: cc.Vec2): GameDirection {
        // let standrad: cc.Vec2 = cc.v2(1, 0);
        // let compare: cc.Vec2 = to.sub(from);
        // let angle = cc.misc.radiansToDegrees(standrad.signAngle(compare));
        // console.log(angle);
        // if (angle > 360) {
        //     angle -= 360;
        // } else if (angle < 0) {
        //     angle += 360;
        // }

        // if (angle > 45 && angle <= 135) {
        //     return GameDirection.Up;
        // } else if (angle > 135 && angle <= 225) {
        //     return GameDirection.Left;
        // } else if (angle > 225 && angle <= 315) {
        //     return GameDirection.Down;
        // } else {
        //     return GameDirection.Right;
        // }
        return Utils.getDir(to.sub(from));
    }

    getNextPathPoint(): cc.Vec2 {
        if (this.currentPathPointIndex + 1 < this.paths.length) {
            return this.paths[this.currentPathPointIndex + 1];

        }
        return null;

    }

    update(dt: number) {
        super.update(dt);

        if (this.machine.actor.isDie()) {
            let die = new GameActorStatusDie();
            this.machine.onStatusChange(die);
            return;
        }
        this.machine.actor.preferStatus(this);

        if (!this.nextPathPoint) {
            return;
        }
        let currentpos = this.machine.actor.node.position;
        let speed = (this.machine.actor as GameWalker).speed;
        this.machine.actor.node.x = cc.misc.clampf(currentpos.x + this.moveDir.x * dt * speed,
            Math.min(currentpos.x, this.nextPathPoint.x), Math.max(currentpos.x, this.nextPathPoint.x));
        this.machine.actor.node.y = cc.misc.clampf(currentpos.y + this.moveDir.y * dt * speed,
            Math.min(currentpos.y, this.nextPathPoint.y), Math.max(currentpos.y, this.nextPathPoint.y));

        if (this.machine.actor.node.x == this.nextPathPoint.x && this.machine.actor.node.y == this.nextPathPoint.y) {
            this.goToNextPoint();
        }
    }
}

export class GameActorStatusAttack extends GameActorStatusBase {
    status = GameActorStatusType.Attack;
    dir: GameDirection;
    isAttacked: boolean = false;

    onEnterStatus() {
        super.onEnterStatus();
    }

    update(dt: number) {
        super.update(dt);
        this.machine.actor.preferStatus(this);
        let percent = this.statusTime / this.machine.actor.attackAnimTotalTime;

        if (percent >= 1) {
            let idle = new GameActorStatusIdle;
            this.machine.onStatusChange(idle);
        }
    }

    getEnemyDir(enemys: GameActor[]): GameDirection {
        return this.machine.actor.getEnemyDir(enemys);
    }
}

export class GameActorStatusDie extends GameActorStatusBase {
    status = GameActorStatusType.Die;

    onEnterStatus() {
        let dieEvent = new GameEventDie;
        dieEvent.actor = this.machine.actor;
        GameEventDispatcher.getInstance().disPatchEvent(dieEvent);
    }

    update(dt: number) {
        super.update(dt);
        this.machine.actor.preferStatus(this);
        if (this.statusTime > 2) {
            this.machine.actor.node.destroy();
            // this.machine.actor.node.removeFromParent(true);
        }

    }
}

export enum GameActorStatusType {
    None,
    Idle,
    Walk,
    Attack,
    Die,
}
