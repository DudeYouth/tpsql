console.log(Promise)
let say10 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(10);
        }, 5000)
    })
}

async function say() {
    let num = await say10();
    console.log(num);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(20)
        }, 3000)
    })
}

function allSay() {
    let pro = say();
    return pro;
}
async function says() {
    let num = await allSay();
    return num;
}
async function s() {
    let num = await says();
    console.log(num);
}
s();