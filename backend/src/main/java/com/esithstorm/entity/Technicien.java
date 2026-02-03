package com.esithstorm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité JPA : technicien (compétences, expérience, disponibilité).
 */
@Entity
@Table(name = "technicien")
public class Technicien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 100)
    private String prenom;

    @Column(length = 500)
    private String competences;

    @Column(name = "experience_annees")
    private Integer experienceAnnees;

    @Column(length = 50)
    private String disponibilite = "LIBRE";

    @Column(length = 150)
    private String email;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // --- Getters / Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getCompetences() { return competences; }
    public void setCompetences(String competences) { this.competences = competences; }
    public Integer getExperienceAnnees() { return experienceAnnees; }
    public void setExperienceAnnees(Integer experienceAnnees) { this.experienceAnnees = experienceAnnees; }
    public String getDisponibilite() { return disponibilite; }
    public void setDisponibilite(String disponibilite) { this.disponibilite = disponibilite; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
