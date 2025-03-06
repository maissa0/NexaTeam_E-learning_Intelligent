package tn.esprit.nexaback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.esprit.nexaback.persistance.entities.Cours;
import tn.esprit.nexaback.persistance.entities.Recommandation;
import tn.esprit.nexaback.service.interfaces.RecommandationService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/recommandations")
public class RecommandationController {

    @Autowired
    private RecommandationService recommandationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommandation>> getRecommandationsByUser(@PathVariable("userId") Integer userId) {
        List<Recommandation> recommandations = recommandationService.retrieveAllRecommandationsByUser(userId);
        return ResponseEntity.ok(recommandations);
    }

    @PostMapping("/")
    public ResponseEntity<Recommandation> createRecommandation(@RequestParam("userId") Integer userId,
                                                               @RequestParam("courseId") Integer courseId,
                                                               @RequestParam("engagement") Integer engagement)  {
        Recommandation recommandation = recommandationService.createRecommandation(userId, courseId, engagement);
        return ResponseEntity.ok(recommandation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommandation(@PathVariable("id") Integer recommandationId) {
        recommandationService.removeRecommandation(recommandationId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/recommendations/{id}")
    public List<Cours> getRecommendedCourses(@PathVariable("id") Integer id) {
        return recommandationService.recommendCoursesByTitle(id);
    }
}
