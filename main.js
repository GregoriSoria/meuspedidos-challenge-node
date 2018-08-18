const tools = require('./scripts/tools');

let param = '';
if (!(param = tools.getParam())) {
    return false;
}

tools.init(param);

