package com.bss.service.impl;

import com.bss.service.ArduinoService;
import com.bss.service.portWriter.PortWriterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArduinoServiceImpl implements ArduinoService {

    private final PortWriterService portWriterService;

    @Override
    public String sendCommandToArduino(String command) {
        portWriterService.sendToArduino(command);
        return "MSG Sent";
    }



}
