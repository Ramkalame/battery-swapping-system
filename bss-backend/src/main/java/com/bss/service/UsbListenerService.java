package com.bss.service;

import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsbListenerService {

    private final SocketService socketService;
    private SerialPort serialPort;

    @PostConstruct
    public void init() {

        serialPort = SerialPort.getCommPort("COM4");
        serialPort.setComPortParameters(9600, 8, 1, 0);
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 0); // Reduced timeout to 1 second

        logAvailablePorts();
        if (serialPort.openPort()) {
            log.info("Serial port opened successfully!");

            new Thread(() -> {
                log.info("Reading thread started.");
                try {
                    while (serialPort.isOpen()) {
                        log.info("Waiting for data...");
                        byte[] buffer = new byte[2048];
                        int numRead = serialPort.readBytes(buffer, buffer.length);
                        log.info("Bytes read: {}", numRead);

                        if (numRead <= 0) {
                            log.warn("No data or empty data read, retrying...");
                            continue; // Retry if no data or empty data
                        }

                        socketService.sendMessage(formatToPlanString(asciiToString(logRawData(buffer,numRead))));

                    }
                } catch (Exception e) {
                    log.error("Error reading from serial port", e);
                } finally {
                    closeSerialPort();
                }
            }).start();
        } else {
            log.error("Failed to open the serial port.");
        }
    }

    @PreDestroy
    public void cleanup() {
        log.info("Spring Boot shutdown detected. Closing serial port.");
        closeSerialPort();
    }

    private void closeSerialPort() {
        if (serialPort != null && serialPort.isOpen()) {
            serialPort.closePort();
            log.info("Serial port closed.");
        }
    }

    private void logAvailablePorts() {
        SerialPort[] availablePorts = SerialPort.getCommPorts();
        for (SerialPort port : availablePorts) {
            log.info("Available port: {}", port.getSystemPortName());
        }
    }

    // Log raw data exactly as it appears (e.g., "0, 13 CF 38 DA")
    private String logRawData(byte[] buffer, int length) {
        StringBuilder rawData = new StringBuilder();
        for (int i = 0; i < length; i++) {
            rawData.append(String.format("%02X", buffer[i])); // Format each byte as two-digit hex
            if (i < length - 1) {
                rawData.append(", ");
            }
        }
        log.info("Received raw data: {}", rawData.toString());
        return rawData.toString();
    }


    private String asciiToString(String asciiCodes) {
        // Split the input string by commas to get individual ASCII codes
        String[] codes = asciiCodes.split(",\\s*");
        StringBuilder result = new StringBuilder();
        // Loop through the codes and convert each to its corresponding character
        for (String code : codes) {
            try {
                int asciiValue = Integer.parseInt(code, 16);  // Convert each code from hex to int
                result.append((char) asciiValue);              // Convert the ASCII value to character and append to result
            } catch (NumberFormatException e) {
                // Handle invalid format (if any)
                System.err.println("Invalid ASCII code: " + code);
            }
        }
        return result.toString();
    }

    private String formatToPlanString(String asciiCodes) {
        // Split the input string by commas to get individual ASCII codes
        String[] codes = asciiCodes.split("[,\\s]+");
        StringBuilder result = new StringBuilder();
        // Loop through the codes and append each code to the result
        for (String code : codes) {
            // Just append the code directly (no conversion needed)
            result.append(code.trim());
        }
        return result.toString();
    }

}
