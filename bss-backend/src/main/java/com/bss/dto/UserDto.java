package com.bss.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String userId;
    private String userName;
    private String mobileNumber;
    private String vehicleNumber;
    private String profileImageUrl;

}
