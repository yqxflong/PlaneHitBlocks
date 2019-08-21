let w = window;
w.globaldata = w.globaldata || {}

var PlayerData = require("PlayerData")
var EventType = require("EventType")
var EventManager = require("EventManager")
var BlockManager = require("BlockManager")
var BonusManager = require("BonusManager")

cc.Class({
    extends: cc.Component,

    onLoad:function(){
        this._hasLoadMainScene = false;
        this.initGloalBalData();
    },

    initGloalBalData:function(){
        globaldata.EventType = EventType;
        globaldata.PlayerData = new PlayerData();
        globaldata.EventManager = new EventManager();
        globaldata.BlockManager = new BlockManager();
        globaldata.BonusManager = new BonusManager();
    },

    update:function(dt){
        var con1 = globaldata.BlockManager.isResourceReady();
        var con2 = globaldata.BonusManager.isResourceReady();

        if(con1 && con2 && !this._hasLoadMainScene){
            cc.log("App=loadMainScene=====>");
            cc.director.loadScene("MainScene");
            this._hasLoadMainScene = true;
        }
    },
});