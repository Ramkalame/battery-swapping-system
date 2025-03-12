package com.bss.entity;


import com.bss.entity.enums.BatteriesStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BatteryState {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long batteryStateId;
    private String boxNumber;

    @Enumerated(EnumType.STRING)
    private BatteriesStatus batteryStatus;
}
