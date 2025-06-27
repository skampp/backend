// Lesson 105
// var guestList = ["Clint", "Dana", "Lindsay", "Hannah", "Chloe"];
// guestList[5] = "Nana";
// console.log(guestList.length);
// console.log(guestList.includes("Chloe"));

// if(guestList.includes(prompt("What's your name?"))) {
//     alert("You're on the list.");
// } else {
//     alert("You're not on the list.")
// }

// guestList.push("Eric"); //This would add Eric to the next available spot in the array.
//guestList.push("Eric", "Blake", "Jackson"); //would add the three items.
//guestList.pop; //Removes the last item in the array.
//var guestList[]; // creates an empty array.


// The purpose of this is to count numbers.  If the number is a multiple of 3, it's substituted with "Fizz".
// If the number is a multiple of 5, it's substituted with "Buzz".  If it's a multiple of both, it'substituted
// with "Fizz Buzz".

//Run the whole thing once from the snippet window, then call the function repeatedly from the console window.
    
// var myNumbers = [];
// var myAdd = 1;
// var myCount = 1;
// fizzBuzz();

// function fizzBuzz(){
//     myCount = myAdd;
//     if (myCount % 3 == 0) {
//         if (myCount % 5 == 0) {
//             myCount = "Fizz Buzz";
//         } else {
//             myCount = "Fizz";
//         }
//     } else {
//         if (myCount % 5 == 0) {
//             myCount = "Buzz";
//         }
//     }
    
//     myNumbers.push(myCount);
//     console.log(myNumbers);
//     myAdd+=1;
// }

//Another way to solve this would have been with else if additions, which I didn't know
//were a thing in JS.  So If, else if, else if, else if, else.


// var myWorkers = ["Angela", "Ben", "Jenny", "Michael", "Chloe"];
// yourTurn();

// function yourTurn() {
//     var myPick = Math.floor(Math.random() * myWorkers.length);
//     alert(myWorkers[myPick]);
// }

