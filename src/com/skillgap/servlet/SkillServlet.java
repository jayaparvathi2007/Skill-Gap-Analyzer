package com.skillgap.servlet;

import com.skillgap.dao.SkillDAO;
import com.skillgap.model.Skill;
import com.skillgap.model.User;
import com.skillgap.model.UserSkill;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/skills/*")
public class SkillServlet extends BaseServlet {

    private final SkillDAO skillDAO = new SkillDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("/catalog")) {
            // Get all skills in system
            List<Skill> allSkills = skillDAO.getAllSkills();
            sendSuccess(resp, "Skills catalog retrieved", allSkills);
        } else if (pathInfo.equals("/user")) {
            User user = getAuthenticatedUser(req);
            if (user == null) {
                sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to view your skills.");
                return;
            }
            List<UserSkill> userSkills = skillDAO.getUserSkills(user.getId());
            sendSuccess(resp, "User skills retrieved", userSkills);
        } else {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Skill endpoint not found: " + pathInfo);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to manage skills.");
            return;
        }

        Map<?, ?> body = readJsonBody(req, Map.class);
        String action = req.getParameter("action");
        if (body != null && body.containsKey("action")) {
            action = body.get("action").toString();
        }

        // Support adding via skillId or custom name
        Integer skillId = (body != null) ? parseIntSafe(body.get("skillId")) : parseIntSafe(req.getParameter("skillId"));

        String skillName = (body != null && body.get("skillName") != null) ? body.get("skillName").toString().trim() : req.getParameter("skillName");
        String category = (body != null && body.get("category") != null) ? body.get("category").toString().trim() : req.getParameter("category");
        String proficiency = (body != null && body.get("proficiencyLevel") != null) ? body.get("proficiencyLevel").toString().trim() : req.getParameter("proficiencyLevel");
        if (proficiency == null || proficiency.isEmpty()) proficiency = "Intermediate";

        double yearsExp = (body != null) ? parseDoubleSafe(body.get("yearsExperience"), 1.0) : parseDoubleSafe(req.getParameter("yearsExperience"), 1.0);

        boolean success = false;
        if (skillId != null && skillId > 0) {
            success = skillDAO.addUserSkill(user.getId(), skillId, proficiency, yearsExp);
        } else if (skillName != null && !skillName.isEmpty()) {
            success = skillDAO.addCustomUserSkill(user.getId(), skillName, category, proficiency, yearsExp);
        } else {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Either skillId or skillName must be provided.");
            return;
        }

        if (success) {
            List<UserSkill> updatedList = skillDAO.getUserSkills(user.getId());
            sendSuccess(resp, "Skill saved to your profile successfully!", updatedList);
        } else {
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to save skill.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to manage skills.");
            return;
        }

        String skillIdParam = req.getParameter("skillId");
        if (skillIdParam == null || skillIdParam.isEmpty()) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing skillId parameter.");
            return;
        }

        try {
            int skillId = Integer.parseInt(skillIdParam);
            boolean deleted = skillDAO.deleteUserSkill(user.getId(), skillId);
            if (deleted) {
                sendSuccess(resp, "Skill removed from your profile.");
            } else {
                sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Skill not found in your profile.");
            }
        } catch (NumberFormatException e) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid skillId.");
        }
    }
}
