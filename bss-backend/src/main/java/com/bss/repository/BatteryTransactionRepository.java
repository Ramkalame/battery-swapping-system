package com.bss.repository;

import com.bss.entity.BatteryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BatteryTransactionRepository extends JpaRepository<BatteryTransaction,Long> {

    Optional<BatteryTransaction> findByUserName(String userName);
    Optional<BatteryTransaction> findByTimeStamp(LocalDateTime timeStamp);
    Optional<BatteryTransaction> findByNoOfTransaction(Long noOfTransaction);
    List<BatteryTransaction> findByVehicleNumber(String vehicleNumber);
}
