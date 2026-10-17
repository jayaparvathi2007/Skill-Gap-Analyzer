package com.skillgap.servlet;

import com.skillgap.dao.JobRoleDAO;
import com.skillgap.dao.ProgressDAO;
import com.skillgap.dao.SkillDAO;
import com.skillgap.dao.UserDAO;
import com.skillgap.model.*;
import com.skillgap.service.SkillAnalyzerService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/dashboard")
public class DashboardServlet extends BaseServlet {

    private final UserDAO userDAO = new UserDAO();
    private final JobRoleDAO jobRoleDAO = new JobRoleDAO();
    private final SkillDAO skillDAO = new SkillDAO();
    private final ProgressDAO progressDAO = new ProgressDAO();
    private final SkillAnalyzerService analyzerService = new SkillAnalyzerService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Authentication required to access dashboard.");
            return;
        }

        // Fresh user details
        User freshUser = userDAO.getUserById(user.getId());
        if (freshUser != null) {
            user = freshUser;
            req.getSession().setAttribute(SESSION_USER_KEY, freshUser);
        }

        List<UserSkill> userSkills = skillDAO.getUserSkills(user.getId());
        List<LearningProgress> learningItems = progressDAO.getUserLearningProgress(user.getId());

        // Count category distribution
        Map<String, Integer> categoryDistribution = new HashMap<>();
        for (UserSkill us : userSkills) {
            String cat = us.getSkillCategory() != null ? us.getSkillCategory() : "Other";
            categoryDistribution.put(cat, categoryDistribution.getOrDefault(cat, 0) + 1);
        }

        // Learning stats
        int inProgressCount = 0;
        int completedLearningCount = 0;
        int totalLearningPercent = 0;
        for (LearningProgress lp : learningItems) {
            if ("In Progress".equalsIgnoreCase(lp.getStatus())) {
                inProgressCount++;
            } else if ("Completed".equalsIgnoreCase(lp.getStatus())) {
                completedLearningCount++;
            }
            totalLearningPercent += lp.getProgressPercent();
        }
        int avgLearningProgress = (!learningItems.isEmpty()) ? Math.round((float) totalLearningPercent / learningItems.size()) : 0;

        // Gap analysis on target role (default to role 1 if none selected)
        int targetRoleId = (user.getTargetRoleId() != null && user.getTargetRoleId() > 0) ? user.getTargetRoleId() : 1;
        SkillGapResult gapResult = analyzerService.analyzeGap(user.getId(), targetRoleId);

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("user", user);
        dashboardData.put("totalUserSkills", userSkills.size());
        dashboardData.put("userSkills", userSkills);
        dashboardData.put("learningItems", learningItems);
        dashboardData.put("inProgressCount", inProgressCount);
        dashboardData.put("completedLearningCount", completedLearningCount);
        dashboardData.put("avgLearningProgress", avgLearningProgress);
        dashboardData.put("categoryDistribution", categoryDistribution);
        dashboardData.put("gapAnalysis", gapResult);

        sendSuccess(resp, "Dashboard data loaded successfully", dashboardData);
    }
}
