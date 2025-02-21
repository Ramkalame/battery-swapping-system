package com.bss.dto;


import com.google.cloud.Timestamp;
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
    private String id;
    private String batterySwappingCost;
    private LocalDateTime batterySwappingDateTime;
    private String batteryUniqueId;
    private String  customerId;
    private String adminId;
}
