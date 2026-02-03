package com.esithstorm.dao;

import com.esithstorm.entity.Fournisseur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO : accès aux données Fournisseur avec recherche et filtres.
 */
@ApplicationScoped
public class FournisseurDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public List<Fournisseur> findAll(String search, String pays, String ville, String matieres) {
        StringBuilder jpql = new StringBuilder("SELECT f FROM Fournisseur f WHERE 1=1");
        Map<String, Object> params = new HashMap<>();
        if (search != null && !search.isBlank()) {
            jpql.append(" AND (LOWER(f.nom) LIKE :search OR LOWER(f.email) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        if (pays != null && !pays.isBlank()) {
            jpql.append(" AND LOWER(f.pays) = LOWER(:pays)");
            params.put("pays", pays.trim());
        }
        if (ville != null && !ville.isBlank()) {
            jpql.append(" AND LOWER(f.ville) LIKE :ville");
            params.put("ville", "%" + ville.toLowerCase() + "%");
        }
        if (matieres != null && !matieres.isBlank()) {
            jpql.append(" AND LOWER(f.matieresPremieres) LIKE :matieres");
            params.put("matieres", "%" + matieres.toLowerCase() + "%");
        }
        jpql.append(" ORDER BY f.nom");
        TypedQuery<Fournisseur> q = em.createQuery(jpql.toString(), Fournisseur.class);
        params.forEach(q::setParameter);
        return q.getResultList();
    }

    public Optional<Fournisseur> findById(Long id) {
        return Optional.ofNullable(em.find(Fournisseur.class, id));
    }

    public Fournisseur persist(Fournisseur f) {
        em.persist(f);
        return f;
    }

    public Fournisseur merge(Fournisseur f) {
        return em.merge(f);
    }

    public void remove(Long id) {
        findById(id).ifPresent(em::remove);
    }

    public long count() {
        return em.createQuery("SELECT COUNT(f) FROM Fournisseur f", Long.class).getSingleResult();
    }
}
