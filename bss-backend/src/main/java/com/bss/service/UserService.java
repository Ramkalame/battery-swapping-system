package com.bss.service;

import com.bss.entity.User;
import com.bss.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public User getUserById(String userId){
       return userRepository.findById(userId).orElse(null);
    }


    public User addUser(User newUser){
        return userRepository.save(newUser);
    }

    public String deleteUser(String userId){
        userRepository.findById(userId).ifPresent(userRepository::delete);
        return "User deleted with id: "+userId;
    }

    public User updateUser(User user,String userId){
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null){
            existingUser.setUserId(user.getUserId());
            existingUser.setUserName(user.getUserName());
            existingUser.setMobileNumber(user.getMobileNumber());
            existingUser.setEngineNumber(user.getEngineNumber());
            existingUser.setImgUrl(user.getImgUrl());
            return userRepository.save(existingUser);
        }else {
            return null;
        }
    }

}
