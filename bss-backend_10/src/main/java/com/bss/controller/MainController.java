package com.bss.controller;

import com.bss.entity.BatteryState;
import com.bss.entity.Customer;
import com.bss.helper.ApiResponse;
import com.bss.service.BatteryStateService;
import com.bss.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/main")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200"})
public class MainController {

    private final CustomerService customerService;
    private final BatteryStateService batteryStateService;

    @GetMapping("/fetch-user-by/{rfid}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByRFID(@PathVariable String rfid) {
        Customer response = customerService.getCustomerByRFID(rfid);

        ApiResponse<Customer> apiResponse = ApiResponse.<Customer>builder()
                .data(response)
                .message("Customer Retrieved Successfully")
                .success(true)
                .timestamp(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/update-battery-status/{batteryStatusId}")
    public ResponseEntity<ApiResponse<BatteryState>> updateBatteryStatusById(@PathVariable Long batteryStatusId,
                                                                             @RequestBody BatteryState updatedBatteryState) {
        BatteryState response = batteryStateService.updateBatteryStatusById(batteryStatusId, updatedBatteryState);

        ApiResponse<BatteryState> apiResponse = ApiResponse.<BatteryState>builder()
                .data(response)
                .message("Battery Status Updated Successfully")
                .success(true)
                .timestamp(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/fetch-all-battery-status")
    public ResponseEntity<ApiResponse<List<BatteryState>>> getAllBatteriesStatus() {
        List<BatteryState> response = batteryStateService.getAllBatteryStatusFromCache();

        ApiResponse<List<BatteryState>> apiResponse = ApiResponse.<List<BatteryState>>builder()
                .data(response)
                .message("Battery Status List Fetched Successfully")
                .success(true)
                .timestamp(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
