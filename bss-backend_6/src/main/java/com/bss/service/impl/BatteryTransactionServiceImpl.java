package com.bss.service.impl;

import com.bss.entity.*;
import com.bss.exception.EntityNotFoundException;
import com.bss.repository.BatteryStatusRepository;
import com.bss.repository.BatteryTransactionRepository;
import com.bss.repository.CustomerRepository;
import com.bss.repository.EmptyBoxRepository;
import com.bss.service.BatteryTransactionService;
import com.bss.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BatteryTransactionServiceImpl implements BatteryTransactionService {

    private final BatteryTransactionRepository batteryTransactionRepository;
    private final UserService userService;
    private final EmptyBoxRepository emptyBoxRepository;
    private final BatteryStatusRepository batteryStatusRepository;
    private final FireStoreService fireStoreService;
    private final CustomerRepository customerRepository;

    @Override
    public BatteryTransaction createTransaction(String rfId) {
        Customer existingCustomer = customerRepository.findByTagId(rfId).orElseThrow(()-> new EntityNotFoundException("Customer With this RFID not found: "+rfId));
        BatteryTransaction newBatteryTransaction = BatteryTransaction.builder()
                .customerId(existingCustomer.getTagId())
                .batterySwappingDateTime(LocalDateTime.now())
                .batterySwappingCost("28")
                .adminId("1")
                .build();
        return batteryTransactionRepository.save(newBatteryTransaction);
    }


    //implementation of empty box methods
    @Override
    public EmptyBox updateCurrentEmptyBox(int boxNumber) {

        EmptyBox existingData = emptyBoxRepository.findById("id1").orElse(null);
        if (existingData == null){
            EmptyBox newEmptyBox = EmptyBox.builder()
                    .id("id1")
                    .boxNumber(boxNumber)
                    .build();
            return emptyBoxRepository.save(newEmptyBox);
        }
        existingData.setBoxNumber(boxNumber);
        return emptyBoxRepository.save(existingData);
    }

    @Override
    public EmptyBox getCurrentEmptyBox() {
        return emptyBoxRepository.findById("id1").orElse(null);
    }

    @Override
    public BatteryStatus addBatteryStatus(BatteryStatus batteryStatus) {
        BatteryStatus newBatteryStatus = BatteryStatus.builder()
                .id(batteryStatus.getId())
                .status(batteryStatus.getStatus())
                .timestamp(LocalDateTime.now())
                .build();
        return  batteryStatusRepository.save(newBatteryStatus);
    }

    @Override
    public List<BatteryStatus> getAllBatteryStatus() {
        return batteryStatusRepository.findAll();
    }

    //method updated
    @Override
    public BatteryStatus updateBatteryStatus(BatteryStatus batteryStatus) {
        log.info("Status Data {}: {}",batteryStatus.getId(),batteryStatus.getStatus());
        BatteryStatus existing = batteryStatusRepository.findById(batteryStatus.getId()).orElse(null);
        existing.setStatus(batteryStatus.getStatus());
        existing.setTimestamp(LocalDateTime.now());
        BatteryStatus status = batteryStatusRepository.save(existing);
        //new line added
        fireStoreService.updateBatteryStatusOfFirebase();
        return  status;
    }
}
