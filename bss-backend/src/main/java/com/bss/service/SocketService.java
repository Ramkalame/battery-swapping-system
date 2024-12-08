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


    public  void  sendMessage(String msg){
        log.info("----- msg sent -----{}",msg);
        simpMessagingTemplate.convertAndSend("/topic/updates",msg);
    }


}
