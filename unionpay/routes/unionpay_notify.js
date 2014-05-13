exports.action = function(req, res) {

    var unionpay_core = require('../util/unionpay_core');

    if (unionpay_core.verifySignature(req.body)) {// 服务器签名验证成功
        // 请在这里加上商户的业务逻辑程序代码
        // 获取通知返回参数，可参考接口文档中通知参数列表(以下仅供参考)
        var transStatus = req.body.transStatus;// 交易状态
        console.log(transStatus);
        if ("" != transStatus && "00" == transStatus) {
            // 交易处理成功
            res.send("success");
        } else {
            res.send("fail");
        }
    } else {// 服务器签名验证失败
        res.send("sign fail");
    }

};