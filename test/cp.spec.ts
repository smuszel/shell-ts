import { promises as fsp, existsSync } from 'fs';
import { expect } from 'chai';
import { resolve, join } from 'path';
import cp from '../src/commands/cp';
import { exec } from 'child_process';

const nonExisting1 = resolve('temp', 'cpne.ts');
const nonExisting2 = resolve('temp', 'cpne', 'cpne.ts');
const emptyDirectory = resolve('temp', 'cpdir')

const source_root = resolve('temp', 'Scproot');
const source_subdirectory = join(source_root, 'Sdir1');
const source_file1 = join(source_root, 'Scp1.ts');
const source_file2 = join(source_subdirectory, 'Scp2.ts');
const source_file3 = join(source_subdirectory, 'Scp3.ts');

const destination_root = resolve('temp', 'Dcproot');
const destination_subdirectory = join(destination_root, 'Sdir1');
const destination_file1 = join(destination_root, 'Scp1.ts');
const destination_file2 = join(destination_subdirectory, 'Scp2.ts');
const destination_file3 = join(destination_subdirectory, 'Scp3.ts');
const destination_within_existing_dir = resolve('temp', 'Scpx.ts');

const other_existing_file = resolve('temp', 'Ecpx.ts')
const destination_existing_root = resolve('temp', 'Ecproot');
const destination_existing_subdirectory = join(destination_existing_root, 'Sdir1');
const destination_existing_file1 = join(destination_existing_root, 'Ecp1.ts');
const destination_existing_file2 = join(destination_existing_subdirectory, 'Scp2.ts');
const destination_existing_file3 = join(destination_existing_subdirectory, 'Scp3.ts');
const destination_existing_omited_dir = join(destination_existing_root, 'ddd');

before('set up directory structure', async () => {
    await Promise.all([
        fsp.mkdir(source_root),
        fsp.mkdir(destination_existing_root),
        fsp.mkdir(emptyDirectory),
    ]);

    await Promise.all([
        fsp.mkdir(source_subdirectory),
        fsp.mkdir(destination_existing_subdirectory),
        fsp.mkdir(destination_existing_omited_dir),
    ]);

    await Promise.all([
        fsp.writeFile(source_file1, 'a'),
        fsp.writeFile(source_file2, 'b'),
        fsp.writeFile(source_file3, 'c'),
        fsp.writeFile(other_existing_file, 'x'),

        fsp.writeFile(destination_existing_file1, 'a!'),
        fsp.writeFile(destination_existing_file2, 'b!'),
        fsp.writeFile(destination_existing_file3, 'c!'),
    ]);
});

after('remove directory', async () => {
    exec('rm -rf temp/*');
});

describe('cp', async () => {

    it('given a directory, throws', async () => {
        const a = await cp.shx(source_root, destination_root).catch(() => 'throw');
        expect(a).to.equal('throw');
    });

    it('given a file and empty destination within existing directory, clones file to destination', async () => {
        await cp.shx(source_file1, destination_within_existing_dir);

        const [sourceContent, destinationContent] = await Promise.all([
            fsp.readFile(source_file1, 'utf8'),
            fsp.readFile(destination_within_existing_dir, 'utf8'),
        ]);

        expect(sourceContent).to.equal(destinationContent);
        expect(!!sourceContent).true;
    });

    it('given a file and existing destination, throws', async () => {
        const a = await cp.shx(source_file1, other_existing_file).catch(() => 'throw');
        expect(a).to.equal('throw');
    });

    it('given a file and empty destination without existing directory, throws', async () => {
        const a = await cp.shx(source_file1, destination_file3).catch(() => 'throw');
        expect(a).to.equal('throw');
    });

    it('given a file and existing destination, throws', async () => {
        const a = await cp.shx(source_file1, destination_existing_file1).catch(() => 'throw');
        expect(a).to.equal('throw');
    });

    it('given non existing source, throws', async () => {
        const a = await cp.shx(nonExisting1, nonExisting2).catch(() => 'throw');
        const b = await cp.shx(nonExisting1, destination_existing_file1).catch(() => 'throw');
        
        expect(a).to.equal('throw');
        expect(b).to.equal('throw');
    });
});

