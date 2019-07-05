import GameEventComponent from "./GameEventComponent";
import { GameEventBase } from "./GameEventDefine";

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
export default class GameEventDispatcher {

    private static _instance: GameEventDispatcher = null;

    static getInstance(): GameEventDispatcher {
        if (GameEventDispatcher._instance == null) {
            GameEventDispatcher._instance = new GameEventDispatcher;
        }
        return GameEventDispatcher._instance;

    }

    allComponents: GameEventComponent[] = [];

    registComponent(component: GameEventComponent) {
        this.allComponents.push(component);
    }

    removeComponent(component: GameEventComponent) {
        let idx = this.allComponents.indexOf(component);
        if (idx != -1) {
            this.allComponents.splice(idx, 1);
        }
    }

    disPatchEvent(event: GameEventBase) {
        for (let i = 0; i < this.allComponents.length; i++) {
            let component = this.allComponents[i];
            if(component.onReceiveEvent(event)){
                break;
            }
        }
    }
}
