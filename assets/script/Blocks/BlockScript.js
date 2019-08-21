import EnumColorTypeBlock from "../Common/EnumColorTypeBlock";

cc.Class({
    extends: cc.Component,

    properties:{
        lbHp : {
            default : null,
            type : cc.Label,
        },
    },

    onLoad:function(){
        this._colorType = EnumColorTypeBlock.RED;
        this._hp = 0;
    },

    //查看子弹碰撞
    checkCollision_bullet : function(alivedBullets){
        var deCnt = 0;
        for(let i = 0;i<alivedBullets.length;i++){
            var bulletNode = alivedBullets[i];
            var rect1 = new cc.Rect(this.node.x, this.node.y, this.node.width, this.node.height);
            var rect2 = new cc.Rect(bulletNode.x, bulletNode.y, bulletNode.width, bulletNode.height);
            if(rect1.intersects(rect2)){
                deCnt++;
            }
        }
        this.decreaseHp(deCnt);
    },

    //查看飞机碰撞
    checkCollision_plane : function(planeScript){
        var rect1 = new cc.Rect(this.node.x, this.node.y, this.node.width, this.node.height);
        var rect2 = planeScript.getRect();
        if(rect1.intersects(rect2)){
            planeScript.onDie();
        }
    },

    //设置HP
    setHp : function(cnt){
        this._hp = cnt;
        this.onRefreshUI();
    },

    //扣血
    decreaseHp : function(cnt){
        while(cnt > 0){
            cnt--;
            this._hp--;
            this.onRefreshUI();
            globaldata.EventManager.Emit(globaldata.EventType.PLAYER_ADDSCORE, 1);
            if(this._hp == 0){
                onDie();
                break;
            }
        }
    },

    //死亡回调
    onDie : function(){
        this.node.removeFromParent();
    },

    //
    onRefreshUI : function(){
        this.lbHp.text = "" + this._hp;
    },

});