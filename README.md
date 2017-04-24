# melonImageCrop
一个简单的头像上传插件，包括剪切预览/按钮旋转/鼠标滚轮缩放/按钮缩放/手机端触摸缩放，可自行配置缩放系数、按钮id、头像尺寸，包含php+json模拟存取数据

$('#mic-img-main').melonImageCrop({
    selectBtn: '#upload-file', //选择图片的按钮
    cropImgBox: '#mic-crop-box', //剪切预览显示图片的容器
    cropImgBtn: '#mic-crop-btn', //剪切预览图片的按钮
    zoomBigBtn: '#mic-zoom-big', //放大按钮
    zoomSmaBtn: '#mic-zoom-sma',
    zoomRatio: 1.3, //鼠标及滚轮缩小放大的倍率 n>1
    rotLeftBtn: '#mic-rot-left',
    rotRightBtn: '#mic-rot-right',
    imgUpBtn:'#mic-up-btn',
    touchRatio: 1, //手机端双指缩放系数  n>0
    imgBoxSize:200//剪切的圆形部分尺寸，切勿超过主框的大小
});
