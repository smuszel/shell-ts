import { promises as fsp } from 'fs';
//return Object.assign(() => 'abc', {x: 1})

class Cmp {

    async shx(...files) {
        const ps = files.map(fi => fsp.readFile(fi));
        const buffers = await Promise.all(ps);
        const ref = buffers[0];

        const filesAreEqual = buffers.every(b => ref.equals(b));
        return filesAreEqual;
    }
}

export default new Cmp();