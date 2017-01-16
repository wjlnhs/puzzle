$(function(){
    console.log(99)
    var puzzle=function(){
        this.bgsrc=$('#puzzle').css('background-image');
        this.imgwidth=500;
        this.ondrag=false;//是否正在拖拽
        this.init=function(){
            var This=this;
           // $('#puzzle').css({height:501,width:501})
            this.$blanks=this.creatdiv();
            $('#puzzle').css('background-image','none');

            $.each(this.$blanks,function(index,$blank){
                $blank.css({
                    position:"absolute"
                })
            })
              //$('#puzzle .blank').draggable({ addClasses: false });
            $( "#puzzle ul" ).sortable({
                appendTo: '#puzzle',
               // opacity: 0.6,
                //placeholderType:true,
                start :function(event, ui){
                    This.ondrag=true;
                    console.log(ui.item)
                },
                stop:function(){
                    This.ondrag=false;
                    alert(99)
                }

            });

       //     $( "#puzzle" ).disableSelection();
        }
    }
    puzzle.prototype={
        constructor:puzzle,
        creatdiv:function(){
            var $blanks=[];
            for(var i=0;i<9;i++){
                var width=500/3;
                var $blank=$('<li class=" ui-sortable-handle">');
                $blank.css({
                    'background-image':this.bgsrc,
                    width:width,
                    height:width,
                    float:'left',
                    'box-sizing':'border-box',
                })
                $blanks.push($blank);
                $('#puzzle ul').append($blank);
                $blank.css({
                    top:$blank.position().top+'px',
                    left:$blank.position().left+'px ',
                    'background-position':'-'+$blank.position().left+'px -'+$blank.position().top+'px'
                });
            }
            return $blanks;

        }
    }

    var mypuzzle=new puzzle();
    mypuzzle.init();
})