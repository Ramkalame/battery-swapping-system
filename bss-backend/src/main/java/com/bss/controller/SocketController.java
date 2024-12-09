package com.bss.controller;

import com.bss.service.SocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SocketController {

    private final SocketService socketService;

    @PostMapping("/{msg}")
    public void sendMsg(@PathVariable("msg") String msg){
        socketService.sendRfidMessage(msg);
    }


}
