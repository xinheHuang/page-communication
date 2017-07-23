/**
 * Created by Xinhe on 2017/7/22.
 */
function Message(sender,receiver,payload){
    this.sender=sender;
    this.receiver=receiver;
    this.payload=payload;
    this.time=new Date().getTime();
}
Message.prototype.getTime=function(){
    return this.time;
}

Message.prototype.getSender=function(){
    return this.sender;
}

Message.prototype.getReceiver=function(){
    return this.receiver;
}

Message.prototype.getPayload=function(){
    return this.getPayload;
}