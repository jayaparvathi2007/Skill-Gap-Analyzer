package com.skillgap.dao;

import com.skillgap.config.DBConnection;
import com.skillgap.model.Skill;
import com.skillgap.model.UserSkill;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SkillDAO {

    private static final Logger LOGGER = Logger.getLogger(SkillDAO.class.getName());

    public List<Skill> getAllSkills() {
        List<Skill> list = new ArrayList<>();
        String sql = "SELECT id, name, category, difficulty, description FROM skills ORDER BY category ASC, name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(new Skill(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("category"),
                    rs.getString("difficulty"),
                    rs.getString("description")
                ));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all skills", e);
        }
        return list;
    }

    public List<UserSkill> getUserSkills(int userId) {
        List<UserSkill> list = new ArrayList<>();
        String sql = "SELECT us.id, us.user_id, us.skill_id, us.proficiency_level, us.years_experience, us.added_at, " +
                     "s.name AS skill_name, s.category AS skill_category " +
                     "FROM user_skills us " +
                     "JOIN skills s ON us.skill_id = s.id " +
                     "WHERE us.user_id = ? " +
                     "ORDER BY s.category ASC, s.name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    UserSkill us = new UserSkill();
                    us.setId(rs.getInt("id"));
                    us.setUserId(rs.getInt("user_id"));
                    us.setSkillId(rs.getInt("skill_id"));
                    us.setSkillName(rs.getString("skill_name"));
                    us.setSkillCategory(rs.getString("skill_category"));
                    us.setProficiencyLevel(rs.getString("proficiency_level"));
                    us.setYearsExperience(rs.getDouble("years_experience"));
                    us.setAddedAt(rs.getTimestamp("added_at"));
                    list.add(us);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching user skills for user: " + userId, e);
        }
        return list;
    }

    public boolean addUserSkill(int userId, int skillId, String proficiency, double yearsExp) {
        String sql = "INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) " +
                     "VALUES (?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE proficiency_level = VALUES(proficiency_level), years_experience = VALUES(years_experience)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, skillId);
            ps.setString(3, proficiency);
            ps.setDouble(4, yearsExp > 0 ? yearsExp : 1.0);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error adding user skill: user=" + userId + ", skill=" + skillId, e);
            return false;
        }
    }

    public boolean addCustomUserSkill(int userId, String skillName, String category, String proficiency, double yearsExp) {
        skillName = skillName.trim();
        if (category == null || category.trim().isEmpty()) {
            category = "General";
        }

        // First find or insert skill in skills table
        int skillId = -1;
        String findSql = "SELECT id FROM skills WHERE LOWER(name) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection()) {
            try (PreparedStatement ps = conn.prepareStatement(findSql)) {
                ps.setString(1, skillName);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        skillId = rs.getInt("id");
                    }
                }
            }

            if (skillId == -1) {
                String insertSkillSql = "INSERT INTO skills (name, category, difficulty, description) VALUES (?, ?, ?, ?)";
                try (PreparedStatement ps = conn.prepareStatement(insertSkillSql, Statement.RETURN_GENERATED_KEYS)) {
                    ps.setString(1, skillName);
                    ps.setString(2, category);
                    ps.setString(3, proficiency);
                    ps.setString(4, "User-added custom skill.");
                    ps.executeUpdate();
                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            skillId = rs.getInt(1);
                        }
                    }
                }
            }

            if (skillId > 0) {
                return addUserSkill(userId, skillId, proficiency, yearsExp);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error adding custom user skill: " + skillName, e);
        }
        return false;
    }

    public boolean deleteUserSkill(int userId, int skillId) {
        String sql = "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, skillId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting user skill: user=" + userId + ", skill=" + skillId, e);
            return false;
        }
    }

    public boolean hasUserSkill(int userId, int skillId) {
        String sql = "SELECT id FROM user_skills WHERE user_id = ? AND skill_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, skillId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error checking user skill: user=" + userId + ", skill=" + skillId, e);
            return false;
        }
    }
}
