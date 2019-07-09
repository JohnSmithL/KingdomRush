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
export default class CameraController extends cc.Component {


    @property(cc.Camera)
    camera: cc.Camera = null;

    touchPoses: cc.Vec2[] = [];

    touchIdx: number = 0;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(touch: cc.Event.EventTouch) {
        console.log("touchstart");
        this.updateTouchPos(this.touchIdx, touch.getLocation());
        this.touchIdx++;
    }

    onTouchMove(touch: cc.Event.EventTouch) {
        console.log("touchmove");
        if (this.touchPoses.length == 1) {
            this.camera.node.position = this.camera.node.position.sub(touch.getDelta());
        } else {
            let distance0 = (touch.getLocation().sub(this.touchPoses[0])).mag();
            let distance1 = (touch.getLocation().sub(this.touchPoses[1])).mag();

            let lastDis = (this.touchPoses[0].sub(this.touchPoses[1])).mag();
            let currentDis = Math.max(distance0, distance1);

            let disDelta = currentDis - lastDis;
            let zoomRatio = this.camera.zoomRatio + disDelta / 500;
            this.camera.zoomRatio = Math.min(2, Math.max(0.5, zoomRatio));

            if (distance0 < distance1) {
                this.touchPoses[0] = touch.getLocation();
            } else {
                this.touchPoses[1] = touch.getLocation();
            }
        }
    }

    onTouchEnd(touch: cc.Event.EventTouch) {
        console.log("touchend");
        this.touchIdx--;
        if (this.touchIdx <= 0) {
            this.touchPoses.splice(0, this.touchPoses.length);
        }

        this.touchIdx = Math.max(0,this.touchIdx);
    }

    onTouchCancel(touch: cc.Event.EventTouch) {
        console.log("touchcancel");
        this.touchIdx--;
        if (this.touchIdx <= 0) {
            this.touchPoses.splice(0, this.touchPoses.length);
        }

        this.touchIdx = Math.max(0,this.touchIdx);
    }

    updateTouchPos(touchIdx: number, pos: cc.Vec2) {
        this.touchPoses[touchIdx] = pos;
    }
}
