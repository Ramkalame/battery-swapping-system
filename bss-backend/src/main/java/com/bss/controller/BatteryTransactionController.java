package com.bss.controller;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;
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
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200","file://"})
public class BatteryTransactionController {

    private final BatteryTransactionService batteryTransactionService;


    @PostMapping
    public ResponseEntity<ApiResponse<BatteryTransaction>> createTransaction(@RequestBody BatteryTransactionDto batteryTransactionDto){
        BatteryTransaction responseData = batteryTransactionService.createTransaction(batteryTransactionDto);

        ApiResponse<BatteryTransaction> apiResponse = ApiResponse.<BatteryTransaction>builder()
                .data(responseData)
                .message("Transaction added")
                .statusCode(HttpStatus.CREATED.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

      return  ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }


    //empty box rest api

    @PutMapping("/empty-box-number/{boxNumber}")
    public ResponseEntity<ApiResponse<EmptyBox>> updateCurrentEmptyBox(@PathVariable("boxNumber") int boxNumber){
        EmptyBox responseData = batteryTransactionService.updateCurrentEmptyBox(boxNumber);

        ApiResponse<EmptyBox> apiResponse = ApiResponse.<EmptyBox>builder()
                .data(responseData)
                .message("Empty Box Number Updated")
                .statusCode(HttpStatus.CREATED.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return  ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/empty-box-number")
    public ResponseEntity<ApiResponse<EmptyBox>> getCurrentEmptyBox() {
        EmptyBox responseData = batteryTransactionService.getCurrentEmptyBox();

        ApiResponse<EmptyBox> apiResponse = ApiResponse.<EmptyBox>builder()
                .data(responseData)
                .message("Empty Box Number Fetched")
                .statusCode(HttpStatus.CREATED.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}
