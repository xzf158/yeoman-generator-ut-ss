//var xx;

/* Extended  UTCommonModule Begin*/
UT_CM.closeBtnClass = "rotate-ani"; //rotate-ani & opacity-ani

UT_CM.openAnimation = function() {
    //undertone.creative.trackEvent("show", "slide");
    //do opening animating
};

UT_CM.expandAd = function() {
    TweenMax.to($leavebehind, 0.6, {
        autoAlpha: 0
    });
    TweenMax.to($interactive, 1, {
        autoAlpha: 1,
        delay: 0.6
    });
};

UT_CM.collapseAd = function() {
    TweenMax.to($interactive, 0.8, {
        autoAlpha: 0
    });
    TweenMax.to($leavebehind, 0.8, {
        autoAlpha: 1,
        delay: 0.8
    });
};

UT_CM.resizeAd = function(width, height) {
    console.log(width, height);
    fixMobile();
};
/* Extended  UTCommonModule End*/


/* function define begin */
function pictureLoad() {
   $(".preload").each(function() {
        var $this = $(this);
        var source = $this.data("source");
        var clickID = $this.data("utclickid");
        $this.data("source", "");
        if (platform.isIE8) {
            if (clickID) {
                $this.append("<div class='picture-holder' data-utclickid='" + clickID + "'><img class='ie8_hidden' src='" + source + "' data-utclickid='" + clickID + "' alt=''></div>");
            } else {
                $this.append("<div class='picture-holder'><img class='ie8_hidden' src='" + source + "' alt=''></div>");
            }
            $this.find('.picture-holder').css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + source + ',sizingMethod="scale");BACKGROUND: none transparent scroll repeat 0% 0%');
        } else {
            if (clickID) {
                $this.append("<img src='" + source + "' data-utclickid='" + clickID + "' alt=''>");
            } else {
                $this.append("<img src='" + source + "' alt=''>");
            }
        }
    });
}

function fixAndroidHeight(){
    if(platform.isNexus){
        $html.addClass("nexus");
    }
    if(platform.isDuos){
        $html.addClass("duos"); 
    }
    if(platform.isS3){
        $html.addClass("s3");
    }
}

var heightArr = [370, 410, 450, 460, 560, 590];
function fixMobile(){
    if(platform.isMobile){
        $html.addClass("mobile");

        var h = $interactive.height();
        $(heightArr).each(function(i, item){
            fixHeightGreatThan(h, item);
        });
    }
}
function fixHeightGreatThan(current, target){
    $html.removeClass("hgt" + target);
    if(current >= target){
        $html.addClass("hgt" + target);
    }
}
/* function define end */


setInterval(function(){
    var str = $interactive.html();
    str += "<br>" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "---" + $interactive.height();
    $interactive.html(str);
}, 3000);

setInterval(function(){
    $interactive.html("");
}, 3000 * 15);
//alert(ua);


pictureLoad();
fixAndroidHeight();
UT_CM.updateUI();

// keep the unused css rules
function tmp() {
    var tmp = {};
    // tmp.className = "no-touch";
    // tmp.className = "normal";
    // tmp.className = "rollover";
}