initializeDB();

function initializeDB() {
    let dbOpenRequest = window.indexedDB.open("myDB",1);

    dbOpenRequest.onupgradeneeded = function(event) {
        let db = event.target.result;

        let objectStore = db.createObjectStore("myObjectStore", { keyPath: "id" });
        objectStore.createIndex("index1", "index1", { unique: false });
        objectStore.createIndex("index2", "index2", { unique: false });
        objectStore.createIndex("index3", "index3", { unique: false });
        objectStore.createIndex("index4", "index4", { unique: false });
        objectStore.createIndex("index5", "index5", { unique: false });
    };
}

function saveData() {
    return new Promise(function(resolve, reject) {
        let tmpData = { 
            id: "first",
            index1: "1",
            index2: "2",
            index5: {
                index5a: "5-a",
                index5b: "5-b",
                index5c: "5-c"
            }
        };

        let dbOpenRequest = window.indexedDB.open("myDB");

        dbOpenRequest.onsuccess = function(event) {
            this.result.transaction(["myObjectStore"], "readwrite").objectStore("myObjectStore").add(tmpData);
            resolve();
        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };
    });
}

function getData() {
    return new Promise(function(resolve, reject) {
        let dbOpenRequest = window.indexedDB.open("myDB");

        dbOpenRequest.onsuccess = function(event) {
            let objectStoreGetAllRequest = this.result.transaction(["myObjectStore"], "readwrite").objectStore("myObjectStore").getAll();
            objectStoreGetAllRequest.onsuccess = function(event) {
                let data = event.target.result;
                console.log(data[0].index5.index5b);
            };
            resolve();
        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };

    });
}