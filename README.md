# Project Idea

This project aims to build a home security system. The system will recognize if the user lives in the house or has been inputted into the database previously (a friend, relative, etc.); if so, it will welcome the user home with audio ('Weclome Home Tal'). If the system does not recognize the user, the system will instead ring an alarm to alert the presence of thieves or strangers. 

# Team

Wen 

Tal Genkin

Jamie Yu - jky32 

## Rough form: this is your paper prototype (put photos on your GitHub, bring the actual thing to class)
 
## Expected parts: is there a display, a motor, batters, interface, etc? Where does the Pi/Arduino/other controller go?

* camera
* crystal display
* arduino
* raspberry pi

The Pi and arduino will go inside a physical incasing(box) with a button (attached to the arduino) and a camera (attached to the Pi) exposed on the top of the box.

## Interaction plan: how will people interact with your device?

A user who wishes to be recognized can press the first button on top of the box. The Crystal display will show instructions for how to complete inputting the data by pressing the first button again. The display will then ask the user to record a welcome home message for themselves. Then when the user leaves the home, the user can press the second button to turn the home system on while the user is away. The camera will constantly be on, monitoring the area near the door to see if the user has come home again or if a theif has come. 

If the user has come home, the LED screen will display the text 'WELCOME HOME' and play back the welcome song the user recorded previously. If a thief has come, or a stranger that is not in the database, the LED screen will display the text 'THIEF ALERT, POLICE CALLED' and play an alarm. 

