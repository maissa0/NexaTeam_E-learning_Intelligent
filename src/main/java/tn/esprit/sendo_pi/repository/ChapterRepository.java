package tn.esprit.sendo_pi.repository;

import org.springframework.data.repository.CrudRepository;
import java.util.List;
import tn.esprit.sendo_pi.model.Chapter;

public interface ChapterRepository extends CrudRepository<Chapter, Integer>
{
	public List<Chapter> findByCoursename(String Coursename);
	
}