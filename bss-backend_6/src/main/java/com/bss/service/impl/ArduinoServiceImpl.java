package com.bss.service.impl;

import com.bss.service.ArduinoService;
import com.bss.service.portListener.SecondPortService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArduinoServiceImpl implements ArduinoService {

    private final SecondPortService secondPortService;
    @Override
    public String sendCommandToArduino(String command) {
        secondPortService.sendToArduino(command);
        return "MSG Sent";
    }



}
