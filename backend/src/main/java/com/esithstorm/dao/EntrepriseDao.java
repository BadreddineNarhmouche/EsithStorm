package com.esithstorm.dao;

import java.util.Optional;
import com.esithstorm.entity.Entreprise;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * DAO : accès aux données Entreprise avec recherche et filtres.
 */
@ApplicationScoped
public class EntrepriseDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public List<Entreprise> findAll(String search, String pays, String specialite) {
        StringBuilder jpql = new StringBuilder("SELECT e FROM Entreprise e WHERE 1=1");
        Map<String, Object> params = new HashMap<>();
        if (search != null && !search.isBlank()) {
            jpql.append(" AND (LOWER(e.nom) LIKE :search OR LOWER(e.email) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        if (pays != null && !pays.isBlank()) {
            jpql.append(" AND LOWER(e.pays) = LOWER(:pays)");
            params.put("pays", pays.trim());
        }
        if (specialite != null && !specialite.isBlank()) {
            jpql.append(" AND LOWER(e.specialiteTextile) LIKE :specialite");
            params.put("specialite", "%" + specialite.toLowerCase() + "%");
        }
        jpql.append(" ORDER BY e.nom");
        TypedQuery<Entreprise> q = em.createQuery(jpql.toString(), Entreprise.class);
        params.forEach(q::setParameter);
        return q.getResultList();
    }

    public Optional<Entreprise> findById(Long id) {
        return Optional.ofNullable(em.find(Entreprise.class, id));
    }

    public Entreprise persist(Entreprise e) {
        em.persist(e);
        return e;
    }

    public Entreprise merge(Entreprise e) {
        return em.merge(e);
    }

    public void remove(Long id) {
        findById(id).ifPresent(em::remove);
    }

    public long count() {
        return em.createQuery("SELECT COUNT(e) FROM Entreprise e", Long.class).getSingleResult();
    }
}
