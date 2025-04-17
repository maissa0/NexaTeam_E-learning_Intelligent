package com.applications.hrmanagement.Repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.applications.hrmanagement.Entities.JobApplication;
import com.applications.hrmanagement.Entities.User;
import java.util.List;

@Repository
public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findByUser(User user);
}
