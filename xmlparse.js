var sax = require('sax');

function Parse(xml) {
    var parser = sax.parser(true);
    var path = [];
    var obj = {};
    var current = obj;
    var rootNode = null;
    
    parser.onerror = function(e) {
        console.log('error', e);
    }
    
    parser.onopentag = function(node) {
        path.push(node); 
        if (current[node.name] !== undefined) {
            // this is another element from an array
            if (Array.prototype.isPrototypeOf(current[node.name]) == false) {
                var last = current[node.name];
                current[node.name] = [ last ];
            }
            node.parentObject = current;
            current = {};
            node.parentObject[node.name].push(current);
        } else {
            node.parentObject = current;
            current[node.name] = {};
            current = current[node.name];
            Object.assign(current, node.attributes);
        }
    }
    
    parser.ontext = function(t) {
        t = t.trim();
        if (!t) return;
        var node = path[path.length - 1];
        node.parentObject[node.name] = t;
    }
    
    parser.onclosetag = function(tagname) {
        var node = path.pop();
        if (node.dataType !== 'basic') {
            current = node.parentObject;
        }
    }
    
    parser.write(xml).close();

    return obj;
}

module.exports = Parse;