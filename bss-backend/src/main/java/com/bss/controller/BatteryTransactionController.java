package com.bss.controller;

import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BatteryTransactionController {

    private final BatteryTransactionService batteryTransactionService;


}
