package com.esithstorm.service;

import com.esithstorm.dao.EntrepriseDao;
import com.esithstorm.entity.Entreprise;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service métier : gestion des entreprises.
 */
@ApplicationScoped
public class EntrepriseService {

    @Inject
    private EntrepriseDao dao;

    public List<Entreprise> findAll(String search, String pays, String specialite) {
        return dao.findAll(search, pays, specialite);
    }

    public Optional<Entreprise> findById(Long id) {
        return dao.findById(id);
    }

    @Transactional
    public Entreprise create(Entreprise e) {
        return dao.persist(e);
    }

    @Transactional
    public Optional<Entreprise> update(Long id, Entreprise e) {
        return dao.findById(id).map(existing -> {
            existing.setNom(e.getNom());
            existing.setPays(e.getPays());
            existing.setSpecialiteTextile(e.getSpecialiteTextile());
            existing.setEmail(e.getEmail());
            existing.setTelephone(e.getTelephone());
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
