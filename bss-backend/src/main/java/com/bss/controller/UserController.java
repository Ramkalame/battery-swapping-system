package com.bss.controller;

import com.bss.entity.User;
import com.bss.service.UserService;
import com.bss.service.port.UsbPortSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UsbPortSenderService usbPortSenderService;

    @GetMapping
    public List<User> getAllUser(){
        return userService.getAllUser();
    }

    @GetMapping("/{userId}")
    public User getUserById(@PathVariable("userId") String userId){
        return userService.getUserById(userId);
    }

    @PostMapping
    public User addUser(@RequestBody User user){
        return userService.addUser(user);
    }

    @DeleteMapping("/{userId}")
    public String deleteUserById(@PathVariable("userId") String userId){
        return userService.deleteUser(userId);
    }


    @PatchMapping("/{userId}")
    public User updateUser(@RequestBody User user,@PathVariable("userId") String userId){
        return userService.updateUser(user,userId);
    }

    //testing api to send msg to arduino
    @PostMapping("/send")
    public String sendToArduino(@RequestBody String command) {
        usbPortSenderService.sendDataToArduino(command + "\n");
        return "Command sent to Arduino: " + command;
    }

}
