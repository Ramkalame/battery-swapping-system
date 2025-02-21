package com.bss.controller;

import com.bss.dto.UserDto;
import com.bss.entity.User;
import com.bss.helper.ApiResponse;
import com.bss.service.UserService;
import com.bss.service.impl.FireStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200","file://"})
public class UserController {

    private final UserService userService;
    private final FireStoreService fireStoreService;



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

//    @PostMapping
//    public ResponseEntity<?> addUser(@RequestBody UserDto userDto){
//        User response = userService.addUser(userDto);
//        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
//                .data(response)
//                .message("User Added Successfully")
//                .success(true)
//                .timestamp(LocalDateTime.now())
//                .statusCode(HttpStatus.CREATED.value())
//                .build();
//        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
//    }
//
//    @DeleteMapping("/{userId}")
//    public ResponseEntity<?> deleteUserById(@PathVariable("userId") String userId){
//        String response = userService.deleteUser(userId);
//        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
//                .data(response)
//                .message("User Deleted Successfully")
//                .success(true)
//                .timestamp(LocalDateTime.now())
//                .statusCode(HttpStatus.OK.value())
//                .build();
//        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
//    }
//
//
//    @PatchMapping("/{userId}")
//    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto,@PathVariable("userId") String userId){
//        User response = userService.updateUser(userDto,userId);
//
//        ApiResponse<User> apiResponse = ApiResponse.<User>builder()
//                .data(response)
//                .message("User Updated Successfully")
//                .success(true)
//                .timestamp(LocalDateTime.now())
//                .statusCode(HttpStatus.OK.value())
//                .build();
//        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
//    }
//
//    @GetMapping("/firebase")
//    public void firebaseUser(){
//        fireStoreService.fetchDataFromFirestore();
//    }
//
//    @DeleteMapping("/firebase/{email}")
//    public void deleteAuthenticationUser(@PathVariable("email") String email){
//        fireStoreService.deleteUserByEmail(email);
//    }
//
//    @PutMapping("/update-vehicle-number")
//    public void updateVehicleNumber(@RequestParam String currentVehicleNumber, @RequestParam String newVehicleNumber) {
//        fireStoreService.updateVehicleNumber(currentVehicleNumber, newVehicleNumber);
//    }



}
