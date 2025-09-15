#define NUM_COMPARTMENTS 10

const int LOCK_PINS[NUM_COMPARTMENTS] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11};
const int LED_PINS[NUM_COMPARTMENTS] = {22, 23, 24, 25, 26, 27, 28, 29, 30, 31};
const int VOLTAGE_PINS[NUM_COMPARTMENTS] = {A0, A1, A2, A3, A4, A5, A6, A7, A8, A9};

// Battery parameters
const float HIGH_CUTOFF = 54.75;
const float LOW_CUTOFF = 43.5;
const float NOMINAL_VOLTAGE = 48.0;

// Voltage divider resistor values
const float R1 = 100000.0;
const float R2 = 10000.0;

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < NUM_COMPARTMENTS; i++) {
    pinMode(LOCK_PINS[i], OUTPUT);
    pinMode(LED_PINS[i], OUTPUT);
    pinMode(VOLTAGE_PINS[i], INPUT);
    digitalWrite(LOCK_PINS[i], HIGH);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void loop() {
  BatteryStatus();
  
  if (Serial.available() > 0) {
    String input_data = Serial.readStringUntil('\n');
    input_data.trim();
    
    if (input_data.startsWith("OPEN")) {
      int compartment = input_data.substring(4).toInt() - 1;
      if (compartment >= 0 && compartment < NUM_COMPARTMENTS) {
        Serial.print("Opening compartment B");
        Serial.println(compartment + 1);
        openCompartment(compartment);
        delay(6000);
        closeCompartment(compartment);
      }
    }
  }
  delay(200);
}

void openCompartment(int compartment) {
  digitalWrite(LOCK_PINS[compartment], LOW);
  blinkLED(compartment);
}

void closeCompartment(int compartment) {
  digitalWrite(LOCK_PINS[compartment], HIGH);
  digitalWrite(LED_PINS[compartment], LOW);
}

void blinkLED(int compartment) {
  unsigned long startTime = millis();
  while (millis() - startTime < 5000) {
    digitalWrite(LED_PINS[compartment], HIGH);
    delay(500);
    digitalWrite(LED_PINS[compartment], LOW);
    delay(500);
  }
}

int calculateSoC(float voltage) {
  if (voltage >= HIGH_CUTOFF) return 100;
  else if (voltage >= 52.0) return 90;
  else if (voltage >= 50.0) return 80;
  else if (voltage >= 50.0) return 75;
  else if (voltage >= 48.0) return 70;
  else if (voltage >= 46.0) return 60;
  else if (voltage >= 44.5) return 50;
  else if (voltage >= 44.0) return 40;
  else if (voltage >= 43.5) return 30;
  else return 0;
}

void BatteryStatus() {
  for (int i = 0; i < NUM_COMPARTMENTS; i++) {
    int analogValue = analogRead(VOLTAGE_PINS[i]);
    float measuredVoltage = (analogValue * 5.0 / 1023.0) * ((R1 + R2) / R2);
    int soc = calculateSoC(measuredVoltage);

    // ✅ Fix: Properly format numbers (B01-B09 and B10 correctly)
    Serial.print("B");
    if (i + 1 < 10) Serial.print("0");  // Add leading zero only for numbers 1-9
    Serial.print(i + 1);

    // ✅ Send the correct battery status
    if (soc == 0) Serial.println("0"); 
    else if ( soc < 75 ) Serial.println("1");
    else Serial.println("2");
    delay(1000);
  }
}