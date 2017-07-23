/**
 * Created by Xinhe on 2017/7/22.
 */

(function (PageCommunication) {
    var isRegister = false;
    var registerName = null;
    var isInit = false;
    var pageCommunicationStorage;

    PageCommunication.init = function (nameSpace) {
        PageCommunication.nameSpace = nameSpace || "pageCommunication";
        pageCommunicationStorage = PageCommunicationStorage.load(PageCommunication.nameSpace);
        isInit = true;
    }

    function checkInit() {
        if (typeof (Storage) === undefined) {
            throw new Error("storage not support");
        }
        if (!isInit) {
            throw new Error('not init');
        }
    }

    PageCommunication.register = function (name, opts) {
        checkInit();
        if (isRegister) {
            throw new Error('already Registered');
        }
        var defaultOpts = {
            allowSame: false,
        }
        registerName = name;
        isRegister = true;
    }

    PageCommunication.unRegister = function () {
        checkInit();
        if (!isRegister) {
            throw new Error('not Registered yet');
        }
        registerName = null;
        isRegister = false;
    }
    PageCommunication.send = function (message,receiver) {
        checkInit();
        if (!isRegister) {
            throw new Error('not Registered yet');
        }
        pageCommunicationStorage.send(registerName, receiver, message)
    }

    PageCommunication.receive = function (callback) {
        checkInit();
        if (!isRegister) {
            throw new Error('not Registered yet');
        }
        pageCommunicationStorage.receive(registerName, callback);
    }


    function PageCommunicationStorage(nameSpace) {
        this.allMessages = {};
        var receiveCallBack = null;
        this.getReceiveCallBack = function () {
            return receiveCallBack;
        }
        this.setReceiveCallBack = function (callback) {
            receiveCallBack = callback;
        }
    }

    function Message(sender, receiver, payload) {
        this.sender = sender;
        this.receiver = receiver;
        this.payload = payload;
        this.time = new Date().getTime();
    }

    function instance(Constructor, obj) {
        if (!obj) {
            throw new Error('instance error');
        }
        var newInstance = new Constructor();
        for (var key in newInstance) {
            if (newInstance.hasOwnProperty(key) && typeof newInstance[key]!=="function") {

                if (!obj.hasOwnProperty(key)) {
                    throw new Error('instance error');
                }
                newInstance[key] = obj[key];
            }
        }
        return newInstance;
    }

    Message.prototype.getTime = function () {
        return this.time;
    }

    Message.prototype.getSender = function () {
        return this.sender;
    }

    Message.prototype.getReceiver = function () {
        return this.receiver;
    }

    Message.prototype.getPayload = function () {
        return this.payload;
    }


    function ReceiverMessages(receiver) {
        this.messages = [];
        this.receiver = receiver;
    }

    ReceiverMessages.prototype.addMessage = function (message) {
        if (!(message instanceof Message)) {
            throw new Error("message invalid");
        }
        if (!this.messages || !Array.isArray(this.messages)) {
            this.messages = [];
        }
        this.messages.push(message);
    }
    ReceiverMessages.prototype.clearAll = function () {
        this.messages = [];
        // console.log(pageCommunicationStorage);
        pageCommunicationStorage.save();
    }
    ReceiverMessages.prototype.getMessages = function () {
        return this.messages;
    }

    PageCommunicationStorage.prototype.send = function (sender, receiver, message) {
        this.update();
        if (!this.allMessages[receiver]) this.allMessages[receiver] = new ReceiverMessages(receiver);
        this.allMessages[receiver].addMessage(new Message(sender, receiver, message));
        this.save();
    }

    PageCommunicationStorage.prototype.receive = function (receiver, callback) {
        if (this.getReceiveCallBack()) {
            window.removeEventListener('storage', this.getReceiveCallBack());
        }
        var that = this;
        var receiveCallback=function () {
            that.update();
            var receiverMessages = that.getReceiverMessages(receiver);
            var messages = receiverMessages.getMessages();
            if (messages && messages.length > 0) {
                callback(messages);
                receiverMessages.clearAll();
            }
        };
        receiveCallback();
        this.setReceiveCallBack(receiveCallback);
        window.addEventListener('storage',receiveCallback);
    }

    PageCommunicationStorage.prototype.update = function () {
        var newPageCommunicationStorage = PageCommunicationStorage.load();
        this.allMessages = newPageCommunicationStorage.allMessages;
    }


    PageCommunicationStorage.prototype.getReceiverMessages = function (receiver) {
        return this.allMessages[receiver];
    }
    PageCommunicationStorage.prototype.save = function () {
        window.localStorage.setItem(PageCommunication.nameSpace, this.toString());
    }
    PageCommunicationStorage.prototype.toString = function () {
        return JSON.stringify(this);
    }
    PageCommunicationStorage.prototype.toObject = function () {
        var pageCommunicationStorage = new PageCommunicationStorage(PageCommunication.nameSpace);
        pageCommunicationStorage
        return pageCommunicationStorage;
    }

    PageCommunicationStorage.load = function () {
        var pageCommunicationStorage = window.localStorage.getItem(PageCommunication.nameSpace);
        if (!pageCommunicationStorage) {
            return new PageCommunicationStorage(PageCommunication.nameSpace);
        }
        pageCommunicationStorage = JSON.parse(pageCommunicationStorage);
        console.log(pageCommunicationStorage);
        pageCommunicationStorage = instance(PageCommunicationStorage, pageCommunicationStorage);
        for (var key in pageCommunicationStorage.allMessages) {

            if (pageCommunicationStorage.allMessages.hasOwnProperty(key)) {

                var receiverMessage = pageCommunicationStorage.allMessages[key];
                pageCommunicationStorage.allMessages[key] = instance(ReceiverMessages,
                                                                     pageCommunicationStorage.allMessages[key]);
                pageCommunicationStorage.allMessages[key].messages = pageCommunicationStorage.allMessages[key].messages.map(
                    function (d) {
                        return instance(Message, d);
                    })
            }
        }
        console.log('loadStorage');
        console.log(pageCommunicationStorage);
        return pageCommunicationStorage;
    }


})(window.PageCommunication = window.PageCommunication || {})
