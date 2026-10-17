package com.skillgap.servlet;

import com.skillgap.dao.JobRoleDAO;
import com.skillgap.dao.UserDAO;
import com.skillgap.model.JobRole;
import com.skillgap.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthServlet extends BaseServlet {

    private final UserDAO userDAO = new UserDAO();
    private final JobRoleDAO jobRoleDAO = new JobRoleDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("/me")) {
            handleGetCurrentUser(req, resp);
        } else {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Auth endpoint not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "";

        switch (pathInfo) {
            case "/login":
                handleLogin(req, resp);
                break;
            case "/register":
                handleRegister(req, resp);
                break;
            case "/logout":
                handleLogout(req, resp);
                break;
            default:
                sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Unknown auth action: " + pathInfo);
                break;
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<?, ?> body = readJsonBody(req, Map.class);
        String email = body != null && body.get("email") != null ? body.get("email").toString().trim() : req.getParameter("email");
        String password = body != null && body.get("password") != null ? body.get("password").toString() : req.getParameter("password");

        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Email and password are required.");
            return;
        }

        User user = userDAO.loginUser(email, password);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Invalid email or password.");
            return;
        }

        HttpSession session = req.getSession(true);
        session.setAttribute(SESSION_USER_KEY, user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("targetRoleId", user.getTargetRoleId());
        userData.put("targetRoleTitle", user.getTargetRoleTitle());
        userData.put("experienceLevel", user.getExperienceLevel());

        sendSuccess(resp, "Login successful! Welcome back, " + user.getFullName(), userData);
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<?, ?> body = readJsonBody(req, Map.class);

        String fullName = body != null && body.get("fullName") != null ? body.get("fullName").toString().trim() : req.getParameter("fullName");
        String email = body != null && body.get("email") != null ? body.get("email").toString().trim() : req.getParameter("email");
        String password = body != null && body.get("password") != null ? body.get("password").toString() : req.getParameter("password");
        
        Integer targetRoleId = (body != null) ? parseIntSafe(body.get("targetRoleId")) : parseIntSafe(req.getParameter("targetRoleId"));

        String experienceLevel = body != null && body.get("experienceLevel") != null ? body.get("experienceLevel").toString() : req.getParameter("experienceLevel");

        if (fullName == null || fullName.isEmpty() || email == null || email.isEmpty() || password == null || password.length() < 4) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Please provide valid registration details. Password must be at least 4 characters.");
            return;
        }

        if (userDAO.emailExists(email)) {
            sendError(resp, HttpServletResponse.SC_CONFLICT, "An account with this email address already exists. Please log in.");
            return;
        }

        User newUser = userDAO.registerUser(fullName, email, password, targetRoleId, experienceLevel);
        if (newUser == null) {
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Registration failed due to a database error. Please try again.");
            return;
        }

        HttpSession session = req.getSession(true);
        session.setAttribute(SESSION_USER_KEY, newUser);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", newUser.getId());
        userData.put("fullName", newUser.getFullName());
        userData.put("email", newUser.getEmail());
        userData.put("targetRoleId", newUser.getTargetRoleId());
        userData.put("targetRoleTitle", newUser.getTargetRoleTitle());
        userData.put("experienceLevel", newUser.getExperienceLevel());

        sendSuccess(resp, "Account created successfully! Welcome, " + newUser.getFullName(), userData);
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        sendSuccess(resp, "You have been logged out successfully.");
    }

    private void handleGetCurrentUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
            return;
        }

        // Fetch fresh copy from DB to reflect any target role or profile changes
        User freshUser = userDAO.getUserById(user.getId());
        if (freshUser != null) {
            req.getSession().setAttribute(SESSION_USER_KEY, freshUser);
            user = freshUser;
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("targetRoleId", user.getTargetRoleId());
        userData.put("targetRoleTitle", user.getTargetRoleTitle());
        userData.put("experienceLevel", user.getExperienceLevel());
        userData.put("createdAt", user.getCreatedAt());

        sendSuccess(resp, "Authenticated user retrieved", userData);
    }
}
