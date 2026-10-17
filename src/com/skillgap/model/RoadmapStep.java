package com.skillgap.model;

public class RoadmapStep {
    private int id;
    private int skillId;
    private String skillName;
    private int stepNumber;
    private String phaseTitle;
    private String description;
    private String estimatedDuration;
    private String resourceTitle;
    private String resourceUrl;
    private String resourceType;

    public RoadmapStep() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSkillId() { return skillId; }
    public void setSkillId(int skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }

    public String getPhaseTitle() { return phaseTitle; }
    public void setPhaseTitle(String phaseTitle) { this.phaseTitle = phaseTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceUrl() { return resourceUrl; }
    public void setResourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
}
