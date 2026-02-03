package com.esithstorm.service;

import com.esithstorm.dao.ChercheurDao;
import com.esithstorm.entity.Chercheur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service métier : gestion des chercheurs.
 */
@ApplicationScoped
public class ChercheurService {

    @Inject
    private ChercheurDao dao;

    public List<Chercheur> findAll(String search, String domaines, String materiaux) {
        return dao.findAll(search, domaines, materiaux);
    }

    public Optional<Chercheur> findById(Long id) {
        return dao.findById(id);
    }

    @Transactional
    public Chercheur create(Chercheur c) {
        return dao.persist(c);
    }

    @Transactional
    public Optional<Chercheur> update(Long id, Chercheur c) {
        return dao.findById(id).map(existing -> {
            existing.setNom(c.getNom());
            existing.setPrenom(c.getPrenom());
            existing.setDomainesRecherche(c.getDomainesRecherche());
            existing.setMateriauxEtudies(c.getMateriauxEtudies());
            existing.setPublications(c.getPublications());
            existing.setEmail(c.getEmail());
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
