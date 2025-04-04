package com.bss.service.impl;


import com.bss.entity.BatteryTransaction;
import com.bss.entity.Customer;
import com.bss.repository.BatteryTransactionRepository;
import com.bss.service.BatteryTransactionService;
import com.bss.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class BatteryTransactionImpl implements BatteryTransactionService {

    private final BatteryTransactionRepository batteryTransactionRepository;
    private final CustomerService customerService;

    public BatteryTransaction addBatteryTransaction(String rfid) {
        Customer existingCustomer = customerService.getCustomerByRFID(rfid);
        BatteryTransaction newBatteryTransaction = BatteryTransaction.builder()
                .batterySwappingCost("28")
                .batterySwappingDateTime(LocalDateTime.now()) // ✅ Preserve exact local time
                .batteryUniqueId("BUID")
                .customer(existingCustomer)
                .adminId("A1")
                .build();

        return batteryTransactionRepository.save(newBatteryTransaction);
    }

}
