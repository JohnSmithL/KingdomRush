import { GameEventType, GameEventBase } from "./GameEventDefine";
import GameActor from "./GameAcotr";
import GameEventDispatcher from "./GameEventDispatcher";
import GameEventListener from "./GameEventListener";



const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEventComponent extends cc.Component {


    private events: Map<GameEventType, (event: GameEventBase) => boolean> = new Map<GameEventType, (event: GameEventBase) => boolean>();
    target: GameEventListener = null;

    onLoad() {
        this.target = this.getComponent("GameEventListener") as GameEventListener;

        GameEventDispatcher.getInstance().registComponent(this);
    }

    onDestroy() {
        console.log("remove " + this.node.name);
        GameEventDispatcher.getInstance().removeComponent(this);
    }


    registEvent(eventType: GameEventType, callBack: (event: GameEventBase) => boolean): void {
        this.events.set(eventType, callBack);

    }

    onReceiveEvent(event: GameEventBase): boolean {
        if (this.events.has(event.eventType)) {
            return this.events.get(event.eventType).call(this.target, event);
        }
        return false;
    }
}
