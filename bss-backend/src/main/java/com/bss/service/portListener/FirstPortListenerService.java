package com.bss.service.portListener;

import com.bss.service.BatteryStateService;
import com.bss.service.impl.SocketService;
import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirstPortListenerService {
//Battery port listner
    private final String portName = "COM16";

    private final BatteryStateService batteryStateService;
    private SerialPort serialPort;

    @PostConstruct
    public void init() {
        serialPort = SerialPort.getCommPort(portName);
        serialPort.setComPortParameters(9600, 8, 1, 0);
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 0);

        logAvailablePorts();
        if (serialPort.openPort()) {
            log.info("{} Serial port opened successfully!", portName);

            new Thread(() -> {
                log.info("Reading thread started for port: {}",portName);
                try {
                    while (serialPort.isOpen()) {
//                        byte[] buffer = new byte[2048];
                        byte[] buffer = new byte[256];
//                        log.warn("This is Buffer data: {}", buffer);
                        int numRead = serialPort.readBytes(buffer, buffer.length);
//                        log.warn("This is num read: {}",numRead);
                        if (numRead > 0) {
//                            log.warn("Num read is greater than 0: {}",numRead);
                            handleIncomingData(buffer, numRead);
                        } else {
                            log.warn("No data read from serial port: {}",portName);
                        }
                    }
                } catch (Exception e) {
                    log.error("❌ Error reading from serial port: {} - {}", portName, e.getMessage(), e);
                } finally {
                    closeSerialPort();
                }
            }).start();
        } else {
            log.error("{} Failed to open the serial port.",portName);
        }
    }

    @PreDestroy
    private void closeSerialPort() {
        if (serialPort != null && serialPort.isOpen()) {
            serialPort.closePort();
            log.info("{} Serial port closed.",portName);
        }
    }

    private void logAvailablePorts() {
        SerialPort[] availablePorts = SerialPort.getCommPorts();
        for (SerialPort port : availablePorts) {
            log.info("Available port: {}", port.getSystemPortName());
        }
    }

    private void handleIncomingData(byte[] buffer, int numRead) {
        String rawData = logRawData(buffer, numRead);
        String message = formatToPlainString(asciiToHex(rawData)).trim(); // Ensure clean parsing

        log.info("Port: {} - Received message: {}", portName, message);

        // Validate expected format (e.g., "B01X" where X = 0,1,2)
        if (message.matches("^B\\d{2}[0-2]$")) {
            String boxNumber = message.substring(0, 3); // Extract "B01", "B02", etc.
            String status = message.substring(3, 4);   // Extract "0", "1", "2"

            log.info("✅ Parsed Data - Box: {} | Status: {}", boxNumber, status);

            // Update battery state in Redis
            batteryStateService.updateBatteryState(boxNumber, status);
        } else {
            log.warn("⚠️ Invalid message format on {}: {}", portName, message);
        }
    }


    private String logRawData(byte[] buffer, int length) {
        StringBuilder rawData = new StringBuilder();
        for (int i = 0; i < length; i++) {
            rawData.append(String.format("%02X", buffer[i]));
            if (i < length - 1) {
                rawData.append(", ");
            }
        }
        log.info("Port: {} Received raw data: {}",portName , rawData);
        return rawData.toString();
    }

    private String asciiToHex(String asciiCodes) {
        String[] codes = asciiCodes.split(",\s*");
        StringBuilder result = new StringBuilder();
        for (String code : codes) {
            try {
                int asciiValue = Integer.parseInt(code, 16); // Convert hex to int
                if (asciiValue < 32 || asciiValue > 126) {   // Ignore non-printable characters
                    continue;
                }
                result.append((char) asciiValue);
            } catch (NumberFormatException e) {
                log.error("❌ Invalid ASCII code in {}: {}", portName, code);
            }
        }
        return result.toString();
    }


    private String formatToPlainString(String asciiCodes) {
        String[] codes = asciiCodes.split("[,\s]+");
        StringBuilder result = new StringBuilder();
        for (String code : codes) {
            result.append(code.trim());
        }
        return result.toString();
    }

}
