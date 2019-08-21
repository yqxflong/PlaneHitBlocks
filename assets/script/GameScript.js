
import CONFIG from "./Common/Config";
import EnumDisplayLevel from "./Common/EnumDisplayLevel";

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label,
        },
        bombBtn:{
            default: null,
            type: cc.Button,
        },
        bombCntLabel:{
            default: null,
            type : cc.Label,
        },
        planeNode: {
            default : null,
            type: cc.Sprite,
        },
        bg1Prefab: {
            default: null,
            type: cc.Prefab,
        },
        bg2Prefab: {
            default: null,
            type: cc.Prefab,
        },
        touchNode :{
            default: null,
            type: cc.Node,
        },
        uiNode : {
            default : null,
            type: cc.Node,
        },
        bgNode : {
            default : null,
            type : cc.Node,
        }
    },

    onLoad : function(){
        this._viewSize = cc.view.getVisibleSize();
        console.log("this._viewSize=====>" + this._viewSize.height);

        this.node.zIndex = EnumDisplayLevel.GAMENODE;
        this.uiNode.zIndex = EnumDisplayLevel.UINODE;
        this.bgNode.zIndex = EnumDisplayLevel.BG;
        this.planeNode.node.zIndex = EnumDisplayLevel.PLANE;
        this.initBg();
        this.initPlane();
        this.initBlocks();
        this.initBonus();
        this.initScore();
        this.initBombBtn();
        this.registerEvent();
    },

    update : function(dt){
        //bg
        this.addTravelDis();
        //bonus
        this.checkGenBonus(dt);
        this.moveBonus();
        this.checkBonusCollision();
        this.checkExpiredBonus();
        //blocks
        this.checkGenBlocks(dt);
        this.checkBlocksCollision();
        this.checkExpiredBlocks();
    },

    getViewSize : function(){
        return this._viewSize;
    },

    getMyplane : function(){
        return this._myPlaneScript;
    },

    //初始化背景
    initBg : function(){
        var bgNode1 = cc.instantiate(this.bg1Prefab);
        var bgNode2 = cc.instantiate(this.bg2Prefab);
        bgNode2.y = this._viewSize.height;
        this.bgNode.addChild(bgNode1);
        this.bgNode.addChild(bgNode2);
        //----
        this._bgScripts = [];
        this._bgScripts.push(bgNode1.getComponent("BgScript"));
        this._bgScripts.push(bgNode2.getComponent("BgScript"));
        cc.log("this._bgScripts=====>" + this._bgScripts.length);
    },

    //初始化飞机
    initPlane:function(){
        this._myPlaneScript = this.planeNode.getComponent("MyPlaneScript");
    },

    //初始化blocks
    initBlocks:function(){
        this._blockManger = globaldata.BlockManager;
        this._blockNodeList = [];
        this._genInterval_blocks = 0;
    },

    //初始化Bonus
    initBonus:function(){
        this._bonusManager = globaldata.BonusManager;
        this._bonusList = [];
        this._genInterval_bonus = CONFIG.INTERVAL_GEN_BONUS;
    },

    //初始化Score
    initScore:function(){
        cc.log("GameScript=initScore=====>");
        this.onRefreshUI_Score(globaldata.PlayerData.getMyScore());
    },

    //初始化btn
    initBombBtn:function(){
        this.bombBtn.node.on('click', function (button) {
            cc.log("this.bombBtn=Click=====>");
            var curBgIndex = this._bgScripts[0].node.y < this._bgScripts[1].node.y ? 0 : 1;
            this._myPlaneScript.throwBomb(this._bgScripts[curBgIndex]);
        });
    },

    //注册事件
    registerEvent : function(){
        globaldata.EventManager.Register(globaldata.EventType.PLAYER_ADDSCORE, this.onAddScore, this);
        globaldata.EventManager.Register(globaldata.EventType.UI_REFRESH, this.onRefreshUI_Bomb, this);
        globaldata.EventManager.Register(globaldata.EventType.BOMB_EXPLOSION, this.onExplosionBomb, this);
        //about touch
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this))
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this))
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this))
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel.bind(this))
    },

    //增加行驶距离
    addTravelDis : function(){
        this._myTraveDis += CONFIG.DIS_TRAVEL;
        this._bgScripts[0].moveDis(CONFIG.DIS_TRAVEL);
        this._bgScripts[1].moveDis(CONFIG.DIS_TRAVEL);
    },

    //加分
    onAddScore : function(cnt){
        globaldata.PlayerData.addMyScore(cnt);
        this.onRefreshUI_Score(globaldata.PlayerData.getMyScore());
    },

    //刷新分数UI
    onRefreshUI_Score: function(cnt){
        this.scoreLabel.string = "Score: " + cnt;
    },

    //刷新炸弹数量UI
    onRefreshUI_Bomb: function(bombCnt){
        cc.log("onRefreshUI_Bomb=====>" + bombCnt);
        this.bombCntLabel.string = "x " + bombCnt;
    },
    //-----About Blocks Begin-----//
    //move
    moveBlock : function(blockNode){
        var during = (blockNode.y + this._viewSize.height*0.5) / CONFIG.DIS_BLOCK_SPEED;
        cc.log("moveBlocks=====>" + during);
        var moveto = cc.moveTo(during, cc.v2(blockNode.x, -this._viewSize.height*0.5));
        blockNode.runAction(moveto);
    },
    
    //检测生成blocks
    checkGenBlocks : function(dt){
        if(this._genInterval_blocks > 0){
            this._genInterval_blocks -= dt;
            return;
        }

        this._genInterval_blocks = Math.random()*CONFIG.INTERVAL_GEN_BLOCKS + 2;
        var list = [];
        if(this._blockManger.genOneRowBlocks(list)){
            cc.log("checkGenBlocks=====>" + list.length);
            for(let i = 0; i< list.length;i++){
                var blockNode = list[i];
                blockNode.parent = this.node;
                blockNode.zIndex = EnumDisplayLevel.BLOCK;
                blockNode.x = i*blockNode.width;
                blockNode.y = this._viewSize.height*1.2;
                this._blockNodeList.push(blockNode);
                this.moveBlock(blockNode);
            }
        }
    },

    //检测blocks过期
    checkExpiredBlocks:function(){
        for(let i = 0; i < this._blockNodeList.length;){
            var blockNode = this._blockNodeList[i];
            if(blockNode.y < - this._viewSize.height*0.5){
                blockNode.removeFromParent();
                this._blockNodeList.splice(i,1);
            }else{
                i++;
            }
        }
    },

    //检测Blocks碰撞
    checkBlocksCollision: function(){
        for(let i = 0; i < this._blockNodeList.length;i++){
            var blockNode = this._blockNodeList[i];
            var blockScript = blockNode.getComponent("BlockScript");
            blockScript.checkCollision_plane(this._myPlaneScript)
            blockScript.checkCollision_bullet(this._myPlaneScript.getBulletManager().getAlivedBullets())
        }
    },

    //炸弹爆炸
    onExplosionBomb: function(bombCnt){
        if(this._blockNodeList.length > 0){
            this._blockManger.clearBlocksByCont(this._blockNodeList, 3, this._myPlaneScript.getPos().y);
        }
        onRefreshUI_Bomb(bombCnt);
    },
    //-----About Blocks End ------//

    //-----About Bonus Begin -----//
    //检查生成bonus
    checkGenBonus:function(dt){
        if(this._genInterval_bonus > 0){
            this._genInterval_bonus -= dt;
            return;
        }
        this._genInterval_bonus = CONFIG.INTERVAL_GEN_BONUS;
        var bonusNode = globaldata.BonusManager.genBonus();
        if(bonusNode){
            bonusNode.parent = this.node;
            bonusNode.zIndex = EnumDisplayLevel.BONUS;
            bonusNode.x = Math.floor(Math.random()*(this._viewSize.width - bonusNode.width)) + bonusNode.width;
            bonusNode.y = this._viewSize.height * 1.5;
            this._bonusList.push(bonusNode);
        }
    },

    //检查bonus过期
    checkExpiredBonus:function(){
        for(let i = 0;i<this._bonusList.length;){
            var bonusNode = this._bonusList[i];
            if(bonusNode.y < - this._viewSize.height*0.5){
                bonusNode.removeFromParent();
                this._bonusList.splice(i, 1);
            }else{
                i++;
            }
        }
    },

    //检查Bonus碰撞
    checkBonusCollision:function(){
        for(let i = 0;i< this._bonusList.length;i++){
            var bonusNode = this._bonusList[i];
            var rect1 = new cc.Rect(bonusNode.x, bonusNode.y, bonusNode.width, bonusNode.height);
            if(rect1.intersects(this._myPlaneScript.getRect())){
                var BonusType = bonusNode.getComponent("BonusScript").getBonusType();
                this._myPlaneScript.onGetBonus(BonusType);
                bonusNode.removeFromParent();
                this._bonusList.splice(i, 1);
            }
        }
    },

    //移动bonus
    moveBonus : function(){
        for(let i = 0;i< this._bonusList.length;i++){
            this._bonusList[i].y -= CONFIG.DIS_BONUS;
        }
    },
    //-----About Bonus End -----//

    //-----About Touch Begin
    onTouchStart(event){
        cc.log("GameScript=onTouchStart=====>");
        this._preTouchPos = event.getLocation();
    },

    onTouchEnd(event){
        cc.log("GameScript=onTouchEnd=====>");
        this._myPlaneScript.onStopMove();
    },

    onTouchCancel(event){
        cc.log("GameScript=onTouchCancel=====>");
        this._myPlaneScript.onStopMove();
    },

    onTouchMove(event){
        let curTouchPos = event.getLocation();
        let distance = 0.01;

        if ( Math.abs(curTouchPos.x - this._preTouchPos.x) > distance )
        {
            if (curTouchPos.x > this._preTouchPos.x)
            {
                this._myPlaneScript.onMoveRight();
            }
            else
            {
                this._myPlaneScript.onMoveLeft();
            }
        }
    },
    //About Touch End-----
});