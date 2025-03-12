package com.bss.controller;

import com.bss.entity.User;
import com.bss.helper.ApiResponse;
import com.bss.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200"})
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable("userId") String userId){
        User response = userService.getFirebaseUserById(userId);

        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
                .data(response)
                .message("User Details Fetched Successfully")
                .success(true)
                .timestamp(LocalDateTime.now())
                .statusCode(HttpStatus.OK.value())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }


}
