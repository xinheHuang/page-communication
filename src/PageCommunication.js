/**
 * Created by Xinhe on 2017/7/22.
 */

(function (PageCommunication) {
    var isRegister = false;
    // var registerName = null;
    var isInit = false;
    var pageCommunicationStorage;

    function checkInit() {
        if (!isInit) {
            throw new Error('not init');
        }
    }

    function checkRegister() {
        if (!isRegister) {
            throw new Error('not register');
        }
    }


    PageCommunication.init = function (nameSpace) {
        if (typeof (Storage) === undefined) {
            throw new Error("storage not support");
        }
        PageCommunication.nameSpace = nameSpace || "pageCommunication";
        // pageCommunicationStorage = PageCommunication.PageCommunicationStorage.load(
        //     PageCommunication.nameSpace);
        // PageCommunication.pageCommunicationStorage = pageCommunicationStorage;
        isInit = true;
    }


    PageCommunication.register = function (name, opts) {
        checkInit();
        isRegister = true;
        var defaultOpts = {
            allowSame: false,
        }
        registerName = name;
        pageCommunicationStorage = new PageCommunication.PageCommunicationStorage(name);
        // pageCommunicationStorage.init(registerName);
    }

    PageCommunication.unRegister = function () {
        checkInit();
        checkRegister();
        localStorage.removeItem(pageCommunicationStorage.storageKey);
        pageCommunicationStorage = null;
        isRegister = false;
    }
    PageCommunication.send = function (receiver, message) {
        checkInit();
        checkRegister();
        pageCommunicationStorage.send(receiver, message)
    }

    PageCommunication.sendAll = function (message) {
        checkInit();
        checkRegister();
        pageCommunicationStorage.sendAll(registerName, message)
    }


    PageCommunication.receive = function (callback) {
        checkInit();
        checkRegister();
        pageCommunicationStorage.receive(registerName, callback);
    }
    PageCommunication.clear = function () {
        checkInit();
        checkRegister();
        pageCommunicationStorage.init(registerName);
    }
})(window.PageCommunication = window.PageCommunication || {})
