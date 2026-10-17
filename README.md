# ⚡ Skill Gap Analyzer Web Application

A full-stack web application built using **HTML5, CSS3, JavaScript, Core Java, Java Servlets, JDBC, and MySQL**.

The **Skill Gap Analyzer** bridges the gap between a candidate's current technical skill set and target industry job roles. It performs automated skill matching, calculates dynamic job readiness match percentages, pinpoints missing critical competencies, provides customized learning roadmaps with free curated resources, and tracks skill learning progress on an interactive dashboard.

---

## 🌟 Key Features

1. **User Authentication & Session Management**:
   - Secure user registration and login with SHA-256 password hashing.
   - Cookie-based session tracking with `HttpSession` (`JSESSIONID`).
   - Profile management with custom career targets and experience levels (Beginner, Intermediate, Advanced).
   - Pre-seeded demo account (`alex@example.com` / `demo123`) with a 1-click test button.

2. **Skills & Target Role Management**:
   - Select from **8 high-demand industry job roles** (Full Stack Java Developer, Frontend Developer, Data Scientist, DevOps Engineer, Backend Engineer, Cybersecurity Analyst, Mobile Developer, Data Engineer).
   - Select skills from a pre-loaded catalog of **30+ industry skills** or enter custom skills with categories.
   - Specify proficiency levels (*Beginner*, *Intermediate*, *Advanced*) and years of experience.

3. **Intelligent Skill Gap Analysis Engine**:
   - Compares user competencies against required role skills.
   - Calculates **Direct Match Percentage**:
     $$\text{Match \%} = \frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$$
   - Calculates **Weighted Match Percentage** taking skill importance (*Mandatory = 3*, *Recommended = 2*, *Bonus = 1*) and user proficiency levels into account.
   - Provides **Readiness Level Assessments**:
     - $\ge 85\%$: *Job Ready 🚀*
     - $65\% - 84\%$: *Interview Ready with Minor Gaps ⚡*
     - $40\% - 64\%$: *Intermediate Learner 📈*
     - $< 40\%$: *Foundation Builder 🎯*
   - Estimates weeks required to close skill gaps.

4. **Visual Comparison & Breakdown**:
   - **Matched Skills**: Highlights strengths with proficiency comparisons (User Level vs Required Level).
   - **Missing / Gap Skills**: Highlights critical missing skills with priority badges (*Mandatory*, *Recommended*, *Bonus*) and a one-click "+ Add to Learning Plan" button.
   - **Transferable Skills**: Displays complementary skills that enrich candidate versatility.

5. **Personalized Learning Roadmaps**:
   - Phased milestone roadmaps for missing skills.
   - Step numbers, phase titles, estimated durations, descriptions, and direct links to official documentation (Oracle Docs, Spring.io, React.dev, freeCodeCamp, MDN, Docker Docs).

6. **Interactive Learning Progress Dashboard**:
   - Animated SVG Circular Match Score Gauge.
   - Real-time statistics: Match %, Skills Possessed, Missing Skills, and In-Progress Tracker items.
   - Progress update modal with status selector (*Not Started*, *In Progress*, *Completed*), percentage slider (0–100%), and milestone notes.
   - **Auto-Promotion**: Marking a skill as "Completed" automatically adds it to your profile skills, instantly increasing your job readiness match percentage!

7. **Clean, Modern, Responsive UI**:
   - Fluid typography, CSS custom properties, responsive flexbox/grid layout, and subtle shadow cards.
   - Built-in slide-in toast notification system and accessible modal overlays.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | HTML5, CSS3 (Custom Variables, Flexbox/Grid, SVG Gauges), Vanilla JavaScript (ES6+ Fetch API, DOM manipulation) |
| **Backend** | Core Java (JDK 11+), Java Servlets (`javax.servlet` / `jakarta.servlet` compliant), JDBC |
| **Database** | MySQL 8.0+ (InnoDB, Foreign Keys, UTF8MB4, SHA-256 Hashing) |
| **Libraries** | Google Gson 2.10.1 (JSON serialization), MySQL Connector/J 8.0.28, Servlet API 4.0.1 |
| **Server** | Built-in Pure Java Embedded Server **AND** Apache Tomcat compatible (`skillgaper.war` + `web.xml`) |

---

## 📂 Project Directory Structure

