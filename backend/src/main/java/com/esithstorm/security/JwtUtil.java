package com.esithstorm.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.enterprise.context.ApplicationScoped;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilitaire JWT : génération et validation des tokens.
 * En production, utiliser une clé secrète forte (variable d'environnement).
 */
@ApplicationScoped
public class JwtUtil {

    private static final String SECRET = "EsithStormSecretKey2024Minimum32Characters!!";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 h

    private byte[] getSigningKey() {
        return SECRET.getBytes(StandardCharsets.UTF_8);
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .signWith(Keys.hmacShaKeyFor(getSigningKey()))
            .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(getSigningKey()))
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        return (String) parseToken(token).get("role");
    }
}
