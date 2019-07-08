import { DefenceTowerType } from "./Config";
import GameActor from "./GameAcotr";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export enum GameEventType{
    None,
    CreatTower,
    Hit,
    Die,
}

export  class GameEventBase{
    eventType:GameEventType = GameEventType.None;
}

export class GameEventCreatTower extends GameEventBase{
    eventType:GameEventType = GameEventType.CreatTower;
    towerType:DefenceTowerType;
    pos:cc.Vec2;
}

export class GameEventHit extends GameEventBase{
    eventType = GameEventType.Hit;
    hitter:GameActor;
    beHitter:GameActor;
}

export class GameEventDie extends GameEventBase{
    eventType = GameEventType.Die;
    actor:GameActor;
}