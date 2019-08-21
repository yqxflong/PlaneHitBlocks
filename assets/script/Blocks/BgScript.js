cc.Class({
    extends:cc.Component,

    properties:{
        num : 0,
    },

    onLoad:function(){
        this._viewSize = cc.view.getVisibleSize();
    },

    //移动距离
    moveDis: function(dis){
        this.node.y -= dis;

        if(this.node.y <= -this._viewSize.height){
            this.refreshBlocks();
            this.node.y = this._viewSize.height;
        }
    },
});