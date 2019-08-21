cc.Class({
    extends: cc.Component,

    properties:{
        lbScore:{
            default: null,
            type: cc.Label,
        },

        btnRestart:{
            default: null,
            type: cc.Button,
        }
    },

    onLoad:function(){
        this.lbScore.string = "My Score is: " + globaldata.PlayerData.getMyScore();
        this.btnRestart.node.on('click', (button) => {
            this.resetAllData();
            cc.director.loadScene("LoadingScene");
        });
    },

    resetAllData:function(){
        globaldata.PlayerData.resetAllData();
    },
});