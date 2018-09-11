$(function(){
    //轮播图动画
    var $banner = $('.sn_banner');
    shuffling($banner);

    changeTopBar();
});
/*顶部栏颜色变换*/
var changeTopBar = function (){
  $(window).on('scroll',function(e){
      var scrollTopNum = $(this)[0].scrollY;
      if(scrollTopNum > 0){
          $('.sn_header').css('background-color','rgb(255,192,1)');
      }else {
          $('.sn_header').css('background-color','rgba(255, 255, 255, 0)');
      }
  })
};

/*轮播图*/
var shuffling = function(ele){
  var $imgBox = ele.find('ul').eq(0);
  var $points = ele.find('ul').eq(1).find('li');
  var width = ele.width();
  var timer = null;
  var autoTimes = 5; //自动轮播间隔时间 单位/秒

    var index = 1;  //轮播计数器

    /*自动轮播*/
    autoPlay();

    function autoPlay(){
       timer = setInterval(function(){
            index++;
            move();

        },autoTimes*1000);
    }


  /*手势切换轮播图*/
  var startX = 0;       //触碰时x值
  var distanceX = 0;    //滑动的距离
  var isMove = false;   //开闭原则 是否滑动
  var currentX = 0;     //当前已经轮播的x值
  $imgBox.on("touchstart",function(e){
      clearInterval(timer);
      startX = e.touches[0].clientX;

  }).on("touchmove",function(e){
      var moveX = e.touches[0].clientX;
      distanceX = moveX - startX;

        /*图片实时跟随移动*/
      currentX = -index * width;  //  获取当前移动的x值
      $(this).css('transform',"translateX("+ (currentX + distanceX) +"px)");

      isMove = true;
  }).on("touchend",function(){
    if(!isMove){
        //如果没有滑动则重新自动轮播
        autoPlay();
        return;
    }
    if(Math.abs(distanceX) > 50){
        if(distanceX > 0){
            index--;
            move();
        }else if(distanceX < 0){
            index++;
            move();
        }
    }else {
        //滑动距离过小 自动吸附回原来的位置
        move();
    }

    //重置参数
    autoPlay();
    startX = 0;
    distanceX = 0;
    currentX = 0;
    isMove = false;
  });


  /*封装动画*/
  function move(){
      $imgBox.animate({transform:"translateX("+ -index * width +"px)",
          webkitTransform:"translateX("+ -index * width +"px)"},200,function(){
          if(index>=9){
              index=1;
              $imgBox.css('transform',"translateX("+ -index * width +"px)");
              $imgBox.css('webkitTransform',"translateX("+ -index * width +"px)");
          }else if(index<=0){
              index=8;
              $imgBox.css('transform',"translateX("+ -index * width +"px)");
              $imgBox.css('webkitTransform',"translateX("+ -index * width +"px)");
          }
      });
      $points.removeClass('active').eq(index-1).addClass('active');
  }
};
