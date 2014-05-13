(function(module) {

    var exportFunction = {

        md5 : function(params) {
            var crypto = require('crypto');
            return crypto.createHash('md5').update(params, 'utf8').digest('hex').toLowerCase();
        }

    };

    module.exports = exportFunction;
})(module);
