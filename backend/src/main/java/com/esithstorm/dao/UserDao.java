package com.esithstorm.dao;

import com.esithstorm.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.Optional;

/**
 * DAO : accès aux données User (authentification).
 */
@ApplicationScoped
public class UserDao {

    @PersistenceContext(unitName = "esithstormPU")
    private EntityManager em;

    public Optional<User> findByUsername(String username) {
        TypedQuery<User> q = em.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class);
        q.setParameter("username", username);
        return q.getResultList().stream().findFirst();
    }

    public User persist(User user) {
        em.persist(user);
        return user;
    }

    public long count() {
        return em.createQuery("SELECT COUNT(u) FROM User u", Long.class).getSingleResult();
    }
}
