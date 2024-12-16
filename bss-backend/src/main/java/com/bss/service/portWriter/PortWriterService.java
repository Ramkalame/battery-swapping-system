package com.bss.service.portWriter;

import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortWriterService {

    private final String portName = "COM1";
    private SerialPort serialPort;

    @PostConstruct
    public void init() {
        serialPort = SerialPort.getCommPort(portName);
        serialPort.setComPortParameters(9600, 8, 1, 0);
        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 0);
        logAvailablePorts();
        if (serialPort.openPort()){
            log.info("Port COM8 Opened Successfully");
        }else {
            log.error("{} Failed to open the serial port.",portName);
        }
    }


    public String sendToArduino(String command){
        String state = command.toUpperCase() + "\n";
        log.info("Solenoid Command Received-----:{}",state);
        try {
            serialPort.writeBytes(command.getBytes(),command.length());
            return "Command Sent To Arduino To Port:"+portName+"-->" + state.toUpperCase();
        }catch (Exception e){
            return "Failed to send command to the Arduino Port: "+portName;
        }
    }

    private void logAvailablePorts() {
        SerialPort[] availablePorts = SerialPort.getCommPorts();
        for (SerialPort port : availablePorts) {
            log.info("Available port-----: {}", port.getSystemPortName());
        }
    }

    @PreDestroy
    public void closeSerialPort() {
        if (serialPort != null && serialPort.isOpen()) {
            serialPort.closePort();
            log.info("Port: {} Seral port closed",portName);
        }
    }


}
