package com.skillgap.dao;

import com.skillgap.config.DBConnection;
import com.skillgap.config.SecurityUtil;
import com.skillgap.model.User;

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserDAO {

    private static final Logger LOGGER = Logger.getLogger(UserDAO.class.getName());

    public boolean emailExists(String email) {
        String sql = "SELECT id FROM users WHERE LOWER(email) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error checking email existence: " + email, e);
            return false;
        }
    }

    public User registerUser(String fullName, String email, String plainPassword, Integer targetRoleId, String experienceLevel) {
        String sql = "INSERT INTO users (full_name, email, password_hash, target_role_id, experience_level) VALUES (?, ?, ?, ?, ?)";
        String hash = SecurityUtil.hashPassword(plainPassword);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, fullName);
            ps.setString(2, email.trim().toLowerCase());
            ps.setString(3, hash);
            if (targetRoleId != null && targetRoleId > 0) {
                ps.setInt(4, targetRoleId);
            } else {
                ps.setNull(4, Types.INTEGER);
            }
            ps.setString(5, (experienceLevel != null && !experienceLevel.isEmpty()) ? experienceLevel : "Beginner");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        int id = rs.getInt(1);
                        return getUserById(id);
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error registering user: " + email, e);
        }
        return null;
    }

    public User loginUser(String email, String plainPassword) {
        String sql = "SELECT u.id, u.full_name, u.email, u.password_hash, u.target_role_id, u.experience_level, u.created_at, r.title AS target_role_title " +
                     "FROM users u " +
                     "LEFT JOIN job_roles r ON u.target_role_id = r.id " +
                     "WHERE LOWER(u.email) = LOWER(?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password_hash");
                    if (SecurityUtil.verifyPassword(plainPassword, storedHash)) {
                        User user = new User();
                        user.setId(rs.getInt("id"));
                        user.setFullName(rs.getString("full_name"));
                        user.setEmail(rs.getString("email"));
                        int targetRoleId = rs.getInt("target_role_id");
                        user.setTargetRoleId(rs.wasNull() ? null : targetRoleId);
                        user.setTargetRoleTitle(rs.getString("target_role_title"));
                        user.setExperienceLevel(rs.getString("experience_level"));
                        user.setCreatedAt(rs.getTimestamp("created_at"));
                        return user;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error logging in user: " + email, e);
        }
        return null;
    }

    public User getUserById(int userId) {
        String sql = "SELECT u.id, u.full_name, u.email, u.target_role_id, u.experience_level, u.created_at, r.title AS target_role_title " +
                     "FROM users u " +
                     "LEFT JOIN job_roles r ON u.target_role_id = r.id " +
                     "WHERE u.id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setFullName(rs.getString("full_name"));
                    user.setEmail(rs.getString("email"));
                    int targetRoleId = rs.getInt("target_role_id");
                    user.setTargetRoleId(rs.wasNull() ? null : targetRoleId);
                    user.setTargetRoleTitle(rs.getString("target_role_title"));
                    user.setExperienceLevel(rs.getString("experience_level"));
                    user.setCreatedAt(rs.getTimestamp("created_at"));
                    return user;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching user by id: " + userId, e);
        }
        return null;
    }

    public boolean updateTargetRole(int userId, int targetRoleId) {
        String sql = "UPDATE users SET target_role_id = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, targetRoleId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating target role for user: " + userId, e);
            return false;
        }
    }

    public boolean updateProfile(int userId, String fullName, String experienceLevel) {
        String sql = "UPDATE users SET full_name = ?, experience_level = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, fullName);
            ps.setString(2, experienceLevel);
            ps.setInt(3, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating profile for user: " + userId, e);
            return false;
        }
    }
}
