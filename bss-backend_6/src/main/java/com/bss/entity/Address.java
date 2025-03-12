package com.bss.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "address")
public class Address {

    @Id
    private String id;
    private String streetName;
    private String cityName;
    private String districtName;
    private String zipCODE;
    private String stateName;
    private String countryName;
}
