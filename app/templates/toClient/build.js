'use strict';
var fs = require('fs-extra'),
    zipdir = require('zip-dir'),
    colors = require('colors'),
    cheerio = require('cheerio'),
    watch = require('node-watch'),
    configJosn,
    para = process.argv[2];
if (fs.existsSync("config.json")) {
    configJosn = JSON.parse(fs.readFileSync("config.json").toString("utf8"));
} else {
    console.log("Must have config.json.".red);
    return;
}
var targetHtmlPath = configJosn.creative.path + "/index.html",
    targetLessPath = configJosn.creative.path + "/less/",
    targetImgPath = configJosn.creative.path + "/img/",
    leavebehindHtml,
    interactiveHtml;

switch(para){
    case "zip":
        zip();
        break;
    case "watch":
        console.log("=====begin watch=====".green);
        watch([configJosn.interactive.path, configJosn.leavebehind.path], { recursive: false, followSymLinks: true }, function(filename) {
            clearTimeout(timeid);
            timeid = setTimeout(function(){
                build();
            }, 1000);
        });
        break;
    case undefined:
        build();
        break;
    default:
        if(fs.existsSync("./creative/" + para)){
            fs.writeFileSync("./preload.txt", getAllFiles("./creative/" + para));
            console.log("Preload image save to preload.txt".green);
        }else{
            console.log(("./creative/" + para + " not exist").red);
        }
        break;
}

function build() {
    copyImage(configJosn.leavebehind.path + "img/");
    if (configJosn.leavebehind.path != configJosn.interactive.path) {
        copyImage(configJosn.interactive.path + "img/");
    }
    leavebehind();
    interactive();
    mergeHtml();
    console.log("======build complete======".green);
}

function zip(){
     copyFile(function (){
        var tmpCss = configJosn.creative.path.replace("creative", "creative-tmp") + "/style.css";
        var css = fs.readFileSync(tmpCss).toString('utf8');
        fs.writeFileSync(tmpCss, formatCss(css));
        zipFolder(configJosn.creative.path.replace("creative", "creative-tmp"),configJosn.creative.path.replace("creative", "creative.zip"),true);
     });
};

function leavebehind() {
    if (fs.existsSync(configJosn.leavebehind.path + configJosn.leavebehind.desktop.html)) {
        leavebehindHtml = getHtml(configJosn.leavebehind.path + configJosn.leavebehind.desktop.html, configJosn.leavebehind.desktop);
    } else {
        leavebehindHtml = "none";
        console.log((configJosn.leavebehind.path + configJosn.leavebehind.desktop.html + " not exist").red);
    }
    if (fs.existsSync(configJosn.leavebehind.path + configJosn.leavebehind.desktop.css)) {
        replaceCssFile(configJosn.leavebehind.path + configJosn.leavebehind.desktop.css, targetLessPath + configJosn.leavebehind.desktop.name + ".less", "." + configJosn.leavebehind.desktop.name);
    } else {
        console.log((configJosn.leavebehind.path + configJosn.leavebehind.desktop.css + " not exist").red);
    }
    if (fs.existsSync(configJosn.leavebehind.path + configJosn.leavebehind.mobile.css)) {
        replaceCssFile(configJosn.leavebehind.path + configJosn.leavebehind.mobile.css, targetLessPath + configJosn.leavebehind.mobile.name + ".less", ".fpf ." + configJosn.leavebehind.desktop.name);
    } else {
        console.log((configJosn.leavebehind.path + configJosn.leavebehind.mobile.css + " not exist").red);
    }
};

function interactive() {
    if (fs.existsSync(configJosn.interactive.path + configJosn.interactive.desktop.html)) {
        interactiveHtml = getHtml(configJosn.interactive.path + configJosn.interactive.desktop.html, configJosn.interactive.desktop);
    } else {
        interactiveHtml = "none";
        console.log((configJosn.interactive.path + configJosn.interactive.desktop.html + " not exist").red);
    }
    if (fs.existsSync(configJosn.interactive.path + configJosn.interactive.desktop.css)) {
        replaceCssFile(configJosn.interactive.path + configJosn.interactive.desktop.css, targetLessPath + configJosn.interactive.desktop.name + ".less", "." + configJosn.interactive.desktop.name);
    } else {
        console.log((configJosn.interactive.path + configJosn.interactive.desktop.css + " not exist").red);
    }
    if (fs.existsSync(configJosn.interactive.path + configJosn.interactive.mobile.css)) {
        replaceCssFile(configJosn.interactive.path + configJosn.interactive.mobile.css, targetLessPath + configJosn.interactive.mobile.name + ".less", ".fpf ." + configJosn.interactive.desktop.name);
    } else {
        console.log((configJosn.interactive.path + configJosn.interactive.mobile.css + " not exist").red);
    }
};

function mergeHtml() {
    if (interactiveHtml && leavebehindHtml) {
        // var html = "<html><body></body></html>";
        var targetHtml = fs.readFileSync(targetHtmlPath).toString('utf8');
        var $ = cheerio.load(targetHtml);
        // var $div = $("<div/>").append(targetHtml);
        if (leavebehindHtml != "none") {
            var targetHolder = $("." + configJosn.leavebehind.desktop.name);
            targetHolder.html(leavebehindHtml);
            console.log("Update leavebehind html".green);
        }
        if (interactiveHtml != "none") {
            var targetHolder = $("." + configJosn.interactive.desktop.name);
            targetHolder.html(interactiveHtml);
            console.log("Update interactive html".green);
        }
        fs.writeFileSync(targetHtmlPath, $.html());
    }
};

