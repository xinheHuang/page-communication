/**
 * Created by xinhe on 2017/7/24.
 */
(function (PageCommunication) {
    var PageCommunicationStorage = function (registerName) {
        this.allMessages = [];
        this.receiveCallBack = null;
        this.registerName = registerName;
        this.storageKey = getStorageKey(registerName);
        if (localStorage.getItem(this.storageKey) !== null) {
            console.log(registerName + " exists");
        }
        this.save();
        function getStorageKey(registerName) {
            return PageCommunication.nameSpace + "_" + registerName;
        }
    }

    PageCommunicationStorage.prototype.send = function (receiver, message) {
        // this.update();
        this.allMessages.push(new PageCommunication.Message(this.registerName, receiver, message));
        this.save();
    }

    PageCommunicationStorage.prototype.sendAll = function (sender, message) {
        // this.update();
        this.allMessages.push(new PageCommunication.Message(this.registerName, null, message).setSendAll(true))
        this.save();
    }


    PageCommunicationStorage.prototype.receive = function (receiver, callback) {
        if (this.receiveCallBack) {
            window.removeEventListener('storage', this.receiveCallBack);
        }
        var that = this;
        var lastUpdateTime = 0;
        var _onStorage = function (event) {
            var messages = [];
            if (!event) {
                console.log(localStorage.length);
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    console.log(key);
                    console.log(localStorage.getItem(key));
                    var registerName = getRegisterName(key);
                    if (registerName === undefined) {
                        continue;
                    }
                    messages = messages.concat(checkMessageArray(localStorage.getItem(key)));
                }
                messages.sort(function compare(m1, m2) {
                    return m1.getTime() - m2.getTime();
                })
            }
            else {
                if (!event.key) {
                    return;
                }
                var registerName = getRegisterName(event.key);
                if (registerName === undefined) {
                    return;
                }
                messages = checkMessageArray(event.newValue);
            }
            if (messages && messages.length > 0) {
                callback(messages);
                lastUpdateTime = messages[messages.length - 1].getTime();
            }

            function checkMessageArray(messageArray) {
                var tempTime = lastUpdateTime;
                var allMessages = parseMessageArray(messageArray);
                var message = allMessages.pop();
                var messages = [];
                while (message && message.getTime() > lastUpdateTime) {
                    console.log(message);
                    if (message.receiver == that.registerName || message.getSendAll()) {
                        messages.unshift(message);
                    }
                    message = allMessages.pop();
                }
                console.log(messages);
                return messages;
            }

            function getRegisterName(key) {
                var registerName;
                if (key.indexOf(PageCommunication.nameSpace + "_") == 0) {
                    registerName = key.slice((PageCommunication.nameSpace + "_").length);
                }
                return registerName;
            }


            // setTimeout(function () {
            //     var oldReceiverMessages = that.getReceiverMessages(receiver);
            //     that.update();
            //     console.log(that);
            //     var receiverMessages = that.getReceiverMessages(receiver);
            //     if (!receiverMessages) return;
            //     // if (receiverMessages.equals(oldReceiverMessages)) return;
            //     var messages = receiverMessages.getMessages();
            //     var updateIndex = messages.length;
            //     messages.length
            //     if (messages && messages.length > 0) {
            //         callback(messages);
            //         // receiverMessages.clearAll();
            //     }
            // })
        };
        _onStorage();
        this.receiveCallBack = _onStorage;
        window.addEventListener('storage', _onStorage);
    }


    PageCommunicationStorage.prototype.init = function (registerName) {

        this.allMessages[registerName] = new PageCommunication.ReceiverMessages(registerName);
        this.save();
    }

    PageCommunicationStorage.prototype.clearAll = function () {
        this.allMessages = [];
        this.save();
    }

    PageCommunicationStorage.prototype.getMessages = function () {
        this.load();
        return this.allMessages;
    }

    PageCommunicationStorage.prototype.save = function () {
        localStorage.setItem(this.storageKey, JSON.stringify(this.allMessages));
    }
    PageCommunicationStorage.prototype.load = function () {
        this.allMessages = parseMessageArray(localStorage.getItem(this.storageKey));
    }

    function parseMessageArray(messageArray) {
        if (!messageArray) {
            throw new Error("storage not exists");
        }
        var storage = JSON.parse(messageArray);
        if (!Array.isArray(storage)) {
            throw new Error("storage type error");
        }

        return storage.map(function (d) {
            return NewInstance.call(PageCommunication.Message, d);
        })
    }

    function NewInstance(obj) {
        if (!obj) {
            throw new Error('instance error');
        }
        var newInstance = new this();
        for (var key in newInstance) {
            if (newInstance.hasOwnProperty(key) && typeof newInstance[key] !== "function") {
                if (!obj.hasOwnProperty(key)) {
                    throw new Error('instance error');
                }
                newInstance[key] = obj[key];
            }
        }
        return newInstance;
    }

    PageCommunication.PageCommunicationStorage = PageCommunicationStorage;

})(window.PageCommunication = window.PageCommunication || {})

