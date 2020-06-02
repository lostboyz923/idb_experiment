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
        let images = [];

        let canvas1 = $('#canvas1').get(0).toDataURL('image/jpeg');
        let canvas2 = $('#canvas2').get(0).toDataURL('image/jpeg');
        let canvas3 = $('#canvas3').get(0).toDataURL('image/jpeg');
        let canvas4 = $('#canvas4').get(0).toDataURL('image/jpeg');
        let canvas5 = $('#canvas5').get(0).toDataURL('image/jpeg');

        if(canvas1 != 'data:,') {
            let fileName = $('#customFile1')[0].files[0].name;
            let image = {
                fileName: fileName,
                image: canvas1
            };
            images.push(image);
        }

        if(canvas2 != 'data:,') {
            let fileName = $('#customFile2')[0].files[0].name;
            let image = {
                fileName: fileName,
                image: canvas2
            };
            images.push(image);
        }

        if(canvas3 != 'data:,') {
            let fileName = $('#customFile3')[0].files[0].name;
            let image = {
                fileName: fileName,
                image: canvas3
            };
            images.push(image);
        }

        if(canvas4 != 'data:,') {
            let fileName = $('#customFile4')[0].files[0].name;
            let image = {
                fileName: fileName,
                image: canvas4
            };
            images.push(image);
        }

        if(canvas5 != 'data:,') {
            let fileName = $('#customFile5')[0].files[0].name;
            let image = {
                fileName: fileName,
                image: canvas5
            };
            images.push(image);
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

        objectGetRequest.onsuccess = function(event) {
            let object = objectGetRequest.result;
            
            if(object.images) {
                let index = 1;
                for(i=0; i<object.images.length; i++) {
                    $('#customFile'+index).next('.custom-file-label').html(object.images[i].fileName);
                    let canvas = $('#canvas'+index);
                    let ctx = canvas[0].getContext('2d');
                    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

                    let img = new Image();
                    img.onload = function() {
                        console.log(img.src);
                        console.log(canvas[0].width);
                        console.log(canvas[0].height);
                        console.log(img.width);
                        console.log(img.height);
                        ctx.drawImage(img, 0, 0, canvas[0].width, canvas[0].height, 0, 0, img.width, img.height);
                    };
                    img.src = object.images[i].image;
                    
                    index = index + 1;
                }
            }
        };

    };

}
