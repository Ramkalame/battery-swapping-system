package com.bss.service;

import com.bss.dto.UserDto;
import com.bss.entity.User;
import java.util.List;

public interface UserService {


    public List<User> getAllUser();
    public User getUserById(String userId);
    public User addUser(UserDto userDto);

    public String deleteUser(String userId);
//    {
//        userRepository.findById(userId).ifPresent(userRepository::delete);
//        return "User deleted with id: "+userId;
//    }

    public User updateUser(UserDto userDto,String userId);
//    {
//        User existingUser = userRepository.findById(userId).orElse(null);
//        if (existingUser != null){
//            existingUser.setUserId(user.getUserId());
//            existingUser.setUserName(user.getUserName());
//            existingUser.setMobileNumber(user.getMobileNumber());
//            existingUser.setVehicleImageUrl(user.getVehicleNumber());
//            existingUser.setVehicleImageUrl(user.getVehicleImageUrl());
//            return userRepository.save(existingUser);
//        }else {
//            return null;
//        }
//    }

}
