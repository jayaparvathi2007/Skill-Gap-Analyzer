package com.skillgap.model;

import java.sql.Timestamp;

public class UserSkill {
    private int id;
    private int userId;
    private int skillId;
    private String skillName;
    private String skillCategory;
    private String proficiencyLevel; // Beginner, Intermediate, Advanced
    private double yearsExperience;
    private Timestamp addedAt;

    public UserSkill() {}

    public UserSkill(int userId, int skillId, String proficiencyLevel, double yearsExperience) {
        this.userId = userId;
        this.skillId = skillId;
        this.proficiencyLevel = proficiencyLevel;
        this.yearsExperience = yearsExperience;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getSkillId() { return skillId; }
    public void setSkillId(int skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getSkillCategory() { return skillCategory; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public double getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(double yearsExperience) { this.yearsExperience = yearsExperience; }

    public Timestamp getAddedAt() { return addedAt; }
    public void setAddedAt(Timestamp addedAt) { this.addedAt = addedAt; }
}
