package com.avento.service.impl;

import com.avento.dto.FileUploadResponse;
import com.avento.exception.BadRequestException;
import com.avento.service.FileUploadService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadServiceImpl.class);

    @Value("${cloudinary.cloud_name:avento-cloud}")
    private String cloudName;

    @Value("${cloudinary.api_key:984128471928412}")
    private String apiKey;

    @Value("${cloudinary.api_secret:SecretAventoCloudinaryApiSecret123}")
    private String apiSecret;

    @Value("${avento.upload.dir:uploads}")
    private String uploadDir;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        try {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));
        } catch (Exception e) {
            logger.warn("Cloudinary init warning: {}", e.getMessage());
        }

        // Ensure local uploads directory exists
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            logger.error("Failed to create upload directory: {}", e.getMessage());
        }
    }

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg";
        String ext = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1) : "jpg";
        String uniqueName = UUID.randomUUID().toString() + "_" + originalFilename;

        // Try Cloudinary upload
        try {
            if (cloudinary != null && !apiKey.contains("984128471928412")) {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", folder != null ? folder : "avento",
                        "resource_type", "auto"
                ));
                return FileUploadResponse.builder()
                        .url(uploadResult.get("secure_url").toString())
                        .publicId(uploadResult.get("public_id").toString())
                        .fileName(originalFilename)
                        .size(file.getSize())
                        .format(uploadResult.get("format") != null ? uploadResult.get("format").toString() : ext)
                        .build();
            }
        } catch (Exception e) {
            logger.warn("Cloudinary upload failed, switching to local store fallback: {}", e.getMessage());
        }

        // Local Store Fallback
        try {
            Path targetPath = Paths.get(uploadDir).resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8081/uploads/" + uniqueName;
            return FileUploadResponse.builder()
                    .url(fileUrl)
                    .publicId(uniqueName)
                    .fileName(originalFilename)
                    .size(file.getSize())
                    .format(ext)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
}
