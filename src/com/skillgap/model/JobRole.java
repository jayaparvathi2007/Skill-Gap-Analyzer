package com.skillgap.model;

import java.util.List;

public class JobRole {
    private int id;
    private String title;
    private String department;
    private String description;
    private String avgSalary;
    private String demandLevel;
    private String icon;
    private int requiredSkillsCount;
    private List<RoleSkill> requiredSkills;

    public JobRole() {}

    public JobRole(int id, String title, String department, String description, String avgSalary, String demandLevel, String icon) {
        this.id = id;
        this.title = title;
        this.department = department;
        this.description = description;
        this.avgSalary = avgSalary;
        this.demandLevel = demandLevel;
        this.icon = icon;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAvgSalary() { return avgSalary; }
    public void setAvgSalary(String avgSalary) { this.avgSalary = avgSalary; }

    public String getDemandLevel() { return demandLevel; }
    public void setDemandLevel(String demandLevel) { this.demandLevel = demandLevel; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getRequiredSkillsCount() { return requiredSkillsCount; }
    public void setRequiredSkillsCount(int requiredSkillsCount) { this.requiredSkillsCount = requiredSkillsCount; }

    public List<RoleSkill> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<RoleSkill> requiredSkills) { this.requiredSkills = requiredSkills; }
}
