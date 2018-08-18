// import { promises as fs } from 'fs';
import * as fs from 'fs';
import { promisify } from 'util';

export default class Touch {

    _appendNothingToFile = name => {
        const p = new Promise(rez => {
            const strm = fs.createWriteStream(name, { flags: 'a' });
            strm.addListener('close', () => rez())
            strm.close();
        });
    }

    _justTouchExistingFile = name => {
        const exists = promisify(fs.exists)(name);

        if (exists) {
            return this._appendNothingToFile(name);
        }
    }

    algo = this._appendNothingToFile

    shx(...names) {
        const ps = names.map(n => this.algo(n));
        const p = Promise.all(ps);
        return p;
    }
}