package com.bss.entity;

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
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class BatteryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serialNumber;
    private String userName;
    private String vehicleNumber;
    private LocalDateTime timeStamp;
    private Long noOfTransaction;

}
