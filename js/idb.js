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

        $('.recode').find('#commentText').val(comment);
    });

    $('.comment').on('click', function() {
        rewriteCommentWithIdb(id);
    });

    $('.images').on('click', function() {
        displayImages(id);
    });

    $('#close').on('click', function() {
        let canvas1 = $('#canvas1').get(0).toDataURL('image/jpeg');
        let canvas2 = $('#canvas2').get(0).toDataURL('image/jpeg');
        let canvas3 = $('#canvas3').get(0).toDataURL('image/jpeg');
        let canvas4 = $('#canvas4').get(0).toDataURL('image/jpeg');
        let canvas5 = $('#canvas5').get(0).toDataURL('image/jpeg');

        let images = [];
        let order = 1;

        if(canvas1 != 'data:,') {
            let image = {
                order: order,
                image: canvas1,
            };
            images.push(image);
            order = order + 1;
        }

        if(canvas2 != 'data:,') {
            let image = {
                order: order,
                image: canvas2,
            };
            images.push(image);
            order = order + 1;
        }

        if(canvas3 != 'data:,') {
            let image = {
                order: order,
                image: canvas3,
            };
            images.push(image);
            order = order + 1;
        }

        if(canvas4 != 'data:,') {
            let image = {
                order: order,
                image: canvas4,
            };
            images.push(image);
            order = order + 1;
        }

        if(canvas5 != 'data:,') {
            let image = {
                order: order,
                image: canvas5,
            };
            images.push(image);
            order = order + 1;
        }

        saveToIdb(id, 'images', images);

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

function displayImages(id) {
    let dbOpenRequest = window.indexedDB.open("myDB");

    dbOpenRequest.onsuccess = function(event) {
        let db = dbOpenRequest.result;
        let transaction = db.transaction(["myObjectStore"], "readwrite");
        let objectStore = transaction.objectStore("myObjectStore");
        let objectGetRequest = objectStore.get(id);

        const imageList = $('#image-list').get(0);
        
        objectGetRequest.onsuccess = function(event) {
            let object = objectGetRequest.result;
            
            if(object.images) {
                for(i=0; i<object.images.length; i++) {
                    let div = document.createElement('div')
                    div.innerHTML="<img src ="+object.images[i].image+">";
                    imageList.appendChild(div);
                }
            }
        };

    };

}
