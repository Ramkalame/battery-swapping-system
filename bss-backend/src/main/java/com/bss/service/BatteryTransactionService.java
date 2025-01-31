package com.bss.service;

import com.bss.entity.BatteryStatus;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.EmptyBox;

import java.util.List;

public interface BatteryTransactionService {

    public BatteryTransaction createTransaction(String rfId);


    //Methods for empty box
    public EmptyBox updateCurrentEmptyBox(int boxNumber);
    public EmptyBox getCurrentEmptyBox();


    //method for battery status
    public BatteryStatus addBatteryStatus(BatteryStatus batteryStatus);
    public List<BatteryStatus> getAllBatteryStatus();
    public BatteryStatus updateBatteryStatus(BatteryStatus batteryStatus);

}
