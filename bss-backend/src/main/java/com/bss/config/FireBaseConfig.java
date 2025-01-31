package com.bss.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FireBaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        FileInputStream serviceAccount1 =
                new FileInputStream("src/main/resources/cred.json");

        FirebaseOptions options1 = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount1))
                .build();

        FirebaseApp firebaseApp1 = FirebaseApp.initializeApp(options1);
        return FirestoreClient.getFirestore(firebaseApp1);
    }

}
