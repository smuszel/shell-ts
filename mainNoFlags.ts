import { promises as fs } from 'fs';
import * as path from 'path';

class LS {

    async shallow(dirname =__dirname) {
        const allFiles = await fs.readdir(dirname);
        return allFiles.map(x => path.resolve(dirname, x));
    }

    async recursive(dirname = __dirname) {
        const arr = await fs.readdir(dirname);
        const allFiles = await Promise.all(arr.map(async subdir => {
            const xPath = path.resolve(dirname, subdir);
            const stats = await fs.stat(xPath);
            return stats.isDirectory()
                ? this.recursive(xPath)
                : xPath;
        }))

        const flat = allFiles.reduce((ac, x) => ac.concat(x), []);
        return flat;
    }
}

class Shell {
    get ls() {
        return new LS();
    }
}



const main = async () => {
    const $ = new Shell();
    const res = await $.ls.recursive('./testdir');
    const res2 = await $.ls.shallow('./testdir');

    console.log(res.filter(x => x.includes('testdir')));
    console.log('\n\n');
    console.log(res2);
}; main();





