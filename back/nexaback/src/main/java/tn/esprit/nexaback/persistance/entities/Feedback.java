package tn.esprit.nexaback.persistance.entities;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Feedback implements Serializable{
	 
	private static final long serialVersionUID = 1L;

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer id;
	 
	 private String feedback;
	 private Integer emotion;
	 @Temporal(TemporalType.TIMESTAMP)
	 private Date dateDeCreation;
	 
	 @JsonIgnore
	 @ManyToOne
	 User user;
	 
	 @JsonIgnore
	 @ManyToOne
	 Cours cours;
	 
	 @ManyToMany
	 @JoinTable(
	        name = "feedback_likes",
	        joinColumns = @JoinColumn(name = "feedback_id"),
	        inverseJoinColumns = @JoinColumn(name = "user_id")
	    )
	    private Set<User> likedByUsers;

}
