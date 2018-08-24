import { promises as fsp } from 'fs';

const _cmp = async (...filePaths: string[]) => {
    const ps = filePaths.map(fi => fsp.readFile(fi));
    const buffers = await Promise.all(ps);
    const ref = buffers[0];
    const filesAreEqual = buffers.every(b => ref.equals(b));

    return filesAreEqual;
}

const _safe = (...filePaths: string[]) => 
    _cmp(...filePaths).catch(() => false)

const cmp = Object.assign(_cmp, {
    safe: _safe
});

export default cmp;