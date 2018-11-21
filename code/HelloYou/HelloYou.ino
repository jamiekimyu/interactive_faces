// include the library code:
#include <LiquidCrystal.h>
#include <String.h>
#include <Servo.h>
Servo myservo;

int led = 13; // led that we will toggle
int T_button = 6;
int S_button = 2;
int button_0 = 10;
int button_1 = 9;

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

int pos = 0;
int done = 0;

int T_buttonState;
int S_buttonState;
int buttonState_0;
int buttonState_1;

void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  pinMode(T_button, INPUT);
  pinMode(S_button, INPUT);
  pinMode(button_0, INPUT);
  pinMode(button_1, INPUT);

  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  //lcd.print("hello, world!");

  // attach the control signal to the servo
  myservo.attach(9);
  myservo.write(0);

}

char inChar;  // character we will use for messages from the RPi
String txtMsg = "";
String txtLCD = "";
unsigned int lastStringLength = txtMsg.length();     // previous length of the String

void loop() {
  // read the character we recieve on the serial port from the RPi_Server

  lastStringLength = txtMsg.length();
  //Serial.println(lastStringLength);
  
  if(Serial.available()) {
    inChar = (char)Serial.read();
    txtMsg = Serial.readString();
  }

  // if we get a 'H', turn the LED on; if we get a 'L', turn the LEC off. 
  if(inChar == 'H'){
    digitalWrite(led, HIGH);
    //Serial.println(txtMsg);
  }
  else if (inChar == 'L'){
    digitalWrite(led, LOW);
  }

  else if (inChar == 'P'){
    //Serial.println(inChar);
    myservo.write(180);
    delay(1000);
    inChar = " ";
  }

  else if (inChar == 'C'){
    //Serial.println(inChar);
    myservo.write(0);
    delay(1000);
    inChar = " ";
  }

  //if a new instruction comes in, assign that value to txtLCD
  else if (txtMsg.length() > 2) {
    txtLCD = txtMsg;
    //Serial.println(inChar);
    //Serial.println(txtMsg);
    //String txtMsg = "";
    
    }

  txtLCD = txtLCD.substring(0, txtLCD.length()-1);
  //Always display txtLCD
  lcd.setCursor(0, 0);
  lcd.print(txtLCD);


  //Serial.println(txtLCD);

  // T_button event checker - if pressed, send message to RPi
  int T_newState = digitalRead(T_button);
  if (T_buttonState != T_newState) {
    T_buttonState = T_newState;
    if(T_buttonState == HIGH){
      Serial.println("Pressed_T"); //note println put a /r/n at the end of a line
    }
    else{
      Serial.println("Released_T");
    }
  }

// S_button event checker - if pressed, send message to RPi
 int S_newState = digitalRead(S_button);
 if (S_buttonState != S_newState) {
   S_buttonState = S_newState;
   if(S_buttonState == HIGH){
     Serial.println("Pressed_S"); //note println put a /r/n at the end of a line
   }
   else{
     Serial.println("Released_S");
   }
 }


 // button_0 event checker - if pressed, send message to RPi
 int newState_0 = digitalRead(button_0);
 if (buttonState_0 != newState_0) {
   buttonState_0 = newState_0;
   if(buttonState_0 == HIGH){
     Serial.println("Pressed_0"); //note println put a /r/n at the end of a line
   }
   else{
     Serial.println("Released_0");
   }
 }

 // button_1 event checker - if pressed, send message to RPi
 int newState_1 = digitalRead(button_1);
 if (buttonState_1 != newState_1) {
   buttonState_1 = newState_1;
   if(buttonState_1 == HIGH){
     Serial.println("Pressed_1"); //note println put a /r/n at the end of a line
   }
   else{
     Serial.println("Released_1");
   }
 }



}

  
