package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.DTO.JobOfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import  com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

@Repository
public class JobOfferRepositoryCustomImpl implements JobOfferRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<jobOffer> searchJobOffers(JobOfferDto searchDTO) {
        Query query = new Query();
        Criteria criteria = new Criteria();

        // Ajouter des critères de recherche dynamiquement
        if (searchDTO.getTitle() != null && !searchDTO.getTitle().isEmpty()) {
            criteria.and("title").regex(searchDTO.getTitle(), "i"); // Recherche insensible à la casse
        }
        if (searchDTO.getDescription() != null && !searchDTO.getDescription().isEmpty()) {
            criteria.and("description").regex(searchDTO.getDescription(), "i");
        }
        if (searchDTO.getContractType() != null) {
            criteria.and("contractType").is(searchDTO.getContractType());
        }
        if (searchDTO.getLocation() != null) {
            criteria.and("location").is(searchDTO.getLocation());
        }
        if (searchDTO.getExperienceLevel() != null) {
            criteria.and("experienceLevel").is(searchDTO.getExperienceLevel());
        }
        if (searchDTO.getRequiredSkills() != null && !searchDTO.getRequiredSkills().isEmpty()) {
            criteria.and("requiredSkills").regex(searchDTO.getRequiredSkills(), "i");
        }


        // Appliquer les critères à la requête
        query.addCriteria(criteria);

        // Appliquer le tri
        Sort sort = Sort.by(Sort.Direction.fromString(searchDTO.getSortDirection()), searchDTO.getSortBy());
        query.with(sort);

        // Appliquer la pagination
        query.with(PageRequest.of(searchDTO.getPage(), searchDTO.getSize()));

        // Exécuter la requête
        return mongoTemplate.find(query, jobOffer.class);
    }}