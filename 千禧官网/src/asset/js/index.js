var PAGE = (function(){
  var fn = {
      //首屏轮播
      banner:function(){
          var index = 0;
          var imgnum=$('#banner ul li').length;
          var nmun='';

          //默认第一张图片显示
          $('#banner ul li').eq(0).css({opacity:1,filter:"alpha(100)"}).attr("id","show");

          //点击切换下一张
          $('#next').bind('click',function(){

              index+=1;
              if(index>imgnum-1){
                  index=0;
              }
              selectimg(index)
          });

          //点击切换上一张
          $('#prve').bind('click',function(){
              index-=1;
              if(index<0){
                  index=imgnum-1;
              }
              selectimg(index);
          });

          //添加轮播按钮
          for(var ni=0;ni<imgnum;ni++){
              nmun +="<span></span>";
          }
          $('.pagetion').html(nmun);
          $('.pagetion span').eq(0).addClass('active');

          //点击轮播按钮切换
          $('.pagetion span').each(function(){
              $(this).click(function(){
                  index = $(this).index(); //重置index全局变量
                  $('#banner ul li').eq(index).attr('id','show').stop().animate({opacity:1},'slow',function(){$('#banner ul li').eq(index).siblings().css('opacity',0)}).siblings().removeAttr('id');
                  $('.pagetion span').eq(index).addClass('active').siblings().removeClass('active');
              });
          });

          //自动轮播
          function auto(){
            
              p=setInterval(function(){
                  index++;

                  if(index>=imgnum){
                      index=0;
                  }

                  selectimg(index);

              },8000);

          }
          //鼠标移动上去
          $('#banner').hover(function(){
              clearInterval(p);
          },function(){
              auto();
          });

          //选择图片
          function selectimg(index){
              $('#banner ul li').eq(index).attr('id','show').stop().animate({opacity:1},'slow',function(){$('#banner ul li').eq(index).siblings().css('opacity',0)}).siblings().removeAttr('id');
              $('.pagetion span').eq(index).addClass('active').siblings().removeClass('active');
          }

          auto();
      },
        //tab切换
        /*
        * param.nav  //切换的导航选择器   param.nav:'nav ul li'    <nav><ul><li class='active'>切换的导航</li></ul></nav>
        * param.show //切换的tab        param.show:'.show'       <div><div class='show'></div><div class="show"></div></div>
        * param.active //导航选中的样式   param.active: 'active'   <nav><ul><li class='active'>切换的导航</li></ul></nav>
        *
        *
        * */
       tab:function(param){ 
            var nav = param.nav || '';
            var show = param.show || '';
            var active = param.active || '';
            $(nav).bind('mouseover',function(){
                var Index = $(this).index();
                $(this).addClass(active).siblings().removeClass(active);
                $(show).eq(Index).show().siblings().hide();
            });
        },
        
        /** */
        cut:function(){
            var index = 0;
            var imgnum=$('.new-test-list .box').length;
            $('.new-test-list .box').eq(0).css({opacity:1,filter:"alpha(100)"}).attr("id","show");
            //点击切换下一张
            $('#cut').bind('click',function(){
                    index+=1;
                    if(index>imgnum-1){
                        index=0;
                    }
                    selectimg(index)
                });
                //选择图片
            function selectimg(index){
                    $('.new-test-list .box').eq(index).attr('id','show').stop().animate({opacity:1},'slow',function(){$('.new-test-list .box').eq(index).siblings().css('opacity',0)}).siblings().removeAttr('id');
                }
        }
  }
  return {
      fn: fn
  };
})();