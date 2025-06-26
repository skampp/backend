// Lesson 108


// var myNumbers = [];
// var myAdd = 1;
// var myCount = 1;
// fizzBuzz();

// function fizzBuzz(){
//     while (myAdd <= 50) {
//         myCount = myAdd;
//         if (myCount % 3 == 0) {
//             if (myCount % 5 == 0) {
//                 myCount = "Fizz Buzz";
//             } else {
//                 myCount = "Fizz";
//             }
//         } else {
//             if (myCount % 5 == 0) {
//                 myCount = "Buzz";
//             }
//         }
        
//         myNumbers.push(myCount);
//         console.log(myNumbers);
//         myAdd+=1;
//     }
// }



// var myNumbers = [];
// var myAdd = 1;
// var myCount = 1;

// fizzBuzz();

// function fizzBuzz(){
//     // FOR instead of WHILE
//     for (var myCount2=37; myCount2<=60; myCount2++){
//         myCount = myAdd;
//         if (myCount % 3 == 0) {
//             if (myCount % 5 == 0) {
//                 myCount = "Fizz Buzz";
//             } else {
//                 myCount = "Fizz";
//             }
//         } else {
//             if (myCount % 5 == 0) {
//                 myCount = "Buzz";
//             }
//         }
        
//         myNumbers.push(myCount);
//         console.log(myNumbers);
//         myAdd+=1;
//     }
// }




// var fibTable = [];
// var myStart = 1;
// var myNext = 3;

// fibTable.push(myStart, myNext);
// makeTable(10, myStart, myNext);

// // function makeTable(10, 0, 1) {
// function makeTable(qtyOfNumbers, myStart, myNext) {
//     while (fibTable.length < qtyOfNumbers) {
//         var myAdd = myStart + myNext;
//         fibTable.push(myAdd);
//         myStart = myNext;
//         myNext = myAdd;
//     }    
//     console.log(fibTable);
// }

recipeArray.ingredientsMany.forEach(veggie => {
//do stuff
//Inside the array named recipeArray with another array inside it called ingredientsMany, for each veggie in that, do something.
})