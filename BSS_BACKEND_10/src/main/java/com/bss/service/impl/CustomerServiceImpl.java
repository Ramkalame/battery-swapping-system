package com.bss.service.impl;

import com.bss.entity.Customer;
import com.bss.exception.EntityNotFoundException;
import com.bss.repository.CustomerRepository;
import com.bss.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);
    private final CustomerRepository customerRepository;
    @Override
    public Customer getCustomerByRFID(String rfid) {
        log.info("Finding Customer By RFID: {}", rfid);
        Customer existingCustomer =  customerRepository
                .findByTagId(rfid)
                .orElseThrow(()-> new EntityNotFoundException("Customer with this RFID not found: "+ rfid));
        log.info("Found Customer: {}", existingCustomer);
        return existingCustomer;
    }
}
