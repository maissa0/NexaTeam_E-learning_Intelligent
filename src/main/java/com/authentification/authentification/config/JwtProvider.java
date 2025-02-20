package com.authentification.authentification.config;

import com.authentification.authentification.response.AuthResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class JwtProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtProvider.class);
    static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

   /* public static String generateToken(Authentication auth) {

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        String roles = populateAuthorities(authorities);


        String jwt = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime()+86400000))
                .claim("email",auth.getName())
                .claim("authorities",roles)
                .signWith(key)
                .compact();

        return jwt;


    }*/

    public static AuthResponse generateToken(Authentication auth) {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);
        String email = auth.getName();

        // Generate JWT token
        String jwt = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000)) // 1 day expiration
                .claim("email", email)
                .claim("authorities", roles)
                .signWith(key)
                .compact();

        // Create the AuthResponse object with the JWT, email, and roles
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setRole(roles);
        authResponse.setMessage("Login Successfully");
        authResponse.setStatus(true);

        return authResponse;
    }






    public static String getEmailFromJwtToken(String jwt) {
        jwt=jwt.substring(7);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        String email =String.valueOf(claims.get("email"));

        return email;
    }

    private static String populateAuthorities(Collection<? extends GrantedAuthority> collection) {

        Set<String> auths=new HashSet<>();
        for (GrantedAuthority authority : collection) {

            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }
}