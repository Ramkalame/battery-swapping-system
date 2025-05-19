package com.bss.repository;

import com.bss.entity.BatteryTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatteryTransactionRepository extends MongoRepository<BatteryTransaction, String> {
    List<BatteryTransaction> findByCustomerId(String customerId);
    List<BatteryTransaction> findByAdminId(String customerId);
    Optional<BatteryTransaction> findTopByBatteryUniqueIdOrderByBatterySwappingDateTimeDesc(String batteryUniqueId);
}
