import { promises as fs } from 'fs';
import { resolve } from 'path'; 
import fullReaddir from '../helpers/fullReaddir';
import { flatten } from '../tools';

const _ls = async (dirname: string = __dirname) => {
    const baseNames = await fs.readdir(dirname);
    const absolutePaths = baseNames.map(name => resolve(dirname, name));
    
    return absolutePaths;
}

const _recursive = async (dirname: string = __dirname): Promise<string[]> => {
    const [directoriesHere, filesHere] = await fullReaddir.segregate.getPaths(dirname);
    const filesBelow = await Promise.all(directoriesHere.map(d => _recursive(d)));
    const allNames = [].concat(flatten(filesBelow), filesHere, directoriesHere);

    return allNames;
}

const ls = Object.assign(_ls, {
    r: _recursive
})

export default ls;