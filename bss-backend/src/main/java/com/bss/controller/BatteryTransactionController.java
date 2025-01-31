package com.bss.controller;

import com.bss.entity.BatteryStatus;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;
import com.bss.helper.ApiResponse;
import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200","file://"})
public class BatteryTransactionController {

    private final BatteryTransactionService batteryTransactionService;

    @PostMapping("/{rfId}")
    public ResponseEntity<ApiResponse<BatteryTransaction>> createTransaction(@PathVariable("rfId") String rfId){
        BatteryTransaction responseData = batteryTransactionService.createTransaction(rfId);

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
                .statusCode(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/empty-box-number")
    public ResponseEntity<ApiResponse<EmptyBox>> getCurrentEmptyBox() {
        EmptyBox responseData = batteryTransactionService.getCurrentEmptyBox();

        ApiResponse<EmptyBox> apiResponse = ApiResponse.<EmptyBox>builder()
                .data(responseData)
                .message("Empty Box Number Fetched")
                .statusCode(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //Battery Status APIs
    @PostMapping("/battery-status")
    public ResponseEntity<?>  addBatteryStatus(@RequestBody BatteryStatus batteryStatus){
        BatteryStatus responseData = batteryTransactionService.addBatteryStatus(batteryStatus);

        ApiResponse<BatteryStatus> apiResponse = ApiResponse.<BatteryStatus>builder()
                .data(responseData)
                .message("Battery Status Created")
                .statusCode(HttpStatus.CREATED.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/battery-status")
    public ResponseEntity<ApiResponse<List<BatteryStatus>>> getAllBatteryStatus(){
        List<BatteryStatus> responseData = batteryTransactionService.getAllBatteryStatus();

        ApiResponse<List<BatteryStatus>> apiResponse = ApiResponse.<List<BatteryStatus>>builder()
                .data(responseData)
                .message("Battery Status Fetched")
                .statusCode(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/battery-status")
    public ResponseEntity<ApiResponse<BatteryStatus>> updateBatteryStatus(@RequestBody BatteryStatus batteryStatus){
        BatteryStatus responseData = batteryTransactionService.updateBatteryStatus(batteryStatus);

        ApiResponse<BatteryStatus> apiResponse = ApiResponse.<BatteryStatus>builder()
                .data(responseData)
                .message("Battery Status Updated")
                .statusCode(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }


}
