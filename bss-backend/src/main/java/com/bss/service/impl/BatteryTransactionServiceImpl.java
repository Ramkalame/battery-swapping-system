package com.bss.service.impl;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;
import com.bss.repository.BatteryTransactionRepository;
import com.bss.repository.EmptyBoxRepository;
import com.bss.service.BatteryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BatteryTransactionServiceImpl implements BatteryTransactionService {

    private final BatteryTransactionRepository batteryTransactionRepository;
    private final EmptyBoxRepository emptyBoxRepository;

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
}
