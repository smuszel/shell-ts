import touch from './commands/touch';

const main = async () => {

    const name1 = 'testdir';
    const name2 = 'testdir123';
    const name3 = 'xyz.txt';
    const name4 = './aaa/abc.txt';

    const x = await touch.shx(name4).catch(e => {
        console.log(3 + 3);
        console.log(e)
    });


    // const res = await $.cp.rf.shx(name1, name2);
    // const res = $.cp.rf.shx(name1, name2);
    // console.log(res);

};

main();




