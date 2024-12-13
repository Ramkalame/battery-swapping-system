package com.bss.dto;

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
    private Long noOfTransaction;

}
