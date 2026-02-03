package com.esithstorm.service;

import com.esithstorm.dao.FournisseurDao;
import com.esithstorm.entity.Fournisseur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service métier : gestion des fournisseurs.
 */
@ApplicationScoped
public class FournisseurService {

    @Inject
    private FournisseurDao dao;

    public List<Fournisseur> findAll(String search, String pays, String ville, String matieres) {
        return dao.findAll(search, pays, ville, matieres);
    }

    public Optional<Fournisseur> findById(Long id) {
        return dao.findById(id);
    }

    @Transactional
    public Fournisseur create(Fournisseur f) {
        return dao.persist(f);
    }

    @Transactional
    public Optional<Fournisseur> update(Long id, Fournisseur f) {
        return dao.findById(id).map(existing -> {
            existing.setNom(f.getNom());
            existing.setMatieresPremieres(f.getMatieresPremieres());
            existing.setDelaiJours(f.getDelaiJours());
            existing.setVille(f.getVille());
            existing.setPays(f.getPays());
            existing.setEmail(f.getEmail());
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
