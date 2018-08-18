export class FileSystemEntryInter {
    private prom: Promise<FileSystemEntry[]>;

    constructor(prom: Promise<FileSystemEntry[]>) {
        this.prom = prom;
    }

    get full() {
        return this.prom;
    }
    
    get absolutePath() {
        return this.prom.then(xs => xs.map(x => x.absolutePath)); 
    }
    
    get createdDate() {
        return this.prom.then(xs => xs.map(x => x.ctime));
    }
    // get x() {
    //     return this.prom.then(xs => xs.map(x => x.));
    // }
}