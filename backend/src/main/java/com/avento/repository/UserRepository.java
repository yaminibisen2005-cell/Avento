package com.avento.repository;

import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByFirebaseUid(String firebaseUid);
    Boolean existsByEmail(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
    Boolean existsByFirebaseUid(String firebaseUid);
    java.util.List<User> findByRole(com.avento.entity.Role role);
}
