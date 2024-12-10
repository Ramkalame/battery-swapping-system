package com.bss.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {

    private final SimpMessagingTemplate simpMessagingTemplate;


    public void sendRfidMessage(String msg){
        log.info("-----RF msg sent -----{}",msg);
        simpMessagingTemplate.convertAndSend("/topic/rf-id",msg);
    }

    public void sendIrMessage(boolean msg){
        log.info("-----IR msg sent -----{}",msg);
        simpMessagingTemplate.convertAndSend("/topic/ir-sensor",msg);
    }

    public void sendSolenoidMessage(String msg){
        log.info("-----Solenoid msg sent -----{}",msg);
        simpMessagingTemplate.convertAndSend("/topic/solenoid-response",msg);
    }




}
