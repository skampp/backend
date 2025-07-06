
var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
$(document).keydown(function (e) {
    //alert(e.key + " was pressed.");
    if (!started) {
        $("h1").text("Level 0");
        nextSequence();
        started = true;
    }
});
$(".btn").click(function () {
    var userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    animatePress(userChosenColor);
    playSound(userChosenColor);
    checkAnswer(this.id);
    //alert("This.id: " + this.id + ", userChosenColor: " + userChosenColor);
});
function nextSequence() {
    level++;
    userClickedPattern = [];
    $("h1").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    //return randomNumber;
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}
function playSound(name) {
    var audioColor = new Audio("./sounds/" + name + ".mp3");
    audioColor.play();
}
function animatePress(currentColor) {
    $("." + currentColor).addClass("pressed");
    setTimeout(function () {
        $("." + currentColor).removeClass("pressed")
    }, 100);
}
function checkAnswer(currentLevel) {
    console.log("Current Level: " + currentLevel);
    if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) {
        //The above bit is messed up.  I passed the wrong thing, or I am "elsing" in the wrong place, so go back and check that out.
        console.log("First if passed - " + gamePattern[currentLevel] + " and " + userClickedPattern[currentLevel]);
        if (userClickedPattern.length == gamePattern.length) {
            console.log("Second Loop Passed - " + userClickedPattern.length + ", " + gamePattern.length);
            //console.log("Success - Game Pattern: " + gamePattern + ", User Pattern: " + userClickedPattern);
            setTimeout(function () {
                nextSequence();
            }, 1000);
        } else {
            console.log("wrong (Second Loop Failed)");
        }
    }
}
