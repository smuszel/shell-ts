import Shell from "./Shell";

const main = async () => {
    const $ = new Shell();

    const name1 = 'testdir';
    const name2 = 'testdir123';
    const name3 = 'xyz.txt';
    const name4 = 'abc.txt';

    // const res = await $.cp.rf.shx(name1, name2);
    const res = $.cp.rf.shx(name1, name2);
    console.log(res);

}; main();





