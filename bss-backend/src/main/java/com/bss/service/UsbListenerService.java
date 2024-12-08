package com.bss.service;

import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsbListenerService {

    private final SocketService socketService;

    @PostConstruct
    public void init() {
        // Get the serial port (adjust based on your device name)
        SerialPort serialPort = SerialPort.getCommPort("COM3"); // Replace "COM3" with your port
        serialPort.setComPortParameters(9600, 8, 1, 0); // Baud rate, data bits, stop bits, parity
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 0, 0);

        if (serialPort.openPort()) {
            log.info("Serial port opened successfully!");

            // Start a thread to read data
            new Thread(() -> {
                try {
                    while (serialPort.isOpen()) {
                        byte[] buffer = new byte[1024];
                        int numRead = serialPort.readBytes(buffer, buffer.length);
                        if (numRead > 0) {
                            String data = new String(buffer, 0, numRead);
                            log.info("Received data: {}", data);

                            // Trigger WebSocket notification
                            socketService.sendMessage(data);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error reading from serial port", e);
                } finally {
                    serialPort.closePort();
                    log.info("Serial port closed.");
                }
            }).start();
        } else {
            log.error("Failed to open the serial port.");
        }
    }

}
