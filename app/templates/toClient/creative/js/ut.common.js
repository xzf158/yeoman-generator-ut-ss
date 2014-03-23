// store references to DOM elements to save on subsequent traversals
var $window = $(window),
    $html = $("html"),
    $body = $('body'),
    $closeButton = $('#ut_close'),
    $openButton = $('#ut_open'),
    $leavebehind = $('.leavebehind'),
    $interactive = $('.interactive'),
    // parentWindow = window.parent.window.parent.window;
    // isPortrait = Math.abs(parentWindow.orientation) != 90 ? true : false,
    mobileWidth = 0;

var ua = window.navigator.userAgent.toLowerCase();
window.platform = {
    isiPad: ua.match(/ipad/i) !== null,
    isiPhone: ua.match(/iphone/i) !== null,
    isAndroid: ua.match(/android/i) !== null,
    isAndroid23: ua.match(/android 2\.3/i) !== null,
    isAndroid404: ua.match(/android 4\.0\.4/i) !== null,
    isAndroid412: ua.match(/android 4\.1\.2/i) !== null,
    isBustedAndroid: ua.match(/android 2\.[12]/) !== null,
    isNexus: ua.match(/nexus/i) !== null,
    isDuos: ua.match(/gt\-s7562/i) !== null,
    isS7562: ua.match(/gt\-s7562/i) !== null,
    isS3: ua.match(/gt\-i9300/i) !== null,
    isI9300: ua.match(/gt\-i9300/i) !== null,
    isIE: /(msie|trident)/i.test(navigator.userAgent), //window.navigator.appName.indexOf("Microsoft") !== -1,
    isIE8: ua.match(/msie 8/) !== null,
    isChrome: ua.match(/Chrome/gi) !== null,
    isFirefox: ua.match(/firefox/gi) !== null,
    isWebkit: ua.match(/webkit/gi) !== null,
    isGecko: ua.match(/gecko/gi) !== null,
    isOpera: ua.match(/opera/gi) !== null,
    ltIE9 : $("html").hasClass("lt-ie9"),
    isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) && navigator.userAgent.match(/Mobile/i) !== null,
    hasTouch: ('ontouchstart' in window),
    supportsSvg: !! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
};

window.platform.isAndroidPad = platform.isAndroid && !platform.isMobile;
window.platform.isTablet = platform.isiPad || platform.isAndroidPad;
window.platform.isDesktop = !(platform.isMobile || platform.isTablet);
window.platform.isIOS = platform.isiPad || platform.isiPhone;

/* event begin */
window.startAd = function() {
    if (!UT_CM.isAutoOpened) {
        UT_CM.isAutoOpened = true;
        $closeButton.css("visibility","visible");
        $openButton.css("visibility","hidden");
        $body.removeClass('closed').addClass('opened');
        //UT_CM.checkFlex();
        $body.addClass('animating');
        UT_CM.openAnimation();
    }
};

window.closeAd = function() {
    if ($body.hasClass('opened')) {
        UT_CM.clickCloseBtn();
    } 
};

$openButton.on("click", function() {
    UT_CM.clickOpenBtn();
});

$closeButton.on("click", function() {
    UT_CM.clickCloseBtn();
});

$window.on("resize", function(){
    if(!platform.hasTouch){
        UT_CM.updateUI();
    }else{
        // setTimeout(function(){
        //     var newIsPortrait = Math.abs(parentWindow.orientation) != 90 ? true : false;
        //     if(isPortrait != newIsPortrait){
        //         isPortrait = newIsPortrait;
        //         UT_CM.updateUI();
        //     }
        // }, 40);
        UT_CM.updateUI();
    }
});
/* event end */

/*  UTCommonModule begin  */
var UT_CM = {};
UT_CM.isAutoOpened = false;
UT_CM.width = $window.width();
UT_CM.height = $window.height();

UT_CM.closeBtnClass = "rotate-ani";//rotate-ani & opacity-ani

UT_CM.checkFlex = function() {
    var isFpf = undertone.creative.isFullPageFlex();
    if (isFpf) $body.addClass('fpf');
    else $body.removeClass('fpf');
    return isFpf;
}

UT_CM.clickOpenBtn = function(){
    $closeButton.css("visibility","visible");
    $openButton.css("visibility","hidden");
    $body.removeClass('closed').addClass('opened');
    $openButton.removeClass(UT_CM.closeBtnClass);
    $closeButton.addClass(UT_CM.closeBtnClass);

    if(platform.ltIE9){
        $openButton.css('visibility', 'hidden')
        $closeButton.css('visibility', 'visible');
        $leavebehind.css('visibility', 'hidden');
        $interactive.css('visibility', 'visible');
    }else{
        UT_CM.expandAd();
    }
}

UT_CM.clickCloseBtn = function(){
    $closeButton.css("visibility","hidden");
    $openButton.css("visibility","visible");
    $body.removeClass('opened animating').addClass('closed');
    $closeButton.removeClass(UT_CM.closeBtnClass);
    $openButton.addClass(UT_CM.closeBtnClass);

    if(platform.ltIE9){
        $openButton.css('visibility', 'visible');
        $closeButton.css('visibility', 'hidden');
        $leavebehind.css('visibility', 'visible');
        $interactive.css('visibility', 'hidden');
    }else{
        UT_CM.collapseAd();
    }
}

UT_CM.updateUI = function(){
    UT_CM.width = $window.width();
    UT_CM.height = $window.height();
    // if(platform.hasTouch){
    //     if(isPortrait){
    //         $html.removeClass('landscape');
    //     }else{
    //         $html.addClass('landscape');
    //     }
    // }
    if(typeof UT_CM.resizeAd == "function"){
        UT_CM.resizeAd(UT_CM.width, UT_CM.height);
    }
}


// if(platform.isMobile && platform.isAndroid){
//     if(UT_CM.width < 360){
//         mobileWidth = 320;
//     }else{
//         mobileWidth = 360;
//     }
// }
/*  UT_CM end  */