import Utils from "./Utils";
import TowerCreator, { TowerCreatorStatus } from "./TowerCreator";
import GameWalker from "./GameWalker";
import { GameActorStatusWalk, GameActorStatusIdle } from "./GameActorStatusMachine";
import GameActor from "./GameAcotr";
import DefenceTowerMega from "./DefenceTowerMega";
import { GameEventCreatTower, GameEventType, GameEventDie } from "./GameEventDefine";
import { DefenceTowerType } from "./Config";
import GameEventListener from "./GameEventListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectLevels extends GameEventListener {

    private static _instance: SelectLevels = null;

    static getInstance(): SelectLevels {
        return SelectLevels._instance;

    }
    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    @property(cc.Node)
    towerParent: cc.Node = null;

    @property(cc.Prefab)
    prefabEnemy: cc.Prefab = null;

    enemys: GameActor[] = [];

    @property(cc.Prefab)
    prefabMegaTower: cc.Prefab = null;



    onLoad() {
        super.onLoad();
        SelectLevels._instance = this;
        let towers = this.map.getObjectGroup("towers");
        let tower0 = towers.getObject("tower0");
        // this.sprite.node.position = Utils.tileCoordForPosition(this.map,tower0.offset);

        let towerCreator = cc.instantiate(this.prefabTowerCreator).getComponent(TowerCreator);
        towerCreator.node.parent = this.towerParent;
        towerCreator.node.position = Utils.tileCoordForPosition(this.map, tower0.offset);
        towerCreator.setStatus(TowerCreatorStatus.Common);


        this.eventComponent.registEvent(GameEventType.CreatTower, this.onEventCreatTower);
        this.eventComponent.registEvent(GameEventType.Die, this.onEventDie);

        this.schedule(this.generateEnemy, 3, 20, 5);

        console.log("enemys.length1:" + this.enemys.length);
    }


    onEventCreatTower(event: GameEventCreatTower): boolean {
        let towerType = event.towerType;
        if (towerType = DefenceTowerType.Mega) {
            let tower = cc.instantiate(this.prefabMegaTower).getComponent("DefenceTowerMega") as DefenceTowerMega;
            tower.node.parent = this.towerParent;
            tower.node.position = event.pos;
            tower.machine.onStatusChange(new GameActorStatusIdle);
        }
        return false;
    }

    onEventDie(event: GameEventDie): boolean {
        let idx = this.enemys.indexOf(event.actor);
        if (idx != -1) {
            // this.enemys.slice(idx, 1);
            this.enemys.shift();
            console.log("enemys.length2:" + this.enemys.length);
        }
        return false;
    }

    generateEnemy() {
        let enemy = cc.instantiate(this.prefabEnemy).getComponent("GameWalker") as GameWalker;
        enemy.node.parent = this.towerParent;

        let paths = this.map.getObjectGroup("paths");
        let path0 = paths.getObject("path0");

        let startPos = Utils.tileCoordForPosition(this.map, path0.offset);
        enemy.node.position = startPos;
        enemy.paths = Utils.tilePolylineForPosition(startPos, path0.polylinePoints);

        this.enemys.push(enemy);
        let walk = new GameActorStatusWalk;
        enemy.machine.onStatusChange(walk);
    }

    gengerateTowerCreator() {
        let towers = this.map.getObjectGroup("towers");
        let groups = towers.getObjects();

        for (let i = 0; i < groups.length; i++) {
            let tower = groups[i];
            let towerCreator = cc.instantiate(this.prefabTowerCreator).getComponent(TowerCreator);
            towerCreator.node.parent = this.towerParent;
            towerCreator.node.position = Utils.tileCoordForPosition(this.map, tower.offset);
            towerCreator.setStatus(TowerCreatorStatus.Common);
        }
    }
}
