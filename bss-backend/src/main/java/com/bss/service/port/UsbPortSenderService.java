package com.bss.service.port;

import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsbPortSenderService {


    @Value("${usb.port.name}")
    private String portName;

    private SerialPort serialPort;

    @PostConstruct
    public void init() {
        serialPort = SerialPort.getCommPort(portName);
        serialPort.setComPortParameters(9600, 8, 1, 0); // Baud rate, Data bits, Stop bits, Parity
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_NONBLOCKING, 0, 0);

        // Log available ports
        logAvailablePorts();

        if (serialPort.openPort()) {
            log.info("{} Serial port opened successfully!",portName);
        } else {
            log.error("{} Failed to open the serial port.",portName);
        }
    }

    @PreDestroy
    public void cleanup() {
        log.info("Spring Boot shutdown detected. Closing serial port.");
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

    public void sendDataToArduino(String command) {
        if (serialPort != null && serialPort.isOpen()) {
            try {
                byte[] data = command.getBytes(); // Convert the string command to bytes
                serialPort.writeBytes(data, data.length); // Write the data to the Arduino
                log.info("Sent to Arduino: {}", command.trim());
            } catch (Exception e) {
                log.error("Error sending data to Arduino", e);
            }
        } else {
            log.error("Serial port is not open. Unable to send data.");
        }
    }

}
