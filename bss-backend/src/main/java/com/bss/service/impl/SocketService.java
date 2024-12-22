package com.bss.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {


    private final SimpMessagingTemplate simpMessagingTemplate;

    /**
     * Sends a message dynamically based on box number and sensor type.
     *
     * @param boxNumber  The box number (e.g., "01", "02").
     * @param sensorType The sensor type (e.g., "RFID", "TEMP", "IR").
     * @param message    The message to send.
     */
    public void sendSensorMessage(String boxNumber, String sensorType, String message) {
        try {
            // Format topic dynamically based on box and sensor
            String topic = String.format("/topic/box/%s/%s", boxNumber, sensorType.toLowerCase());
            log.info("Sending message to topic {}: {}", topic, message);

            // Send the message to the topic
            simpMessagingTemplate.convertAndSend(topic, message);
        } catch (Exception e) {
            log.error("Error sending message for Box {} and Sensor {}: {}", boxNumber, sensorType, e.getMessage(), e);
        }
    }

    /**
     * Sends a message dynamically based on box number and sensor type.
     *
     * @param message    The message to send.
     */
    public void sendRfSensorMessage(String message) {
        try {
            // Format topic dynamically based on box and sensor
            String topic ="/topic/rf";
            log.info("Sending message to rf topic {}: {}", topic, message);

            // Send the message to the topic
            simpMessagingTemplate.convertAndSend(topic, message);
        } catch (Exception e) {
            log.error("Error sending message for rf {}", e.getMessage());
        }
    }


    /**
     * Sends a message dynamically based on box number and sensor type.
     *
     * @param boxNumber  The box number (e.g., "01", "02").
     * @param sensorType The sensor type (e.g., "RFID", "TEMP", "IR").
     * @param message    The message to send.
     */
    public void sendSolenoidSensorMessage(String boxNumber, String sensorType, String message) {
        try {
            // Format topic dynamically based on box and sensor
            String topic = String.format("/topic/box/%s/%s", boxNumber, sensorType.toLowerCase());
            log.info("Sending message to topic solenoid: {}", message);

            // Send the message to the topic
            simpMessagingTemplate.convertAndSend(topic, message);
        } catch (Exception e) {
            log.error("Error sending message for Box {} and Sensor {}: {}", boxNumber, sensorType, e.getMessage(), e);
        }
    }


    /**
     * Sends an error message if the data cannot be processed correctly.
     *
     * @param errorMessage Error description to send.
     */
    public void sendErrorMessage(String errorMessage) {
        log.error("Sending error message: {}", errorMessage);
        simpMessagingTemplate.convertAndSend("/topic/error", errorMessage);
    }


}


