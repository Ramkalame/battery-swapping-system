package com.bss.dto;


import com.google.cloud.Timestamp;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


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
    private String vehicleType;
    private Timestamp timeStamp;
    private int noOfTransaction;
    private double swappingCost;
}
