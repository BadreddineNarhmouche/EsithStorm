package com.esithstorm.service;

import com.esithstorm.dao.TechnicienDao;
import com.esithstorm.entity.Technicien;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service métier : gestion des techniciens.
 */
@ApplicationScoped
public class TechnicienService {

    @Inject
    private TechnicienDao dao;

    public List<Technicien> findAll(String search, String disponibilite, String competences) {
        return dao.findAll(search, disponibilite, competences);
    }

    public Optional<Technicien> findById(Long id) {
        return dao.findById(id);
    }

    @Transactional
    public Technicien create(Technicien t) {
        return dao.persist(t);
    }

    @Transactional
    public Optional<Technicien> update(Long id, Technicien t) {
        return dao.findById(id).map(existing -> {
            existing.setNom(t.getNom());
            existing.setPrenom(t.getPrenom());
            existing.setCompetences(t.getCompetences());
            existing.setExperienceAnnees(t.getExperienceAnnees());
            existing.setDisponibilite(t.getDisponibilite());
            existing.setEmail(t.getEmail());
            return dao.merge(existing);
        });
    }

    @Transactional
    public boolean delete(Long id) {
        dao.remove(id);
        return true;
    }

    public long count() {
        return dao.count();
    }
}
