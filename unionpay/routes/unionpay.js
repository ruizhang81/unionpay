exports.action = function(req, res) {

    var settings = require('../util/unionpay_config');
    var unionpay_core = require('../util/unionpay_core');
    var timeUtil = require('../util/timeUtil');

    // 需要填入的部分
    var req = [];
    req['version'] = settings.unipay.version; // 版本号
    req['charset'] = settings.unipay.charset; // 字符编码

    req['transType'] = '01'; // 交易类型
    req['merId'] = settings.unipay.mer_id; // 商户代码
    req['backEndUrl'] = settings.unipay.mer_back_end_url; // 通知URL

    req['orderTime'] = timeUtil.getTimeStr(); // 交易开始日期时间yyyyMMddHHmmss（撤销交易新交易日期，非原交易日期）

    req['orderNumber'] = timeUtil.getTimeStr(); // 订单号（撤销交易新订单号，非原订单号）
    req['orderAmount'] = '1'; // 订单金额
    req['orderDescription'] = '大描述'; // 大描述

    unionpay_core.trade(req, function(back) {
        if (back.success == false) {
            // 服务器应答签名验证失败
            res.send('失败');
        } else {
            // 服务器应答签名验证成功
            res.send(back.param);
        }
    });
};
