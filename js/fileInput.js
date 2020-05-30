$('.custom-file-input').on('change',function(){
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
    //ファイルの取得
    file = $(this).prop('files')[0];
    console.log(file);
    //リサイズ後の高さと幅の最大値を定義
    const maxWidth = 500;
    const maxHeight = 500;
    //画像のリサイズ
    let image = new Image();
    let fileReader = new FileReader();
})
//ファイルの取消
$('.reset').click(function(){
    $(this).parent().prev().children('.custom-file-label').html('ファイル選択...');
    $('.custom-file-input').val('');
})
