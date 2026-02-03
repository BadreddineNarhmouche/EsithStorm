package com.esithstorm.service;

import com.esithstorm.dao.UserDao;
import com.esithstorm.entity.User;
import com.esithstorm.security.JwtUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.mindrot.jbcrypt.BCrypt;
import java.util.Optional;

/**
 * Service d'authentification : vérification des identifiants et génération JWT.
 */
@ApplicationScoped
public class AuthService {

    @Inject
    private UserDao userDao;

    @Inject
    private JwtUtil jwtUtil;

    /**
     * Vérifie login/mot de passe et retourne un JWT si OK.
     */
    public Optional<String> login(String username, String password) {
        return userDao.findByUsername(username)
            .filter(user -> BCrypt.checkpw(password, user.getPasswordHash()))
            .map(user -> jwtUtil.generateToken(user.getUsername(), user.getRole().name()));
    }

    public Optional<User> findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));
    }
}
