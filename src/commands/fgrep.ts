import fullReaddir from '../helpers/fullReaddir';
import fileContents from '../helpers/fileContents';
import { flatten } from '../tools';

const fgrep = async (dir: string, pattern: RegExp): Promise<string[]> => {
    const [directories, files] = await fullReaddir.segregate.getPaths(dir);
    
    const promisesBelow = directories.map(dir => fgrep(dir, pattern));
    const matchedFilesBelow = (await Promise.all(promisesBelow));
    
    // Unfortunately filterAsync does not exist
    const fileMatchPromises = files.map(fi => fileContents.test(fi, pattern));
    const matches = await Promise.all(fileMatchPromises);
    const matchedFilesHere = files.filter((fi, ix) => matches[ix]);
    const allMatchedFiles = [].concat(matchedFilesHere, flatten(matchedFilesBelow));
    
    return allMatchedFiles;
}

export default fgrep;