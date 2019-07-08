import GameEventListener from "./GameEventListener";
import GameActor from "./GameAcotr";
import Utils from "./Utils";
import { GameEventHit } from "./GameEventDefine";
import GameEventDispatcher from "./GameEventDispatcher";
import GamePoolManager, { PoolType } from "./GamePoolManager";

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
const POOLTYPEENUM = cc.Enum(PoolType);

@ccclass
export default class GameFlyObject extends GameEventListener {

    @property(cc.Sprite)
    spImage: cc.Sprite = null;

    @property([cc.SpriteFrame])
    sfFlys: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    sfExplosion: cc.SpriteFrame[] = [];

    @property({type:POOLTYPEENUM})
    flyObjectType:PoolType = PoolType.None;

    target: GameActor = null;
    trigger: GameActor = null;

    speed: number = 1000;
    statusTime: number = 0;
    flyAnimTotalTime: number = 0.5;
    explosionAnimTime: number = 0.5;

    statusType: GameFlyObjectStatus = GameFlyObjectStatus.None;


    startFly(target: GameActor, trigger: GameActor) {
        this.target = target;
        this.trigger = trigger;
        this.statusType = GameFlyObjectStatus.Fly;
        this.statusTime = 0;

    }

    update(dt: number) {
        this.statusTime += dt;

        if (this.statusType === GameFlyObjectStatus.Fly) {
            let percent = (this.statusTime / this.flyAnimTotalTime) % 1;
            Utils.preferAnimFrame(this.spImage, this.sfFlys, percent);

            let dir = (this.target.node.position).sub(this.node.position);
            dir.normalizeSelf();

            let angle = cc.misc.radiansToDegrees(dir.signAngle(cc.v2(1, 0)));
            this.node.rotation = angle;

            let currentpos = this.node.position;
            let speed = this.speed;
            this.node.x = cc.misc.clampf(currentpos.x + dir.x * dt * speed,
                Math.min(currentpos.x, this.target.node.x), Math.max(currentpos.x, this.target.node.x));
            this.node.y = cc.misc.clampf(currentpos.y + dir.y * dt * speed,
                Math.min(currentpos.y, this.target.node.y), Math.max(currentpos.y, this.target.node.y));

            if (this.node.x == this.target.node.x && this.node.y == this.target.node.y) {
                this.statusTime = 0;
                this.statusType = GameFlyObjectStatus.Explosion;

                let event = new GameEventHit;
                event.beHitter = this.target;
                event.hitter = this.trigger;
                GameEventDispatcher.getInstance().disPatchEvent(event);
            }
        }

        if (this.statusType === GameFlyObjectStatus.Explosion) {
            let percent = (this.statusTime / this.explosionAnimTime);
            Utils.preferAnimFrame(this.spImage, this.sfExplosion, percent);
            if (percent > 1) {
                this.node.removeFromParent(false);
                GamePoolManager.getInstance().recycleObject(this.flyObjectType,this.node);
                // this.node.destroy();
                // this.node.removeFromParent(true);
            }

        }
    }
}

export enum GameFlyObjectStatus {
    None,
    Fly,
    Explosion,
}
