package com.bss.repository;

import com.bss.entity.BatteryState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BatteryStateRepository extends JpaRepository<BatteryState, Long> {
    Optional<BatteryState> findByBoxNumber(String boxNumber);
}
