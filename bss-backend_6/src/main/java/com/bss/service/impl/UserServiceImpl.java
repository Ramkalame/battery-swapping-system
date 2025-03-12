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
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new EntityNotFoundException("User is not registered"));
    }

}
