import { resolve } from 'path';
import { Stats, stat, promises } from 'fs';

export default class Stat {

    shx(...names): Promise<Stats> {
        const pt = resolve(...names);
        return promises.stat(pt);
    }
}