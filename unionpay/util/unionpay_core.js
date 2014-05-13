(function(module) {

    var settings = require('./unionpay_config');
    var md5Util = require("./md5Util");
    var httpRequest = require("./httpRequest");

    /**
     * 除去请求要素中的空值和签名参数
     * 
     * @param para
     *            请求要素
     * @return 去掉空值与签名参数后的请求要素
     */
    function paraFilter(para) {
        var result = [];

        for ( var key in para) {
            var value = para[key];
            if (key == settings.unipay.SIGNATURE || key == settings.unipay.SIGN_METHOD || value == "") {

            } else {
                result[key] = para[key];
            }
        }

        return result;
    }

    /**
     * 生成签名
     * 
     * @param req
     *            需要签名的要素
     * @return 签名结果字符串
     */
    function buildSignature(req) {
        var prestr = createLinkString(req, true, false);

        prestr = prestr + settings.unipay.QSTRING_SPLIT + md5Util.md5(settings.unipay.security_key);

        return md5Util.md5(prestr);
    }

    /**
     * 把请求要素按照“参数=参数值”的模式用“&”字符拼接成字符串
     * 
     * @param para
     *            请求要素
     * @param sort
     *            是否需要根据key值作升序排列
     * @param encode
     *            是否需要URL编码
     * @return 拼接成的字符串
     */
    function createLinkString(para, sort, encode) {
        var linkString = "";
        if (sort == true) {
            para = argSort(para);
        }
        for ( var key in para) {
            var value = para[key];
            if (encode == true) {
                value = encodeURIComponent(value);
            }
            linkString += key + settings.unipay.QSTRING_EQUAL + value + settings.unipay.QSTRING_SPLIT;
        }
        // 去掉最后一个&字符
        linkString = linkString.substr(0, linkString.length - 1);

        return linkString;
    }

    /**
     * 对数组排序
     * 
     * @param para
     *            排序前的数组 return 排序后的数组
     */
    function argSort(array) {

        var keys = [];
        for ( var key in array) {
            keys.push(key);
        }
        keys.sort();

        var result = [];
        for ( var key in keys) {
            result[keys[key]] = array[keys[key]];
        }
        return result;
    }

    function post(method, content, listener) {
        httpRequest.post(settings.unipay.ip, 8080, method, content, listener);
    }

    /**
     * 拼接请求字符串
     * 
     * @param req
     *            请求要素
     * @return 请求字符串
     */
    function buildReq(req) {
        // 除去待签名参数数组中的空值和签名参数
        var filteredReq = paraFilter(req);
        // 生成签名结果
        var signature = buildSignature(filteredReq);

        // 签名结果与签名方式加入请求
        filteredReq[settings.unipay.SIGNATURE] = signature;
        filteredReq[settings.unipay.SIGN_METHOD] = settings.unipay.sign_method;

        return createLinkString(filteredReq, true, true);
    }

    /**
     * 应答解析
     * 
     * @param respString
     *            应答报文
     * @param resp
     *            应答要素
     * @return 应答是否成功
     */
    function verifyResponse(respString) {
        var successFlag = false;
        var params = [];
        if (respString != "") {
            var para = respString.toString().split("&");
            for ( var key in para) {
                var value = para[key].split("=");
                params[value[0]] = value[1];
            }
            successFlag = verifySignature(params);
        }

        var json = {};
        for ( var str in params) {
            json[str] = params[str];
        }

        return {
            success : successFlag,
            param : JSON.stringify(json)
        };
    }

    /**
     * 异步通知消息验证
     * 
     * @param para
     *            异步通知消息
     * @return 验证结果
     */
    function verifySignature(para) {
        var respSignature = para[settings.unipay.SIGNATURE];

        // 除去数组中的空值和签名参数
        var filteredReq = paraFilter(para);

        var signature = buildSignature(filteredReq);

        console.log(respSignature + " " + signature);
        if ("" != respSignature && respSignature == signature) {
            return true;
        } else {
            return false;
        }
    }

    var exportFunction = {

        /**
         * 拼接保留域
         * 
         * @param req
         *            请求要素
         * @return 保留域
         */
        buildReserved : function(req) {
            var prestr = "{" + createLinkString(req, true, true) + "}";
            return prestr;
        },

        verifySignature : verifySignature,
        /**
         * 交易接口处理
         * 
         * @param req
         *            请求要素
         * @param resp
         *            应答要素
         * @return 是否成功
         */
        trade : function(req, callback) {
            var nvp = buildReq(req);
            console.log("请求参数 " + nvp);

            post(settings.unipay.upmp_trade_url, nvp, function(back) {
                console.log("返回参数 " + back);
                callback(verifyResponse(back));
            });
        },
        /**
         * 交易查询处理
         * 
         * @param req
         *            请求要素
         * @param resp
         *            应答要素
         * @return 是否成功
         */
        query : function(req, resp, callback) {
            var nvp = buildReq(req);
            post(settings.unipay.upmp_query_url, nvp, function(back) {
                callback(verifyResponse(back, resp));
            });
        }
    };

    module.exports = exportFunction;
})(module);
