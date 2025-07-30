# SmartBed LED Controller

## Overview
SmartBed is a DIY smart lighting system for your bed using neon electric-blue LEDs controlled via an ESP32-S3 DevKitC-1 microcontroller. The system allows you to toggle LED modes such as normal, dim, flashing, and more, either through a native iOS app or a local web interface.

---

## Features
- Control neon LED strip modes (normal, dim, flashing, on/off repeat).
- iOS app built with SwiftUI to control lighting wirelessly over Wi-Fi.
- ESP32-S3 runs a web server for direct control via browser.
- Supports physical toggle switch override for manual on/off.
- Expandable to support additional sensors and relays.
  
---

## Hardware Requirements
- Neon electric-blue LED strip (USB powered with inline pushbutton).
- ESP32-S3 DevKitC-1 development board.
- NPN transistor (e.g., 2N2222) or logic-level MOSFET.
- 4.7 kΩ resistor.
- Breadboard, jumper wires, soldering tools.
- Sub-miniature DPDT toggle switch (optional for manual override).
  
---

## Software Requirements
- Arduino IDE or PlatformIO for ESP32 firmware.
- Xcode (free) for iOS app development.
- Optional: GitHub account for hosting web control interface via GitHub Pages.
  
---

## Getting Started

### Hardware Setup
1. Open the LED inline controller and solder wires to the pushbutton pads.
2. Wire the pushbutton pads to the transistor circuit connected to the ESP32 GPIO.
3. Connect USB power to the LED and ESP32, sharing common ground.
4. Optionally, add the DPDT toggle switch to manually control LED power.

### ESP32 Firmware
- Connect ESP32 to Wi-Fi.
- Run embedded web server serving endpoints to toggle LED modes.
- Control the pushbutton via GPIO to cycle LED modes programmatically.

### iOS App
- Built with SwiftUI.
- Provides UI controls to toggle power, brightness, flash mode, and custom themes.
- Sends HTTP requests to ESP32’s local IP to control LEDs.

### Web Interface (Optional)
- Host a static website via GitHub Pages or similar to control LEDs from any browser.

---

## Usage
- Power on the system via toggle switch or app.
- Use the app or web interface to select LED modes.
- Press the physical toggle switch to override and force LED on/off.

---

## Future Enhancements
- Add support for environmental sensors (temperature, humidity).
- Integrate relay control for additional bed electronics.
- Implement cloud connectivity for remote control outside local network.
- Secure endpoints with authentication.

---

## License
This project is provided as-is for personal, educational use. No warranty or liability is implied.
