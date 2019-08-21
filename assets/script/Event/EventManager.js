export default class EventManager{

    constructor(){
        this.IEventDispatcher = new cc.EventTarget();
    }

    Register(type, callback, target) {
        this.IEventDispatcher.on(type, callback, target);
    }

    EmitOnce(type, callback, target) {
        this.IEventDispatcher.once(type, callback, target);
    }

    Emit(type, params = null) {
        this.IEventDispatcher.emit(type, params);
    }

    UnRegister(type,callback,target) {
        this.IEventDispatcher.off(type,callback,target);
    }

    UnRegister(target){
        this.IEventDispatcher.targetOff(target);
    }

}