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
export default class GamePoolManager extends cc.Component{
    private static _instance: GamePoolManager = null;

    static getInstance(): GamePoolManager {
        return GamePoolManager._instance;
    }

    onLoad(){
        if (GamePoolManager._instance == null) {
            GamePoolManager._instance = this;
        }else{
            throw new Error("GamePoolManager already exist");
        }
    }
    

    @property([cc.Prefab])
    prefabs:cc.Prefab[] = [];

    allPools: Map<PoolType, cc.Node[]> = new Map<PoolType, cc.Node[]>();

    getObject(PoolType:PoolType):cc.Node{
        let pool = this.allPools.get(PoolType);
        if(!pool){
            pool = [];
            this.allPools.set(PoolType,pool);
        }
        if(pool.length>0){
            return pool.pop();
        }else{
            return cc.instantiate(this.prefabs[PoolType]);
        }
    }

    recycleObject(PoolType:PoolType,node:cc.Node){
        let pool = this.allPools.get(PoolType);
        pool.push(node);
    }
}

export enum PoolType {
    None,
    MegaTowerFlyObject,
}