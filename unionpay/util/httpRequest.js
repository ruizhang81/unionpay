(function(module) {

    var http = require('http');
    var https = require('https');

    var exportFunction = {

        post : function(host, port, url, post_data, listener) {

            var options = {
                hostname : host,
                port : port,
                path : url,
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length' : post_data.length
                }
            };

            var req = http.request(options, function(res) {

                if (res.statusCode == 200) {
                    res.on('data', function(chunk) {
                        listener && listener(chunk);
                    });
                } else {
                    listener && listener('error:' + res.statusCode);
                }

            });
            req.on('error', function(e) {
                listener && listener('error:' + e);
            });
            req.write(post_data);
            req.end();
        },
        get : function(url, listener) {

            var parsed_url = require('url').parse(url);

            var options = {
                hostname : parsed_url.host,
                port : 443,
                path : parsed_url.path,
                method : 'GET'
            };

            var req = https.request(options, function(res) {

                if (res.statusCode == 200) {
                    res.on('data', function(chunk) {
                        listener && listener(chunk);
                    });
                } else {
                    listener && listener('error:' + res.statusCode);
                }

            });
            req.on('error', function(e) {
                listener && listener('error:' + e);
            });
            req.end();
        }

    };

    module.exports = exportFunction;
})(module)