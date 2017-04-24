(function ($) {
    //默认参数 (放在插件外面，避免每次调用插件都调用一次，节省内存)
    var melonTouchConfig = {
        selectBtn: '#upload-file',
        cropImgBox: '#mic-crop-box',
        cropImgBtn: '#mic-crop-btn',
        zoomRatio: 1.1, //按钮放大缩小倍率
        zoomBigBtn: '#mic-zoom-big', //放大按钮
        zoomSmaBtn: '#mic-zoom-sma',
        rotLeftBtn: '#mic-rot-left', //左旋转按钮
        rotRightBtn: '#mic-rot-right',
        imgUpBtn: '#mic-up-btn',
        touchRatio: 1, //手机端双指缩放系数
        imgBoxSize: 300 //头像显示范围的尺寸 
    };
    var param = {
        mouseFlag: 0, //鼠标状态，1代表按住，0代表放开
        mainBoxWidth: 0, //主容器宽度
        mainBoxHeight: 0, //主容器高度
        backPosX: 0, //背景图位置x坐标
        backPosY: 0,
        mouseIniX: 0, //鼠标点下后的初始x坐标
        mouseIniY: 0,
        curImgWidth: 0, //当前背景图宽度
        curImgHeight: 0,
        curImgRotate: 0, //当前旋转角度
        touchIniX2: 0, //手机端双指触摸放大或缩小时第二个手指的x坐标
        touchIniY2: 0,
        imgData:0
    }
    var imgObj = new Image(); //图片对象
    $.fn.extend({
        melonImageCrop: function (options) {
            var opts = fnTotal.iniConfig(options, $(this));

            return this.each(function () {
                $imgBox = $(this);
                param.mainBoxWidth = parseInt($imgBox.width());
                param.mainBoxHeight = parseInt($imgBox.innerHeight());
                $(opts.selectBtn).on('change', function () {
                    var imgData = this;
                    fnTotal.selectImage(imgData, $imgBox, $(opts.cropImgBtn), $(opts.cropImgBox), opts.imgBoxSize);
                });
                $imgBox.on('mousedown', function (e) {
                    fnTotal.mouseDown(e);
                });
                $imgBox.on('mouseup', function (e) {
                    fnTotal.mouseUp(e, $imgBox);
                });
                $imgBox.on('mousemove', function (e) {
                    fnTotal.mouseMove(e);
                });
                $(opts.zoomBigBtn).on('click', function () {
                    fnTotal.zoomBiger($imgBox, opts.zoomRatio);
                });
                $(opts.zoomSmaBtn).on('click', function () {
                    fnTotal.zoomSmaller($imgBox, opts.zoomRatio);
                });
                $(opts.rotLeftBtn).on('click', function () {
                    fnTotal.setImgRotate($imgBox, -90);
                });
                $(opts.rotRightBtn).on('click', function () {
                    fnTotal.setImgRotate($imgBox, 90);
                });
                $(opts.imgUpBtn).on('click', function () {
                    fnTotal.upImg();
                });
                $imgBox.on('touchstart', function (e) {
                    fnTotal.imgTouchStart(e);
                });
                $imgBox.on('touchmove', function (e) {
                    fnTotal.imgTouchMove(e, $(this), opts.touchRatio);
                });
                $imgBox.on('touchend', function (e) {
                    fnTotal.imgTouchEnd(e, $(this));
                });
                $imgBox.on('mousewheel DOMMouseScroll', function (e) {
                    e.preventDefault()
                    fnTotal.mouseWheel(e, $(this), opts.zoomRatio);
                });
            });
        }
    });

    fnTotal = {
        iniConfig: function (options, elImgBox) {
            //extend前台配置参数
            elImgBox.children('.mic-zzc').css({
                "width": options.imgBoxSize,
                "height": options.imgBoxSize,
                "margin": (elImgBox.width() - options.imgBoxSize) / 2
            });
            options.imgBoxSize;
            return $.extend(melonTouchConfig, options);
        },
        //选择图片时设置容器的背景图
        selectImage: function (imgData, elImgBox, elCrop, cropImgBox, backSize) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //加载图片完成，取得图片的base64                
                imgObj.src = e.target.result;

                //初始化位置
                var bWidth = backSize;
                var bHeight = backSize / imgObj.width * imgObj.height;
                var posLeft = (param.mainBoxWidth - bWidth) / 2;
                var posTop = (param.mainBoxHeight - bHeight) / 2;
                param.backPosX = posLeft;
                param.backPosY = posTop;
                param.curImgWidth = bWidth;
                param.curImgHeight = bHeight;
                elImgBox.css({
                    "background-image": "url(" + imgObj.src + ")",
                    "background-position": posLeft + 'px ' + posTop + 'px',
                    "background-size": bWidth + 'px ' + bHeight + 'px'
                });

                //开启剪切图片的功能
                fnTotal.getCropImage(elCrop, cropImgBox, backSize);
            }
            reader.readAsDataURL(imgData.files[0]);

        },
        //使用canvas剪切图片
        getCropImage: function (elCrop, cropImgBox, backSize) {
            elCrop.on('click', function () {
                var canvas = document.createElement("canvas");
                canvas.width = backSize;
                canvas.height = backSize;

                var context = canvas.getContext("2d");

                context.translate(backSize / 2, backSize / 2);

                //旋转
                context.rotate(param.curImgRotate * Math.PI / 180);
                var cropX = param.backPosX - (param.mainBoxWidth - param.curImgWidth) / 2;
                var cropY = param.backPosY - (param.mainBoxHeight - param.curImgHeight) / 2;
                context.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, cropX - param.curImgWidth / 2, cropY - param.curImgHeight / 2, param.curImgWidth, param.curImgHeight);

                var imageData = canvas.toDataURL('image/png');
                cropImgBox.html('');
                //生成预览图

                cropImgBox.append('<div class=""><img src="' + imageData + '" "></div>');
                param.imgData = imageData;
            });

        },
        //ajax上传图片的bolb
        upImg: function () {
            if(param.imgData==0){
                $('.mic-img-tip').html('<span>*</span>请先上传/剪切图片');
                return false;
            }
            $.ajax({
                    url: './getImg.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        imgBolb: param.imgData
                    },
                })
                .done(function (data) {
                    if(data==0){
                        $('.mic-img-tip').html('<span>*</span>文件写入失败');
                    }
                    if(data==1){
                        $('.mic-img-tip').html('<span>*</span>文件写入成功');
                        $('#mic-crop-box').prepend("<a href='showImg.php'>查看上传的图片</a>")
                    }
                })
                .fail(function () {
                    $('.mic-img-tip').html('<span>*</span>文件写入失败');
                })
                
        },
        //设置背景图位置
        setBackPos: function (elImgBox, posX, posY) {
            elImgBox.css({
                "background-position": posX + 'px ' + posY + 'px'
            });
        },
        mouseDown: function (e) {
            param.mouseFlag = 1;
            param.mouseIniX = e.clientX;
            param.mouseIniY = e.clientY;
        },
        mouseMove: function (e) {
            if (param.mouseFlag) {
                var bgY = 0;
                var bgX = 0;
                var changeX = e.clientX - param.mouseIniX;
                var changeY = e.clientY - param.mouseIniY;
                if (param.curImgRotate % 360 == 0) {
                    bgX = changeX + param.backPosX;
                    bgY = changeY + param.backPosY;
                }
                if (param.curImgRotate % 360 == 90 || param.curImgRotate % 360 == -270) {
                    bgY = -changeX + param.backPosY;
                    bgX = changeY + param.backPosX;
                }
                if (param.curImgRotate % 360 == 180 || param.curImgRotate % 360 == -180) {
                    bgX = -changeX + param.backPosX;
                    bgY = -changeY + param.backPosY;
                }
                if (param.curImgRotate % 360 == 270 || param.curImgRotate % 360 == -90) {
                    bgY = changeX + param.backPosY;
                    bgX = -changeY + param.backPosX;
                }
                this.setBackPos($imgBox, bgX, bgY);
            }
        },
        mouseUp: function (e, elImgBox) {
            var bg = elImgBox.css('background-position').split(' ');
            param.backPosX = parseInt(bg[0]);
            param.backPosY = parseInt(bg[1]);
            param.mouseIniX = 0;
            param.mouseIniY = 0;
            param.mouseFlag = 0;
        },
        //放大
        zoomBiger: function (elImgBox, zoomRatio) {
            param.curImgWidth = param.curImgWidth * zoomRatio;
            param.curImgHeight = param.curImgHeight * zoomRatio;
            elImgBox.css({
                "background-size": param.curImgWidth + 'px ' + param.curImgHeight + 'px'
            });
            this.setBackPosCenter(elImgBox);
        },
        //缩小
        zoomSmaller: function (elImgBox, zoomRatio) {
            param.curImgWidth = param.curImgWidth / zoomRatio;
            param.curImgHeight = param.curImgHeight / zoomRatio;
            elImgBox.css({
                "background-size": param.curImgWidth + 'px ' + param.curImgHeight + 'px'
            });
            this.setBackPosCenter(elImgBox);
        },
        mouseWheel: function (e, elImgBox, zoomRatio) {
            e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? this.zoomBiger(elImgBox, zoomRatio) : this.zoomSmaller(elImgBox, zoomRatio);
        },
        setBackPosCenter: function (elImgBox) {
            param.backPosX = (param.mainBoxWidth - param.curImgWidth) / 2;
            param.backPosY = (param.mainBoxHeight - param.curImgHeight) / 2;
            elImgBox.css({
                "background-position": param.backPosX + 'px ' + param.backPosY + 'px'
            })
        },
        setImgRotate: function (elImgBox, rotAngle) {
            param.curImgRotate += rotAngle;
            elImgBox.css({
                'transform': 'rotate(' + param.curImgRotate + 'deg)'
            });
        },
        imgTouchStart: function (e) {
            e.preventDefault();

            if (event.touches.length == 1) {
                var touch = event.touches[0];
                param.mouseIniX = touch.pageX;
                param.mouseIniY = touch.pageY;

            } else if (event.touches.length == 2) {
                param.touchIniX2 = event.touches[1].pageX;
                param.touchIniY2 = event.touches[1].pageY;

            }

        },
        imgTouchMove: function (e, elImgBox, touchRatio) {
            e.preventDefault();
            if (event.touches.length == 1) {
                var touch = event.touches[0];
                var spanX = touch.pageX - param.mouseIniX;
                var spanY = touch.pageY - param.mouseIniY;
                var changeX;
                var changeY;
                if (param.curImgRotate % 360 == 0) {
                    changeX = spanX + param.backPosX;
                    changeY = spanY + param.backPosY;
                }
                if (param.curImgRotate % 360 == 90 || param.curImgRotate % 360 == -270) {
                    changeY = -spanX + param.backPosX;
                    changeX = spanY + param.backPosY;
                }
                if (param.curImgRotate % 360 == 180 || param.curImgRotate % 360 == -180) {
                    changeX = -spanX + param.backPosX;
                    changeY = -spanY + param.backPosY;
                }
                if (param.curImgRotate % 360 == 270 || param.curImgRotate % 360 == -90) {
                    changeY = spanX + param.backPosX;
                    changeX = -spanY + param.backPosY;
                }

                this.setBackPos(elImgBox, changeX, changeY);


            } else if (event.touches.length == 2) {
                var touch1 = event.touches[0];
                var touch2 = event.touches[1];
                var iniDis = this.getTouchDistance(param.mouseIniX, param.mouseIniY, param.touchIniX2, param.touchIniY2);
                var nowDis = this.getTouchDistance(touch1.pageX, touch1.pageY, touch2.pageX, touch2.pageY);
                var rate = nowDis / iniDis;

                rate = 1 + (rate - 1) / touchRatio;

                var newPosX = (param.mainBoxWidth - param.mouseIniX * rate) / 2;
                var newPosY = (param.mainBoxHeight - param.mouseIniY * rate) / 2;
                this.setBackPos(elImgBox, newPosX, newPosY);
                elImgBox.css('background-size', param.curImgWidth * rate + 'px ' + param.curImgHeight * rate + 'px');
            }
        },
        imgTouchEnd: function (e, elImgBox) {
            var bg = elImgBox.css('background-position').split(' ');
            param.backPosX = parseInt(bg[0]);
            param.backPosY = parseInt(bg[1]);
            var bg = $imgBox.css('background-size').split(' ');
            param.curImgWidth = parseInt(bg[0]);
            param.curImgHeight = parseInt(bg[1]);

            param.mouseIniX = 0;
            param.mouseIniY = 0;


        },
        getTouchDistance: function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }
    }

})(jQuery);
