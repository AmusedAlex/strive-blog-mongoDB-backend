import bcrypt from "bcrypt";

const plainPW = "1234";
const numberOfRounds = 10;
// rounds = 10 means that the alorithm will be calculated 2^10 times ---> 1024 times
// rounds = 11 means that the alorithm will be calculated 2^10 times ---> 2048 times
console.log(
  `rounds = ${numberOfRounds} means that the alorithm will be calculated 2^${numberOfRounds} times ---> ${Math.pow(
    2,
    numberOfRounds
  )} times`
);

console.time("hash");
const hash = bcrypt.hashSync(plainPW, numberOfRounds);
console.timeEnd("hash");

console.log("HASH ", hash);

const isPWOk = bcrypt.compareSync(plainPW, hash);

console.log("Do they match?", isPWOk);
