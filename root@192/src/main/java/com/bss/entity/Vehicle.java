package com.bss.entity;

import com.bss.entity.enums.VehicleType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;
    private VehicleType vehicleType;
    private String vehicleNumber;
    private String model;
    private String brand;
}
