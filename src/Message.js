/**
 * Created by xinhe on 2017/7/24.
 */
(function (PageCommunication) {
    var Message = function (sender, receiver, payload) {
        this.sender = sender;
        this.receiver = receiver;
        this.payload = payload;
        this.sendAll = false;
        this.time = new Date().getTime();

    }

    Message.prototype.setSendAll = function (sendAll) {
        this.sendAll = sendAll;
        return this;
    }


    Message.prototype.getSendAll = function () {
        return this.sendAll;
    }


    Message.prototype.getTime = function () {
        return this.time;
    }

    Message.prototype.getSender = function () {
        return this.sender;
    }

    Message.prototype.getPayload = function () {
        return this.payload;
    }
    Message.prototype.getReceiver=function(){
        return this.receiver;
    }
    PageCommunication.Message = Message;
})(window.PageCommunication = window.PageCommunication || {})