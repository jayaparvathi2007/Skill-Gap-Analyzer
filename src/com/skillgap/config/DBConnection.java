package com.skillgap.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Database Connection Manager using JDBC and MySQL.
 */
public class DBConnection {

    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    private static String jdbcUrl = "jdbc:mysql://localhost:3306/skill_gap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static String dbUser = "root";
    private static String dbPass = "Harshi@09";
    private static String driverClass = "com.mysql.cj.jdbc.Driver";

    static {
        loadConfiguration();
        try {
            Class.forName(driverClass);
            LOGGER.info("[+] MySQL JDBC Driver registered successfully: " + driverClass);
        } catch (ClassNotFoundException e) {
            try {
                // Fallback for older driver version
                Class.forName("com.mysql.jdbc.Driver");
                LOGGER.info("[+] MySQL legacy JDBC Driver registered successfully.");
            } catch (ClassNotFoundException ex) {
                LOGGER.log(Level.SEVERE, "[-] MySQL JDBC Driver not found in classpath!", ex);
            }
        }
    }

    private static void loadConfiguration() {
        Properties props = new Properties();
        InputStream is = null;

        try {
            // Check direct file system path first
            File configFile = new File("config/db.properties");
            if (configFile.exists()) {
                is = new FileInputStream(configFile);
            } else {
                File altFile = new File("../config/db.properties");
                if (altFile.exists()) {
                    is = new FileInputStream(altFile);
                } else {
                    // Try classpath
                    is = DBConnection.class.getClassLoader().getResourceAsStream("db.properties");
                }
            }

            if (is != null) {
                props.load(is);
                if (props.getProperty("db.url") != null) jdbcUrl = props.getProperty("db.url");
                if (props.getProperty("db.username") != null) dbUser = props.getProperty("db.username");
                if (props.getProperty("db.password") != null) dbPass = props.getProperty("db.password");
                if (props.getProperty("db.driver") != null) driverClass = props.getProperty("db.driver");
                LOGGER.info("[+] Loaded database configuration from db.properties");
            }
        } catch (Exception e) {
            LOGGER.warning("[!] Warning loading config/db.properties, using default connection settings: " + e.getMessage());
        } finally {
            if (is != null) {
                try { is.close(); } catch (Exception ignored) {}
            }
        }
    }

    /**
     * Get a new JDBC Connection to MySQL.
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcUrl, dbUser, dbPass);
    }

    /**
     * Test if database connectivity is functioning properly.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            LOGGER.severe("[-] Database connection test failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Helper to safely close JDBC resources.
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException ignored) {}
        }
        if (stmt != null) {
            try { stmt.close(); } catch (SQLException ignored) {}
        }
        if (conn != null) {
            try { conn.close(); } catch (SQLException ignored) {}
        }
    }

    public static String getJdbcUrl() { return jdbcUrl; }
    public static String getDbUser() { return dbUser; }
}
