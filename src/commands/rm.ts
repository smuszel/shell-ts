import { promises as fsp } from 'fs';
import { join } from 'path';

const _rm = (targetPath: string) => {
    return fsp.unlink(targetPath);
}

const _recursiveForce = async (targetPath: string) => {
    const targetStat = await fsp.stat(targetPath);

    if (targetStat.isDirectory()) {
        await _removeDirectoryContents(targetPath);
        await fsp.rmdir(targetPath);
    } else if (targetStat.isFile()) {
        await _rm(targetPath);
    }
}

const _removeDirectoryContents = async (dir) => {
    const contents = await fsp.readdir(dir);
    const contentsPaths = contents.map(x => join(dir, x));
    const p = Promise.all(contentsPaths.map(n => _recursiveForce(n)));

    return p;
}

const rm = Object.assign(_rm, {
    rf: _recursiveForce
})

export default rm;