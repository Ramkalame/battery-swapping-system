package com.bss.service.impl;

import com.bss.dto.BatteryTransactionFirebase;
import com.bss.entity.BatteryTransaction;
import com.bss.helper.ConvertToFirestoreTimestamp;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class FireStoreService {

    private final Firestore firestore;

    public void saveData(BatteryTransaction batteryTransaction) {

        BatteryTransactionFirebase transactionFirebase = BatteryTransactionFirebase.builder()
                .serialNumber(batteryTransaction.getSerialNumber())
                .userName(batteryTransaction.getUserName())
                .vehicleNumber(batteryTransaction.getVehicleNumber())
                .timeStamp(ConvertToFirestoreTimestamp.convertToFirestoreTimestampData(batteryTransaction.getTimeStamp()))
                .noOfTransaction(batteryTransaction.getNoOfTransaction())
                .build();
        try {
            log.info("Attempting to save transaction: {}", batteryTransaction);
            ApiFuture<DocumentReference> transaction = firestore.collection("battery-transactions").add(transactionFirebase);
            DocumentReference documentReference = transaction.get(); // Wait for the future to complete
            log.info("Data sent successfully. Document ID: {}", documentReference.getId());
        } catch (ExecutionException | InterruptedException e) {
            log.error("Firestore operation interrupted or failed: {}", e.getMessage(), e);
            Thread.currentThread().interrupt(); // Restore interrupted state
        } catch (Exception e) {
            log.error("An error occurred while saving data: {}", e.getMessage(), e);
        }
    }
}
