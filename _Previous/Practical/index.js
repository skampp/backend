//higher level function vs callback function - such as an eventlistener and the responding event function - practice this eventually

var lsPriestlyBlessing = new Lesson("Priestly Blessing", "Blessing for the Priestly line", "Numbers 6:24-26", "24 The LORD bless you and keep you; 25 The LORD make His face shine upon you, And be gracious to you; 26 The LORD lift up His countenance upon you, And give you peace.", "This is the blessing from Abraham to the line of Aaron.");

document.querySelector("h1").innerHTML = lsPriestlyBlessing.lsTitle;
document.querySelector("h2").innerHTML = lsPriestlyBlessing.lsDescription;
document.querySelector(".verses").innerHTML = lsPriestlyBlessing.lsVerses;
document.querySelector(".body").innerHTML = lsPriestlyBlessing.lsBody;
document.querySelector(".lesson").innerHTML = lsPriestlyBlessing.lsLesson;

function Lesson(lsTitle, lsDescription, lsVerses, lsBody, lsLesson){
    this.lsTitle = lsTitle;
    this.lsDescription = lsDescription;
    this.lsVerses = lsVerses;
    this.lsBody = lsBody;
    this.lsLesson = lsLesson;
}