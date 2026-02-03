package com.esithstorm.service;

import com.esithstorm.dao.AtelierDao;
import com.esithstorm.entity.Atelier;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service métier : gestion des ateliers.
 */
@ApplicationScoped
public class AtelierService {

    @Inject
    private AtelierDao dao;

    public List<Atelier> findAll(String search, String pays, String typeProduction) {
        return dao.findAll(search, pays, typeProduction);
    }

    public Optional<Atelier> findById(Long id) {
        return dao.findById(id);
    }

    @Transactional
    public Atelier create(Atelier a) {
        return dao.persist(a);
    }

    @Transactional
    public Optional<Atelier> update(Long id, Atelier a) {
        return dao.findById(id).map(existing -> {
            existing.setNom(a.getNom());
            existing.setTypeProduction(a.getTypeProduction());
            existing.setCapacite(a.getCapacite());
            existing.setEquipements(a.getEquipements());
            existing.setVille(a.getVille());
            existing.setPays(a.getPays());
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
