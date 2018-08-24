import * as fs from 'fs';

const createOrAppendNothing = name => {
    const p = new Promise((rez, rej) => {
        const strm = fs.createWriteStream(name, { flags: 'a' });
        strm.on('error', rej)
        strm.addListener('close', () => rez())
        strm.close();
    }) as Promise<void>;

    return p;
}

const touch = (...fileNames) => {
    const ps = fileNames.map(n => createOrAppendNothing(n));
    const p = Promise.all(ps);
    
    return p;
}

export default touch;
