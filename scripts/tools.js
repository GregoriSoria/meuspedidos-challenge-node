module.exports = {
    init: function(param) {
        this.validParam(param);
    },
    getParam: function() {
        const args = process.argv.slice(2);
        
        if (!args || !args.length) {
            console.log("Please type a URL. Example: \`node main.js http://www.google.com\`");
            return false;
        }
        
        if (args.length > 1) {
            console.log('Please type a unique param.');
            return false;
        }
        
        return args[0];
    },
    validParam: function(param) {
        const fs = require('fs');
        
        try {
            fs.lstat(param, (err, stats) => {
                let validFile = true;
                if (err) {
                    validFile = false;
                }
                
                if (validFile && stats.isFile()) {
                    this.getParamContent(param, 'PATH');
                } else {
                    const url = require('url');
                    
                    if (url.parse(param).hostname) {
                        this.getParamContent(param, 'URL');
                    } else {
                        console.log('Invalid Address!');
                        return false;
                    }
                    
                }
            });
        } catch(err) { 
            console.log(err);
            return false;
        }
    },
    csvToJson: function(csv){
        var lines=csv.split("\n");
        var result = [];
        var headers=lines[0].replace(/"/g,"").split(",");
      
        for(var i=1;i<lines.length;i++){
      
            if (lines[i]) {

                var obj = {};
                var currentline=lines[i].replace(/"/g,"").split(",");
                
                if (currentline.length && currentline.length == headers.length) {

                    for(var j=0;j<headers.length;j++){
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                } else {
                    return false;
                }
            }
        }
        
        return result; //JSON
    },
    getJson: function(str) {
        try {
            const obj = {
                content: JSON.parse(str),
                fileType: 'JSON'
            };
            console.log('File type: ', obj.fileType);
            return obj;
        } catch (err) {
            const obj = {
                content: this.csvToJson(str),
                fileType: 'CSV'
            }

            if (obj.content && obj.content.length) {
                console.log('File type: ', obj.fileType);
                return obj;
            } else {
                console.log('Invalid text!');
                return false;
            }
        }
    },
    sortByAttr: function(json, attr) {
        return json.sort(function(a, b) {
            if (a[attr] > b[attr]) {
                return 1;
            }
            if (a[attr] < b[attr]) {
                return -1;
            }

            return 0;
        });
    },
    groupByAttr: function(json, attr){
        const result = [];

        let lastValue = '';
        let stateIndex = -1;
        for (let i = 0; i < json.length; i++) {
            if (json[i][attr] != lastValue) {
                lastValue = json[i][attr];
                result.push({ state: json[i][attr], list: [], length: 0 });
                stateIndex++;
            }
            if (json[i][attr] == lastValue) {
                result[stateIndex].list.push(json[i]);
                result[stateIndex].length++;
            }
        }

        return result;
    },
    getParamContent: function(param, type) {
        if (!param || !type) {
            console.log('ERROR: Insert param!');
            return false;
        }
        
        console.log('Param type: ', type);
        
        switch (type) {
            case 'PATH':
                const fs = require('fs');

                const self = this;
                fs.readFile(param, {encoding: 'utf-8'}, function(err, data) {
                    if (err) {
                        console.log('Error opening file');
                        return false;
                    }
                    const json = self.getJson(data);
                    if (json && json.content) {
                        self.filter(json);
                    }
                });
            break;
            case 'URL':
                const request = require('request');
                request(param, { json: false }, (err, res, body) => {
                    if (err || res.statusCode != 200) {
                        return console.log('Invalid Request!');
                    }

                    const json = this.getJson(body);
                    if (json && json.content) {
                        this.filter(json);
                    }
                });
            break;
        
            default:
                console.log('unidentified param type')
        }
    },
    filter: function(json) {
        json.content = this.sortByAttr(json.content, 'estado');
        const result = this.groupByAttr(json.content, 'estado');
        console.log(JSON.stringify(result));
    }
};