```
skillgaper/
├── bin/                             # Compiled Java class files
├── config/
│   └── db.properties                # MySQL connection parameters (URL, user, password)
├── database/
│   └── skill_gap_db.sql             # Complete SQL schema and seed data (8 roles, 30+ skills)
├── lib/                             # Required runtime JARs (Gson, Servlet API, MySQL Connector)
├── src/
│   └── com/skillgap/
│       ├── config/
│       │   ├── DBConnection.java    # JDBC connection manager & config loader
│       │   └── SecurityUtil.java    # SHA-256 password hashing utility
│       ├── model/
│       │   ├── User.java            # User JavaBean
│       │   ├── JobRole.java         # Job role model
│       │   ├── Skill.java           # Skill catalog model
│       │   ├── UserSkill.java       # User skill with proficiency & experience
│       │   ├── RoleSkill.java       # Role prerequisite skill with weights
│       │   ├── RoadmapStep.java     # Curated learning roadmap step
│       │   ├── LearningProgress.java# User learning tracker entry
│       │   └── SkillGapResult.java  # Comprehensive match calculation payload
│       ├── dao/
│       │   ├── UserDAO.java         # User CRUD & authentication queries
│       │   ├── JobRoleDAO.java      # Job roles & required skills queries
│       │   ├── SkillDAO.java        # User skills & catalog queries
│       │   └── ProgressDAO.java     # Learning tracker & roadmap queries
│       ├── service/
│       │   └── SkillAnalyzerService.java # Gap analysis & matching algorithms
│       ├── servlet/
│       │   ├── BaseServlet.java     # JSON response helpers & session utilities
│       │   ├── AuthServlet.java     # Login, registration, and logout controller
│       │   ├── DashboardServlet.java# Aggregated dashboard metrics controller
│       │   ├── SkillServlet.java    # User skill addition/deletion controller
│       │   ├── AnalyzeServlet.java  # Skill gap analysis controller
│       │   ├── ProgressServlet.java # Progress tracking & completion controller
│       │   └── RoleServlet.java     # Role catalog & requirements controller
│       ├── filter/
│       │   └── AuthFilter.java      # Session authentication & page security filter
│       └── server/
│           └── EmbeddedServer.java  # Pure Java zero-install HTTP application server
├── webapp/
│   ├── css/
│   │   └── style.css                # Comprehensive responsive design stylesheet
│   ├── js/
│   │   └── app.js                   # Client frontend controller & API caller
│   ├── WEB-INF/
│   │   └── web.xml                  # Standard Java EE web deployment descriptor
│   ├── index.html                   # Landing page
│   ├── login.html                   # Login page
│   ├── register.html                # Registration page
│   ├── dashboard.html               # Main user dashboard & learning progress
│   ├── my-skills.html               # Skill management (add, edit, delete)
│   ├── analyze.html                 # Skill gap analysis & comparison
│   ├── roadmap.html                 # Personalized step-by-step roadmap
│   └── roles.html                   # Industry job roles explorer
├── build.bat                        # Windows batch compiler & WAR packager
├── build.ps1                        # PowerShell compiler & WAR packager
├── run.bat                          # 1-Click execution script (Windows batch)
├── run.ps1                          # 1-Click execution script (PowerShell)
├── setup_db.bat                     # Database initialization script (Windows batch)
├── setup_db.ps1                     # Database initialization script (PowerShell)
├── pom.xml                          # Maven build file (optional)
└── README.md                        # Documentation & setup guide
```

---

## 🚀 Quick Start Guide

### Step 1: Initialize the MySQL Database

Ensure your MySQL Server service is running. Then run the database setup script:

**Using Command Prompt**:
```cmd
setup_db.bat
```
*(Enter your MySQL root password when prompted)*

**Using PowerShell**:
```powershell
.\setup_db.ps1
```

**Or manually via MySQL Command Line / MySQL Workbench**:
```sql
SOURCE c:/Users/BABJI/OneDrive/Desktop/skillgaper/database/skill_gap_db.sql;
```

> **Note**: Verify or update your password in `config/db.properties` if needed:
> ```properties
> db.url=jdbc:mysql://localhost:3306/skill_gap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
> db.username=root
> db.password=YOUR_PASSWORD
> ```

---

### Step 2: Compile & Run the Application

#### Option A: Built-in 1-Click Server (Zero External Setup Required)

Simply run:
```cmd
run.bat
```
or in PowerShell:
```powershell
.\run.ps1
```

The server will automatically compile the project (if needed), test database connectivity, and launch at:
👉 **`http://localhost:8080/`**

---

#### Option B: Deploying on Apache Tomcat

1. Build the project WAR:
   ```cmd
   build.bat
   ```
   This generates `skillgaper.war` in the project root directory.
2. Copy `skillgaper.war` to your Apache Tomcat `webapps/` folder:
   ```cmd
   copy skillgaper.war "C:\Program Files\Apache Software Foundation\Tomcat 11.0\webapps\"
   ```
3. Start Tomcat service. Access the app at:
   👉 **`http://localhost:8080/skillgaper/`**

---

## 🔑 Demo Account Credentials

You can test the complete system immediately using the pre-seeded demo user:

- **Email**: `alex@example.com`
- **Password**: `demo123`
- **Current Target Role**: Full Stack Java Developer
- **Initial Skills**: Core Java (*Intermediate*), MySQL (*Intermediate*), HTML5 & CSS3 (*Intermediate*), JavaScript (*Beginner*), Git (*Beginner*).
- **Initial Match Score**: 45%

*(You can also register any new account with your own custom skills!)*

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and create session | No |
| `POST` | `/api/auth/logout` | Terminate session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/dashboard` | Fetch aggregated dashboard stats & progress | Yes |
| `GET` | `/api/skills` | Fetch all 30+ catalog skills | No |
| `GET` | `/api/skills/user` | Fetch skills possessed by logged-in user | Yes |
| `POST` | `/api/skills/user` | Add or update a user skill | Yes |
| `DELETE` | `/api/skills/user?skillId=X` | Remove a skill from user profile | Yes |
| `GET` | `/api/analyze?roleId=X` | Run gap analysis against target role | Yes |
| `POST` | `/api/analyze/target` | Update user's primary target job role | Yes |
| `GET` | `/api/progress` | Fetch user's active learning progress items | Yes |
| `POST` | `/api/progress/enroll` | Enroll in learning a missing skill | Yes |
| `POST` | `/api/progress/update` | Update learning progress percentage or notes | Yes |
| `POST` | `/api/progress/complete` | Complete skill and auto-promote to profile | Yes |
| `DELETE` | `/api/progress?skillId=X` | Delete item from learning tracker | Yes |
| `GET` | `/api/roles` | Fetch list of available job roles | No |
| `GET` | `/api/roles/detail?id=X` | Fetch job role details and required skills | No |

---

## 🧪 Automated Testing

To run the automated API verification test script, execute:
```powershell
powershell -ExecutionPolicy Bypass -File .\test_api.ps1
```

All 5 core API integration tests will run and report live verification in the console.
