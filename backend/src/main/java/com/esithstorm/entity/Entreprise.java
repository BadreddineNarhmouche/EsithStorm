package com.esithstorm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité JPA : entreprise textile (nom, pays, spécialité, contacts).
 */
@Entity
@Table(name = "entreprise")
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(length = 100)
    private String pays;

    @Column(name = "specialite_textile", length = 200)
    private String specialiteTextile;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String telephone;

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
    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }
    public String getSpecialiteTextile() { return specialiteTextile; }
    public void setSpecialiteTextile(String specialiteTextile) { this.specialiteTextile = specialiteTextile; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
