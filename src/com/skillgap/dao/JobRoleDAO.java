package com.skillgap.dao;

import com.skillgap.config.DBConnection;
import com.skillgap.model.JobRole;
import com.skillgap.model.RoleSkill;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class JobRoleDAO {

    private static final Logger LOGGER = Logger.getLogger(JobRoleDAO.class.getName());

    public List<JobRole> getAllRoles() {
        List<JobRole> list = new ArrayList<>();
        String sql = "SELECT r.id, r.title, r.department, r.description, r.avg_salary, r.demand_level, r.icon, " +
                     "COUNT(rs.id) AS required_skills_count " +
                     "FROM job_roles r " +
                     "LEFT JOIN role_skills rs ON r.id = rs.role_id " +
                     "GROUP BY r.id, r.title, r.department, r.description, r.avg_salary, r.demand_level, r.icon " +
                     "ORDER BY r.title ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                JobRole role = new JobRole(
                    rs.getInt("id"),
                    rs.getString("title"),
                    rs.getString("department"),
                    rs.getString("description"),
                    rs.getString("avg_salary"),
                    rs.getString("demand_level"),
                    rs.getString("icon")
                );
                role.setRequiredSkillsCount(rs.getInt("required_skills_count"));
                list.add(role);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all job roles", e);
        }
        return list;
    }

    public JobRole getRoleById(int roleId) {
        String sql = "SELECT id, title, department, description, avg_salary, demand_level, icon FROM job_roles WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    JobRole role = new JobRole(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("department"),
                        rs.getString("description"),
                        rs.getString("avg_salary"),
                        rs.getString("demand_level"),
                        rs.getString("icon")
                    );
                    role.setRequiredSkills(getRoleSkills(roleId));
                    role.setRequiredSkillsCount(role.getRequiredSkills().size());
                    return role;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching job role by id: " + roleId, e);
        }
        return null;
    }

    public List<RoleSkill> getRoleSkills(int roleId) {
        List<RoleSkill> list = new ArrayList<>();
        String sql = "SELECT rs.id, rs.role_id, rs.skill_id, rs.importance, rs.weight, rs.min_proficiency, " +
                     "s.name AS skill_name, s.category AS skill_category, s.description AS skill_description " +
                     "FROM role_skills rs " +
                     "JOIN skills s ON rs.skill_id = s.id " +
                     "WHERE rs.role_id = ? " +
                     "ORDER BY rs.weight DESC, s.name ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    RoleSkill item = new RoleSkill();
                    item.setId(rs.getInt("id"));
                    item.setRoleId(rs.getInt("role_id"));
                    item.setSkillId(rs.getInt("skill_id"));
                    item.setSkillName(rs.getString("skill_name"));
                    item.setSkillCategory(rs.getString("skill_category"));
                    item.setImportance(rs.getString("importance"));
                    item.setWeight(rs.getInt("weight"));
                    item.setMinProficiency(rs.getString("min_proficiency"));
                    item.setSkillDescription(rs.getString("skill_description"));
                    list.add(item);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching skills for role: " + roleId, e);
        }
        return list;
    }
}
