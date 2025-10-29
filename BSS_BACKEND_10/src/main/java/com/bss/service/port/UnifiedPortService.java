package com.bss.service.port;

import com.bss.service.BatteryStateService;
import com.bss.service.impl.SocketService;
import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class UnifiedPortService {

    @Value("${serial.port.name}")
    private String portName;

    @Value("${serial.port.baudrate}")
    private int baudRate;

    private final SocketService socketService;
    private final BatteryStateService batteryStateService;

    private SerialPort serialPort;

    private final StringBuilder lineBuffer = new StringBuilder();

    @PostConstruct
    public void init() {
        serialPort = SerialPort.getCommPort(portName);
        serialPort.setComPortParameters(baudRate, 8, 1, SerialPort.NO_PARITY);
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 0);

        logAvailablePorts();
        if (serialPort.openPort()) {
            log.info("✅ Serial port {} (baud {}) opened successfully!", portName, baudRate);
            new Thread(this::startListening).start();
        } else {
            log.error("❌ Failed to open serial port {}", portName);
        }
    }

    private void startListening() {
        log.info("📡 Listening on port: {}", portName);
        try {
            while (serialPort.isOpen()) {
                byte[] buffer = new byte[256];
                int numRead = serialPort.readBytes(buffer, buffer.length);
                if (numRead > 0) {
                    logRawData(buffer, numRead);
                    handleIncomingData(buffer, numRead);
                }
            }
        } catch (Exception e) {
            log.error("❌ Error reading from serial port {}: {}", portName, e.getMessage(), e);
        } finally {
            closeSerialPort();
        }
    }

    private void handleIncomingData(byte[] buffer, int numRead) {
        for (int i = 0; i < numRead; i++) {
            char c = (char) buffer[i];

            if (c == '\n') { // end of frame
                String frame = lineBuffer.toString().trim();
                lineBuffer.setLength(0); // reset buffer

                if (!frame.isEmpty()) {
                    log.info("📩 Frame: {}", frame);

                    if (frame.startsWith("RF") && frame.length() >= 10) {
                        String rfId = frame.substring(2, 10);
                        log.info("📶 RFID Detected: {}", rfId);
                        socketService.sendRfSensorMessage(rfId);
                    } else {
                        Matcher matcher = Pattern.compile("B\\d{2}[0-2]").matcher(frame);
                        while (matcher.find()) {
                            String batteryMessage = matcher.group(); // e.g. B040
                            String boxNumber = batteryMessage.substring(0, 3); // B04
                            String status = batteryMessage.substring(3);       // 0/1/2
                            log.info("🔋 Battery Update - Box: {} | Status: {}", boxNumber, status);
                            batteryStateService.updateBatteryState(boxNumber, status);
                        }
                    }
                }
            } else if (c != '\r') { // ignore CR
                lineBuffer.append(c);
            }
        }
    }

    public void sendToArduino(String command) {
        String formattedCommand = command.toUpperCase() + "\n";
        log.info("🛠 Sending command to Arduino: {}", formattedCommand);
        try {
            serialPort.writeBytes(formattedCommand.getBytes(), formattedCommand.length());
        } catch (Exception e) {
            log.error("❌ Failed to send command to Arduino on port {}: {}", portName, e.getMessage());
        }
    }

    private String logRawData(byte[] buffer, int length) {
        StringBuilder rawData = new StringBuilder();
        for (int i = 0; i < length; i++) {
            rawData.append(String.format("%02X", buffer[i]));
            if (i < length - 1) rawData.append(", ");
        }
        log.info("📥 Raw Data Received: {}", rawData);
        return rawData.toString();
    }

    private String asciiToHex(String asciiCodes) {
        String[] codes = asciiCodes.split(",\\s*");
        StringBuilder result = new StringBuilder();
        for (String code : codes) {
            try {
                int asciiValue = Integer.parseInt(code, 16);

                if (asciiValue == 13) {        // CR
                    result.append("\r");
                } else if (asciiValue == 10) { // LF
                    result.append("\n");
                } else if (asciiValue >= 32 && asciiValue <= 126) {
                    result.append((char) asciiValue);
                }

            } catch (NumberFormatException e) {
                log.error("❌ Invalid ASCII code: {}", code);
            }
        }
        return result.toString();
    }


    private String formatToPlainString(String asciiCodes) {
        return asciiCodes.replaceAll("[, ]+", "").trim();
    }

    private void logAvailablePorts() {
        SerialPort[] availablePorts = SerialPort.getCommPorts();
        for (SerialPort port : availablePorts) {
            log.info("🔌 Available port: {}", port.getSystemPortName());
        }
    }

    @PreDestroy
    private void closeSerialPort() {
        if (serialPort != null && serialPort.isOpen()) {
            serialPort.closePort();
            log.info("🔒 Serial port {} closed.", portName);
        }
    }
}
