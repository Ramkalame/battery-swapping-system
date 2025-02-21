package com.bss.service;

import com.bss.entity.BatteryState;

import java.util.List;

public interface BatteryStateService {

    List<BatteryState> getAllBatteriesStatus();
    BatteryState updateBatteryStatusById(Long batteryStatusId, BatteryState updatedBatteryState);
    List<BatteryState> updateAllBatteryState(List<BatteryState> batteryStateList);
    void updateBatteryState(String boxNumber, String status);
    List<BatteryState> getAllBatteryStatusFromCache();
}
