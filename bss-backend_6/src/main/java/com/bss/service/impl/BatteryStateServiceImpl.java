package com.bss.service.impl;

import com.bss.entity.BatteryState;
import com.bss.entity.SwappingStation;
import com.bss.entity.enums.BatteriesStatus;
import com.bss.exception.EntityNotFoundException;
import com.bss.repository.BatteryStateRepository;
import com.bss.repository.SwappingStationRepository;
import com.bss.service.BatteryStateService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class BatteryStateServiceImpl implements BatteryStateService {

    private static final Logger log = LoggerFactory.getLogger(BatteryStateServiceImpl.class);
    private final BatteryStateRepository batteryStateRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SwappingStationRepository swappingStationRepository;
    private static final String BATTERY_REDIS_KEY="battery-status";



    @Override
    public List<BatteryState> getAllBatteriesStatus() {
        List<BatteryState> batteryStateList = batteryStateRepository.findAll();
        if (batteryStateList.isEmpty()){
            throw new EntityNotFoundException("There is no battery status available in the database.");
        }
        return batteryStateList;
    }

    @Override
    public BatteryState updateBatteryStatusById(Long batteryStatusId, BatteryState updatedBatteryState) {
        BatteryState existingBatteryState = batteryStateRepository.findById(batteryStatusId).orElseThrow(()-> new EntityNotFoundException("Battery box not available with this id: "+ batteryStatusId));
        existingBatteryState.setBatteryStatus(updatedBatteryState.getBatteryStatus());
        existingBatteryState.setBoxNumber(updatedBatteryState.getBoxNumber());
        log.info("Battery status updated now: {} from the frontend", LocalDateTime.now());
        return batteryStateRepository.save(existingBatteryState);
    }

    @Override
    public List<BatteryState> updateAllBatteryState(List<BatteryState> batteryStateList) {
        if (batteryStateList == null || batteryStateList.isEmpty()) {
            throw new IllegalArgumentException("BatteryState list cannot be empty.");
        }

        return batteryStateList.stream().map(updatedBatteryState -> {
            if (updatedBatteryState.getBoxNumber() == null || updatedBatteryState.getBoxNumber().isBlank()) {
                throw new IllegalArgumentException("Box number cannot be null or empty.");
            }

            // Find BatteryState by boxNumber (since it is unique)
            Optional<BatteryState> existingBatteryStateOpt = batteryStateRepository.findByBoxNumber(updatedBatteryState.getBoxNumber());

            BatteryState batteryState;
            if (existingBatteryStateOpt.isPresent()) {
                // Update the existing record
                batteryState = existingBatteryStateOpt.get();

                if (updatedBatteryState.getBatteryStatus() != null) {
                    batteryState.setBatteryStatus(updatedBatteryState.getBatteryStatus());
                }
            } else {
                // Create a new BatteryState object
                batteryState = BatteryState.builder()
                        .boxNumber(updatedBatteryState.getBoxNumber())
                        .batteryStatus(updatedBatteryState.getBatteryStatus())
                        .build();
            }

            redisTemplate.opsForValue().set("battery:", batteryState);

            log.info("Battery status updated now: {} from the battery sensor in redis", LocalDateTime.now());
            return batteryStateRepository.save(batteryState);
        }).collect(toList());
    }


    private BatteriesStatus convertStatusCode(String statusCode){
        return switch (statusCode){
            case "0" -> BatteriesStatus.EMPTY;
            case "1" -> BatteriesStatus.CHARGING;
            case "2" -> BatteriesStatus.FULL_CHARGED;
            default -> throw new IllegalArgumentException("Invalid status code: "+ statusCode);
        };
    }
    //Update Battery Status in the Redis database
    @Override
    public void updateBatteryState(String boxNumber, String data) {
        log.info("Updating Redis cache: Box {} -> Status {}", boxNumber, data);

        BatteriesStatus batteryStatus = convertStatusCode(data);

        // Directly replace the old data with the new data
        try {
            redisTemplate.opsForHash().put(BATTERY_REDIS_KEY, boxNumber, batteryStatus.name());
            log.info("✅ Redis updated successfully: Box {} -> {}", boxNumber, batteryStatus);
        } catch (Exception e) {
            log.error("❌ Redis update failed for Box {}: {}", boxNumber, e.getMessage(), e);
        }
    }


    @Override
    public List<BatteryState> getAllBatteryStatusFromCache() {
        Map<Object, Object> allBatteryStatus = redisTemplate.opsForHash().entries(BATTERY_REDIS_KEY);

        if (allBatteryStatus.isEmpty()) {
            log.warn("No battery status data found in Redis. Returning last known database values.");
            return batteryStateRepository.findAll(); // Fallback if Redis is empty
        }
        System.out.println("======================================================================================"+ allBatteryStatus.entrySet().stream()
                .map(entry -> BatteryState.builder()
                        .boxNumber(entry.getKey().toString())
                        .batteryStatus(BatteriesStatus.valueOf(entry.getValue().toString()))
                        .build()
                )
                .toList()+"====================================================");

        return allBatteryStatus.entrySet().stream()
                .map(entry -> BatteryState.builder()
                        .boxNumber(entry.getKey().toString())
                        .batteryStatus(BatteriesStatus.valueOf(entry.getValue().toString()))
                        .build()
                )
                .toList(); // No need for an explicit cast

    }
    @Scheduled(fixedRate = 120000) // Runs every 2 minutes
    @Transactional
    public void updateAvailableSlots() {
        List<SwappingStation> stations = swappingStationRepository.findAll();
        for (SwappingStation station : stations) {
            Map<Object, Object> allBatteryStatus = redisTemplate.opsForHash().entries(BATTERY_REDIS_KEY);


            List<BatteryState> batteryStates = allBatteryStatus.entrySet().stream()
                    .map(entry -> BatteryState.builder()
                            .boxNumber(entry.getKey().toString())
                            .batteryStatus(BatteriesStatus.valueOf(entry.getValue().toString()))
                            .build()
                    )
                    .toList();
            long fullChargedCount = batteryStates.stream()
                    .filter(battery -> "FULL_CHARGED".equalsIgnoreCase(String.valueOf(battery.getBatteryStatus())))
                    .count();
            // Logic to update only the available slots
//            station.setAvailableSlotsForElectricRickshaw((int) fullChargedCount);
            station.setAvailableSlotsForElectricScooter((int) fullChargedCount);

            swappingStationRepository.save(station);

        }
    }



}
