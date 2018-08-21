import * as fs from 'fs';

const _createOrAppendNothing = name => {
    const p = new Promise((rez, rej) => {
        const strm = fs.createWriteStream(name, { flags: 'a' });
        strm.on('error', rej)
        strm.addListener('close', () => rez())
        strm.close();
    }) as Promise<void>;

    return p;
}

class Touch {
    
    shx(...names) {
        const ps = names.map(n => _createOrAppendNothing(n));
        const p = Promise.all(ps);

        return p;
    }
}

export default new Touch()