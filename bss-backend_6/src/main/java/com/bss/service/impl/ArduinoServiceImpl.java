package com.bss.service.impl;

import com.bss.service.ArduinoService;
import com.bss.service.portListener.SecondPortService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArduinoServiceImpl implements ArduinoService {

    private final SecondPortService secondPortService;
    @Override
    public String sendCommandToArduino(String command) {
        command = command.replaceFirst("OPENB0", "OPEN").replaceFirst("OPENB", "OPEN");
        secondPortService.sendToArduino(command);
        return "MSG Sent";
    }



}
