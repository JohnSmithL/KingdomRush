import { GameDirection } from "./Config";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html



export default class Utils {
    static tileCoordForPosition(map: cc.TiledMap, pos: cc.Vec2): cc.Vec2 {
        let mapSize = map.getMapSize();
        let tileSize = map.getTileSize();

        let x = pos.x - mapSize.width * tileSize.width * 0.5;
        let y = -pos.y + mapSize.height * tileSize.height * 0.5;

        return cc.v2(x, y);
    }

    static tilePolylineForPosition(startPos: cc.Vec2, polylinePoints: cc.Vec2[]): cc.Vec2[] {
        let paths: cc.Vec2[] = [];
        paths[0] = startPos;
        for (let i = 0; i < polylinePoints.length; i++) {
            paths[i] = cc.v2(startPos.x + polylinePoints[i].x, startPos.y - polylinePoints[i].y);
        }
        return paths;
    }

    static getDir(vec2: cc.Vec2): GameDirection {
        let standrad: cc.Vec2 = cc.v2(1, 0);
        let angle = cc.misc.radiansToDegrees(standrad.signAngle(vec2));
        console.log(angle);
        if (angle > 360) {
            angle -= 360;
        } else if (angle < 0) {
            angle += 360;
        }

        if (angle > 45 && angle <= 135) {
            return GameDirection.Up;
        } else if (angle > 135 && angle <= 225) {
            return GameDirection.Left;
        } else if (angle > 225 && angle <= 315) {
            return GameDirection.Down;
        } else {
            return GameDirection.Right;
        }
    }

    static preferAnimFrame(sprite: cc.Sprite, frames: cc.SpriteFrame[], percent: number): cc.SpriteFrame {
        sprite.spriteFrame = frames[Math.floor(frames.length * percent)];
        return sprite.spriteFrame;
    }


}
