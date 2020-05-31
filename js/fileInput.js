$('.custom-file-input').on('change',function(){
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
    //ファイルの取得
    file = $(this).prop('files')[0];
})
//ファイルの取消
$('.reset').click(function(){
    $(this).parent().prev().children('.custom-file-label').html('ファイル選択...');
    $('.custom-file-input').val('');
})

// 画像のリサイズ
function resizeImage(file) {
    //リサイズ後の幅と高さの最大値を定義
    const maxWidth = 500;
    const maxHeight = 500;

    let image = new Image();
    let fileReader = new FileReader();
    fileReader.onload = function(event) {
        image.onload = function() {
            // 元画像の幅と高さ
            let width = image.width;
            let height = image.height;
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
        };
    };
}