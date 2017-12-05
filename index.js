const { exec, fork, spawn } = require('child_process');
const xmlParse = require('./xmlparse');


class NodeSVN {
    constructor(options) {
        this.options = options;
        this.options.auth = this.options.username && this.options.password ?
            `--username ${this.options.username} --password ${this.options.password}` : '';
    }

    query(command) {
        return new Promise((resolve, reject) => {
            exec(`svn ${command} --xml ${this.options.cwd} ${this.options.auth}`, 
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
            let cmd = filename ? `svn cat ${this.options.cwd}/${filename} ${this.options.auth}` : `svn cat ${this.options.cwd} ${this.options.auth}`;
            exec(cmd, (error, stdout, stderr) => {
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
            cwd: 'http://10.19.2.154:8080/boards/4381/trunk'
        });

        let data = await svn.info();
        console.log(JSON.stringify(data, null, 4));
    })();
}