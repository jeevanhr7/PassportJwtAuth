const validate = require("validate.js");

var constraints = {
    "awsOnBoarding": {
        "accessKey": {
            "presence": true
        },
        "secretKey": {
            "presence": true

        },
        "region": {
            "presence": true
        }
    }
};

module.exports.validator = {
    keyValidator: function (body) {
        return validate.async(body, constraints.awsOnBoarding)
    }
};




