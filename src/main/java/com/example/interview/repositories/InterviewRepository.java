package com.example.interview.repositories;

import com.example.interview.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {

}
