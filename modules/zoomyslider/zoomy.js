if(Meteor.isClient){
    //$("#craterlake2").zoomTo({root:$('.zoomContainer'), targetsize:4})
    
    Template.zoomy.photos=function(){
        return Session.get('photos')
    }
    
    jsonFlickrFeed = function(json){
        var filtereditems=[];
        for (i=0;i<json.items.length;i++){
            var desc = json.items[i].description
            var photo = json.items[i].media.m.replace('_m','_b');
            var jdesc = $('<div></div>');
            var stamp = new Date().getTime();
            jdesc.append(desc);
            $(jdesc.find('p')[0]).remove();
            jdesc.find('img').attr('src',jdesc.find('img').attr('src').replace('_m','_b')+'?_='+stamp);
            jdesc.find('img').attr('width','').attr('height','').attr('onload','javascript:Session.set("photosloaded",true);checkplayliststarted();');
            filtereditems.push({src:photo,desc:jdesc.html(),stamp:stamp,offset:((Math.random()*(800*i))+(100*i)),rotation:((Math.random()*360)+1)});
            //console.log(jdesc.html())
        }
        Session.set('photos',filtereditems);
    }
    
    checkplayliststarted = function(){
        if(Session.get('slideshowstarted')!=true){
            Session.set('slideshowstarted',true);
            Meteor.call('playSlideshow');
        }
    }
    
    Meteor.startup(function() {
            var url = 'http://api.flickr.com/services/feeds/photos_public.gne?id=111721254@N07&format=json';
            //var url = 'http://api.flickr.com/services/feeds/photos_public.gne?id=78681269@N03&format=json';
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(json) {
                    //console.log(json);
                },
                error: function(e) {
                    //console.log(e.message);
                }
            });
    })
    
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
            if(Session.get('photosloaded')== true){
                if($(".zoomySlider .zoomTarget.active").length == 0){
                    $($(".zoomySlider .zoomTarget")[0]).addClass('active');
                }
                var next = $(".zoomySlider .zoomTarget.active").removeClass("active");
                if(next.next().length > 0){
                    next.next().addClass("active");
                }else{
                    $(".zoomySlider .zoomTarget").first().addClass("active");
                }
                $(".zoomySlider .zoomTarget.active").zoomTo({root:$('.zoomySlider .zoomContainer'), targetsize:1, duration:2000, ease:"ease-in-out"});
            }
        },
        'playPrev':function(){
            if(Session.get('photosloaded')== true){
                var prev = $(".zoomySlider .zoomTarget.active").removeClass("active");
                if(prev.prev().length > 0){
                    prev.prev().addClass("active");
                }else{
                    $(".zoomySlider .zoomTarget").last().addClass("active");
                }
                $(".zoomySlider .zoomTarget.active").zoomTo({root:$('.zoomySlider .zoomContainer'), targetsize:1, duration:2000, ease:"ease-in-out"});
            }
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