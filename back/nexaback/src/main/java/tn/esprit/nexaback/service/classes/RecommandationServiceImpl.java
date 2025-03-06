package tn.esprit.nexaback.service.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.nexaback.persistance.entities.Cours;
import tn.esprit.nexaback.persistance.entities.Recommandation;
import tn.esprit.nexaback.persistance.entities.User;
import tn.esprit.nexaback.persistance.repositories.CoursRepository;
import tn.esprit.nexaback.persistance.repositories.RecommandationRepository;
import tn.esprit.nexaback.persistance.repositories.UserRepository;
import tn.esprit.nexaback.service.interfaces.RecommandationService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RecommandationServiceImpl implements RecommandationService {

    @Autowired
    private RecommandationRepository recommandationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoursRepository coursRepository;

    @Override
    public List<Recommandation> retrieveAllRecommandationsByUser(Integer id) {
        return recommandationRepository.findByUserId(id);
    }

    @Override
    public Recommandation createRecommandation(Integer userId, Integer courseId, Integer engagement) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Optional<Cours> coursOpt = coursRepository.findById(courseId);
        if (coursOpt.isEmpty()) {
            throw new RuntimeException("Cours not found");
        }

        Recommandation recommandation = new Recommandation();
        recommandation.setEngagement(engagement);
        recommandation.setDateDeCreation(new Date());
        recommandation.setUser(userOpt.get());
        recommandation.setCours(coursOpt.get());

        return recommandationRepository.save(recommandation);
    }

    @Override
    public void removeRecommandation(Integer id) {
        recommandationRepository.deleteById(id);
    }

	@Override
	public List<Cours> recommendCoursesByTitle(Integer id) {
	      Cours c = coursRepository.findById(id)
                  .orElseThrow(() -> new RuntimeException("Course not found"));
		List<Cours> allCourses = coursRepository.findAll();
        List<CourseSimilarity> courseSimilarities = new ArrayList<>();
        String sujet = c.getSujet();
        for (Cours course : allCourses) {
            if (!course.getSujet().equalsIgnoreCase(sujet)) {
                int distance = getLevenshteinDistance(sujet, course.getSujet());
                courseSimilarities.add(new CourseSimilarity(course, distance));
            }
        }

        courseSimilarities.sort(Comparator.comparingInt(CourseSimilarity::getDistance));

        List<Cours> recommendedCourses = new ArrayList<>();
        for (int i = 0; i < Math.min(3, courseSimilarities.size()); i++) {
            recommendedCourses.add(courseSimilarities.get(i).getCourse());
        }

        return recommendedCourses;
    }
    public static int getLevenshteinDistance(String s1, String s2) {
        int lenS1 = s1.length();
        int lenS2 = s2.length();
        int[][] dp = new int[lenS1 + 1][lenS2 + 1];

        for (int i = 0; i <= lenS1; i++) {
            for (int j = 0; j <= lenS2; j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1] + (s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1),
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1));
                }
            }
        }
        return dp[lenS1][lenS2];
    }
    private static class CourseSimilarity {
        private Cours course;
        private int distance;

        public CourseSimilarity(Cours course, int distance) {
            this.course = course;
            this.distance = distance;
        }

        public Cours getCourse() {
            return course;
        }

        public int getDistance() {
            return distance;
        }
    }

}
