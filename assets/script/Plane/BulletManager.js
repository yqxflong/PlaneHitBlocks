import CONFIG from "./Common/Config";
import EnumBulletType from "./Common/EnumBulletType";
import EnumDisplayLevel from "./Common/EnumDisplayLevel";

export default class BulletManager{

    constructor(planeScript){
        this._viewSize = cc.view.getVisibleSize();
        this._myPlaneScript = planeScript;
        this._intervalBulletNormal = CONFIG.INTERVAL_BULLETNORMAL;
        this._intervalBulletSuper = CONFIG.INTERVAL_BULLETSUPER;
        this._myBulletType = EnumBulletType.NORMAL;
        this._alivedBullets_ver = [];
        this._alivedBullets_left = [];
        this._alivedBullets_right = [];

        cc.loader.loadRes("prefab/Bullet", (err, prefab)=>{
            if(!err){
                this._bulletPrefab = prefab;
            }else{
                console.log("load prefab/Bullet Error!");
            }
        });
    }

    update(dt){
        this.emissionBulletOnce(dt);
        this.moveBullets(dt);
        this.checkBulletsAlived();
    }

    getAlivedBullets(){
        return this._alivedBullets_ver;
    }

    changeBulletType(bulletType){
        this._myBulletType = bulletType;
    }

    checkBulletsAlived(){
        for(var i = 0;i<this._alivedBullets_ver.length;){
            var bulletNode = this._alivedBullets_ver[i];
            if(bulletNode.y >= this._viewSize.height){
                bulletNode.removeFromParent();
                this._alivedBullets_ver.splice(i, 1);
            }else{
                i++;
            }
        }
        for(var i = 0;i<this._alivedBullets_left.length;){
            var bulletNode = this._alivedBullets_left[i];
            if(bulletNode.y >= this._viewSize.height){
                bulletNode.removeFromParent();
                this._alivedBullets_left.splice(i, 1);
            }else{
                i++;
            }
        }
        for(var i = 0;i<this._alivedBullets_right.length;){
            var bulletNode = this._alivedBullets_right[i];
            if(bulletNode.y >= this._viewSize.height){
                bulletNode.removeFromParent();
                this._alivedBullets_right.splice(i, 1);
            }else{
                i++;
            }
        }
    }

    moveBullets(dt){
        for(var i = 0;i<this._alivedBullets_ver.length;i++){
            var bulletNode = this._alivedBullets_ver[i];
            bulletNode.y += CONFIG.DIS_BULLET;
        }

        for(var i = 0;i<this._alivedBullets_left.length;i++){
            var bulletNode = this._alivedBullets_left[i];
            bulletNode.x -= Math.sin(75) * CONFIG.DIS_BULLET;
            bulletNode.y += Math.cos(75) * CONFIG.DIS_BULLET;
        }

        for(var i = 0;i<this._alivedBullets_right.length;i++){
            var bulletNode = this._alivedBullets_right[i];
            bulletNode.x += Math.sin(75) * CONFIG.DIS_BULLET;
            bulletNode.y += Math.cos(75) * CONFIG.DIS_BULLET;
        }
    }

    genBullet_ver(){
        var bulletNode = cc.instantiate(this._bulletPrefab);
        bulletNode.zIndex = EnumDisplayLevel.PLANE;
        this._myPlaneScript.node.parent.addChild(bulletNode);
        bulletNode.x = this._myPlaneScript.node.x;
        bulletNode.y = this._myPlaneScript.node.y + this._myPlaneScript.node.height*0.5;
        this._alivedBullets_ver.push(bulletNode);

        return bulletNode;
    }

    genBullet_left(){
        var bulletNode = cc.instantiate(this._bulletPrefab);
        bulletNode.zIndex = EnumDisplayLevel.PLANE;
        this._myPlaneScript.node.parent.addChild(bulletNode);
        bulletNode.x = this._myPlaneScript.node.x;
        bulletNode.y = this._myPlaneScript.node.y + this._myPlaneScript.node.height*0.5;
        this._alivedBullets_left.push(bulletNode);

        return bulletNode;
    }

    genBullet_right(){
        var bulletNode = cc.instantiate(this._bulletPrefab);
        bulletNode.zIndex = EnumDisplayLevel.PLANE;
        this._myPlaneScript.node.parent.addChild(bulletNode);
        bulletNode.x = this._myPlaneScript.node.x;
        bulletNode.y = this._myPlaneScript.node.y + this._myPlaneScript.node.height*0.5;
        this._alivedBullets_right.push(bulletNode);

        return bulletNode;
    }

    emissionBulletOnce(dt){
        if(this._myBulletType == EnumBulletType.SUPER){
            this.emissionBulletSuper(dt);
        }else{
            this.emissionBulletNormal(dt);
        }
    }

    emissionBulletNormal(dt){
        if(this._intervalBulletNormal > 0){
            this._intervalBulletNormal -= dt;
            return;
        }

        this._intervalBulletNormal = CONFIG.INTERVAL_BULLETNORMAL;
        this.genBullet_ver();
    }

    emissionBulletSuper(dt){
        if(this._intervalBulletSuper > 0){
            this._intervalBulletSuper -= dt;
            return;
        }

        this._intervalBulletSuper = CONFIG.INTERVAL_BULLETSUPER;
        this.genBullet_ver();
        this.genBullet_left();
        this.genBullet_right();
    }
}