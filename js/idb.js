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
    let id = 1;
    getObjectFromIdb(id).then(function(object) {
        if(object != null) {
            if(object.name != null) {
                $('.recode').find('#name').val(object.name);
            }
    
            if(object.evaluation != null) {
                $('.recode').find('#evaluation').val(object.evaluation);
            }
    
            if(object.comment != null) {
                $('.recode').find('#commentText').val(object.comment);
            }
        }
    })
    .catch(function(error) {
        alert(error);
    });

});

$(function() {
    let id = 1;
    
    $('#name').on('change', function() {
        let name = $('#name').val();
        saveToIdb(id, 'name', name)
        .catch(function(error) {
            alert(error);
        });
    });

    $('#evaluation').on('change', function() {
        let evaluation = $('#evaluation').val();
        saveToIdb(id, 'evaluation', evaluation)
        .catch(function(error) {
            alert(error);
        });
    });

    $('#comment').on('change', function() {
        let comment = $('#comment').val();
        saveToIdb(id, 'comment', comment)
        .catch(function(error) {
            alert(error);
        });

        $('.recode').find('#commentText').val(comment);
    });

    $('.comment').on('click', function() {
        $('#comment').val($('.recode').find('#commentText').val());
    });

    $('.images').on('click', function() {
        //labelとcanvasを削除する
        for(i=1; i<=5; i++) {
            $('#customFile'+i).next('.custom-file-label').html('ファイル選択...');
            let canvas = $('#canvas'+i);
            let ctx = canvas[0].getContext('2d');
            ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
            canvas.attr('width', 0).attr('height', 0);
        }
        //保存されている画像をcanvasに描画する
        getObjectFromIdb(id).then(function(object) {
            if(object && object.images) {
                let index = 1;
                for(i=0; i<object.images.length; i++) {
                    $('#customFile'+index).next('.custom-file-label').html(object.images[i].fileName);
                    let canvas = $('#canvas'+index);
                    let ctx = canvas[0].getContext('2d');
                    
                    let img = new Image();
                    img.onload = function() {
                        canvas.attr('width', img.width).attr('height', img.height)
                        ctx.drawImage(img, 0, 0, canvas[0].width, canvas[0].height, 0, 0, img.width, img.height);
                    };
                    img.src = object.images[i].dataUri;
                    
                    index = index + 1;
                }
            }
        })
        .catch(function(error) {
            alert(error);
        });
    });

    $('#close').on('click', function() {
        let images = [];

        for(i=1; i<=5; i++) {
            let fileName = $('#customFile'+i).next('.custom-file-label').html()
            let canvas = $('#canvas'+i).get(0).toDataURL('image/jpeg');

            if(canvas != 'data:,') {
                let image = {
                    fileName: fileName,
                    dataUri: canvas
                };
                images.push(image);
            }
        }

        saveToIdb(id, 'images', images)
        .catch(function(error) {
            alert(error);
        });

    });
});

function saveToIdb(id, key, value) {
    return new Promise(function(resolve, reject) {
        let dbOpenRequest = window.indexedDB.open("myDB");
    
        dbOpenRequest.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(["myObjectStore"], "readwrite");
            let objectStore = transaction.objectStore("myObjectStore");
            let objectGetRequest = objectStore.get(id);
    
            objectGetRequest.onsuccess = function(event) {
                let object = event.target.result;
                if(object == null) {
                    let newObject = { id: id };
                    newObject[key] = value;
    
                    objectStore.add(newObject);
                } else {
                    object[key] = value;
    
                    objectStore.put(object);
                }
                resolve();
            };

            objectGetRequest.onerror = function(error) {
                reject(error);
            };
    
        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };

    });

}

function getObjectFromIdb(id) {
    return new Promise(function(resolve, reject) {
        let dbOpenRequest = window.indexedDB.open("myDB");

        dbOpenRequest.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(["myObjectStore"]);
            let objectStore = transaction.objectStore("myObjectStore");
            let objectGetRequest = objectStore.get(id);

            objectGetRequest.onsuccess = function(event) {
                let object = event.target.result;
                resolve(object);
            };

            objectGetRequest.onerror = function(error) {
                reject(error);
            };

        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };
    
    }); 

}

function getAllObjectsFromIdb(id) {
    return new Promise(function(resolve, reject) {
        let dbOpenRequest = window.indexedDB.open("myDB");
    
        dbOpenRequest.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(["myObjectStore"], "readwrite");
            let objectStore = transaction.objectStore("myObjectStore");
            let keyRange = IDBKeyRange.only(id);
            let objectsGetAllRequest = objectStore.getAll(keyRange);
    
            objectsGetAllRequest.onsuccess = function(event) {
                let objects = event.target.result;
                resolve(objects);
            };

            objectsGetAllRequest.onerror = function(error) {
                reject(error);
            };

        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };

    });

}

function clearObjectsFromIdb() {
    return new Promise(function(resolve, reject) {
        let dbOpenRequest = window.indexedDB.open("myDB");

        dbOpenRequest.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(["myObjectStore"], "readwrite");
            let objectStore = transaction.objectStore("myObjectStore");

            let objectClearRequest = objectStore.clear();

            objectClearRequest.onsuccess = function(event) {
                resolve();
            };

            objectClearRequest.onerror = function(error) {
                reject(error);
            };

        };

        dbOpenRequest.onerror = function(error) {
            reject(error);
        };

    });
}
