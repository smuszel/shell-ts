import { promises as fsp } from 'fs';

const fileContents = file => fsp.readFile(file, 'utf8');

const testPattern = async (file, pattern) => {
    const content = await fileContents(file);
    const satisfies = pattern.test(content);

    return satisfies;
}

interface fileContents {
    (file: string): Promise<string>;
    test: (file: string, pattern: RegExp) => Promise<boolean>
}

//@ts-ignore
fileContents.test = testPattern;

export default fileContents as fileContents;