export default class PlayerData{
    constructor(){
        this._myTraveDis = 0;
        this._myScore = 0;
        this._myBombCnt = 0;
    }

    setMyTravelDis(dis){
        this._myTraveDis = dis;
    }

    getMyTravelDis(){
        return this._myTraveDis;
    }

    addMyScore(cnt){
        this._myScore += cnt;
    }

    getMyScore(){
        return this._myScore;
    }

    addMyBombCnt(cnt){
        this._myBombCnt += cnt;
    }

    decreaseMyBombCnt(cnt){
        this._myBombCnt -= cnt;
    }

    getMyBombCnt(){
        return this._myBombCnt;
    }
}