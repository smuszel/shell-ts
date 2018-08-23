import * as fs from 'fs';

class Touch {

    createOrAppendNothing = name => {
        const p = new Promise((rez, rej) => {
            const strm = fs.createWriteStream(name, { flags: 'a' });
            strm.on('error', rej)
            strm.addListener('close', () => rez())
            strm.close();
        }) as Promise<void>;
    
        return p;
    }
    
    shx(...names) {
        const ps = names.map(n => this.createOrAppendNothing(n));
        const p = Promise.all(ps);

        return p;
    }
}

export default new Touch()