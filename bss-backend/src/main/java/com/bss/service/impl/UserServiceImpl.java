package com.bss.service.impl;

import com.bss.dto.UserDto;
import com.bss.entity.User;
import com.bss.entity.enums.UserType;
import com.bss.exception.EntityNotFoundException;
import com.bss.repository.UserRepository;
import com.bss.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new EntityNotFoundException("User is not registered"));
    }

    @Override
    public User addUser(UserDto userDto) {
        User newUser = User.builder()
                .userId(userDto.getUserId())
                .userName(userDto.getUserName())
                .mobileNumber(userDto.getMobileNumber())
                .vehicleNumber(userDto.getVehicleNumber())
                .profileImageUrl(userDto.getProfileImageUrl())
                .build();
        if (userDto.getUserType().equals(UserType.RICKSHAW.name())){
            newUser.setUserType(UserType.RICKSHAW);
        }
        if (userDto.getUserType().equals(UserType.SCOOTER.name())){
            newUser.setUserType(UserType.SCOOTER);
        }
        return userRepository.save(newUser);
    }

    @Override
    public String deleteUser(String userId) {
        userRepository.findById(userId).ifPresent(userRepository::delete);
        return "User "+userId+"Deleted Successfully";
    }

    @Override
    public User updateUser(UserDto userDto, String userId) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null){
            existingUser.setUserName(userDto.getUserName());
            existingUser.setMobileNumber(userDto.getMobileNumber());
            existingUser.setVehicleNumber(userDto.getVehicleNumber());
            existingUser.setProfileImageUrl(userDto.getProfileImageUrl());
            if (userDto.getUserType().equals(UserType.RICKSHAW.name())){
                existingUser.setUserType(UserType.RICKSHAW);
            }
            if (userDto.getUserType().equals(UserType.SCOOTER.name())){
                existingUser.setUserType(UserType.SCOOTER);
            }
            return userRepository.save(existingUser);
        }
        return null;
    }
}
