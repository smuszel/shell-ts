import { promises as fsp } from 'fs';
import { fullReaddir } from '../helpers';
import { flatten } from '../tools';

class FGrep {

    private async doesMatch(file, pattern) {
        console.log(file, pattern);
        const fileContent = await fsp.readFile(file, 'utf8');
        const fileSatisfiesPattern = pattern.test(fileContent);

        return fileSatisfiesPattern;
    }

    private async _execute(dir, pattern) {
        const fsEntries = await fullReaddir(dir);

        const directoryEntriesNames = fsEntries
            .filter(ent => ent.isDirectory)
            .map(ent => ent.absolutePath)
            ;

        const fileEntriesNames = fsEntries
            .filter(ent => ent.isFile)
            .map(ent => ent.absolutePath)
            ;
        
        const promisesBelow = directoryEntriesNames.map(n => this._execute(n, pattern));
        const namesBelow = await Promise.all(promisesBelow);
        
        const fileMatchPromises = fileEntriesNames.map(fi => this.doesMatch(fi, pattern));
        const matches = await Promise.all(fileMatchPromises);

        const namesHere = fileEntriesNames.filter((fi, ix) => matches[ix]);
        const allResults = flatten([namesHere, namesBelow]);
        
        return allResults;
    }

    shx(dir: string, pattern: RegExp): Promise<string[]> {
        return this._execute(dir, pattern);
    }
}

export default new FGrep();