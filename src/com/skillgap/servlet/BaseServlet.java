package com.skillgap.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.skillgap.model.User;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseServlet extends HttpServlet {

    protected static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .serializeNulls()
            .create();

    public static final String SESSION_USER_KEY = "LOGGED_IN_USER";

    protected User getAuthenticatedUser(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) {
            Object obj = session.getAttribute(SESSION_USER_KEY);
            if (obj instanceof User) {
                return (User) obj;
            }
        }
        return null;
    }

    protected void sendJsonResponse(HttpServletResponse resp, int status, Object data) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.write(GSON.toJson(data));
        out.flush();
    }

    protected void sendSuccess(HttpServletResponse resp, String message) throws IOException {
        Map<String, Object> map = new HashMap<>();
        map.put("success", true);
        map.put("message", message);
        sendJsonResponse(resp, HttpServletResponse.SC_OK, map);
    }

    protected void sendSuccess(HttpServletResponse resp, String message, Object data) throws IOException {
        Map<String, Object> map = new HashMap<>();
        map.put("success", true);
        map.put("message", message);
        map.put("data", data);
        sendJsonResponse(resp, HttpServletResponse.SC_OK, map);
    }

    protected void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("message", message);
        sendJsonResponse(resp, status, map);
    }

    protected Integer parseIntSafe(Object val) {
        if (val == null) return null;
        try {
            return (int) Math.round(Double.parseDouble(val.toString().trim()));
        } catch (Exception e) {
            return null;
        }
    }

    protected double parseDoubleSafe(Object val, double defaultVal) {
        if (val == null) return defaultVal;
        try {
            return Double.parseDouble(val.toString().trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    protected <T> T readJsonBody(HttpServletRequest req, Class<T> clazz) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        String body = sb.toString();
        if (body.trim().isEmpty()) {
            return null;
        }
        return GSON.fromJson(body, clazz);
    }
}
