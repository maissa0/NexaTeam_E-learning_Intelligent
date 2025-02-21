package tn.esprit.sendo_pi.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import tn.esprit.sendo_pi.model.User;

public interface UserRepository extends CrudRepository<User, String> {

	public User findByEmail(String email);

	public User findByUsername(String username);

	public User findByEmailAndPassword(String email, String password);

	public List<User> findProfileByEmail(String email);

}