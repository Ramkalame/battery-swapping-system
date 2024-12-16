package com.bss.controller;

import com.bss.helper.ApiResponse;
import com.bss.service.ArduinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/arduino")
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200","file://"})
@RequiredArgsConstructor
public class ArduinoController {

    private final ArduinoService arduinoService;

    @PostMapping("/{command}")
    public ResponseEntity<?> sendCommandToArduino(@PathVariable("command") String command){
      String response = arduinoService.sendCommandToArduino(command);

        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .data(response)
                .message("Action Performed")
                .success(true)
                .timestamp(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
