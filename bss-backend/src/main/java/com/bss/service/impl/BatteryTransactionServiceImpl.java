package com.bss.service.impl;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryTransaction;
import com.bss.repository.BatteryTransactionRepository;
import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BatteryTransactionServiceImpl implements BatteryTransactionService {

    private final BatteryTransactionRepository batteryTransactionRepository;

    @Override
    public BatteryTransaction createTransaction(BatteryTransactionDto batteryTransactionDto) {
        BatteryTransaction newBatteryTransaction = BatteryTransaction.builder()
                .userName(batteryTransactionDto.getUserName())
                .vehicleNumber(batteryTransactionDto.getVehicleNumber())
                .timeStamp(LocalDateTime.now())
                .noOfTransaction(batteryTransactionDto.getNoOfTransaction())
                .build();
        return batteryTransactionRepository.save(newBatteryTransaction);
    }

    @Override
    public BatteryTransaction getBySerialNumber(Long serialNumber) {
        return null;
    }

    @Override
    public BatteryTransaction getByUserName(String userName) {
        return null;
    }

    @Override
    public BatteryTransaction getByVehicleNumber(String vehicleNumber) {
        return null;
    }

    @Override
    public BatteryTransaction getByDate(String date) {
        return null;
    }

    @Override
    public BatteryTransaction updateBatteryTransaction(BatteryTransactionDto batteryTransactionDto, String serialNumber) {
        return null;
    }

    @Override
    public String deleteTransaction(String serialNumber) {
        return "";
    }
}
