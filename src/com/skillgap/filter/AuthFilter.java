package com.skillgap.filter;

import com.skillgap.model.User;
import com.skillgap.servlet.BaseServlet;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@WebFilter("/*")
public class AuthFilter implements Filter {

    private static final Set<String> PROTECTED_PAGES = new HashSet<>(Arrays.asList(
            "/dashboard.html",
            "/my-skills.html",
            "/analyze.html",
            "/roadmap.html"
    ));

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String path = req.getServletPath();
        if (path == null || path.isEmpty()) {
            path = req.getRequestURI();
        }

        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute(BaseServlet.SESSION_USER_KEY) : null;
        boolean loggedIn = (user != null);

        // 1. If accessing protected HTML pages without being logged in -> redirect to login.html
        if (PROTECTED_PAGES.contains(path)) {
            if (!loggedIn) {
                resp.sendRedirect("login.html?redirect=" + path.substring(1));
                return;
            }
        }

        // 2. If logged in and visiting login.html or register.html -> redirect to dashboard.html
        if (loggedIn && (path.equals("/login.html") || path.equals("/register.html"))) {
            resp.sendRedirect("dashboard.html");
            return;
        }

        // 3. Protected API check
        if (path.startsWith("/api/")) {
            String fullUri = req.getRequestURI() != null ? req.getRequestURI() : "";
            boolean isPublicAuth = path.startsWith("/api/auth") || fullUri.startsWith("/api/auth");
            boolean isPublicCatalog = path.equals("/api/skills") || fullUri.equals("/api/skills") || path.startsWith("/api/roles") || fullUri.startsWith("/api/roles");

            if (!isPublicAuth && !isPublicCatalog && !loggedIn) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.setContentType("application/json;charset=UTF-8");
                resp.getWriter().write("{\"success\":false,\"message\":\"Session expired or authentication required.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
