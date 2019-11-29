'use strict'
var view = {
  displayMessage:function(msg){
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML=msg;
  },
  displayHit:function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  displayMiss:function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class","miss");
  }
};

var model = {
  borderSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [{location: [0,0,0], hits:["", "", ""] },
          {location: [0,0,0], hits:["", "", ""] },
          {location: [0,0,0], hits:["", "", ""] }],
  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.location.indexOf(guess);
      if (index >= 0 ) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function(ship) {
  for (var i = 0; i < this.shipLength; i++) {
    if (ship.hits[i] !== "hit") {
      return false;
    }
  }
  return true;
 },
  generateShipLocations: function(){
 var location;
 for( var i = 0 ;i < this.numShips; i++){
   do{
     location = this.generateShip();
   }while(this.collision(location));
   this.ships[i].location = location;
 }
},
  generateShip: function(){
    var direction = Math.floor(Math.random() * 2);
    var row,col;

    if(direction === 1){
      row = Math.floor(Math.random() * this.borderSize);  //сгенирировать начальную позицию для горизонтальных кораблей
      col = Math.floor(Math.random() * (this.borderSize - this.shipLength));
    }else {
      row = Math.floor(Math.random() * (this.borderSize - this.shipLength));  //сгенирировать начальную позицию для верттикальных кораблей
      row = Math.floor(Math.random() * this.borderSize);
    }
  var newShipLocations = [];
  for (var i = 0; i < this.shipLength; i++) {
    if(direction === 1 ){
     newShipLocations.push (row + ""+ (col + i));  // добавить в массив для горизонтального корабля
    }else {
      newShipLocations.push((row + i) + "" + col); //добавить в массив для вертикального корабля
    }
  }
  return newShipLocations;
 },
  collision: function(location){
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < location.length; j++) {
        if(ship.location.indexOf(location[j]) >= 0){
          return true;
        }
      }
   }
   return false;
 }
};

var controller = {
   guesses:0,
   processGuess: function(guess){
     var location = parseGuess(guess);
     if(location){
       this.guesses++;
       var hit = model.fire(location);
       if(hit && model.shipsSunk === model.numShips){
         view.displayMessage("You sank all my battleships, in "+ this.guesses + "guesses");
       }
     }
   }
 };

function parseGuess(guess) {
   var alphabet = ["A","B","C","D","E","F","G"];
   if (guess === null || guess.length !== 2){
     alert("Oops, ples enter a letter and a number on the board.");
   } else {
     var firstChar = guess.charAt(0);
     var row = alphabet.indexOf(firstChar);

     var column = guess.charAt(1);
     if(isNaN(row) || isNaN(column)) {
       alert("Oops, that isn't on the board.");
     } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
       alert("Oops, that's off  the board!");
     } else{
       return row + column;
     }
   }
   return null;
 };

function init(){
   var fireButton = document.getElementById("fireButton");
   fireButton.onclick = handleFireButton;
   var guessInput = document.getElementById("guessInput");
   guessInput.onkeypress = handleKeyPress;

   model.generateShipLocations();
 }

function handleKeyPress(e) {
   var fireButton = document.getElementById("fireButton");
   if(e.keyCode === 13){
     fireButton.clike();
     return false;
   }
 }

function handleFireButton(){
   var guessInput = document.getElementById("guessInput");
   var guess = guessInput.value;
   controller.processGuess(guess);
   guessInput.value = "";
 }
window.onload = init;
