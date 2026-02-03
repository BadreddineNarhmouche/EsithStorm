package com.esithstorm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité JPA : fournisseur (matières premières, délais, localisation).
 */
@Entity
@Table(name = "fournisseur")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(name = "matieres_premieres", length = 500)
    private String matieresPremieres;

    @Column(name = "delai_jours")
    private Integer delaiJours;

    @Column(length = 100)
    private String ville;

    @Column(length = 100)
    private String pays;

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
    public String getMatieresPremieres() { return matieresPremieres; }
    public void setMatieresPremieres(String matieresPremieres) { this.matieresPremieres = matieresPremieres; }
    public Integer getDelaiJours() { return delaiJours; }
    public void setDelaiJours(Integer delaiJours) { this.delaiJours = delaiJours; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
