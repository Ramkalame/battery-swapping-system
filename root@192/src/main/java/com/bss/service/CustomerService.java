package com.bss.service;

import com.bss.entity.Customer;

public interface CustomerService {

    Customer getCustomerByRFID(String rfid);
}
