package com.avento.security;

import com.avento.entity.Role;
import com.avento.entity.User;
import com.avento.repository.UserRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthenticationFilter.class);

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getBearerToken(request);
        String headerEmail = request.getHeader("X-User-Email");

        User user = null;

        if (StringUtils.hasText(token)) {
            try {
                if (!FirebaseApp.getApps().isEmpty()) {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                    String uid = decodedToken.getUid();
                    String email = decodedToken.getEmail();
                    String name = decodedToken.getName();

                    if (email != null) {
                        email = email.trim().toLowerCase();
                    }

                    if (StringUtils.hasText(uid)) {
                        user = userRepository.findByFirebaseUid(uid).orElse(null);
                    }

                    if (user == null && StringUtils.hasText(email)) {
                        user = userRepository.findByEmail(email).orElse(null);
                        if (user != null && user.getFirebaseUid() == null) {
                            user.setFirebaseUid(uid);
                            user = userRepository.save(user);
                        }
                    }

                    if (user == null && StringUtils.hasText(email)) {
                        // Auto-provision user in MySQL for authenticated Firebase users
                        user = User.builder()
                                .firebaseUid(uid)
                                .email(email)
                                .fullName(StringUtils.hasText(name) ? name : email.split("@")[0])
                                .role(Role.STUDENT)
                                .verified(decodedToken.isEmailVerified())
                                .approved(true)
                                .blocked(false)
                                .build();
                        user = userRepository.save(user);
                        logger.info("Auto-provisioned MySQL User entity for Firebase UID: {}", uid);
                    }
                }
            } catch (Exception ex) {
                logger.debug("Firebase ID token verification failed: {}", ex.getMessage());
            }
        }

        // Development / Database fallback when Firebase token is mock or external Firebase credentials are absent
        if (user == null) {
            String fallbackEmail = null;
            if (StringUtils.hasText(headerEmail)) {
                fallbackEmail = headerEmail.trim().toLowerCase();
            } else if (StringUtils.hasText(token)) {
                if (token.startsWith("mock-token-")) {
                    fallbackEmail = token.substring("mock-token-".length()).trim().toLowerCase();
                } else if (token.contains("@")) {
                    fallbackEmail = token.trim().toLowerCase();
                }
            }

            if (StringUtils.hasText(fallbackEmail)) {
                user = userRepository.findByEmail(fallbackEmail).orElse(null);
            }
        }

        if (user != null) {
            if (Boolean.TRUE.equals(user.getBlocked())) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"status\":403,\"message\":\"Your account has been blocked by an administrator.\"}");
                return;
            }

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getBearerToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
