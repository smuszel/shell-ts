import { rejects } from './util';
import { promises as fsp,  } from 'fs';
import { assert } from 'chai';
import { resolve, join } from 'path';
import cp from '../src/commands/cp';
import rimraf from 'rimraf';

const emptySpaceBasename = 'vvv';
const existingDirectoryBasename = 'aaa';
const otherExistingDirectoryBasename = 'bbb';
const fixRoot = p => p.replace(existingDirectoryBasename, emptySpaceBasename);
const problem = __dirname.toString().includes(existingDirectoryBasename);

if (problem) {
    throw new Error('current path has conflict with tests');
}

const root = resolve('temp', 'cp_root');
const emptySpace = join(root, emptySpaceBasename);

const existingDirectory = join(root, existingDirectoryBasename);
const existingSubdirectory = join(existingDirectory, 'sub');
const existingSubfile = join(existingSubdirectory, 'x.ts');
const existingFile1 = join(existingDirectory, 'x.ts');
const existingFile2 = join(existingDirectory, 'y.ts');

const otherExistingDirectory = join(root, otherExistingDirectoryBasename);
const otherExistingSubdirectory1 = join(otherExistingDirectory, 'sub');
const otherExistingSubdirectory2 = join(otherExistingDirectory, 'sub_');
const otherExistingSubfile1 = join(otherExistingSubdirectory1, 'x.ts');
const otherExistingSubfile2 = join(otherExistingSubdirectory1, 'y.ts');
const otherExistingFile1 = join(otherExistingDirectory, 'x.ts');
const otherExistingFile2 = join(otherExistingDirectory, 'y.ts');
const otherExistingFile3 = join(otherExistingDirectory, 'z.ts');


beforeEach('set up directory structure', async () => {
    await new Promise(rez => setTimeout(rez, 0));

    await fsp.mkdir(root);

    await Promise.all([
        fsp.mkdir(existingDirectory),
        fsp.mkdir(otherExistingDirectory),
    ]);

    await Promise.all([
        fsp.mkdir(existingSubdirectory),
        fsp.mkdir(otherExistingSubdirectory1),
        fsp.mkdir(otherExistingSubdirectory2),
    ]);

    await Promise.all([
        fsp.writeFile(existingSubfile, 'a'),
        fsp.writeFile(existingFile1, 'b'),
        fsp.writeFile(existingFile2, 'c'),

        fsp.writeFile(otherExistingSubfile1, '_a_'),
        fsp.writeFile(otherExistingSubfile2, '_b_'),
        fsp.writeFile(otherExistingFile1, '_c_'),
        fsp.writeFile(otherExistingFile2, '_d_'),
        fsp.writeFile(otherExistingFile3, '_e_'),
    ]);
});

afterEach('', () => {
    rimraf.sync(root);
});

describe('cp', async () => {

    it('given a file and empty destination within existing directory, clones file', async () => {
        await cp.shx(existingSubfile, emptySpace);


        const [sourceContent, destinationContent] = await Promise.all([
            fsp.readFile(existingSubfile, 'utf8'),
            fsp.readFile(emptySpace, 'utf8'),
        ]);

        assert(sourceContent === destinationContent);
        assert(!!sourceContent);
    });

    it('given a directory, throws', async () => {
        rejects(cp.shx(existingDirectory, emptySpace));
    });

    it('given any conflict, throws', () => {
        rejects(cp.shx(existingFile1, existingFile2));
    });
});

describe('cp -f', async () => {

    it('given a file and existing destination as file, overwrites', async () => {
        const destinationContentBefore = await fsp.readFile(existingFile2, 'utf8');
        const sourceContentBefore = await fsp.readFile(existingFile1, 'utf8');

        await cp.f.shx(existingFile1, existingFile2);

        const destinationContentAfter = await fsp.readFile(existingFile2, 'utf8');
        const sourceContentAfter = await fsp.readFile(existingFile1, 'utf8');

        assert(destinationContentBefore !== destinationContentAfter);
        assert(destinationContentAfter === sourceContentBefore);
        assert(sourceContentAfter === sourceContentBefore);
    });
});

describe('cp -r', async () => {

    it('given a nested directory and empty destination, copies everything', async () => {
        await cp.r.shx(existingDirectory, emptySpace);

        const [
            s1,
            s2,
            s3,

            d1,
            d2,
            d3
        ] = await Promise.all([
            fsp.readFile(existingSubfile, 'utf8'),
            fsp.readFile(existingFile1, 'utf8'),
            fsp.readFile(existingFile2, 'utf8'),
            
            fsp.readFile(fixRoot(existingSubfile), 'utf8'),
            fsp.readFile(fixRoot(existingFile1), 'utf8'),
            fsp.readFile(fixRoot(existingFile2), 'utf8'),
        ]);

        assert(s1 === d1);
        assert(s2 === d2);
        assert(s3 === d3);
    });

    it('when destination exists, throws', async () => {
        rejects(cp.r.shx(existingDirectory, otherExistingDirectory));
    });
});

describe('cp -rf', async () => {

    it('given a nested directory and empty destination, copies everything', async () => {
        await cp.rf.shx(existingDirectory, emptySpace);

        const [
            s1,
            s2,
            s3,

            d1,
            d2,
            d3
        ] = await Promise.all([
            fsp.readFile(existingSubfile, 'utf8'),
            fsp.readFile(existingFile1, 'utf8'),
            fsp.readFile(existingFile2, 'utf8'),

            fsp.readFile(fixRoot(existingSubfile), 'utf8'),
            fsp.readFile(fixRoot(existingFile1), 'utf8'),
            fsp.readFile(fixRoot(existingFile2), 'utf8'),
            ]);

        assert(s1 === d1);
        assert(s2 === d2);
        assert(s3 === d3);
    });

    it('when destination exists, overwrites matching names and preserves old entries', async () => {

        const [
            contentSubfile1Before,
            contentSubfile2Before
        ] = await Promise.all([
            fsp.readFile(otherExistingSubfile1, 'utf8'),
            fsp.readFile(otherExistingSubfile2, 'utf8')
        ]);

        await cp.rf.shx(existingDirectory, otherExistingDirectory);


        const [
            contentSubfile1After,
            contentSubfile2After
        ] = await Promise.all([
            fsp.readFile(otherExistingSubfile1, 'utf8'),
            fsp.readFile(otherExistingSubfile2, 'utf8')
            ]);
        
        const subFile1Changed = contentSubfile1Before !== contentSubfile1After;
        const subFile2Preserved = contentSubfile2Before === contentSubfile2After;
        
        assert(subFile1Changed);
        assert(subFile2Preserved);
    });
});