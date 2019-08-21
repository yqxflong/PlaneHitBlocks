import BULLET_TYPE from "./Common/EnumBulletType";
import CONFIG from "./Common/Config";
import EnumPlaneMoveState from "./Common/EnumPlaneMoveState";
import EnumBulletType from "./Common/EnumBulletType";
import EnumBonusType from "./Common/EnumBonusType";

var BulletManager = require("BulletManager")

cc.Class({
    extends: cc.Component,

    onLoad : function(){
        this._viewSize = cc.view.getVisibleSize();
        this._bulletManager = new BulletManager(this);
        this._moveState = EnumPlaneMoveState.STOP;
        this._superLeftTime = 0;
    },

    update : function(dt){
        this._bulletManager.update(dt);
        this.checkSuperBulletLeftTime(dt);
    },

    getPos:function(){
        return cc.v2(this.node.x, this.node.y);
    },

    getRect:function(){
        return new cc.Rect(this.node.x - this.node.width*0.5, this.node.y - this.node.height*0.5, this.node.width, this.node.height);
    },

    getBulletManager:function(){
        return this._bulletManager;
    },

    //更换子弹类型
    changeBulletType:function(bulletType){
        this._bulletManager.changeBulletType(bulletType);
    },

    //投掷炸弹
    throwBomb : function(bgScript){
        if(globaldata.PlayerData.getMyBombCnt() <= 0)
            return;
        
        globaldata.PlayerData.decreaseMyBombCnt(1);
        globaldata.EventManager.Emit(globaldata.EventType.BOMB_EXPLOSION, globaldata.PlayerData.getMyBombCnt());
    },

    //检测超级子单剩余时间
    checkSuperBulletLeftTime:function(dt){
        if(this._bulletManager.getBulletType() != EnumBulletType.SUPER){
            return;
        }

        this._superLeftTime -= dt;
        if(this._superLeftTime <= 0){
            this.changeBulletType(EnumBulletType.NORMAL);
        }
    },

    //死亡回调
    onDie:function(){
        this.node.removeFromParent();
    },

    //左move
    onMoveLeft: function(){
        if(this._moveState == EnumPlaneMoveState.LEFT)
            return;

        this.node.stopAllActions();
        this._moveState = EnumPlaneMoveState.LEFT;

        var limitLeft = this.node.width*0.5;
        if(this.node.x > limitLeft){
            var during = Math.abs(limitLeft - this.node.x) / CONFIG.DIS_PLANE_SPEED;
            var moveto = cc.moveTo(during, cc.v2(limitLeft, this.node.y));
            this.node.runAction(moveto);
        }
    },

    //右move
    onMoveRight: function(){
        if(this._moveState == EnumPlaneMoveState.RIGHT)
            return;
        
        this.node.stopAllActions();
        this._moveState = EnumPlaneMoveState.RIGHT;

        var limitRight = this._viewSize.width - this.node.width*0.5;
        if(this.node.x < limitRight){
            var during = Math.abs(limitRight - this.node.x) / CONFIG.DIS_PLANE_SPEED;
            var moveto = cc.moveTo(during, cc.v2(limitRight, this.node.y));
            this.node.runAction(moveto);
        }
    },

    //stopmove
    onStopMove: function(){
        cc.log("MyPlaneScript=onStopMove=====>");
        this.node.stopAllActions();
        this._moveState = EnumPlaneMoveState.STOP;
    },

    //getBonus
    onGetBonus:function(tp){
        cc.log("MyPlaneScript=onGetBonus=====>" + tp);
        if(tp == EnumBonusType.BOMB){
            cc.log("MyPlaneScript=onGetBonus=====>BOMB");
            globaldata.PlayerData.addMyBombCnt(1);
            globaldata.EventManager.Emit(globaldata.EventType.UI_REFRESH, globaldata.PlayerData.getMyBombCnt());
        }else{
            cc.log("MyPlaneScript=onGetBonus=====>else");
            this.changeBulletType(EnumBulletType.SUPER);
            this._superLeftTime = CONFIG.DURING_BONUS_SUPERBULLET;
        }
    }

});