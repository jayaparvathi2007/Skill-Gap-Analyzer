package com.skillgap.model;

import java.util.ArrayList;
import java.util.List;

public class SkillGapResult {
    private int roleId;
    private String roleTitle;
    private String department;
    private String avgSalary;
    private String demandLevel;
    private String roleDescription;

    private int totalRequiredSkills;
    private int matchedSkillsCount;
    private int missingSkillsCount;
    private int transferableSkillsCount;

    private int matchPercentage;       // direct count percentage
    private int weightedPercentage;    // weighted with importance & proficiency
    private String readinessLevel;     // Job Ready, High Potential, Foundations Built, Beginner
    private String readinessBadgeColor; // success, info, warning, danger
    private String readinessAdvice;
    private int estimatedWeeksToClose;

    private List<MatchedSkillDetail> matchedSkills = new ArrayList<>();
    private List<RoleSkill> missingSkills = new ArrayList<>();
    private List<UserSkill> transferableSkills = new ArrayList<>();
    private List<RoadmapStep> recommendedRoadmap = new ArrayList<>();

    public SkillGapResult() {}

    // Inner class for detailed matched skills
    public static class MatchedSkillDetail {
        private int skillId;
        private String skillName;
        private String category;
        private String userProficiency;
        private String requiredProficiency;
        private String importance;
        private boolean meetsRequirement; // true if userProficiency >= requiredProficiency

        public MatchedSkillDetail() {}

        public MatchedSkillDetail(int skillId, String skillName, String category, String userProficiency, 
                                  String requiredProficiency, String importance, boolean meetsRequirement) {
            this.skillId = skillId;
            this.skillName = skillName;
            this.category = category;
            this.userProficiency = userProficiency;
            this.requiredProficiency = requiredProficiency;
            this.importance = importance;
            this.meetsRequirement = meetsRequirement;
        }

        public int getSkillId() { return skillId; }
        public void setSkillId(int skillId) { this.skillId = skillId; }

        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getUserProficiency() { return userProficiency; }
        public void setUserProficiency(String userProficiency) { this.userProficiency = userProficiency; }

        public String getRequiredProficiency() { return requiredProficiency; }
        public void setRequiredProficiency(String requiredProficiency) { this.requiredProficiency = requiredProficiency; }

        public String getImportance() { return importance; }
        public void setImportance(String importance) { this.importance = importance; }

        public boolean isMeetsRequirement() { return meetsRequirement; }
        public void setMeetsRequirement(boolean meetsRequirement) { this.meetsRequirement = meetsRequirement; }
    }

    // Getters and Setters
    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAvgSalary() { return avgSalary; }
    public void setAvgSalary(String avgSalary) { this.avgSalary = avgSalary; }

    public String getDemandLevel() { return demandLevel; }
    public void setDemandLevel(String demandLevel) { this.demandLevel = demandLevel; }

    public String getRoleDescription() { return roleDescription; }
    public void setRoleDescription(String roleDescription) { this.roleDescription = roleDescription; }

    public int getTotalRequiredSkills() { return totalRequiredSkills; }
    public void setTotalRequiredSkills(int totalRequiredSkills) { this.totalRequiredSkills = totalRequiredSkills; }

    public int getMatchedSkillsCount() { return matchedSkillsCount; }
    public void setMatchedSkillsCount(int matchedSkillsCount) { this.matchedSkillsCount = matchedSkillsCount; }

    public int getMissingSkillsCount() { return missingSkillsCount; }
    public void setMissingSkillsCount(int missingSkillsCount) { this.missingSkillsCount = missingSkillsCount; }

    public int getTransferableSkillsCount() { return transferableSkillsCount; }
    public void setTransferableSkillsCount(int transferableSkillsCount) { this.transferableSkillsCount = transferableSkillsCount; }

    public int getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }

    public int getWeightedPercentage() { return weightedPercentage; }
    public void setWeightedPercentage(int weightedPercentage) { this.weightedPercentage = weightedPercentage; }

    public String getReadinessLevel() { return readinessLevel; }
    public void setReadinessLevel(String readinessLevel) { this.readinessLevel = readinessLevel; }

    public String getReadinessBadgeColor() { return readinessBadgeColor; }
    public void setReadinessBadgeColor(String readinessBadgeColor) { this.readinessBadgeColor = readinessBadgeColor; }

    public String getReadinessAdvice() { return readinessAdvice; }
    public void setReadinessAdvice(String readinessAdvice) { this.readinessAdvice = readinessAdvice; }

    public int getEstimatedWeeksToClose() { return estimatedWeeksToClose; }
    public void setEstimatedWeeksToClose(int estimatedWeeksToClose) { this.estimatedWeeksToClose = estimatedWeeksToClose; }

    public List<MatchedSkillDetail> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<MatchedSkillDetail> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<RoleSkill> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<RoleSkill> missingSkills) { this.missingSkills = missingSkills; }

    public List<UserSkill> getTransferableSkills() { return transferableSkills; }
    public void setTransferableSkills(List<UserSkill> transferableSkills) { this.transferableSkills = transferableSkills; }

    public List<RoadmapStep> getRecommendedRoadmap() { return recommendedRoadmap; }
    public void setRecommendedRoadmap(List<RoadmapStep> recommendedRoadmap) { this.recommendedRoadmap = recommendedRoadmap; }
}
