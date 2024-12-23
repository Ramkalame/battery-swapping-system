package com.bss.dto;

import com.google.cloud.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BatteryTransactionDto {

    private String userName;
    private String vehicleNumber;
    private LocalDateTime timeStamp;
    private int noOfTransaction;

}
