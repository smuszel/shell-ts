import { promises as fs } from 'fs';
import * as path from 'path';
import { inspect } from 'util';

const sleep = time => new Promise(r => setTimeout(r, time));

class Flags {
    _flags = [];

    push(x) {
        if (this._flags.find(y => y === x)) {
            return;
        } else {
            this._flags.push(x);
        }
    }

    match(x) {
        return this._flags.find(y => y === x);
    }

    get empty() {
        return this._flags.length === 0;
    }
}

class LS {

    private flags = new Flags;


    get R() {
        this.flags.push('R')
        return this;
    }

    async _(dirname = __dirname) {
        if (this.flags.match('R')) {
            const arr = await fs.readdir(dirname);
            const allFiles = await Promise.all(arr.map(async subdir => {
                const p = path.resolve(dirname, subdir);
                const stats = await fs.stat(p)
                return stats.isDirectory()
                    ? this._(p)
                    : p;
            }))

            return allFiles.reduce((ac, x) => ac.concat(x), []);
            // return allFiles;
        } else if (this.flags.empty) {
            const allFiles = await fs.readdir(dirname);
            return allFiles.map(x => path.resolve(dirname, x));
        }
    }
}

class Shell {
    get ls() {
        return new LS();
    }
}



const main = async () => {
    const $ = new Shell();
    const res = await $.ls.R._('./testdir');

    
    console.log(res);
}; main();





