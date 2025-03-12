package com.bss.entity;

import com.bss.dto.CloudImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "swapping-stations")
public class SwappingStation {




        @Id
        private String id;
        private String swappingStationName;
        private Address stationAddress;
        private Integer totalSlotsForElectricRickshaw;
        private Integer totalSlotsForElectricScooter;
        private Integer availableSlotsForElectricRickshaw;
        private Integer availableSlotsForElectricScooter;
        private CloudImage stationImage;
        private String openingTime;
        private String openingDay;
        private String latitude;
        private String longitude;
        private String swappingCostForElectricRickshaw;
        private String swappingCostForElectricScooter;
        private String operatorEmail;


}
