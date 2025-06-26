// Lesson 99
// Random number between 1 and 6:
// var n = Math.random();
// n*=6;
// console.log(Math.floor(n)+1);

// var n = Math.random();
// n*=100;
// n=(Math.floor(n)+1);
// personYou=prompt("What's your name?");
// personThem=prompt("What's your crush's name?");
// alert(personYou + " and " + personThem + " have a " + n + " percent chance of a hookup.");

// Lesson 100
// if (track === "clear"){
//     goStraight();
// } else {
//     turnRight();
// }
    
// === equals
// > greater

// Lesson 101
// === this equals that
// !== this doesn't equal that
// <, >, <=, >= are normal.
// == (2 equal signs) checks for value equality only.
// === (3 equal signs) checks for value equality AND type equality.
// = (1 equal sign) ONLY assigns value, does not check for equality at all.

// Lesson 102
// && Both conditions true
// || Either condition is true
// ! Not true
// Can be combined, such as &! (first condition met, second one not met)

// if(score >= 30 && score <= 70) {
//     do something;
// }

// score1 = 15;
// score2 = 35;
// if(score1 > 10 && score2 < 30){
//     console.log("Both conditions met.");
// }
// else {
//     console.log("At least one condition not met.");
// }

// Lesson 103, Code Challenge
// If divisible by 4, but NOT 100, UNLESS also divisible by 500, it's a leapyear.
// myYear=prompt("What year?");
// leapYear(myYear);

// function leapYear(testYear){
//     if((testYear % 4) == 0) {
//           if(testYear % 100 != 0 || testYear % 400 == 0 ) {
//               console.log("Yes, it's a leapyear.");
//           } else {
//             console.log("No, it's not a leapyear.");
//           }
//      } else {
//         console.log("No, it's not a leapyear.");
//         }
//      }