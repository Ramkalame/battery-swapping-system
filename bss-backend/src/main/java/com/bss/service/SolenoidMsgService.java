//package com.bss.service;
//import com.fazecast.jSerialComm.SerialPort;
//import org.springframework.stereotype.Service;
//
//@Service
//public class SolenoidMsgService {
//
//
//    private final SerialPort serialPort;
//
//    public  SolenoidMsgService() {
//        // Initialize the serial port
//        serialPort = SerialPort.getCommPort("COM6"); // Replace with your USB port
//        serialPort.setComPortParameters(9600, 8, 1, 0); // Configure baud rate, data bits, etc.
//        serialPort.setComPortTimeouts(SerialPort.TIMEOUT_WRITE_BLOCKING, 0, 0);
//        if (serialPort.openPort()) {
//            System.out.println("COM6 Serial port opened successfully!");
//        } else {
//            System.err.println("COM6 Failed to open serial port.");
//        }
//    }
//
//    public void sendMessage(boolean message) {
//        if (serialPort.isOpen()) {
//            // Convert boolean to '1' (true) or '0' (false) and send as a single byte
//            byte[] messageBytes = {(byte) (message ? '1' : '0')};
//            serialPort.writeBytes(messageBytes, messageBytes.length);
//            System.out.println("Message sent to solenoid: " + (message ? "1" : "0"));
//        } else {
//            System.err.println("Serial port is not open.");
//        }
//    }
//
//
//
//    private void close() {
//        if (serialPort != null && serialPort.isOpen()) {
//            serialPort.closePort();
//        }
//    }
//
//}
