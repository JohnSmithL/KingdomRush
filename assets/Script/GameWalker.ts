import { GameActorStatusBase, GameActorStatusType, GameActorStatusWalk } from "./GameActorStatusMachine";
import { GameDirection } from "./Config";
import GameActor from "./GameAcotr";
import Utils from "./Utils";

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
export default class GameWalker extends GameActor {
    @property(cc.Sprite)
    spWalker: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spWalkUp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkDown: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spWalkRight: cc.SpriteFrame[] = [];

    @property(Number)
    animWalkTotalTime: number = 1;

    @property(Number)
    speed: number = 0.5;

    paths:cc.Vec2[];


    onLoad() {
        super.onLoad();
    }

    preferStatus(status: GameActorStatusBase) {
        if (status.status == GameActorStatusType.Walk) {
            let walkStatus = status as GameActorStatusWalk;
            let percent = (walkStatus.statusTime / this.animWalkTotalTime) % 1;
            let spriteFrames: cc.SpriteFrame[];
            let scaleX = 1;
            if (walkStatus.dir == GameDirection.Up) {
                spriteFrames = this.spWalkUp;
            } else if (walkStatus.dir == GameDirection.Down) {
                spriteFrames = this.spWalkDown;
            } else if (walkStatus.dir == GameDirection.Left) {
                spriteFrames = this.spWalkRight;
                scaleX = -1;
            } else {
                spriteFrames = this.spWalkRight;
            }

            Utils.preferAnimFrame(this.spWalker, spriteFrames, percent);
            this.spWalker.node.scaleX = scaleX;
        }
    }

    // preferAnimFrame(sprite: cc.Sprite, frames: cc.SpriteFrame[], percent: number): cc.SpriteFrame {
    //     sprite.spriteFrame = frames[Math.floor(frames.length * percent)];
    //     return sprite.spriteFrame;
    // }

    getPaths(): cc.Vec2[] {
        // let paths: cc.Vec2[] = [];
        // paths.push(cc.v2(0, 0));
        // paths.push(cc.v2(50, 50));
        // paths.push(cc.v2(-100, 30));
        // paths.push(cc.v2(-100, 100));
        // paths.push(cc.v2(-10, -100));
        // paths.push(cc.v2(-200, -30));
        // paths.push(cc.v2(100, 100));
        // paths.push(cc.v2(10, 100));
        return this.paths;
    }
}
