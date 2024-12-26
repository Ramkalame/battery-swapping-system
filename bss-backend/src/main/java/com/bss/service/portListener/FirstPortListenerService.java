/*package com.bss.service.portListener;

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

    private final String portName = "COM3";

    private final SocketService socketService;workbe
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
                        byte[] buffer = new byte[2048];
                        int numRead = serialPort.readBytes(buffer, buffer.length);
                        if (numRead > 0) {
                            handleIncomingData(buffer, numRead);
                        } else {
                            log.warn("No data read from serial port: {}",portName);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error reading from serial port: {}", portName);
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
        String message = formatToPlainString(asciiToHex(rawData));

        if (message.startsWith("B")) {
            String boxNumber = message.substring(1, 3);
            String sensorType = message.substring(3, 5);
            String data = message.substring(5);

            log.info("Port: {} - Box {} - Sensor {}: Data -> {}",portName, boxNumber, sensorType, data);

            // Forward data to SocketService
            socketService.sendSensorMessage(boxNumber, sensorType, data);
        }else {
            socketService.sendErrorMessage(portName+": Invalid message format: " + message);
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
                int asciiValue = Integer.parseInt(code, 16);
                result.append((char) asciiValue);
            } catch (NumberFormatException e) {
                log.error("Port: {} Invalid ASCII code: {}",portName, code);
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
*/