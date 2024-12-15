package com.bss.service;

import com.bss.dto.UserDto;
import com.bss.entity.User;
import java.util.List;

public interface UserService {


    public List<User> getAllUser();
    public User getUserById(String userId);
    public User addUser(UserDto userDto);
    public String deleteUser(String userId);
    public User updateUser(UserDto userDto,String userId);

}
