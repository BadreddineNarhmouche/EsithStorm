package com.esithstorm.dao;

import com.esithstorm.entity.Chercheur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DAO : accès aux données Chercheur avec recherche et filtres.
 */
@ApplicationScoped
public class ChercheurDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public List<Chercheur> findAll(String search, String domaines, String materiaux) {
        StringBuilder jpql = new StringBuilder("SELECT c FROM Chercheur c WHERE 1=1");
        Map<String, Object> params = new HashMap<>();
        if (search != null && !search.isBlank()) {
            jpql.append(" AND (LOWER(c.nom) LIKE :search OR LOWER(c.prenom) LIKE :search OR LOWER(c.email) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        if (domaines != null && !domaines.isBlank()) {
            jpql.append(" AND LOWER(c.domainesRecherche) LIKE :domaines");
            params.put("domaines", "%" + domaines.toLowerCase() + "%");
        }
        if (materiaux != null && !materiaux.isBlank()) {
            jpql.append(" AND LOWER(c.materiauxEtudies) LIKE :materiaux");
            params.put("materiaux", "%" + materiaux.toLowerCase() + "%");
        }
        jpql.append(" ORDER BY c.nom, c.prenom");
        TypedQuery<Chercheur> q = em.createQuery(jpql.toString(), Chercheur.class);
        params.forEach(q::setParameter);
        return q.getResultList();
    }

    public Optional<Chercheur> findById(Long id) {
        return Optional.ofNullable(em.find(Chercheur.class, id));
    }

    public Chercheur persist(Chercheur c) {
        em.persist(c);
        return c;
    }

    public Chercheur merge(Chercheur c) {
        return em.merge(c);
    }

    public void remove(Long id) {
        findById(id).ifPresent(em::remove);
    }

    public long count() {
        return em.createQuery("SELECT COUNT(c) FROM Chercheur c", Long.class).getSingleResult();
    }
}
