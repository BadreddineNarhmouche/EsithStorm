package com.esithstorm.dao;

import com.esithstorm.entity.Atelier;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO : accès aux données Atelier avec recherche et filtres.
 */
@ApplicationScoped
public class AtelierDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public List<Atelier> findAll(String search, String pays, String typeProduction) {
        StringBuilder jpql = new StringBuilder("SELECT a FROM Atelier a WHERE 1=1");
        Map<String, Object> params = new HashMap<>();
        if (search != null && !search.isBlank()) {
            jpql.append(" AND (LOWER(a.nom) LIKE :search OR LOWER(a.equipements) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        if (pays != null && !pays.isBlank()) {
            jpql.append(" AND LOWER(a.pays) = LOWER(:pays)");
            params.put("pays", pays.trim());
        }
        if (typeProduction != null && !typeProduction.isBlank()) {
            jpql.append(" AND LOWER(a.typeProduction) LIKE :typeProduction");
            params.put("typeProduction", "%" + typeProduction.toLowerCase() + "%");
        }
        jpql.append(" ORDER BY a.nom");
        TypedQuery<Atelier> q = em.createQuery(jpql.toString(), Atelier.class);
        params.forEach(q::setParameter);
        return q.getResultList();
    }

    public Optional<Atelier> findById(Long id) {
        return Optional.ofNullable(em.find(Atelier.class, id));
    }

    public Atelier persist(Atelier a) {
        em.persist(a);
        return a;
    }

    public Atelier merge(Atelier a) {
        return em.merge(a);
    }

    public void remove(Long id) {
        findById(id).ifPresent(em::remove);
    }

    public long count() {
        return em.createQuery("SELECT COUNT(a) FROM Atelier a", Long.class).getSingleResult();
    }
}
