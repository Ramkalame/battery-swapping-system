package com.bss.service;

import com.bss.dto.BatteryTransactionDto;
import com.bss.entity.BatteryTransaction;

public interface BatteryTransactionService {

    public BatteryTransaction createTransaction(BatteryTransactionDto batteryTransactionDto);
    public BatteryTransaction getBySerialNumber(Long serialNumber);
    public BatteryTransaction getByUserName(String userName);
    public BatteryTransaction getByVehicleNumber(String vehicleNumber);
    public BatteryTransaction getByDate(String date);
    public BatteryTransaction updateBatteryTransaction(BatteryTransactionDto batteryTransactionDto,
                                                       String serialNumber);
    public String deleteTransaction(String serialNumber);

}
