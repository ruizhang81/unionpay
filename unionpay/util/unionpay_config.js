var path = require('path');
var settings = {
    path : path.normalize(path.join(__dirname, '..')),
    unipay : {
        version : '1.0.0',// 版本号
        charset : 'UTF-8',// 字符编码
        sign_method : 'MD5',// 签名方法，目前仅支持MD5
        mer_id : '880000000000761',// 商户号 001100041120001 880000000000761
        security_key : 'TtRdschbLHqWeMxm7r7tswVHKvRBCR09',// 商户密钥
        ip : '222.66.233.198',
        mer_back_end_url : 'http://yourdomain/unionpay_notify',// 后台通知地址
        upmp_trade_url : '/gateway/merchant/trade',
        upmp_query_url : '/gateway/merchant/query',

        RESPONSE_CODE_SUCCESS : "00", // 成功应答码
        SIGNATURE : "signature", // 签名
        SIGN_METHOD : "signMethod",// 签名方法
        RESPONSE_CODE : "respCode", // 应答码
        RESPONSE_MSG : "respMsg", // 应答信息
        QSTRING_SPLIT : "&", // &
        QSTRING_EQUAL : "=" // =
    }

}
module.exports = settings;