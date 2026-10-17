package com.skillgap.model;

import java.sql.Date;
import java.sql.Timestamp;

public class LearningProgress {
    private int id;
    private int userId;
    private int skillId;
    private String skillName;
    private String skillCategory;
    private String status; // Not Started, In Progress, Completed
    private int progressPercent;
    private Date targetCompletionDate;
    private String notes;
    private Timestamp updatedAt;

    public LearningProgress() {}

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getProgressPercent() { return progressPercent; }
    public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }

    public Date getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(Date targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}
