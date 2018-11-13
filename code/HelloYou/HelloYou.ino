int led = 13; // led that we will toggle
char inChar;  // character we will use for messages from the RPi

int button = 2;
int buttonState;

int secondButton = 6;
int secondButtonState;

void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  pinMode(button, INPUT);
  pinMode(secondButton, INPUT);
}

void loop() {
  // read the character we recieve on the serial port from the RPi
  if(Serial.available()) {
    inChar = (char)Serial.read();
  }

  // if we get a 'H', turn the LED on, else turn it off
  if(inChar == 'H'){
    digitalWrite(led, HIGH);
  }
  else{
    digitalWrite(led, LOW);
  }

  // Button event checker - if pressed, send message to RPi
  int newState = digitalRead(button);
  if (buttonState != newState) {
    buttonState = newState;
    if(buttonState == HIGH){
      Serial.println("light"); //note println put a /r/n at the end of a line
    }
    else{
      Serial.println("dark");
    }
  }
  
  int secondNewState = digitalRead(secondButton);
  if (secondButtonState != secondNewState) {
    secondButtonState = secondNewState;
    if(secondButtonState == HIGH){
      Serial.println("secondLight"); //note println put a /r/n at the end of a line
    }
    else{
      Serial.println("secondDark");
    }
  }
  
}

  
