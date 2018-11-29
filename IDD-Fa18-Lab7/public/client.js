/*
client.js

Author: Nikolas Martelaro (nmartelaro@gmail.com)
Extended: David Goeicke (da.goedicke@gmail.com)
Purpose: This run the interactivity and communication for the web app. This file
is served to the users web browser and executes on the browser.

Usage: This file is called automatically when the webpage is served.

//--Addition. Added a button handling for the `Take a picture` button.
*/

// WebSocket connection setup
var socket = io();

// send out LedOn message over socket
function ledON() {
  socket.emit('ledON');
}

// send out ledOFF message over socket
function ledOFF() {
  socket.emit('ledOFF');
}

//-- Addition: Forward the `Take a picture` button-press to the webserver.
function takePicture(){
  socket.emit('takePicture');
}

//-- Addition: Forward the `Meme_ify` button-press to the webserver.
function Meme_ify(){
  socket.emit('Meme_ify');
}

//-- Addition: Forward the `intruder` button-press to the webserver.
function intruder_alert_yes(){
  window.alert("User Authorized, Opening Box");
  socket.emit('authorizeUser');
}
function intruder_alert(msg){
  window.alert("Intruder Detected! Calling 911");
  socket.emit('intruderDetected');
}

//-- Addition: This function receives the new image name and applies it to html element.

socket.on('newPicture', function(msg) {
  document.getElementById('pictureContainer').src=msg;
});

socket.on('popup', function(msg){
  if (msg === 'Jamie' || msg === 'Tal' || msg === 'Wen' || msg === 'New_User'){
    window.alert('Welcome Home '+ msg);
  } else {
    window.alert('Stranger Detected');
  }
})

socket.on('error', function(msg){
  window.alert('Failed to detect faces, reposition camera');
})

// read the data from the message that the server sent and change the
// background of the webpage based on the data in the message
socket.on('server-msg', function(msg) {
  msg = msg.toString();
  console.log('msg:', msg);
  switch (msg) {
    case "light":
      document.body.style.backgroundColor = "white";
      console.log("white")
      break;
    case "dark":
      document.body.style.backgroundColor = "black";
      console.log("black");
      break;
    default:
      //console.log("something else");
      break;
  }
});
