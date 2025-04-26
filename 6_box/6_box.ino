#define NUM_COMPARTMENTS 6  // Total number of compartments

// Define the pins for locks, LEDs, and voltage sensors
const int LOCK_PINS[NUM_COMPARTMENTS] = {2, 3, 4, 5, 6,7};
const int LED_PINS[NUM_COMPARTMENTS] = {8, 9, 10, 11, 12, 13};
const int VOLTAGE_PINS[NUM_COMPARTMENTS] = {A0, A1, A2, A3, A5, A4};

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
    digitalWrite(LOCK_PINS[i], HIGH); // Keep locks closed initially
    digitalWrite(LED_PINS[i], LOW);   // Turn off LEDs initially
  }
}

void loop() {
  BatteryStatus(); // Continuously check battery status

  if (Serial.available() > 0) {
    String input_data = Serial.readStringUntil('\n'); // Read user command
    input_data.trim();
    
    if (input_data.startsWith("OPEN")) {  // Command format: "OPEN1", "OPEN2", ..., "OPEN10"
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
  delay(200); // Small delay for loop efficiency
}

// Function to open the compartment
void openCompartment(int compartment) {
  digitalWrite(LOCK_PINS[compartment], LOW); // Unlock compartment
  blinkLED(compartment);
}

// Function to close the compartment
void closeCompartment(int compartment) {
  digitalWrite(LOCK_PINS[compartment], HIGH); // Lock compartment
  digitalWrite(LED_PINS[compartment], LOW);   // Turn off LED
}

// Function to blink LED for 5 seconds
void blinkLED(int compartment) {
  unsigned long startTime = millis();
  while (millis() - startTime < 5000) {
    digitalWrite(LED_PINS[compartment], HIGH);
    delay(500);
    digitalWrite(LED_PINS[compartment], LOW);
    delay(500);
  }
}

// Function to calculate battery State of Charge (SoC)
int calculateSoC(float voltage) {
  if (voltage >= HIGH_CUTOFF) return 100;
  if (voltage >= 52.0) return 90;
  if (voltage >= 50.0) return 80;
  if (voltage >= 48.0) return 70;
  if (voltage >= 46.0) return 60;
  if (voltage >= 44.5) return 50;
  if (voltage >= 44.0) return 40;
  if (voltage >= 43.5) return 30;
  return 0;
}

// Function to monitor battery voltage and print status
void BatteryStatus() {
  for (int i = 0; i < NUM_COMPARTMENTS; i++) {
    int analogValue = analogRead(VOLTAGE_PINS[i]); // Read battery voltage
    float measuredVoltage = (analogValue * 5.0 / 1023.0) * ((R1 + R2) / R2);
    int soc = calculateSoC(measuredVoltage);

    Serial.print("B0");
    Serial.print(i + 1); // Print without leading zeros

    if (soc == 0) {
      Serial.println("0"); // Battery Empty
    } else if (soc < 80) {
      Serial.println("1"); // Battery Needs Charging
    } else { 
      Serial.println("2"); // Battery Fully Charged
    }

    delay(1000); // Reduced delay for faster performance
}
}