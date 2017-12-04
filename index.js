const { exec, fork, spawn } = require('child_process');
const xmlParse = require('./xmlparse');


class NodeSVN {
    constructor(options) {
        this.options = options;
    }

    query(command) {
        return new Promise((resolve, reject) => {
            exec(`svn ${command} --xml ${this.options.cwd} --username ${this.options.username} --password ${this.options.password}`, 
            (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve(xmlParse(stdout));
            });
        });
    }

    info() {
        return this.query('info');
    }

    log() {
        return this.query('log');
    }

    list() {
        return this.query('list');
    }

    cat(filename) {
        return new Promise((resolve, reject) => {
            exec(`svn cat ${this.options.cwd}/${filename} --username ${this.options.username} --password ${this.options.password}`, 
            (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve(stdout);
            });
        });
    }
}




module.exports = NodeSVN;

if (require.main === module) {
    (async function() {
        let svn = new NodeSVN({
            cwd: 'http://10.19.2.154:8080/boards/4381/trunk',
            username: 'manderson',
            password: 'kari55rene'
        });

        let data = await svn.cat('4381.PrjPcb');
        console.log(data);
    })();
}