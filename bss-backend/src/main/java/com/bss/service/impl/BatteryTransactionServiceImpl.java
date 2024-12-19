package com.bss.service.impl;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;
import com.bss.entity.User;
import com.bss.repository.BatteryTransactionRepository;
import com.bss.repository.EmptyBoxRepository;
import com.bss.service.BatteryTransactionService;
import com.bss.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BatteryTransactionServiceImpl implements BatteryTransactionService {

    private final BatteryTransactionRepository batteryTransactionRepository;
    private final UserService userService;
    private final EmptyBoxRepository emptyBoxRepository;

    @Override
    public BatteryTransaction createTransaction(String rfId) {
        // Get the existing user by RFID
        User existingUser = userService.getUserById(rfId);

        // Retrieve the list of battery transactions for the given vehicle number
        List<BatteryTransaction> transactionList = batteryTransactionRepository.findByVehicleNumber(existingUser.getVehicleNumber());

        // Get the current time
        LocalDate today = LocalDate.now();

        // Iterate through the transaction list to check if there is any transaction within the last 24 hours
        for (BatteryTransaction transaction : transactionList) {
            // If the transaction timestamp is within the last 24 hours, update it
            if (transaction.getTimeStamp().toLocalDate().isEqual(today)) {
                // Increment the transaction count
                transaction.setNoOfTransaction(transaction.getNoOfTransaction() + 1);
                // Update the timestamp
                transaction.setTimeStamp(LocalDateTime.now());
                // Save the updated transaction back to the database
                return batteryTransactionRepository.save(transaction);
            }
        }

        // If no transactions are found within the last 24 hours, create a new transaction
        BatteryTransaction newBatteryTransaction = BatteryTransaction.builder()
                .userName(existingUser.getUserName())
                .vehicleNumber(existingUser.getVehicleNumber())
                .timeStamp(LocalDateTime.now())
                .noOfTransaction(1L)
                .build();

        // Save the new transaction to the database
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
