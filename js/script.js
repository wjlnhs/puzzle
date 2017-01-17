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
        this.init=function(){
            var This=this;
           // $('#puzzle').css({height:501,width:501})
            this.$blanks=this.creatdiv($('#puzzle'));
            this.$blanksPrview=this.creatdiv(this.$prviewbox,true);


              //$('#puzzle .blank').draggable({ addClasses: false });
            this.$dragbox.sortable({
                connectWith: '#puzzle',
                forceHelperSize:true,
                helper:'clone',
                appendTo: '#puzzle',
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
                    console.log(ui)
                },
                beforeStop:function(event, ui){
                    var isIn=This.isInclude(ui.helper, This.$compare);
                    This.$draging.css({
                        left:ui.helper.css('left'),
                        top:ui.helper.css('top'),
                        'z-index':This.startIndex++
                    })
                   setTimeout(function(){
                       This.$draging.addClass('undrag')
                       //This.$prviewbox
                       if(isIn){
                           //  alert()
                           //.addClass('undrag');
                           This.$draging.css({
                               'left':This.prviewleft+This.$compare.position().left,
                               'top':This.$compare.position().top,

                           })
                       }else{
                           This.$draging.css({
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
        isInclude:function($dom1,$dom2){
            var width=$dom1.width();
            var helfw=parseInt(width/2);
            var dom1left=$dom1.offset().left+width,
                 dom1top=$dom1.offset().top+width;
            var _left=$dom2.offset().left-helfw,
                _right=$dom2.offset().left+helfw+width,
                _top=$dom2.offset().top-helfw,
                _bottom=$dom2.offset().top+helfw+width;
            var isIn=dom1left>=_left && dom1left<=_right && dom1top>=_top && dom1top<=_bottom;
            return isIn;
        },
        creatdiv:function($cont,isPrview){
            var $blanks=[];
            for(var i=0;i<9;i++){
                var width=500/3;
                var $blank=$('<div class=" ui-sortable-handle">');
                $blank.css({
                    'background-image':this.bgsrc,
                    width:width,
                    height:width,
                    float:'left',
                    'box-sizing':'border-box',
                    border:'1px solid #fff'
                })
                $blanks.push($blank);
                $cont.append($blank);
                $blank.css({
                    top:$blank.position().top+'px',
                    left:$blank.position().left+'px ',
                    'background-position':'-'+$blank.position().left+'px -'+$blank.position().top+'px'
                }).attr('sortindex',i);
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