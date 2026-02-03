package com.esithstorm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité JPA : atelier (type de production, capacité, équipements).
 */
@Entity
@Table(name = "atelier")
public class Atelier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(name = "type_production", length = 200)
    private String typeProduction;

    @Column(length = 100)
    private String capacite;

    @Column(columnDefinition = "TEXT")
    private String equipements;

    @Column(length = 100)
    private String ville;

    @Column(length = 100)
    private String pays;

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
    public String getTypeProduction() { return typeProduction; }
    public void setTypeProduction(String typeProduction) { this.typeProduction = typeProduction; }
    public String getCapacite() { return capacite; }
    public void setCapacite(String capacite) { this.capacite = capacite; }
    public String getEquipements() { return equipements; }
    public void setEquipements(String equipements) { this.equipements = equipements; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
