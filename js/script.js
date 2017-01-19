
$(function(){
    console.log(99)
    var puzzle=function(){
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
        this.$rotate=$();
        this.init=function(){
            this.initRotate();//添加旋转事件
            var This=this;
            // $('#puzzle').css({height:501,width:501})
            this.$blanks=this.creatdiv($('#puzzle'));
            this.$blanksPrview=this.creatdiv(this.$prviewbox,true);


            //$('#puzzle .blank').draggable({ addClasses: false });
            this.$dragbox.sortable({
                connectWith: '#puzzle',
                //forceHelperSize:true,
                //helper:'clone',
                // appendTo: '#puzzle',
                // opacity: 0.6,
                placeholderType:false,
                start :function(event, ui){
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
                        //This.$prviewbox
                        //alert()
                        if(isIn && This.$draging.attr('rotate')%360==0){

                            //  alert()
                            //.addClass('undrag');
                            This.$draging.animate({
                                'left':This.prviewleft+This.$compare.position().left,
                                'top':This.$compare.position().top,
                            },function(){
                                This.$draging.remove();
                                This.$compare.animate({
                                    opacity:1
                                });
                            })
                        }else{
                            This.$draging.animate({
                                'left':This.$compare.position().left,
                                'top':This.$compare.position().top
                            })
                        }
                    })

                    //      alert()
                    This.ondrag=false;
                    // alert(99)
                }

            });

            //     $( "#puzzle" ).disableSelection();
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
        initRotate:function(){
            var This=this;
            $(document).on('keydown',function(ev){
                if(!This.ondrag){
                    return;
                }
                if(ev.keyCode==37){//左
                    //alert(99)
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
            for(var i=0;i<9;i++){
                var width=498/3;
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
                $blank.css({
                    top:$blank.position().top+'px',
                    left:$blank.position().left+'px ',
                    'background-position':'-'+$blank.position().left+'px -'+$blank.position().top+'px'
                }).attr('sortindex',i).attr('rotate',rotate);
            }
            if(!isPrview){
                $cont.css('background-image','none');
            }

            $.each($blanks,function(index,$blank){
                $blank.css({
                    position:"absolute"
                })
                if(isPrview){
                    $blank.css({
                        opacity:0
                    })
                }
            })
            return $blanks;

        }
    }

    var mypuzzle=new puzzle();
    mypuzzle.init();
})