
$(function(){
    //var Type='Easy';
    var puzzle=function(Type){
        this.bgsrc=$('#puzzle').css('background-image');
        this.$dragbox=$( "#puzzle" );
        this.$prviewbox=$( "#puzzleDestination" );
        this.imgwidth=500;
        this.ondrag=false;//是否正在拖拽
        this.$compare=$();//将要比较的（预览的）
        this.$draging=$();//正在拖拽的
        this.prviewleft=this.$prviewbox.position().left;//
        this.prviewtop=this.$prviewbox.position().top;//
        this.startIndex=100;
        this.second=0;
        this.$rotate=$();
        this.TypeObj={
            EASY:4,
            HARD:9
        }
        this.ispause=false;
        this.COUNT=this.TypeObj[Type];
        this.init=function(){
            this.initRotate();//添加旋转事件
            var This=this;
            // $('#puzzle').css({height:501,width:501})
            this.restart();
            $('.btn-restart').on('click',function(){
                This.second=0;
                This.restart();
            })
            $('.btn-pause').on('click',function(){
                if(This.ispause){
                    This.initTimer();
                    This.ispause=false;
                }else{
                    clearInterval(This.timer);
                    This.ispause=true;
                }
            })

        }
    }
    puzzle.prototype={
        constructor:puzzle,
        isInclude:function(ui,$dom2){
            var width=$dom2.width();
            var helfw=parseInt(width/2);
            var dom1center_x=ui.offset.left+helfw;
            var dom1center_y=ui.offset.top+helfw;
            var dom2center_x=$dom2.offset().left+helfw;
            var dom2center_y=$dom2.offset().top+helfw;
            var dis_x=dom1center_x-dom2center_x;
            var dis_y=dom1center_y-dom2center_y;
            var dis=Math.sqrt((dis_x*dis_x)+(dis_y*dis_y));
            return dis<=helfw;
        },
        initTimer:function(){
            var This=this;
            clearInterval(This.timer);
            This.timer=setInterval(function(){
                This.second++;
                var min=parseInt(This.second/60);
                var second=(This.second%60).toString();
                second=second.length==1 ? ('0'+second) : second;
                $('#timer span').text(min+' ：'+second);
            },1000)
        },
        restart:function(){
            var This=this;
            this.initTimer();
            this.$blanks=this.creatdiv($('#puzzle'));
            this.$blanksPrview=this.creatdiv(this.$prviewbox,true);
            this.$dragbox.sortable({
                connectWith: '#puzzle',
                //forceHelperSize:true,
                //helper:'clone',
                // appendTo: '#puzzle',
                // opacity: 0.6,
                placeholderType:false,
                start :function(event, ui){
                    if(This.ispause){
                        return false;
                    }
                    This.ondrag=true;
                    This.$draging=ui.item;
                    $('.ui-sortable-handle').removeClass('undrag')
                    var sortindex=This.$draging.attr('sortindex');
                    This.$compare=This.$prviewbox.find('[sortindex='+sortindex+']');
                    console.log(ui)
                },
                sort:function(event, ui){
                    console.log(This.$draging.css('left'))
                    console.log(ui)
                },
                beforeStop:function(event, ui){
                    This.$rotate=ui.helper;
                    var isIn=This.isInclude(ui, This.$compare);
                    This.$draging.css({
                        left:ui.position.left,
                        top:ui.position.top,
                        'z-index':This.startIndex++
                    })
                    setTimeout(function(){
                        This.$draging.addClass('undrag')
                        if(isIn && This.$draging.attr('rotate')%360==0){
                            //.addClass('undrag');
                            This.$draging.animate({
                                'left':This.prviewleft+This.$compare.position().left,
                                'top':This.$compare.position().top,
                            },function(){
                                This.$draging.remove();
                                This.$compare.animate({
                                    opacity:1
                                },function(){
                                    if(This.$dragbox.find('div').length==0){
                                        This.$prviewbox.find('>div').hide();
                                        This.$prviewbox.css({
                                            'background-image':This.bgsrc,
                                            'background-repeat':'no-repeat',
                                            'background-size':'500px 500px'
                                        })
                                    }

                                });
                            })
                        }else{
                            This.$draging.animate({
                                'left':parseInt(This.$draging.attr('initleft')),
                                'top':parseInt(This.$draging.attr('inittop'))
                            })
                        }
                    })
                    This.ondrag=false;
                }

            });
        },
        initRotate:function(){
            var This=this;
            $(document).on('keydown',function(ev){
                if(!This.ondrag){
                    return;
                }
                if(ev.keyCode==37){//左
                    //   This.$draging.css('background','red')
                    var nextRotate=parseInt(This.$draging.attr('rotate'))+90;
                    This.$draging.css({
                        transform:'rotateZ('+nextRotate+'deg)'
                    })
                    This.$draging.attr('rotate',nextRotate)
                }else if(ev.keyCode==39){//右
                    var nextRotate=parseInt(This.$draging.attr('rotate'))-90;
                    This.$draging.css({
                        transform:'rotateZ('+nextRotate+'deg)'
                    })
                    This.$draging.attr('rotate',nextRotate)
                }
            })
        },
        creatdiv:function($cont,isPrview){
            var $blanks=[];
            $cont.empty();
            for(var i=0;i<this.COUNT;i++){
                var width=parseInt(500/Math.sqrt(this.COUNT));
                var rotateArr=[0,90,180,270];
                var rotate=isPrview ? 0 :rotateArr[parseInt(Math.random()*4)];
                var $blank=$('<div class=" ui-sortable-handle">');
                $blank.css({
                    'background-image':this.bgsrc,
                    width:width,
                    height:width,
                    float:'left',
                    'box-sizing':'border-box',
                    border:'1px solid #fff',
                    transform: 'rotateZ('+rotate+'deg)'
                })
                $blanks.push($blank);
                $cont.append($blank);
                $blank.attr('sortindex',i).attr('rotate',rotate);
                $blank.css({
                    'background-position':'-'+$blank.position().left+'px -'+$blank.position().top+'px',
                    'background-repeat':'no-repeat',
                    'background-size':'500px 500px'
                });

            }
            //拖拽方格随机排序
            if(!isPrview){
                var $aftersort=$cont.find('>div').sort(function(a,b){
                    return Math.random()>.5 ? -1 : 1;
                })
                $cont.html($aftersort);

            }
            $cont.css('background-image','none');
            //定位
            $.each($blanks,function(index,$blank){
                var initLeft=$blank.position().left,
                    initTop=$blank.position().top;
                $blank.css({
                    top:initTop,
                    left:initLeft
                }).attr('initleft',initLeft).attr('inittop',initTop);
            })
            //赋值绝对定位
            $.each($blanks,function(index,$blank){
                $blank.css({
                    position:"absolute",
                })
                if(isPrview){
                    $blank.css({
                        opacity:0.6,
                        border:'none',
                    })
                }
            })
            return $blanks;

        }
    }
    //页面信息
    var Page=function(){
        this.UserName='';
        this.Type='';
        this.init=function(){
            this.initEvent();
        }
        this.second=0;
        this.init();
    }
    Page.prototype={
        constructor:Page,
        initEvent:function(){
            var This=this;
            //拖拽
            $(document).on({
                dragleave:function(e){    //拖离
                    e.preventDefault();
                },
                drop:function(e){  //拖后放
                    e.preventDefault();
                },
                dragenter:function(e){    //拖进
                    e.preventDefault();
                },
                dragover:function(e){    //拖来拖去
                    e.preventDefault();
                }
            });
            var box = document.getElementById('drop');
            box.addEventListener("drop",function(e){
                e.preventDefault(); //取消默认浏览器拖拽效果
                var fileList = e.dataTransfer.files; //获取文件对象
                //检测是否是拖拽文件到页面的操作
                if(fileList.length == 0){
                    return false;
                }
                //检测文件是不是图片
                var re=/(jpeg)|(jpg)/i;
                if(!re.test(fileList[0].type)){
                    alert("仅支持jpg图片！");
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    //oImg.src = this.result;
                    $('#puzzle, #puzzleDestination, .preview').css({
                        'background-image':'url("'+this.result+'")',
                        'background-size':'100% 100%'
                    });
                }
                reader.readAsDataURL(fileList[0]);
            })

            //拼图注册
            $('#submit').on('click',function(){
                var username=$.trim($('#name').val());
                if(!username){
                    alert('用户名不能为空！');
                    return false;
                }
                This.Type=$('#difficult option:selected').text();
                This.UserName=username;
                var mypuzzle=new puzzle(This.Type);
                mypuzzle.init();
                start.remove();
                return false;
            })
        }
    }
    var myPage=new Page();
    // var mypuzzle=new puzzle(Type);
    // mypuzzle.init();
})