import { DefenceTowerType } from "./Config";
import { GameEventCreatTower } from "./GameEventDefine";
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

//0:None 1:箭塔 archer 2:兵营 barrack 3:法师塔 mega 4:炮塔 artillery
const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerCreator extends cc.Component {

    @property(cc.Node)
    commonBg: cc.Node = null;

    @property(cc.Node)
    nodeRangeParent: cc.Node = null;

    @property(cc.Node)
    nodePreviewParent: cc.Node = null;

    @property([cc.Node])
    nodePreview: cc.Node[] = [];

    @property(cc.Node)
    nodeSelectorParent: cc.Node = null;

    @property([cc.Node])
    nodeSelector: cc.Node[] = [];

    @property(cc.Node)
    nodeConstructingParent: cc.Node = null;

    @property([cc.Node])
    nodeConstructing: cc.Node[] = [];

    @property(cc.Node)
    nodeBarParent: cc.Node = null;

    @property(cc.Sprite)
    spBar: cc.Sprite = null;

    currentTowerType: DefenceTowerType = DefenceTowerType.None;
    status: TowerCreatorStatus = TowerCreatorStatus.None;


    setStatus(status: TowerCreatorStatus) {
        this.commonBg.active = ((status == TowerCreatorStatus.Common) || (status == TowerCreatorStatus.SelectTower));
        this.nodeSelectorParent.active = ((status == TowerCreatorStatus.SelectTower) || (status == TowerCreatorStatus.ClickSelectTower));
        this.nodeRangeParent.active = status == (TowerCreatorStatus.ClickSelectTower);
        this.nodePreviewParent.active = status == (TowerCreatorStatus.ClickSelectTower);
        this.nodeConstructingParent.active = (status == TowerCreatorStatus.Constructing);
        this.nodeBarParent.active = (status == TowerCreatorStatus.Constructing);
        this.status = status;
    }


    setCurrentTowerType(towerType: DefenceTowerType) {
        this.currentTowerType = towerType;
    }

    refrushCurrentType() {
        for (let i = 0; i < this.nodePreview.length; i++) {
            if (this.nodePreview[i]) {
                this.nodePreview[i].active = (this.currentTowerType == i);
            }
        }

        for (let i = 0; i < this.nodeSelector.length; i++) {
            if (this.nodeSelector[i]) {
                this.nodeSelector[i].children[0].children[0].active = false;
            }
        }

        for (let i = 0; i < this.nodeConstructing.length; i++) {
            if (this.nodeConstructing[i]) {
                this.nodeConstructing[i].active = (this.currentTowerType == i);
            }
        }
    }

    onClickCommonBg() {
        this.setStatus(TowerCreatorStatus.SelectTower);
    }

    onClickSelectTower(event: cc.Event.EventCustom, type: string) {
        this.setStatus(TowerCreatorStatus.ClickSelectTower);
        this.setCurrentTowerType(parseInt(type));
        this.refrushCurrentType();
        event.getCurrentTarget().children[0].children[0].active = true;
    }

    onClickCreatTower(event: cc.Event.EventCustom, type: string) {
        this.setStatus(TowerCreatorStatus.Constructing);
        this.setCurrentTowerType(parseInt(type));
        this.spBar.fillRange = 0;
    }


    update(dt: number) {
        if (this.status == TowerCreatorStatus.Constructing) {
            this.spBar.fillRange += dt;
            this.spBar.fillRange = Math.min(this.spBar.fillRange, 1);
            if (this.spBar.fillRange == 1) {
                console.log("Constructed successfully");
                this.status = TowerCreatorStatus.None;

                let event = new GameEventCreatTower();
                event.pos = this.node.position;
                event.towerType = this.currentTowerType;
                GameEventDispatcher.getInstance().disPatchEvent(event);
            }
        }

    }
}





export enum TowerCreatorStatus {
    None,
    Common,
    SelectTower,
    ClickSelectTower,
    Constructing,
}