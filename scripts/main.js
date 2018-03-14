var myHeading = document.querySelector('h1');
myHeading.textContent = 'My New Heading Text!';

var iceCream = 'chocolate';
if (iceCream === 'zchocolate') {
  alert('Yay, I love chocolate ice cream!');    
} else {
  alert('Awwww, but chocolate is my favorite...');    
}

document.querySelector('html').onclick = function() {
    alert('Ouch! Stop poking me!');
}