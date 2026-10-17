-- ====================================================================
-- SKILL GAP ANALYZER - DATABASE SCHEMA & SEED DATA
-- Database: MySQL 8.0+
-- ====================================================================

DROP DATABASE IF EXISTS skill_gap_db;
CREATE DATABASE skill_gap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skill_gap_db;

-- --------------------------------------------------------------------
-- 1. Job Roles Table
-- --------------------------------------------------------------------
CREATE TABLE job_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    avg_salary VARCHAR(50) NOT NULL,
    demand_level ENUM('Moderate', 'High', 'Very High') DEFAULT 'High',
    icon VARCHAR(50) DEFAULT 'code',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 2. Skills Catalog Table
-- --------------------------------------------------------------------
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. Users Table
-- --------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    target_role_id INT NULL,
    experience_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_target_role FOREIGN KEY (target_role_id) REFERENCES job_roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. Role Required Skills (Mapping & Weights)
-- --------------------------------------------------------------------
CREATE TABLE role_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    skill_id INT NOT NULL,
    importance ENUM('Mandatory', 'Recommended', 'Bonus') DEFAULT 'Mandatory',
    weight INT DEFAULT 3, -- 3: Mandatory, 2: Recommended, 1: Bonus
    min_proficiency ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    CONSTRAINT fk_role_skills_role FOREIGN KEY (role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_skill (role_id, skill_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. User Skills (Current Skills Inventory)
-- --------------------------------------------------------------------
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    years_experience DECIMAL(3,1) DEFAULT 1.0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_skill (user_id, skill_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 6. Learning Roadmap Catalog Table
-- --------------------------------------------------------------------
CREATE TABLE learning_roadmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT NOT NULL,
    step_number INT NOT NULL,
    phase_title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    estimated_duration VARCHAR(50) NOT NULL,
    resource_title VARCHAR(150),
    resource_url VARCHAR(255),
    resource_type VARCHAR(50) DEFAULT 'Tutorial',
    CONSTRAINT fk_roadmap_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. User Learning Progress Tracking Table
-- --------------------------------------------------------------------
CREATE TABLE user_learning_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'In Progress',
    progress_percent INT DEFAULT 0,
    target_completion_date DATE NULL,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_progress (user_id, skill_id)
) ENGINE=InnoDB;

-- ====================================================================
-- SEED DATA INSERTION
-- ====================================================================

-- 1. Insert Job Roles
INSERT INTO job_roles (id, title, department, description, avg_salary, demand_level, icon) VALUES
(1, 'Full Stack Java Developer', 'Software Engineering', 'Build robust, scalable enterprise web applications using Core Java, Spring Boot, Microservices, REST APIs, and modern frontend technologies.', '$105,000 - $145,000 / yr', 'Very High', 'coffee'),
(2, 'Frontend Developer', 'Web Engineering', 'Design and implement high-performance, responsive, and visually appealing user interfaces using HTML5, CSS3, JavaScript, and modern frontend frameworks.', '$90,000 - $130,000 / yr', 'High', 'layout'),
(3, 'Data Scientist & AI Engineer', 'Data & AI', 'Extract actionable intelligence from large datasets, develop predictive machine learning models, and deploy intelligent AI applications.', '$115,000 - $160,000 / yr', 'Very High', 'cpu'),
(4, 'DevOps & Cloud Engineer', 'Cloud & Infrastructure', 'Automate CI/CD pipelines, containerize applications with Docker, orchestrate with Kubernetes, and manage cloud infrastructure on AWS/Azure.', '$110,000 - $155,000 / yr', 'Very High', 'cloud'),
(5, 'Backend Developer', 'Software Engineering', 'Architect secure, high-throughput server-side applications, design relational databases, microservices, and optimize API performance.', '$100,000 - $140,000 / yr', 'High', 'server'),
(6, 'Cybersecurity Analyst', 'Information Security', 'Protect IT infrastructure, identify vulnerabilities, perform penetration testing, configure firewalls, and respond to cyber threats.', '$98,000 - $142,000 / yr', 'High', 'shield'),
(7, 'Android / Mobile Developer', 'Mobile Engineering', 'Develop high quality, user-centric native mobile applications for Android using Kotlin/Java and Android Jetpack libraries.', '$92,000 - $135,000 / yr', 'Moderate', 'smartphone'),
(8, 'Data Engineer', 'Data & Analytics', 'Design, build, and maintain data architectures, ETL pipelines, distributed data stores, and big data warehousing systems.', '$110,000 - $150,000 / yr', 'High', 'database');

-- 2. Insert Skills Catalog
INSERT INTO skills (id, name, category, difficulty, description) VALUES
(1, 'Core Java', 'Programming Languages', 'Intermediate', 'Object-Oriented Programming, Multithreading, Collections Framework, Streams API, and JVM memory management.'),
(2, 'Spring Boot', 'Frameworks & Libraries', 'Intermediate', 'Rapid application development framework for building production-ready standalone Java microservices.'),
(3, 'MySQL & Relational DBs', 'Databases', 'Beginner', 'Relational database design, ACID properties, complex SQL joins, indexing, and transaction management.'),
(4, 'RESTful APIs', 'Core Concepts', 'Intermediate', 'Architectural style for designing networked applications, HTTP methods, status codes, and JSON payload serialization.'),
(5, 'HTML5 & CSS3', 'Frontend', 'Beginner', 'Modern semantic markup, responsive design principles, Flexbox, Grid, and CSS animations.'),
(6, 'JavaScript (ES6+)', 'Programming Languages', 'Intermediate', 'Modern ECMAScript features, asynchronous programming, Promises, async/await, and DOM manipulation.'),
(7, 'Git & GitHub', 'Tools', 'Beginner', 'Distributed version control, branching strategies, merge conflict resolution, and collaborative pull requests.'),
(8, 'Docker & Containerization', 'Cloud & DevOps', 'Intermediate', 'Building container images, writing Dockerfiles, container networking, and multi-container Docker Compose.'),
(9, 'Kubernetes (K8s)', 'Cloud & DevOps', 'Advanced', 'Container orchestration, Pod lifecycle, Services, Ingress controllers, and automated cluster scaling.'),
(10, 'React.js', 'Frontend', 'Intermediate', 'Component-based UI architecture, Virtual DOM, React Hooks, State Management, and routing.'),
(11, 'Python', 'Programming Languages', 'Beginner', 'General-purpose programming, clean syntax, data structures, scripting, and OOP principles.'),
(12, 'Pandas & NumPy', 'Data & AI', 'Intermediate', 'Vectorized numerical computation, DataFrame operations, data cleaning, filtering, and aggregation.'),
(13, 'Machine Learning (Scikit-Learn)', 'Data & AI', 'Advanced', 'Supervised/unsupervised algorithms, regression, classification, cross-validation, and model evaluation.'),
(14, 'Deep Learning (PyTorch/TensorFlow)', 'Data & AI', 'Advanced', 'Neural networks, convolutional networks (CNN), transformers, backpropagation, and GPU acceleration.'),
(15, 'Linux & Shell Scripting', 'Cloud & DevOps', 'Intermediate', 'Command-line proficiency, file permissions, process monitoring, cron jobs, and Bash automation.'),
(16, 'AWS Cloud Foundations', 'Cloud & DevOps', 'Intermediate', 'Cloud compute (EC2), storage (S3), relational database service (RDS), IAM security, and VPC networking.'),
(17, 'CI/CD Pipelines (Jenkins/GitHub Actions)', 'Cloud & DevOps', 'Intermediate', 'Continuous integration, automated testing, artifact creation, and automated deployment pipelines.'),
(18, 'Hibernate & JPA', 'Frameworks & Libraries', 'Intermediate', 'Object-Relational Mapping (ORM), entity lifecycle, JPQL queries, lazy loading, and caching.'),
(19, 'Microservices Architecture', 'Core Concepts', 'Advanced', 'Decoupled service design, API Gateway, service discovery, distributed tracing, and fault tolerance.'),
(20, 'Network Security & Firewalls', 'Cybersecurity', 'Intermediate', 'OSI model, TCP/IP protocols, packet inspection, VPNs, IDS/IPS systems, and firewall configuration.'),
(21, 'Ethical Hacking & Penetration Testing', 'Cybersecurity', 'Advanced', 'Vulnerability scanning, OWASP Top 10 web vulnerabilities, SQL injection, XSS, and security auditing.'),
(22, 'Kotlin', 'Programming Languages', 'Intermediate', 'Concise modern language for Android, null safety, coroutines, and interoperability with Java.'),
(23, 'Android Jetpack & SDK', 'Mobile Engineering', 'Intermediate', 'Android Architecture Components, ViewModel, LiveData, Room persistence, and Navigation.'),
(24, 'Data Structures & Algorithms', 'Core Concepts', 'Intermediate', 'Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming, and Big-O time complexity.'),
(25, 'TypeScript', 'Frontend', 'Intermediate', 'Strongly typed superset of JavaScript, interfaces, generics, and compile-time error prevention.'),
(26, 'Apache Kafka', 'Data & Analytics', 'Advanced', 'Distributed event streaming platform, producers, consumers, partition rebalancing, and message brokers.'),
(27, 'MongoDB & NoSQL', 'Databases', 'Intermediate', 'Document-oriented database, schema flexibility, indexing, and aggregation pipelines.'),
(28, 'Redis & Caching Strategies', 'Databases', 'Intermediate', 'In-memory key-value data store, cache-aside pattern, session storage, and rate limiting.'),
(29, 'GraphQL', 'Core Concepts', 'Intermediate', 'Query language for APIs, declarative data fetching, schemas, resolvers, and avoiding over-fetching.'),
(30, 'System Design', 'Core Concepts', 'Advanced', 'Architecting highly available, fault-tolerant, horizontally scalable distributed systems.');

-- 3. Map Skills to Job Roles (with Importance & Weights)
-- Role 1: Full Stack Java Developer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(1, 1, 'Mandatory', 3, 'Intermediate'),   -- Core Java
(1, 2, 'Mandatory', 3, 'Intermediate'),   -- Spring Boot
(1, 3, 'Mandatory', 3, 'Intermediate'),   -- MySQL
(1, 4, 'Mandatory', 3, 'Intermediate'),   -- RESTful APIs
(1, 5, 'Mandatory', 2, 'Beginner'),       -- HTML5 & CSS3
(1, 6, 'Mandatory', 2, 'Intermediate'),   -- JavaScript
(1, 7, 'Recommended', 2, 'Beginner'),     -- Git
(1, 18, 'Mandatory', 3, 'Intermediate'),  -- Hibernate & JPA
(1, 8, 'Recommended', 2, 'Beginner'),     -- Docker
(1, 19, 'Recommended', 2, 'Intermediate'), -- Microservices
(1, 28, 'Bonus', 1, 'Beginner');          -- Redis

-- Role 2: Frontend Developer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(2, 5, 'Mandatory', 3, 'Intermediate'),   -- HTML5 & CSS3
(2, 6, 'Mandatory', 3, 'Intermediate'),   -- JavaScript
(2, 10, 'Mandatory', 3, 'Intermediate'),  -- React.js
(2, 25, 'Mandatory', 3, 'Intermediate'),  -- TypeScript
(2, 4, 'Mandatory', 2, 'Intermediate'),   -- RESTful APIs
(2, 7, 'Recommended', 2, 'Beginner'),     -- Git
(2, 29, 'Bonus', 1, 'Beginner');          -- GraphQL

-- Role 3: Data Scientist & AI Engineer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(3, 11, 'Mandatory', 3, 'Intermediate'),  -- Python
(3, 12, 'Mandatory', 3, 'Intermediate'),  -- Pandas & NumPy
(3, 13, 'Mandatory', 3, 'Advanced'),      -- Machine Learning
(3, 14, 'Recommended', 2, 'Intermediate'),-- Deep Learning
(3, 3, 'Mandatory', 2, 'Intermediate'),   -- MySQL
(3, 7, 'Recommended', 2, 'Beginner'),     -- Git
(3, 24, 'Recommended', 2, 'Intermediate');-- Data Structures

-- Role 4: DevOps & Cloud Engineer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(4, 15, 'Mandatory', 3, 'Intermediate'),  -- Linux & Shell Scripting
(4, 8, 'Mandatory', 3, 'Intermediate'),   -- Docker
(4, 9, 'Mandatory', 3, 'Intermediate'),   -- Kubernetes
(4, 16, 'Mandatory', 3, 'Intermediate'),  -- AWS Cloud Foundations
(4, 17, 'Mandatory', 3, 'Intermediate'),  -- CI/CD Pipelines
(4, 7, 'Mandatory', 2, 'Intermediate'),   -- Git
(4, 11, 'Recommended', 2, 'Beginner');    -- Python

-- Role 5: Backend Developer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(5, 1, 'Mandatory', 3, 'Intermediate'),   -- Core Java
(5, 2, 'Mandatory', 3, 'Intermediate'),   -- Spring Boot
(5, 3, 'Mandatory', 3, 'Intermediate'),   -- MySQL
(5, 4, 'Mandatory', 3, 'Intermediate'),   -- RESTful APIs
(5, 19, 'Mandatory', 3, 'Intermediate'),  -- Microservices
(5, 28, 'Recommended', 2, 'Intermediate'),-- Redis
(5, 30, 'Mandatory', 3, 'Intermediate'),  -- System Design
(5, 7, 'Recommended', 2, 'Beginner'),     -- Git
(5, 8, 'Bonus', 1, 'Beginner');           -- Docker

-- Role 6: Cybersecurity Analyst
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(6, 20, 'Mandatory', 3, 'Intermediate'),  -- Network Security & Firewalls
(6, 21, 'Mandatory', 3, 'Intermediate'),  -- Ethical Hacking
(6, 15, 'Mandatory', 3, 'Intermediate'),  -- Linux
(6, 11, 'Recommended', 2, 'Beginner'),    -- Python
(6, 7, 'Bonus', 1, 'Beginner');           -- Git

-- Role 7: Android / Mobile Developer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(7, 22, 'Mandatory', 3, 'Intermediate'),  -- Kotlin
(7, 23, 'Mandatory', 3, 'Intermediate'),  -- Android Jetpack
(7, 1, 'Recommended', 2, 'Beginner'),     -- Core Java
(7, 4, 'Mandatory', 2, 'Intermediate'),   -- RESTful APIs
(7, 7, 'Recommended', 2, 'Beginner');     -- Git

-- Role 8: Data Engineer
INSERT INTO role_skills (role_id, skill_id, importance, weight, min_proficiency) VALUES
(8, 11, 'Mandatory', 3, 'Intermediate'),  -- Python
(8, 3, 'Mandatory', 3, 'Advanced'),       -- MySQL
(8, 26, 'Mandatory', 3, 'Intermediate'),  -- Apache Kafka
(8, 27, 'Recommended', 2, 'Intermediate'),-- MongoDB
(8, 15, 'Recommended', 2, 'Intermediate'),-- Linux
(8, 8, 'Bonus', 1, 'Beginner');           -- Docker

-- 4. Insert Comprehensive Step-by-Step Learning Roadmaps for Skills
INSERT INTO learning_roadmaps (skill_id, step_number, phase_title, description, estimated_duration, resource_title, resource_url, resource_type) VALUES
-- Core Java (Skill 1)
(1, 1, 'Java Foundations & OOP Principles', 'Master variables, data types, loops, classes, objects, inheritance, polymorphism, encapsulation, and abstract classes.', '2 weeks', 'Oracle Java Documentation & Tutorials', 'https://docs.oracle.com/javase/tutorial/', 'Official Docs'),
(1, 2, 'Java Collections & Streams API', 'Deep dive into List, Set, Map interfaces, ArrayList vs LinkedList, HashMaps, lambda expressions, and functional stream processing.', '2 weeks', 'Java Collections Framework by freeCodeCamp', 'https://www.freecodecamp.org/news/java-collections-framework/', 'Tutorial'),
(1, 3, 'Multithreading & Exception Handling', 'Understand thread lifecycle, synchronization, concurrency utilities (Executors), and robust custom checked/unchecked exception handling.', '1-2 weeks', 'Java Concurrency in Practice Guide', 'https://www.baeldung.com/java-concurrency', 'Article / Guide'),

-- Spring Boot (Skill 2)
(2, 1, 'Spring Core & Dependency Injection', 'Understand Inversion of Control (IoC), Beans, Component Scanning, and @Autowired annotations.', '1-2 weeks', 'Spring Framework Quickstart', 'https://spring.io/quickstart', 'Official Docs'),
(2, 2, 'Building RESTful Web Services', 'Create controllers with @RestController, request mapping, status codes, path variables, and exception handling with @ControllerAdvice.', '2 weeks', 'Building REST services with Spring Boot', 'https://spring.io/guides/tutorials/rest/', 'Hands-on Tutorial'),
(2, 3, 'Data Persistence & Spring Data JPA', 'Connect to MySQL databases using CrudRepository and JpaRepository with automatic query generation.', '2 weeks', 'Accessing Data with JPA & MySQL', 'https://spring.io/guides/gs/accessing-data-jpa/', 'Official Tutorial'),

-- MySQL (Skill 3)
(3, 1, 'Relational Modeling & Basic SQL Queries', 'Master CREATE TABLE, foreign keys, PRIMARY KEY, INSERT, UPDATE, DELETE, and SELECT with WHERE filtering.', '1 week', 'W3Schools SQL Tutorial', 'https://www.w3schools.com/sql/', 'Interactive Practice'),
(3, 2, 'Advanced Joins, Grouping & Aggregations', 'Master INNER, LEFT, RIGHT joins, GROUP BY, HAVING, subqueries, and window functions.', '1-2 weeks', 'MySQL Tutorial for Beginners', 'https://www.mysqltutorial.org/', 'Tutorial'),
(3, 3, 'Indexing, Transactions & Performance', 'Index optimization (B-Tree), query EXPLAIN plans, ACID properties, isolation levels, and stored procedures.', '1 week', 'High Performance MySQL Guide', 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html', 'Documentation'),

-- RESTful APIs (Skill 4)
(4, 1, 'HTTP Protocol & REST Design Principles', 'Learn HTTP methods (GET, POST, PUT, DELETE, PATCH), status codes, statelessness, and resource URI naming.', '1 week', 'RESTful API Design Best Practices', 'https://restfulapi.net/', 'Guide'),
(4, 2, 'JSON Serialization & API Security', 'Payload validation, JWT tokens, Bearer authentication, CORS configuration, and Postman testing.', '1 week', 'freeCodeCamp API Development Guide', 'https://www.freecodecamp.org/news/rest-api-design-best-practices/', 'Tutorial'),

-- HTML5 & CSS3 (Skill 5)
(5, 1, 'Semantic HTML & Modern Web Standards', 'Semantic tags (header, nav, main, section, footer), accessible forms, and clean markup hierarchy.', '1 week', 'MDN Web Docs HTML Basics', 'https://developer.mozilla.org/en-US/docs/Learn/HTML', 'Documentation'),
(5, 2, 'Modern CSS: Flexbox & Grid Layouts', 'Build responsive fluid layouts with CSS Flexbox, Grid, media queries, and CSS custom variables.', '2 weeks', 'CSS Tricks Flexbox & Grid Guides', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', 'Interactive Guide'),

-- JavaScript (Skill 6)
(6, 1, 'Modern JavaScript Fundamentals (ES6+)', 'Arrow functions, destructuring, spread/rest operators, template literals, modules, and scope.', '2 weeks', 'JavaScript.info The Modern Tutorial', 'https://javascript.info/', 'Comprehensive Guide'),
(6, 2, 'Asynchronous JS: Promises & Fetch API', 'Event loop, asynchronous operations, Promises, async/await, and fetching data from backend REST APIs.', '2 weeks', 'MDN Asynchronous JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous', 'Documentation'),

-- Docker & Containerization (Skill 8)
(8, 1, 'Containers vs VMs & Docker CLI', 'Understand images vs containers, pull/run containers, volume mounting, and port forwarding.', '1 week', 'Docker 101 Tutorial', 'https://www.docker.com/101-tutorial/', 'Official Tutorial'),
(8, 2, 'Writing Production Dockerfiles & Compose', 'Multi-stage builds, caching layers, environment variables, and orchestrating app + db with docker-compose.yml.', '2 weeks', 'Docker Compose Official Documentation', 'https://docs.docker.com/compose/', 'Documentation'),

-- React.js (Skill 10)
(10, 1, 'React Components, Props & State', 'Functional components, JSX syntax, passing props, and managing reactive component state with useState.', '2 weeks', 'Official React Documentation', 'https://react.dev/learn', 'Official Tutorial'),
(10, 2, 'Lifecycle, Hooks & API Integration', 'useEffect hook, custom hooks, handling forms, lifting state up, and fetching backend data.', '2 weeks', 'Full React Course by freeCodeCamp', 'https://www.freecodecamp.org/news/tag/react/', 'Video & Articles'),

-- Python (Skill 11)
(11, 1, 'Python Syntax, Control Flow & Data Structures', 'Variables, lists, dicts, tuples, sets, list comprehensions, functions, and file I/O.', '2 weeks', 'Python Official Tutorial', 'https://docs.python.org/3/tutorial/', 'Official Docs'),
(11, 2, 'Object-Oriented Python & Modules', 'Classes, dunder methods, inheritance, packages, and virtual environments (venv/pip).', '1-2 weeks', 'Real Python OOP in Python', 'https://realpython.com/python3-object-oriented-programming/', 'Tutorial'),

-- Machine Learning (Skill 13)
(13, 1, 'Data Preprocessing & Exploratory Data Analysis', 'Handling missing data, feature scaling, encoding categorical variables, and train/test splits.', '2 weeks', 'Scikit-Learn Preprocessing Guide', 'https://scikit-learn.org/stable/modules/preprocessing.html', 'Documentation'),
(13, 2, 'Core ML Algorithms & Model Evaluation', 'Linear & Logistic Regression, Decision Trees, Random Forests, Confusion Matrix, and ROC-AUC curves.', '3 weeks', 'Coursera Machine Learning by Andrew Ng', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Course'),

-- Microservices Architecture (Skill 19)
(19, 1, 'Monolith to Microservices Principles', 'Domain-Driven Design (DDD), bounded contexts, single responsibility, and database-per-service.', '2 weeks', 'Microservices.io Architectural Patterns', 'https://microservices.io/', 'Architecture Guide'),
(19, 2, 'Inter-Service Communication & API Gateway', 'Synchronous REST/gRPC vs asynchronous messaging (Kafka), Spring Cloud Gateway, and Circuit Breakers (Resilience4j).', '2-3 weeks', 'Spring Cloud Microservices Guide', 'https://spring.io/projects/spring-cloud', 'Documentation');

-- 5. Insert Sample Demo Users (Password: 'demo123')
INSERT INTO users (id, full_name, email, password_hash, target_role_id, experience_level) VALUES
(1, 'Alex Morgan', 'alex@example.com', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', 1, 'Intermediate'),
(2, 'Sarah Chen', 'sarah@example.com', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', 2, 'Beginner');

-- 6. Insert Pre-existing Skills for Demo User (Alex Morgan - Target: Full Stack Java Developer)
-- Alex has: Core Java (Intermediate), HTML5 & CSS3 (Intermediate), JavaScript (Beginner), Git (Beginner), MySQL (Intermediate)
-- Alex lacks: Spring Boot, RESTful APIs, Hibernate & JPA, Docker, Microservices
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) VALUES
(1, 1, 'Intermediate', 2.0),  -- Core Java
(1, 3, 'Intermediate', 1.5),  -- MySQL
(1, 5, 'Intermediate', 2.0),  -- HTML5 & CSS3
(1, 6, 'Beginner', 1.0),      -- JavaScript
(1, 7, 'Beginner', 1.0);      -- Git & GitHub

-- 7. Insert Initial Learning Progress for Demo User
INSERT INTO user_learning_progress (user_id, skill_id, status, progress_percent, target_completion_date, notes) VALUES
(1, 2, 'In Progress', 40, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'Currently building a sample RESTful CRUD app using Spring Data JPA.'),
(1, 18, 'In Progress', 25, DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY), 'Studying entity mappings and lazy loading pitfalls.'),
(1, 8, 'Not Started', 0, DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY), 'Plan to start after finishing Spring Boot project.');
