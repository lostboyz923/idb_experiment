initializeDB();

function initializeDB() {
    let dbOpenRequest = window.indexedDB.open("myDB",1);

    dbOpenRequest.onupgradeneeded = function(event) {
        let db = event.target.result;

        let objectStore = db.createObjectStore("myObjectStore", { keyPath: "id" });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("evaluation", "evaluation", { unique: false });
        objectStore.createIndex("comment", "comment", { unique: false });
        objectStore.createIndex("images", "images", { unique: false });
    };
}

document.addEventListener("DOMContentLoaded", function(){
    let recode = $('.recode');

    let id = 1;
    rewriteWithIdb(recode, id);
});

$(function() {
    let id = 1;
    
    $('#name').on('change', function() {
        let name = $('#name').val();
        saveToIdb(id, 'name', name);
    });

    $('#evaluation').on('change', function() {
        let evaluation = $('#evaluation').val();
        saveToIdb(id, 'evaluation', evaluation);
    });

    $('#comment').on('change', function() {
        let comment = $('#comment').val();
        saveToIdb(id, 'comment', comment);
    });
});

function saveToIdb(id, key, value) {
    let dbOpenRequest = window.indexedDB.open("myDB");

    dbOpenRequest.onsuccess = function(event) {
        let db = dbOpenRequest.result;
        let transaction = db.transaction(["myObjectStore"], "readwrite");
        let objectStore = transaction.objectStore("myObjectStore");
        let objectGetRequest = objectStore.get(id);

        objectGetRequest.onsuccess = function(event) {
            let object = objectGetRequest.result;
            if(object == null) {
                let newObject = {
                    id: id
                };

                switch(key) {
                    case 'name':
                        newObject.name = value;
                        break;
                    case 'evaluation':
                        newObject.evaluation = value;
                        break;
                    case 'comment':
                        newObject.comment = value;
                        break;
                    case 'images':
                        newObject.images = value;
                        break;
                }

                objectStore.add(newObject);
            } else {
                switch(key) {
                    case 'name':
                        object.name = value;
                        break;
                    case 'evaluation':
                        object.evaluation = value;
                        break;
                    case 'comment':
                        object.comment = value;
                        break;
                    case 'images':
                        object.images = value;
                        break;
                }

                objectStore.put(object);
            }
        };

        objectGetRequest.onerror = function(error) {
            console.log(error);
        };
    };

    dbOpenRequest.onerror = function(error) {
        console.log(error);
    };
}

function rewriteWithIdb(recode, id) {
    let dbOpenRequest = window.indexedDB.open("myDB");

    dbOpenRequest.onsuccess = function(event) {
        let db = dbOpenRequest.result;
        let transaction = db.transaction(["myObjectStore"], "readwrite");
        let objectStore = transaction.objectStore("myObjectStore");
        let objectGetRequest = objectStore.get(id);

        objectGetRequest.onsuccess = function(event) {
            let object = objectGetRequest.result;
            if(object.name) {
                recode.find('#name').val(object.name);
            }

            if(object.evaluation) {
                recode.find('#evaluation').val(object.evaluation);
            }

            if(object.comment) {
                //recode.find('#comment').val(object.comment);
                $('#comment').val(object.comment);
            }
        };

        objectGetRequest.onerror = function(error) {
            console.log(error);
        };
    };

    dbOpenRequest.onerror = function(error) {
        console.log(error);
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