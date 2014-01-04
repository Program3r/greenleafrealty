if(Meteor.isClient){
    //$("#craterlake2").zoomTo({root:$('.zoomContainer'), targetsize:4})
    Template.zoomy.rendered = function(){
        Meteor.call('playSlideshow');
    }
    
    Meteor.methods({
        'playSlideshow':function(){
            var interval = 15000;
            if($(".zoomy-controls .playstate.stop.active").length == 1){
                Meteor.call('playNext');
                setTimeout(function(){
                    Meteor.call('playSlideshow');
                }, interval)
            }
        },
        'playNext':function(){
            var next = $(".zoomySlider .zoomTarget.active").removeClass("active");
            if(next.next().length > 0){
                next.next().addClass("active");
            }else{
                $(".zoomySlider .zoomTarget").first().addClass("active");
            }
            $(".zoomySlider .zoomTarget.active").zoomTo({root:$('.zoomySlider .zoomContainer'), targetsize:2, duration:2000, ease:"ease-in-out"});
        },
        'playPrev':function(){
            var prev = $(".zoomySlider .zoomTarget.active").removeClass("active");
            if(prev.prev().length > 0){
                prev.prev().addClass("active");
            }else{
                $(".zoomySlider .zoomTarget").last().addClass("active");
            }
            $(".zoomySlider .zoomTarget.active").zoomTo({root:$('.zoomySlider .zoomContainer'), targetsize:2, duration:2000, ease:"ease-in-out"});
        },
        'reloadCurrent':function(){
            $(".zoomySlider .zoomTarget.active").zoomTo({root:$('.zoomySlider .zoomContainer'), targetsize:2, ease:"ease-in-out"});
        }
    });
    
    /*Controls*/
    Template["zoomy-controls"].events({
       'click .playstate.active':function(event){
           $(".zoomy-controls .playstate:not(.active)").addClass("active");
           $(event.toElement).closest(".active").removeClass("active");
       },
       'click .gonext':function(){
           Meteor.call("playNext");
       },
       'click .goprev':function(){
           Meteor.call("playPrev");
       },
       'click .play':function(){
           Meteor.call('playSlideshow');
       }
    });
    
    
    $(window).bind('resize', function(e)
    {
        window.resizeEvt;
        $(window).resize(function()
        {
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function()
            {
                Meteor.call('reloadCurrent');
            }, 250);
        });
    });
}