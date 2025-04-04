package com.bss.controller;

import com.bss.entity.BatteryTransaction;
import com.bss.helper.ApiResponse;
import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class BatteryTransactionController {

    private final BatteryTransactionService batteryTransactionService;

    @PostMapping("/add-new-battery-transaction/{rfid}")
    public ResponseEntity<?> addBatteryTransaction(@PathVariable("rfid") String rfid) {
        BatteryTransaction responseData = batteryTransactionService.addBatteryTransaction(rfid);

        ApiResponse<BatteryTransaction> apiResponse = ApiResponse.<BatteryTransaction>builder()
                .data(responseData)
                .message("Battery Transaction Added Successfully")
                .statusCode(HttpStatus.CREATED.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

}
