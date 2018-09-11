window.onload = function () {
    //搜索栏背景
    search(document.querySelector('.jd_search'));
    //轮播图
    var imgBox = document.querySelector('.jd_banner ul:first-child');
    var points = document.querySelectorAll('.jd_banner ul:last-child li');
    //自动轮播+触摸滑动
    shuffling(imgBox,points);
    //秒杀触摸滑动
    touchMove(document.querySelector('.jd_seckill_pro ul'));
};