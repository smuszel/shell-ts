import { assert as chaiAssert } from 'chai';

export const rejects = (prom: Promise<any>) => {
    chaiAssert.isExtensible(prom.catch(() => ({})))
}