package com.bss.repository;

import com.bss.entity.EmptyBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmptyBoxRepository extends JpaRepository<EmptyBox,String> {

}
