package com.esithstorm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité JPA : chercheur (domaines de recherche, matériaux étudiés, publications).
 */
@Entity
@Table(name = "chercheur")
public class Chercheur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 100)
    private String prenom;

    @Column(name = "domaines_recherche", length = 500)
    private String domainesRecherche;

    @Column(name = "materiaux_etudies", length = 500)
    private String materiauxEtudies;

    @Column(columnDefinition = "TEXT")
    private String publications;

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
    public String getDomainesRecherche() { return domainesRecherche; }
    public void setDomainesRecherche(String domainesRecherche) { this.domainesRecherche = domainesRecherche; }
    public String getMateriauxEtudies() { return materiauxEtudies; }
    public void setMateriauxEtudies(String materiauxEtudies) { this.materiauxEtudies = materiauxEtudies; }
    public String getPublications() { return publications; }
    public void setPublications(String publications) { this.publications = publications; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
