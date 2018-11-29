# Video Doorbell, Lab 7

*A lab report by Jamie Yu*

### In This Report

1. Upload a video of your version of the camera lab to your lab Github repository
1. As usual, update your class Hub repository to add your [forked IDD-Fa18-Lab7](/FAR-Lab/IDD-Fa18-Lab7) repository.
1. Answer the questions in-line below on your README.md.

## Part A. HelloYou from the Raspberry Pi

**a. Link to a video of your HelloYou sketch running.**

[helloYou](https://www.youtube.com/watch?v=MUhS21ISW10)

## Part B. Web Camera

**a. Compare `helloYou/server.js` and `IDD-Fa18-Lab7/pictureServer.js`. What elements had to be added or changed to enable the web camera? (Hint: It might be good to know that there is a UNIX command called `diff` that compares files.)**

I used the 'diff' function to examine the differences between the 2 files. The library 'node-webcam' in required in pictureServer.js, and because of that the variable 'opts' is created which controls how the webcam is operated. 

```
> var NodeWebcam = require( "node-webcam" );// load the webcam module

> //Default options
> var opts = { //These Options define how the webcam is operated.
>     //Picture related
>     width: 1280, //size
>     height: 720,
>     quality: 100,
>     //Delay to take shot
>     delay: 0,
>     //Save shots in memory
>     saveShots: true,
>     // [jpeg, png] support varies
>     // Webcam.OutputTypes
>     output: "jpeg",
>     //Which camera to use
>     //Use Webcam.list() for results
>     //false for default device
>     device: false,
>     // [location, buffer, base64]
>     // Webcam.CallbackReturnTypes
>     callbackReturn: "location",
>     //Logging
>     verbose: false
> };
> var Webcam = NodeWebcam.create( opts ); //starting up the webcam
```

**b. Include a video of your working video doorbell**

[Video Doorbell](https://www.youtube.com/watch?v=SwiF7Wy9_ys)

## Part C. Make it your own

**a. Find, install, and try out a node-based library and try to incorporate into your lab. Document your successes and failures (totally okay!) for your writeup. This will help others in class figure out cool new tools and capabilities.**

I used the 'caption' node.js library to create memes from images that were captured using the webcam. To do this I added an extra button to the html that was linked to an extra function I created 'meme_ify'. This function linked to the backend on the raspberry pi to call the caption library and add a caption to a previously taken image. Unfortunately, because I structured the library to be called on the backend that meant that I needed to download all dependencies for the library on the backend as well. The 'caption' library depends on 'imagemagick' and 'ghostscript' which I was unfortunately unable to download since I did not have permissions to install that on the pi. 

**b. Upload a video of your working modified project**

[Here is a video documenting the unsuccessful attempt + the error log](https://www.youtube.com/watch?v=08Vb-C3e1XU)

