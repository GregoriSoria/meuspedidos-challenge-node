const tools = require('./scripts/tools');

let param = '';
if (!(param = tools.getParam())) {
    return false;
}

Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
      const val = item[prop]
      groups[val] = groups[val] || []
      groups[val].push(item)
      return groups
    }, {})
  }

tools.validParam(param);

