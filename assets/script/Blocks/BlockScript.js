import EnumColorTypeBlock from "../Common/EnumColorTypeBlock";

cc.Class({
    extends: cc.Component,

    properties:{
        lbHp : {
            default : null,
            type : cc.Label,
        },

        _hp : 0,
    },

    onLoad:function(){
        this._colorType = EnumColorTypeBlock.RED;
    },

    checkCollision_bullet_sub:function(blockId, alivedBullets){
        for(let i = 0; i < alivedBullets.length;){
            var bulletNode = alivedBullets[i];
            var rect1 = new cc.Rect(this.node.x - this.node.width*0.5, this.node.y - this.node.height*0.5, this.node.width, this.node.height);
            var rect2 = new cc.Rect(bulletNode.x, bulletNode.y, bulletNode.width, bulletNode.height);
            if(rect1.intersects(rect2)){
                bulletNode.removeFromParent();
                alivedBullets.splice(i, 1);
                if(this.decreaseHp(1)){
                    globaldata.EventManager.Emit(globaldata.EventType.BLOCK_REMOVE, blockId);
                }
            }else{
                i++;
            }
        }
    },

    //查看子弹碰撞
    checkCollision_bullet : function(blockId, alivedBulletsList){
        for(let i = 0;i<alivedBulletsList.length;i++){
            this.checkCollision_bullet_sub(blockId, alivedBulletsList[i]);
        }
    },

    //查看飞机碰撞
    checkCollision_plane : function(planeScript){
        var rect1 = new cc.Rect(this.node.x - this.node.width*0.5, this.node.y - this.node.height*0.5, this.node.width, this.node.height);
        var rect2 = planeScript.getRect();
        if(rect1.intersects(rect2)){
            planeScript.onDie();
            globaldata.EventManager.Emit(globaldata.EventType.GAMEOVER);
        }
    },

    //设置HP
    setHp : function(cnt){
        cc.log("BlockScript=setHp=====>" + cnt);
        this._hp = cnt;
        this.onRefreshUI();
    },

    //扣血
    decreaseHp : function(cnt){
        cc.log("decreaseHp=====>" + cnt + "=" + this._hp);
        while(cnt > 0){
            cnt--;
            this._hp--;
            this.onRefreshUI();
            globaldata.EventManager.Emit(globaldata.EventType.PLAYER_ADDSCORE, 1);
            if(this._hp <= 0){
                this.onDie();
                return true;
            }
        }

        return false;
    },

    //死亡回调
    onDie : function(){
        cc.log("BlockScript=onDie=====>");
        this.node.stopAllActions();
        this.node.removeFromParent();
    },

    //
    onRefreshUI : function(){
        cc.log("BlockScript=onRefreshUI=====>" + this._hp);
        this.lbHp.string = this._hp;
    },

});