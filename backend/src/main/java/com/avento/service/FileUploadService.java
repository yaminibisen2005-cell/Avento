package com.avento.service;

import com.avento.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    FileUploadResponse uploadFile(MultipartFile file, String folder);
}
