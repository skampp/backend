Assuming there is a 3rd list item, it can be selected via the first line,
and reassigned a value on the second line.

newThird = document.querySelector("body > ul > li:nth-child(3)");
newThird.innerHTML = "Clint";

Also:
document.firstElementChild.lastElementChild.querySelector("ul").lastElementChild.innerHTML = "Angela";

Methods can also be used once selected.  Assuming it was a button:
newThird = document.querySelector("input").click();
Methods are like functions in that they require ()

Properties can also be set:
document.firstElementChild.lastElementChild.querySelector("ul").lastElementChild.style.color = "red";

Or retrieved:
document.firstElementChild.lastElementChild.querySelector("ul").lastElementChild.style.color;

Get an array of a particular tag type:
document.getElementsByTagName("li")

Can then refer to elements of that array by number:
document.getElementsByTagName("li")[2].style.color = "purple";

There are several getElementsBy types, such as class name, name, tag name, etc.

There is also a variant that returns a single item, i.e. not an array:
getElementByID("");

As previously used, querySelector("") also gets single items.  The "selector" bit is the element,
class, or ID as given in the CSS!  Be sure to use the dot or the hash in front of classes and ID's.
These can have several selectors inside the "":
document.querySelector("li a");
This gets all list items that have an anchor element.
The rules also apply as before when using multiples.  "li.item" gets only LI's that are a class of item.
li.item gets something that, in the SAME tag is both li and class item.
li .item gets any list items that are class item, because of the space between them.

If there are multiples and you want all of them inside an array, use querySelectorAll instead.

Important note... just because we can do this doesn't mean we should do this - meaning, changing properties
that should be done via CSS.  So there is a way using Java to assign or remove a class to an element.
The class would then control the properties.  Ex:
document.querySelector("button").classList.add("invisible");
And the "invisible" class sets the visibility, that satisfies the requirements and best practices.
.add, .remove, .toggle

A word about innerHTML...  Consider this:
<h1><strong>Hi!</strong></h1>
using innerHTML, I'd get the strong tags as well as the text.  If I only want the text, just use
textContent.

Manipulating attributes:
document.querySelector("a"); //gets the first element with an anchor tag
document.querySelector("a").attributes; //gets a list of its attributes
document.querySelector("a").getAttribute("href"); //retrieves the URL
document.querySelector("a").setAttribute("href", "newURL"); //sets the URL to a new one
