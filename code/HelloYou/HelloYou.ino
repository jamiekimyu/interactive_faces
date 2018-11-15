// include the library code:
#include <LiquidCrystal.h>

int led = 13; // led that we will toggle
int T_button = 6;
int S_button = 1;
int button_0 = 9;
int button_1 = 10;

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);


int T_buttonState;
int S_buttonState;
int buttonState_0;
int buttonState_1;

void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  pinMode(T_button, INPUT);
  pinMode(S_button, INPUT);
  pinMode(buttonState_0, INPUT);
  pinMode(buttonState_1, INPUT);

  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  // lcd.print("hello, world!");

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
    //inChar = (char)Serial.read();
    txtMsg = Serial.readString();
  }

  // if we get a 'H', turn the LED on; if we get a 'L', turn the LEC off. 
  if(txtMsg == 'H'){
    digitalWrite(led, HIGH);
    //Serial.println(txtMsg);
  }
  else if (txtMsg == 'L'){
    digitalWrite(led, LOW);
  }

  //if a new instruction comes in, assign that value to txtLCD
  else if (txtMsg.length() > 2) {
    txtLCD = txtMsg;
    //Serial.println(inChar);
    //Serial.println(txtMsg);
    //String txtMsg = "";
    
    }

  //Always display txtLCD
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

  
}

  
