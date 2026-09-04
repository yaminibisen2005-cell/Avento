package com.avento.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import java.io.InputStream;

@Configuration
public class FirebaseAdminConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAdminConfig.class);

    @Value("${avento.firebase.service-account-path:serviceAccountKey.json}")
    private String serviceAccountPath;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            logger.info("FirebaseApp is already initialized.");
            return;
        }

        try {
            InputStream serviceAccountStream = null;

            Resource classPathResource = new ClassPathResource(serviceAccountPath);
            if (classPathResource.exists()) {
                serviceAccountStream = classPathResource.getInputStream();
                logger.info("Found Firebase service account key in classpath: {}", serviceAccountPath);
            } else {
                Resource fileResource = new FileSystemResource(serviceAccountPath);
                if (fileResource.exists()) {
                    serviceAccountStream = fileResource.getInputStream();
                    logger.info("Found Firebase service account key in filesystem: {}", serviceAccountPath);
                }
            }

            if (serviceAccountStream != null) {
                try {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                            .build();
                    FirebaseApp.initializeApp(options);
                    logger.info("Firebase Admin SDK successfully initialized with serviceAccountKey.");
                    return;
                } catch (Exception credEx) {
                    logger.warn("Service account credentials invalid or placeholder ({}). Initializing dev fallback.", credEx.getMessage());
                }
            } else {
                logger.warn("No serviceAccountKey.json found at '{}'. Checking Google Application Default Credentials.", serviceAccountPath);
                try {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                    FirebaseApp.initializeApp(options);
                    logger.info("Firebase Admin SDK successfully initialized with Application Default Credentials.");
                    return;
                } catch (Exception e) {
                    logger.warn("Application Default Credentials not available: {}", e.getMessage());
                }
            }

            // Fallback initialization for build/test environments
            try {
                FirebaseOptions fallbackOptions = FirebaseOptions.builder()
                        .setProjectId("avento-demo-project")
                        .build();
                FirebaseApp.initializeApp(fallbackOptions);
                logger.info("Firebase Admin SDK initialized in dev/build fallback mode.");
            } catch (Exception ex) {
                logger.warn("Firebase fallback initialization note: {}", ex.getMessage());
            }

        } catch (Exception e) {
            logger.error("Unable to initialize Firebase Admin SDK: {}", e.getMessage());
        }
    }
}
