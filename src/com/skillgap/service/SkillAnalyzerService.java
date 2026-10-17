package com.skillgap.service;

import com.skillgap.dao.JobRoleDAO;
import com.skillgap.dao.ProgressDAO;
import com.skillgap.dao.SkillDAO;
import com.skillgap.model.*;

import java.util.*;

public class SkillAnalyzerService {

    private final JobRoleDAO jobRoleDAO;
    private final SkillDAO skillDAO;
    private final ProgressDAO progressDAO;

    public SkillAnalyzerService() {
        this.jobRoleDAO = new JobRoleDAO();
        this.skillDAO = new SkillDAO();
        this.progressDAO = new ProgressDAO();
    }

    public SkillAnalyzerService(JobRoleDAO jobRoleDAO, SkillDAO skillDAO, ProgressDAO progressDAO) {
        this.jobRoleDAO = jobRoleDAO;
        this.skillDAO = skillDAO;
        this.progressDAO = progressDAO;
    }

    /**
     * Compare existing user skills with target job role requirements.
     */
    public SkillGapResult analyzeGap(int userId, int targetRoleId) {
        SkillGapResult result = new SkillGapResult();

        // 1. Fetch Target Role
        JobRole role = jobRoleDAO.getRoleById(targetRoleId);
        if (role == null) {
            return null;
        }

        result.setRoleId(role.getId());
        result.setRoleTitle(role.getTitle());
        result.setDepartment(role.getDepartment());
        result.setAvgSalary(role.getAvgSalary());
        result.setDemandLevel(role.getDemandLevel());
        result.setRoleDescription(role.getDescription());

        // 2. Fetch required skills and user skills
        List<RoleSkill> requiredSkills = jobRoleDAO.getRoleSkills(targetRoleId);
        List<UserSkill> userSkills = skillDAO.getUserSkills(userId);

        Map<Integer, UserSkill> userSkillMap = new HashMap<>();
        for (UserSkill us : userSkills) {
            userSkillMap.put(us.getSkillId(), us);
        }

        Set<Integer> requiredSkillIds = new HashSet<>();
        double totalPossibleScore = 0.0;
        double userEarnedScore = 0.0;

        List<SkillGapResult.MatchedSkillDetail> matchedList = new ArrayList<>();
        List<RoleSkill> missingList = new ArrayList<>();
        List<Integer> missingSkillIds = new ArrayList<>();

        // 3. Process Required Role Skills
        for (RoleSkill rs : requiredSkills) {
            requiredSkillIds.add(rs.getSkillId());
            int weight = rs.getWeight() > 0 ? rs.getWeight() : 2;
            totalPossibleScore += weight;

            if (userSkillMap.containsKey(rs.getSkillId())) {
                UserSkill us = userSkillMap.get(rs.getSkillId());
                boolean meetsReq = checkProficiencyMeets(us.getProficiencyLevel(), rs.getMinProficiency());
                
                double proficiencyFactor = getProficiencyFactor(us.getProficiencyLevel());
                userEarnedScore += (weight * proficiencyFactor);

                matchedList.add(new SkillGapResult.MatchedSkillDetail(
                    rs.getSkillId(),
                    rs.getSkillName(),
                    rs.getSkillCategory(),
                    us.getProficiencyLevel(),
                    rs.getMinProficiency(),
                    rs.getImportance(),
                    meetsReq
                ));
            } else {
                missingList.add(rs);
                missingSkillIds.add(rs.getSkillId());
            }
        }

        // 4. Identify Transferable / Extra Skills
        List<UserSkill> transferableList = new ArrayList<>();
        for (UserSkill us : userSkills) {
            if (!requiredSkillIds.contains(us.getSkillId())) {
                transferableList.add(us);
            }
        }

        // 5. Calculate Metrics
        int totalRequired = requiredSkills.size();
        int matchedCount = matchedList.size();
        int missingCount = missingList.size();

        int directPercent = (totalRequired > 0) ? (int) Math.round(((double) matchedCount / totalRequired) * 100) : 0;
        int weightedPercent = (totalPossibleScore > 0) ? (int) Math.round((userEarnedScore / totalPossibleScore) * 100) : 0;
        
        // Ensure within 0 - 100 bounds
        directPercent = Math.min(100, Math.max(0, directPercent));
        weightedPercent = Math.min(100, Math.max(0, weightedPercent));

        result.setTotalRequiredSkills(totalRequired);
        result.setMatchedSkillsCount(matchedCount);
        result.setMissingSkillsCount(missingCount);
        result.setTransferableSkillsCount(transferableList.size());
        result.setMatchPercentage(directPercent);
        result.setWeightedPercentage(weightedPercent);
        result.setMatchedSkills(matchedList);
        result.setMissingSkills(missingList);
        result.setTransferableSkills(transferableList);

        // 6. Compute Readiness Level & Advice
        computeReadiness(result, weightedPercent, directPercent, missingCount);

        // 7. Fetch Roadmap for Missing Skills
        if (!missingSkillIds.isEmpty()) {
            List<RoadmapStep> roadmapSteps = progressDAO.getRoadmapForSkills(missingSkillIds);
            result.setRecommendedRoadmap(roadmapSteps);
        }

        return result;
    }

    private void computeReadiness(SkillGapResult result, int weightedPercent, int directPercent, int missingCount) {
        int score = (weightedPercent + directPercent) / 2;

        if (score >= 85) {
            result.setReadinessLevel("Job Ready 🚀");
            result.setReadinessBadgeColor("success");
            result.setReadinessAdvice("Outstanding match! You possess the primary technical competencies required for this position. Focus on portfolio showcase and behavioral interviews.");
            result.setEstimatedWeeksToClose(Math.max(1, missingCount * 1));
        } else if (score >= 65) {
            result.setReadinessLevel("Interview Ready with Minor Gaps ⚡");
            result.setReadinessBadgeColor("info");
            result.setReadinessAdvice("Strong match! You have an excellent base. Mastering the few missing high-priority skills will position you at the top of candidate pools.");
            result.setEstimatedWeeksToClose(Math.max(2, missingCount * 2));
        } else if (score >= 40) {
            result.setReadinessLevel("Intermediate Learner 📈");
            result.setReadinessBadgeColor("warning");
            result.setReadinessAdvice("Solid starting foundation. Follow the curated roadmap steps below to systematically close mandatory skill gaps.");
            result.setEstimatedWeeksToClose(Math.max(4, missingCount * 2));
        } else {
            result.setReadinessLevel("Foundation Builder 🎯");
            result.setReadinessBadgeColor("danger");
            result.setReadinessAdvice("Early learning phase for this career path. Start with Phase 1 fundamentals in the recommended roadmap.");
            result.setEstimatedWeeksToClose(Math.max(6, missingCount * 3));
        }
    }

    private boolean checkProficiencyMeets(String userLevel, String requiredLevel) {
        int userScore = getProficiencyValue(userLevel);
        int reqScore = getProficiencyValue(requiredLevel);
        return userScore >= reqScore;
    }

    private int getProficiencyValue(String level) {
        if (level == null) return 1;
        switch (level.toLowerCase().trim()) {
            case "advanced": return 3;
            case "intermediate": return 2;
            case "beginner":
            default: return 1;
        }
    }

    private double getProficiencyFactor(String level) {
        if (level == null) return 0.70;
        switch (level.toLowerCase().trim()) {
            case "advanced": return 1.0;
            case "intermediate": return 0.88;
            case "beginner":
            default: return 0.70;
        }
    }
}
