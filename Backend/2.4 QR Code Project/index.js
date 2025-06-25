/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image"; // module version
// var qr = require("qr-image"); // original js version
import fs from "fs";

inquirer
  .prompt([
    {
      message: "What place are we ordering from tonight?",
      name: "URL"
    },
    {
      message: "Color?",
      name: "Color"
    }
  ])
  
  .then((answers) => {
    const url = answers.URL;
    const colors = answers.Color;
    //console.log("URL: " + url + ", Colors: " + colors);
  
    var qr_svg = qr.image(url + ", " + colors);
    qr_svg.pipe(fs.createWriteStream("dinner.png"));

    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
