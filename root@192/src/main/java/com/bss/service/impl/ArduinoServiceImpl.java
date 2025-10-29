package com.bss.service.impl;

import com.bss.service.ArduinoService;
import com.bss.service.portListener.UnifiedPortService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArduinoServiceImpl implements ArduinoService {

    private final UnifiedPortService unifiedPortService;
    @Override
    public String sendCommandToArduino(String command) {
        command = command.replaceFirst("OPENB0", "OPEN").replaceFirst("OPENB", "OPEN");
        unifiedPortService.sendToArduino(command);
        return "MSG Sent";
    }



}
