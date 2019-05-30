var http = require('http');
var fs = require('fs');
var url = require('url');
var qiniu = require("qiniu");//npm install qiniu
var port = process.env.port || 8888;
var token=JSON.parse(fs.readFileSync('./token','utf-8'));
qiniu.conf.ACCESS_KEY = token.accessKey;
qiniu.conf.SECRET_KEY = token.secretKey;
var mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KEY);
var options = {
    scope: '163music_0',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var server = http.createServer(function (request, response) {
    var parseUrl = url.parse(request.url, true);
    var pathNoQuery = parseUrl.pathname;
    var queryObject = parseUrl.query;
    var method = request.method;
    if (pathNoQuery === '/') {
        response.statusCode=200;
        response.setHeader('Content-Type','application/json,charset=utf-8');
        response.setHeader('Access-Control-Allow-Origin','*');
        response.write(`{
            "uptoken":"${uploadToken}"
        }`);
        response.end();
        console.log('获取上传凭证');
    }else{
        response.statusCode=404;
        response.setHeader('Content-Type','text/html;charset=utf-8');
        response.write('请求错误，请稍后重新尝试');
        response.end();
    }
});
server.listen(port);
console.log('监听' + port + '端口成功，请打开127.0.0.1:' + port);