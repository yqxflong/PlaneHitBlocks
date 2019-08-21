import EnumBonusType from "../Common/EnumBonusType";
import EnumDisplayLevel from "../Common/EnumDisplayLevel";

export default class BonusManager{

    constructor(){
        this._bombPrefab = null;
        this._superbulletPrefab = null;
        //权重表: 无，super. bomb
        this._bonusTypeList = [EnumBonusType.NONE, EnumBonusType.SUPERBULLET, EnumBonusType.BOMB];
        this._propList = [50, 30, 20];

        this.loadResource();
    }

    loadResource(){
        cc.loader.loadRes("prefab/BonusBomb", (err, prefab)=>{
            if(!err){
                this._bombPrefab = prefab;
            }else{
                cc.log("load prefab/BonusBomb Error!");
            }
        });

        cc.loader.loadRes("prefab/BonusSuperBullet", (err, prefab)=>{
            if(!err){
                this._superbulletPrefab = prefab;
            }else{
                cc.log("load prefab/BonusSuperBullet Error!");
            }
        });
    }

    isResourceReady(){
        return this._bombPrefab != null && this._superbulletPrefab != null;
    }

    //随机出bonus类型
    randomBonusType(){
        var rand = Math.floor(Math.random()*100) + 1
        var total = 0;
        for(var i = 0;i<this._propList.length;i++){
            total+=this._propList[i];
            if(rand <= total){
                return this._bonusTypeList[i];
            }
        }
    }

    //生成道具
    genBonus(){
        var tp = this.randomBonusType();
        if(tp == EnumBonusType.SUPERBULLET){
            var bonusNode = cc.instantiate(this._superbulletPrefab);
            bonusNode.zIndex = EnumDisplayLevel.BONUS;
            return bonusNode;
        }else if(tp == EnumBonusType.BOMB){
            var bonusNode = cc.instantiate(this._bombPrefab);
            bonusNode.zIndex = EnumDisplayLevel.BONUS;
            return bonusNode;
        }

        return null;
    }
}