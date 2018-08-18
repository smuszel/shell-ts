import * as fs from 'fs';
import { promisify } from 'util';

const _createOrAppendNothing = name => {
    const p = new Promise(rez => {
        const strm = fs.createWriteStream(name, { flags: 'a' });
        strm.addListener('close', () => rez())
        strm.close();
    }) as Promise<void>;

    return p;
}

const _opencloseExistingFile = async name => {
    const exists = await promisify(fs.exists)(name);

    if (exists) {
        return _createOrAppendNothing(name);
    }
}

export default class Touch {

    get c() {
        return new TouchDontCreate();
    }

    
    shx(...names) {
        const ps = names.map(n => _createOrAppendNothing(n));
        const p = Promise.all(ps);
        return p;
    }
}


class TouchDontCreate {
    
    shx(...names): Promise<void[]> {
        const ps = names.map(n => _opencloseExistingFile(n));
        const p = Promise.all(ps);
        return p;
    }
}