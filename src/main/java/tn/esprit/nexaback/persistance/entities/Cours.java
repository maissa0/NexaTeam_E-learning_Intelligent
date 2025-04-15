package tn.esprit.nexaback.persistance.entities;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Cours implements Serializable{
	 
	private static final long serialVersionUID = 1L;

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer id;
	 
	 private String sujet;
}
