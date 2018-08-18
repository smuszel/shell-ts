interface FileSystemEntry {
    absolutePath: string;
    isDirectory: boolean;
    isFile: boolean;

    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}

// dev: ID of device containing file
// ino: inode number
// mode: protection
// nlink: number of hard links
// uid: user ID of owner
// gid: group ID of owner
// rdev: device ID(if special file)
// size: total size, in bytes
// atime - time of last access
// mtime - time of last modification
// ctime - time of last status change