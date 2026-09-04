package com.avento.service;

import com.avento.entity.AuditLog;

import java.util.List;

public interface AuditLogService {
    void log(String action, Long userId, String email, String role, String ipAddress, String details);
    List<AuditLog> getAllAuditLogs();
    List<AuditLog> getLogsByUser(Long userId);
}
