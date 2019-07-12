import Utils from "./Utils";
import TowerCreator, { TowerCreatorStatus } from "./TowerCreator";
import GameWalker from "./GameWalker";
import { GameActorStatusWalk, GameActorStatusIdle } from "./GameActorStatusMachine";
import GameActor from "./GameAcotr";
import DefenceTowerMega from "./DefenceTowerMega";
import { GameEventCreatTower, GameEventType, GameEventDie } from "./GameEventDefine";
import { DefenceTowerType, GameConfig } from "./Config";
import GameEventListener from "./GameEventListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectLevels extends GameEventListener {

    private static _instance: SelectLevels = null;

    static getInstance(): SelectLevels {
        return SelectLevels._instance;

    }

    @property(cc.Prefab)
    prefabPoolManager: cc.Prefab = null;

    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property(cc.Prefab)
    prefabTowerCreator: cc.Prefab = null;

    @property(cc.Node)
    towerParent: cc.Node = null;

    @property(cc.Prefab)
    prefabEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    prefabMegaTower: cc.Prefab = null;

    enemys: GameActor[] = [];


    onLoad() {
        super.onLoad();
        SelectLevels._instance = this;
        GameConfig.loadConfig();
    }

    startGame() {
        let poolManager = cc.instantiate(this.prefabPoolManager);
        poolManager.parent = this.node;

        this.eventComponent.registEvent(GameEventType.CreatTower, this.onEventCreatTower);
        this.eventComponent.registEvent(GameEventType.Die, this.onEventDie);

        this.gengerateTowerCreator();
        this.schedule(this.generateEnemy, 3, 20, 1);
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
            this.enemys.splice(idx, 1);
            // this.enemys.shift();
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


    update(dt) {
        let nodes: cc.Node[] = [];

        for (let i = 0, length = this.enemys.length; i < length; i++) {
            let enemy = this.enemys[i];
            nodes.push(enemy.node);
        }
        Utils.orderByPosY(nodes);

        for (let i = 0, lenght = nodes.length; i < lenght; i++) {
            let node = nodes[i];
            node.zIndex = i;
        }
    }
}
