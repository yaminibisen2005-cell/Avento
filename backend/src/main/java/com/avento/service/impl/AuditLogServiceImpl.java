package com.avento.service.impl;

import com.avento.entity.AuditLog;
import com.avento.repository.AuditLogRepository;
import com.avento.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Async
    @Transactional
    public void log(String action, Long userId, String email, String role, String ipAddress, String details) {
        try {
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .userId(userId)
                    .userEmail(email)
                    .userRole(role)
                    .ipAddress(ipAddress)
                    .details(details)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception ignored) {}
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
