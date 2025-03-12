package com.bss.entity;

import com.bss.entity.enums.UserType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String userId;
    private String userName;
    private String mobileNumber;
    private String vehicleNumber;
    private String profileImageUrl;
    private UserType userType;
}
