$("h1").css("color", "red");

$("h1").click(function() {
    $("h1").text("Clicked");
})

$("button").click(function() {
    $("button").text("Clicked");
})

$(document).keypress(function(event) {
    $("h1").text(event.key);
})

$("h1").on("mouseover", function() {
    $("h1").css("color", "purple");
})