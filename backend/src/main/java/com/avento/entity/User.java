package com.avento.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "firebaseUid")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 128)
    private String firebaseUid;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 255)
    private String profileImage;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean approved = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean blocked = false;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String branch;

    @Column(length = 20)
    private String year;

    @Column(length = 25)
    private String emergencyContact;

    @Column(length = 50)
    private String rollNumber;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 20)
    private String gender;

    @Column(length = 30)
    private String dob;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 255)
    private String linkedin;

    @Column(length = 255)
    private String github;

    @Column(length = 255)
    private String skills;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
