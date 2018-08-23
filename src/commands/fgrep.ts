import { flatten } from '../tools';
import fullReaddir from '../helpers/fullReaddir';
import fileContents from '../helpers/fileContents';

const fgrep = async (dir, pattern) => {
    const [files, directories] = await fullReaddir.segregate.getNames(dir);
    
    const promisesBelow = directories.map(dir => fgrep(dir, pattern));
    const matchedFilesBelow = await Promise.all(promisesBelow);
    
    // Unfurtunately filterAsync does not exist
    const fileMatchPromises = files.map(fi => fileContents.test(fi, pattern));
    const matches = await Promise.all(fileMatchPromises);
    const matchedFilesHere = files.filter((fi, ix) => matches[ix]);
    const allMatchedFiles = flatten([matchedFilesHere, matchedFilesBelow]);
    
    return allMatchedFiles;
}

interface fgrep {
    (dir: string, pattern: RegExp): Promise<string[]>;
}

export default fgrep as fgrep;