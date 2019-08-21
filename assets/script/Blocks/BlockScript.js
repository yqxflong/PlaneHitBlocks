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
        for(let i = 0;i<alivedBullets.length;){
            var bulletNode = alivedBullets[i];
            var rect1 = new cc.Rect(this.node.x, this.node.y, this.node.width, this.node.height);
            var rect2 = new cc.Rect(bulletNode.x, bulletNode.y, bulletNode.width, bulletNode.height);
            cc.log("checkCollision_bullet=====>" + rect1 + "=" + rect2);
            if(rect1.intersects(rect2)){
                deCnt++;
                bulletNode.removeFromParent();
                alivedBullets.splice(i, 1);
            }else{
                i++;
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
            if(this._hp <= 0){
                this.onDie();
                break;
            }
        }
    },

    //死亡回调
    onDie : function(){
        cc.log("BlockScript=onDie=====>");
        this.node.removeFromParent();
    },

    //
    onRefreshUI : function(){
        cc.log("BlockScript=onRefreshUI=====>" + this._hp);
        this.lbHp.string = this._hp;
    },

});