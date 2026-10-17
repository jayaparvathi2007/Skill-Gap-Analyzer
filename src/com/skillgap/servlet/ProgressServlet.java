package com.skillgap.servlet;

import com.skillgap.dao.ProgressDAO;
import com.skillgap.model.LearningProgress;
import com.skillgap.model.RoadmapStep;
import com.skillgap.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/progress/*")
public class ProgressServlet extends BaseServlet {

    private final ProgressDAO progressDAO = new ProgressDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to view learning progress.");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.equals("/roadmap")) {
            String skillIdParam = req.getParameter("skillId");
            if (skillIdParam != null) {
                try {
                    int skillId = Integer.parseInt(skillIdParam);
                    List<RoadmapStep> roadmap = progressDAO.getSkillRoadmap(skillId);
                    sendSuccess(resp, "Roadmap retrieved", roadmap);
                    return;
                } catch (NumberFormatException ignored) {}
            }
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Valid skillId required for roadmap.");
            return;
        }

        // Default: return user's learning progress list
        List<LearningProgress> list = progressDAO.getUserLearningProgress(user.getId());
        sendSuccess(resp, "Learning progress retrieved", list);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to manage learning progress.");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "";

        Map<?, ?> body = readJsonBody(req, Map.class);
        Integer skillId = (body != null) ? parseIntSafe(body.get("skillId")) : parseIntSafe(req.getParameter("skillId"));

        if (skillId == null || skillId <= 0) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Valid skillId is required.");
            return;
        }

        if (pathInfo.equals("/complete")) {
            // Mark complete and promote to user skills
            boolean success = progressDAO.completeAndPromoteToSkill(user.getId(), skillId);
            if (success) {
                sendSuccess(resp, "Congratulations! Skill marked as completed and added to your profile! Your job match score has increased.");
            } else {
                sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to complete skill.");
            }
            return;
        }

        // Enroll or update progress
        String status = (body != null && body.get("status") != null) ? body.get("status").toString() : req.getParameter("status");
        if (status == null || status.isEmpty()) status = "In Progress";

        Integer parsedPercent = (body != null) ? parseIntSafe(body.get("progressPercent")) : parseIntSafe(req.getParameter("progressPercent"));
        int percent = (parsedPercent != null) ? parsedPercent : 0;

        String notes = (body != null && body.get("notes") != null) ? body.get("notes").toString() : req.getParameter("notes");

        boolean success = progressDAO.enrollOrUpdateProgress(user.getId(), skillId, status, percent, notes);
        if (success) {
            sendSuccess(resp, "Learning tracker updated successfully!");
        } else {
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update learning tracker.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in.");
            return;
        }

        String skillIdParam = req.getParameter("skillId");
        if (skillIdParam == null || skillIdParam.isEmpty()) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing skillId parameter.");
            return;
        }

        try {
            int skillId = Integer.parseInt(skillIdParam);
            boolean deleted = progressDAO.deleteProgress(user.getId(), skillId);
            if (deleted) {
                sendSuccess(resp, "Removed from learning tracker.");
            } else {
                sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Item not found in your tracker.");
            }
        } catch (NumberFormatException e) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid skillId.");
        }
    }
}
