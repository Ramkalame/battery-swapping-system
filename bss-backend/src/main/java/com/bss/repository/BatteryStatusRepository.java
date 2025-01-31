package com.bss.repository;

import com.bss.entity.BatteryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatteryStatusRepository extends JpaRepository<BatteryStatus,String> {

}
