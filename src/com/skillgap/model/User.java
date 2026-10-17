package com.skillgap.model;

import java.sql.Timestamp;

public class User {
    private int id;
    private String fullName;
    private String email;
    private String passwordHash;
    private Integer targetRoleId;
    private String targetRoleTitle;
    private String experienceLevel;
    private Timestamp createdAt;

    public User() {}

    public User(int id, String fullName, String email, Integer targetRoleId, String experienceLevel) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.targetRoleId = targetRoleId;
        this.experienceLevel = experienceLevel;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(Integer targetRoleId) { this.targetRoleId = targetRoleId; }

    public String getTargetRoleTitle() { return targetRoleTitle; }
    public void setTargetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
