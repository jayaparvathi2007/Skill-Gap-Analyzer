package com.skillgap.servlet;

import com.skillgap.dao.JobRoleDAO;
import com.skillgap.dao.UserDAO;
import com.skillgap.model.JobRole;
import com.skillgap.model.SkillGapResult;
import com.skillgap.model.User;
import com.skillgap.service.SkillAnalyzerService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/analyze/*")
public class AnalyzeServlet extends BaseServlet {

    private final SkillAnalyzerService analyzerService = new SkillAnalyzerService();
    private final JobRoleDAO jobRoleDAO = new JobRoleDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to perform skill gap analysis.");
            return;
        }

        // Determine target role ID: query param > user's saved target role > default (1)
        int targetRoleId = -1;
        String roleParam = req.getParameter("roleId");
        if (roleParam != null && !roleParam.trim().isEmpty()) {
            try {
                targetRoleId = Integer.parseInt(roleParam.trim());
            } catch (NumberFormatException ignored) {}
        }

        if (targetRoleId <= 0 && user.getTargetRoleId() != null && user.getTargetRoleId() > 0) {
            targetRoleId = user.getTargetRoleId();
        }

        if (targetRoleId <= 0) {
            targetRoleId = 1; // Default to Full Stack Java Developer
        }

        SkillGapResult result = analyzerService.analyzeGap(user.getId(), targetRoleId);
        if (result == null) {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Target job role not found.");
            return;
        }

        sendSuccess(resp, "Skill gap analysis completed successfully", result);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to set target role.");
            return;
        }

        Map<?, ?> body = readJsonBody(req, Map.class);
        Integer roleId = (body != null) ? parseIntSafe(body.get("roleId")) : parseIntSafe(req.getParameter("roleId"));

        if (roleId == null || roleId <= 0) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Valid roleId is required.");
            return;
        }

        JobRole role = jobRoleDAO.getRoleById(roleId);
        if (role == null) {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Job role not found.");
            return;
        }

        boolean updated = userDAO.updateTargetRole(user.getId(), roleId);
        if (updated) {
            user.setTargetRoleId(roleId);
            user.setTargetRoleTitle(role.getTitle());
            req.getSession().setAttribute(SESSION_USER_KEY, user);
            sendSuccess(resp, "Target role updated to: " + role.getTitle(), role);
        } else {
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update target role.");
        }
    }
}
