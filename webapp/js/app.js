/**
 * Skill Gap Analyzer - Core Client Application JavaScript
 */

const App = {
    user: null,

    // =========================================================================
    // INITIALIZATION & GLOBAL HELPERS
    // =========================================================================
    async init() {
        await this.checkAuth();
        this.updateNavUI();
    },

    async checkAuth() {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success && data.data) {
                this.user = data.data;
            } else {
                this.user = null;
            }
        } catch (e) {
            this.user = null;
        }
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
    // AUTHENTICATION METHODS
    // =========================================================================
    async login(email, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                this.showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect') || 'dashboard.html';
                    window.location.href = redirect;
                }, 800);
            } else {
                this.showToast(data.message || 'Login failed', 'error');
            }
        } catch (err) {
            this.showToast('Server error during login. Please try again.', 'error');
        }
    },

    async register(fullName, email, password, targetRoleId, experienceLevel) {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, targetRoleId, experienceLevel })
            });
            const data = await res.json();
            if (data.success) {
                this.showToast('Account registered successfully! Welcome aboard!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            } else {
                this.showToast(data.message || 'Registration failed', 'error');
            }
        } catch (err) {
            this.showToast('Server error during registration.', 'error');
        }
    },

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            this.user = null;
            this.showToast('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 600);
        } catch (e) {
            window.location.href = 'login.html';
        }
    },

    // =========================================================================
    // DASHBOARD CONTROLLER
    // =========================================================================
    async loadDashboard() {
        try {
            const res = await fetch('/api/dashboard');
            const data = await res.json();
            if (!data.success) {
                if (res.status === 401) window.location.href = 'login.html';
                return;
            }

            const d = data.data;
            const gap = d.gapAnalysis;

            // Update user welcome
            const welcomeElem = document.getElementById('user-welcome-name');
            if (welcomeElem && d.user) welcomeElem.textContent = d.user.fullName;

            const roleElem = document.getElementById('user-target-role');
            if (roleElem && gap) roleElem.textContent = gap.roleTitle || 'Select Target Role';

            // Stats
            document.getElementById('stat-match-pct').textContent = (gap ? gap.matchPercentage : 0) + '%';
            document.getElementById('stat-my-skills').textContent = d.totalUserSkills;
            document.getElementById('stat-missing-skills').textContent = gap ? gap.missingSkillsCount : 0;
            document.getElementById('stat-in-progress').textContent = d.inProgressCount;

            // Circular Gauge
            this.renderCircularGauge(gap ? gap.matchPercentage : 0);

            // Match details
            if (gap) {
                document.getElementById('match-role-title').textContent = gap.roleTitle;
                document.getElementById('match-department').textContent = gap.department + ' • ' + (gap.avgSalary || '');
                
                const badge = document.getElementById('match-readiness-badge');
                badge.className = `match-badge badge-${gap.readinessBadgeColor || 'primary'}`;
                badge.textContent = gap.readinessLevel;

                document.getElementById('match-advice-text').textContent = gap.readinessAdvice;
                document.getElementById('match-weeks-to-ready').textContent = gap.estimatedWeeksToClose + ' weeks';
            }

            // Learning Tracker Table
            this.renderDashboardLearningItems(d.learningItems);

            // User Skills Preview
            this.renderDashboardSkills(d.userSkills);

        } catch (err) {
            console.error('Error loading dashboard:', err);
            this.showToast('Failed to load dashboard data.', 'error');
        }
    },

    renderCircularGauge(percentage) {
        const bar = document.getElementById('gauge-bar');
        const text = document.getElementById('gauge-percentage-text');
        if (!bar || !text) return;

        text.textContent = percentage + '%';
        // Stroke dasharray for 100 circumference in SVG path
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
    // MY SKILLS CONTROLLER
    // =========================================================================
    async loadMySkills() {
        try {
            const [userSkillsRes, catalogRes] = await Promise.all([
                fetch('/api/skills/user'),
                fetch('/api/skills')
            ]);

            const userSkillsData = await userSkillsRes.json();
            const catalogData = await catalogRes.json();

            if (userSkillsData.success) {
                this.renderMySkillsGrid(userSkillsData.data);
            }
            if (catalogData.success) {
                this.populateCatalogSelect(catalogData.data);
            }
        } catch (e) {
            this.showToast('Failed to load skills.', 'error');
        }
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
                        <span class="match-badge badge-primary" style="font-size:0.75rem;">${this.escapeHtml(s.skillCategory)}</span>
                        <span class="level-tag" style="background:#f1f5f9; color:var(--text-main); font-weight:700;">${this.escapeHtml(s.proficiencyLevel)}</span>
                        <span style="font-size:0.8rem; color:var(--text-muted);">${s.yearsExperience} yr${s.yearsExperience > 1 ? 's' : ''} exp</span>
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

        select.innerHTML = '<option value="">-- Choose from 30+ Standard Industry Skills --</option>' +
            catalog.map(s => `<option value="${s.id}" data-category="${this.escapeHtml(s.category)}">${this.escapeHtml(s.name)} (${this.escapeHtml(s.category)})</option>`).join('');
    },

    async saveSkillFromForm(e) {
        e.preventDefault();
        const skillId = document.getElementById('catalog-skill-select').value;
        const customName = document.getElementById('custom-skill-name').value.trim();
        const category = document.getElementById('custom-skill-category').value.trim();
        const proficiency = document.getElementById('skill-proficiency').value;
        const years = document.getElementById('skill-experience-years').value;

        if (!skillId && !customName) {
            this.showToast('Please select a catalog skill or enter a custom skill name.', 'warning');
            return;
        }

        const payload = {
            proficiencyLevel: proficiency,
            yearsExperience: parseFloat(years) || 1.0
        };

        if (skillId) {
            payload.skillId = parseInt(skillId);
        } else {
            payload.skillName = customName;
            payload.category = category || 'General';
        }

        try {
            const res = await fetch('/api/skills/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                this.showToast('Skill added to your profile!', 'success');
                this.closeModal('add-skill-modal');
                document.getElementById('add-skill-form').reset();
                this.loadMySkills();
            } else {
                this.showToast(data.message || 'Failed to save skill', 'error');
            }
        } catch (err) {
            this.showToast('Error saving skill', 'error');
        }
    },

    async deleteSkill(skillId, skillName) {
        if (!confirm(`Are you sure you want to remove "${skillName}" from your skills?`)) return;

        try {
            const res = await fetch(`/api/skills/user?skillId=${skillId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                this.showToast(`Removed "${skillName}"`, 'success');
                this.loadMySkills();
            } else {
                this.showToast(data.message || 'Failed to delete skill', 'error');
            }
        } catch (e) {
            this.showToast('Error deleting skill', 'error');
        }
    },

    // =========================================================================
    // SKILL GAP ANALYSIS CONTROLLER
    // =========================================================================
    async initAnalyzePage() {
        try {
            // Load all roles for selector
            const resRoles = await fetch('/api/roles');
            const dataRoles = await resRoles.json();
            if (dataRoles.success) {
                const select = document.getElementById('target-role-dropdown');
                if (select) {
                    select.innerHTML = dataRoles.data.map(r => `
                        <option value="${r.id}">${this.escapeHtml(r.title)} (${this.escapeHtml(r.department)})</option>
                    `).join('');
                }
            }

            // Check if URL specifies roleId
            const urlParams = new URLSearchParams(window.location.search);
            const roleIdParam = urlParams.get('roleId');
            if (roleIdParam) {
                const select = document.getElementById('target-role-dropdown');
                if (select) select.value = roleIdParam;
            }

            await this.runAnalysis();
        } catch (e) {
            this.showToast('Failed to initialize analysis.', 'error');
        }
    },

    async runAnalysis() {
        const select = document.getElementById('target-role-dropdown');
        const roleId = select ? select.value : '';

        try {
            const url = roleId ? `/api/analyze?roleId=${roleId}` : '/api/analyze';
            const res = await fetch(url);
            const data = await res.json();

            if (!data.success) {
                this.showToast(data.message || 'Analysis failed', 'error');
                return;
            }

            const result = data.data;

            // Render Overview Card
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

            // Render Matched Skills
            this.renderMatchedSkills(result.matchedSkills);

            // Render Missing Skills
            this.renderMissingSkills(result.missingSkills);

            // Render Transferable Skills
            this.renderTransferableSkills(result.transferableSkills);

            // Render Roadmap preview
            this.renderRoadmapPreview(result.recommendedRoadmap);

        } catch (e) {
            console.error('Error running analysis:', e);
            this.showToast('Error running skill gap analysis', 'error');
        }
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
            const data = await res.json();
            if (data.success) {
                this.showToast(data.message, 'success');
            } else {
                this.showToast(data.message || 'Failed to update target role', 'error');
            }
        } catch (e) {
            this.showToast('Server error setting target role', 'error');
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
    // LEARNING ROADMAP & PROGRESS CONTROLLER
    // =========================================================================
    async loadRoadmapPage() {
        try {
            const res = await fetch('/api/analyze');
            const data = await res.json();
            if (!data.success) {
                this.showToast('Failed to load roadmap.', 'error');
                return;
            }

            const result = data.data;
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

            // Group steps by skill
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

        } catch (e) {
            console.error('Error loading roadmap:', e);
            this.showToast('Error loading roadmap.', 'error');
        }
    },

    async enrollInLearning(skillId, skillName) {
        try {
            const res = await fetch('/api/progress/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skillId,
                    status: 'In Progress',
                    progressPercent: 10,
                    notes: `Started learning ${skillName}`
                })
            });
            const data = await res.json();
            if (data.success) {
                this.showToast(`Enrolled "${skillName}" into your Learning Tracker! 🎯`, 'success');
            } else {
                this.showToast(data.message || 'Failed to enroll skill', 'error');
            }
        } catch (e) {
            this.showToast('Error enrolling skill', 'error');
        }
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
        const skillId = document.getElementById('update-skill-id').value;
        const status = document.getElementById('update-progress-status').value;
        const progressPercent = parseInt(document.getElementById('update-progress-percent').value);
        const notes = document.getElementById('update-progress-notes').value.trim();

        try {
            const res = await fetch('/api/progress/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId, status, progressPercent, notes })
            });
            const data = await res.json();
            if (data.success) {
                this.showToast('Learning progress updated!', 'success');
                this.closeModal('update-progress-modal');
                if (window.location.pathname.includes('dashboard')) {
                    this.loadDashboard();
                }
            } else {
                this.showToast(data.message || 'Failed to update progress', 'error');
            }
        } catch (e) {
            this.showToast('Error updating progress', 'error');
        }
    },

    async completeSkill(skillId) {
        if (!confirm('Mark this skill as 100% completed? It will be automatically added to your profile skills and will raise your job readiness score!')) return;

        try {
            const res = await fetch('/api/progress/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId })
            });
            const data = await res.json();
            if (data.success) {
                this.showToast(data.message, 'success');
                this.loadDashboard();
            } else {
                this.showToast(data.message || 'Failed to complete skill', 'error');
            }
        } catch (e) {
            this.showToast('Error completing skill', 'error');
        }
    },

    // =========================================================================
    // ROLES EXPLORER CONTROLLER
    // =========================================================================
    async loadRolesPage() {
        try {
            const res = await fetch('/api/roles');
            const data = await res.json();
            if (!data.success) return;

            const container = document.getElementById('roles-grid');
            if (!container) return;

            container.innerHTML = data.data.map(r => `
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
        } catch (e) {
            this.showToast('Failed to load job roles.', 'error');
        }
    },

    // =========================================================================
    // MODALS & TOAST NOTIFICATION HELPERS
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
