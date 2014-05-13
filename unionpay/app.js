/**
 * 程序执行入口
 */

var express = require('express');
var settings = require('./util/unionpay_config');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', 3002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// 初始化依赖
var jsRootDirPath = 'routes';
function recursionRequire(parantPath, item) {
    var path = parantPath + '/' + item;
    var stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
        fs.readdir(path, function(err, files) {
            if (!err) {
                files.forEach(function(childItem) {
                    recursionRequire(path, childItem);
                });
            }
        });
    } else {
        var jsFileArr = path.split(jsRootDirPath);
        var jsFilePath = './' + jsRootDirPath + jsFileArr[jsFileArr.length - 1];
        jsFilePath = jsFilePath.split(".js")[0];
        item = item.split(".js")[0];
        var routesModel = require(jsFilePath);
        app.post('/' + item, routesModel.action);
        app.get('/' + item, routesModel.action);
    }
}
recursionRequire(settings.path, jsRootDirPath);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port' + app.get('port'));
});
