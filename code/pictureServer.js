/*
server.js

Authors:David Goedicke (da.goedicke@gmail.com) & Nikolas Martelaro (nmartelaro@gmail.com)

This code is heavily based on Nikolas Martelaroes interaction-engine code (hence his authorship).
The  original purpose was:
This is the server that runs the web application and the serial
communication with the micro controller. Messaging to the micro controller is done
using serial. Messaging to the webapp is done using WebSocket.

//-- Additions:
This was extended by adding webcam functionality that takes images remotely.

Usage: node server.js SERIAL_PORT (Ex: node server.js /dev/ttyUSB0)

Notes: You will need to specify what port you would like the webapp to be
served from. You will also need to include the serial port address as a command
line input.
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var SerialPort = require('serialport'); // serial library
var Readline = SerialPort.parsers.Readline; // read serial data as lines
//-- Addition:
var NodeWebcam = require( "node-webcam" );// load the webcam module
var caption = require('caption');
var path = require('path');
var imageName = '';//global variable for image name
var count = 5 //for dynamic traning image set

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// check to make sure that the user provides the serial port for the Arduino
// when running the server
if (!process.argv[2]) {
  console.error('Usage: node ' + process.argv[1] + ' SERIAL_PORT');
  process.exit(1);
}

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//

//--Additions:
//----------------------------WEBCAM SETUP------------------------------------//
//Default options
var opts = { //These Options define how the webcam is operated.
    //Picture related
    width: 1280, //size
    height: 720,
    quality: 100,
    //Delay to take shot
    delay: 0,
    //Save shots in memory
    saveShots: true,
    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: "jpeg",
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",
    //Logging
    verbose: false
};
var Webcam = NodeWebcam.create( opts ); //starting up the webcam
//----------------------------------------------------------------------------//

//-----experimental face recognition setup for new user images----------------//
 // const fs = require('fs');
 // const cv = require('opencv4nodejs');
 //
 // //our images
 // const basePath = 'public/pics-small';
 // const imgsPath = path.resolve(basePath, 'new-user');
 // const nameMappings = ['New_User'];
 // const imgFiles = fs.readdirSync(imgsPath);
 //
 // const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
 // const getFaceImage = (grayImg) => {
 //   const faceRects = classifier.detectMultiScale(grayImg).objects;
 //   if (!faceRects.length) {
 //     throw new Error('failed to detect faces');
 //   }
 //   return grayImg.getRegion(faceRects[0]);
 // };
 //
 // const images = imgFiles
 //   // get absolute file path
 //   .map(file => path.resolve(imgsPath, file))
 //   // read image
 //   .map(filePath => cv.imread(filePath))
 //   // face recognizer works with gray scale images
 //   .map(img => img.bgrToGray())
 //   // detect and extract face
 //   .map(getFaceImage)
 //   // face images must be equally sized
 //   .map(faceImg => faceImg.resize(80, 80));
 //
 // const isImageFour = (_, i) => imgFiles[i].includes('4');
 // const isNotImageFour = (_, i) => !isImageFour(_, i);
 // // use images 1 - 3 for training
 // const trainImages = images.filter(isNotImageFour);
 // // use images 4 for testing
 // const testImages = images.filter(isImageFour);
 // // make labels
 // const labels = imgFiles
 //   .filter(isNotImageFour)
 //   .map(file => nameMappings.findIndex(name => file.includes(name)));
 //
 // const lbph = new cv.LBPHFaceRecognizer();
 // lbph.train(trainImages, labels);
 //
 // var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/new-user/New_User4.jpg')
 //
 // // face recognizer works with gray scale images
 // new_img = new_img.bgrToGray()
 // try {
 //   // detect and extract face
 //   var faceImg = getFaceImage(new_img)
 //   // face images must be equally sized
 //   var new_image = faceImg.resize(80, 80)
 //
 //   console.log('lbph:');
 //   const result = lbph.predict(new_image);
 //   console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
 //   console.log('recognized',nameMappings[result.label])
 //
 //   io.emit('popup', nameMappings[result.label])
 //   console.log('after ioemit popup')
 //
 // }
 // catch (err){
 //   console.log('err', err)
 //   io.emit('error', err)
 // }


//---------------------- Face Recognition SETUP ---------------------------------//
 const fs = require('fs');
 const cv = require('opencv4nodejs');

// var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/imgs/New_User1.jpg')


if (!cv.xmodules.face) {
  throw new Error('exiting: opencv4nodejs compiled without face module');
}

//walking dead images
// const basePath = 'public/face-recognition';
// const imgsPath = path.resolve(basePath, 'imgs');
// const nameMappings = ['daryl', 'rick', 'negan'];
// const imgFiles = fs.readdirSync(imgsPath);

//our images
const basePath = 'public/pics-small';
const imgsPath = path.resolve(basePath, 'imgs'); //imgs (12 images) , new-user (4 images)
const nameMappings = ['New_User', 'Tal', 'Wen']//['Jamie']; //['New_User', 'Tal', 'Wen'] , ['Jamie']
const imgFiles = fs.readdirSync(imgsPath);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const getFaceImage = (grayImg) => {
  const faceRects = classifier.detectMultiScale(grayImg).objects;
  if (!faceRects.length) {
    throw new Error('failed to detect faces');
  }
  return grayImg.getRegion(faceRects[0]);
};

const images = imgFiles
  // get absolute file path
  .map(file => path.resolve(imgsPath, file))
  // read image
  .map(filePath => cv.imread(filePath))
  // face recognizer works with gray scale images
  .map(img => img.bgrToGray())
  // detect and extract face
  .map(getFaceImage)
  // face images must be equally sized
  .map(faceImg => faceImg.resize(80, 80));

const isImageFour = (_, i) => imgFiles[i].includes('4');
const isNotImageFour = (_, i) => !isImageFour(_, i);
// use images 1 - 3 for training
const trainImages = images.filter(isNotImageFour);
// use images 4 for testing
const testImages = images.filter(isImageFour);
// make labels
const labels = imgFiles
  .filter(isNotImageFour)
  .map(file => nameMappings.findIndex(name => file.includes(name)));

const runPrediction = (recognizer, images) => {
  images.forEach((img) => {
    const result = recognizer.predict(img);
    console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
    //cv.imshowWait('face', img);
    //cv.destroyAllWindows();
  });
};
//
// const eigen = new cv.EigenFaceRecognizer();
// const fisher = new cv.FisherFaceRecognizer();
const lbph = new cv.LBPHFaceRecognizer();
// eigen.train(trainImages, labels);
// fisher.train(trainImages, labels);
lbph.train(trainImages, labels);

// console.log('eigen:');
// runPrediction(eigen, testImages);
//
// console.log('fisher:');
// runPrediction(fisher, testImages);

console.log('lbph:');
runPrediction(lbph, testImages);
//---------------------- Face Recognition SETUP ---------------------------------//

//---------------------- SERIAL COMMUNICATION (Arduino) ----------------------//
// start the serial port connection and read on newlines
const serial = new SerialPort(process.argv[2], {});
const parser = new Readline({
  delimiter: '\r\n'
});

//new functions
serial.pipe(parser);
parser.on('data', function(data) {
  console.log('Data:', data);
  io.emit('server-msg', data);
  //var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/imgs/New_User1.jpg')

  if(data == 'Pressed_S'){
    //var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/imgs/New_User1.jpg')

    var imageName = new Date().toString().replace(/[&\/\\#,+()$~%.'":*?<>{}\s-]/g, '');
    console.log('light making a making a picture at'+ imageName);
    NodeWebcam.capture('public/'+imageName, opts, function( err, data ) {
      //var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/imgs/New_User1.jpg')
      io.emit('newPicture',(imageName+'.jpg'));
      console.log('imageName', imageName)
      var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/'+imageName+'.jpg')
      //var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/pics-small/imgs/New_User1.jpg')
      //var new_img = cv.imread('/home/pi/interactive_faces/IDD-Fa18-Lab7/public/WedNov282018201604GMT0800PacificStandardTime.jpg')

      // face recognizer works with gray scale images
      new_img = new_img.bgrToGray()
      try {
        // detect and extract face
        var faceImg = getFaceImage(new_img)
        // face images must be equally sized
        var new_image = faceImg.resize(80, 80)

        console.log('lbph:');
        const result = lbph.predict(new_image);
        console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
        console.log('recognized',nameMappings[result.label])

        io.emit('popup', nameMappings[result.label])
        console.log('after ioemit popup')

      }
      catch (err){
        console.log('err', err)
        io.emit('error', err)
      }

    });

  } else if (data == 'Pressed_T'){
    if (count <5){
      serial.write(' face the camera ');
      //consider not replacing old users but just adding new images to the pics-small/imgs
      var imageName = 'New_User'+count;
      console.log('light making a making a picture at'+ imageName);
      NodeWebcam.capture('public/pics-small/imgs/'+imageName, opts, function( err, data ) {
        io.emit('newPicture',('/pics-small/imgs/'+imageName+'.jpg')); ///Lastly, the new name is send to the client web browser.
        /// The browser will take this new name and load the picture from the public folder.
        count++
        console.log('count',count)
      });
    }

    if (count === 5){

    // var fs = require('fs');
    // var cv = require('opencv4nodejs');
    //
    //  //our images
    //  var basePath = 'public/pics-small';
    //  var imgsPath = path.resolve(basePath, 'imgs');
    //  var nameMappings = ['Jamie', 'Tal', 'Wen', 'New_User'];
    //  var imgFiles = fs.readdirSync(imgsPath);
    //
    //  var classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    //  var getFaceImage = (grayImg) => {
    //    var faceRects = classifier.detectMultiScale(grayImg).objects;
    //    if (!faceRects.length) {
    //      throw new Error('failed to detect faces');
    //    }
    //    return grayImg.getRegion(faceRects[0]);
    //  };
    //
    //  var images = imgFiles
    //    // get absolute file path
    //    .map(file => path.resolve(imgsPath, file))
    //    // read image
    //    .map(filePath => cv.imread(filePath))
    //    // face recognizer works with gray scale images
    //    .map(img => img.bgrToGray())
    //    // detect and extract face
    //    .map(getFaceImage)
    //    // face images must be equally sized
    //    .map(faceImg => faceImg.resize(80, 80));
    //
    //  var isImageFour = (_, i) => imgFiles[i].includes('4');
    //  var isNotImageFour = (_, i) => !isImageFour(_, i);
    //  // use images 1 - 3 for training
    //  var trainImages = images.filter(isNotImageFour);
    //  // use images 4 for testing
    //  var testImages = images.filter(isImageFour);
    //  // make labels
    //  var labels = imgFiles
    //    .filter(isNotImageFour)
    //    .map(file => nameMappings.findIndex(name => file.includes(name)));
    //
    //  var runPrediction = (recognizer, images) => {
    //    images.forEach((img) => {
    //      var result = recognizer.predict(img);
    //      console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
    //    });
    //  };
    //
    //  var lbph = new cv.LBPHFaceRecognizer();
    //
    //  lbph.train(trainImages, labels);
    //
    //  console.log('lbph:');
    //  runPrediction(lbph, testImages);

     }

  } else if (data == 'another one'){
    console.log('do another thing')
  }

});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION (web browser)----------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a user connected');

  // if you get the 'ledON' msg, send an 'H' to the Arduino
  socket.on('ledON', function() {
    console.log('ledON');
    serial.write('H');
  });

  // if you get the 'ledOFF' msg, send an 'L' to the Arduino
  socket.on('ledOFF', function() {
    console.log('ledOFF');
    serial.write('L');
  });

  // if you get the 'ledON' msg, send an 'H' to the Arduino
  socket.on('authorizeUser', function() {
    console.log('authorizeUser');
    serial.write(' unlocked ');
  });

  // if you get the 'ledOFF' msg, send an 'L' to the Arduino
  socket.on('intruderDetected', function() {
    console.log('intruderDetected');
    serial.write(' intruder ');
  });

  //-- Addition: This function is called when the client clicks on the `Take a picture` button.
  socket.on('takePicture', function() {
    /// First, we create a name for the new picture.
    /// The .replace() function removes all special characters from the date.
    /// This way we can use it as the filename.
    imageName = new Date().toString().replace(/[&\/\\#,+()$~%.'":*?<>{}\s-]/g, '');

    console.log('making a making a picture at'+ imageName); // Second, the name is logged to the console.

    //Third, the picture is  taken and saved to the `public/`` folder
    NodeWebcam.capture('public/'+imageName, opts, function( err, data ) {
    io.emit('newPicture',(imageName+'.jpg')); ///Lastly, the new name is send to the client web browser.
    /// The browser will take this new name and load the picture from the public folder.
  });

  });
  // if you get the 'disconnect' message, say the user disconnected
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  //-- Addition: This function is called when the client clicks on the `Meme_ify` button.
  socket.on('Meme_ify', function(){
    console.log('meme test');

    originalFile = path.resolve('./public/'+imageName+'.jpg')
    saveToFile = path.resolve('./public/'+imageName+'_meme.jpg')
    console.log('orig',originalFile)
    console.log('saved',saveToFile)

    caption.path(originalFile,{
      caption: 'Meme It!',
      outputFile: saveToFile},
      function(err, filename){
        if (!err) {
              console.log('memed');
              io.emit('newPicture',imageName+'_meme.jpg');
            } else {
              console.log(err)
            }
    });
  });

});
//----------------------------------------------------------------------------//
