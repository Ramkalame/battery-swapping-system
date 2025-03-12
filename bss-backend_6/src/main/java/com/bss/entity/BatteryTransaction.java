package com.bss.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "battery-transactions")
public class BatteryTransaction {

    @Id
    private String id;
    private String batterySwappingCost;
    private LocalDateTime batterySwappingDateTime;
    private String batteryUniqueId;
    private String  customerId;
    private String adminId;

}