describe('cp -f', async () => {

    it('given a file and existing destination, overwrites', async () => {
        const targetContentBefore = fsp.readFile(other_existing_file, 'utf8');
        await cp.f.shx(source_file1, other_existing_file);
        const targetContentAfter = await fsp.readFile(other_existing_file, 'utf8');
        const sourceContent = await fsp.readFile(source_file1, 'utf8');

        expect(targetContentBefore).to.not.equal(targetContentAfter);
        expect(targetContentAfter).to.equal(sourceContent);
    });

    it('when destination is a directory, throws', async () => {
        const a = await cp.f.shx(source_file1, emptyDirectory).catch(() => 'throw');
        expect(a).to.equal('throw');
    });
});

describe('cp -r', async () => {

    it('given a nested directory and empty destination, copies everything', async () => {
        await cp.r.shx(source_root, destination_root);

        const [
            sc1,
            sc2,
            sc3,
            dc1,
            dc2,
            dc3
        ] = await Promise.all([
            fsp.readFile(source_file1, 'utf8'),
            fsp.readFile(source_file2, 'utf8'),
            fsp.readFile(source_file3, 'utf8'),
            fsp.readFile(destination_file1, 'utf8'),
            fsp.readFile(destination_file2, 'utf8'),
            fsp.readFile(destination_file3, 'utf8'),
        ]);

        expect(sc1).to.equal(dc1);
        expect(sc2).to.equal(dc2);
        expect(sc3).to.equal(dc3);
    });

    it('when destination exists, throws', async () => {
        const a = await cp.r.shx(source_root, destination_existing_root).catch(() => 'throw');
        expect(a).to.equal('throw');
    });

    it('given a destination without existing directory, throws', async () => {
        const a = await cp.r.shx(source_root, nonExisting2).catch(() => 'throw');
        expect(a).to.equal('throw');
    });
});

describe('cp -rf', async () => {

    it('given a nested directory and empty destination, copies everything', async () => {
        await cp.rf.shx(source_root, destination_root);

        const [
            sc1,
            sc2,
            sc3,
            dc1,
            dc2,
            dc3
        ] = await Promise.all([
            fsp.readFile(source_file1, 'utf8'),
            fsp.readFile(source_file2, 'utf8'),
            fsp.readFile(source_file3, 'utf8'),
            fsp.readFile(destination_file1, 'utf8'),
            fsp.readFile(destination_file2, 'utf8'),
            fsp.readFile(destination_file3, 'utf8'),
        ]);

        expect(sc1).to.equal(dc1);
        expect(sc2).to.equal(dc2);
        expect(sc3).to.equal(dc3);
    });

    it('when destination exists, overwrites matching names and preserves old entries', async () => {
        const contentOfOmmitedFile = await fsp.readFile(destination_existing_file1, 'utf8');
        await cp.rf.shx(source_root, destination_existing_root);

        const [
            sc1,
            sc2,
            sc3,
            dc1,
            dc2,
            dc3
        ] = await Promise.all([
            fsp.readFile(source_file1, 'utf8'),
            fsp.readFile(source_file2, 'utf8'),
            fsp.readFile(source_file3, 'utf8'),
            fsp.readFile(destination_existing_file1, 'utf8'),
            fsp.readFile(destination_existing_file2, 'utf8'),
            fsp.readFile(destination_existing_file3, 'utf8'),
            ]);
        
        expect(existsSync(destination_existing_omited_dir)).true;
        expect(contentOfOmmitedFile).to.equal(dc1);
        expect(sc1).to.not.equal(dc1);
        expect(sc2).to.equal(dc2);
        expect(sc3).to.equal(dc3);
    });

    it('given a destination without existing directory, throws', async () => {
        const a = await cp.rf.shx(source_root, nonExisting2).catch(() => 'throw');
        expect(a).to.equal('throw');
    });
});