package com.bss.service;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryStatus;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;

import java.util.List;

public interface BatteryTransactionService {

    public BatteryTransaction createTransaction(String rfId);
    public BatteryTransaction getBySerialNumber(Long serialNumber);
    public BatteryTransaction getByUserName(String userName);
    public BatteryTransaction getByVehicleNumber(String vehicleNumber);
    public BatteryTransaction getByDate(String date);
    public BatteryTransaction updateBatteryTransaction(BatteryTransactionDto batteryTransactionDto,
                                                       String serialNumber);
    public String deleteTransaction(String serialNumber);


    //Methods for empty box
    public EmptyBox updateCurrentEmptyBox(int boxNumber);
    public EmptyBox getCurrentEmptyBox();


    //method for battery status
    public List<BatteryStatus> getAllBatteryStatus();
    public BatteryStatus updateBatteryStatus(BatteryStatus batteryStatus);
}
