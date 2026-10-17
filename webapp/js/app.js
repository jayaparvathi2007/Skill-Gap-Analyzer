/**
 * Skill Gap Analyzer - Core Client Application JavaScript
 * Dual-Mode: Communicates with Java Servlets + MySQL backend when available,
 * and seamlessly provides full in-browser client simulation on static hosts (e.g. Vercel / GitHub Pages).
 */

// =========================================================================
// MOCK CLIENT-SIDE FALLBACK ENGINE (For Vercel / Static Deployment)
// =========================================================================
const ClientData = {
    ROLES: [
        { id: 1, title: "Full Stack Java Developer", department: "Software Engineering", avgSalary: "$105,000 - $145,000 / yr", demandLevel: "Very High", icon: "coffee", description: "Build robust, scalable enterprise web applications using Core Java, Spring Boot, Microservices, REST APIs, and modern frontend technologies.",
          requiredSkills: [
            { skillId: 1, skillName: "Core Java", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 2, skillName: "Spring Boot", skillCategory: "Frameworks & Libraries", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 3, skillName: "MySQL & Relational DBs", skillCategory: "Databases", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 4, skillName: "RESTful APIs", skillCategory: "Core Concepts", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 5, skillName: "HTML5 & CSS3", skillCategory: "Frontend", importance: "Mandatory", weight: 2, minProficiency: "Beginner" },
            { skillId: 6, skillName: "JavaScript (ES6+)", skillCategory: "Programming Languages", importance: "Mandatory", weight: 2, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 18, skillName: "Hibernate & JPA", skillCategory: "Frameworks & Libraries", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 8, skillName: "Docker & Containerization", skillCategory: "Cloud & DevOps", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 19, skillName: "Microservices Architecture", skillCategory: "Core Concepts", importance: "Recommended", weight: 2, minProficiency: "Intermediate" },
            { skillId: 28, skillName: "Redis & Caching Strategies", skillCategory: "Databases", importance: "Bonus", weight: 1, minProficiency: "Beginner" }
          ]
        },
        { id: 2, title: "Frontend Developer", department: "Web Engineering", avgSalary: "$90,000 - $130,000 / yr", demandLevel: "High", icon: "layout", description: "Design and implement high-performance, responsive, and visually appealing user interfaces using HTML5, CSS3, JavaScript, and modern frontend frameworks.",
          requiredSkills: [
            { skillId: 5, skillName: "HTML5 & CSS3", skillCategory: "Frontend", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 6, skillName: "JavaScript (ES6+)", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 10, skillName: "React.js", skillCategory: "Frontend", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 25, skillName: "TypeScript", skillCategory: "Frontend", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 4, skillName: "RESTful APIs", skillCategory: "Core Concepts", importance: "Mandatory", weight: 2, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 29, skillName: "GraphQL", skillCategory: "Core Concepts", importance: "Bonus", weight: 1, minProficiency: "Beginner" }
          ]
        },
        { id: 3, title: "Data Scientist & AI Engineer", department: "Data & AI", avgSalary: "$115,000 - $160,000 / yr", demandLevel: "Very High", icon: "cpu", description: "Extract actionable intelligence from large datasets, develop predictive machine learning models, and deploy intelligent AI applications.",
          requiredSkills: [
            { skillId: 11, skillName: "Python", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 12, skillName: "Pandas & NumPy", skillCategory: "Data & AI", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 13, skillName: "Machine Learning (Scikit-Learn)", skillCategory: "Data & AI", importance: "Mandatory", weight: 3, minProficiency: "Advanced" },
            { skillId: 14, skillName: "Deep Learning (PyTorch/TensorFlow)", skillCategory: "Data & AI", importance: "Recommended", weight: 2, minProficiency: "Intermediate" },
            { skillId: 3, skillName: "MySQL & Relational DBs", skillCategory: "Databases", importance: "Mandatory", weight: 2, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 24, skillName: "Data Structures & Algorithms", skillCategory: "Core Concepts", importance: "Recommended", weight: 2, minProficiency: "Intermediate" }
          ]
        },
        { id: 4, title: "DevOps & Cloud Engineer", department: "Cloud & Infrastructure", avgSalary: "$110,000 - $155,000 / yr", demandLevel: "Very High", icon: "cloud", description: "Automate CI/CD pipelines, containerize applications with Docker, orchestrate with Kubernetes, and manage cloud infrastructure on AWS/Azure.",
          requiredSkills: [
            { skillId: 15, skillName: "Linux & Shell Scripting", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 8, skillName: "Docker & Containerization", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 9, skillName: "Kubernetes (K8s)", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 16, skillName: "AWS Cloud Foundations", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 17, skillName: "CI/CD Pipelines (Jenkins/GitHub Actions)", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Mandatory", weight: 2, minProficiency: "Intermediate" },
            { skillId: 11, skillName: "Python", skillCategory: "Programming Languages", importance: "Recommended", weight: 2, minProficiency: "Beginner" }
          ]
        },
        { id: 5, title: "Backend Developer", department: "Software Engineering", avgSalary: "$100,000 - $140,000 / yr", demandLevel: "High", icon: "server", description: "Architect secure, high-throughput server-side applications, design relational databases, microservices, and optimize API performance.",
          requiredSkills: [
            { skillId: 1, skillName: "Core Java", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 2, skillName: "Spring Boot", skillCategory: "Frameworks & Libraries", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 3, skillName: "MySQL & Relational DBs", skillCategory: "Databases", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 4, skillName: "RESTful APIs", skillCategory: "Core Concepts", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 19, skillName: "Microservices Architecture", skillCategory: "Core Concepts", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 28, skillName: "Redis & Caching Strategies", skillCategory: "Databases", importance: "Recommended", weight: 2, minProficiency: "Intermediate" },
            { skillId: 30, skillName: "System Design", skillCategory: "Core Concepts", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Recommended", weight: 2, minProficiency: "Beginner" }
          ]
        },
        { id: 6, title: "Cybersecurity Analyst", department: "Information Security", avgSalary: "$98,000 - $142,000 / yr", demandLevel: "High", icon: "shield", description: "Protect IT infrastructure, identify vulnerabilities, perform penetration testing, configure firewalls, and respond to cyber threats.",
          requiredSkills: [
            { skillId: 20, skillName: "Network Security & Firewalls", skillCategory: "Cybersecurity", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 21, skillName: "Ethical Hacking & Penetration Testing", skillCategory: "Cybersecurity", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 15, skillName: "Linux & Shell Scripting", skillCategory: "Cloud & DevOps", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 11, skillName: "Python", skillCategory: "Programming Languages", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Bonus", weight: 1, minProficiency: "Beginner" }
          ]
        },
        { id: 7, title: "Android / Mobile Developer", department: "Mobile Engineering", avgSalary: "$92,000 - $135,000 / yr", demandLevel: "Moderate", icon: "smartphone", description: "Develop high quality, user-centric native mobile applications for Android using Kotlin/Java and Android Jetpack libraries.",
          requiredSkills: [
            { skillId: 22, skillName: "Kotlin", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 23, skillName: "Android Jetpack & SDK", skillCategory: "Mobile Engineering", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 1, skillName: "Core Java", skillCategory: "Programming Languages", importance: "Recommended", weight: 2, minProficiency: "Beginner" },
            { skillId: 4, skillName: "RESTful APIs", skillCategory: "Core Concepts", importance: "Mandatory", weight: 2, minProficiency: "Intermediate" },
            { skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", importance: "Recommended", weight: 2, minProficiency: "Beginner" }
          ]
        },
        { id: 8, title: "Data Engineer", department: "Data & Analytics", avgSalary: "$110,000 - $150,000 / yr", demandLevel: "High", icon: "database", description: "Design, build, and maintain data architectures, ETL pipelines, distributed data stores, and big data warehousing systems.",
          requiredSkills: [
            { skillId: 11, skillName: "Python", skillCategory: "Programming Languages", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 3, skillName: "MySQL & Relational DBs", skillCategory: "Databases", importance: "Mandatory", weight: 3, minProficiency: "Advanced" },
            { skillId: 26, skillName: "Apache Kafka", skillCategory: "Data & Analytics", importance: "Mandatory", weight: 3, minProficiency: "Intermediate" },
            { skillId: 27, skillName: "MongoDB & NoSQL", skillCategory: "Databases", importance: "Recommended", weight: 2, minProficiency: "Intermediate" },
            { skillId: 15, skillName: "Linux & Shell Scripting", skillCategory: "Cloud & DevOps", importance: "Recommended", weight: 2, minProficiency: "Intermediate" }
          ]
        }
    ],

    SKILLS_CATALOG: [
        { id: 1, name: "Core Java", category: "Programming Languages", difficulty: "Intermediate" },
        { id: 2, name: "Spring Boot", category: "Frameworks & Libraries", difficulty: "Intermediate" },
        { id: 3, name: "MySQL & Relational DBs", category: "Databases", difficulty: "Beginner" },
        { id: 4, name: "RESTful APIs", category: "Core Concepts", difficulty: "Intermediate" },
        { id: 5, name: "HTML5 & CSS3", category: "Frontend", difficulty: "Beginner" },
        { id: 6, name: "JavaScript (ES6+)", category: "Programming Languages", difficulty: "Intermediate" },
        { id: 7, name: "Git & GitHub", category: "Tools", difficulty: "Beginner" },
        { id: 8, name: "Docker & Containerization", category: "Cloud & DevOps", difficulty: "Intermediate" },
        { id: 9, name: "Kubernetes (K8s)", category: "Cloud & DevOps", difficulty: "Advanced" },
        { id: 10, name: "React.js", category: "Frontend", difficulty: "Intermediate" },
        { id: 11, name: "Python", category: "Programming Languages", difficulty: "Beginner" },
        { id: 12, name: "Pandas & NumPy", category: "Data & AI", difficulty: "Intermediate" },
        { id: 13, name: "Machine Learning (Scikit-Learn)", category: "Data & AI", difficulty: "Advanced" },
        { id: 14, name: "Deep Learning (PyTorch/TensorFlow)", category: "Data & AI", difficulty: "Advanced" },
        { id: 15, name: "Linux & Shell Scripting", category: "Cloud & DevOps", difficulty: "Intermediate" },
        { id: 16, name: "AWS Cloud Foundations", category: "Cloud & DevOps", difficulty: "Intermediate" },
        { id: 17, name: "CI/CD Pipelines (Jenkins/GitHub Actions)", category: "Cloud & DevOps", difficulty: "Intermediate" },
        { id: 18, name: "Hibernate & JPA", category: "Frameworks & Libraries", difficulty: "Intermediate" },
        { id: 19, name: "Microservices Architecture", category: "Core Concepts", difficulty: "Advanced" },
        { id: 20, name: "Network Security & Firewalls", category: "Cybersecurity", difficulty: "Intermediate" },
        { id: 21, name: "Ethical Hacking & Penetration Testing", category: "Cybersecurity", difficulty: "Advanced" },
        { id: 22, name: "Kotlin", category: "Programming Languages", difficulty: "Intermediate" },
        { id: 23, name: "Android Jetpack & SDK", category: "Mobile Engineering", difficulty: "Intermediate" },
        { id: 24, name: "Data Structures & Algorithms", category: "Core Concepts", difficulty: "Intermediate" },
        { id: 25, name: "TypeScript", category: "Frontend", difficulty: "Intermediate" },
        { id: 26, name: "Apache Kafka", category: "Data & Analytics", difficulty: "Advanced" },
        { id: 27, name: "MongoDB & NoSQL", category: "Databases", difficulty: "Intermediate" },
        { id: 28, name: "Redis & Caching Strategies", category: "Databases", difficulty: "Intermediate" },
        { id: 29, name: "GraphQL", category: "Core Concepts", difficulty: "Intermediate" },
        { id: 30, name: "System Design", category: "Core Concepts", difficulty: "Advanced" }
    ],

    ROADMAPS: {
        1: [
            { stepNumber: 1, phaseTitle: "Java Foundations & OOP Principles", description: "Master variables, loops, inheritance, polymorphism, encapsulation, and abstract classes.", estimatedDuration: "2 weeks", resourceTitle: "Oracle Java Documentation", resourceUrl: "https://docs.oracle.com/javase/tutorial/" },
            { stepNumber: 2, phaseTitle: "Collections Framework & Streams", description: "Deep dive into List, Set, Map, ArrayList vs LinkedList, HashMaps, and functional streams.", estimatedDuration: "2 weeks", resourceTitle: "freeCodeCamp Java Guide", resourceUrl: "https://www.freecodecamp.org/news/java-collections-framework/" },
            { stepNumber: 3, phaseTitle: "Multithreading & Concurrency", description: "Understand thread lifecycle, synchronization, Executors, and custom exception handling.", estimatedDuration: "1-2 weeks", resourceTitle: "Baeldung Java Concurrency", resourceUrl: "https://www.baeldung.com/java-concurrency" }
        ],
        2: [
            { stepNumber: 1, phaseTitle: "Spring Core & Inversion of Control", description: "Understand Dependency Injection, Beans, Component Scanning, and annotations.", estimatedDuration: "1-2 weeks", resourceTitle: "Spring Quickstart", resourceUrl: "https://spring.io/quickstart" },
            { stepNumber: 2, phaseTitle: "Building RESTful Web Services", description: "Create controllers, JSON serialization, status codes, and exception handlers.", estimatedDuration: "2 weeks", resourceTitle: "Spring REST Guide", resourceUrl: "https://spring.io/guides/tutorials/rest/" },
            { stepNumber: 3, phaseTitle: "Data Persistence with Spring Data JPA", description: "Connect to MySQL, derive queries with JpaRepository, and manage transactions.", estimatedDuration: "2 weeks", resourceTitle: "Accessing Data with JPA", resourceUrl: "https://spring.io/guides/gs/accessing-data-jpa/" }
        ],
        4: [
            { stepNumber: 1, phaseTitle: "HTTP Protocol & REST Design Principles", description: "Master HTTP methods (GET, POST, PUT, DELETE), status codes, and statelessness.", estimatedDuration: "1 week", resourceTitle: "RESTful API Design Best Practices", resourceUrl: "https://restfulapi.net/" },
            { stepNumber: 2, phaseTitle: "JSON Serialization & API Security", description: "Payload validation, JWT tokens, Bearer authentication, and Postman testing.", estimatedDuration: "1 week", resourceTitle: "freeCodeCamp API Development Guide", resourceUrl: "https://www.freecodecamp.org/news/rest-api-design-best-practices/" }
        ],
        8: [
            { stepNumber: 1, phaseTitle: "Containers vs VMs & Docker CLI", description: "Understand images vs containers, pull/run containers, volume mounting, and ports.", estimatedDuration: "1 week", resourceTitle: "Docker 101 Tutorial", resourceUrl: "https://www.docker.com/101-tutorial/" },
            { stepNumber: 2, phaseTitle: "Writing Production Dockerfiles & Compose", description: "Multi-stage builds, environment variables, and orchestrating with docker-compose.", estimatedDuration: "2 weeks", resourceTitle: "Docker Compose Docs", resourceUrl: "https://docs.docker.com/compose/" }
        ],
        10: [
            { stepNumber: 1, phaseTitle: "React Components, Props & State", description: "Functional components, JSX syntax, passing props, and reactive useState hooks.", estimatedDuration: "2 weeks", resourceTitle: "Official React Documentation", resourceUrl: "https://react.dev/learn" },
            { stepNumber: 2, phaseTitle: "Lifecycle, Hooks & API Integration", description: "useEffect hook, custom hooks, form handling, and fetching backend data.", estimatedDuration: "2 weeks", resourceTitle: "freeCodeCamp React Guide", resourceUrl: "https://www.freecodecamp.org/news/tag/react/" }
        ],
        18: [
            { stepNumber: 1, phaseTitle: "ORM Basics & Entity Mapping", description: "Annotations (@Entity, @Table, @Id), relationships (@OneToMany, @ManyToMany).", estimatedDuration: "1-2 weeks", resourceTitle: "Baeldung Hibernate JPA Guide", resourceUrl: "https://www.baeldung.com/learn-jpa-hibernate" }
        ],
        19: [
            { stepNumber: 1, phaseTitle: "Microservices Architecture & API Gateway", description: "Domain-Driven Design (DDD), service discovery, API Gateway, and resilient communication.", estimatedDuration: "2-3 weeks", resourceTitle: "Microservices.io Patterns", resourceUrl: "https://microservices.io/" }
        ]
    },

    getUser() {
        let u = localStorage.getItem('sga_user');
        if (!u) {
            // Default demo user
            const demo = {
                id: 1,
                fullName: "Alex Morgan",
                email: "alex@example.com",
                targetRoleId: 1,
                targetRoleTitle: "Full Stack Java Developer",
                experienceLevel: "Intermediate"
            };
            localStorage.setItem('sga_user', JSON.stringify(demo));
            return demo;
        }
        return JSON.parse(u);
    },

    setUser(user) {
        if (!user) localStorage.removeItem('sga_user');
        else localStorage.setItem('sga_user', JSON.stringify(user));
    },

    getUserSkills() {
        let s = localStorage.getItem('sga_user_skills');
        if (!s) {
            // Initial seed skills for Alex Morgan
            const initial = [
                { id: 1, skillId: 1, skillName: "Core Java", skillCategory: "Programming Languages", proficiencyLevel: "Intermediate", yearsExperience: 2.0 },
                { id: 2, skillId: 3, skillName: "MySQL & Relational DBs", skillCategory: "Databases", proficiencyLevel: "Intermediate", yearsExperience: 1.5 },
                { id: 3, skillId: 5, skillName: "HTML5 & CSS3", skillCategory: "Frontend", proficiencyLevel: "Intermediate", yearsExperience: 2.0 },
                { id: 4, skillId: 6, skillName: "JavaScript (ES6+)", skillCategory: "Programming Languages", proficiencyLevel: "Beginner", yearsExperience: 1.0 },
                { id: 5, skillId: 7, skillName: "Git & GitHub", skillCategory: "Tools", proficiencyLevel: "Beginner", yearsExperience: 1.0 }
            ];
            localStorage.setItem('sga_user_skills', JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(s);
    },

    saveUserSkills(skills) {
        localStorage.setItem('sga_user_skills', JSON.stringify(skills));
    },

    getLearningProgress() {
        let p = localStorage.getItem('sga_learning_progress');
        if (!p) {
            const initial = [
                { id: 1, skillId: 2, skillName: "Spring Boot", skillCategory: "Frameworks & Libraries", status: "In Progress", progressPercent: 40, notes: "Currently building a sample RESTful CRUD app using Spring Data JPA." },
                { id: 2, skillId: 18, skillName: "Hibernate & JPA", skillCategory: "Frameworks & Libraries", status: "In Progress", progressPercent: 25, notes: "Studying entity mappings and lazy loading pitfalls." },
                { id: 3, skillId: 8, skillName: "Docker & Containerization", skillCategory: "Cloud & DevOps", status: "Not Started", progressPercent: 0, notes: "Plan to start after finishing Spring Boot project." }
            ];
            localStorage.setItem('sga_learning_progress', JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(p);
    },

    saveLearningProgress(items) {
        localStorage.setItem('sga_learning_progress', JSON.stringify(items));
    },

    // Gap analysis calculation algorithm (mirroring SkillAnalyzerService.java)
    calculateGap(roleId) {
        const user = this.getUser();
        const role = this.ROLES.find(r => r.id === parseInt(roleId)) || this.ROLES[0];
        const userSkills = this.getUserSkills();

        const userSkillMap = {};
        userSkills.forEach(us => { userSkillMap[us.skillId] = us; });

        let matched = [];
        let missing = [];
        let totalPossible = 0;
        let earned = 0;

        const profWeight = { "Beginner": 0.70, "Intermediate": 0.88, "Advanced": 1.0 };
        const profOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };

        role.requiredSkills.forEach(req => {
            const w = req.weight || 2;
            totalPossible += w;

            if (userSkillMap[req.skillId]) {
                const us = userSkillMap[req.skillId];
                const meets = (profOrder[us.proficiencyLevel] || 1) >= (profOrder[req.minProficiency] || 1);
                earned += (w * (profWeight[us.proficiencyLevel] || 0.75));

                matched.push({
                    skillId: req.skillId,
                    skillName: req.skillName,
                    category: req.skillCategory,
                    userProficiency: us.proficiencyLevel,
                    requiredProficiency: req.minProficiency,
                    importance: req.importance,
                    meetsRequirement: meets
                });
            } else {
                missing.push(req);
            }
        });

        // Extra / Transferable skills
        const reqSkillIds = new Set(role.requiredSkills.map(r => r.skillId));
        const transferable = userSkills.filter(us => !reqSkillIds.has(us.skillId));

        const totalReq = role.requiredSkills.length;
        const directPercent = totalReq > 0 ? Math.round((matched.length / totalReq) * 100) : 0;
        const weightedPercent = totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 0;

        // Roadmap steps for missing skills
        let recommendedRoadmap = [];
        missing.forEach(m => {
            const steps = this.ROADMAPS[m.skillId];
            if (steps) {
                steps.forEach(s => {
                    recommendedRoadmap.push({ ...s, skillId: m.skillId, skillName: m.skillName });
                });
            }
        });

        // Readiness level
        const avgScore = Math.round((directPercent + weightedPercent) / 2);
        let readinessLevel = "Foundation Builder 🎯";
        let badgeColor = "danger";
        let advice = "Early learning phase for this career path. Start with Phase 1 fundamentals in the recommended roadmap.";
        let weeks = Math.max(4, missing.length * 3);

        if (avgScore >= 80) {
            readinessLevel = "Job Ready 🚀";
            badgeColor = "success";
            advice = "Outstanding match! You possess the primary technical competencies required for this position. Focus on portfolio showcase and behavioral interviews.";
            weeks = Math.max(1, missing.length * 1);
        } else if (avgScore >= 60) {
            readinessLevel = "Interview Ready with Minor Gaps ⚡";
            badgeColor = "info";
            advice = "Strong match! You have an excellent base. Mastering the few missing high-priority skills will position you at the top of candidate pools.";
            weeks = Math.max(2, missing.length * 2);
        } else if (avgScore >= 35) {
            readinessLevel = "Intermediate Learner 📈";
            badgeColor = "warning";
            advice = "Solid starting foundation. Follow the curated roadmap steps below to systematically close mandatory skill gaps.";
            weeks = Math.max(3, missing.length * 2);
        }

        return {
            roleId: role.id,
            roleTitle: role.title,
            department: role.department,
            avgSalary: role.avgSalary,
            demandLevel: role.demandLevel,
            roleDescription: role.description,
            totalRequiredSkills: totalReq,
            matchedSkillsCount: matched.length,
            missingSkillsCount: missing.length,
            transferableSkillsCount: transferable.length,
            matchPercentage: directPercent,
            weightedPercentage: weightedPercent,
            readinessLevel,
            readinessBadgeColor: badgeColor,
            readinessAdvice: advice,
            estimatedWeeksToClose: weeks,
            matchedSkills: matched,
            missingSkills: missing,
            transferableSkills: transferable,
            recommendedRoadmap
        };
    }
};

// =========================================================================
// APPLICATION CONTROLLER
// =========================================================================
const App = {
    user: null,

    async init() {
        await this.checkAuth();
        this.updateNavUI();
    },

    async checkAuth() {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    this.user = data.data;
                    return;
                }
            }
        } catch (e) {
            // Backend offline - use ClientData fallback
        }
        this.user = ClientData.getUser();
    },

    updateNavUI() {
        const authActions = document.getElementById('nav-auth-actions');
        if (!authActions) return;

        if (this.user) {
            authActions.innerHTML = `
                <div class="user-badge">
                    <div class="user-avatar">${this.user.fullName ? this.user.fullName.charAt(0).toUpperCase() : 'U'}</div>
                    <span class="user-name">${this.escapeHtml(this.user.fullName)}</span>
                </div>
                <button onclick="App.logout()" class="btn btn-sm btn-outline">Logout</button>
            `;
        } else {
            authActions.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-outline">Log In</a>
                <a href="register.html" class="btn btn-sm btn-primary">Sign Up</a>
            `;
        }
    },

    // =========================================================================
    // AUTHENTICATION
    // =========================================================================
    async login(email, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.user = data.data;
                    ClientData.setUser(data.data);
                    this.showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                    return;
                }
            }
        } catch (err) {}

        // Fallback Client Login
        if (email.toLowerCase().includes('alex') || password === 'demo123') {
            const u = ClientData.getUser();
            this.user = u;
            this.showToast('Login successful! Welcome back, ' + u.fullName, 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } else {
            const u = { id: Date.now(), fullName: email.split('@')[0], email, targetRoleId: 1, experienceLevel: "Beginner" };
            this.user = u;
            ClientData.setUser(u);
            this.showToast('Signed in successfully!', 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        }
    },

    async register(fullName, email, password, targetRoleId, experienceLevel) {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, targetRoleId, experienceLevel })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.user = data.data;
                    ClientData.setUser(data.data);
                    this.showToast('Account registered successfully!', 'success');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                    return;
                }
            }
        } catch (err) {}

        // Fallback Client Register
        const role = ClientData.ROLES.find(r => r.id === parseInt(targetRoleId)) || ClientData.ROLES[0];
        const newUser = { id: Date.now(), fullName, email, targetRoleId: role.id, targetRoleTitle: role.title, experienceLevel };
        this.user = newUser;
        ClientData.setUser(newUser);
        this.showToast('Account created successfully!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    },

    async logout() {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
        this.user = null;
        ClientData.setUser(null);
        this.showToast('Logged out successfully', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
    },

    // =========================================================================
    // DASHBOARD
    // =========================================================================
    async loadDashboard() {
        let dashboardData = null;

        try {
            const res = await fetch('/api/dashboard');
            if (res.ok) {
                const data = await res.json();
                if (data.success) dashboardData = data.data;
            }
        } catch (err) {}

        // Fallback
        if (!dashboardData) {
            const user = ClientData.getUser();
            const skills = ClientData.getUserSkills();
            const learning = ClientData.getLearningProgress();
            const gap = ClientData.calculateGap(user.targetRoleId || 1);

            let inProg = learning.filter(l => l.status === 'In Progress').length;
            let comp = learning.filter(l => l.status === 'Completed').length;

            dashboardData = {
                user,
                totalUserSkills: skills.length,
                userSkills: skills,
                learningItems: learning,
                inProgressCount: inProg,
                completedLearningCount: comp,
                gapAnalysis: gap
            };
        }

        const d = dashboardData;
        const gap = d.gapAnalysis;

        const welcomeElem = document.getElementById('user-welcome-name');
        if (welcomeElem && d.user) welcomeElem.textContent = d.user.fullName;

        const roleElem = document.getElementById('user-target-role');
        if (roleElem && gap) roleElem.textContent = gap.roleTitle;

        document.getElementById('stat-match-pct').textContent = (gap ? gap.matchPercentage : 0) + '%';
        document.getElementById('stat-my-skills').textContent = d.totalUserSkills;
        document.getElementById('stat-missing-skills').textContent = gap ? gap.missingSkillsCount : 0;
        document.getElementById('stat-in-progress').textContent = d.inProgressCount;

        this.renderCircularGauge(gap ? gap.matchPercentage : 0);

        if (gap) {
            document.getElementById('match-role-title').textContent = gap.roleTitle;
            document.getElementById('match-department').textContent = gap.department + ' • ' + (gap.avgSalary || '');
            
            const badge = document.getElementById('match-readiness-badge');
            badge.className = `match-badge badge-${gap.readinessBadgeColor || 'primary'}`;
            badge.textContent = gap.readinessLevel;

            document.getElementById('match-advice-text').textContent = gap.readinessAdvice;
            document.getElementById('match-weeks-to-ready').textContent = gap.estimatedWeeksToClose + ' weeks';
        }

        this.renderDashboardLearningItems(d.learningItems);
        this.renderDashboardSkills(d.userSkills);
    },

    renderCircularGauge(percentage) {
        const bar = document.getElementById('gauge-bar');
        const text = document.getElementById('gauge-percentage-text');
        if (!bar || !text) return;

        text.textContent = percentage + '%';
        bar.style.strokeDasharray = `${percentage}, 100`;

        bar.className = 'circle-bar';
        if (percentage >= 80) bar.classList.add('success');
        else if (percentage >= 50) bar.classList.add('primary');
        else if (percentage >= 25) bar.classList.add('warning');
        else bar.classList.add('danger');
    },

    renderDashboardLearningItems(items) {
        const container = document.getElementById('learning-progress-table-body');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                        No skills enrolled in your learning tracker yet.<br>
                        <a href="analyze.html" class="btn btn-sm btn-primary" style="margin-top: 0.5rem;">Analyze Gaps to Enroll Skills</a>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <tr>
                <td><strong>${this.escapeHtml(item.skillName)}</strong><br><small style="color:var(--text-muted)">${this.escapeHtml(item.skillCategory)}</small></td>
                <td>
                    <span class="match-badge ${item.status === 'Completed' ? 'badge-success' : 'badge-warning'}">
                        ${this.escapeHtml(item.status)}
                    </span>
                </td>
                <td style="min-width: 140px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;">
                        <span>Progress</span>
                        <span>${item.progressPercent}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar ${item.progressPercent === 100 ? 'success' : ''}" style="width: ${item.progressPercent}%"></div>
                    </div>
                </td>
                <td><small style="color:var(--text-muted)">${item.notes ? this.escapeHtml(item.notes) : '—'}</small></td>
                <td>
                    ${item.status !== 'Completed' ? `
                        <button onclick="App.openUpdateProgressModal(${item.skillId}, '${this.escapeHtml(item.skillName)}', ${item.progressPercent}, '${this.escapeHtml(item.status)}')" class="btn btn-sm btn-outline">Update</button>
                        <button onclick="App.completeSkill(${item.skillId})" class="btn btn-sm btn-success" title="Mark as Completed">✓</button>
                    ` : `<span style="color:var(--success); font-weight:600; font-size:0.85rem;">Completed</span>`}
                </td>
            </tr>
        `).join('');
    },

    renderDashboardSkills(skills) {
        const container = document.getElementById('dashboard-skills-list');
        if (!container) return;

        if (!skills || skills.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted)">No skills added yet. <a href="my-skills.html">Add your existing skills</a>.</p>`;
            return;
        }

        container.innerHTML = skills.map(s => `
            <div class="skill-badge matched">
                <span>${this.escapeHtml(s.skillName)}</span>
                <span class="level-tag">${this.escapeHtml(s.proficiencyLevel)}</span>
            </div>
        `).join('');
    },

    // =========================================================================
    // MY SKILLS
    // =========================================================================
    async loadMySkills() {
        let skills = null;
        let catalog = null;

        try {
            const [uRes, cRes] = await Promise.all([fetch('/api/skills/user'), fetch('/api/skills')]);
            if (uRes.ok && cRes.ok) {
                const uData = await uRes.json();
                const cData = await cRes.json();
                if (uData.success) skills = uData.data;
                if (cData.success) catalog = cData.data;
            }
        } catch (e) {}

        if (!skills) skills = ClientData.getUserSkills();
        if (!catalog) catalog = ClientData.SKILLS_CATALOG;

        this.renderMySkillsGrid(skills);
        this.populateCatalogSelect(catalog);
    },

    renderMySkillsGrid(skills) {
        const container = document.getElementById('my-skills-grid');
        const countBadge = document.getElementById('total-skills-count');
        if (countBadge) countBadge.textContent = skills.length;

        if (!container) return;
        if (!skills || skills.length === 0) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <h3>No Skills Added Yet</h3>
                    <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">Add your programming languages, frameworks, databases, and tools to get an accurate gap analysis.</p>
                    <button onclick="App.openModal('add-skill-modal')" class="btn btn-primary">+ Add Your First Skill</button>
                </div>
            `;
            return;
        }

        container.innerHTML = skills.map(s => `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem;">
                <div>
                    <h4 style="font-size:1.05rem; font-weight:700; color:var(--dark);">${this.escapeHtml(s.skillName)}</h4>
                    <div style="margin-top:0.35rem; display:flex; gap:0.5rem; align-items:center;">
                        <span class="match-badge badge-primary" style="font-size:0.75rem;">${this.escapeHtml(s.skillCategory || 'General')}</span>
                        <span class="level-tag" style="background:#f1f5f9; color:var(--text-main); font-weight:700;">${this.escapeHtml(s.proficiencyLevel)}</span>
                        <span style="font-size:0.8rem; color:var(--text-muted);">${s.yearsExperience || 1} yr${(s.yearsExperience > 1) ? 's' : ''} exp</span>
                    </div>
                </div>
                <div>
                    <button onclick="App.deleteSkill(${s.skillId}, '${this.escapeHtml(s.skillName)}')" class="btn btn-sm btn-danger-outline" title="Remove Skill">Delete</button>
                </div>
            </div>
        `).join('');
    },

    populateCatalogSelect(catalog) {
        const select = document.getElementById('catalog-skill-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Choose from Standard Industry Skills --</option>' +
            catalog.map(s => `<option value="${s.id}">${this.escapeHtml(s.name)} (${this.escapeHtml(s.category)})</option>`).join('');
    },

    async saveSkillFromForm(e) {
        e.preventDefault();
        const skillId = document.getElementById('catalog-skill-select').value;
        const customName = document.getElementById('custom-skill-name').value.trim();
        const category = document.getElementById('custom-skill-category').value.trim();
        const proficiency = document.getElementById('skill-proficiency').value;
        const years = parseFloat(document.getElementById('skill-experience-years').value) || 1.0;

        if (!skillId && !customName) {
            this.showToast('Please select a catalog skill or enter a custom skill name.', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/skills/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId: skillId ? parseInt(skillId) : null, skillName: customName, category, proficiencyLevel: proficiency, yearsExperience: years })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast('Skill added to your profile!', 'success');
                    this.closeModal('add-skill-modal');
                    document.getElementById('add-skill-form').reset();
                    this.loadMySkills();
                    return;
                }
            }
        } catch (err) {}

        // Fallback Client Save
        let sName = customName;
        let sCat = category;
        let sId = skillId ? parseInt(skillId) : Date.now();

        if (skillId) {
            const found = ClientData.SKILLS_CATALOG.find(c => c.id === parseInt(skillId));
            if (found) { sName = found.name; sCat = found.category; }
        }

        const skills = ClientData.getUserSkills();
        const existingIdx = skills.findIndex(s => s.skillId === sId);
        if (existingIdx >= 0) {
            skills[existingIdx].proficiencyLevel = proficiency;
            skills[existingIdx].yearsExperience = years;
        } else {
            skills.push({ id: Date.now(), skillId: sId, skillName: sName, skillCategory: sCat, proficiencyLevel: proficiency, yearsExperience: years });
        }
        ClientData.saveUserSkills(skills);

        this.showToast('Skill saved to your profile!', 'success');
        this.closeModal('add-skill-modal');
        document.getElementById('add-skill-form').reset();
        this.loadMySkills();
    },

    async deleteSkill(skillId, skillName) {
        if (!confirm(`Are you sure you want to remove "${skillName}" from your skills?`)) return;

        try {
            const res = await fetch(`/api/skills/user?skillId=${skillId}`, { method: 'DELETE' });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast(`Removed "${skillName}"`, 'success');
                    this.loadMySkills();
                    return;
                }
            }
        } catch (e) {}

        // Fallback Client Delete
        let skills = ClientData.getUserSkills();
        skills = skills.filter(s => s.skillId !== parseInt(skillId));
        ClientData.saveUserSkills(skills);
        this.showToast(`Removed "${skillName}"`, 'success');
        this.loadMySkills();
    },

    // =========================================================================
    // SKILL GAP ANALYSIS
    // =========================================================================
    async initAnalyzePage() {
        let roles = null;
        try {
            const res = await fetch('/api/roles');
            if (res.ok) {
                const data = await res.json();
                if (data.success) roles = data.data;
            }
        } catch (e) {}

        if (!roles) roles = ClientData.ROLES;

        const select = document.getElementById('target-role-dropdown');
        if (select) {
            select.innerHTML = roles.map(r => `
                <option value="${r.id}">${this.escapeHtml(r.title)} (${this.escapeHtml(r.department)})</option>
            `).join('');

            const urlParams = new URLSearchParams(window.location.search);
            const roleIdParam = urlParams.get('roleId');
            if (roleIdParam) select.value = roleIdParam;
        }

        await this.runAnalysis();
    },

    async runAnalysis() {
        const select = document.getElementById('target-role-dropdown');
        const roleId = select ? select.value : '1';
        let result = null;

        try {
            const res = await fetch(`/api/analyze?roleId=${roleId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) result = data.data;
            }
        } catch (e) {}

        if (!result) {
            result = ClientData.calculateGap(roleId);
        }

        this.renderCircularGauge(result.matchPercentage);
        document.getElementById('analysis-role-title').textContent = result.roleTitle;
        document.getElementById('analysis-department').textContent = `${result.department} • Avg Salary: ${result.avgSalary}`;
        document.getElementById('analysis-role-desc').textContent = result.roleDescription;

        const badge = document.getElementById('analysis-readiness-badge');
        badge.className = `match-badge badge-${result.readinessBadgeColor || 'primary'}`;
        badge.textContent = result.readinessLevel;

        document.getElementById('analysis-readiness-advice').textContent = result.readinessAdvice;
        document.getElementById('analysis-est-weeks').textContent = `${result.estimatedWeeksToClose} weeks`;

        document.getElementById('stat-matched-count').textContent = result.matchedSkillsCount;
        document.getElementById('stat-missing-count').textContent = result.missingSkillsCount;
        document.getElementById('stat-transferable-count').textContent = result.transferableSkillsCount;

        this.renderMatchedSkills(result.matchedSkills);
        this.renderMissingSkills(result.missingSkills);
        this.renderTransferableSkills(result.transferableSkills);
        this.renderRoadmapPreview(result.recommendedRoadmap);
    },

    async setAsTargetRole() {
        const select = document.getElementById('target-role-dropdown');
        const roleId = select ? select.value : null;
        if (!roleId) return;

        try {
            const res = await fetch('/api/analyze/target', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roleId })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast(data.message, 'success');
                    return;
                }
            }
        } catch (e) {}

        const user = ClientData.getUser();
        const role = ClientData.ROLES.find(r => r.id === parseInt(roleId));
        if (role) {
            user.targetRoleId = role.id;
            user.targetRoleTitle = role.title;
            ClientData.setUser(user);
            this.showToast('Target role updated to: ' + role.title, 'success');
        }
    },

    renderMatchedSkills(list) {
        const container = document.getElementById('matched-skills-container');
        if (!container) return;

        if (!list || list.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); padding:1rem;">No matching skills found for this role yet.</p>`;
            return;
        }

        container.innerHTML = list.map(item => `
            <div class="card" style="border-left: 4px solid var(--success); padding: 1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <h4 style="font-weight:700; color:var(--dark);">${this.escapeHtml(item.skillName)}</h4>
                    <span class="match-badge badge-success" style="font-size:0.75rem;">Matched ✓</span>
                </div>
                <div style="margin-top:0.5rem; font-size:0.875rem; color:var(--text-muted);">
                    <div>Your Level: <strong style="color:var(--dark);">${this.escapeHtml(item.userProficiency)}</strong></div>
                    <div>Required: <strong style="color:var(--dark);">${this.escapeHtml(item.requiredProficiency)}</strong></div>
                    <div>Importance: <strong>${this.escapeHtml(item.importance)}</strong></div>
                </div>
            </div>
        `).join('');
    },

    renderMissingSkills(list) {
        const container = document.getElementById('missing-skills-container');
        if (!container) return;

        if (!list || list.length === 0) {
            container.innerHTML = `<div class="card" style="border-left:4px solid var(--success); padding:1.5rem;"><h4 style="color:var(--success);">Zero Missing Skills! 🎉</h4><p style="color:var(--text-muted);">You meet 100% of the required skills for this job profile!</p></div>`;
            return;
        }

        container.innerHTML = list.map(item => `
            <div class="card" style="border-left: 4px solid var(--danger); padding: 1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <h4 style="font-weight:700; color:var(--dark);">${this.escapeHtml(item.skillName)}</h4>
                    <span class="match-badge ${item.importance === 'Mandatory' ? 'badge-danger' : 'badge-warning'}" style="font-size:0.75rem;">
                        ${this.escapeHtml(item.importance)}
                    </span>
                </div>
                <p style="font-size:0.875rem; color:var(--text-muted); margin: 0.4rem 0 0.85rem;">
                    ${this.escapeHtml(item.skillDescription || '')}
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="match-badge badge-primary" style="font-size:0.75rem;">${this.escapeHtml(item.skillCategory)}</span>
                    <button onclick="App.enrollInLearning(${item.skillId}, '${this.escapeHtml(item.skillName)}')" class="btn btn-sm btn-primary">
                        + Add to Learning Plan
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderTransferableSkills(list) {
        const container = document.getElementById('transferable-skills-container');
        if (!container) return;

        if (!list || list.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); padding:1rem;">No extra skills beyond role requirements.</p>`;
            return;
        }

        container.innerHTML = list.map(item => `
            <div class="skill-badge transferable">
                <span>${this.escapeHtml(item.skillName)}</span>
                <span class="level-tag">${this.escapeHtml(item.proficiencyLevel)}</span>
            </div>
        `).join('');
    },

    renderRoadmapPreview(steps) {
        const container = document.getElementById('roadmap-preview-container');
        if (!container) return;

        if (!steps || steps.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); padding:1rem;">No learning roadmap needed — all skills mastered!</p>`;
            return;
        }

        container.innerHTML = `
            <div class="timeline">
                ${steps.slice(0, 5).map(step => `
                    <div class="timeline-step">
                        <div class="timeline-badge">${step.stepNumber}</div>
                        <div class="timeline-card">
                            <div class="timeline-header">
                                <h4 class="timeline-title">${this.escapeHtml(step.skillName)}: ${this.escapeHtml(step.phaseTitle)}</h4>
                                <span class="timeline-duration">${this.escapeHtml(step.estimatedDuration)}</span>
                            </div>
                            <p class="timeline-desc">${this.escapeHtml(step.description)}</p>
                            ${step.resourceUrl ? `
                                <a href="${step.resourceUrl}" target="_blank" rel="noopener noreferrer" class="timeline-resource">
                                    📚 ${this.escapeHtml(step.resourceTitle || 'Resource Guide')} ↗
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ${steps.length > 5 ? `<div style="text-align:center; margin-top:1.5rem;"><a href="roadmap.html" class="btn btn-outline-primary">View Full Learning Roadmap (${steps.length} Steps) →</a></div>` : ''}
        `;
    },

    // =========================================================================
    // ROADMAP & LEARNING PROGRESS
    // =========================================================================
    async loadRoadmapPage() {
        let result = null;
        try {
            const res = await fetch('/api/analyze');
            if (res.ok) {
                const data = await res.json();
                if (data.success) result = data.data;
            }
        } catch (e) {}

        if (!result) {
            const user = ClientData.getUser();
            result = ClientData.calculateGap(user.targetRoleId || 1);
        }

        document.getElementById('roadmap-role-title').textContent = result.roleTitle;

        const steps = result.recommendedRoadmap || [];
        const container = document.getElementById('full-roadmap-timeline');

        if (!container) return;
        if (steps.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align:center; padding:3rem;">
                    <h3 style="color:var(--success);">You Are Fully Job-Ready! 🚀</h3>
                    <p style="color:var(--text-muted); margin:0.75rem 0 1.5rem;">There are no missing skills for this role! All competencies have been attained.</p>
                    <a href="roles.html" class="btn btn-primary">Explore Other Career Paths</a>
                </div>
            `;
            return;
        }

        const skillGroups = {};
        steps.forEach(s => {
            if (!skillGroups[s.skillName]) skillGroups[s.skillName] = [];
            skillGroups[s.skillName].push(s);
        });

        container.innerHTML = Object.keys(skillGroups).map(skillName => {
            const skillSteps = skillGroups[skillName];
            const first = skillSteps[0];
            return `
                <div class="card" style="margin-bottom: 2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
                        <div>
                            <h3 style="font-size:1.35rem; font-weight:800; color:var(--dark);">${this.escapeHtml(skillName)}</h3>
                            <span style="font-size:0.85rem; color:var(--text-muted);">Curated step-by-step learning track</span>
                        </div>
                        <button onclick="App.enrollInLearning(${first.skillId}, '${this.escapeHtml(skillName)}')" class="btn btn-sm btn-primary">
                            + Enroll in My Progress Tracker
                        </button>
                    </div>
                    <div class="timeline" style="margin-top:0;">
                        ${skillSteps.map(step => `
                            <div class="timeline-step">
                                <div class="timeline-badge">${step.stepNumber}</div>
                                <div class="timeline-card">
                                    <div class="timeline-header">
                                        <h4 class="timeline-title">${this.escapeHtml(step.phaseTitle)}</h4>
                                        <span class="timeline-duration">${this.escapeHtml(step.estimatedDuration)}</span>
                                    </div>
                                    <p class="timeline-desc">${this.escapeHtml(step.description)}</p>
                                    ${step.resourceUrl ? `
                                        <a href="${step.resourceUrl}" target="_blank" rel="noopener noreferrer" class="timeline-resource">
                                            📖 ${this.escapeHtml(step.resourceTitle || 'Recommended Resource')} ↗
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    async enrollInLearning(skillId, skillName) {
        try {
            const res = await fetch('/api/progress/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId, status: 'In Progress', progressPercent: 10, notes: `Started learning ${skillName}` })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast(`Enrolled "${skillName}" into your Learning Tracker! 🎯`, 'success');
                    return;
                }
            }
        } catch (e) {}

        // Fallback Client Enroll
        const items = ClientData.getLearningProgress();
        const found = items.find(i => i.skillId === parseInt(skillId));
        if (found) {
            found.status = 'In Progress';
            found.progressPercent = Math.max(10, found.progressPercent);
        } else {
            const cat = ClientData.SKILLS_CATALOG.find(c => c.id === parseInt(skillId));
            items.push({ id: Date.now(), skillId: parseInt(skillId), skillName, skillCategory: cat ? cat.category : 'General', status: 'In Progress', progressPercent: 10, notes: `Started learning ${skillName}` });
        }
        ClientData.saveLearningProgress(items);
        this.showToast(`Enrolled "${skillName}" into your Learning Tracker! 🎯`, 'success');
    },

    openUpdateProgressModal(skillId, skillName, currentPercent, currentStatus) {
        document.getElementById('update-skill-id').value = skillId;
        document.getElementById('update-skill-name-label').textContent = skillName;
        document.getElementById('update-progress-status').value = currentStatus || 'In Progress';
        document.getElementById('update-progress-percent').value = currentPercent || 0;
        document.getElementById('percent-display').textContent = (currentPercent || 0) + '%';
        this.openModal('update-progress-modal');
    },

    async submitProgressUpdate(e) {
        e.preventDefault();
        const skillId = parseInt(document.getElementById('update-skill-id').value);
        const status = document.getElementById('update-progress-status').value;
        const progressPercent = parseInt(document.getElementById('update-progress-percent').value);
        const notes = document.getElementById('update-progress-notes').value.trim();

        try {
            const res = await fetch('/api/progress/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId, status, progressPercent, notes })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast('Learning progress updated!', 'success');
                    this.closeModal('update-progress-modal');
                    if (window.location.pathname.includes('dashboard')) this.loadDashboard();
                    return;
                }
            }
        } catch (e) {}

        // Fallback Client Update
        const items = ClientData.getLearningProgress();
        const item = items.find(i => i.skillId === skillId);
        if (item) {
            item.status = status;
            item.progressPercent = progressPercent;
            item.notes = notes;
            ClientData.saveLearningProgress(items);
        }
        this.showToast('Learning progress updated!', 'success');
        this.closeModal('update-progress-modal');
        if (window.location.pathname.includes('dashboard')) this.loadDashboard();
    },

    async completeSkill(skillId) {
        if (!confirm('Mark this skill as 100% completed? It will be automatically added to your profile skills and will raise your job readiness score!')) return;

        try {
            const res = await fetch('/api/progress/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.showToast(data.message, 'success');
                    this.loadDashboard();
                    return;
                }
            }
        } catch (e) {}

        // Fallback Client Complete & Promote
        const sId = parseInt(skillId);
        const items = ClientData.getLearningProgress();
        const item = items.find(i => i.skillId === sId);
        if (item) {
            item.status = 'Completed';
            item.progressPercent = 100;
            ClientData.saveLearningProgress(items);
        }

        const skills = ClientData.getUserSkills();
        if (!skills.some(s => s.skillId === sId)) {
            const cat = ClientData.SKILLS_CATALOG.find(c => c.id === sId);
            skills.push({ id: Date.now(), skillId: sId, skillName: cat ? cat.name : (item ? item.skillName : "Skill"), skillCategory: cat ? cat.category : "General", proficiencyLevel: "Intermediate", yearsExperience: 1.0 });
            ClientData.saveUserSkills(skills);
        }

        this.showToast('Congratulations! Skill completed and added to your profile! Your job match score has increased.', 'success');
        this.loadDashboard();
    },

    // =========================================================================
    // ROLES EXPLORER
    // =========================================================================
    async loadRolesPage() {
        let roles = null;
        try {
            const res = await fetch('/api/roles');
            if (res.ok) {
                const data = await res.json();
                if (data.success) roles = data.data;
            }
        } catch (e) {}

        if (!roles) roles = ClientData.ROLES;

        const container = document.getElementById('roles-grid');
        if (!container) return;

        container.innerHTML = roles.map(r => `
            <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                        <span class="match-badge badge-primary" style="font-size:0.75rem;">${this.escapeHtml(r.department)}</span>
                        <span class="match-badge ${r.demandLevel === 'Very High' ? 'badge-success' : 'badge-info'}" style="font-size:0.75rem;">
                            ${this.escapeHtml(r.demandLevel)} Demand
                        </span>
                    </div>
                    <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:0.5rem;">${this.escapeHtml(r.title)}</h3>
                    <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">
                        ${this.escapeHtml(r.description)}
                    </p>
                    <div style="margin-bottom:1rem; font-size:0.875rem;">
                        <strong style="color:var(--dark);">Avg Salary:</strong> <span style="color:var(--primary); font-weight:700;">${this.escapeHtml(r.avgSalary)}</span>
                    </div>
                </div>
                <div>
                    <a href="analyze.html?roleId=${r.id}" class="btn btn-outline-primary" style="width:100%;">
                        Analyze My Fit for This Role →
                    </a>
                </div>
            </div>
        `).join('');
    },

    // =========================================================================
    // MODALS & TOAST NOTIFICATIONS
    // =========================================================================
    openModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.add('active');
    },

    closeModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.remove('active');
    },

    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${this.escapeHtml(message)}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
