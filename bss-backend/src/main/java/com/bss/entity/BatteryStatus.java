package com.bss.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BatteryStatus {

    @Id
    private String id;
    private int status;
    private LocalDateTime timestamp;


    //additional logic
    public  boolean isStatusZero(){
        return  this.status ==0;
    }

    public boolean isTwoHoursOld(){
        return  this.timestamp.isBefore(LocalDateTime.now().minusHours(4));
    }

    public boolean isOneMinutesOld(){
        return  this.timestamp.isBefore(LocalDateTime.now().minusMinutes(1));
    }

    public  void updateStatusToOne(){
        this.status =1;
        this.timestamp = LocalDateTime.now();
    }

}
