import { assert as chaiAssert } from 'chai';
import { promises } from 'fs';

export const rejects = (prom: Promise<any>) => {
    chaiAssert.isExtensible(prom.catch(() => ({})))
}

export const exists = path =>
    promises.stat(path)
        .then(() => true)
        .catch(() => false)
        ;