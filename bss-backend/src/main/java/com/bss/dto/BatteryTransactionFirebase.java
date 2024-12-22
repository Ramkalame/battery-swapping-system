package com.bss.dto;


import com.google.cloud.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BatteryTransactionFirebase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serialNumber;
    private String userName;
    private String vehicleNumber;
    private Timestamp timeStamp;
    private int noOfTransaction;

}
