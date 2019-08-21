import EnumDisplayLevel from "../Common/EnumDisplayLevel";
import EnumColorTypeBlock from "../Common/EnumColorTypeBlock"

export default class BlockManager{
    constructor(){
        this.init();
    }

    init(){
        //权重: 无， 红， 黄， 绿
        this._propList = [10, 30, 30, 30];
        this.loadResource();
    }

    loadResource(){
        cc.log("BlockManager=loadResource=====>")
        this._blockPrefabList = [];
        for(let i = 0;i < 3;i++){
            var resName = "prefab/block" + i;
            cc.loader.loadRes(resName, (err, prefab) =>{
                if(!err){
                    this._blockPrefabList.push(prefab);
                }else{
                    cc.error("load prefab/block" + i +  " Error!");
                }
            });
        }
    }

    isResourceReady(){
        return this._blockPrefabList.length == 3;
    }

    //生成一个block
    genOneBlock(color){
        var idx = color - 1;
        var blockPrefab = this._blockPrefabList[idx];
        var blockNode = cc.instantiate(blockPrefab);

        if(blockNode){
            blockNode.zIndex = EnumDisplayLevel.BLOCK;
            var dis = globaldata.PlayerData.getMyTravelDis();
            var hp = Math.random()*(5*(dis*0.002 + 1)) + 5;
            var script = blockNode.getComponent("BlockScript");
            script.setHp(hp);
        }else{
            cc.error("BlockManger=genOneBlock=====>Error!blockNode is Null!!");
        }

        return blockNode;
    }

    //随机生成类型
    randomTypeOfRowBlocks(){
        var rand = Math.floor(Math.random()*100) + 1;
        var total = 0;
        for(var i = 0; i < this._propList.length;i++){
            total += this._propList[i];
            if(rand < total){
                return i;
            }
        }
    }

    //按照颜色生成一行
    genOneRowBlock_color(list, color, cnt){
        for(var i = 0;i< cnt;i++){
            list.push(this.genOneBlock(color));
        }
    }

    
    //生成一行blocks(maybe two)
    genOneRowBlocks(list){
        var rand = this.randomTypeOfRowBlocks();
        cc.log("BlockManger=genOneRowBlocks=====>" + rand);
        if(rand == EnumColorTypeBlock.RED){ //红
            this.genOneRowBlock_color(list, rand, 3);
        }else if(rand == EnumColorTypeBlock.YELLOW){//黄
            this.genOneRowBlock_color(list, rand, 4);
        }else if(rand == EnumColorTypeBlock.GREEN){//绿
            this.genOneRowBlock_color(list, rand, 4);
        }else{
            return false;
        }

        return true;
    }

    //清除此背景blocks
    clearAllBlocks(list){
        for(let i = 0; i < list.length;i++){
            var blockNode = list[i];
            blockNode.removeFromParent();
            list.splice(i,1);
        }
    }
    
    //清除坐标minY之上的cnt个blocks
    clearBlocksByCont(list, cnt, minY){
        var total = 0;
        for(let i = 0; i < list.length;){
            var blockNode = list[i];
            if(blockNode.y > minY){
                blockNode.removeFromParent();
                list.splice(i,1);
                total++;
            }else{
                i++;
            }

            if(total == cnt){
                break;
            }
        }
    }
}