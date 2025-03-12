package com.bss.helper;

import com.google.cloud.Timestamp;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class ConvertToFirestoreTimestamp {

    public static Timestamp convertToFirestoreTimestampData(LocalDateTime localDateTime) {
        return Timestamp.ofTimeSecondsAndNanos(
                localDateTime.atZone(ZoneId.systemDefault()).toEpochSecond(),
                localDateTime.getNano()
        );
    }

}
