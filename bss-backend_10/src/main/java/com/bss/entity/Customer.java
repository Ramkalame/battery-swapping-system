package com.bss.entity;

import com.bss.entity.enums.Role;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "customers")
public class Customer {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String password;
    private String tagId;
    private boolean isRFIDAssigned;
    private String customerImage;
    private Double latitude;
    private Double longitude;
    private LocalDateTime registrationTime;
    private Role role;

    @DBRef
    private String currentlyPluggedBatteryId;
    @DBRef
    private Address address;
    @DBRef
    private Vehicle vehicle;
}
