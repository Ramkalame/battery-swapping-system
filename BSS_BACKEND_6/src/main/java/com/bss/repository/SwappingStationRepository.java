package com.bss.repository;

import com.bss.entity.SwappingStation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SwappingStationRepository extends MongoRepository<SwappingStation,String> {

}