function copyImage(path) {
    if (!fs.existsSync(targetImgPath)) {
        console.log((targetImgPath + " not exist").red);
        return;
    }
    if (!fs.existsSync(path)) {
        console.log((path + " not exist").red);
        return;
    }
    var files = fs.readdirSync(path);
    files.forEach(function(file) {
        if (file.toLowerCase().indexOf(".jpg") != -1 || file.toLowerCase().indexOf(".png") != -1 || file.toLowerCase().indexOf(".gif") != -1) {
            fs.createReadStream(path + file).pipe(fs.createWriteStream(targetImgPath + file));
            console.log("Copy image to: " + (targetImgPath + file).green);
        }
    });
}

function getHtml(filePath, config) {
    var html = fs.readFileSync(filePath).toString('utf8');
    var $ = cheerio.load(html);
    var $container = $('#primaryContainer');
    var originHtml = $container.html();
    var newHtml = originHtml;
    $container.find("img").each(function() {
        var $this = $(this);
        var divHolder = $("<div/>").append($this);
        var id = $this.attr("id");
        var newImgHolder = "<div class='" + id + " preload' data-source='" + $this.attr("src") + "'";
        newImgHolder += "></div>";
        newHtml = newHtml.replace(divHolder.html(), newImgHolder);
    });
    newHtml = newHtml.replace(/id=\"/g, "class=\"").replace(/class=\"clearfix\"/g, "");
    newHtml = newHtml.split("\n").join("\n    ");
    var $$ = cheerio.load(newHtml);
    if (config.ignoreClass) {
        for (var i in config.ignoreClass) {
            $$("." + i).removeClass(config.ignoreClass[i]);
            if (config.ignoreClass[i].indexOf("preload") != -1) {
                $$("." + i).removeAttr("data-source");
            }
        }
    }
    if (config.className) {
        for (var i in config.className) {
            $$("." + i).addClass(config.className[i]);
        }
    }
    if (config.data) {
        for (var className in config.data) {
            for (var i in config.data[className]) {
                $$("." + className).attr("data-" + i, config.data[className][i]);
            }
        }
    }
    if (config.idName) {
        for (var i in config.idName) {
            $$("." + i).attr("id", config.idName[i]);
        }
    }
    return $$.html();
}

function replaceCssFile(filePah, targetPath, prefix) {
    var css = fs.readFileSync(filePah).toString('utf8');
    var colorPattern1 = /#[0-9a-fA-F]{6};/g;
    var colorPattern2 = /#[0-9a-fA-F]{3};/g;
    css = css.replace(/.primaryContainer \{[^\}]+\}\n/g, "");
    css = css.replace(/\/\*[^\*\/]+\*\/\n/g, "");
    var matchResult = css.match(colorPattern1);
    if (matchResult) {
        matchResult.forEach(function(color) {
            var newColor = color.replace("#", "?color?");
            css = css.replace(color, newColor);
        });
    }
    matchResult = css.match(colorPattern2);
    if (matchResult) {
        matchResult.forEach(function(color) {
            var newColor = color.replace("#", "?color?");
            css = css.replace(color, newColor);
        });
    }
    css = css.replace(/#/g, ".");
    css = css.replace(/\?color\?/g, "#");
    css = css.replace(/\\n\\n/g, "");
    css = css.split("\n").join("\n    ");
    css = prefix + " {\n" + css + "\n}";
    fs.writeFileSync(targetPath, css);
    console.log("Create: " + targetPath.green);
}
var timeid;
function getAllFiles(rootPath) {
    var imgs = [];
    var files = fs.readdirSync(rootPath);
    files.forEach(function(file) {
        if (file.indexOf(".png") != -1 || file.indexOf(".jpg") != -1) {
            imgs.push("creative/img/" + file);
        }
    });
    return imgs.join("\r\n");
}

function copyFile(cb) {
    fs.copy(configJosn.creative.path, configJosn.creative.path.replace("creative","creative-tmp"), function(e) {
        if (e.indexOf(".svn") != -1) return false;
        if (e.indexOf("/creative") != -1 && e.indexOf("/creative/") == -1) return true;
        if (e.indexOf("/creative/index.html") != -1) return true;
        if (e.indexOf("/creative/app.js") != -1) return true;
        if (e.indexOf("/creative/style.css") != -1) return true;
        if (e.indexOf("/creative/swf") != -1) return true;
        if (e.indexOf("/creative/video") != -1) return true;
        if (e.indexOf("/creative/fonts") != -1) return true;
        if (e.indexOf("/creative/css") != -1) return true;
        if (e.indexOf("/creative/js") != -1) return true;
        if (e.indexOf("/creative/img") != -1) return true;
        return false;
    }, function(err) {
        if (err) {
            throw err;
        }
        if(cb){
            cb();
        }        
    });
};


function formatCss(s) {
    s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    s = s.replace(/;\s*;/g, ";"); //清除连续分号
    s = s.replace(/\,[\s\.\#\d]*{/g, "{");
    s = s.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
    s = s.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
    s = s.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
    return s;
}

function zipFolder(path, target, isDelete){
     zipdir(path, target, function(err, buffer) {
        console.log("zip complete".green);
        if(isDelete){
            fs.remove(path, function(err) {
            });
        }
    });
};