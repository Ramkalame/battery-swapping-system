package com.bss.controller;

import com.bss.service.SocketService;
//import com.bss.service.SolenoidMsgService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SocketController {

    private final SocketService socketService;
//    private final SolenoidMsgService solenoidMsgService;

    @PostMapping("/{msg}")
    public void sendMsg(@PathVariable("msg") String msg){
        socketService.sendRfidMessage(msg);
    }
//    @MessageMapping("/solenoid")
//    @SendTo("/topic/solenoid-response")
//    public String handleSolenoidMessage(String msg) {
//        // Log the received raw message
//        System.out.println("Received raw message: [" + msg + "]");
//
//        // Clean up the message (remove quotes, brackets, etc.)
//        String cleanedMsg = msg.trim().replaceAll("[\"\\[\\]]", "");
//        System.out.println("Cleaned message: [" + cleanedMsg + "]");
//
//        // Convert to boolean
//        boolean activateSolenoid = "1".equals(cleanedMsg);
//        System.out.println("Converted to boolean: " + activateSolenoid);
//
//        // Send command to solenoid
//        solenoidMsgService.sendMessage(activateSolenoid);
//        System.out.println("Message sent to solenoid: " + (activateSolenoid ? "1" : "0"));
//
//        // Return response
//        return activateSolenoid ? "Door Open" : "Door Closed";
//    }






}
