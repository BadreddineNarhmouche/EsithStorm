package com.esithstorm.dao;

import com.esithstorm.entity.Technicien;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO : accès aux données Technicien avec recherche et filtres.
 */
@ApplicationScoped
public class TechnicienDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public List<Technicien> findAll(String search, String disponibilite, String competences) {
        StringBuilder jpql = new StringBuilder("SELECT t FROM Technicien t WHERE 1=1");
        Map<String, Object> params = new HashMap<>();
        if (search != null && !search.isBlank()) {
            jpql.append(" AND (LOWER(t.nom) LIKE :search OR LOWER(t.prenom) LIKE :search OR LOWER(t.email) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        if (disponibilite != null && !disponibilite.isBlank()) {
            jpql.append(" AND LOWER(t.disponibilite) = LOWER(:disponibilite)");
            params.put("disponibilite", disponibilite.trim());
        }
        if (competences != null && !competences.isBlank()) {
            jpql.append(" AND LOWER(t.competences) LIKE :competences");
            params.put("competences", "%" + competences.toLowerCase() + "%");
        }
        jpql.append(" ORDER BY t.nom, t.prenom");
        TypedQuery<Technicien> q = em.createQuery(jpql.toString(), Technicien.class);
        params.forEach(q::setParameter);
        return q.getResultList();
    }

    public Optional<Technicien> findById(Long id) {
        return Optional.ofNullable(em.find(Technicien.class, id));
    }

    public Technicien persist(Technicien t) {
        em.persist(t);
        return t;
    }

    public Technicien merge(Technicien t) {
        return em.merge(t);
    }

    public void remove(Long id) {
        findById(id).ifPresent(em::remove);
    }

    public long count() {
        return em.createQuery("SELECT COUNT(t) FROM Technicien t", Long.class).getSingleResult();
    }
}
