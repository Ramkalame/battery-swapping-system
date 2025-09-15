package com.bss.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "battery-transactions")
public class BatteryTransaction {

    @Id
    private String id;
    private String batterySwappingCost;
    private LocalDateTime batterySwappingDateTime;
    private String batteryUniqueId;
    private Customer customer;
    private String adminId;
}
