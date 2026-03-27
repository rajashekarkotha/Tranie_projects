var username: string;
username = "your name";
console.log("Hello " + username);

var age: number;
age = 67;
let isEligibleToVote: Boolean;
isEligibleToVote = age >= 18;

console.log(`Hai ${username}! you are ${age} years old hence you ${isEligibleToVote ? "can vote" : "cannot vote"}`);

const sum = function (a: number, b: number): number {
    return a + b;
}

console.log(sum(10, 56));


var x: any;

x = "name";
console.log(`${x} is a ${typeof x}`);



x = 45;
console.log(`${x} is a ${typeof x}`);

x = false;
console.log(`${x} is a ${typeof x}`);