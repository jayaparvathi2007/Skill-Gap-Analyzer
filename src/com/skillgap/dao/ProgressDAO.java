package com.skillgap.dao;

import com.skillgap.config.DBConnection;
import com.skillgap.model.LearningProgress;
import com.skillgap.model.RoadmapStep;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ProgressDAO {

    private static final Logger LOGGER = Logger.getLogger(ProgressDAO.class.getName());

    public List<LearningProgress> getUserLearningProgress(int userId) {
        List<LearningProgress> list = new ArrayList<>();
        String sql = "SELECT ulp.id, ulp.user_id, ulp.skill_id, ulp.status, ulp.progress_percent, " +
                     "ulp.target_completion_date, ulp.notes, ulp.updated_at, " +
                     "s.name AS skill_name, s.category AS skill_category " +
                     "FROM user_learning_progress ulp " +
                     "JOIN skills s ON ulp.skill_id = s.id " +
                     "WHERE ulp.user_id = ? " +
                     "ORDER BY ulp.status DESC, ulp.progress_percent DESC, s.name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    LearningProgress p = new LearningProgress();
                    p.setId(rs.getInt("id"));
                    p.setUserId(rs.getInt("user_id"));
                    p.setSkillId(rs.getInt("skill_id"));
                    p.setStatus(rs.getString("status"));
                    p.setProgressPercent(rs.getInt("progress_percent"));
                    p.setTargetCompletionDate(rs.getDate("target_completion_date"));
                    p.setNotes(rs.getString("notes"));
                    p.setUpdatedAt(rs.getTimestamp("updated_at"));
                    p.setSkillName(rs.getString("skill_name"));
                    p.setSkillCategory(rs.getString("skill_category"));
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching learning progress for user: " + userId, e);
        }
        return list;
    }

    public List<RoadmapStep> getSkillRoadmap(int skillId) {
        List<RoadmapStep> list = new ArrayList<>();
        String sql = "SELECT lr.id, lr.skill_id, lr.step_number, lr.phase_title, lr.description, " +
                     "lr.estimated_duration, lr.resource_title, lr.resource_url, lr.resource_type, " +
                     "s.name AS skill_name " +
                     "FROM learning_roadmaps lr " +
                     "JOIN skills s ON lr.skill_id = s.id " +
                     "WHERE lr.skill_id = ? " +
                     "ORDER BY lr.step_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, skillId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    RoadmapStep step = new RoadmapStep();
                    step.setId(rs.getInt("id"));
                    step.setSkillId(rs.getInt("skill_id"));
                    step.setSkillName(rs.getString("skill_name"));
                    step.setStepNumber(rs.getInt("step_number"));
                    step.setPhaseTitle(rs.getString("phase_title"));
                    step.setDescription(rs.getString("description"));
                    step.setEstimatedDuration(rs.getString("estimated_duration"));
                    step.setResourceTitle(rs.getString("resource_title"));
                    step.setResourceUrl(rs.getString("resource_url"));
                    step.setResourceType(rs.getString("resource_type"));
                    list.add(step);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching roadmap for skill: " + skillId, e);
        }
        return list;
    }

    public List<RoadmapStep> getRoadmapForSkills(List<Integer> skillIds) {
        List<RoadmapStep> list = new ArrayList<>();
        if (skillIds == null || skillIds.isEmpty()) return list;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < skillIds.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("?");
        }

        String sql = "SELECT lr.id, lr.skill_id, lr.step_number, lr.phase_title, lr.description, " +
                     "lr.estimated_duration, lr.resource_title, lr.resource_url, lr.resource_type, " +
                     "s.name AS skill_name " +
                     "FROM learning_roadmaps lr " +
                     "JOIN skills s ON lr.skill_id = s.id " +
                     "WHERE lr.skill_id IN (" + sb.toString() + ") " +
                     "ORDER BY lr.skill_id ASC, lr.step_number ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < skillIds.size(); i++) {
                ps.setInt(i + 1, skillIds.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    RoadmapStep step = new RoadmapStep();
                    step.setId(rs.getInt("id"));
                    step.setSkillId(rs.getInt("skill_id"));
                    step.setSkillName(rs.getString("skill_name"));
                    step.setStepNumber(rs.getInt("step_number"));
                    step.setPhaseTitle(rs.getString("phase_title"));
                    step.setDescription(rs.getString("description"));
                    step.setEstimatedDuration(rs.getString("estimated_duration"));
                    step.setResourceTitle(rs.getString("resource_title"));
                    step.setResourceUrl(rs.getString("resource_url"));
                    step.setResourceType(rs.getString("resource_type"));
                    list.add(step);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching roadmaps for skills list", e);
        }
        return list;
    }

    public boolean enrollOrUpdateProgress(int userId, int skillId, String status, int progressPercent, String notes) {
        String sql = "INSERT INTO user_learning_progress (user_id, skill_id, status, progress_percent, notes) " +
                     "VALUES (?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE status = VALUES(status), progress_percent = VALUES(progress_percent), " +
                     "notes = COALESCE(VALUES(notes), notes)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, skillId);
            ps.setString(3, (status != null && !status.isEmpty()) ? status : "In Progress");
            ps.setInt(4, Math.max(0, Math.min(100, progressPercent)));
            ps.setString(5, notes);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating learning progress: user=" + userId + ", skill=" + skillId, e);
            return false;
        }
    }

    public boolean completeAndPromoteToSkill(int userId, int skillId) {
        // Mark progress as Completed & 100%
        boolean updatedProgress = enrollOrUpdateProgress(userId, skillId, "Completed", 100, "Completed learning roadmap!");
        // Add to user skills table
        SkillDAO skillDAO = new SkillDAO();
        boolean addedSkill = skillDAO.addUserSkill(userId, skillId, "Intermediate", 1.0);
        return updatedProgress && addedSkill;
    }

    public boolean deleteProgress(int userId, int skillId) {
        String sql = "DELETE FROM user_learning_progress WHERE user_id = ? AND skill_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, skillId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting learning progress: user=" + userId + ", skill=" + skillId, e);
            return false;
        }
    }
}
