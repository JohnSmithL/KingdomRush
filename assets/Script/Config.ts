import SelectLevels from "./SelectLevels";



export enum DefenceTowerType{
    None,
    Archer,
    Barrack,
    Mega,
    Artillery,
}

export enum GameDirection{
    None,
    Up,
    Down,
    Left,
    Right,
}

//异步模式
export class GameConfig{
    static config:any = null;
    static loadConfig(){
        cc.loader.loadRes("config",(error,resource)=>{
            console.log(resource);
            GameConfig.config = resource;
            SelectLevels.getInstance().startGame();
        });
    }
}