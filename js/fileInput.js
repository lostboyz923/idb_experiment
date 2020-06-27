$('.custom-file-input').on('change',function(){
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
    //ファイルの取得
    file = $(this).prop('files')[0];
    resizeImage(file, $(this));
})
//ファイルの取消
$('.reset').click(function(){
    $(this).parent().prev().children('.custom-file-label').html('ファイル選択...');
    $('.custom-file-input').val('');

    //canvasを削除する
    let canvas = $(this).parents('.image').find('.canvas');
    let ctx = canvas[0].getContext('2d');
    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
    canvas.attr('width', 0).attr('height', 0);
})

//画像のリサイズ
function resizeImage(file, target) {
    console.log(file);
    //リサイズ後の幅と高さの最大値を定義
    const maxWidth = 500;
    const maxHeight = 500;

    let image = new Image();
    let fileReader = new FileReader();
    fileReader.onload = function(event) {
        image.onload = function() {
            //元画像の幅と高さ
            let width = image.width;
            let height = image.height;
            console.log('before width:'+width);
            console.log('before height:'+height);
            //画像が1MBより大きければリサイズ対象とする
            if(file.size > 1024 * 1024 * 1) {
                if(width > height) {
                    //横長画像
                    let ratio = height / width;
                    width = maxWidth;
                    height = maxWidth * ratio;
                } else {
                    //縦長画像
                    let ratio = width / height;
                    width = maxHeight * ratio;
                    height = maxHeight;
                }
            }
            //canvas
            let canvas = target.parents('.image').find('.canvas').attr('width', width).attr('height', height);
            let ctx = canvas[0].getContext('2d');

            //canvasに描画されている画像を削除
            ctx.clearRect(0,0,width,height);

            //画像を描画する
            ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);
            
            console.log('after width:'+width);
            console.log('after height:'+height);
        };
        image.src = event.target.result;
    };
    fileReader.readAsDataURL(file);
}
