
//搜索栏滑动变色
var search = function (ele){
    var search = ele || document.querySelector('.jd_search');
    var banner = document.querySelector('.jd_banner');
    var height = banner.offsetHeight;
    window.onscroll = function (e) {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
        if(scrollTop<height){
            var alpha = scrollTop / height * 0.85;
            search.style.backgroundColor = 'rgba(201,21,35,'+ alpha +')';
        }else {
            search.style.backgroundColor = 'rgba(201,21,35,0.85)';
        }
    }
};
//轮播图
var shuffling = function (imageBox,points){
    var imgBox = imageBox;
    var points = points;
    var width = imageBox.children[0].offsetWidth;   //获取单个图片的宽度
    var shuffTimes = 3; //自动轮播时间 单位秒
    // 程序主体
    var timer = null;
    //轮播计数器
    var index = 1;
    
    //自动轮播
    autoMove();

    //添加触碰滑动
    touchMove(imgBox);

    //过渡结束 监听是否跳转
    imgBox.addEventListener('transitionend',function(){
        if(index>=9 || index<=0){
            jump();
        }
    });

//==========================轮播封装=================================
    //自动轮播定时器
    function autoMove(){
        timer = setInterval(function () {
            index++;
            //设置过渡效果
            setTransition ();
            //滑动
            imageMove(getTranslate());
            //点亮对应的点
            lightPoint();
        },shuffTimes * 1000);
    }
    //无缝跳转
    function jump(){
        if(index>=9) {
            index = 1;
        }else if(index<=0){
            index = 8;
        }
        //跳转时需要去除过渡效果
        removeTransition();
        imageMove(getTranslate());
    }

    //设置过渡效果
    function setTransition (){
        imgBox.style.transition = "all 0.2s ease";
        //兼容
        imgBox.style.webkitTransition = "all 0.2s ease";
    }
    //去除过渡效果
    function removeTransition (){
        //清除
        imgBox.style.transition = "none";
        imgBox.style.webkitTransition = "none";
    }
    //计算滑动距离
    function getTranslate(){
        return -index * width;
    }
    //实现滑动效果
    function imageMove(translateX){
        var translateX = translateX;
        imgBox.style.transform = "translateX("+ translateX +"px)";
        //兼容
        imgBox.style.webkitTransform = "translateX("+ translateX +"px)";
    }
    //点亮对应索引的点
    function lightPoint(){
        for(var i=0;i<points.length;i++){
            points[i].classList.remove('now');
        }
        var num = index-1;
        num = num > 7 ? 0 : num;  //防止无缝跳转时数字过大
        num = num < 0 ? 7 : num;  //防止无缝跳转时数字过小
        points[num].classList.add('now');
    }
    //点击滑动封装
    var touchX = 0; //触碰时的x坐标
    var distanceX = 0; //滑动时x值减去触碰时的x值 
    var isMove = false; //开闭原则 防止触碰却没滑动时触发事件
    function touchMove(imgBox){
        //触碰事件
        imgBox.addEventListener('touchstart',function(e){
            //停止自动轮播
            clearInterval(timer);
            //清除过度效果，滑动时不需要过度
            removeTransition();
            //获取触碰时x值
            touchX = e.touches[0].clientX;

        });
        //滑动事件
        imgBox.addEventListener('touchmove',function(e){
            //*触发滑动*事件
            isMove = true;
            //获取滑动时x值
            var clientX = e.touches[0].clientX;
            //计算位移 有正负
            distanceX = clientX - touchX;
            //根据轮播图已滑动的X值 计算出应该滑动的值
            var moveNum = distanceX + getTranslate();
            //根据计算的值滑动轮播图
            imageMove(moveNum);
        })
        //结束触碰事件
        imgBox.addEventListener('touchend',function(){
            if(!isMove) return; //如果没有*触发滑动*事件则跳出
            //手指放开时，根据滑动距离判断是否滑动轮播图
            //吸附回去
            if(Math.abs(distanceX)<width/3){
                setTransition();
                imageMove(getTranslate());
            }
            //滑动下一张 或 上一张
            else if(Math.abs(distanceX)>width/3){
                distanceX < 0 ? index++ : index--;
                setTransition();
                imageMove(getTranslate());
                lightPoint();
            }
            //重置参数
            isMove = false;
            touchX = 0;
            distanceX = 0;
            
            autoMove();
        })
    }
};

function touchMove (imgBox){
    var totalWidth = imgBox.offsetWidth; //滑动图的总宽
    var pageX = imgBox.parentNode.offsetWidth; //获取父盒子的显示宽度
    var touchX = 0; //触摸时x坐标
    var distanceX = 0; //计算值x坐标
    var nowX = 0; // 获取移动后的translateX值
    var isMove = false; //判断是否滑动
    imgBox.addEventListener('touchstart',function(e){
        touchX = e.touches[0].clientX;

        removeTransition ();
    });
    imgBox.addEventListener('touchmove',function(e){
        var moveX = e.touches[0].clientX;
        distanceX = moveX - touchX + nowX;
        imageMove(distanceX);
        isMove = true;
    });
    imgBox.addEventListener('touchend',function(e){
        if(!isMove) return;
        nowX = distanceX;//记录滑动距离
        //当滑动到最左侧后 自动吸附回去
        if(nowX > 0){
            setTransition();
            imageMove(0);
            //重置参数
            nowX = 0;
            distanceX = 0;
        }
        //当滑动距离超过盒子隐藏内容的宽度时，自动吸附回去
        if(Math.abs(nowX) > totalWidth - pageX){
            setTransition();
            //图片盒子隐藏的宽度等于 盒子总长减去父盒子宽度
            imageMove(pageX - totalWidth);
            nowX = pageX - totalWidth;
            distanceX = pageX - totalWidth;
        }
    });
//================封装======================
    //
    function imageMove (translateX) {
        imgBox.style.transform = "translateX("+ translateX +"px)";
        imgBox.style.webkitTransform = "translateX("+ translateX +"px)";
    }
    //设置过渡效果
    function setTransition (){
        imgBox.style.transition = "all 0.2s";
        imgBox.style.webkitTransition = "all 0.2s";
    }
    //清除过渡效果
    function removeTransition (){
        imgBox.style.transition = "none";
        imgBox.style.webkitTransition = "none";
    }
}