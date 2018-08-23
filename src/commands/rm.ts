import { promises as fsp } from 'fs';
import { join } from 'path';

export class Rm {
    get rf() {
        return new RmRecursiveForce();
    }

    async shx(target) {
        fsp.unlink(target)
    }
}

class RmRecursiveForce {

    private async removeDirectoryContents(dir) {
        const contents = await fsp.readdir(dir);
        const contentsPaths = contents.map(x => join(dir, x));
        const p = Promise.all(contentsPaths.map(n => this._execute(n)));

        return p;
    }

    private removeFile(file) {
        return fsp.unlink(file);
    }

    private async _execute(target) {
        const st = await fsp.stat(target);
    
        if (st.isDirectory()) {
            await this.removeDirectoryContents(target);
            await fsp.rmdir(target);

            return
        } else {
            await this.removeFile(target);

            return ;
        }
    }
    
    shx(target) {
        return this._execute(target);
    }
}

export default new Rm();