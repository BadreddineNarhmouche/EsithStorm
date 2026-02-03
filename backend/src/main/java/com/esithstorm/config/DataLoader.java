package com.esithstorm.config;

import com.esithstorm.entity.User;
import com.esithstorm.service.AuthService;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Charge les données initiales au démarrage : création de l'utilisateur admin si aucun utilisateur.
 * Le mot de passe par défaut est : admin123
 */
@ApplicationScoped
public class DataLoader {

    @Inject
    private com.esithstorm.dao.UserDao userDao;

    @PostConstruct
    public void init() {
        if (userDao.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(AuthService.hashPassword("admin123"));
            admin.setRole(User.Role.ADMIN);
            userDao.persist(admin);
            User user = new User();
            user.setUsername("user");
            user.setPasswordHash(AuthService.hashPassword("user123"));
            user.setRole(User.Role.USER);
            userDao.persist(user);
        }
    }
}
