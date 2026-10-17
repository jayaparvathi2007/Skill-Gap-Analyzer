package com.skillgap.model;

public class RoleSkill {
    private int id;
    private int roleId;
    private int skillId;
    private String skillName;
    private String skillCategory;
    private String importance; // Mandatory, Recommended, Bonus
    private int weight; // 3, 2, 1
    private String minProficiency; // Beginner, Intermediate, Advanced
    private String skillDescription;

    public RoleSkill() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public int getSkillId() { return skillId; }
    public void setSkillId(int skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getSkillCategory() { return skillCategory; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }

    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }

    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }

    public String getMinProficiency() { return minProficiency; }
    public void setMinProficiency(String minProficiency) { this.minProficiency = minProficiency; }

    public String getSkillDescription() { return skillDescription; }
    public void setSkillDescription(String skillDescription) { this.skillDescription = skillDescription; }
}
