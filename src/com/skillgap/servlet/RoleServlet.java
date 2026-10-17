package com.skillgap.servlet;

import com.skillgap.dao.JobRoleDAO;
import com.skillgap.model.JobRole;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/roles/*")
public class RoleServlet extends BaseServlet {

    private final JobRoleDAO jobRoleDAO = new JobRoleDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String idParam = req.getParameter("id");

        if (idParam != null && !idParam.isEmpty()) {
            try {
                int roleId = Integer.parseInt(idParam);
                JobRole role = jobRoleDAO.getRoleById(roleId);
                if (role != null) {
                    sendSuccess(resp, "Role retrieved", role);
                } else {
                    sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Job role not found");
                }
                return;
            } catch (NumberFormatException ignored) {}
        }

        if (pathInfo != null && pathInfo.length() > 1) {
            try {
                int roleId = Integer.parseInt(pathInfo.substring(1));
                JobRole role = jobRoleDAO.getRoleById(roleId);
                if (role != null) {
                    sendSuccess(resp, "Role retrieved", role);
                } else {
                    sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Job role not found");
                }
                return;
            } catch (NumberFormatException ignored) {}
        }

        // Return all roles
        List<JobRole> roles = jobRoleDAO.getAllRoles();
        sendSuccess(resp, "Job roles retrieved", roles);
    }
}
