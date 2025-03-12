package com.bss.service.impl;

import com.bss.dto.BatteryTransactionFirebase;
import com.bss.entity.BatteryStatus;
import com.bss.entity.BatteryTransaction;
import com.bss.entity.User;
import com.bss.entity.enums.UserType;
import com.bss.exception.EntityNotFoundException;
import com.bss.helper.ConvertToFirestoreTimestamp;
import com.bss.repository.BatteryStatusRepository;
import com.bss.repository.BatteryTransactionRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class FireStoreService {

    private final Firestore firestore;
    private final BatteryStatusRepository batteryStatusRepository;
    private final BatteryTransactionRepository batteryTransactionRepository;

    public void saveData(BatteryTransaction batteryTransaction) {

        BatteryTransaction transactionFirebase = BatteryTransaction.builder()
                .customerId(batteryTransaction.getCustomerId())
                .adminId(batteryTransaction.getAdminId())
                .batterySwappingCost(batteryTransaction.getBatterySwappingCost())
                .batterySwappingDateTime(batteryTransaction.getBatterySwappingDateTime())
                .batteryUniqueId(batteryTransaction.getBatteryUniqueId())
                .build();
        batteryTransactionRepository.save(transactionFirebase);

    }


    //added new method
    public void updateBatteryStatusOfFirebase() {
        try {
            // Fetch battery status data from the repository
            List<BatteryStatus> batteryStatuses = batteryStatusRepository.findAll(); // Adjust this to your actual method for fetching data
            // Create a map to store battery statuses
            Map<String, Object> batteryStatusMap = new HashMap<>();
            for (BatteryStatus status : batteryStatuses) {
                batteryStatusMap.put(status.getId(), status.getStatus());
            }
            // Reference to the Firestore database
            DocumentReference docRef = firestore.collection("battery-status-rickshaw").document("status");
            // Upload data to Firestore
            WriteResult result = docRef.set(batteryStatusMap).get();
            System.out.println("Battery status updated successfully at: " + result.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }


    public void fetchDataFromFirestore() {
        try {
            // Fetch all documents from a collection in firestore2
            QuerySnapshot querySnapshot = firestore.collection("battery-transactions").get().get();
            List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
            System.out.println(documents);// Wait for the query to complete
            for (QueryDocumentSnapshot document : documents) {
                log.info("Document ID: {}, Data: {}", document.getId(), document.getData());
                System.out.println(document);
            }
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to fetch data from Firestore: {}", e.getMessage(), e);
            Thread.currentThread().interrupt(); // Restore interrupted state
        } catch (Exception e) {
            log.error("An error occurred while fetching data: {}", e.getMessage(), e);
        }
    }

    public User fetchUserFromFirebaseUsingTagId(String tagId) {
        try {
            // Query the Firebase collection for the document with the given tagId
            QuerySnapshot querySnapshot = firestore.collection("customers")
                    .whereEqualTo("tagId", tagId)
                    //.whereIn("vehicleType", Arrays.asList("E-Scooter", "ई-स्कूटर"))
                    .get()
                    .get();
            // Check if a document is found
            if (!querySnapshot.getDocuments().isEmpty()) {
                QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0); // Assuming the tagId is unique
                // Map the document to a User object
                User user = mapDocumentToUser(document);
                if(user.getUserType().name().equals(UserType.SCOOTER.name())){
                    return  user;
                }
                throw new EntityNotFoundException("User is not registered");
            } else {
                log.warn("No user found with tagId: {}", tagId);
                throw new EntityNotFoundException("User is not registered");
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching data: {}", e.getMessage(), e);
            throw new EntityNotFoundException("User is not registered");
        }
    }


    // Helper method to map the Firebase document to a User object
    private User mapDocumentToUser(QueryDocumentSnapshot document) {
        User user = new User();
        user.setUserId(document.getString("tagId")); // Document ID in Firebase is the userId
        user.setUserName(document.getString("name"));
        user.setMobileNumber(document.getString("mobile"));
        user.setVehicleNumber(document.getString("vehicleNumber"));
        user.setProfileImageUrl(document.getString("profileImageUrl"));

        // Normalize the vehicle type field to handle both Hindi and English
        String vehicleType = document.getString("vehicleType");

        if (vehicleType != null) {
            // Normalize the vehicleType string
            vehicleType = normalizeVehicleType(vehicleType);

            // Map the normalized value to the UserType enum
            try {
                user.setUserType(UserType.valueOf(vehicleType));
            } catch (IllegalArgumentException e) {
                log.error("Invalid vehicle type: {}", vehicleType);
            }
        }
        return user;
    }


    // Helper method to normalize vehicleType to match the enum values
    private String normalizeVehicleType(String vehicleType) {
        switch (vehicleType.trim().toLowerCase()) {
            case "ई-स्कूटर":
            case "e-scooter":
                return "SCOOTER";
            case "ई-रिक्शा":
            case "e-rickshaw":
                return "RICKSHAW";
            default:
                return vehicleType; // Return the original value if no match found
        }
    }


    public void deleteUserByUserName(String userName) {
        try {
            // Query the Firestore collection for documents with the given userName
//            QuerySnapshot querySnapshot = firestore.collection("customers")
//                    .whereEqualTo("vehicleNumber", userName)
//                    .get()
//                    .get();

            QuerySnapshot querySnapshot = firestore.collection("battery-transactions")
                    .whereEqualTo("vehicleNumber", userName)
                    .get()
                    .get();

            // Check if any documents match the query
            if (!querySnapshot.isEmpty()) {
                for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
                    // Delete each matching document
                    ApiFuture<WriteResult> writeResult = firestore.collection("battery-transactions")
                            .document(document.getId())
                            .delete();

                    // Log the deletion time
                    log.info("Deleted user with userName: {} at {}", userName, writeResult.get().getUpdateTime());
                }
            } else {
                log.warn("No user found with userName: {}", userName);
                throw new EntityNotFoundException("User not found with the provided userName");
            }
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to delete user with userName: {}. Error: {}", userName, e.getMessage(), e);
            Thread.currentThread().interrupt(); // Restore interrupted state
        } catch (Exception e) {
            log.error("An error occurred while deleting user: {}", e.getMessage(), e);
        }
    }


    public void deleteUserByEmail(String email) {
        try {
            // Get the user by email to retrieve their UID
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);

            if (userRecord != null) {
                String uid = userRecord.getUid();

                // Delete the user by UID
                FirebaseAuth.getInstance().deleteUser(uid);
                log.info("Successfully deleted user with email: {}", email);
            } else {
                log.warn("No user found with email: {}", email);
                throw new EntityNotFoundException("User not found with the provided email");
            }
        } catch (FirebaseAuthException e) {
            log.error("Error while deleting user with email: {}. FirebaseAuthException: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("An error occurred while deleting user by email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }


    public void updateVehicleNumber(String currentVehicleNumber, String newVehicleNumber) {
        try {
            // Query Firestore to find the customer by the current vehicle number
            QuerySnapshot querySnapshot = firestore.collection("customers")
                    .whereEqualTo("vehicleNumber", currentVehicleNumber)
                    .get()
                    .get();

            if (!querySnapshot.isEmpty()) {
                // Assuming the customer document exists, and we're updating the vehicle number
                QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);

                // Update the vehicle number field
                Map<String, Object> updates = new HashMap<>();
                updates.put("vehicleNumber", newVehicleNumber);

                // Update the Firestore document with the new vehicle number
                DocumentReference documentRef = firestore.collection("customers").document(document.getId());
                WriteResult writeResult = documentRef.update(updates).get();

                log.info("Vehicle number updated successfully for customer with current vehicle number: {}", currentVehicleNumber);
                System.out.println("Vehicle number updated successfully at: " + writeResult.getUpdateTime());
            } else {
                log.warn("No customer found with vehicle number: {}", currentVehicleNumber);
                throw new EntityNotFoundException("Customer not found with the provided vehicle number");
            }
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to update vehicle number for vehicle number: {}. Error: {}", currentVehicleNumber, e.getMessage(), e);
            Thread.currentThread().interrupt(); // Restore interrupted state
        } catch (Exception e) {
            log.error("An error occurred while updating vehicle number: {}", e.getMessage(), e);
        }
    }





}
