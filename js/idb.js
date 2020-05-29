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

        let recode = $('.recode');
        rewriteWithIdb(recode, id);
    });

    $('.comment').on('click', function() {
        rewriteCommentWithIdb(id);
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
                let newObject = { id: id };
                newObject[key] = value;

                objectStore.add(newObject);
            } else {
                object[key] = value;

                objectStore.put(object);
            }
        };

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
                recode.find('#commentText').val(object.comment);
            }
        };

    };

}

function rewriteCommentWithIdb(id) {
    let dbOpenRequest = window.indexedDB.open("myDB");

    dbOpenRequest.onsuccess = function(event) {
        let db = dbOpenRequest.result;
        let transaction = db.transaction(["myObjectStore"], "readwrite");
        let objectStore = transaction.objectStore("myObjectStore");
        let objectGetRequest = objectStore.get(id);

        objectGetRequest.onsuccess = function(event) {
            let object = objectGetRequest.result;
            
            if(object.comment) {
                $('#comment').val(object.comment);
            }
        };

    };

}
