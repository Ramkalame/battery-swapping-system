package com.bss.service.impl;

import com.bss.entity.BatteryStatus;
import com.bss.entity.EmptyBox;
import com.bss.repository.BatteryStatusRepository;
import com.bss.repository.EmptyBoxRepository;
import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BatteryStatusHandler {

    private final BatteryStatusRepository batteryStatusRepository;
   private final EmptyBoxRepository emptyBoxRepository;
   private final FireStoreService fireStoreService;

    @Scheduled(fixedRate = 60000)
    public void checkAndUpdateBatteryStatus() {
        log.info("Scheduled task started: Checking and updating battery statuses");
        // Fetch the current empty box only once
        EmptyBox emptyBox = emptyBoxRepository.findById("id1").orElse(null);
        if (emptyBox == null) {
            log.warn("Empty box not found. Skipping battery status update.");
            return;
        }
        int emptyBoxNumber = emptyBox.getBoxNumber();
        log.info("Current Empty Box Number: {}", emptyBoxNumber);
        // Fetch all battery statuses and process them
        List<BatteryStatus> batteryStatusList = batteryStatusRepository.findAll();
        batteryStatusList.stream()
                .filter(battery -> shouldUpdateBatteryStatus(battery, emptyBoxNumber)) // Filter batteries needing an update
                .forEach(battery -> {
                    battery.updateStatusToOne();
                    batteryStatusRepository.save(battery);
                    //added new line
                    fireStoreService.updateBatteryStatusOfFirebase();
                    log.info("Battery status updated to 1 for ID: {}", battery.getId());
                });
        log.info("Scheduled task completed.");
    }

    /**
     * Determines if the battery status should be updated based on the empty box number and conditions.
     */
    private boolean shouldUpdateBatteryStatus(BatteryStatus battery, int emptyBoxNumber) {
        try {
            int batteryBoxNumber = Integer.parseInt(battery.getId().substring(1));
            if (batteryBoxNumber == emptyBoxNumber) {
                log.info("Skipping update for battery ID {}: Matches empty box number", battery.getId());
                return false;
            }
            return battery.isStatusZero() && battery.isTwoHoursOld();
        } catch (NumberFormatException e) {
            log.warn("Invalid battery ID format: {}. Skipping.", battery.getId());
            return false;
        }
    }

}
