//Create an object
var houseKeeper1 = {
howLong: 5,
workExperience: ["California", "Bates"],
okTasks: "Windows (95)",
//add a method via anonymous function
moveSuitcase: function() {
    alert("Moving suitcase.");
    }
}

//Call the method
houseKeeper1.moveSuitcase();

//Create a constructor function
function HouseKeeper(howLong, workExperience, okTasks) {
    this.howLong = howLong;
    this.workExperience = workExperience;
    this.okTasks = okTasks;
    //add a method via anonymous function
    this.moveSuitcase = function() {
        alert("Moving suitcase.");
        }
}

//Initalize an object
var greta = new HouseKeeper(5, ["California", "Bates"], "Windows(95)");
var timmy = new HouseKeeper(15, ["Roach", "6"], "Vacuuming");
