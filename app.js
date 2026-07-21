document.addEventListener('DOMContentLoaded', () => {
  // Wizard state variables
  let currentStep = 1;
  let isCommitted = false;
  let addedSources = [];

  // Infrastructure item counts
  let serversCount = 85;
  let domainsCount = 9;
  let databasesCount = 3;

  // Step 3 Instances Data Model (30 Realistic Entries)
  const instancesData = [
    { id: 1, name: "vizo361-prod", host: "vizo361 @ vizo361.ai", confidence: "High Confidence", env: "PROD", type: "shared", tags: ["product-websites", "vizo_api", "vizo361_ui", "vizo361.ai", "shared infra"], components: [
      { name: "product-websites", sub: "vizo361.ai ↗", count: "1 app" },
      { name: "vizo_api", sub: "api.vizo361.ai ↗", count: "1 app", isAPI: true },
      { name: "vizo361_ui", sub: ["app.vizo361.ai ↗", "admin.vizo361.ai ↗"], count: "2 apps", isAPI: true },
      { name: "l4", sub: "beta.vizo361.ai ↗", count: "1 app" }
    ], accepted: false, expanded: true },
    { id: 2, name: "vizo361-test", host: "vizo361 @ vizo361.ai", confidence: "High Confidence", env: "TEST", type: "shared", tags: ["l4", "node_test_ui", "node_test_api", "vizo361.ai", "shared infra"], components: [
      { name: "node_test_ui", sub: "test.vizo361.ai ↗", count: "1 app" },
      { name: "node_test_api", sub: "test-api.vizo361.ai ↗", count: "1 app", isAPI: true }
    ], accepted: false, expanded: false },
    { id: 3, name: "vizo361-uat", host: "vizo361 @ vizo361.ai", confidence: "High Confidence", env: "UAT", type: "shared", tags: ["l4", "vizo-uat", "vizo361.ai", "shared infra"], components: [
      { name: "vizo-uat", sub: "uat.vizo361.ai ↗", count: "1 app" }
    ], accepted: false, expanded: false },
    { id: 4, name: "pro-prod", host: "pro @ proeffico.ai", confidence: "High Confidence", env: "PROD", type: "shared", tags: ["ws_bot_almighty", "proeffico.ai", "shared infra"], components: [
      { name: "ws_bot_almighty", sub: "bot.proeffico.ai ↗", count: "1 app" }
    ], accepted: false, expanded: false },
    { id: 5, name: "vizo361-demo", host: "vizo361 @ vizo361.ai", confidence: "High Confidence", env: "DEMO", type: "shared", tags: ["vizo_demo_instance", "vizo361.ai", "shared infra"], components: [
      { name: "vizo_demo_instance", sub: "demo.vizo361.ai ↗", count: "1 app" }
    ], accepted: false, expanded: false },
    { id: 6, name: "afms-prod", host: "afms @ afms.ai", confidence: "High Confidence", env: "PROD", type: "dedicated", tags: ["afms_main", "afms.ai"], components: [{ name: "afms_main", sub: "afms.ai ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 7, name: "api-gateway-prod", host: "gateway @ uplink.io", confidence: "High Confidence", env: "PROD", type: "isolated", tags: ["kong_gateway", "uplink.io"], components: [{ name: "kong_gateway", sub: "api.uplink.io ↗", count: "1 app", isAPI: true }], accepted: false, expanded: false },
    { id: 8, name: "vault-secrets-prod", host: "vault @ uplink.io", confidence: "High Confidence", env: "PROD", type: "isolated", tags: ["hashicorp_vault", "vault.uplink.io"], components: [{ name: "hashicorp_vault", sub: "vault.uplink.io ↗", count: "1 app" }], accepted: false, expanded: false },
    
    // Needs Review instances (22 items)
    { id: 9, name: "pro-test", host: "pro @ proeffico.ai", confidence: "Needs Review", env: "TEST", type: "shared", tags: ["ws_bot_testing", "proeffico.ai"], components: [{ name: "ws_bot_testing", sub: "test-bot.proeffico.ai ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 10, name: "pro-uat", host: "pro @ proeffico.ai", confidence: "Needs Review", env: "UAT", type: "shared", tags: ["ws_bot_uat", "proeffico.ai"], components: [{ name: "ws_bot_uat", sub: "uat-bot.proeffico.ai ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 11, name: "afms-test", host: "afms @ afms.ai", confidence: "Needs Review", env: "TEST", type: "shared", tags: ["afms_test_node", "afms.ai"], components: [{ name: "afms_test_node", sub: "test.afms.ai ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 12, name: "afms-uat", host: "afms @ afms.ai", confidence: "Needs Review", env: "UAT", type: "shared", tags: ["afms_uat_node", "afms.ai"], components: [{ name: "afms_uat_node", sub: "uat.afms.ai ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 13, name: "auth-service-prod", host: "auth @ auth-server", confidence: "Needs Review", env: "PROD", type: "dedicated", tags: ["keycloak_auth", "auth.net"], components: [{ name: "keycloak_auth", sub: "auth.net ↗", count: "1 app", isAPI: true }], accepted: false, expanded: false },
    { id: 14, name: "payment-srv-prod", host: "payment @ pay-gateway", confidence: "Needs Review", env: "PROD", type: "isolated", tags: ["stripe_bridge", "payments.io"], components: [{ name: "stripe_bridge", sub: "stripe.payments.io ↗", count: "1 app", isAPI: true }], accepted: false, expanded: false },
    { id: 15, name: "billing-srv-prod", host: "billing @ billing-server", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["invoice_core", "billing.io"], components: [{ name: "invoice_core", sub: "billing.io ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 16, name: "dashboard-prod", host: "web @ web-node", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["user_dashboard", "dashboard.net"], components: [{ name: "user_dashboard", sub: "dashboard.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 17, name: "notif-srv-test", host: "notif @ mail-node", confidence: "Needs Review", env: "TEST", type: "shared", tags: ["mailer_test", "notifications.net"], components: [{ name: "mailer_test", sub: "test.notifications.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 18, name: "database-cluster-prod", host: "db @ mysql-cluster", confidence: "Needs Review", env: "PROD", type: "dedicated", tags: ["mysql_master", "db.local"], components: [{ name: "mysql_master", sub: "master.db.local ↗", count: "1 database" }], accepted: false, expanded: false },
    { id: 19, name: "cache-cluster-prod", host: "redis @ redis-node", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["redis_leader", "cache.local"], components: [{ name: "redis_leader", sub: "leader.cache.local ↗", count: "1 database" }], accepted: false, expanded: false },
    { id: 20, name: "logging-es-prod", host: "elastic @ log-node", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["es_cluster", "logs.io"], components: [{ name: "es_cluster", sub: "es.logs.io ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 21, name: "monitoring-prom-prod", host: "prom @ monitor-node", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["prometheus_core", "monitor.net"], components: [{ name: "prometheus_core", sub: "metrics.monitor.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 22, name: "jenkins-cicd", host: "jenkins @ ci-node", confidence: "Needs Review", env: "DEMO", type: "shared", tags: ["jenkins_master", "ci.net"], components: [{ name: "jenkins_master", sub: "jenkins.ci.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 23, name: "vpn-gateway", host: "vpn @ gateway-node", confidence: "Needs Review", env: "PROD", type: "isolated", tags: ["openvpn_core", "vpn.net"], components: [{ name: "openvpn_core", sub: "vpn.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 24, name: "jump-bastion", host: "bastion @ ssh-node", confidence: "Needs Review", env: "PROD", type: "isolated", tags: ["ssh_bastion", "bastion.net"], components: [{ name: "ssh_bastion", sub: "bastion.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 25, name: "mail-server", host: "postfix @ postfix-node", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["postfix_mail", "mail.net"], components: [{ name: "postfix_mail", sub: "mail.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 26, name: "kafka-cluster-prod", host: "kafka @ kafka-node", confidence: "Needs Review", env: "PROD", type: "dedicated", tags: ["kafka_broker_1", "queue.local"], components: [{ name: "kafka_broker_1", sub: "broker1.queue.local ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 27, name: "k8s-master-prod", host: "k8s @ master-node", confidence: "Needs Review", env: "PROD", type: "dedicated", tags: ["kubernetes_api", "k8s.local"], components: [{ name: "kubernetes_api", sub: "api.k8s.local ↗", count: "1 app", isAPI: true }], accepted: false, expanded: false },
    { id: 28, name: "k8s-node-1", host: "k8s @ node-1", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["kubelet_worker", "k8s.local"], components: [{ name: "kubelet_worker", sub: "node1.k8s.local ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 29, name: "k8s-node-2", host: "k8s @ node-2", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["kubelet_worker_2", "k8s.local"], components: [{ name: "kubelet_worker_2", sub: "node2.k8s.local ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 30, name: "sandbox-testing", host: "sandbox @ test-node", confidence: "Needs Review", env: "TEST", type: "shared", tags: ["isolated_sandbox", "sandbox.net"], components: [{ name: "isolated_sandbox", sub: "sandbox.net ↗", count: "1 app" }], accepted: false, expanded: false },
    { id: 31, name: "maximpro-prod", host: "maximpro @ maximpro.ai", confidence: "Needs Review", env: "PROD", type: "shared", tags: ["maximpro.ai", "shared infra"], components: [{ name: "maximpro_app", sub: "maximpro.ai ↗", count: "1 app" }], accepted: false, expanded: false }
  ];

  // Step 4 Projects Data Model
  const projectsData = [
    {
      id: "proj-1",
      name: "vizo361",
      domain: "vizo361.ai",
      type: "dedicated",
      instances: ["vizo361-prod", "vizo361-test", "vizo361-uat", "vizo361-demo"],
      accepted: false
    },
    {
      id: "proj-2",
      name: "maximpro",
      domain: "maximpro.ai",
      type: "shared",
      instances: ["maximpro-prod"],
      accepted: false
    }
  ];

  let currentProjectsTab = "pending";
  let projectsSearchQuery = "";
  let editingProjectId = null;

  // Step 5 Clients Data Model
  const clientsData = [
    { id: "cli-1", name: "Acme Corp", email: "billing@acme.com", type: "External Tenant", sla: "Gold" },
    { id: "cli-2", name: "Initech", email: "contact@initech.com", type: "External Tenant", sla: "Silver" },
    { id: "cli-3", name: "Internal Security", email: "secops@uplink.io", type: "Internal Department", sla: "Gold" }
  ];

  // Active Instances Tab Filter (starts at High Confidence)
  let currentInstancesTab = "high-conf";
  let instancesSearchQuery = "";
  let editingInstanceId = null;

  // Onboarding commits history state array
  let commitsHistory = [];

  function renderCommitsHistory() {
    const containers = [
      document.getElementById('recent-commits-container'),
      document.getElementById('settings-commits-container')
    ].filter(Boolean);

    if (containers.length === 0) return;

    containers.forEach(container => {
      if (commitsHistory.length === 0) {
        if (container.id === 'settings-commits-container') {
          container.innerHTML = `<div class="settings-card" style="border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 3rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No commits performed yet. Complete the Discovery Onboarding process to create a commit audit log.</div>`;
        } else {
          container.innerHTML = '';
        }
        return;
      }

      container.innerHTML = commitsHistory.map(commit => {
        return `
          <div class="recent-commit-card">
            <div class="commit-card-info-left">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <code style="font-family: var(--font-mono); font-weight: 700; color: var(--cyber-cyan); font-size: 0.85rem; letter-spacing: 0.5px;">${commit.id}</code>
                <span class="commit-status-success">${commit.status}</span>
              </div>
              <div class="commit-card-meta" style="margin-top: 0.4rem;">
                <span><strong>Operator:</strong> ${commit.operator}</span>
                <span class="recent-commit-divider">|</span>
                <span><strong>Timestamp:</strong> ${commit.timestamp}</span>
                <span class="recent-commit-divider">|</span>
                <span class="commit-scope-badge">${commit.servers} Servers</span>
                <span class="commit-scope-badge">${commit.domains} Domains</span>
                <span class="commit-scope-badge">${commit.databases} Databases</span>
                <span class="commit-scope-badge">${commit.subdomains} Subdomains</span>
              </div>
            </div>
            
            <!-- Download Report Dropdown Wrapper -->
            <div class="commit-report-dropdown-wrapper" style="position: relative;">
              <button class="download-commit-report-btn" data-commit-id="${commit.id}" style="background: none; border: 1px solid var(--border-cyber); color: var(--cyber-cyan); font-size: 0.72rem; font-weight: bold; padding: 0.35rem 0.88rem; border-radius: 20px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.35rem;">
                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" stroke-width="3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download Report</span>
                <span style="font-size: 0.6rem; margin-left: 0.15rem; opacity: 0.8;">▼</span>
              </button>
              <div class="commit-report-dropdown-menu hidden">
                <div class="commit-report-option" data-format="txt" data-commit-id="${commit.id}">
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="var(--cyber-cyan)" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>Download as TXT (.txt)</span>
                </div>
                <div class="commit-report-option" data-format="pdf" data-commit-id="${commit.id}">
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#ef4444" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>Download as PDF (.pdf)</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Bind dropdown toggle & option clicks
      container.querySelectorAll('.commit-report-dropdown-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.download-commit-report-btn');
        const menu = wrapper.querySelector('.commit-report-dropdown-menu');

        if (btn && menu) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.commit-report-dropdown-menu').forEach(m => {
              if (m !== menu) m.classList.add('hidden');
            });
            menu.classList.toggle('hidden');
          });

          menu.querySelectorAll('.commit-report-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
              e.stopPropagation();
              const commitId = opt.getAttribute('data-commit-id');
              const format = opt.getAttribute('data-format');
              menu.classList.add('hidden');
              downloadCommitReport(commitId, format);
            });
          });
        }
      });
    });
  }

  // Close commit report dropdowns on document click
  document.addEventListener('click', () => {
    document.querySelectorAll('.commit-report-dropdown-menu').forEach(m => m.classList.add('hidden'));
  });

  function downloadCommitReport(commitId, format = 'txt') {
    const commit = commitsHistory.find(c => c.id === commitId);
    if (!commit) return;

    if (format === 'pdf') {
      const pdfContainer = document.createElement('div');
      pdfContainer.style.padding = '25px 30px';
      pdfContainer.style.background = '#ffffff';
      pdfContainer.style.color = '#0f172a';
      pdfContainer.style.fontFamily = "'Outfit', sans-serif";
      pdfContainer.style.width = '650px';

      pdfContainer.innerHTML = `
        <div style="border-bottom: 3px solid #00f2fe; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800;">UPLINK INFRASTRUCTURE COMMIT REPORT</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Official Audit Record · Entity Graph Engine</p>
          </div>
          <div style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 11px; font-family: monospace;">${commit.status}</div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <div><strong>Commit ID:</strong> <code style="background: #cbd5e1; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${commit.id}</code></div>
            <div><strong>Timestamp:</strong> ${commit.timestamp}</div>
            <div><strong>Operator:</strong> ${commit.operator}</div>
            <div><strong>Verification:</strong> <span style="color: #16a34a; font-weight: bold;">PASSED</span></div>
          </div>
        </div>

        <h3 style="color: #0f172a; font-size: 14px; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Scope Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Resource Type</th>
              <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Quantity</th>
              <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Verification State</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Servers</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold;">${commit.servers}</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #16a34a;">Ingested & Verified</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Databases</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold;">${commit.databases}</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #16a34a;">Connected & Synced</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Domains</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold;">${commit.domains}</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #16a34a;">Verified DNS</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">Subdomains</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold;">${commit.subdomains}</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #16a34a;">Topology Inferred</td>
            </tr>
          </tbody>
        </table>

        <div style="border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 11px; color: #64748b; text-align: center;">
          Security Encryption Standard: AES-256-GCM · Automated Audit Log by Uplink Entity Graph Engine
        </div>
      `;

      document.body.appendChild(pdfContainer);

      if (window.html2pdf) {
        const opt = {
          margin:       0.4,
          filename:     `${commit.id}-report.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(pdfContainer).save().then(() => {
          document.body.removeChild(pdfContainer);
          showToast(`PDF report downloaded for commit ${commit.id}`, true);
        });
      } else {
        const printWin = window.open('', '_blank');
        printWin.document.write(`<html><head><title>${commit.id}-report</title></head><body>${pdfContainer.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.focus();
        printWin.print();
        printWin.close();
        document.body.removeChild(pdfContainer);
        showToast(`Printed PDF report for commit ${commit.id}`, true);
      }
      return;
    }

    const reportContent = `==================================================
UPLINK INFRASTRUCTURE COMMIT REPORT
==================================================
Commit ID:   ${commit.id}
Timestamp:   ${commit.timestamp}
Operator:    ${commit.operator}
Status:      ${commit.status}

Scope Summary:
- Servers:    ${commit.servers} Ingested & Verified
- Databases:  ${commit.databases} Connected & Verified
- Domains:    ${commit.domains} Verified
- Subdomains: ${commit.subdomains} Verified
- Incidents:  ${commit.incidents || 0} Active Alerts Handled

Security Context:
- Encryption Standard: AES-256-GCM
- Agent Handshake Status: SECURE / VERIFIED
- Target Remediation State: ACTIVE / SYNCED

This is an automated audit report generated by the Uplink entity graph engine.
==================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${commitId}-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`TXT report downloaded for commit ${commitId}`, true);
  }

  // Custom Toast notification
  const showToast = (message, isSuccess = false) => {
    let toast = document.querySelector('.uplink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'uplink-toast';
      document.body.appendChild(toast);
      
      toast.style.position = 'fixed';
      toast.style.top = '84px';
      toast.style.right = '2rem';
      toast.style.backdropFilter = 'blur(8px)';
      toast.style.padding = '0.85rem 1.4rem';
      toast.style.borderRadius = '8px';
      toast.style.fontFamily = "'Outfit', sans-serif";
      toast.style.fontSize = '0.9rem';
      toast.style.zIndex = '1100';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.transform = 'translateX(calc(100% + 2rem))';
      toast.style.opacity = '0';
    }
    
    if (isSuccess) {
      toast.style.background = 'rgba(5, 255, 196, 0.15)';
      toast.style.border = '1px solid #05ffc4';
      toast.style.color = '#05ffc4';
      toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(5, 255, 196, 0.2)';
    } else {
      toast.style.background = 'rgba(9, 15, 30, 0.85)';
      toast.style.border = '1px solid rgba(0, 242, 254, 0.3)';
      toast.style.color = '#00f2fe';
      toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.15)';
    }
    
    toast.textContent = message;
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 50);
    
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateX(calc(100% + 2rem))';
      toast.style.opacity = '0';
    }, 3500);
  };

  // Generate additional assets dynamically to match full counts (85 servers, 31 domains, 3 databases)
  (function generateAssets() {
    // 1. Servers (80 more)
    const serversList = document.querySelector('#panel-servers .infra-rows-list');
    if (serversList) {
      const serverNames = [
        "app-srv-01", "app-srv-02", "app-srv-03", "app-srv-04", "app-srv-05",
        "db-replica-01", "db-replica-02", "cache-node-01", "cache-node-02", "cache-node-03",
        "auth-srv-prod", "auth-srv-test", "notif-node-prod", "notif-node-test", "payment-gateway",
        "search-es-01", "search-es-02", "analytics-srv", "logging-aggregator", "k8s-master-01",
        "k8s-worker-01", "k8s-worker-02", "k8s-worker-03", "k8s-worker-04", "k8s-worker-05",
        "bastion-host", "vpn-gateway", "ingress-controller-01", "ingress-controller-02", "load-balancer-ext",
        "load-balancer-int", "staging-app-01", "staging-app-02", "staging-db", "dev-box-pranav",
        "dev-box-alice", "dev-box-bob", "jenkins-ci-master", "jenkins-worker-01", "jenkins-worker-02",
        "prometheus-metrics", "grafana-dash", "alertmanager-srv", "backup-vault-01", "backup-vault-02",
        "mail-relay", "dns-primary", "dns-secondary", "dhcp-server", "ftp-file-share",
        "proxy-nginx-01", "proxy-nginx-02", "cdn-edge-01", "cdn-edge-02", "cdn-edge-03",
        "api-gateway-prod", "api-gateway-stage", "websocket-relay-01", "websocket-relay-02", "background-worker-01",
        "background-worker-02", "background-worker-03", "task-scheduler", "message-broker-01", "message-broker-02",
        "session-store-01", "session-store-02", "user-profile-srv", "product-catalog-srv", "order-processor",
        "inventory-manager", "recommendation-engine", "ml-inference-01", "ml-inference-02", "data-warehouse-01",
        "data-warehouse-02", "spark-master", "spark-worker-01", "spark-worker-02", "reporting-srv"
      ];
      
      serverNames.forEach((name, idx) => {
        const serverId = `srv-gen-${idx + 6}`;
        const row = document.createElement('div');
        row.className = 'infra-row';
        row.setAttribute('data-id', serverId);
        row.innerHTML = `
          <div class="row-left">
            <div class="row-icon server-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2">
                <rect x="2" y="2" width="20" height="6" rx="1" />
                <rect x="2" y="9" width="20" height="6" rx="1" />
                <rect x="2" y="16" width="20" height="6" rx="1" />
              </svg>
            </div>
            <div class="row-meta">
              <span class="row-name">${name}</span>
              <span class="row-sub">server</span>
            </div>
            <span class="status-pill active-pill">active</span>
          </div>
          <div class="row-actions">
            <button class="action-confirm-btn"><span class="check-icon">✓</span> Confirm</button>
            <button class="action-quarantine-btn"><span class="cross-icon">⊘</span> Quarantine</button>
          </div>
        `;
        serversList.appendChild(row);
      });
    }

    // 2. Domains & Apps (20 more)
    const domainsList = document.querySelector('#panel-domains .infra-rows-list');
    if (domainsList) {
      const extraDomains = [
        { domain: "uplinksecurity.com", subs: ["portal", "mx", "auth"] },
        { domain: "internal-metrics.net", subs: ["grafana", "prometheus"] },
        { domain: "customer-portal.io", subs: ["billing", "support", "docs"] },
        { domain: "devops-pipeline.org", subs: ["jenkins", "registry"] },
        { domain: "api-hub.net", subs: ["v1", "v2", "sandbox"] },
        { domain: "static-assets.net", subs: ["cdn"] }
      ];
      
      extraDomains.forEach((group, groupIdx) => {
        const block = document.createElement('div');
        block.className = 'domain-block collapsed';
        block.setAttribute('data-domain', group.domain);
        
        const domainRowId = `dom-gen-${groupIdx}`;
        let subsHtml = "";
        group.subs.forEach((sub, subIdx) => {
          const subRowId = `sub-gen-${groupIdx}-${subIdx}`;
          subsHtml += `
            <div class="infra-row sub-row" data-id="${subRowId}">
              <div class="row-left">
                <div class="row-icon app-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div class="row-meta">
                  <span class="row-name">${sub}.${group.domain}</span>
                  <span class="row-sub">app / URL</span>
                </div>
                <span class="status-pill active-pill">active</span>
              </div>
              <div class="row-actions">
                <button class="action-confirm-btn"><span class="check-icon">✓</span> Confirm</button>
                <button class="action-quarantine-btn"><span class="cross-icon">⊘</span> Quarantine</button>
              </div>
            </div>
          `;
        });
        
        block.innerHTML = `
          <div class="infra-row domain-row" data-id="${domainRowId}">
            <div class="row-left">
              <div class="row-icon domain-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div class="row-meta">
                <span class="row-name font-bold">${group.domain}</span>
                <span class="row-sub">cert -</span>
              </div>
              <span class="status-pill mapped-pill">mapped</span>
              <span class="expand-indicator">▼</span>
            </div>
            <div class="row-actions">
              <button class="action-confirm-btn"><span class="check-icon">✓</span> Confirm</button>
              <button class="action-quarantine-btn"><span class="cross-icon">⊘</span> Quarantine</button>
            </div>
          </div>
          <div class="nested-subdomains">
            <!-- Select All Subdomains Option -->
            <div class="confirm-all-row" style="padding: 0.5rem 1.5rem; display: flex; justify-content: flex-end; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
              <button class="confirm-all-subs-btn">
                ✓ Confirm All Subdomains
              </button>
            </div>
            ${subsHtml}
          </div>
        `;
        domainsList.appendChild(block);
      });
    }

    // 3. Databases (1 more)
    const databasesList = document.querySelector('#panel-databases .infra-rows-list');
    if (databasesList) {
      const row = document.createElement('div');
      row.className = 'infra-row';
      row.setAttribute('data-id', 'db-3');
      row.innerHTML = `
        <div class="row-left">
          <div class="row-icon database-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
            </svg>
          </div>
          <div class="row-meta">
            <span class="row-name">billing_history_postgres</span>
            <span class="row-sub">postgres replica</span>
          </div>
          <span class="status-pill active-pill">active</span>
        </div>
        <div class="row-actions">
          <button class="action-confirm-btn"><span class="check-icon">✓</span> Confirm</button>
          <button class="action-quarantine-btn"><span class="cross-icon">⊘</span> Quarantine</button>
        </div>
      `;
      databasesList.appendChild(row);
    }
  })();

  // Select DOM Elements
  const stepCards = document.querySelectorAll('.step-card');
  const actionBtn = document.querySelector('.controls-area .primary-btn');
  const backBtn = document.getElementById('back-btn');
  const stepViews = document.querySelectorAll('.step-view');
  const ingestedSection = document.querySelector('.ingested-section');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const navLinks = document.querySelectorAll('.nav-menu .nav-item');
  const profileSection = document.querySelector('.profile-section');
  const darkmodeToggle = document.querySelector('.darkmode-toggle');
  const onboardingNotice = document.getElementById('onboarding-notice');
  const controlsLeftText = document.getElementById('controls-left-text');

  // Infrastructure panel elements
  const infraTabButtons = document.querySelectorAll('.infra-tab-btn');
  const infraPanels = document.querySelectorAll('.infra-panel');
  const domainBlocks = document.querySelectorAll('.domain-block');

  // Step names and description titles
  const stepNames = ["Sources", "Infrastructure", "Instances", "Projects", "Clients", "Review & commit"];
  const buttonTexts = [
    "Start with infrastructure",
    "Proceed to instances",
    "On to projects",
    "Proceed to clients",
    "Proceed to review & commit",
    "Commit & Produce Graph",
    "Onboarding Completed"
  ];

  // Update Ingested From Section counts dynamically
  function updateIngestedStats() {
    const totalServers = document.querySelectorAll('#panel-servers .infra-row').length;
    const totalDatabases = document.querySelectorAll('#panel-databases .infra-row').length;
    const totalDomains = document.querySelectorAll('#panel-domains .infra-row.domain-row').length;
    const totalSubdomains = document.querySelectorAll('#panel-domains .infra-row.sub-row').length;

    const countLinode = document.getElementById('ingested-count-linode');
    const countEndpoints = document.getElementById('ingested-count-endpoints');
    const countMysql = document.getElementById('ingested-count-mysql');
    const countBlackbox = document.getElementById('ingested-count-blackbox');

    if (countLinode) countLinode.textContent = totalServers || 85;
    if (countEndpoints) countEndpoints.textContent = totalSubdomains || 22;
    if (countMysql) countMysql.textContent = totalDatabases || 3;
    if (countBlackbox) countBlackbox.textContent = (totalDomains + totalSubdomains) || 31;
  }

  // Dynamic Step & View panels UI Updater
  function updateStepUI() {
    // 1. Update Step Card Headers (Badge counts, active states, green ticks)
    stepCards.forEach((card, idx) => {
      const stepNum = idx + 1;
      let badge = card.querySelector('.step-badge');
      
      card.className = 'step-card';
      
      if (stepNum < currentStep) {
        // Step completed: Show green checkmark icon
        card.classList.add('completed', 'disabled');
        badge.className = 'step-badge checkmark-badge';
        badge.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      } else if (stepNum === currentStep) {
        // Step currently active
        card.classList.add('active');
        badge.className = 'step-badge active-badge';
        badge.innerHTML = stepNum;
      } else {
        // Step locked/disabled: Normal number badge, no ticks
        card.classList.add('disabled');
        badge.className = 'step-badge';
        badge.innerHTML = stepNum;
      }
    });

    // 2. Toggle active step view panel visibility
    stepViews.forEach((view, idx) => {
      const viewNum = idx + 1;
      if (viewNum === currentStep) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // If entering Step 3 (Instances), render the dynamic 30 mock items
    if (currentStep === 3) {
      renderInstancesList();
    } else if (currentStep === 4) {
      renderProjectsList();
    } else if (currentStep === 5) {
      renderClientsView();
    } else if (currentStep === 6) {
      renderReviewReport();
    }

    // 3. Adjust back button visibility
    if (currentStep > 1 && currentStep <= 6) {
      backBtn.style.display = 'flex';
    } else {
      backBtn.style.display = 'none';
    }

    // 4. Update proceed button styling and text
    if (currentStep <= 6) {
      actionBtn.innerHTML = `
        ${buttonTexts[currentStep - 1]}
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
      actionBtn.style.display = 'flex';
      if (currentStep === 1 && addedSources.length === 0) {
        actionBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        actionBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        actionBtn.style.color = 'var(--text-muted)';
        actionBtn.style.boxShadow = 'none';
        actionBtn.style.cursor = 'not-allowed';
        actionBtn.style.opacity = '0.5';
      } else {
        actionBtn.style.background = 'var(--text-primary)';
        actionBtn.style.border = 'none';
        actionBtn.style.color = 'var(--bg-darker)';
        actionBtn.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.15)';
        actionBtn.style.cursor = 'pointer';
        actionBtn.style.opacity = '1';
      }
    } else {
      // Onboarding complete: show disabled "Onboarding Completed" button
      actionBtn.innerHTML = `
        Onboarding Completed
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      actionBtn.style.background = 'rgba(255, 255, 255, 0.03)';
      actionBtn.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      actionBtn.style.color = 'var(--text-muted)';
      actionBtn.style.boxShadow = 'none';
      actionBtn.style.cursor = 'default';
      actionBtn.style.opacity = '0.5';
    }

    const ingestedSec = document.querySelector('.ingested-section');
    const recentCommitsSec = document.querySelector('.recent-commits-section');
    const topCommitBtnContainer = document.getElementById('new-commit-session-top-container');

    if (currentStep === 7) {
      if (ingestedSec) ingestedSec.classList.remove('hidden');
      if (recentCommitsSec && commitsHistory.length > 0) recentCommitsSec.classList.remove('hidden');
      if (topCommitBtnContainer) topCommitBtnContainer.classList.remove('hidden');
    } else {
      if (ingestedSec) ingestedSec.classList.add('hidden');
      if (recentCommitsSec) recentCommitsSec.classList.add('hidden');
      if (topCommitBtnContainer) topCommitBtnContainer.classList.add('hidden');
    }

    // 5. Update left-side help descriptions in footer
    if (currentStep === 1) {
      controlsLeftText.textContent = "Counts are live list lengths · sources with no count endpoint show —";
    } else if (currentStep === 2) {
      controlsLeftText.textContent = "Infrastructure node mapping · Confirm live assets or quarantine legacy endpoints";
    } else if (currentStep === 3) {
      controlsLeftText.textContent = `${instancesData.filter(i => i.accepted).length}/31 instances accepted · server[] carried on each`;
    } else if (currentStep === 4) {
      controlsLeftText.textContent = `${projectsData.filter(p => p.accepted).length}/${projectsData.length} projects accepted · each writes the project + links instances`;
    } else if (currentStep === 5) {
      const acceptedProjects = projectsData.filter(p => p.accepted);
      const assignedProjectsCount = acceptedProjects.filter(p => p.clientId).length;
      controlsLeftText.textContent = `${assignedProjectsCount}/${acceptedProjects.length} projects assigned to clients · assign each accepted project to a client`;
    } else {
      if (currentStep === 7) {
        controlsLeftText.textContent = "Discovery Wizard · Onboarding Completed";
      } else {
        controlsLeftText.textContent = `Discovery Wizard · Progressing through phase ${currentStep} (${stepNames[currentStep - 1]})`;
      }
    }
    updateIngestedStats();
  }

  // Handle click on Proceed Button
  actionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep === 7) {
      return;
    }
    
    function resetOnboardingWizardState() {
      // 1. Reset Sources (Step 1)
      addedSources = [];
      if (typeof renderSourcesStack === 'function') {
        renderSourcesStack();
      }

      // 2. Reset Infrastructure decisions (Step 2)
      document.querySelectorAll('.infra-row .action-undo-btn').forEach(undoBtn => {
        undoBtn.click();
      });

      // 3. Reset Instances (Step 3)
      if (typeof instancesData !== 'undefined') {
        instancesData.forEach(item => {
          item.accepted = false;
        });
      }
      if (typeof renderInstancesList === 'function') {
        renderInstancesList();
      }

      // 4. Reset Projects (Step 4)
      if (typeof projectsData !== 'undefined') {
        projectsData.forEach(proj => {
          proj.accepted = false;
        });
      }
      if (typeof renderProjectsList === 'function') {
        renderProjectsList();
      }

      // 5. Reset Review & Commit status badge (Step 6)
      const statusBadge = document.getElementById('report-status-badge');
      if (statusBadge) {
        statusBadge.textContent = "STATUS: PENDING COMMIT";
        statusBadge.classList.remove('committed');
      }

      // 6. Reset Wizard step back to 1
      currentStep = 1;
      updateStepUI();
      showToast("Started a fresh commit session. All wizard selections have been reset for a clean commit flow!", true);
    }

    // Bind click handler for top Start New Commit Session button
    const topStartNewCommitBtn = document.getElementById('start-new-commit-btn-top');
    if (topStartNewCommitBtn && !topStartNewCommitBtn.dataset.bound) {
      topStartNewCommitBtn.dataset.bound = "true";
      topStartNewCommitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetOnboardingWizardState();
      });
    }
    if (currentStep === 1 && addedSources.length === 0) {
      showToast("Please connect at least one data source first.");
      return;
    }
    if (currentStep === 2) {
      const hasServer = document.querySelectorAll('#panel-servers .infra-row .action-undo-btn').length > 0;
      const hasDomain = document.querySelectorAll('#panel-domains .infra-row .action-undo-btn').length > 0;
      const hasDatabase = document.querySelectorAll('#panel-databases .infra-row .action-undo-btn').length > 0;

      if (!hasServer || !hasDomain || !hasDatabase) {
        if (hasServer && !hasDomain && !hasDatabase) {
          showToast("Please select domains and databases too.");
        } else if (hasDomain && !hasServer && !hasDatabase) {
          showToast("Please select servers and databases too.");
        } else if (hasDatabase && !hasServer && !hasDomain) {
          showToast("Please select servers and domains too.");
        } else if (hasServer && hasDomain && !hasDatabase) {
          showToast("Please select databases too.");
        } else if (hasServer && hasDatabase && !hasDomain) {
          showToast("Please select domains too.");
        } else if (hasDomain && hasDatabase && !hasServer) {
          showToast("Please select servers too.");
        } else {
          showToast("Please confirm or quarantine at least one item from Servers, Domains, and Databases first.");
        }
        return; // Block navigation
      }
    }

    if (currentStep === 3) {
      const acceptedCount = instancesData.filter(inst => inst.accepted).length;
      if (acceptedCount === 0) {
        showToast("Please accept at least one instance first.");
        return; // Block navigation
      }
    }

    if (currentStep < 6) {
      const leavingStepName = stepNames[currentStep - 1];
      currentStep++;
      updateStepUI();
      showToast(`Saved phase: ${leavingStepName}. Proceeding to ${stepNames[currentStep - 1]}...`, true);
    } else if (currentStep === 6) {
      // 1. Update status badge to SUCCESS COMMIT in DOM and unlock tabs
      const statusBadge = document.getElementById('report-status-badge');
      if (statusBadge) {
        statusBadge.textContent = "STATUS: SUCCESS COMMIT";
        statusBadge.classList.add('committed');
      }
      const stateNavLink = document.querySelector('a[href="#state"]');
      if (stateNavLink) {
        stateNavLink.classList.remove('disabled');
      }
      const pulseNavLink = document.querySelector('a[href="#pulse"]');
      if (pulseNavLink) {
        pulseNavLink.classList.remove('disabled');
      }

      // 2. Refresh report date and timestamp to the exact commit time
      const now = new Date();
      if (reportDateBadge) reportDateBadge.textContent = `DATE: ${now.toLocaleDateString()}`;
      if (reportTimestamp) reportTimestamp.textContent = `Committed via Uplink Console on ${now.toLocaleString()}`;

      // 3. Trigger success modal commit popup (do not auto-download here)
      successModal.classList.add('active');
    }
  });

  // Handle click on Back Button
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
      showToast(`Navigated back to: ${stepNames[currentStep - 1]}`);
    }
  });

  // Handle click on Download Report button inside success modal
  const modalDownloadBtn = document.getElementById('modal-download-btn');
  if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener('click', () => {
      triggerPdfDownload(true);
    });
  }

  // Handle closing of success modal, unlocking dashboard and navigating to State
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    isCommitted = true;
    currentStep = 7;
    updateStepUI();
    
    // Enable pointer cursor on logo button
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.style.cursor = 'pointer';
      logoContainer.setAttribute('title', 'Navigate to State Dashboard');
    }
    
    // Reveal Ingested From section at the bottom
    ingestedSection.classList.remove('hidden');

  function getCurrentOperatorName() {
    const headerNameEl = document.getElementById('header-user-fullname');
    if (headerNameEl && headerNameEl.textContent.trim()) {
      return headerNameEl.textContent.trim();
    }
    const profileNameEl = document.getElementById('settings-profile-fullname');
    if (profileNameEl && profileNameEl.textContent.trim()) {
      return profileNameEl.textContent.trim();
    }
    return "Pranav Gupta";
  }

    // Compute current verified counts for history logging
    const totalServers = document.querySelectorAll('#panel-servers .infra-row.confirmed-state').length || 85;
    const totalDatabases = document.querySelectorAll('#panel-databases .infra-row.confirmed-state').length || 3;
    const totalDomains = document.querySelectorAll('#panel-domains .infra-row.domain-row.confirmed-state').length || 9;
    const totalSubdomains = document.querySelectorAll('#panel-domains .infra-row.sub-row.confirmed-state').length || 22;

    const newCommit = {
      id: "uplink-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(),
      operator: getCurrentOperatorName(),
      servers: totalServers,
      domains: totalDomains,
      databases: totalDatabases,
      subdomains: totalSubdomains,
      incidents: alertsLog.filter(a => a.status !== 'resolved').length,
      status: "SUCCESS"
    };

    commitsHistory.unshift(newCommit);
    renderCommitsHistory();

    const recentCommitsSec = document.querySelector('.recent-commits-section');
    if (recentCommitsSec) recentCommitsSec.classList.remove('hidden');
    
    // Unlock all disabled navigation links
    navLinks.forEach(link => {
      link.classList.remove('disabled');
      link.style.cursor = 'pointer';
      link.style.opacity = '1';
    });
    
    // Theme toggle remains unlocked from start


    // Update notice box content to original Day 1 text
    if (onboardingNotice) {
      onboardingNotice.innerHTML = `
        Seeded from <strong class="notice-highlight">inventory</strong>, not just app endpoints — so servers with <strong class="notice-highlight">no public app</strong> (DB hosts + Kafka/Vault/Jenkins/jump/mail), all databases and domains are onboarded in <strong class="notice-highlight">Infrastructure</strong>. Clients are <strong class="notice-highlight">not inferred</strong> — you assign them in <strong class="notice-highlight">Clients</strong>.
      `;
    }

    // Automatically navigate to State dashboard page!
    navigateToState();

    showToast("Commit accepted! Entity graph produced. All dashboard tabs unlocked.", true);
  });

  // Infrastructure Tab Switching (Horizontal dropdown layout)
  infraTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Toggle active classes on tab buttons
      infraTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle active classes on panels
      infraPanels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Toast removed for professional UI
    });
  });

  // Domain Block Accordion Toggle (Expand subdomains on domain click)
  domainBlocks.forEach(block => {
    const domainRow = block.querySelector('.domain-row');
    
    // Start collapsed by default
    block.classList.add('collapsed');

    domainRow.addEventListener('click', (e) => {
      // If clicking action buttons inside row, don't toggle accordion
      if (e.target.closest('button')) return;

      block.classList.toggle('collapsed');
      block.classList.toggle('expanded');
    });
  });

  // Bind Confirm and Quarantine Action buttons inside Infrastructure lists
  const bindActionButtons = (row, type) => {
    const confirmBtn = row.querySelector('.action-confirm-btn');
    const quarantineBtn = row.querySelector('.action-quarantine-btn');
    const rowActions = row.querySelector('.row-actions');
    const rowName = row.querySelector('.row-name').textContent;
    const badge = row.querySelector('.status-pill');
    
    // Store initial badge details if present
    const initialBadgeText = badge ? badge.textContent : '';
    const initialBadgeClass = badge ? badge.className : '';
    const initialBadgeBackground = badge ? badge.style.background : '';
    const initialBadgeBorder = badge ? badge.style.border : '';
    const initialBadgeColor = badge ? badge.style.color : '';

    const handleAction = (isConfirm) => {
      // 1. Hide confirm and quarantine buttons
      confirmBtn.style.display = 'none';
      if (quarantineBtn) quarantineBtn.style.display = 'none';

      // 2. Apply visual feedback to row
      if (isConfirm) {
        row.style.borderColor = 'var(--border-success)';
        row.style.background = 'rgba(16, 185, 129, 0.04)';
        if (badge) {
          badge.className = 'status-pill';
          badge.style.background = 'rgba(16, 185, 129, 0.15)';
          badge.style.border = '1px solid var(--border-success)';
          badge.style.color = '#10b981';
          badge.textContent = 'confirmed';
        }
        showToast(`Asset confirmed: ${rowName}`, true);
      } else {
        row.style.borderColor = '#ef4444';
        row.style.background = 'rgba(239, 68, 68, 0.04)';
        row.style.opacity = '0.6';
        if (badge) {
          badge.className = 'status-pill';
          badge.style.background = 'rgba(239, 68, 68, 0.15)';
          badge.style.border = '1px solid #ef4444';
          badge.style.color = '#ef4444';
          badge.textContent = 'quarantined';
        }
        showToast(`Asset quarantined: ${rowName}`);
      }

      // 3. Decrement tab count
      if (type === 'domains') {
        if (row.classList.contains('domain-row')) {
          decrementCount(type);
        }
      } else {
        decrementCount(type);
      }

      if (row.classList.contains('sub-row')) {
        const block = row.closest('.domain-block') || row.parentElement.parentElement;
        if (block && typeof window.updateConfirmAllButtonState === 'function') {
          window.updateConfirmAllButtonState(block);
        }
      }

      // 4. Create and append the Undo button
      const undoBtn = document.createElement('button');
      undoBtn.className = 'action-undo-btn';
      undoBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" style="display:inline; vertical-align:middle; margin-right:3px;">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <polyline points="3 3 3 8 8 8" />
        </svg>Undo
      `;
      
      undoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove Undo button
        undoBtn.remove();

        // Restore Confirm/Quarantine display
        confirmBtn.style.display = 'flex';
        if (quarantineBtn) quarantineBtn.style.display = 'flex';

        // Restore row properties
        row.style.borderColor = '';
        row.style.background = '';
        row.style.opacity = '';

        // Restore badge
        if (badge) {
          badge.className = initialBadgeClass;
          badge.style.background = initialBadgeBackground;
          badge.style.border = initialBadgeBorder;
          badge.style.color = initialBadgeColor;
          badge.textContent = initialBadgeText;
        }

        // Increment count back
        if (type === 'domains') {
          if (row.classList.contains('domain-row')) {
            incrementCount(type);
          }
        } else {
          incrementCount(type);
        }
        showToast(`Action undone for: ${rowName}`);

        if (row.classList.contains('sub-row')) {
          const block = row.closest('.domain-block') || row.parentElement.parentElement;
          if (block && typeof window.updateConfirmAllButtonState === 'function') {
            window.updateConfirmAllButtonState(block);
          }
        }
      });

      rowActions.appendChild(undoBtn);
    };

    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAction(true);
      });
    }

    if (quarantineBtn) {
      quarantineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAction(false);
      });
    }
  };

  // Decrement tab count values
  function decrementCount(type) {
    if (type === 'servers' && serversCount > 0) {
      serversCount--;
      document.getElementById('count-servers').textContent = serversCount;
    } else if (type === 'domains' && domainsCount > 0) {
      domainsCount--;
      document.getElementById('count-domains').textContent = domainsCount;
    } else if (type === 'databases' && databasesCount > 0) {
      databasesCount--;
      document.getElementById('count-databases').textContent = databasesCount;
    }
  }

  // Increment tab count values
  function incrementCount(type) {
    if (type === 'servers') {
      serversCount++;
      document.getElementById('count-servers').textContent = serversCount;
    } else if (type === 'domains') {
      domainsCount++;
      document.getElementById('count-domains').textContent = domainsCount;
    } else if (type === 'databases') {
      databasesCount++;
      document.getElementById('count-databases').textContent = databasesCount;
    }
  }

  // Bind all rows in DOM
  document.querySelectorAll('#panel-servers .infra-row').forEach(row => bindActionButtons(row, 'servers'));
  document.querySelectorAll('#panel-domains .infra-row').forEach(row => bindActionButtons(row, 'domains'));
  document.querySelectorAll('#panel-databases .infra-row').forEach(row => bindActionButtons(row, 'databases'));

  const updateConfirmAllButtonState = (block) => {
    const btn = block.querySelector('.confirm-all-subs-btn');
    if (!btn) return;

    const subrows = block.querySelectorAll('.nested-subdomains .infra-row.sub-row');
    let allConfirmed = true;

    subrows.forEach(subRow => {
      const undoBtn = subRow.querySelector('.action-undo-btn');
      if (!undoBtn) {
        allConfirmed = false;
      }
    });

    if (allConfirmed && subrows.length > 0) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" style="display:inline; vertical-align:middle; margin-right:3px;">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <polyline points="3 3 3 8 8 8" />
        </svg> Undo All Subdomains
      `;
      btn.classList.add('undo-state');
    } else {
      btn.innerHTML = `✓ Confirm All Subdomains`;
      btn.classList.remove('undo-state');
    }
  };
  window.updateConfirmAllButtonState = updateConfirmAllButtonState;

  // Bind Confirm All Subdomains buttons
  const bindConfirmAllSubsButtons = () => {
    document.querySelectorAll('.confirm-all-subs-btn').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const block = btn.closest('.domain-block') || btn.parentElement.parentElement;
          if (block) {
            if (btn.classList.contains('undo-state')) {
              // Undo all
              block.querySelectorAll('.nested-subdomains .infra-row.sub-row').forEach(subRow => {
                const undoBtn = subRow.querySelector('.action-undo-btn');
                if (undoBtn) {
                  undoBtn.click();
                }
              });
            } else {
              // Confirm all
              let confirmedAny = false;
              block.querySelectorAll('.nested-subdomains .infra-row.sub-row').forEach(subRow => {
                const confirmBtn = subRow.querySelector('.action-confirm-btn');
                if (confirmBtn && confirmBtn.style.display !== 'none' && !confirmBtn.classList.contains('hidden')) {
                  confirmBtn.click();
                  confirmedAny = true;
                }
              });
            }
            updateConfirmAllButtonState(block);
          }
        });
      }
    });
  };
  bindConfirmAllSubsButtons();

  // -------------------------------------------------------------
  // STEP 3: INSTANCES RENDERING & wizard interactions
  // -------------------------------------------------------------
  
  function renderInstancesList() {
    const listContainer = document.querySelector('.instances-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    
    // Filter instances data
    let filteredData = instancesData;
    
    // Filter by tab
    if (currentInstancesTab === "high-conf") {
      filteredData = filteredData.filter(inst => inst.confidence === "High Confidence");
    } else if (currentInstancesTab === "needs-review") {
      filteredData = filteredData.filter(inst => inst.confidence === "Needs Review");
    } else if (currentInstancesTab === "accepted") {
      filteredData = filteredData.filter(inst => inst.accepted);
    }
    
    // Filter by search query
    if (instancesSearchQuery.trim() !== "") {
      filteredData = filteredData.filter(inst => inst.name.toLowerCase().includes(instancesSearchQuery));
    }
    
    // Update count labels inside tab buttons
    updateInstancesTabLabels();

    if (filteredData.length === 0) {
      listContainer.innerHTML = `
        <div class="placeholder-step-view" style="padding: 2.5rem 1rem;">
          <h2 style="font-size: 1.1rem; color: var(--text-secondary);">No instances match the current filters.</h2>
        </div>
      `;
      return;
    }
    
    // Render instance cards
    filteredData.forEach(inst => {
      const card = document.createElement('div');
      card.className = `instance-card ${inst.expanded ? 'expanded' : 'collapsed'}`;
      card.setAttribute('data-id', inst.id);
      
      // Build tags markup
      let tagsHTML = "";
      inst.tags.forEach(tag => {
        let badgeClass = "badge-folder";
        let icon = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-1px; margin-right:3px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
        
        if (tag === "high") { badgeClass = "badge-high"; icon = ""; }
        else if (tag.includes("prod") || tag.includes("test") || tag.includes("uat") || tag.includes("demo")) { badgeClass = "badge-scope"; icon = ""; }
        else if (tag === "+1") { badgeClass = "badge-more"; icon = ""; }
        else if (tag.includes(".ai") || tag.includes(".com") || tag.includes(".live") || tag.includes(".net")) {
          badgeClass = "badge-globe";
          icon = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-1px; margin-right:3px;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        }
        else if (tag === "shared infra") {
          badgeClass = "badge-warning";
          icon = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-1px; margin-right:3px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        }
        
        tagsHTML += `
          <span class="tag-badge ${badgeClass}">
            ${icon ? `<span class="badge-icon">${icon}</span>` : ""} ${tag}
          </span>
        `;
      });
      
      // Build components markup (only if expanded)
      let componentsHTML = "";
      if (inst.expanded && inst.components) {
        let compRows = "";
        inst.components.forEach(comp => {
          let linksHTML = "";
          if (Array.isArray(comp.sub)) {
            comp.sub.forEach(link => {
              linksHTML += `<a href="#${link}" class="comp-link">${link}</a>`;
            });
          } else {
            linksHTML = `<a href="#${comp.sub}" class="comp-link">${comp.sub}</a>`;
          }
          
          let compIconHTML = "";
          if (comp.isAPI) {
            compIconHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><path d="M6 14v-4a4 4 0 0 1 4-4h4"></path></svg>`;
          } else {
            compIconHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><circle cx="6" cy="6" r="1"></circle><circle cx="10" cy="6" r="1"></circle><circle cx="14" cy="6" r="1"></circle></svg>`;
          }

          compRows += `
            <div class="component-row">
              <div class="comp-left">
                <span class="comp-icon">${compIconHTML}</span>
                <div class="comp-meta">
                  <span class="comp-title">${comp.name}</span>
                  <div class="comp-links-list">${linksHTML}</div>
                </div>
              </div>
              <div class="comp-right-group">
                <span class="comp-right">${comp.count}</span>
                ${comp.isAPI ? `<span class="api-label-pill">API</span>` : ""}
              </div>
            </div>
          `;
        });
        
        componentsHTML = `
          <div class="instance-body">
            <div class="components-header">SERVER → COMPONENTS RUNNING ON IT — VERIFY THE GROUPING</div>
            <div class="components-list">${compRows}</div>
            
            <div class="instance-card-actions">
              <button class="instance-accept-btn ${inst.accepted ? 'active' : ''}">
                <span class="check-icon">✓</span> ${inst.accepted ? 'accepted' : 'Accept'}
              </button>
              <button class="instance-edit-btn">
                <span class="edit-icon">⚙</span> Edit
              </button>
            </div>
          </div>
        `;
      }
      
      card.innerHTML = `
        <div class="instance-header">
          <div class="header-left-side">
            <span class="chevron-icon">${inst.expanded ? '▲' : '▼'}</span>
            <div class="instance-title-group">
              <span class="instance-name">${inst.name}</span>
              <span class="instance-sub">${inst.host}</span>
            </div>
          </div>
          <div class="instance-tags">
            ${tagsHTML}
          </div>
        </div>
        ${componentsHTML}
      `;
      
      // Bind accordion click
      card.querySelector('.instance-header').addEventListener('click', (e) => {
        if (e.target.closest('.tag-badge')) return; // Avoid accordion toggle on tag badge clicks
        inst.expanded = !inst.expanded;
        renderInstancesList();
      });
      
      // Bind actions inside card if expanded
      if (inst.expanded) {
        // Accept button click
        card.querySelector('.instance-accept-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          inst.accepted = !inst.accepted;
          if (inst.accepted) {
            showToast(`Instance "${inst.name}" accepted.`, true);
          } else {
            showToast(`Instance "${inst.name}" returned to review.`);
          }
          renderInstancesList();
          // Update accepted count in footer description
          controlsLeftText.textContent = `${instancesData.filter(i => i.accepted).length}/30 instances accepted · server[] carried on each`;
        });
        
        // Edit button click (open edit modal dialog)
        card.querySelector('.instance-edit-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          openEditModal(inst);
        });
      }
      
      listContainer.appendChild(card);
    });
  }

  // Update dynamic count labels in the pill bar of Step 3
  function updateInstancesTabLabels() {
    const pills = document.querySelectorAll('.instances-tab-pill');
    if (pills.length < 4) return;
    
    const allCount = instancesData.length;
    const highConfCount = instancesData.filter(i => i.confidence === "High Confidence").length;
    const needsReviewCount = instancesData.filter(i => i.confidence === "Needs Review").length;
    const acceptedCount = instancesData.filter(i => i.accepted).length;
    
    // Update pills content
    pills[0].innerHTML = `all <span class="tab-count-pill">${allCount}</span>`;
    pills[1].innerHTML = `High Confidence <span class="tab-count-pill">${highConfCount}</span>`;
    pills[2].innerHTML = `Needs Review <span class="tab-count-pill">${needsReviewCount}</span>`;
    pills[3].innerHTML = `Accepted <span class="tab-count-pill">${acceptedCount}</span>`;
    
    // Update ratio text in search bar
    const ratioSpan = document.querySelector('.accepted-ratio');
    if (ratioSpan) {
      ratioSpan.textContent = `${acceptedCount}/${allCount} accepted`;
    }
  }

  // Setup instances pill tabs click filters
  const setupInstancesTabs = () => {
    const pills = document.querySelectorAll('.instances-tab-pill');
    const tabFilters = ["all", "high-conf", "needs-review", "accepted"];
    
    pills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        currentInstancesTab = tabFilters[idx];
        renderInstancesList();
        
        // Toast removed for professional UI
      });
    });
  };

  // Search input filter in Step 3
  const searchInput = document.querySelector('.cyber-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      instancesSearchQuery = e.target.value.toLowerCase();
      renderInstancesList();
    });
  }

  // Infrastructure Category Search listeners (Step 2)
  const searchServersInput = document.getElementById('search-servers-input');
  if (searchServersInput) {
    searchServersInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#panel-servers .infra-row').forEach(row => {
        const name = row.querySelector('.row-name').textContent.toLowerCase();
        if (name.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  const searchDomainsInput = document.getElementById('search-domains-input');
  if (searchDomainsInput) {
    searchDomainsInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#panel-domains .domain-block').forEach(block => {
        const domainRow = block.querySelector('.domain-row');
        const domainName = domainRow ? domainRow.querySelector('.row-name').textContent.toLowerCase() : '';
        let domainMatches = domainName.includes(query);
        
        let anySubMatches = false;
        block.querySelectorAll('.sub-row').forEach(subRow => {
          const subName = subRow.querySelector('.row-name').textContent.toLowerCase();
          if (subName.includes(query)) {
            subRow.style.display = '';
            anySubMatches = true;
          } else {
            subRow.style.display = 'none';
          }
        });

        if (domainMatches || anySubMatches) {
          block.style.display = '';
          if (anySubMatches && query !== '') {
            block.classList.remove('collapsed');
            block.classList.add('expanded');
          } else if (query === '') {
            block.classList.add('collapsed');
            block.classList.remove('expanded');
          }
        } else {
          block.style.display = 'none';
        }
      });
    });
  }

  const searchDatabasesInput = document.getElementById('search-databases-input');
  if (searchDatabasesInput) {
    searchDatabasesInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#panel-databases .infra-row').forEach(row => {
        const name = row.querySelector('.row-name').textContent.toLowerCase();
        if (name.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Bind static notice actions in Step 3
  const previewAcceptBtn = document.querySelector('.notice-action-btn.primary-btn-sm');
  if (previewAcceptBtn) {
    previewAcceptBtn.addEventListener('click', () => {
      // Auto accept all High Confidence instances
      let countAccepted = 0;
      instancesData.forEach(inst => {
        if (inst.confidence === "High Confidence" && !inst.accepted) {
          inst.accepted = true;
          countAccepted++;
        }
      });
      renderInstancesList();
      showToast(`Auto-accepted ${countAccepted} High Confidence instances!`, true);
      controlsLeftText.textContent = `${instancesData.filter(i => i.accepted).length}/30 instances accepted · server[] carried on each`;
    });
  }

  const groupManuallyBtn = document.querySelector('.notice-action-btn.secondary-btn-sm');
  if (groupManuallyBtn) {
    groupManuallyBtn.addEventListener('click', () => {
      showToast("Manual grouping module is disabled in this mockup dashboard.");
    });
  }

  // -------------------------------------------------------------
  // EDIT INSTANCE MODAL DIALOG CONTROLLER
  // -------------------------------------------------------------
  const editModalOverlay = document.getElementById('edit-modal');
  const editNameInput = document.getElementById('edit-instance-name');
  const editEnvSelect = document.getElementById('edit-instance-env');
  const editTypeSelect = document.getElementById('edit-instance-type');
  const closeEditModalX = document.getElementById('close-edit-modal-x');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const saveEditBtn = document.getElementById('save-edit-btn');
  const filterServersInput = document.getElementById('filter-servers-input');
  const checkboxes = document.querySelectorAll('.servers-checkbox-list .checkbox-row');

  function openEditModal(instance) {
    editingInstanceId = instance.id;
    
    // Set text input values
    editNameInput.value = instance.name;
    editEnvSelect.value = instance.env;
    editTypeSelect.value = instance.type;
    
    // Check initial servers checkboxes based on tags
    checkboxes.forEach(row => {
      const checkbox = row.querySelector('input[type="checkbox"]');
      const serverVal = checkbox.value;
      
      // If the tag list matches, check it
      const hasTag = instance.tags.some(t => t.toLowerCase().includes(serverVal.toLowerCase()));
      checkbox.checked = hasTag;
    });

    // Clear server filter
    filterServersInput.value = "";
    checkboxes.forEach(row => row.style.display = 'flex');

    // Show modal
    editModalOverlay.classList.add('active');
  }

  function closeEditModal() {
    editModalOverlay.classList.remove('active');
    editingInstanceId = null;
  }

  // Close buttons bindings
  if (closeEditModalX) closeEditModalX.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);

  // Save changes callback
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', () => {
      if (!editingInstanceId) return;
      
      const instance = instancesData.find(i => i.id === editingInstanceId);
      if (instance) {
        const oldName = instance.name;
        const newName = editNameInput.value.trim();
        
        if (newName === "") {
          showToast("Instance name cannot be empty!");
          return;
        }
        
        // Update data values
        instance.name = newName;
        instance.env = editEnvSelect.value;
        instance.type = editTypeSelect.value;
        
        // Update tags list (retaining high confidence label, scope env badge, etc.)
        const updatedTags = ["high", editEnvSelect.value.toLowerCase() + " · " + editTypeSelect.value];
        
        // Push checked servers to tags list
        checkboxes.forEach(row => {
          const checkbox = row.querySelector('input[type="checkbox"]');
          if (checkbox.checked) {
            updatedTags.push(checkbox.value);
          }
        });
        
        // Push the original globe & warning tags
        updatedTags.push("vizo361.ai", "shared infra");
        instance.tags = updatedTags;
        
        // Refresh rendering
        renderInstancesList();
        closeEditModal();
        showToast(`Updated instance "${oldName}" to "${newName}" successfully!`, true);
      }
    });
  }

  // Real-time server checkbox filter
  if (filterServersInput) {
    filterServersInput.addEventListener('input', (e) => {
      const filterVal = e.target.value.toLowerCase();
      checkboxes.forEach(row => {
        const nameAttr = row.getAttribute('data-server-name').toLowerCase();
        if (nameAttr.includes(filterVal)) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // -------------------------------------------------------------
  // STEP 4: PROJECTS MAPPING MANAGEMENT
  // -------------------------------------------------------------
  const projectsList = document.getElementById('projects-list');
  const projectsTabPending = document.getElementById('projects-tab-pending');
  const projectsTabAccepted = document.getElementById('projects-tab-accepted');
  const projectsCountPending = document.getElementById('projects-count-pending');
  const projectsCountAccepted = document.getElementById('projects-count-accepted');
  const projectsSearchInput = document.getElementById('projects-search-input');
  const projectsAcceptedSummary = document.getElementById('projects-accepted-summary');
  const createProjectBtn = document.getElementById('create-project-btn');
  
  // Project Modal Elements
  const projectModal = document.getElementById('project-modal');
  const closeProjectModalX = document.getElementById('close-project-modal-x');
  const cancelProjectBtn = document.getElementById('cancel-project-btn');
  const saveProjectBtn = document.getElementById('save-project-btn');
  const projectNameInput = document.getElementById('project-name-input');
  const projectDomainInput = document.getElementById('project-domain-input');
  const projectTypeSelect = document.getElementById('project-type-select');
  const projectConfidenceSelect = document.getElementById('project-confidence-select');
  const filterProjectInstancesInput = document.getElementById('filter-project-instances-input');
  const projectInstancesCheckboxList = document.getElementById('project-instances-checkbox-list');

  // Render Projects List
  function renderProjectsList() {
    if (!projectsList) return;
    projectsList.innerHTML = "";

    // Filter by tab status (pending vs accepted)
    let filtered = projectsData.filter(proj => {
      if (currentProjectsTab === "pending") {
        return !proj.accepted;
      } else {
        return proj.accepted;
      }
    });

    // Filter by search query
    if (projectsSearchQuery.trim() !== "") {
      const q = projectsSearchQuery.toLowerCase();
      filtered = filtered.filter(proj => 
        proj.name.toLowerCase().includes(q) || 
        proj.domain.toLowerCase().includes(q) ||
        proj.instances.some(inst => inst.toLowerCase().includes(q))
      );
    }

    updateProjectsTabLabels();

    if (filtered.length === 0) {
      projectsList.innerHTML = `
        <div class="placeholder-step-view" style="padding: 2.5rem 1rem;">
          <h2 style="font-size: 1.1rem; color: var(--text-secondary);">No projects match the current filter.</h2>
        </div>
      `;
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-id', proj.id);

      // Mapped instances badges HTML
      let instancesBadgesHTML = "";
      if (proj.instances.length === 0) {
        instancesBadgesHTML = `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">No instances mapped</span>`;
      } else {
        proj.instances.forEach(instName => {
          // Check if instance is accepted in step 3
          const isInstAccepted = instancesData.some(inst => inst.name === instName && inst.accepted);
          instancesBadgesHTML += `
            <span class="mapped-instance-tag" style="${isInstAccepted ? 'background: rgba(5, 255, 196, 0.12); border-color: var(--cyber-green);' : 'background: rgba(79, 172, 254, 0.06); border-color: rgba(79, 172, 254, 0.2); color: var(--cyber-blue);'}">
              ${isInstAccepted ? '✓ ' : ''}${instName}
            </span>
          `;
        });
      }

      card.innerHTML = `
        <div class="project-card-header">
          <div class="project-card-meta">
            <div class="project-title-row">
              <span class="project-name">${proj.name}</span>
            </div>
            <span class="project-domain">${proj.domain} · <strong style="text-transform: capitalize;">${proj.type}</strong></span>
          </div>
        </div>

        <div class="mapped-instances-section">
          <div class="mapped-instances-title">MAPPED INSTANCES</div>
          <div class="mapped-instances-list">${instancesBadgesHTML}</div>
        </div>

        <div class="project-actions-row">
          <button class="project-accept-btn ${proj.accepted ? 'accepted' : ''}">
            <span class="check-icon">✓</span> ${proj.accepted ? 'Accepted' : 'Accept project'}
          </button>
          <button class="project-edit-btn">
            ⚙ Edit / Map
          </button>
        </div>
      `;

      // Accept button action
      card.querySelector('.project-accept-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        proj.accepted = !proj.accepted;
        if (proj.accepted) {
          showToast(`Project "${proj.name}" accepted.`, true);
        } else {
          showToast(`Project "${proj.name}" returned to pending.`);
        }
        renderProjectsList();
        controlsLeftText.textContent = `${projectsData.filter(p => p.accepted).length}/${projectsData.length} projects accepted · each writes the project + links instances`;
      });

      // Edit / Map button action
      card.querySelector('.project-edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(proj);
      });

      projectsList.appendChild(card);
    });
  }

  // Update tabs labels & summary
  function updateProjectsTabLabels() {
    if (!projectsCountPending || !projectsCountAccepted || !projectsAcceptedSummary) return;

    const pendingCount = projectsData.filter(p => !p.accepted).length;
    const acceptedCount = projectsData.filter(p => p.accepted).length;

    projectsCountPending.textContent = pendingCount;
    projectsCountAccepted.textContent = acceptedCount;

    projectsAcceptedSummary.textContent = `${acceptedCount} project${acceptedCount === 1 ? '' : 's'} accepted`;
  }

  // Project Modal Handling
  function openProjectModal(project = null) {
    if (!projectModal) return;
    editingProjectId = project ? project.id : null;

    if (project) {
      document.getElementById('project-modal-title').textContent = "Edit Project";
      projectNameInput.value = project.name;
      projectDomainInput.value = project.domain;
      projectTypeSelect.value = project.type;
    } else {
      document.getElementById('project-modal-title').textContent = "Create Project";
      projectNameInput.value = "";
      projectDomainInput.value = "";
      projectTypeSelect.value = "dedicated";
    }

    renderProjectInstancesCheckboxes(project ? project.instances : []);

    filterProjectInstancesInput.value = "";
    projectModal.classList.add('active');
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      editingProjectId = null;
    }
  }

  // Render instance checkboxes inside project modal
  function renderProjectInstancesCheckboxes(mappedInstances = []) {
    if (!projectInstancesCheckboxList) return;
    projectInstancesCheckboxList.innerHTML = "";

    const acceptedInstances = instancesData.filter(inst => inst.accepted);

    if (acceptedInstances.length === 0) {
      projectInstancesCheckboxList.innerHTML = `
        <div style="font-size: 0.88rem; color: var(--text-secondary); padding: 0.5rem; font-style: italic;">
          No accepted instances found. Please accept instances in the "Instances" step first.
        </div>
      `;
      return;
    }

    acceptedInstances.forEach(inst => {
      const checkboxRow = document.createElement('div');
      checkboxRow.className = 'checkbox-row';
      checkboxRow.setAttribute('data-instance-name', inst.name);
      checkboxRow.style.display = 'flex';
      checkboxRow.style.alignItems = 'center';
      checkboxRow.style.gap = '0.5rem';
      checkboxRow.style.padding = '0.3rem 0.5rem';

      const isChecked = mappedInstances.includes(inst.name);
      const isAccepted = inst.accepted;

      checkboxRow.innerHTML = `
        <input type="checkbox" id="proj-chk-${inst.id}" value="${inst.name}" ${isChecked ? 'checked' : ''}>
        <label for="proj-chk-${inst.id}" style="font-size: 0.88rem; cursor: pointer; color: var(--cyber-green);">
          ${inst.name}
        </label>
      `;

      projectInstancesCheckboxList.appendChild(checkboxRow);
    });
  }

  // Bind Project Modal actions
  if (closeProjectModalX) closeProjectModalX.addEventListener('click', closeProjectModal);
  if (cancelProjectBtn) cancelProjectBtn.addEventListener('click', closeProjectModal);

  if (saveProjectBtn) {
    saveProjectBtn.addEventListener('click', () => {
      const name = projectNameInput.value.trim();
      const domain = projectDomainInput.value.trim();
      const type = projectTypeSelect.value;

      if (name === "" || domain === "") {
        showToast("Project Name and Apex Domain cannot be empty!");
        return;
      }

      // Collect selected instances
      const selectedInstances = [];
      const checkboxes = projectInstancesCheckboxList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(chk => {
        if (chk.checked) {
          selectedInstances.push(chk.value);
        }
      });

      if (editingProjectId) {
        // Update existing project
        const proj = projectsData.find(p => p.id === editingProjectId);
        if (proj) {
          proj.name = name;
          proj.domain = domain;
          proj.type = type;
          proj.instances = selectedInstances;
          showToast(`Project "${name}" updated successfully!`, true);
        }
      } else {
        // Create new project
        const newProj = {
          id: "proj-" + Date.now(),
          name,
          domain,
          type,
          instances: selectedInstances,
          accepted: false
        };
        projectsData.push(newProj);
        showToast(`Project "${name}" created successfully!`, true);
      }

      closeProjectModal();
      renderProjectsList();
      controlsLeftText.textContent = `${projectsData.filter(p => p.accepted).length}/${projectsData.length} projects accepted · each writes the project + links instances`;
    });
  }

  // Filter instances in modal in real-time
  if (filterProjectInstancesInput) {
    filterProjectInstancesInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = projectInstancesCheckboxList.querySelectorAll('.checkbox-row');
      rows.forEach(row => {
        const name = row.getAttribute('data-instance-name').toLowerCase();
        if (name.includes(query)) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Bind project tab switching
  if (projectsTabPending) {
    projectsTabPending.addEventListener('click', () => {
      projectsTabPending.classList.add('active');
      projectsTabAccepted.classList.remove('active');
      currentProjectsTab = "pending";
      renderProjectsList();
    });
  }

  if (projectsTabAccepted) {
    projectsTabAccepted.addEventListener('click', () => {
      projectsTabAccepted.classList.add('active');
      projectsTabPending.classList.remove('active');
      currentProjectsTab = "accepted";
      renderProjectsList();
    });
  }

  // Bind projects search
  if (projectsSearchInput) {
    projectsSearchInput.addEventListener('input', (e) => {
      projectsSearchQuery = e.target.value;
      renderProjectsList();
    });
  }

  // Bind Create project button trigger
  if (createProjectBtn) {
    createProjectBtn.addEventListener('click', () => openProjectModal());
  }

  // -------------------------------------------------------------
  // STEP 5: CLIENTS ASSIGNMENT MANAGEMENT
  // -------------------------------------------------------------
  const clientsProjectsList = document.getElementById('clients-projects-list');
  const clientsAcceptedCount = document.getElementById('clients-accepted-count');
  const clientsDecidedSummary = document.getElementById('clients-decided-summary');
  const createClientBtn = document.getElementById('create-client-btn');

  // Client Modal Elements
  const clientModal = document.getElementById('client-modal');
  const closeClientModalX = document.getElementById('close-client-modal-x');
  const cancelClientBtn = document.getElementById('cancel-client-btn');
  const saveClientBtn = document.getElementById('save-client-btn');
  const clientNameInput = document.getElementById('client-name-input');
  const clientEmailInput = document.getElementById('client-email-input');
  const clientTypeSelect = document.getElementById('client-type-select');
  const clientSlaSelect = document.getElementById('client-sla-select');

  function openClientModal() {
    if (!clientModal) return;
    clientNameInput.value = "";
    clientEmailInput.value = "";
    clientTypeSelect.value = "External Tenant";
    clientSlaSelect.value = "Gold";
    clientModal.classList.add('active');
  }

  function closeClientModal() {
    if (clientModal) {
      clientModal.classList.remove('active');
    }
  }

  function renderClientsView() {
    if (!clientsProjectsList) return;
    clientsProjectsList.innerHTML = "";

    const acceptedProjects = projectsData.filter(proj => proj.accepted);
    if (clientsAcceptedCount) {
      clientsAcceptedCount.textContent = acceptedProjects.length;
    }

    if (acceptedProjects.length === 0) {
      clientsProjectsList.innerHTML = `
        <div class="placeholder-step-view" style="padding: 2.5rem 1rem;">
          <h2 style="font-size: 1.1rem; color: var(--text-secondary);">No accepted projects to assign.</h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.5rem;">Please accept projects in the "Projects" step first.</p>
        </div>
      `;
      if (clientsDecidedSummary) {
        clientsDecidedSummary.textContent = "0/0 projects decided";
      }
      return;
    }

    acceptedProjects.forEach(proj => {
      const row = document.createElement('div');
      row.className = 'client-row';
      row.setAttribute('data-project-id', proj.id);

      // Build client dropdown options
      let optionsHTML = `<option value="">-- pick client --</option>`;
      clientsData.forEach(cli => {
        const isSelected = proj.clientId === cli.id ? 'selected' : '';
        optionsHTML += `<option value="${cli.id}" ${isSelected}>${cli.name} (${cli.type})</option>`;
      });
      optionsHTML += `<option value="__new_client__">+ Create new client...</option>`;

      row.innerHTML = `
        <div class="client-project-info">
          <span class="client-project-name">${proj.name}</span>
          <span class="client-project-status" id="status-${proj.id}">
            ${proj.clientId ? 'assigned to ' + (clientsData.find(c => c.id === proj.clientId)?.name || '') : 'needs a decision'}
          </span>
        </div>
        <div class="client-selector-container">
          <select class="client-select" id="select-${proj.id}">
            ${optionsHTML}
          </select>
        </div>
      `;

      // Handle client selection change
      const select = row.querySelector('.client-select');
      select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === "__new_client__") {
          // Restore previous selection in dropdown
          select.value = proj.clientId || "";
          openClientModal();
          return;
        }

        proj.clientId = val || null;
        
        // Update status text
        const statusSpan = document.getElementById(`status-${proj.id}`);
        if (statusSpan) {
          statusSpan.textContent = proj.clientId ? 'assigned to ' + (clientsData.find(c => c.id === proj.clientId)?.name || '') : 'needs a decision';
        }

        if (proj.clientId) {
          const clientName = clientsData.find(c => c.id === proj.clientId)?.name || 'Client';
          showToast(`Project "${proj.name}" assigned to ${clientName}.`, true);
        } else {
          showToast(`Removed client assignment for project "${proj.name}".`);
        }

        updateClientsSummary();
      });

      clientsProjectsList.appendChild(row);
    });

    updateClientsSummary();
  }

  function updateClientsSummary() {
    if (!clientsDecidedSummary) return;
    const acceptedProjects = projectsData.filter(proj => proj.accepted);
    const decidedCount = acceptedProjects.filter(proj => proj.clientId).length;
    clientsDecidedSummary.textContent = `${decidedCount}/${acceptedProjects.length} project${acceptedProjects.length === 1 ? '' : 's'} decided`;
    
    if (controlsLeftText && currentStep === 5) {
      controlsLeftText.textContent = `${decidedCount}/${acceptedProjects.length} projects assigned to clients · assign each accepted project to a client`;
    }
  }

  if (createClientBtn) {
    createClientBtn.addEventListener('click', openClientModal);
  }
  if (closeClientModalX) closeClientModalX.addEventListener('click', closeClientModal);
  if (cancelClientBtn) cancelClientBtn.addEventListener('click', closeClientModal);

  if (saveClientBtn) {
    saveClientBtn.addEventListener('click', () => {
      const name = clientNameInput.value.trim();
      const email = clientEmailInput.value.trim();
      const type = clientTypeSelect.value;
      const sla = clientSlaSelect.value;

      if (name === "") {
        showToast("Client Name cannot be empty!");
        return;
      }

      const newClient = {
        id: "cli-" + Date.now(),
        name,
        email,
        type,
        sla
      };

      clientsData.push(newClient);
      showToast(`Client "${name}" created successfully!`, true);
      closeClientModal();
      
      // Re-render Step 5 view to populate the new client into all dropdowns
      if (currentStep === 5) {
        renderClientsView();
      }
    });
  }
  // -------------------------------------------------------------
  // STEP 6: SUMMARY REPORT & PDF DOWNLOAD
  // -------------------------------------------------------------
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const reportSourcesList = document.getElementById('report-sources-list');
  const reportCountServers = document.getElementById('report-count-servers');
  const reportCountDomains = document.getElementById('report-count-domains');
  const reportCountDatabases = document.getElementById('report-count-databases');
  const reportInstancesList = document.getElementById('report-instances-list');
  const reportProjectsTableBody = document.getElementById('report-projects-table-body');
  const reportDateBadge = document.getElementById('report-date-badge');
  const reportTimestamp = document.getElementById('report-timestamp');

  function renderReviewReport() {
    if (!reportSourcesList) return;

    // Date & Timestamp
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    if (reportDateBadge) {
      reportDateBadge.textContent = `DATE: ${formattedDate}`;
    }
    if (reportTimestamp) {
      reportTimestamp.textContent = `Generated via Uplink Console on ${now.toLocaleString()}`;
    }
    if (downloadPdfBtn) {
      downloadPdfBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="display: inline-block; vertical-align: middle; margin-right: 5px;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Report (${formattedDate})
      `;
    }

    // 1. Sources (Step 1)
    reportSourcesList.innerHTML = "";
    if (addedSources.length === 0) {
      reportSourcesList.innerHTML = `<span style="font-size: 0.88rem; color: var(--text-muted); font-style: italic;">No data sources connected</span>`;
    } else {
      addedSources.forEach(src => {
        let logoSVG = "";
        if (src.provider === 'aws') {
          logoSVG = `<svg viewBox="0 0 256 154" width="22" height="15"><path d="M128 0C80 0 32 15 0 30l10 20c28-13 70-26 118-26 80 0 108 30 108 55 0 12-8 23-28 29-13-14-36-23-68-23-48 0-82 25-82 61 0 33 28 53 62 53 33 0 57-13 69-32 8 13 22 20 44 20 37 0 63-22 63-63 0-57-45-124-170-124zm-48 114c0-18 18-30 43-30 18 0 31 6 37 13v15c-6 13-20 22-38 22-24 0-42-8-42-20z" fill="currentColor"/><path d="M16 130c25 15 65 24 112 24 64 0 108-16 112-42l-18-6c-8 18-44 28-94 28-44 0-82-7-104-18l-8 14zm214-26l12 18 14-32-26 14z" fill="#FF9900"/></svg>`;
        } else if (src.provider === 'azure') {
          logoSVG = `<svg viewBox="0 -6 256 256" width="16" height="16"><path d="M0 137.5l36-39.7 78.4 29.8L38.7 244z" fill="#00a4ef"/><path d="M118.8 38.6L38.7 244h78.8l102.3-159.2z" fill="#50e6ff"/><path d="M118.8 38.6L256 195.8v-72.2L165.1 0z" fill="#0078d4"/><path d="M165.1 0h-46.3l101.4 125.7L256 123.6z" fill="#0058a3"/></svg>`;
        } else if (src.provider === 'gcp') {
          logoSVG = `<svg viewBox="0 0 256 222" width="16" height="15"><path d="M128 25.7v91.4l79 45.6V71.3l-79-45.6z" fill="#4285F4"/><path d="M128 25.7L49 71.3v91.4l79-45.6V25.7z" fill="#EA4335"/><path d="M49 162.7l79 45.6v-91.4l-79-45.6v91.4z" fill="#FBBC05"/><path d="M128 117.1v91.4l79-45.6v-91.4l-79 45.6z" fill="#34A853"/></svg>`;
        } else if (src.provider === 'oracle') {
          logoSVG = `<svg viewBox="0 0 256 170" width="18" height="12"><path d="M128 0C57.3 0 0 38 0 85s57.3 85 128 85 128-38 128-85S198.7 0 128 0zm0 134c-47.5 0-86-22-86-49s38.5-49 86-49 86 22 86 49-38.5 49-86 49z" fill="#F80000"/></svg>`;
        } else {
          logoSVG = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></svg>`;
        }

        const srcRow = document.createElement('div');
        srcRow.className = 'report-source-row';
        srcRow.innerHTML = `
          <div class="report-source-logo-wrapper">${logoSVG}</div>
          <div>
            <span class="report-source-name" style="display: block; font-weight: 600;">${src.name}</span>
            <span class="report-source-meta">${src.meta}</span>
          </div>
        `;
        reportSourcesList.appendChild(srcRow);
      });
    }

    // 2. Infrastructure Elements (Step 2)
    const confirmedServersCount = Array.from(document.querySelectorAll('#panel-servers .infra-row')).filter(row => {
      const badge = row.querySelector('.status-pill');
      return badge && badge.textContent.trim().toLowerCase() === 'confirmed';
    }).length;
    
    const confirmedDomainsCount = Array.from(document.querySelectorAll('#panel-domains .infra-row')).filter(row => {
      const badge = row.querySelector('.status-pill');
      return badge && badge.textContent.trim().toLowerCase() === 'confirmed';
    }).length;
    
    const confirmedDatabasesCount = Array.from(document.querySelectorAll('#panel-databases .infra-row')).filter(row => {
      const badge = row.querySelector('.status-pill');
      return badge && badge.textContent.trim().toLowerCase() === 'confirmed';
    }).length;

    if (reportCountServers) reportCountServers.textContent = confirmedServersCount;
    if (reportCountDomains) reportCountDomains.textContent = confirmedDomainsCount;
    if (reportCountDatabases) reportCountDatabases.textContent = confirmedDatabasesCount;

    // Confirmed items lists
    const confirmedServersList = document.getElementById('report-confirmed-servers-list');
    const confirmedDomainsList = document.getElementById('report-confirmed-domains-list');
    const confirmedDatabasesList = document.getElementById('report-confirmed-databases-list');

    const reportConfirmedServersCount = document.getElementById('report-confirmed-servers-count');
    const reportConfirmedDomainsCount = document.getElementById('report-confirmed-domains-count');
    const reportConfirmedDatabasesCount = document.getElementById('report-confirmed-databases-count');
    
    if (reportConfirmedServersCount) reportConfirmedServersCount.textContent = confirmedServersCount;
    if (reportConfirmedDomainsCount) reportConfirmedDomainsCount.textContent = confirmedDomainsCount;
    if (reportConfirmedDatabasesCount) reportConfirmedDatabasesCount.textContent = confirmedDatabasesCount;

    const populateConfirmedList = (container, listType) => {
      if (!container) return;
      container.innerHTML = "";
      
      const confirmedRows = Array.from(document.querySelectorAll(`#panel-${listType} .infra-row`)).filter(row => {
        const badge = row.querySelector('.status-pill');
        return badge && badge.textContent.trim().toLowerCase() === 'confirmed';
      });

      if (confirmedRows.length === 0) {
        container.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">No confirmed ${listType}</span>`;
      } else {
        confirmedRows.forEach(row => {
          const nameSpan = row.querySelector('.row-name');
          if (nameSpan) {
            const name = nameSpan.textContent.trim();
            const pill = document.createElement('span');
            pill.className = 'report-confirmed-item';
            pill.textContent = name;
            container.appendChild(pill);
          }
        });
      }
    };

    populateConfirmedList(confirmedServersList, 'servers');
    populateConfirmedList(confirmedDomainsList, 'domains');
    populateConfirmedList(confirmedDatabasesList, 'databases');

    // 3. Accepted Instances (Step 3)
    reportInstancesList.innerHTML = "";
    const acceptedInstances = instancesData.filter(i => i.accepted);
    if (acceptedInstances.length === 0) {
      reportInstancesList.innerHTML = `<span style="font-size: 0.88rem; color: var(--text-muted); font-style: italic; grid-column: span 2;">No instances accepted</span>`;
    } else {
      acceptedInstances.forEach(inst => {
        const instBox = document.createElement('div');
        instBox.className = 'report-instance-item';
        instBox.innerHTML = `
          <span class="report-instance-name">${inst.name}</span>
          <span class="report-instance-components">${inst.components.length} component${inst.components.length === 1 ? '' : 's'}</span>
        `;
        reportInstancesList.appendChild(instBox);
      });
    }

    // 4 & 5. Projects & Client mapping (Step 4 & 5)
    reportProjectsTableBody.innerHTML = "";
    const acceptedProjects = projectsData.filter(p => p.accepted);
    if (acceptedProjects.length === 0) {
      reportProjectsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 1.5rem;">
            No projects accepted or configured.
          </td>
        </tr>
      `;
    } else {
      acceptedProjects.forEach(proj => {
        const clientObj = clientsData.find(c => c.id === proj.clientId);
        const clientName = clientObj ? `${clientObj.name} (${clientObj.type})` : 'Unassigned';
        const mappedInstancesText = proj.instances.length === 0 
          ? 'None' 
          : proj.instances.join(', ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 700;">${proj.name}</td>
          <td>${proj.domain}</td>
          <td style="text-transform: capitalize; font-weight: 600;">${proj.type}</td>
          <td style="font-size: 0.82rem;">${mappedInstancesText}</td>
          <td style="color: ${clientObj ? 'var(--cyber-green)' : 'var(--text-secondary)'}; font-weight: 600;">${clientName}</td>
        `;
        reportProjectsTableBody.appendChild(tr);
      });
    }
  }

  function triggerPdfDownload(showCommittedToast = false) {
    if (typeof html2pdf === "undefined") {
      showToast("The PDF generation library is loading. Please wait a second and try again.");
      return;
    }

    const element = document.getElementById('review-report-container');
    if (!element) return;

    showToast("Generating PDF report, please wait...", true);

    // Temporarily scroll to top to prevent html2canvas offset bugs
    const originalScrollY = window.scrollY;
    window.scrollTo(0, 0);

    // Apply light-theme print styles
    element.classList.add('generating-pdf');

    const opt = {
      margin:       [0.4, 0.4, 0.4, 0.4],
      filename:     'uplink-discovery-report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      window.scrollTo(0, originalScrollY);
      element.classList.remove('generating-pdf');
      if (showCommittedToast) {
        showToast("Committed report PDF downloaded successfully!", true);
      } else {
        showToast("PDF report downloaded successfully!", true);
      }
    }).catch(err => {
      element.classList.remove('generating-pdf');
      showToast("Failed to generate PDF. Please try again.");
      console.error("PDF generation error: ", err);
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      triggerPdfDownload(false);
    });
  }


  // -------------------------------------------------------------
  // STEP 1: DYNAMIC SOURCES MANAGEMENT
  // -------------------------------------------------------------
  let activeProvider = 'aws'; // Default

  // DOM Elements for Step 1 & Add Source Modal
  const addSourceModal = document.getElementById('add-source-modal');
  const addSourceTriggerInitial = document.getElementById('add-source-trigger-initial');
  const addSourceTriggerMore = document.getElementById('add-source-trigger-more');
  const closeAddSourceModalX = document.getElementById('close-add-source-modal-x');
  const cancelAddSourceBtn = document.getElementById('cancel-add-source-btn');
  const saveSourceBtn = document.getElementById('save-source-btn');
  const sourcesStackContainer = document.getElementById('sources-stack-container');
  const sourceNameInput = document.getElementById('source-name-input');
  const providerCards = document.querySelectorAll('#add-source-modal .provider-card');

  // Toggle active provider card and show relevant dynamic inputs
  providerCards.forEach(card => {
    card.addEventListener('click', () => {
      providerCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeProvider = card.getAttribute('data-provider');

      // Hide all dynamic fields
      document.querySelectorAll('#add-source-modal .provider-specific-fields').forEach(f => f.classList.add('hidden'));

      // Show active fields
      const activeFields = document.getElementById(`fields-${activeProvider}`);
      if (activeFields) {
        activeFields.classList.remove('hidden');
      }

      // Autofill connection name placeholder
      const defaultNames = {
        aws: 'AWS Production Account',
        azure: 'Azure Enterprise Subscription',
        gcp: 'GCP Onboarding Project',
        oracle: 'Oracle Financials DB',
        ssh: 'Linux Bastion Server',
        db: 'Customer MySQL DB'
      };
      if (sourceNameInput) {
        sourceNameInput.value = '';
        sourceNameInput.placeholder = defaultNames[activeProvider] || 'My Data Source';
      }

      // Reset ports to default values based on selected DB engine
      if (activeProvider === 'db') {
        const dbTypeSelect = document.getElementById('db-type');
        const dbPortInput = document.getElementById('db-port');
        if (dbTypeSelect && dbPortInput) {
          dbTypeSelect.value = 'mysql';
          dbPortInput.value = '3306';
        }
      }
    });
  });

  // DB Type select change modifies port automatically
  const dbTypeSelect = document.getElementById('db-type');
  if (dbTypeSelect) {
    dbTypeSelect.addEventListener('change', (e) => {
      const dbPortInput = document.getElementById('db-port');
      if (dbPortInput) {
        if (e.target.value === 'mysql') dbPortInput.value = '3306';
        else if (e.target.value === 'postgres') dbPortInput.value = '5432';
        else if (e.target.value === 'mssql') dbPortInput.value = '1433';
      }
    });
  }

  // Open and Close Modal handlers
  const openAddSourceModal = () => {
    if (sourceNameInput) {
      sourceNameInput.value = '';
      sourceNameInput.placeholder = 'AWS Production Account';
    }
    document.querySelectorAll('#add-source-modal input[type="text"]').forEach(input => {
      if (input.id !== 'source-name-input') input.value = '';
    });
    const gcpSA = document.getElementById('gcp-service-account');
    if (gcpSA) gcpSA.value = '';

    providerCards.forEach(c => c.classList.remove('active'));
    const awsCard = document.querySelector('#add-source-modal .provider-card[data-provider="aws"]');
    if (awsCard) awsCard.classList.add('active');
    activeProvider = 'aws';

    document.querySelectorAll('#add-source-modal .provider-specific-fields').forEach(f => f.classList.add('hidden'));
    const awsFields = document.getElementById('fields-aws');
    if (awsFields) awsFields.classList.remove('hidden');

    addSourceModal.classList.add('active');
  };

  const closeAddSourceModal = () => {
    addSourceModal.classList.remove('active');
  };

  if (addSourceTriggerInitial) addSourceTriggerInitial.addEventListener('click', openAddSourceModal);
  if (addSourceTriggerMore) addSourceTriggerMore.addEventListener('click', openAddSourceModal);
  if (closeAddSourceModalX) closeAddSourceModalX.addEventListener('click', closeAddSourceModal);
  if (cancelAddSourceBtn) cancelAddSourceBtn.addEventListener('click', closeAddSourceModal);

  // Save new source to stack
  if (saveSourceBtn) {
    saveSourceBtn.addEventListener('click', () => {
      let nameVal = sourceNameInput.value.trim();
      if (nameVal === '') {
        nameVal = sourceNameInput.placeholder;
      }

      // Collect specific details based on active provider
      let metaDetails = '';
      if (activeProvider === 'aws') {
        const region = document.getElementById('aws-region-select').value;
        metaDetails = `AWS Region: ${region} · IAM Role Auth`;
      } else if (activeProvider === 'azure') {
        const subId = document.getElementById('azure-subscription').value.trim() || 'Default Subscription';
        metaDetails = `Azure Sub: ...${subId.slice(-6)} · Tenant Managed`;
      } else if (activeProvider === 'gcp') {
        const projId = document.getElementById('gcp-project-id').value.trim() || 'default-gcp-project';
        metaDetails = `GCP Project: ${projId} · Service Account Auth`;
      } else if (activeProvider === 'oracle') {
        const host = document.getElementById('oracle-host').value.trim() || 'localhost';
        const port = document.getElementById('oracle-port').value;
        const sid = document.getElementById('oracle-sid').value.trim() || 'ORCL';
        metaDetails = `Oracle DB: ${host}:${port}/${sid}`;
      } else if (activeProvider === 'ssh') {
        const host = document.getElementById('ssh-host').value.trim() || '127.0.0.1';
        const port = document.getElementById('ssh-port').value;
        metaDetails = `Linux Server: ${host}:${port} · SSH Auth`;
      } else if (activeProvider === 'db') {
        const host = document.getElementById('db-host').value.trim() || '127.0.0.1';
        const port = document.getElementById('db-port').value;
        const type = document.getElementById('db-type').value.toUpperCase();
        metaDetails = `${type} DB: ${host}:${port}`;
      }

      // Create new source object
      const newSource = {
        id: 'src-' + Date.now(),
        provider: activeProvider,
        name: nameVal,
        meta: metaDetails
      };

      addedSources.push(newSource);
      renderSourcesStack();
      closeAddSourceModal();
      showToast(`Successfully connected source: ${nameVal}`, true);
    });
  }

  // Render Stack layout in step-view-1
  const renderSourcesStack = () => {
    if (!sourcesStackContainer) return;

    sourcesStackContainer.innerHTML = '';

    if (addedSources.length === 0) {
      sourcesStackContainer.classList.add('hidden');
      if (addSourceTriggerInitial) addSourceTriggerInitial.classList.remove('hidden');
      if (addSourceTriggerMore) addSourceTriggerMore.classList.add('hidden');
      updateStepUI();
      return;
    }

    sourcesStackContainer.classList.remove('hidden');
    if (addSourceTriggerInitial) addSourceTriggerInitial.classList.add('hidden');
    if (addSourceTriggerMore) addSourceTriggerMore.classList.add('hidden');

    addedSources.forEach(source => {
      const item = document.createElement('div');
      item.className = 'source-stack-item';
      item.setAttribute('data-id', source.id);

      // SVG logos based on provider
      let logoHTML = '';
      if (source.provider === 'aws') {
        logoHTML = `
          <svg viewBox="0 0 256 154" width="32" height="20">
            <path d="M128 0C80 0 32 15 0 30l10 20c28-13 70-26 118-26 80 0 108 30 108 55 0 12-8 23-28 29-13-14-36-23-68-23-48 0-82 25-82 61 0 33 28 53 62 53 33 0 57-13 69-32 8 13 22 20 44 20 37 0 63-22 63-63 0-57-45-124-170-124zm-48 114c0-18 18-30 43-30 18 0 31 6 37 13v15c-6 13-20 22-38 22-24 0-42-8-42-20z" fill="#FF9900"/>
            <path d="M16 130c25 15 65 24 112 24 64 0 108-16 112-42l-18-6c-8 18-44 28-94 28-44 0-82-7-104-18l-8 14zm214-26l12 18 14-32-26 14z" fill="#FF9900"/>
          </svg>
        `;
      } else if (source.provider === 'azure') {
        logoHTML = `
          <svg viewBox="0 0 256 244" width="22" height="22">
            <path d="M0 137.5l36-39.7 78.4 29.8L38.7 244z" fill="#0078d4"/>
            <path d="M118.8 38.6L38.7 244h78.8l102.3-159.2z" fill="#50e6ff"/>
            <path d="M118.8 38.6L256 195.8v-72.2L165.1 0z" fill="#0078d4"/>
            <path d="M165.1 0h-46.3l101.4 125.7L256 123.6z" fill="#114a82"/>
          </svg>
        `;
      } else if (source.provider === 'gcp') {
        logoHTML = `
          <svg viewBox="0 0 256 222" width="24" height="20">
            <path d="M128 25.7v91.4l79 45.6V71.3l-79-45.6z" fill="#4285F4"/>
            <path d="M128 25.7L49 71.3v91.4l79-45.6V25.7z" fill="#EA4335"/>
            <path d="M49 162.7l79 45.6v-91.4l-79-45.6v91.4z" fill="#FBBC05"/>
            <path d="M128 117.1v91.4l79-45.6v-91.4l-79 45.6z" fill="#34A853"/>
          </svg>
        `;
      } else if (source.provider === 'oracle') {
        logoHTML = `
          <svg viewBox="0 0 256 170" width="28" height="18">
            <path d="M128 0C57.3 0 0 38 0 85s57.3 85 128 85 128-38 128-85S198.7 0 128 0zm0 134c-47.5 0-86-22-86-49s38.5-49 86-49 86 22 86 49-38.5 49-86 49z" fill="#F80000"/>
          </svg>
        `;
      } else if (source.provider === 'ssh') {
        logoHTML = `
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2">
            <rect x="2" y="2" width="20" height="6" rx="1" />
            <rect x="2" y="9" width="20" height="6" rx="1" />
            <rect x="2" y="16" width="20" height="6" rx="1" />
            <circle cx="6" cy="5" r="1" fill="currentColor" />
            <circle cx="6" cy="12" r="1" fill="currentColor" />
            <circle cx="6" cy="19" r="1" fill="currentColor" />
          </svg>
        `;
      } else if (source.provider === 'db') {
        logoHTML = `
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
          </svg>
        `;
      }

      item.innerHTML = `
        <div class="source-item-info">
          <div class="source-item-logo-wrapper">
            ${logoHTML}
          </div>
          <div class="source-item-details">
            <span class="source-item-name">${source.name}</span>
            <span class="source-item-meta">${source.meta}</span>
          </div>
        </div>
        <button class="source-remove-btn" title="Remove Data Source">
          &times;
        </button>
      `;

      item.querySelector('.source-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addedSources = addedSources.filter(s => s.id !== source.id);
        renderSourcesStack();
        showToast(`Disconnected source: ${source.name}`);
      });

      sourcesStackContainer.appendChild(item);
    });

    // Append the "Add more sources" card inside the grid container
    const inlineAddCard = document.createElement('button');
    inlineAddCard.className = 'add-source-card-btn';
    inlineAddCard.style.marginTop = '0';
    inlineAddCard.style.marginBottom = '0';
    inlineAddCard.innerHTML = `
      <span class="plus-icon">+</span>
      <span>Add more sources</span>
    `;
    inlineAddCard.addEventListener('click', () => {
      const modal = document.getElementById('add-source-modal');
      if (modal) modal.classList.add('active');
    });
    sourcesStackContainer.appendChild(inlineAddCard);
    updateStepUI();
    updateSocSourcesCard();
  };

  // Setup instances tab triggers initially
  setupInstancesTabs();

  // Click handler for top navigation tabs (Discovery etc.)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tabName = link.textContent.trim();
      const href = link.getAttribute('href');
      
      if (!isCommitted && href !== '#discovery') {
        e.preventDefault();
        e.stopPropagation();
        showToast(`"${tabName}" is locked. Complete all onboarding steps and commit on Step 6 first.`);
        return;
      }

      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Hide/show wrappers based on active tab
      const discoveryWrapper = document.getElementById('discovery-view-wrapper');
      const stateWrapper = document.getElementById('state-view-wrapper');
      const pulseWrapper = document.getElementById('pulse-view-wrapper');
      const inventoryWrapper = document.getElementById('inventory-view-wrapper');
      const settingsWrapper = document.getElementById('settings-view-wrapper');
      const socWrapper = document.getElementById('soc-view-wrapper');
      const securityWrapper = document.getElementById('security-view-wrapper');
      const clientWrapper = document.getElementById('client-view-wrapper');
      const projectWrapper = document.getElementById('project-view-wrapper');
      const runsWrapper = document.getElementById('runs-view-wrapper');

      // Close any active side drawers on tab switch
      const runDrawer = document.getElementById('run-details-drawer');
      if (runDrawer) runDrawer.classList.remove('active');
      const alertDrawer = document.getElementById('alert-details-drawer');
      if (alertDrawer) alertDrawer.classList.remove('active');

      // Hide all wrappers first
      if (discoveryWrapper) discoveryWrapper.classList.add('hidden');
      if (stateWrapper) stateWrapper.classList.add('hidden');
      if (pulseWrapper) pulseWrapper.classList.add('hidden');
      if (inventoryWrapper) inventoryWrapper.classList.add('hidden');
      if (settingsWrapper) settingsWrapper.classList.add('hidden');
      if (socWrapper) socWrapper.classList.add('hidden');
      if (securityWrapper) securityWrapper.classList.add('hidden');
      if (clientWrapper) clientWrapper.classList.add('hidden');
      if (projectWrapper) projectWrapper.classList.add('hidden');
      if (runsWrapper) runsWrapper.classList.add('hidden');
      
      if (href === '#state') {
        if (stateWrapper) stateWrapper.classList.remove('hidden');
        renderStatePage();
      } else if (href === '#discovery') {
        if (discoveryWrapper) discoveryWrapper.classList.remove('hidden');
      } else if (href === '#pulse') {
        if (pulseWrapper) pulseWrapper.classList.remove('hidden');
        renderPulsePage();
      } else if (href === '#inventory') {
        if (inventoryWrapper) inventoryWrapper.classList.remove('hidden');
        renderInventoryPage();
      } else if (href === '#soc') {
        if (socWrapper) socWrapper.classList.remove('hidden');
        initSocDashboard();
      } else if (href === '#security') {
        if (securityWrapper) securityWrapper.classList.remove('hidden');
        initSecurityDashboard();
      } else if (href === '#client') {
        if (clientWrapper) clientWrapper.classList.remove('hidden');
        renderClientPage();
      } else if (href === '#project') {
        if (projectWrapper) projectWrapper.classList.remove('hidden');
        renderProjectPage();
      } else if (href === '#runs') {
        if (runsWrapper) runsWrapper.classList.remove('hidden');
        renderRunsPage();
      }
    });
  });

  // Logo container click listener (redirects to State dashboard when committed or Discovery when uncommitted)
  const logoContainer = document.querySelector('.logo-container');
  if (logoContainer) {
    logoContainer.addEventListener('click', () => {
      if (isCommitted) {
        navigateToState();
      } else {
        const discoveryLink = document.querySelector('a[href="#discovery"]');
        if (discoveryLink) discoveryLink.click();
      }
    });
  }

  // Profile Dropdown Toggle & Items Click Handling
  const profileTrigger = document.getElementById('profile-trigger');
  const profileDropdown = document.getElementById('profile-dropdown-menu');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('active');
    });

    profileDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (item.id === 'dropdown-signout-item') {
          showToast("Signing out...", true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          // Navigate to corresponding settings tab page
          let tabName = 'profile';
          if (item.id === 'dropdown-theme-item') tabName = 'appearance';
          else if (item.id === 'dropdown-security-item') tabName = 'security';
          else if (item.id === 'dropdown-roles-item') tabName = 'roles';
          else if (item.id === 'dropdown-integrations-item') tabName = 'integrations';
          else if (item.id === 'dropdown-apidocs-item') tabName = 'api-docs';
          else if (item.id === 'dropdown-profile-item') tabName = 'profile';
          else if (item.id === 'dropdown-settings-item') tabName = 'profile';

          navigateToSettings(tabName);
        }
        profileDropdown.classList.remove('active');
      });
    });
  }

  // ---------------------------------------------------------------
  // SETTINGS VIEW: NAVIGATION & CUSTOMIZATIONS
  // ---------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Navigation helper to open settings page at a specific tab
  function navigateToSettings(tabName = 'profile') {
    // Remove active class from all main navigation items
    navLinks.forEach(l => l.classList.remove('active'));
    
    // Hide all main page wrappers, show settings wrapper
    const discoveryWrapper = document.getElementById('discovery-view-wrapper');
    const stateWrapper = document.getElementById('state-view-wrapper');
    const pulseWrapper = document.getElementById('pulse-view-wrapper');
    const inventoryWrapper = document.getElementById('inventory-view-wrapper');
    const settingsWrapper = document.getElementById('settings-view-wrapper');
    
    if (discoveryWrapper) discoveryWrapper.classList.add('hidden');
    if (stateWrapper) stateWrapper.classList.add('hidden');
    if (pulseWrapper) pulseWrapper.classList.add('hidden');
    if (inventoryWrapper) inventoryWrapper.classList.add('hidden');
    if (settingsWrapper) settingsWrapper.classList.remove('hidden');
    
    switchSettingsTab(tabName);
    window.scrollTo(0, 0);
  }

  // Switch between settings panes inside settings layout
  function switchSettingsTab(tabName) {
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsPanes = document.querySelectorAll('.settings-pane');

    settingsNavItems.forEach(btn => {
      if (btn.getAttribute('data-settings-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    settingsPanes.forEach(pane => {
      if (pane.id === `settings-pane-${tabName}`) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('active');
      }
    });

    if (tabName === 'appearance') {
      renderPaletteOptions();
    } else if (tabName === 'logs') {
      renderSettingsAuditLogs();
    }
  }

  // Active theme settings state
  let currentThemeMode = localStorage.getItem('uplink-theme-mode') || 'dark';
  let currentPalette = localStorage.getItem('uplink-color-palette') || 'default';

  // Palette definitions for Light and Dark modes
  const lightPalettes = [
    { name: 'default', label: 'Default', primary: '#00f2fe', secondary: '#4facfe' },
    { name: 'jewel', label: 'Jewel', primary: '#d946ef', secondary: '#8b5cf6' },
    { name: 'sapphire', label: 'Sapphire', primary: '#3b82f6', secondary: '#1d4ed8' },
    { name: 'mughal', label: 'Mughal', primary: '#e11d48', secondary: '#b91c1c' }
  ];

  const darkPalettes = [
    { name: 'default', label: 'Default', primary: '#00f2fe', secondary: '#4facfe' },
    { name: 'deco', label: 'Deco', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'glass', label: 'Glass', primary: '#10b981', secondary: '#059669' },
    { name: 'linear', label: 'Linear', primary: '#ec4899', secondary: '#f43f5e' }
  ];

  // Render palette option buttons dynamically based on active light/dark theme
  function renderPaletteOptions() {
    const grid = document.getElementById('settings-palettes-grid');
    const subtitle = document.getElementById('palette-section-subtitle');
    if (!grid) return;

    const isLight = document.body.classList.contains('light-theme');
    subtitle.textContent = isLight ? 'Light palettes' : 'Dark palettes - following your system theme';

    const palettes = isLight ? lightPalettes : darkPalettes;
    grid.innerHTML = '';

    palettes.forEach(p => {
      const btn = document.createElement('button');
      btn.className = `palette-btn ${currentPalette === p.name ? 'active' : ''}`;
      btn.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>${p.label}</span>
          <div style="display: flex; gap: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${p.primary}; box-shadow: 0 0 6px ${p.primary};"></span>
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${p.secondary}; box-shadow: 0 0 6px ${p.secondary};"></span>
          </div>
        </div>
      `;

      btn.addEventListener('click', () => {
        applyColorPalette(p.name);
        renderPaletteOptions();
      });

      grid.appendChild(btn);
    });
  }

  // Apply root CSS variables for dynamic color palettes
  function applyColorPalette(paletteName) {
    currentPalette = paletteName;
    localStorage.setItem('uplink-color-palette', paletteName);

    const isLight = document.body.classList.contains('light-theme');
    const palettes = isLight ? lightPalettes : darkPalettes;
    const activePalette = palettes.find(p => p.name === paletteName) || palettes[0];

    // Modify root CSS variables
    document.documentElement.style.setProperty('--cyber-cyan', activePalette.primary);
    document.documentElement.style.setProperty('--cyber-blue', activePalette.secondary);
    document.documentElement.style.setProperty('--border-active', activePalette.primary);
    document.documentElement.style.setProperty('--border-cyber', `rgba(${hexToRgb(activePalette.primary)}, 0.15)`);
    document.documentElement.style.setProperty('--glow-cyan', `rgba(${hexToRgb(activePalette.primary)}, 0.35)`);

    showToast(`Color palette changed to: ${activePalette.label}`, true);
  }

  // Helper function to convert Hex to RGB for alpha colors
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 242, 254';
  }

  // Apply theme mode (light, dark, or system preference)
  function applyThemeMode(mode) {
    currentThemeMode = mode;
    localStorage.setItem('uplink-theme-mode', mode);

    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    let shouldBeLight = false;
    if (mode === 'light') {
      shouldBeLight = true;
    } else if (mode === 'dark') {
      shouldBeLight = false;
    } else {
      // System
      shouldBeLight = !window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (shouldBeLight) {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }

    // Sync header toggle button icon
    if (themeToggleBtn) {
      const isLight = document.body.classList.contains('light-theme');
      if (isLight) {
        themeToggleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
      } else {
        themeToggleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      }
    }

    // Automatically apply color palette based on new theme mode context
    applyColorPalette(currentPalette);
  }

  // Security section interactive handlers
  const initSecuritySection = () => {
    // 1. Regenerate Backup Codes
    const regenBtn = document.getElementById('sec-regen-backup-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        showToast('New emergency recovery codes generated! File download starting...', true);
        const codes = Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
        ).join('\n');
        const blob = new Blob([`UPLINK SECURITY RECOVERY CODES\nGenerated: ${new Date().toLocaleString()}\n\n` + codes], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'uplink-recovery-codes.txt';
        a.click();
      });
    }

    // 2. Add Hardware Key (WebAuthn Simulation)
    const addKeyBtn = document.getElementById('sec-add-key-btn');
    if (addKeyBtn) {
      addKeyBtn.addEventListener('click', () => {
        showToast('Touch your YubiKey or security key now...', true);
        setTimeout(() => {
          showToast('Security Key "YubiKey 5 Series (USB-C/NFC)" registered successfully!', true);
        }, 1500);
      });
    }

    // 3. Download Backup Codes
    const downloadCodesBtn = document.getElementById('sec-download-codes-btn');
    if (downloadCodesBtn) {
      downloadCodesBtn.addEventListener('click', () => {
        showToast('Downloading existing backup recovery codes...', true);
        const codes = Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
        ).join('\n');
        const blob = new Blob([`UPLINK EMERGENCY BACKUP CODES\nGenerated: ${new Date().toLocaleString()}\n\n` + codes], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'uplink-backup-codes.txt';
        a.click();
      });
    }

    // 4. Update Password Modal
    const changePassBtn = document.getElementById('sec-change-pass-btn');
    const passModal = document.getElementById('sec-update-password-modal');
    const passModalClose = document.getElementById('sec-pass-modal-close-btn');
    const passModalCancel = document.getElementById('sec-pass-modal-cancel-btn');
    const passModalSave = document.getElementById('sec-pass-modal-save-btn');

    if (changePassBtn && passModal) {
      changePassBtn.addEventListener('click', () => {
        passModal.classList.add('active');
      });
    }
    const closePassModal = () => {
      if (passModal) passModal.classList.remove('active');
    };
    if (passModalClose) passModalClose.addEventListener('click', closePassModal);
    if (passModalCancel) passModalCancel.addEventListener('click', closePassModal);
    if (passModalSave) {
      passModalSave.addEventListener('click', () => {
        const newPass = document.getElementById('sec-new-pass-input');
        if (newPass && !newPass.value) {
          showToast('Please enter a new password.', false);
          return;
        }
        closePassModal();
        showToast('Account password updated successfully!', true);
      });
    }

    // 5. Revoke Single Sessions
    document.querySelectorAll('.revoke-single-session-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.sec-session-item');
        if (item) {
          item.style.transition = 'all 0.3s opacity';
          item.style.opacity = '0';
          setTimeout(() => item.remove(), 300);
          showToast('Session revoked successfully.', true);
        }
      });
    });

    // 6. Revoke All Other Sessions
    const revokeAllSessionsBtn = document.getElementById('sec-revoke-all-sessions-btn');
    if (revokeAllSessionsBtn) {
      revokeAllSessionsBtn.addEventListener('click', () => {
        const list = document.getElementById('sec-sessions-list');
        if (list) {
          const items = list.querySelectorAll('.sec-session-item');
          items.forEach((item, index) => {
            if (index > 0) item.remove();
          });
        }
        showToast('All other active sessions revoked.', true);
      });
    }

    // 7. Generate API Access Token Modal
    const generateTokenBtn = document.getElementById('sec-generate-token-btn');
    const tokenModal = document.getElementById('sec-generate-token-modal');
    const tokenModalClose = document.getElementById('sec-token-modal-close-btn');
    const tokenModalCancel = document.getElementById('sec-token-modal-cancel-btn');
    const tokenModalCreate = document.getElementById('sec-token-modal-create-btn');

    if (generateTokenBtn && tokenModal) {
      generateTokenBtn.addEventListener('click', () => {
        tokenModal.classList.add('active');
      });
    }
    const closeTokenModal = () => {
      if (tokenModal) tokenModal.classList.remove('active');
    };
    if (tokenModalClose) tokenModalClose.addEventListener('click', closeTokenModal);
    if (tokenModalCancel) tokenModalCancel.addEventListener('click', closeTokenModal);
    if (tokenModalCreate) {
      tokenModalCreate.addEventListener('click', () => {
        const nameInput = document.getElementById('sec-token-name-input');
        const scopeSelect = document.getElementById('sec-token-scope-select');
        const tokenName = nameInput && nameInput.value ? nameInput.value : 'Custom API Token';
        const scope = scopeSelect ? scopeSelect.value : 'read:all';

        const tokensList = document.getElementById('sec-tokens-list');
        if (tokensList) {
          const newTokenHtml = document.createElement('div');
          newTokenHtml.className = 'settings-table-row sec-token-item';
          newTokenHtml.style.display = 'flex';
          newTokenHtml.style.justifyContent = 'space-between';
          newTokenHtml.style.alignItems = 'center';
          newTokenHtml.style.padding = '1rem 1.5rem';
          newTokenHtml.style.borderTop = '1px solid rgba(255,255,255,0.05)';
          newTokenHtml.innerHTML = `
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${tokenName}</span>
                <span style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--cyber-cyan); background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 4px; padding: 0.05rem 0.4rem;">${scope}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.15rem;">
                <span style="color: var(--text-primary);">up_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}</span> · Created Just now · Never used
              </div>
            </div>
            <button class="secondary-btn revoke-single-token-btn" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; border-radius: 4px; color: var(--text-muted);">
              Revoke
            </button>
          `;
          newTokenHtml.querySelector('.revoke-single-token-btn').addEventListener('click', (e) => {
            e.target.closest('.sec-token-item').remove();
            showToast('API Token revoked.', true);
          });
          tokensList.prepend(newTokenHtml);
        }

        closeTokenModal();
        showToast(`API Access Token "${tokenName}" generated successfully!`, true);
      });
    }

    // 8. Revoke API Tokens
    document.querySelectorAll('.revoke-single-token-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.sec-token-item');
        if (item) {
          item.remove();
          showToast('API Token revoked.', true);
        }
      });
    });
  };

  // Initialize settings options
  const initializeSettings = () => {
    // 1. Sidebar tab switching listeners
    document.querySelectorAll('.settings-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-settings-tab');
        switchSettingsTab(tab);
      });
    });

    // 2FA Manage button listener -> switches to Security settings tab
    const manage2faBtn = document.getElementById('manage-2fa-btn');
    if (manage2faBtn) {
      manage2faBtn.addEventListener('click', () => {
        switchSettingsTab('security');
      });
    }

    // Initialize Security Section Interactive Handlers
    initSecuritySection();

    // 2. Theme mode selection button click listeners
    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        applyThemeMode(mode);
      });
    });

    // 3. Sync header toggler
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isLight = document.body.classList.contains('light-theme');
        applyThemeMode(isLight ? 'dark' : 'light');
      });
    }

    // Apply saved or default values
    applyThemeMode(currentThemeMode);
  };

  // Run initialization
  initializeSettings();

  // Step cards click handler (purely informational, navigation only via buttons)
  stepCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const stepNum = idx + 1;
      const stepName = stepNames[idx];
      
      // Toast removed for professional UI
    });
  });

  // -------------------------------------------------------------
  // REAL-TIME STATE TELEMETRY & NOTIFICATION BELL
  // -------------------------------------------------------------
  let telemetryIntervalId = null;
  let telemetryData = [];
  let alertedLevel1 = new Set();
  let alertedLevel2 = new Set();
  
  // Global memory history for Linux Memory Distribution chart
  let memoryHistory = {
    available: [6.12, 6.08, 6.15, 6.10, 6.14, 6.12, 6.09, 6.11, 6.13, 6.10, 6.11, 6.12],
    free: [1.25, 1.20, 1.28, 1.22, 1.24, 1.25, 1.21, 1.23, 1.26, 1.22, 1.23, 1.25],
    cached: [4.15, 4.18, 4.12, 4.16, 4.14, 4.15, 4.19, 4.17, 4.15, 4.18, 4.17, 4.15],
    buffered: [0.85, 0.86, 0.84, 0.85, 0.85, 0.85, 0.86, 0.85, 0.84, 0.86, 0.85, 0.85]
  };

  // Utility HTML Escape Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Web Audio Alert Sound Synthesizer - Enterprise Emergency Security Siren
  function playAlertSound(isCritical = true) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Realistic Emergency Security Siren Frequency Sweep (WHOOP - WHOOP siren)
      const triggerSirenPulse = (startTime, duration, startFreq, endFreq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine'; // Crisp, smooth high-pitched emergency siren tone
        
        // Frequency sweep from startFreq to endFreq
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        // Smooth volume envelope
        const peakGain = isCritical ? 0.45 : 0.30;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Enterprise 2-burst emergency security siren sweeps (WHOOP... WHOOP...)
      triggerSirenPulse(now, 0.26, 650, 1350);
      triggerSirenPulse(now + 0.28, 0.26, 650, 1350);

    } catch (e) {
      console.warn("Web Audio Context alert sound error: ", e);
    }
  }

  // Bell Icon Dropdown Interaction
  const notificationBellBtn = document.getElementById('notification-bell-btn');
  const notificationsDropdownMenu = document.getElementById('notifications-dropdown-menu');
  const bellAlertBadge = document.getElementById('bell-alert-badge');
  const notificationsList = document.getElementById('notifications-list');
  const clearNotificationsBtn = document.getElementById('clear-notifications-btn');

  if (notificationBellBtn && notificationsDropdownMenu) {
    notificationBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationsDropdownMenu.classList.toggle('hidden');
      
      // Mark alerts as read (hide the badge)
      if (!notificationsDropdownMenu.classList.contains('hidden')) {
        if (bellAlertBadge) bellAlertBadge.classList.add('hidden');
      }
    });

    // Prevent closing when clicking inside the dropdown
    notificationsDropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', () => {
      if (notificationsDropdownMenu) {
        notificationsDropdownMenu.classList.add('hidden');
      }
    });
  }

  // Global alert log for Pulse page
  let alertsLog = [];

  // Add Notification Entry
  function addAlertNotification(serverName, cpuValue, severity = 'critical') {
    if (!notificationsList) return;
    
    // Remove empty placeholder
    const emptyPlaceholder = notificationsList.querySelector('.notification-empty');
    if (emptyPlaceholder) emptyPlaceholder.remove();

    const now = new Date();
    const alertEntry = {
      id: `alert-${Date.now()}`,
      serverName: serverName,
      cpuValue: cpuValue,
      timestamp: now.toLocaleString(),
      timeShort: now.toLocaleTimeString(),
      status: 'unread', // unread | acknowledged | resolved
      severity: severity, // warning | critical
      metric: 'node_cpu_seconds_total',
      reason: severity === 'warning'
        ? `CPU utilization on ${serverName} crossed the 80% warning threshold. Elevated system load detected on host.`
        : `CPU utilization on ${serverName} exceeded the 90% critical threshold. System is at risk of CPU exhaustion and unresponsiveness.`,
      remediations: severity === 'warning'
        ? [
            `SSH into ${serverName} and check active tasks with <code>top -o %CPU -bn1 | head -15</code>.`,
            `Analyze system metrics to verify if this is caused by an automated backup task or cron synchronization.`,
            `Verify load balancer is routing requests evenly. Check socket limits and thread count in configuration.`
          ]
        : [
            `Kill runaway processes: <code>kill -9 &lt;PID&gt;</code> to immediately release CPU cycles.`,
            `Restart application container service: <code>systemctl restart &lt;service-name&gt;</code>.`,
            `Scale deployment replicas up via CLI: <code>kubectl scale deployment/app --replicas=3</code>.`,
            `Examine kernel ring messages for memory/OOM-killer events: <code>dmesg | tail -30</code>.`
          ]
    };
    alertsLog.push(alertEntry);

    const item = document.createElement('div');
    item.className = 'notification-item alert-unread';
    item.style.cursor = 'pointer';
    item.setAttribute('data-alert-id', alertEntry.id);
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
        <span style="font-weight: 700; color: ${severity === 'critical' ? '#ef4444' : '#f97316'}; font-size: 0.75rem;">⚠ ${severity === 'critical' ? 'CRITICAL' : 'WARNING'}</span>
        <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">${now.toLocaleTimeString()}</span>
      </div>
      <div style="color: var(--text-primary); font-size: 0.78rem; font-weight: 600; margin-bottom: 0.2rem;">
        ${serverName} — CPU ${cpuValue}%
      </div>
      <div style="font-size: 0.7rem; color: var(--cyber-cyan); font-weight: 600; cursor: pointer;">
        View in Pulse →
      </div>
    `;
    
    // Click to navigate to Pulse page
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationsDropdownMenu.classList.add('hidden');
      const pulseLink = Array.from(navLinks).find(l => l.getAttribute('href') === '#pulse');
      if (pulseLink) {
        pulseLink.click();
      }
    });
    
    notificationsList.insertBefore(item, notificationsList.firstChild);

    // Show red dot alert badge
    if (bellAlertBadge) bellAlertBadge.classList.remove('hidden');
  }

  // Navigate to Pulse page programmatically
  function navigateToPulse() {
    // Unlock pulse tab if needed
    const pulseNavLink = document.querySelector('a[href="#pulse"]');
    if (pulseNavLink) {
      pulseNavLink.classList.remove('disabled');
      navLinks.forEach(l => l.classList.remove('active'));
      pulseNavLink.classList.add('active');
    }
    
    // Hide all wrappers, show pulse
    const discoveryWrapper = document.getElementById('discovery-view-wrapper');
    const stateWrapper = document.getElementById('state-view-wrapper');
    const pulseWrapper = document.getElementById('pulse-view-wrapper');
    if (discoveryWrapper) discoveryWrapper.classList.add('hidden');
    if (stateWrapper) stateWrapper.classList.add('hidden');
    if (pulseWrapper) pulseWrapper.classList.remove('hidden');
    renderPulsePage();
    window.scrollTo(0, 0);
  }

  // Navigate to State page programmatically
  function navigateToState() {
    const stateNavLink = document.querySelector('a[href="#state"]');
    if (stateNavLink) {
      stateNavLink.classList.remove('disabled');
      navLinks.forEach(l => l.classList.remove('active'));
      stateNavLink.classList.add('active');
    }
    
    const discoveryWrapper = document.getElementById('discovery-view-wrapper');
    const stateWrapper = document.getElementById('state-view-wrapper');
    const pulseWrapper = document.getElementById('pulse-view-wrapper');
    const inventoryWrapper = document.getElementById('inventory-view-wrapper');
    if (discoveryWrapper) discoveryWrapper.classList.add('hidden');
    if (stateWrapper) stateWrapper.classList.remove('hidden');
    if (pulseWrapper) pulseWrapper.classList.add('hidden');
    if (inventoryWrapper) inventoryWrapper.classList.add('hidden');
    renderStatePage();
    window.scrollTo(0, 0);
  }

  // Clear Notifications
  if (clearNotificationsBtn && notificationsList) {
    clearNotificationsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationsList.innerHTML = `
        <div class="notification-empty" style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">No active alerts. System healthy.</div>
      `;
      if (bellAlertBadge) bellAlertBadge.classList.add('hidden');
      const alertsSummary = document.getElementById('state-summary-alerts');
      if (alertsSummary) {
        alertsSummary.innerHTML = '<span style="color: var(--cyber-green);">Healthy</span>';
      }
      alertedLevel1.clear();
      alertedLevel2.clear();
      // Reset the spiked CPU to prevent instant re-trigger
      telemetryData.forEach(s => {
        if (s.spike) s.cpu = 65;
      });
    });
  }

  // ---------------------------------------------------------------
  // INVENTORY PAGE: Accordions for Servers, DBs, Domains, and Instances
  // ---------------------------------------------------------------
  function renderInventoryPage() {
    const serversList = document.getElementById('inventory-servers-list');
    const databasesList = document.getElementById('inventory-databases-list');
    const domainsList = document.getElementById('inventory-domains-list');
    const instancesList = document.getElementById('inventory-instances-list');

    if (!serversList) return;

    // Get all confirmed items from Step 2
    const confirmedServers = Array.from(document.querySelectorAll('#panel-servers .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => row.querySelector('.row-name').textContent.trim());

    const confirmedDatabases = Array.from(document.querySelectorAll('#panel-databases .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => row.querySelector('.row-name').textContent.trim());

    const confirmedDomains = Array.from(document.querySelectorAll('#panel-domains .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => {
      return {
        name: row.querySelector('.row-name').textContent.trim(),
        isSub: row.classList.contains('sub-row')
      };
    });

    const acceptedInstances = instancesData.filter(inst => inst.accepted);

    // Update section counts
    document.getElementById('inventory-count-servers').textContent = confirmedServers.length;
    document.getElementById('inventory-count-databases').textContent = confirmedDatabases.length;
    document.getElementById('inventory-count-domains').textContent = confirmedDomains.length;
    document.getElementById('inventory-count-instances').textContent = acceptedInstances.length;

    // Update tab header badge counts
    const badgeServers = document.getElementById('inventory-badge-servers');
    const badgeDatabases = document.getElementById('inventory-badge-databases');
    const badgeDomains = document.getElementById('inventory-badge-domains');
    const badgeInstances = document.getElementById('inventory-badge-instances');
    if (badgeServers) badgeServers.textContent = confirmedServers.length;
    if (badgeDatabases) badgeDatabases.textContent = confirmedDatabases.length;
    if (badgeDomains) badgeDomains.textContent = confirmedDomains.length;
    if (badgeInstances) badgeInstances.textContent = acceptedInstances.length;

    // Bind tab switching click events
    const tabBtns = document.querySelectorAll('.inventory-tab-btn');
    const sections = {
      servers: document.getElementById('inventory-sec-servers'),
      databases: document.getElementById('inventory-sec-databases'),
      domains: document.getElementById('inventory-sec-domains'),
      instances: document.getElementById('inventory-sec-instances')
    };

    tabBtns.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-inventory-tab');
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          Object.keys(sections).forEach(key => {
            if (sections[key]) {
              if (key === tab) {
                sections[key].style.display = 'block';
              } else {
                sections[key].style.display = 'none';
              }
            }
          });
        });
      }
    });

    const buildAccordionItem = (name, type, extraDetailsHtml) => {
      const item = document.createElement('div');
      item.className = 'inventory-item';

      let projectLabel = "None";
      let clientLabel = "None";

      // Match related instances
      const cleanPrefix = name.toLowerCase().replace(/_new$/, '').split(/[_-]/)[0];
      const matchedInsts = instancesData.filter(inst => {
        const nameMatch = inst.name.toLowerCase().includes(cleanPrefix);
        const hostMatch = inst.host.toLowerCase().includes(cleanPrefix);
        return nameMatch || hostMatch;
      });

      if (matchedInsts.length > 0) {
        const firstInst = matchedInsts[0];
        const proj = projectsData.find(p => p.instances.includes(firstInst.name));
        if (proj) {
          projectLabel = proj.name;
          if (proj.clientId) {
            const cli = clientsData.find(c => c.id === proj.clientId);
            if (cli) {
              clientLabel = cli.name;
            }
          }
        }
      }

      item.innerHTML = `
        <div class="inventory-item-header">
          <div class="inventory-item-title-row">
            <div class="inventory-item-title">${name}</div>
            <div class="inventory-item-mapping-summary">
              Project: <strong>${projectLabel}</strong> · Client: <strong>${clientLabel}</strong>
            </div>
          </div>
          <span style="font-size: 0.65rem; color: var(--text-muted); cursor: pointer; border: 1px solid rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;" class="accordion-toggle-btn">Expand Details ▾</span>
        </div>
        <div class="inventory-item-body">
          <div class="inventory-details-grid">
            <div class="inventory-details-block">
              <span class="inventory-details-label">Mapped Project</span>
              <span class="inventory-details-value" style="color: var(--cyber-cyan);">${projectLabel}</span>
            </div>
            <div class="inventory-details-block">
              <span class="inventory-details-label">Mapped Client</span>
              <span class="inventory-details-value" style="color: var(--cyber-blue);">${clientLabel}</span>
            </div>
            ${extraDetailsHtml}
          </div>
        </div>
      `;

      const header = item.querySelector('.inventory-item-header');
      const toggleBtn = item.querySelector('.accordion-toggle-btn');
      header.addEventListener('click', () => {
        item.classList.toggle('expanded');
        const isExpanded = item.classList.contains('expanded');
        toggleBtn.textContent = isExpanded ? 'Collapse Details ▴' : 'Expand Details ▾';
      });

      return item;
    };

    // Populate Servers
    serversList.innerHTML = '';
    if (confirmedServers.length === 0) {
      serversList.innerHTML = '<div style="padding: 1.5rem; color: var(--text-muted); font-style: italic;">No confirmed servers found.</div>';
    } else {
      confirmedServers.forEach(name => {
        const extra = `
          <div class="inventory-details-block">
            <span class="inventory-details-label">Type</span>
            <span class="inventory-details-value">Infrastructure Server</span>
          </div>
          <div class="inventory-details-block">
            <span class="inventory-details-label">Status</span>
            <span class="inventory-details-value" style="color: var(--cyber-green);">Active / Reporting</span>
          </div>
        `;
        serversList.appendChild(buildAccordionItem(name, 'server', extra));
      });
    }

    // Populate Databases
    databasesList.innerHTML = '';
    if (confirmedDatabases.length === 0) {
      databasesList.innerHTML = '<div style="padding: 1.5rem; color: var(--text-muted); font-style: italic;">No confirmed databases found.</div>';
    } else {
      confirmedDatabases.forEach(name => {
        const extra = `
          <div class="inventory-details-block">
            <span class="inventory-details-label">Type</span>
            <span class="inventory-details-value">Database instance (mysqld)</span>
          </div>
          <div class="inventory-details-block">
            <span class="inventory-details-label">Status</span>
            <span class="inventory-details-value" style="color: var(--cyber-green);">Reporting</span>
          </div>
        `;
        databasesList.appendChild(buildAccordionItem(name, 'database', extra));
      });
    }

    // Populate Domains & Apps
    domainsList.innerHTML = '';
    if (confirmedDomains.length === 0) {
      domainsList.innerHTML = '<div style="padding: 1.5rem; color: var(--text-muted); font-style: italic;">No confirmed domains found.</div>';
    } else {
      const parentDomains = [];
      const subdomains = [];
      
      confirmedDomains.forEach(d => {
        if (!d.isSub) {
          parentDomains.push(d);
        } else {
          subdomains.push(d);
        }
      });
      
      const topLevelDomains = [...parentDomains];
      const nestedMap = new Map();
      
      parentDomains.forEach(p => nestedMap.set(p.name, []));
      
      subdomains.forEach(sub => {
        const parent = parentDomains.find(p => sub.name.endsWith('.' + p.name));
        if (parent) {
          nestedMap.get(parent.name).push(sub);
        } else {
          topLevelDomains.push(sub);
          nestedMap.set(sub.name, []);
        }
      });

      topLevelDomains.forEach(domain => {
        const subdomainsForParent = nestedMap.get(domain.name) || [];
        
        let subdomainsHtml = '';
        if (subdomainsForParent.length > 0) {
          let rowsHtml = '';
          subdomainsForParent.forEach(sub => {
            let subProject = "None";
            let subClient = "None";
            
            const cleanSubPrefix = sub.name.toLowerCase().replace(/_new$/, '').split(/[_-]/)[0];
            const matchedInsts = instancesData.filter(inst => {
              const nameMatch = inst.name.toLowerCase().includes(cleanSubPrefix);
              const hostMatch = inst.host.toLowerCase().includes(cleanSubPrefix);
              return nameMatch || hostMatch;
            });

            if (matchedInsts.length > 0) {
              const firstInst = matchedInsts[0];
              const proj = projectsData.find(p => p.instances.includes(firstInst.name));
              if (proj) {
                subProject = proj.name;
                if (proj.clientId) {
                  const cli = clientsData.find(c => c.id === proj.clientId);
                  if (cli) {
                    subClient = cli.name;
                  }
                }
              }
            }

            rowsHtml += `
              <div class="subdomain-nested-row" style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 6px; padding: 0.6rem 0.75rem; display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem;">
                <div>
                  <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">${sub.name}</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;">
                    Project: <strong style="color: var(--cyber-cyan);">${subProject}</strong> · Client: <strong style="color: var(--cyber-blue);">${subClient}</strong>
                  </div>
                </div>
                <div style="text-align: right; font-size: 0.7rem;">
                  <span style="color: var(--cyber-green); background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;">Verified Valid SSL</span>
                </div>
              </div>
            `;
          });

          subdomainsHtml = `
            <div class="inventory-subdomains-section" style="grid-column: span 2; margin-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.75rem;">
              <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--cyber-cyan); text-transform: uppercase; margin-bottom: 0.4rem; font-weight: 700; letter-spacing: 0.5px;">
                Nested Subdomains (${subdomainsForParent.length})
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                ${rowsHtml}
              </div>
            </div>
          `;
        }

        const extra = `
          <div class="inventory-details-block">
            <span class="inventory-details-label">Category</span>
            <span class="inventory-details-value">${domain.isSub ? 'Mapped Subdomain App' : 'Apex Domain'}</span>
          </div>
          <div class="inventory-details-block">
            <span class="inventory-details-label">SSL Certificate</span>
            <span class="inventory-details-value" style="color: var(--cyber-green);">Verified Valid</span>
          </div>
          ${subdomainsHtml}
        `;
        domainsList.appendChild(buildAccordionItem(domain.name, 'domain', extra));
      });
    }

    // Populate Instances
    instancesList.innerHTML = '';
    if (acceptedInstances.length === 0) {
      instancesList.innerHTML = '<div style="padding: 1.5rem; color: var(--text-muted); font-style: italic;">No accepted instances found.</div>';
    } else {
      acceptedInstances.forEach(inst => {
        const extra = `
          <div class="inventory-details-block">
            <span class="inventory-details-label">Environment</span>
            <span class="inventory-details-value">${inst.env}</span>
          </div>
          <div class="inventory-details-block">
            <span class="inventory-details-label">Instance Type</span>
            <span class="inventory-details-value">${inst.type}</span>
          </div>
          <div class="inventory-details-block" style="grid-column: span 2;">
            <span class="inventory-details-label">Active Components</span>
            <span class="inventory-details-value" style="font-size: 0.75rem; font-family: var(--font-mono);">${inst.components.map(c => c.name).join(', ')}</span>
          </div>
        `;
        
        const proj = projectsData.find(p => p.instances.includes(inst.name));
        let projectLabel = "None";
        let clientLabel = "None";
        if (proj) {
          projectLabel = proj.name;
          if (proj.clientId) {
            const cli = clientsData.find(c => c.id === proj.clientId);
            if (cli) {
              clientLabel = cli.name;
            }
          }
        }

        const item = document.createElement('div');
        item.className = 'inventory-item';
        item.innerHTML = `
          <div class="inventory-item-header">
            <div class="inventory-item-title-row">
              <div class="inventory-item-title">${inst.name}</div>
              <div class="inventory-item-mapping-summary">
                Project: <strong>${projectLabel}</strong> · Client: <strong>${clientLabel}</strong>
              </div>
            </div>
            <span style="font-size: 0.65rem; color: var(--text-muted); cursor: pointer; border: 1px solid rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;" class="accordion-toggle-btn">Expand Details ▾</span>
          </div>
          <div class="inventory-item-body">
            <div class="inventory-details-grid">
              <div class="inventory-details-block">
                <span class="inventory-details-label">Mapped Project</span>
                <span class="inventory-details-value" style="color: var(--cyber-cyan);">${projectLabel}</span>
              </div>
              <div class="inventory-details-block">
                <span class="inventory-details-label">Mapped Client</span>
                <span class="inventory-details-value" style="color: var(--cyber-blue);">${clientLabel}</span>
              </div>
              ${extra}
            </div>
          </div>
        `;

        const header = item.querySelector('.inventory-item-header');
        const toggleBtn = item.querySelector('.accordion-toggle-btn');
        header.addEventListener('click', () => {
          item.classList.toggle('expanded');
          const isExpanded = item.classList.contains('expanded');
          toggleBtn.textContent = isExpanded ? 'Collapse Details ▴' : 'Expand Details ▾';
        });

        instancesList.appendChild(item);
      });
    }
  }

  // ---------------------------------------------------------------
  // PULSE PAGE: Alerts Grid with Unread / Acknowledged / Resolved
  // ---------------------------------------------------------------
  let currentPulseTab = 'unread';

  function renderPulsePage() {
    const grid = document.getElementById('pulse-alerts-grid');
    if (!grid) return;

    // Update tab counts
    const unreadCount = alertsLog.filter(a => a.status === 'unread').length;
    const ackCount = alertsLog.filter(a => a.status === 'acknowledged').length;
    const resolvedCount = alertsLog.filter(a => a.status === 'resolved').length;
    
    const countUnread = document.getElementById('pulse-count-unread');
    const countAck = document.getElementById('pulse-count-acknowledged');
    const countResolved = document.getElementById('pulse-count-resolved');
    if (countUnread) countUnread.textContent = unreadCount;
    if (countAck) countAck.textContent = ackCount;
    if (countResolved) countResolved.textContent = resolvedCount;

    // Filter by active tab
    const filteredAlerts = alertsLog.filter(a => a.status === currentPulseTab);

    if (filteredAlerts.length === 0) {
      const emptyLabel = currentPulseTab === 'unread' ? 'No unread alerts.' : 
                         currentPulseTab === 'acknowledged' ? 'No acknowledged alerts.' : 'No resolved alerts.';
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-cyber); border-radius: 12px; padding: 3rem; text-align: center; color: var(--text-muted); font-family: var(--font-sans); backdrop-filter: blur(12px);">
          <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" fill="none" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.4; display: block;">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <p style="font-size: 0.88rem;">${emptyLabel} ${currentPulseTab === 'unread' ? 'All systems operational.' : ''}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    filteredAlerts.forEach(alert => {
      const card = document.createElement('div');
      card.className = 'alert-pallet-card';
      
      let statusClass = 'status-unread';
      let statusLabel = 'UNREAD';
      let borderAccent = '#ef4444';
      if (alert.status === 'acknowledged') {
        statusClass = 'status-acknowledged';
        statusLabel = 'ACKNOWLEDGED';
        borderAccent = '#f97316';
      } else if (alert.status === 'resolved') {
        statusClass = 'status-resolved';
        statusLabel = 'RESOLVED';
        borderAccent = '#10b981';
      }

      card.style.borderLeft = `3px solid ${borderAccent}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span class="alert-pallet-status-tag ${statusClass}">${statusLabel}</span>
            <span class="alert-pallet-status-tag severity-${alert.severity || 'critical'}">${(alert.severity || 'critical').toUpperCase()}</span>
          </div>
          <span style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">${alert.timeShort}</span>
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary); margin-bottom: 0.2rem;">${alert.serverName}</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">CPU exceeded ${alert.cpuValue}% threshold</div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.72rem;">
          <span style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono);">Ollama AI</span>
          <span style="color: var(--text-muted); font-family: var(--font-mono);">${alert.metric}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; color: var(--cyber-cyan); cursor: pointer; font-weight: 600;">View Details & Remediation →</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openDetailsSidebar(alert, true);
      });

      grid.appendChild(card);
    });
  }

  // Pulse tab switching
  document.querySelectorAll('.pulse-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pulse-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.color = 'var(--text-secondary)';
        b.style.background = 'none';
      });
      btn.classList.add('active');
      btn.style.color = 'var(--text-primary)';
      btn.style.background = 'rgba(0, 242, 254, 0.05)';
      currentPulseTab = btn.getAttribute('data-tab');
      renderPulsePage();
    });
  });

  // ---------------------------------------------------------------
  // PREMIUM DETAILS SIDEBAR DRAWER (Ollama AI Co-Pilot & Relations)
  // ---------------------------------------------------------------
  function openDetailsSidebar(data, isAlert) {
    const sidebar = document.getElementById('alert-detail-sidebar');
    if (!sidebar) return;

    let serverName = "";
    let cpuValue = 50;
    let status = "healthy";
    let statusLabel = "Healthy";
    let timestamp = new Date().toLocaleTimeString();
    let reason = "System running normally.";
    let remediations = [
      "No remediation required. System healthy."
    ];
    let alertStatus = "";
    let alertObj = null;

    if (isAlert) {
      alertObj = data;
      serverName = alertObj.serverName;
      cpuValue = alertObj.cpuValue;
      alertStatus = alertObj.status;
      
      if (alertObj.status === 'resolved') {
        status = 'healthy';
        statusLabel = 'Resolved';
        remediations = ["No remediation required. System resolved and running healthy."];
      } else {
        status = alertObj.severity || 'critical';
        statusLabel = status === 'critical' ? 'Critical' : 'Warning';
        
        if (status === 'warning') {
          remediations = [
            `Identify resource-consuming processes: SSH into <strong>${serverName}</strong> and inspect CPU load using <code>top -b -n 1 -o +%CPU | head -15</code>.`,
            `Analyze container statistics and system daemon resources using <code>systemctl status node-exporter</code> or <code>docker stats --no-stream</code>.`,
            `Verify traffic routing balance at the load balancer and check system socket limits in <code>/etc/security/limits.conf</code>.`
          ];
        } else {
          remediations = [
            `Terminate runaway processes immediately: SSH into <strong>${serverName}</strong> and run <code>kill -9 &lt;PID&gt;</code> to release resources.`,
            `Restart the offending application service node or container daemon: <code>systemctl restart docker.service</code>.`,
            `Examine system log files for out-of-memory (OOM) killer events: <code>journalctl -xe --since "5m ago"</code> or <code>dmesg | tail -30</code>.`,
            `Scale active application worker nodes in the cluster load balancer pool: <code>kubectl scale deployment/app-worker --replicas=5</code>.`
          ];
        }
      }
      timestamp = alertObj.timestamp;
      reason = alertObj.reason;
    } else {
      // It's a server node from State page
      const node = data;
      serverName = node.name;
      cpuValue = node.cpu;
      
      // If there is an active alert for this node, link to it!
      const activeAlert = alertsLog.find(a => a.serverName === serverName && a.status !== 'resolved');
      if (activeAlert) {
        alertObj = activeAlert;
        alertStatus = activeAlert.status;
        status = activeAlert.severity || 'critical';
        statusLabel = status === 'critical' ? 'Critical' : 'Warning';
        reason = activeAlert.reason;
        
        if (status === 'warning') {
          remediations = [
            `Identify resource-consuming processes: SSH into <strong>${serverName}</strong> and inspect CPU load using <code>top -b -n 1 -o +%CPU | head -15</code>.`,
            `Analyze container statistics and system daemon resources using <code>systemctl status node-exporter</code> or <code>docker stats --no-stream</code>.`,
            `Verify traffic routing balance at the load balancer and check system socket limits in <code>/etc/security/limits.conf</code>.`
          ];
        } else {
          remediations = [
            `Terminate runaway processes immediately: SSH into <strong>${serverName}</strong> and run <code>kill -9 &lt;PID&gt;</code> to release resources.`,
            `Restart the offending application service node or container daemon: <code>systemctl restart docker.service</code>.`,
            `Examine system log files for out-of-memory (OOM) killer events: <code>journalctl -xe --since "5m ago"</code> or <code>dmesg | tail -30</code>.`,
            `Scale active application worker nodes in the cluster load balancer pool: <code>kubectl scale deployment/app-worker --replicas=5</code>.`
          ];
        }
      } else {
        status = node.cpu >= 90 ? 'critical' : (node.cpu >= 80 ? 'warning' : 'healthy');
        statusLabel = node.cpu >= 90 ? 'Critical' : (node.cpu >= 80 ? 'Warning' : 'Healthy');
        reason = node.cpu >= 90 
          ? `CPU utilization on ${serverName} exceeded the 90% critical threshold.` 
          : (node.cpu >= 80 ? `CPU utilization on ${serverName} exceeded the 80% warning threshold.` : `CPU utilization on ${serverName} is running within normal limits.`);
        
        if (status === 'warning') {
          remediations = [
            `Identify resource-consuming processes: SSH into <strong>${serverName}</strong> and inspect CPU load using <code>top -b -n 1 -o +%CPU | head -15</code>.`,
            `Analyze container statistics and system daemon resources using <code>systemctl status node-exporter</code> or <code>docker stats --no-stream</code>.`,
            `Verify traffic routing balance at the load balancer and check system socket limits in <code>/etc/security/limits.conf</code>.`
          ];
        } else if (status === 'critical') {
          remediations = [
            `Terminate runaway processes immediately: SSH into <strong>${serverName}</strong> and run <code>kill -9 &lt;PID&gt;</code> to release resources.`,
            `Restart the offending application service node or container daemon: <code>systemctl restart docker.service</code>.`,
            `Examine system log files for out-of-memory (OOM) killer events: <code>journalctl -xe --since "5m ago"</code> or <code>dmesg | tail -30</code>.`,
            `Scale active application worker nodes in the cluster load balancer pool: <code>kubectl scale deployment/app-worker --replicas=5</code>.`
          ];
        } else {
          remediations = [
            `Monitor system resources and check logs via SSH if CPU load increases.`,
            `Ensure load balancer is distributing traffic evenly across all application boxes.`
          ];
        }
      }
    }

    // 1. Populate Header info
    document.getElementById('sidebar-node-title').textContent = serverName;
    document.getElementById('sidebar-node-subtitle').textContent = `Server · ${statusLabel}`;
    
    // Icon color class
    const iconContainer = document.getElementById('sidebar-icon-container');
    if (iconContainer) {
      iconContainer.className = `sidebar-header-icon ${status}`;
      // Update icon SVG stroke color based on status
      const strokeColor = status === 'critical' ? '#ef4444' : (status === 'warning' ? '#f97316' : '#10b981');
      iconContainer.querySelector('svg').setAttribute('stroke', strokeColor);
    }

    // 2. Populate Facts or Alert Metadata dynamically
    const factsTitle = document.getElementById('sidebar-facts-title');
    const factsGrid = document.getElementById('sidebar-facts-grid');

    if (status === 'critical' || status === 'warning') {
      // It's an alerting server - show alert metadata instead of irrelevant facts!
      if (factsTitle) factsTitle.textContent = "ALERT METADATA";
      if (factsGrid) {
        factsGrid.innerHTML = `
          <div class="fact-row">
            <span class="fact-label">Metric</span>
            <span class="fact-value" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyber-cyan);">${alertObj ? alertObj.metric : 'node_cpu_seconds_total'}</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">Threshold</span>
            <span class="fact-value" style="color: ${status === 'critical' ? '#ef4444' : '#f97316'}; font-weight: bold;">&gt; ${status === 'critical' ? '90%' : '80%'} CPU</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">Triggered</span>
            <span class="fact-value">${timestamp}</span>
          </div>
        `;
      }
    } else {
      // Healthy server - show regular facts
      if (factsTitle) factsTitle.textContent = "FACTS";
      
      // Tech lookup
      let tech = "Linux / Ubuntu";
      const nameLower = serverName.toLowerCase();
      if (nameLower.includes('mysql')) tech = "MySQL";
      else if (nameLower.includes('postgres') || nameLower.includes('db-3') || nameLower.includes('billing')) tech = "PostgreSQL";
      else if (nameLower.includes('redis') || nameLower.includes('cache')) tech = "Redis";
      else if (nameLower.includes('elastic') || nameLower.includes('search')) tech = "Elasticsearch";
      else if (nameLower.includes('k8s') || nameLower.includes('kube')) tech = "Kubernetes";
      else if (nameLower.includes('web') || nameLower.includes('nginx') || nameLower.includes('proxy')) tech = "Nginx";
      else if (nameLower.includes('jenkins') || nameLower.includes('ci')) tech = "Jenkins CI";
      else if (nameLower.includes('kafka')) tech = "Apache Kafka";

      // Role lookup
      let role = "Infrastructure Host";
      if (nameLower.includes('db') || nameLower.includes('replica') || nameLower.includes('mysql') || nameLower.includes('postgres') || nameLower.includes('redis') || nameLower.includes('cache')) {
        role = "Database Host";
      } else if (nameLower.includes('web') || nameLower.includes('api') || nameLower.includes('app') || nameLower.includes('service')) {
        role = "Application Host";
      } else if (nameLower.includes('bastion') || nameLower.includes('vpn') || nameLower.includes('ssh') || nameLower.includes('jump')) {
        role = "Security Bastion";
      } else if (nameLower.includes('prom') || nameLower.includes('monitor') || nameLower.includes('grafana')) {
        role = "Monitoring System";
      }

      // Exposure lookup
      let exposure = "internal";
      if (nameLower.includes('web') || nameLower.includes('gateway') || nameLower.includes('bastion') || nameLower.includes('vpn') || nameLower.includes('ingress') || nameLower.includes('lb') || nameLower.includes('portal')) {
        exposure = "public";
      }

      if (factsGrid) {
        factsGrid.innerHTML = `
          <div class="fact-row">
            <span class="fact-label">Tech</span>
            <span class="fact-value">${tech}</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">Role</span>
            <span class="fact-value">${role}</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">Exposure</span>
            <span class="fact-value">${exposure}</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">Status</span>
            <span class="fact-value" style="color: var(--cyber-green);">active</span>
          </div>
        `;
      }
    }

    // 3. Populate Health section
    const healthDot = document.getElementById('sidebar-health-dot');
    if (healthDot) {
      healthDot.className = `health-status-dot ${status}`;
    }
    const healthStatusText = document.getElementById('sidebar-health-status');
    if (healthStatusText) {
      healthStatusText.textContent = statusLabel;
      healthStatusText.className = `health-status-text color-${status === 'critical' ? 'red' : (status === 'warning' ? 'orange' : 'green')}`;
    }
    
    const healthWhy = document.getElementById('sidebar-health-why');
    if (healthWhy) {
      // Display the detailed description (reason) of the alert Report!
      healthWhy.innerHTML = reason;
      healthWhy.style.lineHeight = "1.5";
      healthWhy.style.color = "var(--text-primary)";
    }

    // 4. Populate Relations (Committed onboarding data!)
    const relationTitle = document.getElementById('sidebar-relation-title');
    const relationList = document.getElementById('sidebar-relation-list');
    if (relationList) {
      relationList.innerHTML = '';
      
      // Look up instances matching this server name prefix
      const cleanPrefix = serverName.toLowerCase().replace(/_new$/, '').split(/[_-]/)[0];
      const relatedInstances = instancesData.filter(inst => {
        // Match accepted instances, or any instance if no accepted ones exist
        const nameMatch = inst.name.toLowerCase().includes(cleanPrefix);
        const hostMatch = inst.host.toLowerCase().includes(cleanPrefix);
        const tagMatch = inst.tags.some(t => t.toLowerCase().includes(cleanPrefix));
        return nameMatch || hostMatch || tagMatch;
      });

      if (relationTitle) {
        relationTitle.textContent = `SERVER RELATION (${relatedInstances.length})`;
      }

      if (relatedInstances.length === 0) {
        relationList.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">
            No mapped instances found. Setup discovery mapping in Steps 3-5 first.
          </div>
        `;
      } else {
        relatedInstances.forEach(inst => {
          // Find project
          const proj = projectsData.find(p => p.instances.includes(inst.name));
          let projectLabel = "None";
          let clientLabel = "None";
          
          if (proj) {
            projectLabel = proj.name;
            if (proj.clientId) {
              const clientObj = clientsData.find(c => c.id === proj.clientId);
              if (clientObj) {
                clientLabel = clientObj.name;
              }
            }
          }

          const item = document.createElement('div');
          item.className = 'relation-item';
          item.innerHTML = `
            <span class="relation-status-dot ${status}"></span>
            <svg class="relation-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="flex-shrink:0;">
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" />
            </svg>
            <div>
              <div style="font-weight:700;">${inst.name}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.15rem;">
                Project: <strong style="color:var(--cyber-cyan);">${projectLabel}</strong> · Client: <strong style="color:var(--cyber-blue);">${clientLabel}</strong>
              </div>
            </div>
          `;
          relationList.appendChild(item);
        });
      }
    }

    // 5. Populate Remediation Steps
    const stepsList = document.getElementById('sidebar-remediation-steps');
    if (stepsList) {
      stepsList.innerHTML = '';
      remediations.forEach((step) => {
        const li = document.createElement('li');
        li.innerHTML = step;
        li.style.color = 'var(--text-primary)';
        li.style.lineHeight = '1.6';
        li.style.fontSize = '0.82rem';
        stepsList.appendChild(li);
      });
    }

    // 6. Action buttons
    const footerButtons = document.getElementById('sidebar-footer-buttons');
    if (footerButtons) {
      footerButtons.innerHTML = '';
      
      if (alertStatus === 'unread') {
        footerButtons.innerHTML = `
          <button class="secondary-btn" style="padding: 0.5rem 1.2rem;" id="sidebar-ack-btn">Acknowledge</button>
          <button class="primary-btn" style="padding: 0.5rem 1.2rem;" id="sidebar-resolve-btn">Resolve</button>
        `;
      } else if (alertStatus === 'acknowledged') {
        footerButtons.innerHTML = `
          <button class="primary-btn" style="padding: 0.5rem 1.2rem;" id="sidebar-resolve-btn">Resolve Alert</button>
        `;
      } else if (alertStatus === 'resolved') {
        footerButtons.innerHTML = `
          <span style="font-size: 0.8rem; color: #10b981; font-weight: bold; display: flex; align-items: center; gap: 0.3rem;">
            <span class="relation-status-dot healthy"></span> Alert resolved
          </span>
        `;
      } else {
        footerButtons.innerHTML = `
          <button class="secondary-btn" style="padding: 0.5rem 1.2rem;" id="sidebar-close-footer-btn">Close</button>
        `;
      }

      // Action listener wire-ups
      const ackBtn = footerButtons.querySelector('#sidebar-ack-btn');
      if (ackBtn && alertObj) {
        ackBtn.addEventListener('click', () => {
          alertObj.status = 'acknowledged';
          sidebar.classList.remove('active');
          setTimeout(() => {
            sidebar.style.display = 'none';
          }, 300);
          showToast(`Alert on ${alertObj.serverName} acknowledged.`, true);
          renderPulsePage();
        });
      }

      const resolveBtn = footerButtons.querySelector('#sidebar-resolve-btn');
      if (resolveBtn && alertObj) {
        resolveBtn.addEventListener('click', () => {
          alertObj.status = 'resolved';
          sidebar.classList.remove('active');
          setTimeout(() => {
            sidebar.style.display = 'none';
          }, 300);
          showToast(`Alert on ${alertObj.serverName} resolved.`, true);
          renderPulsePage();
        });
      }

      const closeFooterBtn = footerButtons.querySelector('#sidebar-close-footer-btn');
      if (closeFooterBtn) {
        closeFooterBtn.addEventListener('click', () => {
          sidebar.classList.remove('active');
          setTimeout(() => {
            sidebar.style.display = 'none';
          }, 300);
        });
      }
    }

    // Show sidebar!
    sidebar.style.display = 'flex';
    setTimeout(() => {
      sidebar.classList.add('active');
    }, 10);
  }

  // Sidebar close button event listener
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('alert-detail-sidebar');
      if (sidebar) {
        sidebar.classList.remove('active');
        setTimeout(() => {
          sidebar.style.display = 'none';
        }, 300);
      }
    });
  }

  // Hide sidebar on click outside overlay
  const sidebarOverlay = document.getElementById('alert-detail-sidebar');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', (e) => {
      if (e.target === sidebarOverlay) {
        sidebarOverlay.classList.remove('active');
        setTimeout(() => {
          sidebarOverlay.style.display = 'none';
        }, 300);
      }
    });
  }

  // ---------------------------------------------------------------
  // SETTINGS MODAL: Tab switching + close handlers
  // ---------------------------------------------------------------
  const settingsModal = document.getElementById('app-settings-modal');

  // Settings tab switching
  if (settingsModal) {
    settingsModal.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        settingsModal.querySelectorAll('.settings-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.borderBottomColor = 'transparent';
          b.style.color = 'var(--text-secondary)';
        });
        btn.classList.add('active');
        btn.style.borderBottomColor = '';
        btn.style.color = '';
        
        settingsModal.querySelectorAll('.settings-tab-content').forEach(panel => {
          panel.classList.add('hidden');
        });
        const targetPanel = settingsModal.querySelector(`#settings-tab-${btn.getAttribute('data-tab')}`);
        if (targetPanel) targetPanel.classList.remove('hidden');
      });
    });
  }

  // Settings close buttons
  const settingsCloseBtn = document.getElementById('settings-close-btn');
  const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
  const settingsSaveBtn = document.getElementById('settings-save-btn');
  
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.remove('active');
    });
  }
  if (settingsModalCloseBtn) {
    settingsModalCloseBtn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.remove('active');
    });
  }
  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.remove('active');
      showToast("Settings saved successfully.", true);
    });
  }

  // Generate SVG Sparkline coordinates
  function getSparklinePaths(history) {
    const width = 200;
    const height = 50;
    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - (val / 100) * height;
      return `${x},${y}`;
    });
    return {
      path: `M ${points.join(' L ')}`,
      area: `M ${points.join(' L ')} L ${width},${height} L 0,${height} Z`
    };
  }

  // Update Estate Health section summary cards dynamically
  function updateEstateHealthStats() {
    const valTargets = document.getElementById('health-val-targets');
    const subTargets = document.getElementById('health-sub-targets');
    const valApps = document.getElementById('health-val-apps');
    const valDatabases = document.getElementById('health-val-databases');
    const valProbes = document.getElementById('health-val-probes');
    const subProbes = document.getElementById('health-sub-probes');
    const valCerts = document.getElementById('health-val-certs');
    const subCerts = document.getElementById('health-sub-certs');
    const valBackups = document.getElementById('health-val-backups');
    const subBackups = document.getElementById('health-sub-backups');
    const labelBackups = document.getElementById('health-label-backups');
    const valAlerts = document.getElementById('health-val-alerts');
    const subAlerts = document.getElementById('health-sub-alerts');
    const valGpus = document.getElementById('health-val-gpus');

    if (!valTargets) return;

    // Get count of confirmed items from Step 2 lists
    const confirmedServers = Array.from(document.querySelectorAll('#panel-servers .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).length;

    const confirmedDomains = Array.from(document.querySelectorAll('#panel-domains .infra-row.domain-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).length;

    const confirmedDatabases = Array.from(document.querySelectorAll('#panel-databases .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).length;

    const confirmedSubdomains = Array.from(document.querySelectorAll('#panel-domains .infra-row.sub-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).length;

    // Active critical alerts
    const unreadAlerts = alertsLog.filter(a => a.status === 'unread').length;
    const activeAlerts = alertsLog.filter(a => a.status !== 'resolved').length;

    // 1. Targets Up
    const targetsUp = confirmedServers - unreadAlerts;
    valTargets.textContent = `${targetsUp}/${confirmedServers}`;
    if (unreadAlerts > 0) {
      valTargets.className = "health-summary-value color-red";
      subTargets.textContent = `${unreadAlerts} target${unreadAlerts === 1 ? '' : 's'} failing`;
    } else {
      valTargets.className = "health-summary-value color-green";
      subTargets.textContent = "all reporting";
    }

    // 2. Apps Monitored
    valApps.textContent = confirmedSubdomains;
    valApps.className = "health-summary-value color-green";

    // 3. Databases
    valDatabases.textContent = confirmedDatabases;
    valDatabases.className = "health-summary-value color-green";

    // 4. Synthetic Probes
    const failingProbes = activeAlerts > 0 ? 1 : 0;
    valProbes.textContent = `${confirmedDomains - failingProbes}/${confirmedDomains}`;
    if (failingProbes > 0) {
      valProbes.className = "health-summary-value color-orange";
      subProbes.textContent = `${failingProbes} probe${failingProbes === 1 ? '' : 's'} failing`;
    } else {
      valProbes.className = "health-summary-value color-green";
      subProbes.textContent = "0 failing";
    }

    // 5. Certs < 60d
    const certsCount = activeAlerts > 0 ? 1 : 0;
    valCerts.textContent = certsCount;
    if (certsCount > 0) {
      valCerts.className = "health-summary-value color-orange";
      subCerts.textContent = "soonest 8d";
    } else {
      valCerts.className = "health-summary-value color-green";
      subCerts.textContent = "all valid > 90d";
    }

    // 6. Backups
    let providerName = "LINODE-API";
    const hasAws = addedSources.some(s => s.provider === 'aws');
    const hasGcp = addedSources.some(s => s.provider === 'gcp');
    const hasAzure = addedSources.some(s => s.provider === 'azure');
    if (hasAws) providerName = "AWS-API";
    else if (hasGcp) providerName = "GCP-API";
    else if (hasAzure) providerName = "AZURE-API";
    
    if (labelBackups) labelBackups.textContent = providerName;

    const backupTotal = confirmedServers;
    const backupHealthy = backupTotal - (activeAlerts > 0 ? 1 : 0);
    valBackups.textContent = `${backupHealthy}/${backupTotal}`;
    if (backupHealthy < backupTotal) {
      valBackups.className = "health-summary-value color-orange";
      subBackups.textContent = `${backupTotal - backupHealthy} backups delayed`;
    } else {
      valBackups.className = "health-summary-value color-green";
      subBackups.textContent = "0 backups delayed";
    }

    // 7. Alert Rules
    valAlerts.textContent = unreadAlerts;
    if (unreadAlerts > 0) {
      valAlerts.className = "health-summary-value color-red";
      subAlerts.textContent = `${unreadAlerts} critical alert${unreadAlerts === 1 ? '' : 's'} active`;
    } else if (activeAlerts > 0) {
      valAlerts.className = "health-summary-value color-orange";
      subAlerts.textContent = `${activeAlerts} ack'd alert${activeAlerts === 1 ? '' : 's'} active`;
    } else {
      valAlerts.className = "health-summary-value color-green";
      subAlerts.textContent = "nothing paging";
    }

    // 8. GPUs
    if (valGpus) {
      valGpus.textContent = "0";
      valGpus.className = "health-summary-value";
    }
  }

  // Initialize resize logic for all resizable panels
  function initResizablePanels() {
    let activePanel = null;
    let startWidth = 0;
    let startHeight = 0;
    let startX = 0;
    let startY = 0;

    document.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('resize-handle')) {
        e.preventDefault();
        e.stopPropagation();
        activePanel = e.target.closest('.resizable-panel');
        if (!activePanel) return;

        const rect = activePanel.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        activePanel.classList.add('resizing');
      }
    });

    function handleMouseMove(e) {
      if (!activePanel) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth + deltaX;
      let newHeight = startHeight + deltaY;

      // Min constraints
      if (newWidth < 300) newWidth = 300;
      if (newHeight < 200) newHeight = 200;

      // Max constraints (prevent expanding beyond page width)
      const containerWidth = activePanel.parentElement.getBoundingClientRect().width;
      if (newWidth > containerWidth) newWidth = containerWidth;

      activePanel.style.width = `${newWidth}px`;
      activePanel.style.height = `${newHeight}px`;
      activePanel.style.flex = 'none'; // prevent flex layout from overwriting width
    }

    function handleMouseUp() {
      if (activePanel) {
        activePanel.classList.remove('resizing');
        activePanel = null;
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }

  // Update global Grafana memory and swap charts dynamically
  function updateGlobalCharts() {
    const memorySvg = document.getElementById('memory-distribution-svg');
    if (!memorySvg) return;

    // 1. Generate next memory data points
    const availVal = (6.0 + Math.random() * 0.3).toFixed(2);
    const freeVal = (1.1 + Math.random() * 0.2).toFixed(2);
    const cachedVal = (4.0 + Math.random() * 0.3).toFixed(2);
    const buffVal = (0.8 + Math.random() * 0.1).toFixed(2);

    memoryHistory.available.push(parseFloat(availVal));
    memoryHistory.available.shift();
    memoryHistory.free.push(parseFloat(freeVal));
    memoryHistory.free.shift();
    memoryHistory.cached.push(parseFloat(cachedVal));
    memoryHistory.cached.shift();
    memoryHistory.buffered.push(parseFloat(buffVal));
    memoryHistory.buffered.shift();

    // Redraw Memory line paths
    const width = 400;
    const height = 150;
    const maxVal = 8.00;

    const getSvgPath = (historyArray) => {
      const points = historyArray.map((val, idx) => {
        const x = (idx / (historyArray.length - 1)) * width;
        const y = height - (val / maxVal) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return `M ${points.join(' L ')}`;
    };

    const pathAvail = document.getElementById('path-mem-available');
    const pathFree = document.getElementById('path-mem-free');
    const pathCached = document.getElementById('path-mem-cached');
    const pathBuff = document.getElementById('path-mem-buffered');

    if (pathAvail) pathAvail.setAttribute('d', getSvgPath(memoryHistory.available));
    if (pathFree) pathFree.setAttribute('d', getSvgPath(memoryHistory.free));
    if (pathCached) pathCached.setAttribute('d', getSvgPath(memoryHistory.cached));
    if (pathBuff) pathBuff.setAttribute('d', getSvgPath(memoryHistory.buffered));

    // 2. Update Swap usage bar chart
    const swapFree = (3.0 + Math.random() * 0.3).toFixed(2);
    const swapTotal = 4.00;
    const swapUsed = (swapTotal - parseFloat(swapFree)).toFixed(2);

    const valTotal = document.getElementById('swap-val-total');
    const valUsed = document.getElementById('swap-val-used');
    const valFree = document.getElementById('swap-val-free');
    const barUsed = document.getElementById('swap-bar-used');
    const barFree = document.getElementById('swap-bar-free');

    if (valTotal) valTotal.textContent = `${swapTotal.toFixed(2)} GB`;
    if (valUsed) valUsed.textContent = `${swapUsed} GB`;
    if (valFree) valFree.textContent = `${swapFree} GB`;

    if (barUsed) barUsed.style.width = `${(swapUsed / swapTotal * 100).toFixed(0)}%`;
    if (barFree) barFree.style.width = `${(swapFree / swapTotal * 100).toFixed(0)}%`;
  }

  // Render State telemetry dashboard
  function renderStatePage() {
    const grid = document.getElementById('grafana-dashboard-grid');
    const nodesSummary = document.getElementById('state-summary-nodes');
    const alertsSummary = document.getElementById('state-summary-alerts');
    if (!grid) return;

    // Get all confirmed server rows from Step 2
    const confirmedRows = Array.from(document.querySelectorAll('#panel-servers .infra-row')).filter(row => {
      const badge = row.querySelector('.status-pill');
      return badge && badge.textContent.trim().toLowerCase() === 'confirmed';
    });

    const confirmedCount = confirmedRows.length;
    
    if (nodesSummary) {
      nodesSummary.textContent = `${confirmedCount} Monitored Node${confirmedCount === 1 ? '' : 's'}`;
    }

    updateEstateHealthStats();
    updateGlobalCharts();

    if (confirmedCount === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-cyber); border-radius: 12px; padding: 3rem; text-align: center; color: var(--text-muted); font-family: var(--font-sans); backdrop-filter: blur(12px);">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.5; color: var(--cyber-blue);">
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" stroke-width="3" stroke-linecap="round" />
            <line x1="6" y1="18" x2="6.01" y2="18" stroke-width="3" stroke-linecap="round" />
          </svg>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 700;">Prometheus Monitoring Empty</h3>
          <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto;">No confirmed servers have been committed. Please complete the Discovery onboarding process, confirm servers in Step 2, and commit in Step 6 to initialize the telemetry loop.</p>
        </div>
      `;
      if (telemetryIntervalId) {
        clearInterval(telemetryIntervalId);
        telemetryIntervalId = null;
      }
      return;
    }

    // Populate telemetryData array if not initialized or length changed
    if (telemetryData.length === 0 || telemetryData.length !== confirmedCount) {
      telemetryData = confirmedRows.map((row, index) => {
        const name = row.querySelector('.row-name').textContent.trim();
        // Spiking server config
        const isSpikeCandidate = index === 0; // Spike the first confirmed server
        return {
          id: row.getAttribute('data-id') || `srv-${index}`,
          name: name,
          cpu: isSpikeCandidate ? 70 : Math.floor(Math.random() * 30) + 40,
          memoryActive: (Math.random() * 2 + 3).toFixed(2),
          memoryTotal: 8.00,
          networkIn: (Math.random() * 2 + 0.5).toFixed(1),
          networkOut: (Math.random() * 1 + 0.2).toFixed(1),
          diskRead: (Math.random() * 8 + 2).toFixed(0),
          diskWrite: (Math.random() * 4 + 1).toFixed(0),
          cpuHistory: Array.from({length: 12}, () => Math.floor(Math.random() * 20) + 40),
          spike: isSpikeCandidate
        };
      });
    }

    // Render Grid Panels
    grid.innerHTML = "";
    telemetryData.forEach(node => {
      const panel = document.createElement('div');
      panel.className = `grafana-panel node-${node.id} resizable-panel`;
      panel.style.width = 'calc(50% - 0.75rem)';
      panel.style.minWidth = '360px';
      panel.style.height = '320px';
      panel.setAttribute('data-node-id', node.id);
      
      // Determine colors based on CPU state
      let colorClass = "color-green";
      let bgClass = "bg-green";
      if (node.cpu >= 90) {
        colorClass = "color-red";
        bgClass = "bg-red";
        panel.classList.add('alert-active');
      } else if (node.cpu >= 80) {
        colorClass = "color-orange";
        bgClass = "bg-orange";
      }

      const paths = getSparklinePaths(node.cpuHistory);
      const ringOffset = 170 - (node.cpu / 100) * 170;

      panel.innerHTML = `
        <div class="panel-header-row">
          <div>
            <div class="panel-title-text">${node.name}</div>
            <div class="panel-host-text">Prometheus Node: node_cpu_seconds_total</div>
          </div>
          <span style="font-size: 0.65rem; padding: 0.25rem 0.5rem; border-radius: 4px; background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.1); color: var(--cyber-cyan); font-family: var(--font-mono);">
            Grafana Dashboard
          </span>
        </div>

        <div class="cpu-gauge-container">
          <div class="cpu-gauge-ring">
            <svg>
              <circle class="cpu-gauge-bg" cx="30" cy="30" r="27"></circle>
              <circle class="cpu-gauge-fill ${colorClass}" cx="30" cy="30" r="27" style="stroke-dashoffset: ${ringOffset};"></circle>
            </svg>
            <div class="cpu-gauge-text ${colorClass}">${node.cpu}%</div>
          </div>

          <div class="sparkline-container" style="position: relative;">
            <div style="position: absolute; top: -14px; left: 0; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">CPU History (2s ticks)</div>
            <svg viewBox="0 0 200 50" style="width: 100%; height: 100%;">
              <path class="sparkline-area ${colorClass}" d="${paths.area}"></path>
              <path class="sparkline-path ${colorClass}" d="${paths.path}"></path>
            </svg>
          </div>
        </div>

        <div class="telemetry-row" style="margin-bottom: auto;">
          <div class="telemetry-metric">
            <span class="telemetry-label">node_memory_Active_bytes</span>
            <span class="telemetry-value" style="font-family: var(--font-mono);">${node.memoryActive} GB / ${node.memoryTotal} GB</span>
          </div>
          <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 0.25rem;">
            <div style="width: ${(node.memoryActive / node.memoryTotal * 100)}%; height: 100%; background: var(--cyber-cyan);" class="memory-progress-fill"></div>
          </div>
          <div class="telemetry-metric">
            <span class="telemetry-label">node_network_receive_bytes_total</span>
            <span class="telemetry-value" style="font-family: var(--font-mono); font-size: 0.78rem;">In: ${node.networkIn} MB/s · Out: ${node.networkOut} MB/s</span>
          </div>
          <div class="telemetry-metric">
            <span class="telemetry-label">node_disk_read_bytes_total</span>
            <span class="telemetry-value" style="font-family: var(--font-mono); font-size: 0.78rem;">R: ${node.diskRead} MB/s · W: ${node.diskWrite} MB/s</span>
          </div>
        </div>
        <div class="resize-handle"></div>
      `;

      grid.appendChild(panel);

      // Bind click on "Grafana Dashboard" button or card title to open Details Sidebar
      const detailsTrigger = panel.querySelector('.panel-header-row span');
      if (detailsTrigger) {
        detailsTrigger.style.cursor = 'pointer';
        detailsTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          openDetailsSidebar(node, false);
        });
      }
      const titleTrigger = panel.querySelector('.panel-title-text');
      if (titleTrigger) {
        titleTrigger.style.cursor = 'pointer';
        titleTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          openDetailsSidebar(node, false);
        });
      }
    });

    // Initialize telemetry interval update loop
    if (!telemetryIntervalId) {
      telemetryIntervalId = setInterval(() => {
        telemetryData.forEach(node => {
          // Adjust CPU
          if (node.spike) {
            // Steady CPU increase
            if (node.cpu < 93) {
              node.cpu += Math.floor(Math.random() * 3) + 3;
            } else {
              node.cpu += Math.floor(Math.random() * 5) - 2;
              if (node.cpu > 98) node.cpu = 98;
              if (node.cpu < 90) node.cpu = 90;
            }

            // Warning threshold (80%)
            if (node.cpu >= 80 && !alertedLevel1.has(node.name)) {
              alertedLevel1.add(node.name);
              playAlertSound();
              addAlertNotification(node.name, node.cpu, 'warning');
              showToast(`[WARNING] CPU Usage elevated on ${node.name}: ${node.cpu}%`, false);
            }

            // Critical threshold (90%)
            if (node.cpu >= 90 && !alertedLevel2.has(node.name)) {
              alertedLevel2.add(node.name);
              playAlertSound();
              addAlertNotification(node.name, node.cpu, 'critical');
              showToast(`[ALERT] CPU Usage critical on ${node.name}: ${node.cpu}%`, false);
              if (alertsSummary) {
                alertsSummary.innerHTML = '<span class="color-red" style="font-weight:bold; animation: pulseGreen 1.5s infinite;">⚠️ 1 CRITICAL ALERT</span>';
              }
            }
          } else {
            // Other servers fluctuate normally
            node.cpu += Math.floor(Math.random() * 5) - 2;
            if (node.cpu > 78) node.cpu = 78;
            if (node.cpu < 25) node.cpu = 25;
          }

          // Push new CPU value to history and shift oldest
          node.cpuHistory.push(node.cpu);
          node.cpuHistory.shift();

          // Fluctuate memory and network slightly
          node.memoryActive = (parseFloat(node.memoryActive) + (Math.random() * 0.1 - 0.05)).toFixed(2);
          if (node.memoryActive > 7.5) node.memoryActive = 7.5;
          if (node.memoryActive < 2.0) node.memoryActive = 2.0;

          node.networkIn = (parseFloat(node.networkIn) + (Math.random() * 0.4 - 0.2)).toFixed(1);
          if (node.networkIn < 0.1) node.networkIn = 0.1;
          node.networkOut = (parseFloat(node.networkOut) + (Math.random() * 0.2 - 0.1)).toFixed(1);
          if (node.networkOut < 0.1) node.networkOut = 0.1;

          // Update DOM elements for this node
          const card = document.querySelector(`.grafana-panel.node-${node.id}`);
          if (card) {
            // Determine color classes
            let colorClass = "color-green";
            let bgClass = "bg-green";
            if (node.cpu >= 90) {
              colorClass = "color-red";
              bgClass = "bg-red";
              card.classList.add('alert-active');
            } else {
              card.classList.remove('alert-active');
              if (node.cpu >= 80) {
                colorClass = "color-orange";
                bgClass = "bg-orange";
              }
            }

            // Update CPU Gauge text
            const gaugeText = card.querySelector('.cpu-gauge-text');
            if (gaugeText) {
              gaugeText.className = `cpu-gauge-text ${colorClass}`;
              gaugeText.textContent = `${node.cpu}%`;
            }

            // Update SVG Ring fill
            const fillCircle = card.querySelector('.cpu-gauge-fill');
            if (fillCircle) {
              fillCircle.className = `cpu-gauge-fill ${colorClass}`;
              const ringOffset = 170 - (node.cpu / 100) * 170;
              fillCircle.style.strokeDashoffset = ringOffset;
            }

            // Update Sparkline paths
            const sparklineArea = card.querySelector('.sparkline-area');
            const sparklinePath = card.querySelector('.sparkline-path');
            if (sparklineArea && sparklinePath) {
              const paths = getSparklinePaths(node.cpuHistory);
              sparklineArea.className = `sparkline-area ${colorClass}`;
              sparklineArea.setAttribute('d', paths.area);
              sparklinePath.className = `sparkline-path ${colorClass}`;
              sparklinePath.setAttribute('d', paths.path);
            }

            // Update Memory active text & bar
            const values = card.querySelectorAll('.telemetry-value');
            if (values && values.length >= 3) {
              values[0].textContent = `${node.memoryActive} GB / ${node.memoryTotal} GB`;
              values[1].textContent = `In: ${node.networkIn} MB/s · Out: ${node.networkOut} MB/s`;
              values[2].textContent = `R: ${node.diskRead} MB/s · W: ${node.diskWrite} MB/s`;
            }

            const bar = card.querySelector('.memory-progress-fill');
            if (bar) {
              bar.style.width = `${(node.memoryActive / node.memoryTotal * 100)}%`;
            }
          }
        });
        updateEstateHealthStats();
        updateGlobalCharts();
      }, 2000);
    }
  }

  // Initial step setup
  updateStepUI();
  initResizablePanels();


  // -------------------------------------------------------------
  // SOC DASHBOARD SYSTEM
  // -------------------------------------------------------------
  let socInitialized = false;
  let securityInitialized = false;
  let activeSocTab = "overview";
  let activeAgentFilter = "all";
  let agentsSearchQuery = "";
  let currentGuideStepIndex = 2; // Index in array, corresponding to "3/15"

  // Guide Steps data model
  const guideSteps = [
    { title: "Command Center Hub", desc: "XSIAM Command Center maps raw sources like firewalls, databases, and authentication servers to a central security graph.", page: "1/15" },
    { title: "Ingestion Pipelines", desc: "View the real-time event flow of events per second flowing into the telemetry graphs.", page: "2/15" },
    { title: "Your Security Mission Control", desc: "From there, pivot to the XSIAM Command Center, your mission control for security operations.", page: "3/15" },
    { title: "Endpoint Integrity Check", desc: "Deploy lightweight, low-overhead endpoint telemetry sensors across remote windows, mac, and linux fleets.", page: "4/15" },
    { title: "Geographic Threat Mapping", desc: "Visual beacons represent network ingress origins and target machines indicating active brute-force or injection signals.", page: "5/15" },
    { title: "Automated Incident Responses", desc: "Leverage automated playbooks to quarantine instances, terminate rogue shell processes, and close sockets instantly.", page: "6/15" }
  ];

  // Endpoint Agents mock data model (6 Items)
  const agentsData = [
    { name: "win-prod-db-01", ip: "10.100.4.12", os: "windows", status: "active", cpu: 12, ram: 45, lastSeen: "Just now" },
    { name: "linux-api-node-03", ip: "10.100.4.15", os: "linux", status: "alert", cpu: 89, ram: 92, lastSeen: "2s ago" },
    { name: "mac-dev-laptop-77", ip: "192.168.1.104", os: "macos", status: "active", cpu: 4, ram: 31, lastSeen: "1m ago" },
    { name: "win-corp-dc-02", ip: "10.100.2.10", os: "windows", status: "active", cpu: 28, ram: 68, lastSeen: "12s ago" },
    { name: "linux-bastion-ssh", ip: "10.100.1.5", os: "linux", status: "active", cpu: 1, ram: 18, lastSeen: "5s ago" },
    { name: "linux-backup-srv", ip: "10.100.8.22", os: "linux", status: "offline", cpu: 0, ram: 0, lastSeen: "2h ago" }
  ];

  // Recent Event Logs mock data model
  let eventsLogData = [
    { time: "16:42:15", type: "Brute Force Attack", host: "linux-bastion-ssh", desc: "Multiple SSH login attempts from 45.89.22.103", severity: "c", status: "blocked" },
    { time: "16:38:02", type: "Process Hijack", host: "linux-api-node-03", desc: "Rogue process execution detected: curl | sh", severity: "h", status: "alerting" },
    { time: "16:11:44", type: "Malware Detected", host: "win-prod-db-01", desc: "Detected signature: Win32.Mimikatz.Gen", severity: "c", status: "isolated" },
    { time: "15:44:10", type: "Privilege Escalation", host: "win-corp-dc-02", desc: "Execution of cmd.exe as Local System", severity: "m", status: "resolved" }
  ];

  let settingsAuditLogs = JSON.parse(localStorage.getItem('uplink_settings_audit_logs')) || [];
  let wazuhReports = JSON.parse(localStorage.getItem('uplink_wazuh_reports')) || [
    { name: "PCI-DSS_Compliance_Report_July_2026.pdf", date: "7/18/2026", size: "1.4 MB", type: "PCI-DSS" },
    { name: "FIM_Verification_Audit_July_2026.pdf", date: "7/17/2026", size: "820 KB", type: "FIM" },
    { name: "Vulnerability_Summary_Audit_June_2026.pdf", date: "6/30/2026", size: "2.1 MB", type: "Vulnerability" }
  ];

  function updateSocSourcesCard() {
    const card = document.getElementById('soc-ingested-sources-card');
    if (!card) return;

    const endpointCount = agentsData.length;
    const totalSources = endpointCount + addedSources.length;

    let html = `
      <div class="source-row" style="font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; ${addedSources.length > 0 ? 'margin-bottom: 0.25rem;' : ''}">
        <span class="source-bullet" style="background-color: var(--cyber-green); box-shadow: 0 0 8px var(--cyber-green); width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
        <span>${endpointCount} Active Wazuh Endpoints</span>
      </div>
    `;

    if (addedSources.length === 0) {
      html += `
        <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; margin: 0; font-weight: 500;">
          No additional cloud sources. Connect in Discovery.
        </p>
      `;
    } else {
      const providerConfig = {
        aws: { label: 'Amazon Web Services', color: '#f59e0b' },
        azure: { label: 'Azure', color: '#0ea5e9' },
        gcp: { label: 'Google Cloud', color: '#3b82f6' },
        oracle: { label: 'Oracle Cloud', color: '#ef4444' },
        ssh: { label: 'SSH Server', color: '#fb923c' },
        db: { label: 'Database Endpoint', color: '#8b5cf6' }
      };

      addedSources.forEach(source => {
        const config = providerConfig[source.provider] || { label: source.name, color: 'var(--cyber-cyan)' };
        const displayName = source.name || config.label;
        const color = config.color;

        html += `
          <div class="source-row" style="font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
            <span class="source-bullet" style="background-color: ${color}; box-shadow: 0 0 8px ${color}; width: 7px; height: 7px; border-radius: 50%; display: inline-block;"></span>
            <span style="color: var(--text-primary);">${displayName}</span>
          </div>
        `;
      });
    }

    card.innerHTML = html;

    // Update radar source count to match total sources
    const radarCount = document.getElementById('radar-source-count');
    if (radarCount) radarCount.textContent = totalSources;
  }

  // Dynamically update all SOC Overview metrics from real securityAlerts data
  function updateSocMetrics() {
    const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;

    const openAlerts = alerts.filter(a => a.status === 'open');
    const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');
    const totalAlerts = alerts.length;
    const openCount = openAlerts.length;

    // Severity breakdown for open alerts
    const critCount = openAlerts.filter(a => a.severity === 'p0').length;
    const highCount = openAlerts.filter(a => a.severity === 'p1').length;
    const medCount = openAlerts.filter(a => a.severity === 'p2').length;
    const lowCount = openAlerts.filter(a => a.severity === 'p3').length;

    // Resolved = acknowledged alerts, Automated ~70% of resolved, Manual ~30%
    const resolvedCount = acknowledgedAlerts.length;
    const baseAutomated = 70;
    const baseManual = 20;
    const baseResolved = 90;
    const automatedCount = baseAutomated + Math.floor(resolvedCount * 0.7);
    const manualCount = baseManual + Math.ceil(resolvedCount * 0.3);
    const totalResolved = baseResolved + resolvedCount;

    // Radar right value = total processed (automated + manual + open)
    const radarOutput = automatedCount + manualCount + openCount;

    // Update right-side flow nodes
    const el = (id) => document.getElementById(id);

    const automatedEl = el('soc-automated-count');
    const resolvedEl = el('soc-resolved-count');
    const manualEl = el('soc-manual-count');
    const openCasesEl = el('soc-open-cases-count');
    const radarOutputEl = el('radar-output-count');

    if (automatedEl) automatedEl.textContent = automatedCount;
    if (resolvedEl) resolvedEl.textContent = totalResolved;
    if (manualEl) manualEl.textContent = manualCount;
    if (openCasesEl) openCasesEl.textContent = openCount;
    if (radarOutputEl) radarOutputEl.textContent = radarOutput;

    // Update severity badges on flow node
    const badgeC = el('soc-case-badge-c');
    const badgeH = el('soc-case-badge-h');
    const badgeM = el('soc-case-badge-m');
    const badgeL = el('soc-case-badge-l');

    if (badgeC) badgeC.textContent = `C ${critCount}`;
    if (badgeH) badgeH.textContent = `H ${highCount}`;
    if (badgeM) badgeM.textContent = `M ${medCount}`;
    if (badgeL) badgeL.textContent = `L ${lowCount}`;

    // Update metric card: Total Open Cases
    const metricOpen = el('soc-metric-open-cases');
    const metricCrit = el('soc-metric-crit');
    const metricHigh = el('soc-metric-high');
    const metricMed = el('soc-metric-med');
    const metricLow = el('soc-metric-low');

    if (metricOpen) metricOpen.textContent = openCount;
    if (metricCrit) metricCrit.textContent = critCount;
    if (metricHigh) metricHigh.textContent = highCount;
    if (metricMed) metricMed.textContent = medCount;
    if (metricLow) metricLow.textContent = lowCount;

    // Update Wazuh Analysis top cards dynamically
    const wazuhAlertsEl = el('wazuh-metric-alerts-val');
    const wazuhFimEl = el('wazuh-metric-fim-val');
    const wazuhVulnsEl = el('wazuh-metric-vulns-val');

    if (wazuhAlertsEl) wazuhAlertsEl.textContent = `${(124.8 + openCount * 0.3).toFixed(1)}K`;
    if (wazuhFimEl) wazuhFimEl.textContent = (34 + openCount * 2);
    if (wazuhVulnsEl) wazuhVulnsEl.textContent = (138 + critCount * 4 + highCount * 2);

    // Re-render dynamic sub-panels
    if (typeof renderDynamicWazuhRulesTable === 'function') renderDynamicWazuhRulesTable();
    if (typeof renderDynamicWazuhVulnPosture === 'function') renderDynamicWazuhVulnPosture();
    if (typeof renderDynamicAnalyticsLists === 'function') renderDynamicAnalyticsLists();
  }

  // Dynamic Wazuh & Analytics Panels Renderer
  function renderDynamicWazuhRulesTable() {
    const tableBody = document.getElementById('wazuh-rules-table-body');
    if (!tableBody) return;

    const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
    const openAlerts = alerts.filter(a => a.status === 'open');

    const rulesList = [
      { id: '5710', desc: 'Attempt to login using a non-existent user', level: 5, levelClass: 'soc-status-alert', count: 843 + openAlerts.length * 12 },
      { id: '5715', desc: 'SSHD authentication success', level: 3, levelClass: 'soc-status-active', count: 420 + Math.floor(openAlerts.length * 5) },
      { id: '5720', desc: 'Multiple SSHD authentication failures', level: 10, levelClass: 'soc-status-quarantined', count: 104 + openAlerts.filter(a => a.severity === 'p0').length * 15 },
      { id: '554', desc: 'File integrity monitoring - File changed', level: 7, levelClass: 'soc-status-alert', count: 45 + openAlerts.filter(a => a.severity === 'p1').length * 4 },
      { id: '2301', desc: 'Host-based intrusion detection trigger', level: 12, levelClass: 'soc-status-quarantined', count: 14 + openAlerts.filter(a => a.severity === 'p0').length * 3 },
      { id: '9102', desc: 'Vulnerability scanner activity detected', level: 8, levelClass: 'soc-status-alert', count: 6 + openAlerts.length }
    ];

    tableBody.innerHTML = rulesList.map(rule => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--cyber-cyan);">${rule.id}</td>
        <td>${rule.desc}</td>
        <td><span class="status-badge-soc ${rule.levelClass}">${rule.level}</span></td>
        <td style="font-family: var(--font-mono); font-weight: 700;">${rule.count.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  function renderDynamicWazuhVulnPosture() {
    const container = document.getElementById('wazuh-vuln-posture-container');
    if (!container) return;

    const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
    const openAlerts = alerts.filter(a => a.status === 'open');

    const crit = openAlerts.filter(a => a.severity === 'p0').length + 3;
    const high = openAlerts.filter(a => a.severity === 'p1').length + 12;
    const med = openAlerts.filter(a => a.severity === 'p2').length + 45;
    const low = openAlerts.filter(a => a.severity === 'p3').length + 78;

    const maxCount = Math.max(crit, high, med, low, 1);

    container.innerHTML = `
      <div class="agent-progress-container" style="margin-bottom: 0.6rem;">
        <span style="font-size: 0.75rem; width: 60px; color: var(--text-secondary);">Critical</span>
        <div class="agent-progress-bar" style="flex-grow: 1;">
          <div class="agent-progress-fill progress-red" style="width: ${Math.round((crit / maxCount) * 100)}%"></div>
        </div>
        <span class="agent-progress-text" style="width: 30px; text-align: right;">${crit}</span>
      </div>
      <div class="agent-progress-container" style="margin-bottom: 0.6rem;">
        <span style="font-size: 0.75rem; width: 60px; color: var(--text-secondary);">High</span>
        <div class="agent-progress-bar" style="flex-grow: 1;">
          <div class="agent-progress-fill progress-yellow" style="width: ${Math.round((high / maxCount) * 100)}%"></div>
        </div>
        <span class="agent-progress-text" style="width: 30px; text-align: right;">${high}</span>
      </div>
      <div class="agent-progress-container" style="margin-bottom: 0.6rem;">
        <span style="font-size: 0.75rem; width: 60px; color: var(--text-secondary);">Medium</span>
        <div class="agent-progress-bar" style="flex-grow: 1;">
          <div class="agent-progress-fill progress-yellow" style="width: ${Math.round((med / maxCount) * 100)}%"></div>
        </div>
        <span class="agent-progress-text" style="width: 30px; text-align: right;">${med}</span>
      </div>
      <div class="agent-progress-container">
        <span style="font-size: 0.75rem; width: 60px; color: var(--text-secondary);">Low</span>
        <div class="agent-progress-bar" style="flex-grow: 1;">
          <div class="agent-progress-fill progress-green" style="width: ${Math.round((low / maxCount) * 100)}%"></div>
        </div>
        <span class="agent-progress-text" style="width: 30px; text-align: right;">${low}</span>
      </div>
    `;
  }

  function renderDynamicAnalyticsLists() {
    const targetedContainer = document.getElementById('analytics-targeted-agents-list');
    const ruleGroupsContainer = document.getElementById('analytics-rule-groups-list');
    const mitreContainer = document.getElementById('analytics-mitre-techniques-list');

    if (!targetedContainer || !ruleGroupsContainer || !mitreContainer) return;

    const agentsList = (typeof endpointAgentsData !== 'undefined' ? endpointAgentsData : [
      { name: 'win-prod-db-01', status: 'ACTIVE' },
      { name: 'linux-api-node-03', status: 'WARNING' },
      { name: 'win-corp-dc-02', status: 'ACTIVE' }
    ]);

    const targetedAgents = agentsList.map((a, idx) => {
      const baseVal = 1650 - (idx * 60);
      const isWarn = a.status === 'WARNING' || a.isQuarantined;
      const count = isWarn ? baseVal + 320 : baseVal;
      return { name: a.name.toUpperCase(), count: count };
    }).sort((a, b) => b.count - a.count);

    const maxTargeted = targetedAgents[0] ? targetedAgents[0].count : 1;

    targetedContainer.innerHTML = targetedAgents.map(ag => `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 130px; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-secondary); text-align: right; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ag.name}</span>
        <div style="flex: 1; height: 18px; background: rgba(255,255,255,0.03); border-radius: 3px; overflow: hidden;">
          <div style="width: ${Math.round((ag.count / maxTargeted) * 100)}%; height: 100%; background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-green)); border-radius: 3px; transition: width 0.4s ease;"></div>
        </div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-primary); width: 45px; text-align: right;">${ag.count.toLocaleString()}</span>
      </div>
    `).join('');

    const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
    const openCount = alerts.filter(a => a.status === 'open').length;

    const ruleGroups = [
      { name: 'vulnerability-detector', count: 1509 + openCount * 18 },
      { name: 'web', count: 305 + openCount * 4 },
      { name: 'accesslog', count: 282 + openCount * 3 },
      { name: 'recon', count: 261 + openCount * 2 },
      { name: 'web_scan', count: 250 + openCount }
    ];
    const maxRuleGroup = ruleGroups[0].count;

    ruleGroupsContainer.innerHTML = ruleGroups.map(rg => `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 140px; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-secondary); text-align: right; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${rg.name}</span>
        <div style="flex: 1; height: 18px; background: rgba(255,255,255,0.03); border-radius: 3px; overflow: hidden;">
          <div style="width: ${Math.round((rg.count / maxRuleGroup) * 100)}%; height: 100%; background: linear-gradient(90deg, #4facfe, var(--cyber-cyan)); border-radius: 3px; transition: width 0.4s ease;"></div>
        </div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-primary); width: 45px; text-align: right;">${rg.count.toLocaleString()}</span>
      </div>
    `).join('');

    const mitreTechs = [
      { name: 'Stored Data Manipulation', count: 1180 + openCount * 12 },
      { name: 'Valid Accounts', count: 340 + openCount * 5 },
      { name: 'Sudo and Sudo Caching', count: 265 + openCount * 3 },
      { name: 'Vulnerability Scanning', count: 215 + openCount * 2 },
      { name: 'Active Scanning', count: 39 + openCount }
    ];
    const maxMitre = mitreTechs[0].count;

    mitreContainer.innerHTML = mitreTechs.map(mt => `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 140px; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-secondary); text-align: right; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${mt.name}</span>
        <div style="flex: 1; height: 18px; background: rgba(255,255,255,0.03); border-radius: 3px; overflow: hidden;">
          <div style="width: ${Math.round((mt.count / maxMitre) * 100)}%; height: 100%; background: linear-gradient(90deg, var(--cyber-cyan), #4facfe); border-radius: 3px; transition: width 0.4s ease;"></div>
        </div>
        <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-primary); width: 45px; text-align: right;">${mt.count.toLocaleString()}</span>
      </div>
    `).join('');
  }

  // Make updateSocMetrics globally accessible so Security page can call it after acknowledging alerts
  window.updateSocMetrics = updateSocMetrics;

  function initSocDashboard() {
    if (socInitialized) return;
    socInitialized = true;

    // Render discovery sources dynamically on the flow diagram
    updateSocSourcesCard();

    // Compute SOC metrics from real alert data
    updateSocMetrics();

    // 1. Bind Sub-tab triggers
    const subTabBtns = document.querySelectorAll('.soc-sub-tab-btn');
    const panels = document.querySelectorAll('.soc-panel-content');

    subTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-soc-tab');
        if (!tab) return;

        const targetPanel = document.getElementById(`soc-panel-${tab}`);
        if (!targetPanel) return;

        subTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        activeSocTab = tab;

        showToast(`Switched SOC view to: ${btn.textContent}`);
      });
    });

    // 2. Act Now table disposition actions
    const actNowTableBody = document.getElementById('act-now-table-body');
    if (actNowTableBody) {
      actNowTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-disp');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const alertId = btn.getAttribute('data-alert-id');
        const host = btn.getAttribute('data-host') || 'Asset';
        const row = btn.closest('.act-row');

        if (row) {
          row.classList.add('actioned-row');
          row.querySelectorAll('.btn-disp').forEach(b => b.disabled = true);
        }

        if (alertId) {
          let alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
          const targetAlert = alerts.find(a => a.id === alertId);
          if (targetAlert) {
            targetAlert.status = 'acknowledged';
            localStorage.setItem('uplink_security_alerts', JSON.stringify(alerts));
            securityAlerts = alerts;
          }
        }

        if (action === 'TP') {
          showToast(`Escalated alert on ${host} as True Positive (TP). Playbook initiated.`, false);
        } else {
          showToast(`Dismissed alert on ${host} as False Positive (FP). Exception rule created.`, true);
        }

        if (window.renderSocActNowTable) window.renderSocActNowTable();
        if (window.renderSocUnresolvedCards) window.renderSocUnresolvedCards();
        if (window.updateSocMetrics) window.updateSocMetrics();
        if (window.renderSecurityAlerts) window.renderSecurityAlerts();
      });
    }

    // 3. Endpoint Agent filter pills
    const agentFilterPills = document.querySelectorAll('.agent-filter-pill');
    agentFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        agentFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeAgentFilter = pill.getAttribute('data-agent-filter');
        renderAgentsTable();
      });
    });

    // Search bar binding
    const agentSearchBox = document.getElementById('agents-search-box');
    if (agentSearchBox) {
      agentSearchBox.addEventListener('input', (e) => {
        agentsSearchQuery = e.target.value.toLowerCase();
        renderAgentsTable();
      });
    }

    // Render agents first time
    renderAgentsTable();

    // 4. Map Beacon tooltip hovers
    const beacons = document.querySelectorAll('.map-beacon');
    const tooltip = document.getElementById('map-beacon-tooltip');
    
    beacons.forEach(b => {
      b.addEventListener('mouseenter', (e) => {
        const city = b.getAttribute('data-city');
        let details = "Security Status: Secure";
        if (city === "Singapore") details = "2 Critical Threats Active";
        if (city === "Seattle") details = "1 High Alert Pending";
        if (city === "Frankfurt") details = "Ingress rate: 890 KB/s";
        
        tooltip.querySelector('.tooltip-city').textContent = city;
        tooltip.querySelector('.tooltip-alert').textContent = details;
        tooltip.style.display = 'flex';
      });

      b.addEventListener('mousemove', (e) => {
        const containerRect = document.querySelector('.world-map-svg-container').getBoundingClientRect();
        const left = e.clientX - containerRect.left + 15;
        const top = e.clientY - containerRect.top + 15;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      b.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });

    // 5. Generate Heatmap Grid (24 hours x 4 severities)
    renderHeatmap();

    // 6. Recent Logs Events List
    renderEventsLog();

    // Reset log button
    const clearEventsBtn = document.getElementById('clear-events-btn');
    if (clearEventsBtn) {
      clearEventsBtn.addEventListener('click', () => {
        eventsLogData = [
          { time: "Just now", type: "Log Cleared", host: "XSIAM-CONSOLE", desc: "Telemetry logs reset by administrator", severity: "l", status: "resolved" }
        ];
        renderEventsLog();
        showToast("Security event log reset.");
      });
    }

    // 7. Wazuh Rules search filter
    const wazuhSearch = document.getElementById('wazuh-rules-search');
    const wazuhTableBody = document.getElementById('wazuh-rules-table-body');
    if (wazuhSearch && wazuhTableBody) {
      wazuhSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = wazuhTableBody.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const ruleId = cells[0].textContent.toLowerCase();
          const ruleDesc = cells[1].textContent.toLowerCase();
          if (ruleId.includes(query) || ruleDesc.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // 8. Live ticking counters
    const liveEventsEl = document.getElementById('live-events-counter');
    const livePreventedEl = document.getElementById('live-prevented-counter');
    
    let eventsCount = 43829104256;
    let preventedCount = 286104;
    
    if (liveEventsEl) {
      setInterval(() => {
        eventsCount += Math.floor(Math.random() * 250) + 120;
        liveEventsEl.textContent = eventsCount.toLocaleString();
      }, 150);
    }
    
    if (livePreventedEl) {
      setInterval(() => {
        preventedCount += Math.floor(Math.random() * 2) + 1;
        livePreventedEl.textContent = preventedCount.toLocaleString();
      }, 5000);
    }

    // 9. Live Event Stream simulator
    const mockAlertTypes = [
      { type: "SSH Brute Force", severity: "c", desc: "Multiple authentication failures detected", status: "blocked" },
      { type: "SQL Injection", severity: "c", desc: "UNION SELECT exploit attempt blocked on database", status: "blocked" },
      { type: "File Integrity Modification", severity: "h", desc: "Configuration file modified: /etc/ssh/sshd_config", status: "alerting" },
      { type: "Privilege Escalation", severity: "c", desc: "User execution of sudo with invalid credentials", status: "alerting" },
      { type: "Network Port Scan", severity: "m", desc: "Host scan detected: 100+ ports scanned in 5s", status: "blocked" },
      { type: "Malicious UserAgent", severity: "m", desc: "Web server access from known vulnerability scanner", status: "resolved" },
      { type: "API Abuse", severity: "h", desc: "Rate limit exceeded on /api/v1/auth/login", status: "isolated" }
    ];
    const mockHosts = [
      "linux-bastion-ssh", "linux-api-node-03", "win-prod-db-01", "win-corp-dc-02", "mac-dev-laptop-77"
    ];

    setInterval(() => {
      if (document.getElementById('soc-events-log')) {
        const randomAlert = mockAlertTypes[Math.floor(Math.random() * mockAlertTypes.length)];
        const randomHost = mockHosts[Math.floor(Math.random() * mockHosts.length)];
        const timestamp = new Date().toTimeString().split(' ')[0];
        
        eventsLogData.unshift({
          time: timestamp,
          type: randomAlert.type,
          host: randomHost,
          desc: randomAlert.desc,
          severity: randomAlert.severity,
          status: randomAlert.status
        });
        
        if (eventsLogData.length > 10) {
          eventsLogData.pop();
        }
        
        renderEventsLog();
        
        // Show alert toast for high/critical threats
        if (randomAlert.severity === 'c' || randomAlert.severity === 'h') {
          showToast(`LIVE THREAT INGRESS: ${randomAlert.type} on host ${randomHost}!`, false);
        }
      }
    }, 8500);

    // 10. Live FIM Log Stream simulator
    const wazuhFimLog = document.querySelector('#soc-panel-wazuh .events-log-list');
    if (wazuhFimLog) {
      const fimFiles = [
        "/etc/passwd", "/etc/shadow", "/var/www/html/index.php", "/usr/bin/sudo", "/etc/pam.d/common-auth", "/etc/nginx/nginx.conf"
      ];
      const fimHosts = [
        "win-prod-db-01", "linux-bastion-ssh", "linux-api-node-03", "win-corp-dc-02"
      ];
      setInterval(() => {
        const randomFimFile = fimFiles[Math.floor(Math.random() * fimFiles.length)];
        const randomHost = fimHosts[Math.floor(Math.random() * fimHosts.length)];
        const timestamp = new Date().toTimeString().split(' ')[0];
        
        const row = document.createElement('div');
        row.className = 'event-log-row severity-h';
        row.style.padding = '0.4rem 0.6rem';
        row.style.fontSize = '0.75rem';
        row.innerHTML = `
          <span class="event-time" style="width: 60px;">${timestamp}</span>
          <span class="event-host" style="width: 100px;">${randomHost}</span>
          <span class="event-desc">File modified: ${randomFimFile}</span>
        `;
        wazuhFimLog.insertBefore(row, wazuhFimLog.firstChild);
        if (wazuhFimLog.children.length > 8) {
          wazuhFimLog.removeChild(wazuhFimLog.lastChild);
        }
      }, 11000);
    }

    // Initialize Wazuh Reports list & interactive generator
    if (typeof renderWazuhReports === 'function') {
      renderWazuhReports();
    }
    if (typeof initWazuhReportGenerator === 'function') {
      initWazuhReportGenerator();
    }

    // 11. Wazuh Analytics Severity Donut Hover details
    const segments = document.querySelectorAll('.severity-segment');
    const infoTitle = document.getElementById('chart-info-title');
    const infoVal = document.getElementById('chart-info-val');

    if (segments.length > 0 && infoTitle && infoVal) {
      const details = {
        '3': { title: 'Rule level >= 3', val: '70% (Low)', color: 'var(--cyber-green)' },
        '7': { title: 'Rule level >= 7', val: '20% (Medium)', color: '#3b82f6' },
        '12': { title: 'Rule level >= 12', val: '8% (High)', color: '#fb923c' },
        '15': { title: 'Rule level >= 15', val: '2% (Critical)', color: '#ef4444' }
      };

      segments.forEach(seg => {
        const lvl = seg.getAttribute('data-level');
        const data = details[lvl];
        if (!data) return;

        seg.addEventListener('mouseenter', () => {
          seg.setAttribute('stroke-width', '4.2');
          seg.style.filter = `drop-shadow(0 0 6px ${data.color})`;
          
          infoTitle.textContent = data.title;
          infoTitle.style.color = data.color;
          infoVal.textContent = data.val;
          infoVal.style.color = 'var(--text-primary)';
        });

        seg.addEventListener('mouseleave', () => {
          seg.setAttribute('stroke-width', '3');
          seg.style.filter = '';
          
          infoTitle.textContent = 'Wazuh Level';
          infoTitle.style.color = 'var(--text-muted)';
          infoVal.textContent = 'Select Segment';
          infoVal.style.color = 'var(--text-primary)';
        });
      });
    }

    // Helper to construct alert object from a table row
    function renderSocActNowTable() {
      const tableBody = document.getElementById('act-now-table-body');
      if (!tableBody) return;

      const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
      const openAlerts = alerts.filter(a => a.status === 'open');

      tableBody.innerHTML = '';
      openAlerts.forEach(alert => {
        const row = document.createElement('tr');
        row.className = 'act-row';
        row.style.cursor = 'pointer';

        const host = alert.host || 'linux-bastion-ssh';
        const ip = alert.ip || '10.100.1.5';
        const sevClass = alert.severity === 'p0' ? 'bg-red' : (alert.severity === 'p1' ? 'bg-orange' : (alert.severity === 'p2' ? 'bg-amber' : 'bg-blue'));
        const sevLabel = alert.severity.toUpperCase();

        row.innerHTML = `
          <td>
            <div class="agent-col-cell">
              <span class="agent-main-lbl">${host}</span>
              <span class="agent-sub-lbl">${ip}</span>
            </div>
          </td>
          <td>
            <div class="rule-col-cell">
              <span class="rule-main-lbl">${alert.title}</span>
              <span class="rule-sub-lbl"><span class="rule-link">#${alert.id}</span> · seen ${alert.seen || '1x'} · ${alert.timestamp}</span>
            </div>
          </td>
          <td><span class="severity-badge ${sevClass}">${sevLabel}</span></td>
          <td>
            <div class="disp-btn-group">
              <button class="btn-disp btn-tp" data-action="TP" data-alert-id="${alert.id}" data-host="${host}">TP</button>
              <button class="btn-disp btn-fp" data-action="FP" data-alert-id="${alert.id}" data-host="${host}">FP</button>
            </div>
          </td>
        `;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.disp-btn-group') || e.target.closest('.btn-disp')) return;
          if (typeof window.openSocAlertDrawer === 'function') {
            window.openSocAlertDrawer(alert, host);
          } else if (typeof window.openAlertDrawer === 'function') {
            window.openAlertDrawer(alert, host);
          }
        });

        tableBody.appendChild(row);
      });
    }

    function renderSocUnresolvedCards() {
      const cardsList = document.getElementById('unresolved-cards-list');
      if (!cardsList) return;

      const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
      const openAlerts = alerts.filter(a => a.status === 'open');

      const countHeader = document.querySelector('.soc-split-column .column-title .val-count');
      if (countHeader) countHeader.textContent = openAlerts.length;

      cardsList.innerHTML = '';
      openAlerts.forEach(alert => {
        const card = document.createElement('div');
        const borderClass = alert.severity === 'p0' ? 'border-left-red' : (alert.severity === 'p1' ? 'border-left-orange' : 'border-left-amber');
        const bgClass = alert.severity === 'p0' ? 'bg-red' : (alert.severity === 'p1' ? 'bg-orange' : 'bg-amber');
        const sevLabel = alert.severity.toUpperCase();

        card.className = `split-log-card ${borderClass}`;
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <span class="log-card-badge ${bgClass}">${sevLabel}</span>
          <span class="log-card-source text-muted">${alert.source || 'wazuh'}</span>
          <span class="log-card-desc">${alert.title} <span class="card-details-sub">seen ${alert.seen || '1x'} · active ${alert.timestamp}</span></span>
        `;

        card.addEventListener('click', () => {
          if (typeof window.openSocAlertDrawer === 'function') {
            window.openSocAlertDrawer(alert, alert.host || 'External Asset');
          } else if (typeof window.openAlertDrawer === 'function') {
            window.openAlertDrawer(alert, alert.host || 'External Asset');
          }
        });

        cardsList.appendChild(card);
      });
    }

    window.renderSocActNowTable = renderSocActNowTable;
    window.renderSocUnresolvedCards = renderSocUnresolvedCards;

    renderSocActNowTable();
    renderSocUnresolvedCards();

    // Bind click on Critical / Top Alerting indicators to open top critical alert drawer
    const criticalTriggers = document.querySelectorAll('#soc-open-cases-count, #soc-case-badge-c, #soc-metric-crit, #soc-metric-open-cases, .column-title, #act-now-view-all');
    criticalTriggers.forEach(trigger => {
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') e.preventDefault();
        const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;
        const topCrit = alerts.find(a => a.severity === 'p0' && a.status === 'open') || alerts[0];
        if (topCrit && typeof window.openAlertDrawer === 'function') {
          window.openAlertDrawer(topCrit, topCrit.host || 'linux-bastion-ssh');
        }
      });
    });
  }

  // OS Icons helper
  function getOSIconSVG(os) {
    if (os === "windows") {
      return `<svg class="os-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block; vertical-align:middle;"><path d="M0 3.449L9.75 2.1v9.451H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zM10.8 1.95L24 0v11.55H10.8V1.95zm0 10.5H24v11.55l-13.2-1.95v-9.6z"/></svg>`;
    } else if (os === "linux") {
      return `<svg class="os-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block; vertical-align:middle;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>`;
    } else if (os === "macos") {
      return `<svg class="os-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block; vertical-align:middle;"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2 0.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z"/></svg>`;
    }
    return '';
  }

  function renderAgentsTable() {
    const tableBody = document.getElementById('agents-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = "";

    let filteredAgents = agentsData;
    if (activeAgentFilter === "connected") {
      filteredAgents = filteredAgents.filter(a => a.status === "active" || a.status === "alert");
    } else if (activeAgentFilter === "alerting") {
      filteredAgents = filteredAgents.filter(a => a.status === "alert");
    } else if (activeAgentFilter === "offline") {
      filteredAgents = filteredAgents.filter(a => a.status === "offline");
    }

    if (agentsSearchQuery !== "") {
      filteredAgents = filteredAgents.filter(a => a.name.includes(agentsSearchQuery) || a.ip.includes(agentsSearchQuery));
    }

    if (filteredAgents.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-muted);">No agents match the active filter criteria.</td></tr>`;
      return;
    }

    filteredAgents.forEach(agent => {
      const row = document.createElement('tr');
      
      let cpuColorClass = "progress-green";
      if (agent.cpu > 75) cpuColorClass = "progress-red";
      else if (agent.cpu > 40) cpuColorClass = "progress-yellow";

      let ramColorClass = "progress-green";
      if (agent.ram > 85) ramColorClass = "progress-red";
      else if (agent.ram > 55) ramColorClass = "progress-yellow";

      let statusLabel = "active";
      let statusClass = "soc-status-active";
      if (agent.status === "alert") { statusLabel = "warning"; statusClass = "soc-status-alert"; }
      else if (agent.status === "offline") { statusLabel = "offline"; statusClass = "soc-status-offline"; }
      else if (agent.status === "quarantined") { statusLabel = "quarantined"; statusClass = "soc-status-quarantined"; }

      const showQuarantineBtnLabel = agent.status === "quarantined" ? "Release" : "Quarantine";
      const quarantineBtnClass = agent.status === "quarantined" ? "agent-btn-quarantine undo-quarantine" : "agent-btn-quarantine";

      row.innerHTML = `
        <td><span class="agent-hostname">${agent.name}</span></td>
        <td><span class="agent-ip">${agent.ip}</span></td>
        <td>
          <span class="os-badge">
            ${getOSIconSVG(agent.os)}
            ${agent.os}
          </span>
        </td>
        <td><span class="status-badge-soc ${statusClass}">${statusLabel}</span></td>
        <td>
          <div class="agent-progress-container">
            <div class="agent-progress-bar">
              <div class="agent-progress-fill ${cpuColorClass}" style="width: ${agent.cpu}%"></div>
            </div>
            <span class="agent-progress-text">${agent.cpu}%</span>
          </div>
        </td>
        <td>
          <div class="agent-progress-container">
            <div class="agent-progress-bar">
              <div class="agent-progress-fill ${ramColorClass}" style="width: ${agent.ram}%"></div>
            </div>
            <span class="agent-progress-text">${agent.ram}%</span>
          </div>
        </td>
        <td><span class="agent-lastseen">${agent.lastSeen}</span></td>
        <td>
          <div class="buttons-row-small" style="display:flex; gap:0.4rem;">
            <button class="agent-btn-restart" data-host="${agent.name}">Restart</button>
            <button class="${quarantineBtnClass}" data-host="${agent.name}">${showQuarantineBtnLabel}</button>
          </div>
        </td>
      `;

      row.querySelector('.agent-btn-restart').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const host = btn.getAttribute('data-host');
        btn.disabled = true;
        btn.innerHTML = `<span class="table-spinner"></span> Restarting`;
        
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = "Restart";
          showToast(`Agent service restarted on host: ${host}`, true);
          const timestamp = new Date().toTimeString().split(' ')[0];
          eventsLogData.unshift({
            time: timestamp,
            type: "Agent Restarted",
            host: host,
            desc: "Telemetry service restarted successfully by administrator",
            severity: "l",
            status: "resolved"
          });
          renderEventsLog();
        }, 1200);
      });

      row.querySelector('.agent-btn-quarantine').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const host = btn.getAttribute('data-host');
        const targetAgent = agentsData.find(a => a.name === host);
        if (!targetAgent) return;

        const timestamp = new Date().toTimeString().split(' ')[0];

        if (targetAgent.status === "quarantined") {
          targetAgent.status = "active";
          targetAgent.cpu = 15;
          targetAgent.ram = 42;
          showToast(`Endpoint released from isolation: ${host}`, true);
          eventsLogData.unshift({
            time: timestamp,
            type: "Host Released",
            host: host,
            desc: "Network isolation filter lifted by administrator",
            severity: "m",
            status: "resolved"
          });
        } else {
          targetAgent.status = "quarantined";
          targetAgent.cpu = 0;
          targetAgent.ram = 0;
          showToast(`Endpoint Isolated: ${host}`, false);
          eventsLogData.unshift({
            time: timestamp,
            type: "Host Isolated",
            host: host,
            desc: "Critical network isolation policy active. Incoming/outgoing sockets dropped.",
            severity: "c",
            status: "isolated"
          });
        }
        renderAgentsTable();
        renderEventsLog();
      });

      tableBody.appendChild(row);
    });
  }

  function renderHeatmap() {
    const cellsContainer = document.getElementById('alerts-heatmap-cells');
    if (!cellsContainer) return;

    cellsContainer.innerHTML = "";

    const scales = [
      [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0], 
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 2, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0], 
      [0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]  
    ];

    for (let hour = 0; hour < 24; hour++) {
      for (let sev = 3; sev >= 0; sev--) { 
        const density = scales[sev][hour];
        const cell = document.createElement('div');
        cell.className = `heatmap-cell scale-${density}`;
        
        let labelSev = "Low";
        if (sev === 1) labelSev = "Medium";
        else if (sev === 2) labelSev = "High";
        else if (sev === 3) labelSev = "Critical";

        const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        cell.setAttribute('title', `${hourStr} - ${labelSev} alerts: ${density * 4} events`);
        
        cellsContainer.appendChild(cell);
      }
    }
  }

  function renderEventsLog() {
    const logContainer = document.getElementById('soc-events-log');
    if (!logContainer) return;

    logContainer.innerHTML = "";

    const alerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || securityAlerts;

    alerts.forEach(alert => {
      const row = document.createElement('div');
      const sevClass = alert.severity === 'p0' ? 'c' : (alert.severity === 'p1' ? 'h' : 'm');
      row.className = `event-log-row severity-${sevClass}`;
      row.style.cursor = 'pointer';

      let statusClass = "status-bg-alerting";
      if (alert.status === "acknowledged" || alert.status === "resolved") statusClass = "status-bg-resolved";
      else if (alert.status === "blocked") statusClass = "status-bg-blocked";

      const host = alert.host || 'linux-bastion-ssh';

      row.innerHTML = `
        <span class="event-time">${alert.timestamp ? alert.timestamp.split(', ')[1] || alert.timestamp : 'Just now'}</span>
        <span class="event-type">${(alert.source || 'wazuh').toUpperCase()} Alert</span>
        <span class="event-host">${host}</span>
        <span class="event-desc">${alert.title}</span>
        <span class="event-status ${statusClass}">${alert.status}</span>
      `;

      row.addEventListener('click', () => {
        if (typeof window.openAlertDrawer === 'function') {
          window.openAlertDrawer(alert, host);
        }
      });

      logContainer.appendChild(row);
    });
  }

  function renderSettingsAuditLogs() {
    const container = document.getElementById('settings-audit-logs-container');
    if (!container) return;

    if (settingsAuditLogs.length === 0) {
      container.innerHTML = `
        <div class="settings-card" id="settings-logs-placeholder" style="border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 3rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          Workspace audit logs are empty in the current session.
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    settingsAuditLogs.forEach(log => {
      const card = document.createElement('div');
      card.className = 'audit-log-card';
      card.innerHTML = `
        <div class="audit-log-left">
          <span class="audit-log-time">${log.time}</span>
          <span class="audit-log-badge">${log.badge}</span>
          <span class="audit-log-desc">${log.desc}</span>
        </div>
        <span class="audit-log-target">${log.target}</span>
        <span class="audit-log-status">${log.status}</span>
      `;
      container.appendChild(card);
    });
  }
  window.renderSettingsAuditLogs = renderSettingsAuditLogs;

  function renderWazuhReports() {
    const listContainer = document.getElementById('wazuh-reports-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    wazuhReports.forEach((rpt, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 0.65rem 0.8rem; transition: all 0.2s; margin-bottom: 0.5rem;';
      
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.65rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; padding-right: 1rem;">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="#f43f5e" fill="none" stroke-width="2" style="flex-shrink: 0;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div style="overflow: hidden; text-overflow: ellipsis;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis;">${rpt.name}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 0.1rem;">Generated on ${rpt.date} · Size: ${rpt.size}</div>
          </div>
        </div>
        <button class="secondary-btn-sm download-report-btn" style="font-size: 0.68rem; padding: 0.2rem 0.5rem; flex-shrink: 0; display: flex; align-items: center; gap: 0.3rem;">
          <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download
        </button>
      `;

      row.querySelector('.download-report-btn').addEventListener('click', () => {
        showToast(`Downloading file: ${rpt.name}`, true);
      });

      listContainer.appendChild(row);
    });
  }

  function initWazuhReportGenerator() {
    const generateBtn = document.getElementById('generate-wazuh-report-btn');
    const progressContainer = document.getElementById('wazuh-report-progress-container');
    const progressBar = document.getElementById('wazuh-report-progress-bar');
    const progressStatus = document.getElementById('wazuh-report-progress-status');
    const progressPct = document.getElementById('wazuh-report-progress-pct');

    if (!generateBtn || !progressContainer) return;

    generateBtn.addEventListener('click', () => {
      generateBtn.disabled = true;
      progressContainer.style.display = 'block';
      progressBar.style.width = '0%';
      progressPct.textContent = '0%';
      progressStatus.textContent = 'Analyzing cluster logs...';

      let pct = 0;
      const interval = setInterval(() => {
        pct += 5;
        progressBar.style.width = `${pct}%`;
        progressPct.textContent = `${pct}%`;

        if (pct === 30) {
          progressStatus.textContent = 'Extracting File Integrity metadata...';
        } else if (pct === 60) {
          progressStatus.textContent = 'Verifying compliance score benchmarks...';
        } else if (pct === 85) {
          progressStatus.textContent = 'Compiling PDF document layout...';
        } else if (pct >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            progressContainer.style.display = 'none';
            generateBtn.disabled = false;

            const now = new Date();
            const dateStr = now.toLocaleDateString();
            const timeCode = now.getTime().toString().slice(-4);
            const newReport = {
              name: `Wazuh_Security_Audit_Report_${dateStr.replace(/\//g, '_')}_${timeCode}.pdf`,
              date: dateStr,
              size: "1.2 MB",
              type: "Audit"
            };

            wazuhReports.unshift(newReport);
            localStorage.setItem('uplink_wazuh_reports', JSON.stringify(wazuhReports));
            renderWazuhReports();

            showToast("Wazuh Security Audit Report generated successfully!", true);
          }, 400);
        }
      }, 100);
    });
  }

  // ==========================================================================
  // SECURITY SIEM FINDINGS & NOTIFICATIONS LOGIC
  // ==========================================================================

  let notificationsData = JSON.parse(localStorage.getItem('uplink_notifications')) || [
    { id: "16396", type: "SSH Brute Force", host: "WAZUH", desc: "Repeated ModSecurity attacks from same source IP: 110.35.80.116", time: "9:52 AM", severity: "c" },
    { id: "16394", type: "SQL Injection", host: "WAZUH", desc: "ModSecurity: SQL Injection attempt detected in query string", time: "9:52 AM", severity: "c" },
    { id: "16393", type: "SSH Brute Force", host: "WAZUH", desc: "Repeated ModSecurity attacks from same source IP: 202.183.141.133", time: "9:53 AM", severity: "c" },
    { id: "16380", type: "Credential Leak", host: "BREACH", desc: "Breach Intel: Compromised database dump found on cyber forum", time: "8:44 AM", severity: "c" }
  ];

  let securityAlerts = JSON.parse(localStorage.getItem('uplink_security_alerts')) || [
    { id: "16396", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 110.35.80.116", timestamp: "7/18/2026, 9:52:51 AM", seen: "1095x", status: "open", host: "FLUTTERGIS", ip: "172.185.56.163" },
    { id: "16395", source: "wazuh", severity: "p1", title: "Wazuh L10 · Multiple Windows error application events.", timestamp: "7/18/2026, 9:52:47 AM", seen: "2x", status: "open", host: "win-corp-dc-02", ip: "10.100.2.10" },
    { id: "16394", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 82.197.69.40", timestamp: "7/18/2026, 9:52:52 AM", seen: "24x", status: "open", host: "COLLAB", ip: "172.185.41.34" },
    { id: "16393", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 202.183.141.133", timestamp: "7/18/2026, 9:53:12 AM", seen: "145x", status: "open", host: "FLUTTERGIS", ip: "172.185.56.163" },
    { id: "16388", source: "git", severity: "p2", title: "Git leakage · AWS Access Key ID exposed in commit message.", timestamp: "7/18/2026, 9:31:05 AM", seen: "259x", status: "open", host: "BRIEFGATES-SERVICE", ip: "45.79.120.204" },
    { id: "16380", source: "breach", severity: "p0", title: "Breach Intelligence · Leaked admin credentials found on darkweb repository.", timestamp: "7/18/2026, 8:44:12 AM", seen: "6x", status: "open", host: "BBB-FIX", ip: "192.46.211.130" },
    { id: "16372", source: "brand", severity: "p3", title: "Brand abuse · Rogue phishing domain registered: secure-uplink-portal.com", timestamp: "7/18/2026, 7:15:20 AM", seen: "1x", status: "open", host: "linux-api-node-03", ip: "10.100.4.15" }
  ];

  function initNotificationBell() {
    const bellBtn = document.getElementById('notification-bell-btn');
    const bellBadge = document.getElementById('bell-alert-badge');
    const dropdown = document.getElementById('notifications-dropdown-menu');
    const listContainer = document.getElementById('notifications-list');
    const clearBtn = document.getElementById('clear-notifications-btn');

    if (!bellBtn || !dropdown || !listContainer) return;

    // Clear existing main bell listeners so SOC/Security bell takes over
    const notifBellClone = bellBtn.cloneNode(true);
    bellBtn.parentNode.replaceChild(notifBellClone, bellBtn);
    const activeBellBtn = notifBellClone;

    // Toggle dropdown
    activeBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !activeBellBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Clear all notifications
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsData = [];
        localStorage.setItem('uplink_notifications', JSON.stringify(notificationsData));
        renderNotifications();
        showToast("Cleared all notifications.");
      });
    }

    window.renderNotifications = function() {
      listContainer.innerHTML = '';

      if (notificationsData.length === 0) {
        if (bellBadge) bellBadge.classList.add('hidden');
        listContainer.innerHTML = '<div class="notification-empty" style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">No active alerts. System healthy.</div>';
      } else {
        if (bellBadge) bellBadge.classList.remove('hidden');

        notificationsData.forEach((notif) => {
          const sevColor = notif.severity === 'c' ? '#ef4444' : '#f97316';
          const sevLabel = notif.severity === 'c' ? 'CRITICAL' : 'WARNING';
          const item = document.createElement('div');
          item.className = 'notification-item';
          item.style.cssText = 'cursor: pointer; padding: 0.6rem 0.75rem; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s;';
          item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
              <span style="font-weight: 700; color: ${sevColor}; font-size: 0.72rem;">⚠ ${sevLabel}</span>
              <span style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono);">${notif.time}</span>
            </div>
            <div style="color: var(--text-primary); font-size: 0.78rem; font-weight: 600; margin-bottom: 0.15rem;">${notif.type}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 0.3rem;">${notif.desc}</div>
            <div style="font-size: 0.68rem; color: var(--cyber-cyan); font-weight: 600;">View in Security →</div>
          `;
          item.addEventListener('mouseenter', () => { item.style.background = 'rgba(0, 242, 254, 0.05)'; item.style.borderColor = 'rgba(0, 242, 254, 0.15)'; });
          item.addEventListener('mouseleave', () => { item.style.background = 'rgba(255,255,255,0.02)'; item.style.borderColor = 'rgba(255,255,255,0.05)'; });
          
          item.addEventListener('click', () => {
            // Navigate to Security page
            dropdown.classList.add('hidden');
            const secLink = document.querySelector('.nav-item[href="#security"]');
            if (secLink) secLink.click();
          });

          listContainer.appendChild(item);
        });
      }
    };

    renderNotifications();

    // Background alert simulation interval
    if (true) {
      let alertOffset = 400;
      setInterval(() => {
        if (Math.random() < 0.35) {
          const newId = String(16400 + alertOffset++);
          
          const alertTypes = [
            { type: "SSH Brute Force", source: "wazuh", severity: "p0", desc: "Repeated ModSecurity attacks from same source IP: 185.120.45.62", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 185.120.45.62", seen: "5x" },
            { type: "SQL Injection", source: "wazuh", severity: "p0", desc: "ModSecurity: SQL Injection attempt detected in query string", title: "Wazuh L12 · SQL Injection attempt detected on web application node 02", seen: "2x" },
            { type: "AWS Credential Leak", source: "git", severity: "p0", desc: "GitHub secrets scan: exposed AWS root token in dev repository", title: "Git leakage · AWS access keys leaked in public repository code", seen: "1x" },
            { type: "Database Breach Info", source: "breach", severity: "p0", desc: "Breach Intel: Compromised database dump found on cyber forum", title: "Breach Intel · Leak detected containing corp user data (1,240 records)", seen: "1x" }
          ];

          const picked = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          const nowStr = new Date().toLocaleTimeString();

          // Push to securityAlerts
          securityAlerts.unshift({
            id: newId,
            source: picked.source,
            severity: picked.severity,
            title: picked.title,
            timestamp: new Date().toLocaleString(),
            seen: picked.seen,
            status: "open"
          });
          if (securityAlerts.length > 25) securityAlerts.pop();
          localStorage.setItem('uplink_security_alerts', JSON.stringify(securityAlerts));
          if (window.renderSecurityAlerts) window.renderSecurityAlerts();

          // Push to notificationsData if critical (p0)
          if (picked.severity === 'p0') {
            notificationsData.unshift({
              id: newId,
              type: picked.type,
              host: picked.source.toUpperCase(),
              desc: picked.desc,
              time: nowStr,
              severity: "c"
            });
            if (notificationsData.length > 8) notificationsData.pop();
            localStorage.setItem('uplink_notifications', JSON.stringify(notificationsData));
            renderNotifications();
            
            // Subtle flash indicator
            if (bellBadge) {
              bellBadge.style.transform = 'scale(1.4)';
              setTimeout(() => { bellBadge.style.transform = 'scale(1)'; }, 400);
            }
            
            showToast(`CRITICAL SECURITY EVENT: ${picked.type}! Check notification center.`, false);
          }

          // Prepend to SOC events log if on soc.html
          const logContainer = document.getElementById('soc-events-log');
          if (logContainer) {
            const row = document.createElement('div');
            row.className = 'event-log-row severity-c';
            row.innerHTML = `
              <span class="event-time">${nowStr}</span>
              <span class="event-type">${picked.type}</span>
              <span class="event-host">${picked.source.toUpperCase()}</span>
              <span class="event-desc">${picked.desc}</span>
              <span class="event-status status-bg-blocked">blocked</span>
            `;
            logContainer.insertBefore(row, logContainer.firstChild);
            if (logContainer.children.length > 10) logContainer.removeChild(logContainer.lastChild);

            // Flash Singapore map beacon red
            const beacon = document.querySelector('.map-beacon[data-city="Singapore"]');
            if (beacon) {
              beacon.style.transform = 'translate(740px, 280px) scale(1.6)';
              setTimeout(() => { beacon.style.transform = 'translate(740px, 280px) scale(1)'; }, 1200);
            }
          }
        }
      }, 7500);
    }
  }

  function initSecurityDashboard() {
    if (securityInitialized) return;
    securityInitialized = true;

    const grid = document.getElementById('security-alerts-grid');
    const selectAllBtn = document.getElementById('select-all-btn');
    const bulkAckBtn = document.getElementById('bulk-acknowledge-btn');
    const searchInput = document.getElementById('find-id-input');
    const searchGoBtn = document.getElementById('find-id-go-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const hideWazuhBtn = document.getElementById('btn-hide-wazuh');
    const wazuhTypesBlock = document.getElementById('wazuh-types-block');
    const filteredCountLbl = document.getElementById('filtered-count-lbl');

    // Drawer elements
    const drawer = document.getElementById('alert-details-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerMetaLbl = document.getElementById('drawer-meta-lbl');
    const drawerTitleVal = document.getElementById('drawer-title-val');
    const drawerDescVal = document.getElementById('drawer-desc-val');
    const drawerHostVal = document.getElementById('drawer-host-val');
    const drawerTimeVal = document.getElementById('drawer-time-val');
    const isolateBtn = document.getElementById('run-playbook-isolate-btn');

    // Define globally accessible drawer open trigger
    window.openAlertDrawer = function(alert, overrideHost) {
      if (!alert) return;
      
      const hostMatch = alert.title.match(/host\s+(\S+)|IP:\s+(\S+)/);
      const host = overrideHost || (hostMatch ? (hostMatch[1] || hostMatch[2]) : "External Asset");

      if (drawerMetaLbl) {
        drawerMetaLbl.textContent = `${alert.severity.toUpperCase()} · ${alert.source.toUpperCase()} · #${alert.id}`;
      }
      
      if (drawerTitleVal) {
        const titleParts = alert.title.split(' · ');
        drawerTitleVal.textContent = titleParts[1] || alert.title;
      }
      
      if (drawerDescVal) {
        const titleParts = alert.title.split(' · ');
        drawerDescVal.textContent = titleParts[0] + " finding reported from security agent logs.";
      }
      
      if (drawerHostVal) {
        drawerHostVal.textContent = host;
      }

      if (drawerTimeVal) {
        drawerTimeVal.textContent = `seen ${alert.seen} · last ${alert.timestamp}`;
      }
      
      // Get security remediation steps
      let secRemediations = [];
      const titleLower = alert.title.toLowerCase();

      if (titleLower.includes("brute force") || titleLower.includes("modsecurity") || titleLower.includes("authentication failed")) {
        secRemediations = [
          `Identify attacker IP source and immediately block using firewalld/iptables or AWS Security Groups: <code>iptables -A INPUT -s ${host} -j DROP</code>.`,
          `Enable Fail2ban jail configuration for sshd and modsecurity to auto-ban offending IPs after 3 failed attempts.`,
          `Enforce key-based SSH authentication and disable password-based login in <code>/etc/ssh/sshd_config</code>.`
        ];
      } else if (titleLower.includes("git leakage") || titleLower.includes("credentials exposed") || titleLower.includes("aws")) {
        secRemediations = [
          `Revoke the compromised AWS access key immediately via the AWS IAM Console or CLI: <code>aws iam update-access-key --status Inactive --access-key-id KEY_ID</code>.`,
          `Use <code>git-filter-repo</code> or BFG Repo-Cleaner to purge the sensitive credentials from the repository history.`,
          `Setup git secrets detection pre-commit hook (e.g. Talisman or GitGuardian) to prevent future leakages.`
        ];
      } else if (titleLower.includes("breach") || titleLower.includes("darkweb")) {
        secRemediations = [
          `Enforce immediate password reset for the compromised administrator account: <code>passwd admin</code>.`,
          `Audit access logs for the administrator account to check for unauthorized access or API key creations.`,
          `Enforce Multi-Factor Authentication (MFA) across all administrative control panels.`
        ];
      } else if (titleLower.includes("brand abuse") || titleLower.includes("phishing")) {
        secRemediations = [
          `Submit a takedown request to the hosting provider and domain registrar of the offending domain.`,
          `Configure DNS Security policies (SPF, DKIM, and DMARC) with <code>p=reject</code> to prevent spoofing.`,
          `Inform users via security bulletin and add the domain to browser blocklists (Google Safe Browsing).`
        ];
      } else if (titleLower.includes("malware") || titleLower.includes("mimikatz") || titleLower.includes("ransomware")) {
        secRemediations = [
          `Quarantine the infected endpoint: <code>${host}</code> from the network immediately using the playbook action.`,
          `Run a full security scan using Windows Defender or installed EDR agent to locate and purge the binaries.`,
          `Audit Active Directory login sessions originating from the host to ensure credentials weren't dumped or reused.`
        ];
      } else if (titleLower.includes("hijack") || titleLower.includes("rogue process") || titleLower.includes("shell spawn")) {
        secRemediations = [
          `Identify and terminate the parent process executing the curl download command.`,
          `Verify if any cron jobs or daemon processes were registered to establish persistent remote shell backdoors.`,
          `Inspect outbound socket connections on port 443/80 for unauthorized command and control (C2) traffic.`
        ];
      } else if (titleLower.includes("sql injection")) {
        secRemediations = [
          `Audit the vulnerable database endpoint query parameters and implement parameterized queries/prepared statements.`,
          `Ensure input validation and sanitization filters are active on all REST request payloads.`,
          `Verify ModSecurity WAF rules are set to blocking mode (Rule ID 942100 - SQL Injection).`
        ];
      } else {
        secRemediations = [
          `Isolate the host or source IP address to prevent potential lateral movement.`,
          `Verify user login activity and SSH/auth logs for abnormal pattern matching: <code>tail -f /var/log/auth.log</code>.`,
          `Analyze system execution logs and trigger file integrity scan via SIEM manager.`
        ];
      }

      const drawerSteps = document.getElementById('drawer-remediation-steps');
      if (drawerSteps) {
        drawerSteps.innerHTML = '';
        secRemediations.forEach(step => {
          const li = document.createElement('li');
          li.innerHTML = step;
          li.style.color = 'var(--text-primary)';
          li.style.lineHeight = '1.6';
          li.style.fontSize = '0.82rem';
          drawerSteps.appendChild(li);
        });
      }

      if (typeof bindPlaybookControls === 'function') {
        bindPlaybookControls(alert);
      }
      if (drawer) {
        drawer.classList.add('active');
      }
    };
    const blockBtn = document.getElementById('run-playbook-block-btn');

    // CSV elements
    const csvModal = document.getElementById('csv-export-modal');
    const csvStatus = document.getElementById('csv-modal-status');
    const csvProgress = document.getElementById('csv-progress-bar-fill');

    if (!grid) return;

    let currentFilters = {
      status: "open",
      severity: "any",
      source: "all",
      search: ""
    };

    // Keep track of executed playbooks per alert ID
    let executedPlaybooks = JSON.parse(localStorage.getItem('uplink_executed_playbooks')) || {};

    // Filter pills event binding
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const type = pill.getAttribute('data-filter-type');
        const val = pill.getAttribute('data-filter-val');

        pill.parentElement.querySelectorAll('.filter-pill').forEach(sib => sib.classList.remove('active'));
        pill.classList.add('active');

        currentFilters[type] = val;
        renderSecurityAlerts();
      });
    });

    // Rule group pills filter trigger
    const rulePills = document.querySelectorAll('.rule-group-pill');
    rulePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const group = pill.getAttribute('data-group');
        if (searchInput) {
          searchInput.value = group;
          currentFilters.search = group;
          renderSecurityAlerts();
          showToast(`Filtered alerts by rule group: ${group}`);
        }
      });
    });

    // Find id go
    if (searchGoBtn && searchInput) {
      searchGoBtn.addEventListener('click', () => {
        currentFilters.search = searchInput.value.trim().toLowerCase();
        renderSecurityAlerts();
      });
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          currentFilters.search = searchInput.value.trim().toLowerCase();
          renderSecurityAlerts();
        }
      });
    }

    // Hide/Show Wazuh rule groups
    if (hideWazuhBtn && wazuhTypesBlock) {
      hideWazuhBtn.addEventListener('click', () => {
        if (wazuhTypesBlock.style.display === 'none') {
          wazuhTypesBlock.style.display = 'block';
          hideWazuhBtn.textContent = 'Hide Wazuh types';
        } else {
          wazuhTypesBlock.style.display = 'none';
          hideWazuhBtn.textContent = 'Show Wazuh types';
        }
      });
    }

    // Interactive CSV Export Progress Loader
    if (exportCsvBtn && csvModal) {
      exportCsvBtn.addEventListener('click', () => {
        csvModal.classList.add('active');
        csvProgress.style.width = '0%';
        csvStatus.textContent = 'Initializing SIEM log database...';

        let progress = 0;
        const statusUpdates = [
          { threshold: 15, text: 'Querying 16,345 records...' },
          { threshold: 40, text: 'Filtering active alerts status=open...' },
          { threshold: 70, text: 'Formatting CSV headers & columns...' },
          { threshold: 90, text: 'Compiling download file...' }
        ];

        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 8) + 3;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            csvProgress.style.width = '100%';
            csvStatus.textContent = 'Download starting!';

            setTimeout(() => {
              csvModal.classList.remove('active');
              
              // Trigger a dummy text CSV file download
              const csvContent = "data:text/csv;charset=utf-8,ID,Source,Severity,Title,Status,Timestamp\n" + 
                securityAlerts.map(a => `${a.id},${a.source},${a.severity},"${a.title}",${a.status},"${a.timestamp}"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "siem_findings_export.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              showToast("SIEM export package compiled and downloaded successfully.", true);
            }, 600);
          } else {
            csvProgress.style.width = `${progress}%`;
            const matchedStatus = statusUpdates.find(s => progress <= s.threshold);
            if (matchedStatus) {
              csvStatus.textContent = matchedStatus.text;
            }
          }
        }, 80);
      });
    }

    // Close Details Drawer
    if (drawerCloseBtn && drawer) {
      drawerCloseBtn.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
      // Close on clicking outside drawer
      document.addEventListener('click', (e) => {
        if (drawer.classList.contains('active') && !drawer.contains(e.target) && (!grid || !grid.contains(e.target)) && (!selectAllBtn || !selectAllBtn.contains(e.target))) {
          drawer.classList.remove('active');
        }
      });
    }

    // Close Run Details Drawer & Copy handlers
    const runDrawerCloseBtn = document.getElementById('run-drawer-close-btn');
    const runDrawer = document.getElementById('run-details-drawer');
    if (runDrawerCloseBtn && runDrawer) {
      runDrawerCloseBtn.addEventListener('click', () => {
        runDrawer.classList.remove('active');
      });
      document.addEventListener('click', (e) => {
        if (runDrawer.classList.contains('active') && !runDrawer.contains(e.target) && !e.target.closest('.runs-history-row')) {
          runDrawer.classList.remove('active');
        }
      });
    }

    const copyScriptBtn = document.getElementById('copy-run-script-btn');
    if (copyScriptBtn) {
      copyScriptBtn.addEventListener('click', () => {
        const text = document.getElementById('run-drawer-script')?.textContent;
        if (text) {
          navigator.clipboard.writeText(text);
          showToast('Input script copied to clipboard!', true);
        }
      });
    }

    const copyOutputBtn = document.getElementById('copy-run-output-btn');
    if (copyOutputBtn) {
      copyOutputBtn.addEventListener('click', () => {
        const text = document.getElementById('run-drawer-output')?.textContent;
        if (text) {
          navigator.clipboard.writeText(text);
          showToast('Command output log copied to clipboard!', true);
        }
      });
    }

    // Bulk action select all on page
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const checkboxes = grid.querySelectorAll('.alert-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        updateBulkAckBtnState();
      });
    }

    // Bulk Acknowledge
    if (bulkAckBtn) {
      bulkAckBtn.addEventListener('click', () => {
        const checkedBoxes = grid.querySelectorAll('.alert-checkbox:checked');
        checkedBoxes.forEach(cb => {
          const id = cb.getAttribute('data-id');
          const idx = securityAlerts.findIndex(a => a.id === id);
          if (idx !== -1) {
            securityAlerts[idx].status = 'acknowledged';
          }
        });
        localStorage.setItem('uplink_security_alerts', JSON.stringify(securityAlerts));
        renderSecurityAlerts();
        bulkAckBtn.style.display = 'none';
        showToast("Bulk acknowledged selected security findings.", true);
      });
    }

    function updateBulkAckBtnState() {
      const checkedBoxes = grid.querySelectorAll('.alert-checkbox:checked');
      if (checkedBoxes.length > 0) {
        bulkAckBtn.style.display = 'inline-block';
        bulkAckBtn.textContent = `Acknowledge Selected (${checkedBoxes.length})`;
      } else {
        bulkAckBtn.style.display = 'none';
      }
    }

    // Bind Playbook execution buttons
    function bindPlaybookControls(alert) {
      const alertId = alert.id;
      const soarContainer = document.getElementById('drawer-soar-playbooks');
      if (!soarContainer) return;

      soarContainer.innerHTML = '';
      
      const source = alert.source ? alert.source.toLowerCase() : 'wazuh';
      const hostMatch = alert.title.match(/host\s+(\S+)|IP:\s+(\S+)/);
      const host = hostMatch ? (hostMatch[1] || hostMatch[2]) : "External Asset";

      let playbooks = [];

      if (source === 'wazuh') {
        playbooks = [
          {
            key: 'block_ip',
            name: 'Block Attacker IP',
            desc: `Deploy PaloAlto NGFW block rule for source IP ${host}`,
            runText: 'Block IP',
            successText: 'Blocked',
            runningText: 'Blocking...',
            toastMsg: `Attacker IP ${host} blocked successfully. PaloAlto firewall rule updated.`
          },
          {
            key: 'isolate_host',
            name: 'Isolate Host',
            desc: `Quarantine host VM via VMware vSphere vCenter APIs`,
            runText: 'Isolate',
            successText: 'Isolated',
            runningText: 'Isolating...',
            toastMsg: `Host quarantined from network segment. VCenter VM network disabled.`
          },
          {
            key: 'rate_limit',
            name: 'Enable Nginx Rate Limiting',
            desc: 'Apply rate limiting profile on core ingress proxy configurations',
            runText: 'Rate Limit',
            successText: 'Active',
            runningText: 'Applying...',
            toastMsg: 'Rate limit rules successfully loaded onto Nginx ingress controller.'
          }
        ];
      } else if (source === 'git') {
        playbooks = [
          {
            key: 'revoke_key',
            name: 'Revoke Compromised AWS Key',
            desc: 'Execute IAM key deactivation API on AWS endpoint controller',
            runText: 'Revoke Key',
            successText: 'Revoked',
            runningText: 'Revoking...',
            toastMsg: 'Compromised AWS Access Key successfully deactivated in IAM console.'
          },
          {
            key: 'purge_history',
            name: 'Purge Git History',
            desc: 'Initiate BFG repo-cleaner pipeline to erase credential leak commits',
            runText: 'Purge Git',
            successText: 'Purged',
            runningText: 'Purging...',
            toastMsg: 'BFG repo-cleaner run completed. Exposed commit signatures purged.'
          },
          {
            key: 'git_hook',
            name: 'Deploy Git Guardian Hooks',
            desc: 'Inject pre-receive commit verification scripts to Git server',
            runText: 'Deploy Hook',
            successText: 'Deployed',
            runningText: 'Deploying...',
            toastMsg: 'Pre-commit GitGuardian validation hooks successfully registered.'
          }
        ];
      } else if (source === 'breach') {
        playbooks = [
          {
            key: 'force_reset',
            name: 'Force Password Reset',
            desc: 'Trigger administrative password rotation call on Active Directory',
            runText: 'Reset Password',
            successText: 'Reset Requested',
            runningText: 'Requesting...',
            toastMsg: 'Active Directory user password marked expired. Mandatory reset active.'
          },
          {
            key: 'revoke_jwt',
            name: 'Revoke Active Sessions',
            desc: 'Invalidate all active refresh tokens and OAuth sessions',
            runText: 'Revoke Sessions',
            successText: 'Revoked',
            runningText: 'Revoking...',
            toastMsg: 'All active sessions expired in Redis session store. User logged out.'
          },
          {
            key: 'enable_mfa',
            name: 'Enforce Hardware MFA',
            desc: 'Elevate login rules to require YubiKey/FIDO2 authenticator',
            runText: 'Enforce MFA',
            successText: 'Enforced',
            runningText: 'Enforcing...',
            toastMsg: 'Security policy updated. Next login will prompt for FIDO2 verification.'
          }
        ];
      } else if (source === 'brand' || source === 'domain') {
        playbooks = [
          {
            key: 'registrar_takedown',
            name: 'Registrar Abuse Takedown',
            desc: 'Send automated legal threat & takedown API notice to Registrar',
            runText: 'Send Takedown',
            successText: 'Takedown Sent',
            runningText: 'Sending...',
            toastMsg: 'Abuse ticket opened with Domain Registrar. Verification pending.'
          },
          {
            key: 'dns_sinkhole',
            name: 'Inject DNS Sinkhole',
            desc: 'Add rogue domain block list rules on internal CoreDNS resolvers',
            runText: 'Sinkhole',
            successText: 'Sinkholed',
            runningText: 'Injecting...',
            toastMsg: 'DNS zone override active. Internal queries routed to sinkhole IP.'
          },
          {
            key: 'block_emails',
            name: 'Block Inbound Emails',
            desc: 'Block emails originating from the phishing domain on M365 controller',
            runText: 'Block Emails',
            successText: 'Emails Blocked',
            runningText: 'Blocking...',
            toastMsg: 'Mail transport rules updated. Emails from rogue domain dropped.'
          }
        ];
      } else {
        // Generic fallback playbooks
        playbooks = [
          {
            key: 'alert_escalation',
            name: 'Escalate to TheHive',
            desc: 'Open incident ticket on TheHive Orchestration engine',
            runText: 'Escalate',
            successText: 'Escalated',
            runningText: 'Escalating...',
            toastMsg: 'Incident ticket successfully dispatched to security analyst pool.'
          },
          {
            key: 'block_ip_generic',
            name: 'Block Attacker IP',
            desc: `Deploy firewall block rule for source IP ${host}`,
            runText: 'Block IP',
            successText: 'Blocked',
            runningText: 'Blocking...',
            toastMsg: `Attacker IP ${host} blocked successfully.`
          }
        ];
      }

      // Define accent colors for playbook cards
      const accentColors = ['var(--cyber-cyan)', 'var(--cyber-green)', '#f59e0b'];

      playbooks.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'drawer-playbook-card';
        const accent = accentColors[idx % accentColors.length];
        card.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-left: 3px solid ${accent}; border-radius: 8px; transition: all 0.2s;`;
        
        // Restore run states
        const hasRun = executedPlaybooks[alertId] && executedPlaybooks[alertId][p.key];
        const statusClass = hasRun ? 'btn-run-playbook success' : 'btn-run-playbook';
        const buttonText = hasRun ? p.successText : p.runText;
        const isDisabled = hasRun ? 'disabled' : '';

        card.innerHTML = `
          <div class="playbook-card-info" style="display: flex; flex-direction: column; gap: 0.2rem;">
            <span class="playbook-name" style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${p.name}</span>
            <span class="playbook-desc" style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.4;">${p.desc}</span>
          </div>
          <button class="${statusClass}" data-key="${p.key}" ${isDisabled} style="font-size: 0.74rem; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 5px; cursor: pointer; transition: all 0.2s; white-space: nowrap;">${buttonText}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          btn.className = 'btn-run-playbook running';
          btn.textContent = p.runningText;
          btn.disabled = true;

          setTimeout(() => {
            btn.className = 'btn-run-playbook success';
            btn.textContent = p.successText;

            if (!executedPlaybooks[alertId]) executedPlaybooks[alertId] = {};
            executedPlaybooks[alertId][p.key] = true;
            localStorage.setItem('uplink_executed_playbooks', JSON.stringify(executedPlaybooks));

            // Log to settingsAuditLogs (Settings -> Logs)
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
            const dateStr = now.toLocaleDateString();

            settingsAuditLogs.unshift({
              time: `${dateStr} ${timeStr}`,
              badge: "SOAR Run",
              desc: `${p.name} executed: ${p.toastMsg}`,
              target: host,
              status: p.successText.toUpperCase()
            });

            if (settingsAuditLogs.length > 50) {
              settingsAuditLogs.pop();
            }

            localStorage.setItem('uplink_settings_audit_logs', JSON.stringify(settingsAuditLogs));

            // Refresh Settings logs if currently visible
            if (typeof renderSettingsAuditLogs === 'function') {
              renderSettingsAuditLogs();
            }

            // Acknowledge the alert automatically
            const alertIdx = securityAlerts.findIndex(a => a.id === alertId);
            if (alertIdx !== -1) {
              securityAlerts[alertIdx].status = 'acknowledged';
              localStorage.setItem('uplink_security_alerts', JSON.stringify(securityAlerts));
              renderSecurityAlerts();
            }

            showToast(p.toastMsg, true);
          }, 1500);
        });

        soarContainer.appendChild(card);
      });

      // Populate Quick Actions buttons
      const quickActionsContainer = document.getElementById('drawer-quick-actions');
      if (quickActionsContainer) {
        quickActionsContainer.innerHTML = '';
        const quickActionConfig = [
          { label: 'Isolate Host', icon: '🔒', bg: 'rgba(0, 242, 254, 0.12)', border: 'rgba(0, 242, 254, 0.35)', color: 'var(--cyber-cyan)', key: 'isolate_host' },
          { label: 'Block IP', icon: '🛡', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', color: '#f43f5e', key: 'block_ip' },
          { label: 'Escalate', icon: '📋', bg: 'rgba(0, 242, 254, 0.12)', border: 'rgba(0, 242, 254, 0.35)', color: 'var(--cyber-cyan)', key: 'alert_escalation' }
        ];

        quickActionConfig.forEach(qa => {
          const btn = document.createElement('button');
          btn.style.cssText = `display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: ${qa.bg}; border: 1px solid ${qa.border}; color: ${qa.color}; white-space: nowrap;`;
          btn.innerHTML = `<span style="font-size: 0.7rem;">${qa.icon}</span> ${qa.label}`;

          btn.addEventListener('click', () => {
            // Find matching playbook button and click it
            const matchingBtn = soarContainer.querySelector(`button[data-key="${qa.key}"], button[data-key="${qa.key}_generic"], button[data-key="block_ip_generic"]`);
            if (matchingBtn && !matchingBtn.disabled) {
              matchingBtn.click();
            } else {
              showToast(`${qa.label} action dispatched for alert #${alertId}.`, true);
            }
          });

          quickActionsContainer.appendChild(btn);
        });
      }

      // Bind SOAR tab pill toggles
      const soarTabPills = document.querySelectorAll('.soar-tab-pill');
      soarTabPills.forEach(pill => {
        pill.addEventListener('click', () => {
          soarTabPills.forEach(p => {
            p.style.background = 'rgba(255,255,255,0.03)';
            p.style.borderColor = 'rgba(255,255,255,0.08)';
            p.style.color = 'var(--text-muted)';
            p.classList.remove('active');
          });
          pill.style.background = 'rgba(0, 242, 254, 0.1)';
          pill.style.borderColor = 'rgba(0, 242, 254, 0.3)';
          pill.style.color = 'var(--cyber-cyan)';
          pill.classList.add('active');
        });
      });
    }

    window.renderSecurityAlerts = function() {
      grid.innerHTML = '';
      
      let filtered = securityAlerts.filter(alert => {
        if (currentFilters.status !== 'all') {
          if (alert.status !== currentFilters.status) return false;
        }
        
        if (currentFilters.severity !== 'any') {
          const sevMap = { critical: 'p0', high: 'p1', medium: 'p2', low: 'p3' };
          if (alert.severity !== sevMap[currentFilters.severity]) return false;
        }

        if (currentFilters.source !== 'all') {
          if (alert.source !== currentFilters.source) return false;
        }

        if (currentFilters.search) {
          const q = currentFilters.search;
          const matchesId = alert.id.toLowerCase().includes(q) || ('#' + alert.id).includes(q);
          const matchesTitle = alert.title.toLowerCase().includes(q);
          const matchesSource = alert.source.toLowerCase().includes(q);
          if (!matchesId && !matchesTitle && !matchesSource) return false;
        }

        return true;
      });

      // Update counters in layout
      const wazuhOpen = securityAlerts.filter(a => a.source === 'wazuh' && a.status === 'open').length;
      const gitOpen = securityAlerts.filter(a => a.source === 'git' && a.status === 'open').length;
      const breachOpen = securityAlerts.filter(a => a.source === 'breach' && a.status === 'open').length;

      const scaleWazuh = 16345 + (wazuhOpen - 4);
      const scaleGit = 49 + (gitOpen - 1);
      const scaleBreach = 1 + (breachOpen - 1);
      
      const wazuhCountEl = document.getElementById('wazuh-open-count');
      const gitCountEl = document.getElementById('git-open-count');
      const breachCountEl = document.getElementById('breach-open-count');
      const wazuhTotalEl = document.getElementById('wazuh-rule-groups-total');

      if (wazuhCountEl) wazuhCountEl.textContent = scaleWazuh.toLocaleString();
      if (gitCountEl) gitCountEl.textContent = scaleGit.toLocaleString();
      if (breachCountEl) breachCountEl.textContent = scaleBreach.toLocaleString();
      if (wazuhTotalEl) wazuhTotalEl.textContent = scaleWazuh.toLocaleString();

      if (filteredCountLbl) {
        filteredCountLbl.textContent = `Showing ${filtered.length} of ${securityAlerts.length} findings`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: span 2; text-align: center; padding: 3rem; color: var(--text-muted); font-size: 0.85rem;">No security findings match the selected filter criteria.</div>';
        return;
      }

      filtered.forEach(alert => {
        const card = document.createElement('div');
        card.className = `alert-card severity-${alert.severity}`;
        
        card.innerHTML = `
          <div class="alert-card-header">
            <div class="alert-card-meta">
              <span class="alert-badge ${alert.severity}">${alert.severity}</span>
              <span class="alert-source">${alert.source}</span>
              <span class="alert-id">#${alert.id}</span>
            </div>
            <span class="alert-status-lbl ${alert.status}">${alert.status}</span>
          </div>
          <div class="alert-card-title">${alert.title}</div>
          <div class="alert-card-footer">
            <div class="alert-card-footer-left">
              <input type="checkbox" class="alert-checkbox" data-id="${alert.id}">
              <span>seen ${alert.seen}</span>
            </div>
            <span>last ${alert.timestamp}</span>
          </div>
        `;

        const cb = card.querySelector('.alert-checkbox');
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
          updateBulkAckBtnState();
        });

        // Clicking card opens the details drawer
        card.addEventListener('click', (e) => {
          if (e.target !== cb) {
            window.openAlertDrawer(alert);
          }
        });

        grid.appendChild(card);
      });

      if (window.updateSocMetrics) {
        window.updateSocMetrics();
      }
    };

    renderSecurityAlerts();
  }

  // -------------------------------------------------------------
  // CLIENT & PROJECT VIEWS DYNAMIC RENDERING
  // -------------------------------------------------------------
  let activeClientId = null;
  let activeProjectId = null;
  let projectSearchQuery = "";

  function renderClientPage() {
    const wrapper = document.getElementById('client-view-wrapper');
    if (!wrapper) return;

    // Get committed clients
    const committedClients = clientsData.filter(client => {
      return projectsData.some(proj => proj.accepted && proj.clientId === client.id);
    });

    if (committedClients.length === 0) {
      wrapper.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-cyber); border-radius: 12px; padding: 4rem 2rem; text-align: center; color: var(--text-muted); font-family: var(--font-sans); backdrop-filter: blur(12px); max-width: 600px; margin: 2rem auto;">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5" style="margin: 0 auto 1.5rem; opacity: 0.5; display: block; color: var(--cyber-cyan);">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">No Committed Client Data</h2>
          <p style="font-size: 0.88rem; max-width: 420px; margin: 0 auto; line-height: 1.5;">Complete the onboarding discovery wizard steps and assign accepted projects to clients to see client profiles here.</p>
        </div>
      `;
      return;
    }

    if (!activeClientId || !committedClients.some(c => c.id === activeClientId)) {
      activeClientId = committedClients[0].id;
    }

    const client = committedClients.find(c => c.id === activeClientId);

    // Filter projects for active client
    const clientProjects = projectsData.filter(p => p.accepted && p.clientId === client.id);

    // Get instances for client projects
    const clientInstances = [];
    clientProjects.forEach(proj => {
      proj.instances.forEach(instName => {
        const inst = instancesData.find(i => i.name === instName);
        if (inst) {
          clientInstances.push(inst);
        }
      });
    });

    // Get apps (components) for client instances
    const clientApps = [];
    clientInstances.forEach(inst => {
      inst.components.forEach(comp => {
        if (!clientApps.some(a => a.name === comp.name)) {
          clientApps.push({
            name: comp.name,
            instanceName: inst.name,
            isAPI: comp.isAPI
          });
        }
      });
    });

    // Get domains for client projects
    const confirmedDomains = Array.from(document.querySelectorAll('#panel-domains .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => {
      return {
        name: row.querySelector('.row-name').textContent.trim(),
        isSub: row.classList.contains('sub-row')
      };
    });

    const clientDomains = [];
    clientProjects.forEach(proj => {
      confirmedDomains.forEach(dom => {
        const domainLower = dom.name.toLowerCase();
        const projNameLower = proj.name.toLowerCase();
        const projDomainLower = (proj.domain || "").toLowerCase();
        
        const suffixMatch = projDomainLower && (domainLower === projDomainLower || domainLower.endsWith('.' + projDomainLower));
        const subMatch = domainLower.includes(projNameLower);
        
        if (suffixMatch || subMatch) {
          if (!clientDomains.some(d => d.name === dom.name)) {
            clientDomains.push(dom);
          }
        }
      });
    });

    // Calculate health of active client based on alerts
    let clientHealth = 'healthy';
    let healthLabel = 'Healthy';
    let healthColor = 'var(--cyber-green)';
    let openIncidentsCount = 0;
    let healthyInstancesCount = 0;

    clientInstances.forEach(inst => {
      const activeAlerts = alertsLog.filter(a => a.serverName === inst.name && a.status !== 'resolved');
      openIncidentsCount += activeAlerts.length;
      if (activeAlerts.length === 0) {
        healthyInstancesCount++;
      }
      activeAlerts.forEach(a => {
        if (a.severity === 'critical') {
          clientHealth = 'critical';
          healthLabel = 'Critical';
          healthColor = '#ef4444';
        } else if (a.severity === 'warning' && clientHealth !== 'critical') {
          clientHealth = 'warning';
          healthLabel = 'Warning';
          healthColor = '#f97316';
        }
      });
    });

    if (clientInstances.length === 0) {
      healthyInstancesCount = 0;
    }

    // Determine SLA Attainment display values based on client health
    let slaPercent = '100.00%';
    let errorBudget = '100%';
    let slaStatus = 'ATTAINED';
    let slaColor = 'var(--cyber-green)';

    if (clientHealth === 'critical') {
      slaPercent = '0.00%';
      errorBudget = '0%';
      slaStatus = 'BREACHED';
      slaColor = '#ef4444';
    } else if (clientHealth === 'warning') {
      slaPercent = '99.12%';
      errorBudget = '42%';
      slaStatus = 'BREACHED';
      slaColor = '#f97316';
    }

    const reachabilityPercent = clientHealth === 'critical' ? '0%' : (clientHealth === 'warning' ? '66%' : '100%');
    const reachabilityLabel = clientHealth === 'critical' ? '0/3 ok' : (clientHealth === 'warning' ? '2/3 ok' : '3/3 ok');

    // Build pills HTML
    const pillsHtml = committedClients.map(cli => {
      const activeClass = cli.id === activeClientId ? 'active' : '';
      return `<button class="client-tab-btn ${activeClass}" data-client-id="${cli.id}">
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2" style="opacity: 0.8;">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
        ${cli.name}
      </button>`;
    }).join('');

    wrapper.innerHTML = `
      <div style="padding: 1.5rem 0;">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.65rem;">
            <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cyber-cyan); filter: drop-shadow(0 0 6px rgba(0, 242, 254, 0.45));">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Client
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-muted);">A client's SLA attainment + error budget (E7), live health (E2), incidents, and their estate.</p>
        </div>

        <div class="client-tabs-list">
          ${pillsHtml}
        </div>

        <!-- Client Banner Card -->
        <div class="client-banner-card ${clientHealth}">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #a78bfa;">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0;">${client.name}</h2>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
                ${client.type.toLowerCase()} · <strong>${clientProjects.length}</strong> project${clientProjects.length === 1 ? '' : 's'} · <strong>${clientInstances.length}</strong> instance${clientInstances.length === 1 ? '' : 's'} · is_up=${clientHealth === 'healthy' ? 1 : 0}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${healthColor};"></span>
            <span style="font-size: 0.85rem; font-weight: 700; color: ${healthColor};">${healthLabel}</span>
          </div>
        </div>

        <!-- Section 01: SLA Attainment -->
        <div class="client-section-title">
          <span>01 SLA attainment + error budget</span>
        </div>
        
        <div class="client-stats-grid">
          <div class="client-stat-card">
            <span class="client-stat-label">24H SLA</span>
            <span class="client-stat-value" style="color: ${slaColor};">${slaPercent}</span>
            <span class="client-stat-status" style="color: ${slaColor};">budget ${errorBudget} · target 99.5%</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">7D SLA</span>
            <span class="client-stat-value" style="color: ${slaColor};">${slaPercent}</span>
            <span class="client-stat-status" style="color: ${slaColor};">budget ${errorBudget} · target 99.5%</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">30D SLA</span>
            <span class="client-stat-value" style="color: ${slaColor};">${slaPercent}</span>
            <span class="client-stat-status" style="color: ${slaColor};">budget ${errorBudget} · target 99.5%</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">90D SLA</span>
            <span class="client-stat-value" style="color: ${slaColor};">${slaPercent}</span>
            <span class="client-stat-status" style="color: ${slaColor};">budget ${errorBudget} · target 99.5%</span>
          </div>
        </div>

        <div class="client-stats-grid">
          <div class="client-stat-card">
            <span class="client-stat-label">App Reachability</span>
            <span class="client-stat-value" style="color: ${clientHealth === 'critical' ? '#ef4444' : (clientHealth === 'warning' ? '#f97316' : 'var(--cyber-green)')};">${reachabilityPercent}</span>
            <span class="client-stat-status" style="color: var(--text-muted);">${reachabilityLabel}</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">Instances Healthy</span>
            <span class="client-stat-value">${healthyInstancesCount}/${clientInstances.length}</span>
            <span class="client-stat-status" style="color: var(--text-muted);">reporting normal</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">Projects</span>
            <span class="client-stat-value">${clientProjects.length}</span>
            <span class="client-stat-status" style="color: var(--text-muted);">active scope</span>
          </div>
          <div class="client-stat-card">
            <span class="client-stat-label">Open Incidents</span>
            <span class="client-stat-value" style="color: ${openIncidentsCount > 0 ? '#ef4444' : 'var(--text-muted)'};">${openIncidentsCount}</span>
            <span class="client-stat-status" style="color: var(--text-muted);">${openIncidentsCount} total</span>
          </div>
        </div>

        <!-- Section 02: Projects -->
        <div class="client-section-title" style="margin-top: 2rem;">
          <span>02 Projects</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${clientProjects.map(proj => {
            let projHealth = 'var(--cyber-green)';
            proj.instances.forEach(name => {
              if (alertsLog.some(a => a.serverName === name && a.status !== 'resolved' && a.severity === 'critical')) {
                projHealth = '#ef4444';
              } else if (alertsLog.some(a => a.serverName === name && a.status !== 'resolved' && a.severity === 'warning' && projHealth !== '#ef4444')) {
                projHealth = '#f97316';
              }
            });

            return `
              <div class="client-nested-row navigate-project-btn" data-project-id="${proj.id}">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${proj.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${projHealth};"></span>
                  <span style="color: var(--text-muted); font-size: 0.8rem;">➔</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Section 03: Instances -->
        <div class="client-section-title">
          <span>03 Instances</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${clientInstances.map(inst => {
            let instHealth = 'var(--cyber-green)';
            const hasCrit = alertsLog.some(a => a.serverName === inst.name && a.status !== 'resolved' && a.severity === 'critical');
            const hasWarn = alertsLog.some(a => a.serverName === inst.name && a.status !== 'resolved' && a.severity === 'warning');
            if (hasCrit) instHealth = '#ef4444';
            else if (hasWarn) instHealth = '#f97316';

            return `
              <div class="client-nested-row client-instance-row" data-instance-name="${inst.name}">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                  </svg>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${inst.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${instHealth};"></span>
                  <span style="color: var(--text-muted); font-size: 0.8rem;">➔</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Section 04: Apps -->
        <div class="client-section-title">
          <span>04 Apps</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${clientApps.map(app => {
            let appHealth = 'var(--cyber-green)';
            const hasCrit = alertsLog.some(a => a.serverName === app.instanceName && a.status !== 'resolved' && a.severity === 'critical');
            const hasWarn = alertsLog.some(a => a.serverName === app.instanceName && a.status !== 'resolved' && a.severity === 'warning');
            if (hasCrit) appHealth = '#ef4444';
            else if (hasWarn) appHealth = '#f97316';

            return `
              <div class="client-nested-row" style="cursor: default;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${app.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${appHealth};"></span>
                </div>
              </div>
            `;
          }).join('')}
          ${clientDomains.map(dom => {
            return `
              <div class="client-nested-row" style="cursor: default;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${dom.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cyber-green);"></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Section 05: Incidents -->
        <div class="client-section-title">
          <span>05 Incidents (incl. history)</span>
        </div>
        <div>
          ${openIncidentsCount === 0 ? `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🎉</span>
              No incidents in window
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${clientInstances.map(inst => {
                const activeAlerts = alertsLog.filter(a => a.serverName === inst.name && a.status !== 'resolved');
                return activeAlerts.map(a => `
                  <div class="client-nested-row client-incident-row" data-alert-id="${a.id}">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <span style="font-weight: 800; font-size: 0.7rem; color: ${a.severity === 'critical' ? '#ef4444' : '#f97316'}; background: ${a.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)'}; padding: 0.15rem 0.4rem; border-radius: 3px;">
                        ${a.severity.toUpperCase()}
                      </span>
                      <div>
                        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${a.serverName}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">CPU exceeded ${a.cpuValue}% threshold</div>
                      </div>
                    </div>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">${a.timeShort}</span>
                  </div>
                `).join('');
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Wire up events
    wrapper.querySelectorAll('.client-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeClientId = btn.getAttribute('data-client-id');
        renderClientPage();
      });
    });

    wrapper.querySelectorAll('.navigate-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeProjectId = btn.getAttribute('data-project-id');
        const projLink = Array.from(document.querySelectorAll('.nav-menu .nav-item')).find(l => l.getAttribute('href') === '#project');
        if (projLink) projLink.click();
      });
    });

    wrapper.querySelectorAll('.client-instance-row').forEach(row => {
      row.addEventListener('click', () => {
        const instName = row.getAttribute('data-instance-name');
        const node = telemetryData.find(n => n.name === instName) || { name: instName, cpu: 50 };
        openDetailsSidebar(node, false);
      });
    });

    wrapper.querySelectorAll('.client-incident-row').forEach(row => {
      row.addEventListener('click', () => {
        const alertId = row.getAttribute('data-alert-id');
        const alert = alertsLog.find(a => a.id === alertId);
        if (alert) openDetailsSidebar(alert, true);
      });
    });
  }

  function renderProjectPage() {
    const wrapper = document.getElementById('project-view-wrapper');
    if (!wrapper) return;

    // Get committed/accepted projects
    const committedProjects = projectsData.filter(proj => proj.accepted);

    if (committedProjects.length === 0) {
      wrapper.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-cyber); border-radius: 12px; padding: 4rem 2rem; text-align: center; color: var(--text-muted); font-family: var(--font-sans); backdrop-filter: blur(12px); max-width: 600px; margin: 2rem auto;">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5" style="margin: 0 auto 1.5rem; opacity: 0.5; display: block; color: var(--cyber-cyan);">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">No Committed Project Data</h2>
          <p style="font-size: 0.88rem; max-width: 420px; margin: 0 auto; line-height: 1.5;">Complete the onboarding discovery wizard steps and accept projects to see project profiles here.</p>
        </div>
      `;
      return;
    }

    if (!activeProjectId || !committedProjects.some(p => p.id === activeProjectId)) {
      activeProjectId = committedProjects[0].id;
    }

    // Filter projects by search query
    const filteredProjects = committedProjects.filter(p => {
      return p.name.toLowerCase().includes(projectSearchQuery.toLowerCase());
    });

    const project = committedProjects.find(p => p.id === activeProjectId);

    // Get client for active project
    const client = clientsData.find(c => c.id === project.clientId);

    // Get instances for active project
    const projectInstances = [];
    project.instances.forEach(name => {
      const inst = instancesData.find(i => i.name === name);
      if (inst) {
        projectInstances.push(inst);
      }
    });

    // Group instances by environment
    const envGroups = {};
    projectInstances.forEach(inst => {
      const env = (inst.env || 'UNKNOWN').toUpperCase();
      if (!envGroups[env]) envGroups[env] = [];
      envGroups[env].push(inst);
    });

    // Get apps (components) for project instances
    const projectApps = [];
    projectInstances.forEach(inst => {
      inst.components.forEach(comp => {
        if (!projectApps.some(a => a.name === comp.name)) {
          projectApps.push({
            name: comp.name,
            instanceName: inst.name,
            isAPI: comp.isAPI,
            sub: comp.sub
          });
        }
      });
    });

    // Find databases for project. We search databases whose names contain the project name or its instances
    const confirmedDatabases = Array.from(document.querySelectorAll('#panel-databases .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => row.querySelector('.row-name').textContent.trim());

    const projectDatabases = confirmedDatabases.filter(dbName => {
      const dbLower = dbName.toLowerCase();
      const projLower = project.name.toLowerCase();
      return dbLower.includes(projLower) || projectInstances.some(inst => dbLower.includes(inst.name.toLowerCase().replace(/_new$/, '').split(/[_-]/)[0]));
    });

    // Find domains/subdomains for project
    const confirmedDomains = Array.from(document.querySelectorAll('#panel-domains .infra-row')).filter(row => {
      const pill = row.querySelector('.status-pill');
      return pill && pill.textContent.trim().toLowerCase() === 'confirmed';
    }).map(row => {
      return {
        name: row.querySelector('.row-name').textContent.trim(),
        isSub: row.classList.contains('sub-row')
      };
    });

    const projectDomains = confirmedDomains.filter(dom => {
      const domainLower = dom.name.toLowerCase();
      const projNameLower = project.name.toLowerCase();
      const projDomainLower = (project.domain || "").toLowerCase();
      
      const suffixMatch = projDomainLower && (domainLower === projDomainLower || domainLower.endsWith('.' + projDomainLower));
      const subMatch = domainLower.includes(projNameLower);
      return suffixMatch || subMatch;
    });

    // Calculate health of project based on alerts
    let projectHealth = 'healthy';
    let healthLabel = 'Healthy';
    let healthColor = 'var(--cyber-green)';
    let openIncidentsCount = 0;
    let healthyInstancesCount = 0;
    let unhealthyTopologyItems = [];

    projectInstances.forEach(inst => {
      const activeAlerts = alertsLog.filter(a => a.serverName === inst.name && a.status !== 'resolved');
      openIncidentsCount += activeAlerts.length;
      if (activeAlerts.length === 0) {
        healthyInstancesCount++;
      } else {
        activeAlerts.forEach(a => {
          let severityLabel = a.severity === 'critical' ? 'Critical' : 'Warning';
          let severityColor = a.severity === 'critical' ? '#ef4444' : '#f97316';
          
          if (a.severity === 'critical') {
            projectHealth = 'critical';
            healthLabel = 'Critical';
            healthColor = '#ef4444';
          } else if (a.severity === 'warning' && projectHealth !== 'critical') {
            projectHealth = 'warning';
            healthLabel = 'Warning';
            healthColor = '#f97316';
          }
          
          unhealthyTopologyItems.push({
            name: inst.name,
            type: 'Instance',
            status: severityLabel,
            color: severityColor
          });
        });
      }
      
      if (activeAlerts.length > 0) {
        inst.components.forEach(comp => {
          const mainAlert = activeAlerts[0];
          unhealthyTopologyItems.push({
            name: comp.name,
            type: 'App / Component',
            status: mainAlert.severity === 'critical' ? 'Critical' : 'Warning',
            color: mainAlert.severity === 'critical' ? '#ef4444' : '#f97316'
          });
        });
      }
    });

    if (projectInstances.length === 0) {
      healthyInstancesCount = 0;
    }

    const reachabilityPercent = projectHealth === 'critical' ? '0%' : (projectHealth === 'warning' ? '66%' : '100%');
    const reachabilityLabel = projectHealth === 'critical' ? `0/${projectApps.length} reachable` : (projectHealth === 'warning' ? `some need attention` : `${projectApps.length}/${projectApps.length} reachable`);

    // Build pills HTML based on filtered projects
    const pillsHtml = filteredProjects.map(p => {
      const activeClass = p.id === activeProjectId ? 'active' : '';
      return `<button class="project-tab-btn ${activeClass}" data-project-id="${p.id}">
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2" style="opacity: 0.8;">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        ${p.name}
      </button>`;
    }).join('');

    // Environments list HTML
    let envsHtml = '';
    Object.keys(envGroups).forEach(envName => {
      envsHtml += `
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">
            ${envName}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${envGroups[envName].map(inst => {
              let instHealthColor = 'var(--cyber-green)';
              let instHealthLabel = 'Healthy';
              const activeAlerts = alertsLog.filter(a => a.serverName === inst.name && a.status !== 'resolved');
              if (activeAlerts.some(a => a.severity === 'critical')) {
                instHealthColor = '#ef4444';
                instHealthLabel = 'Critical';
              } else if (activeAlerts.some(a => a.severity === 'warning')) {
                instHealthColor = '#f97316';
                instHealthLabel = 'Warning';
              }

              return `
                <div class="project-nested-row project-instance-row" data-instance-name="${inst.name}">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                      <rect x="2" y="2" width="20" height="8" rx="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" />
                    </svg>
                    <div>
                      <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${inst.name}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;">
                        ${inst.components.length} app${inst.components.length === 1 ? '' : 's'} · ${inst.type}
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.72rem; color: ${instHealthColor}; font-family: var(--font-mono); font-weight: bold; background: ${instHealthColor}15; border: 1px solid ${instHealthColor}25; padding: 0.15rem 0.4rem; border-radius: 4px;">
                      ${instHealthLabel}
                    </span>
                    <span style="color: var(--text-muted); font-size: 0.8rem;">➔</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    wrapper.innerHTML = `
      <div style="padding: 1.5rem 0;">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.65rem;">
            <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cyber-cyan); filter: drop-shadow(0 0 6px rgba(0, 242, 254, 0.45));">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <polygon points="12 11 16 15 12 19 8 15" />
            </svg>
            Project Lens
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-muted);">A project — the client it serves, its instances grouped by environment + apps, plus the data only a project has.</p>
        </div>

        <div style="margin-bottom: 1.25rem; display: flex; gap: 0.5rem;">
          <div style="position: relative; flex-grow: 1;">
            <input type="text" id="project-search-input" class="cyber-search-input" placeholder="Search projects..." value="${projectSearchQuery}" style="width: 100%; box-sizing: border-box; padding: 0.55rem 1rem 0.55rem 2.25rem; border-radius: 20px; font-size: 0.85rem;">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" style="position: absolute; left: 0.88rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div class="project-tabs-list">
          ${pillsHtml}
        </div>

        <!-- Project Banner Card -->
        <div class="project-banner-card ${projectHealth}">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.2); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--cyber-cyan);">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0;">${project.name}</h2>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
                <strong>${projectInstances.length}</strong> instance${projectInstances.length === 1 ? '' : 's'} · ${projectInstances.map(i => i.name).join(', ')}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-size: 0.72rem; color: ${healthColor}; font-family: var(--font-mono); font-weight: bold; background: ${healthColor}15; border: 1px solid ${healthColor}25; padding: 0.25rem 0.55rem; border-radius: 4px; text-transform: uppercase;">
              ${healthLabel === 'Degraded' || healthLabel === 'Warning' ? 'degraded' : healthLabel.toLowerCase()}
            </span>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="project-stats-grid">
          <div class="project-stat-card">
            <span class="project-stat-label">App Reachability</span>
            <span class="project-stat-value" style="color: ${projectHealth === 'critical' ? '#ef4444' : (projectHealth === 'warning' ? '#f97316' : 'var(--cyber-green)')};">${reachabilityPercent}</span>
            <span class="project-stat-status" style="color: var(--text-muted);">${reachabilityLabel}</span>
          </div>
          <div class="project-stat-card">
            <span class="project-stat-label">Instances Healthy</span>
            <span class="project-stat-value" style="color: ${healthyInstancesCount < projectInstances.length ? '#f97316' : 'var(--text-primary)'};">${healthyInstancesCount}/${projectInstances.length}</span>
            <span class="project-stat-status" style="color: var(--text-muted);">${healthyInstancesCount < projectInstances.length ? 'some need attention' : 'all operating normal'}</span>
          </div>
          <div class="project-stat-card">
            <span class="project-stat-label">CI · Last Build</span>
            <span class="project-stat-value" style="color: var(--text-muted); font-size: 1.1rem; font-weight: 500; font-family: var(--font-mono); margin-top: 0.8rem;">not yet wired</span>
            <span class="project-stat-status" style="color: var(--text-muted);">Jenkins not on platform API</span>
          </div>
          <div class="project-stat-card">
            <span class="project-stat-label">Quality Gate</span>
            <span class="project-stat-value" style="color: var(--text-muted); font-size: 1.1rem; font-weight: 500; font-family: var(--font-mono); margin-top: 0.8rem;">not yet wired</span>
            <span class="project-stat-status" style="color: var(--text-muted);">SonarQube not on platform API</span>
          </div>
        </div>

        <div class="project-stats-grid" style="grid-template-columns: 1fr;">
          <div class="project-stat-card" style="min-height: auto; padding: 1rem 1.2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="project-stat-label">Open Issues</span>
              <span class="project-stat-value" style="margin: 0; font-size: 1.5rem; color: ${openIncidentsCount > 0 ? '#ef4444' : 'var(--cyber-green)'};">${openIncidentsCount}</span>
            </div>
          </div>
        </div>

        <!-- Section 01: Serves client -->
        <div class="project-section-title" style="margin-top: 2rem;">
          <span>01 Serves client</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${client ? `
            <div class="project-nested-row navigate-client-btn" data-client-id="${client.id}">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <div>
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${client.name}</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 0.5rem;">(${client.email})</span>
                </div>
              </div>
              <span style="color: var(--text-muted); font-size: 0.8rem;">➔</span>
            </div>
          ` : `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              No client linked
            </div>
          `}
        </div>

        <!-- Section 02: Its instances (by environment) -->
        <div class="project-section-title">
          <span>02 Its instances (by environment)</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${envsHtml || `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              No instances linked to this project
            </div>
          `}
        </div>

        <!-- Section 03: Its apps -->
        <div class="project-section-title">
          <span>03 Its apps</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${projectApps.map(app => {
            let appHealthColor = 'var(--cyber-green)';
            let appHealthLabel = 'Healthy';
            const activeAlerts = alertsLog.filter(a => a.serverName === app.instanceName && a.status !== 'resolved');
            if (activeAlerts.some(a => a.severity === 'critical')) {
              appHealthColor = '#ef4444';
              appHealthLabel = 'Warning';
            } else if (activeAlerts.some(a => a.severity === 'warning')) {
              appHealthColor = '#f97316';
              appHealthLabel = 'Warning';
            }

            return `
              <div class="project-nested-row" style="cursor: default;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${app.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;">
                      1 instance · 1 server
                    </div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${appHealthColor};"></span>
                  <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${appHealthLabel}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Section 04: Databases -->
        <div class="project-section-title">
          <span>04 Databases <span style="font-size:0.65rem; color:var(--text-muted); font-weight:normal; margin-left:0.25rem;">NAME-MATCHED · ADMIN-CURATED</span></span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${projectDatabases.length === 0 ? `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              No databases name-matched to this scope.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${projectDatabases.map(dbName => `
                <div class="project-nested-row" style="cursor: default;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                    </svg>
                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${dbName}</span>
                  </div>
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cyber-green);"></span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Section 05: Domains -->
        <div class="project-section-title">
          <span>05 Domains <span style="font-size:0.65rem; color:var(--text-muted); font-weight:normal; margin-left:0.25rem;">APEX-MATCHED</span></span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${projectDomains.length === 0 ? `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              No domains apex-matched to this scope.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${projectDomains.map(dom => `
                <div class="project-nested-row" style="cursor: default;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${dom.name}</span>
                  </div>
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cyber-green);"></span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Section 06: Issues / Cases -->
        <div class="project-section-title">
          <span>06 Issues / Cases</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${openIncidentsCount === 0 ? `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              🎉 No open cases for this project.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${projectInstances.map(inst => {
                const activeAlerts = alertsLog.filter(a => a.serverName === inst.name && a.status !== 'resolved');
                return activeAlerts.map(a => `
                  <div class="project-nested-row project-incident-row" data-alert-id="${a.id}">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <span style="font-weight: 800; font-size: 0.7rem; color: ${a.severity === 'critical' ? '#ef4444' : '#f97316'}; background: ${a.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)'}; padding: 0.15rem 0.4rem; border-radius: 3px;">
                        ${a.severity.toUpperCase()}
                      </span>
                      <div>
                        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${a.serverName}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">CPU exceeded ${a.cpuValue}% threshold</div>
                      </div>
                    </div>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">${a.timeShort}</span>
                  </div>
                `).join('');
              }).join('')}
            </div>
          `}
        </div>

        <!-- Section 07: Unhealthy now -->
        <div class="project-section-title">
          <span>07 Unhealthy now <span style="font-size:0.65rem; color:var(--text-muted); font-weight:normal; margin-left:0.25rem;">TOPOLOGY-STATUS-DERIVED</span></span>
        </div>
        <div>
          ${unhealthyTopologyItems.length === 0 ? `
            <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              All items healthy.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${unhealthyTopologyItems.map(item => `
                <div class="project-nested-row" style="cursor: default;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--text-muted);">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                      <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${item.name}</div>
                      <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">${item.type}</div>
                    </div>
                  </div>
                  <span style="font-size: 0.72rem; color: ${item.color}; font-family: var(--font-mono); font-weight: bold; background: ${item.color}15; border: 1px solid ${item.color}25; padding: 0.15rem 0.4rem; border-radius: 4px;">
                    ${item.status}
                  </span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Wire up events
    wrapper.querySelectorAll('.project-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeProjectId = btn.getAttribute('data-project-id');
        renderProjectPage();
      });
    });

    const searchInput = wrapper.querySelector('#project-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        projectSearchQuery = e.target.value;
        renderProjectPage();
        const updatedSearch = wrapper.querySelector('#project-search-input');
        if (updatedSearch) {
          updatedSearch.focus();
          updatedSearch.setSelectionRange(e.target.value.length, e.target.value.length);
        }
      });
    }

    wrapper.querySelectorAll('.navigate-client-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeClientId = btn.getAttribute('data-client-id');
        const cliLink = Array.from(document.querySelectorAll('.nav-menu .nav-item')).find(l => l.getAttribute('href') === '#client');
        if (cliLink) cliLink.click();
      });
    });

    wrapper.querySelectorAll('.project-instance-row').forEach(row => {
      row.addEventListener('click', () => {
        const instName = row.getAttribute('data-instance-name');
        const node = telemetryData.find(n => n.name === instName) || { name: instName, cpu: 50 };
        openDetailsSidebar(node, false);
      });
    });

    wrapper.querySelectorAll('.project-incident-row').forEach(row => {
      row.addEventListener('click', () => {
        const alertId = row.getAttribute('data-alert-id');
        const alert = alertsLog.find(a => a.id === alertId);
        if (alert) openDetailsSidebar(alert, true);
      });
    });
  }

  // -------------------------------------------------------------
  // RUNS PAGE (REMEDIATION ENGINE) DYNAMIC WORKSPACE
  // -------------------------------------------------------------
  let runsHistory = [
    {
      id: "RUN-2191",
      time: "2026-07-21 12:39:04",
      target: "pro-prod",
      script: `# Apply temporary firewall block\nBAD_IP="185.220.101.42"\necho "[INFO] Blocking inbound TCP requests from $BAD_IP..."\nsudo iptables -I INPUT -s $BAD_IP -j DROP\necho "[SUCCESS] Firewall rules successfully synchronized."`,
      status: "completed",
      operator: "pranav-admin",
      output: `[SYSTEM] Uplink remediation shell framework initialized.\n[SYSTEM] Target: pro-prod (Linux 5.15.0-88-generic x86_64)\n[INFO] Connecting to node pro-prod via secure SSH agent...\n[INFO] Executing script payload: Apply temporary firewall block\nBAD_IP="185.220.101.42"\n[INFO] Blocking inbound TCP requests from 185.220.101.42...\nSynchronizing network firewall access table...\nAdded rule: DROP all inbound packets from source IP 185.220.101.42\nFirewall sync complete. 1 active drop rule applied.\n[SUCCESS] Firewall rules successfully synchronized.\n[SUCCESS] Script execution terminated with status code 0.`
    },
    {
      id: "RUN-9824",
      time: "2026-07-20 10:15:30",
      target: "afms-prod",
      script: `# Restart service\nsudo systemctl restart afms-main\nsudo systemctl status afms-main --no-pager`,
      status: "completed",
      operator: "secops-bot",
      output: `[SYSTEM] Uplink remediation shell framework initialized.\n[SYSTEM] Target: afms-prod (Linux 5.15.0-88-generic x86_64)\n[INFO] Connecting to node afms-prod...\n[INFO] Stopping service daemon afms-main...\n[INFO] Starting service daemon afms-main...\n● afms-main.service - Main Application Service\n   Loaded: loaded (/etc/systemd/system/afms-main.service; enabled)\n   Active: active (running) since Mon 2026-07-20 10:15:31 UTC; 0s ago\n   Process: 41022 ExecStart=/usr/bin/python3 /app/server.py (code=exited, status=0/SUCCESS)\n[SUCCESS] Service afms-main successfully restarted.`
    },
    {
      id: "RUN-9823",
      time: "2026-07-20 09:44:12",
      target: "linux-bastion-ssh",
      script: `# Firewall block\nsudo iptables -A INPUT -s 185.220.101.42 -j DROP\nsudo iptables -L -n`,
      status: "completed",
      operator: "secops-bot",
      output: `[SYSTEM] Target: linux-bastion-ssh\n[INFO] Applying iptables drop rule for 185.220.101.42...\nChain INPUT (policy ACCEPT)\ntarget     prot opt source               destination         \nDROP       all  --  185.220.101.42       0.0.0.0/0           \n[SUCCESS] Firewall drop rule applied successfully.`
    },
    {
      id: "RUN-9822",
      time: "2026-07-20 08:30:05",
      target: "db-mysql-primary",
      script: `# DB log cleanup\nmysql -e 'PURGE BINARY LOGS BEFORE NOW();'`,
      status: "completed",
      operator: "pranav-admin",
      output: `[SYSTEM] Target: db-mysql-primary\n[INFO] Executing MySQL log purge command...\nConnecting to MySQL instance localhost:3306...\nQuery OK, 0 rows affected (0.04 sec)\n[SUCCESS] Binary logs purged. Disk space freed: 4.2 GB.`
    }
  ];

  function renderRunHistoryRowHtml(run) {
    const statusColor = run.status === 'completed' ? 'var(--cyber-green)' : '#ef4444';
    const firstLine = run.script ? run.script.split('\n')[0].replace('#', '').trim() : 'Command script';
    return `
      <tr class="runs-history-row" data-run-id="${run.id}" style="cursor: pointer;" title="Click to view input command and output log">
        <td style="font-family: var(--font-mono); color: var(--cyber-cyan); font-weight: bold;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
            <span>${run.id}</span>
            <button class="run-magnifier-btn" data-run-id="${run.id}" title="View details for ${run.id}">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </td>
        <td style="color: var(--text-muted); font-size: 0.75rem;">${run.time}</td>
        <td style="font-weight: bold;">${run.target}</td>
        <td>
          <code style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 0.15rem 0.35rem; border-radius: 3px;">
            ${firstLine}
          </code>
        </td>
        <td>
          <span style="font-size: 0.72rem; color: ${statusColor}; font-family: var(--font-mono); font-weight: bold; background: ${statusColor}10; border: 1px solid ${statusColor}20; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase;">
            ${run.status}
          </span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${run.operator}</td>
      </tr>
    `;
  }

  function bindRunsHistoryRowHandlers(wrapper) {
    if (!wrapper) return;
    wrapper.querySelectorAll('.runs-history-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const runId = row.getAttribute('data-run-id');
        if (runId) openRunDetailsDrawer(runId);
      });
    });
  }

  // Global click delegation for runs history table rows
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.runs-history-row');
    if (row) {
      const runId = row.getAttribute('data-run-id');
      if (runId) {
        openRunDetailsDrawer(runId);
      }
    }
  });

  function openRunDetailsDrawer(runId) {
    const run = runsHistory.find(r => r.id === runId);
    if (!run) return;

    const drawer = document.getElementById('run-details-drawer');
    if (!drawer) return;

    const titleVal = document.getElementById('run-drawer-title-val');
    const statusVal = document.getElementById('run-drawer-status');
    const targetVal = document.getElementById('run-drawer-target');
    const timeVal = document.getElementById('run-drawer-time');
    const operatorVal = document.getElementById('run-drawer-operator');
    const scriptVal = document.getElementById('run-drawer-script');
    const outputVal = document.getElementById('run-drawer-output');

    if (titleVal) titleVal.textContent = run.id;
    if (statusVal) {
      const isCompleted = run.status === 'completed';
      const color = isCompleted ? 'var(--cyber-green)' : '#ef4444';
      statusVal.innerHTML = `<span style="color: ${color}; background: ${color}15; border: 1px solid ${color}30; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase;">${run.status}</span>`;
    }
    if (targetVal) targetVal.textContent = run.target;
    if (timeVal) timeVal.textContent = run.time;
    if (operatorVal) operatorVal.textContent = run.operator;
    if (scriptVal) scriptVal.textContent = run.script || '# No script recorded';
    
    if (outputVal) {
      const logText = run.output || `[SYSTEM] Log stream captured for ${run.id}\n[INFO] Target: ${run.target}\n[SUCCESS] Execution finished successfully.`;
      outputVal.innerHTML = logText.split('\n').map(line => {
        let cls = '';
        if (line.includes('[SUCCESS]')) cls = 'success';
        else if (line.includes('[INFO]')) cls = 'info';
        else if (line.includes('[ERROR]')) cls = 'error';
        else if (line.includes('[WARNING]')) cls = 'warning';
        return `<div class="terminal-line ${cls}">${escapeHtml(line)}</div>`;
      }).join('');
    }

    drawer.classList.add('active');
  }

  let activeRemediationAlertId = null;
  let isExecutingRun = false;

  const runTemplates = {
    restart: `# Restart Systemd Service
echo "[INFO] Connecting to systemd manager..."
sudo systemctl restart nginx
echo "[INFO] Verification: checking service status..."
sudo systemctl status nginx --no-pager
echo "[SUCCESS] Service successfully restarted."`,

    cleanup: `# Clean logs on high disk usage
echo "[INFO] Scanning directory /var/log/nginx..."
sudo find /var/log/nginx/ -type f -name "*.log.*" -mtime +3 -delete
echo "[INFO] Releasing disk descriptors..."
sudo systemctl reload nginx
echo "[SUCCESS] Free disk capacity reclaimed."`,

    firewall: `# Apply temporary firewall block
BAD_IP="185.220.101.42"
echo "[INFO] Blocking inbound TCP requests from $BAD_IP..."
sudo iptables -I INPUT -s $BAD_IP -j DROP
echo "[SUCCESS] Firewall rules successfully synchronized."`,

    custom: `# Type custom shell script commands here...
echo "Running custom operations on node..."
hostname
uname -a
echo "[SUCCESS] Task completed."`
  };

  function renderRunsPage() {
    const wrapper = document.getElementById('runs-view-wrapper');
    if (!wrapper) return;

    // Get active alerts for remediation context (Only Critical severity alerts)
    const activeRemediationAlerts = alertsLog.filter(a => a.status !== 'resolved' && a.severity === 'critical');

    // Get list of targets for dropdown (confirmed instances)
    const confirmedInstances = instancesData.filter(inst => inst.accepted);

    // Build Target select options
    let targetOptions = '<option value="">-- select target node --</option>';
    confirmedInstances.forEach(inst => {
      targetOptions += `<option value="${inst.name}">${inst.name} (${inst.env})</option>`;
    });
    if (confirmedInstances.length === 0) {
      // Fallback to active alerts servers if onboarding isn't committed yet
      const alertServers = Array.from(new Set(alertsLog.map(a => a.serverName)));
      alertServers.forEach(srv => {
        targetOptions += `<option value="${srv}">${srv} (alerting)</option>`;
      });
    }

    // Build Active Alerts Remediation List HTML
    let alertsHtml = '';
    if (activeRemediationAlerts.length === 0) {
      alertsHtml = `
        <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          <span style="font-size: 1.25rem; display: block; margin-bottom: 0.4rem;">🎉</span>
          No active critical alerts requiring remediation.
        </div>
      `;
    } else {
      alertsHtml = activeRemediationAlerts.map(a => {
        const severityClass = 'critical';
        const recommendedScript = 'firewall';
        const alertReasonText = a.reason || a.text || `CPU utilization on ${a.serverName} exceeded critical threshold.`;
        return `
          <div class="remediation-card ${severityClass}" data-alert-id="${a.id}" data-recommended="${recommendedScript}" data-target-node="${a.serverName}">
            <div>
              <span style="font-weight: 800; font-size: 0.65rem; color: #ef4444; background: rgba(239,68,68,0.1); padding: 0.1rem 0.35rem; border-radius: 2px; margin-right: 0.5rem; text-transform: uppercase;">
                CRITICAL
              </span>
              <strong style="color: var(--text-primary); font-size: 0.82rem;">${a.serverName}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">${alertReasonText}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; position: relative;">
              <button class="runs-load-btn" style="background: none; border: 1px solid rgba(0, 242, 254, 0.2); color: var(--cyber-cyan); font-size: 0.7rem; font-weight: bold; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                Load Remediation
              </button>
              <div class="runs-dots-wrapper" style="position: relative;">
                <button class="runs-dots-btn" style="background: none; border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 0.85rem; padding: 0; line-height: 1;">
                  &#8942;
                </button>
                <div class="runs-dropdown hidden" style="position: absolute; right: 0; top: 28px; background: #0a0f1d; border: 1px solid var(--border-cyber); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); z-index: 99; width: 110px; padding: 0.2rem 0;">
                  <div class="runs-view-details-btn" style="padding: 0.4rem 0.75rem; font-size: 0.72rem; color: var(--text-secondary); cursor: pointer; text-align: left; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='var(--text-primary)';" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';">
                    View Details
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Build Runs History Table rows
    const historyRows = runsHistory.map(run => renderRunHistoryRowHtml(run)).join('');

    wrapper.innerHTML = `
      <div style="padding: 1.5rem 0;">
        <!-- Banner Title -->
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.65rem;">
              <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #fb8500; filter: drop-shadow(0 0 6px rgba(251, 133, 0, 0.45));">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              Remediation & Runs
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Execute shell scripts and deploy automation scripts directly to target nodes to resolve active telemetry and security alerts.</p>
          </div>
          <div style="background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.15); border-radius: 6px; padding: 0.4rem 0.8rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyber-cyan);">
            UPLINK RUN ENGINE v1.2.0 · STATUS: ONLINE
          </div>
        </div>

        <div class="runs-grid">
          <!-- Left Column: Quick Remediation + Editor -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Suggested Actions -->
            <div class="runs-card">
              <h2 id="runs-suggested-header-title" style="font-size: 0.9rem; font-family: var(--font-mono); color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" style="color: #f97316;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
                Suggested Remediations (${activeRemediationAlerts.length})
              </h2>
              <div class="runs-quick-remediations">
                ${alertsHtml}
              </div>
            </div>

            <!-- Workspace Console -->
            <div class="runs-card">
              <h2 style="font-size: 0.9rem; font-family: var(--font-mono); color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" style="color: var(--cyber-cyan);">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Execution Console
              </h2>

              <!-- Select template + target node -->
              <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="flex: 1;">
                  <label style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); display: block; margin-bottom: 0.25rem; text-transform: uppercase;">Script Template</label>
                  <select id="runs-template-select" class="cyber-modal-select" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.2); border: 1px solid var(--border-cyber); border-radius: 4px; padding: 0.4rem; color: var(--text-primary); font-size: 0.78rem;">
                    <option value="custom">Custom Script Command</option>
                    <option value="restart">Systemd: Restart Service</option>
                    <option value="cleanup">Disk: Purge old log files</option>
                    <option value="firewall">Network: Block Host IP Address</option>
                  </select>
                </div>
                <div style="flex: 1;">
                  <label style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); display: block; margin-bottom: 0.25rem; text-transform: uppercase;">Target Node</label>
                  <select id="runs-target-select" class="cyber-modal-select" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.2); border: 1px solid var(--border-cyber); border-radius: 4px; padding: 0.4rem; color: var(--text-primary); font-size: 0.78rem;">
                    ${targetOptions}
                  </select>
                </div>
              </div>

              <!-- Editor container -->
              <div class="runs-editor-container">
                <div class="runs-editor-header">
                  <span>bash_remediation.sh</span>
                  <span id="runs-active-context" style="color: #fbbf24; font-weight: bold;"></span>
                </div>
                <textarea id="runs-script-editor" class="runs-textarea" placeholder="# Write shell script commands here..."></textarea>
              </div>

              <!-- Execution controls -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <button id="runs-upload-btn" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); font-size: 0.72rem; font-weight: 700; padding: 0.45rem 0.8rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.35rem;">
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload Script File
                  </button>
                  <input type="file" id="runs-file-input" accept=".sh,.txt,.bash,.py,.js,.json,.yaml,.yml,.log,.conf,.cfg,.env,text/plain" style="display: none;">
                </div>
                <button id="runs-execute-btn" style="background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); color: var(--cyber-cyan); font-size: 0.75rem; font-weight: 800; padding: 0.5rem 1.25rem; border-radius: 4px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 0 10px rgba(0, 242, 254, 0.15);">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="currentColor" style="opacity: 0.8;">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Execute Remediation</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Terminal -->
          <div class="runs-terminal">
            <div class="runs-terminal-header">
              <div class="runs-terminal-dots">
                <span class="runs-terminal-dot" style="background: #ef4444;"></span>
                <span class="runs-terminal-dot" style="background: #eab308;"></span>
                <span class="runs-terminal-dot" style="background: #22c55e;"></span>
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">stdout / stderr logs</span>
            </div>
            <div class="runs-terminal-screen" id="runs-terminal-log">
              <div class="terminal-line info">[SYSTEM] Uplink remediation shell framework initialized.</div>
              <div class="terminal-line info">[SYSTEM] Awaiting target node designation and commands.</div>
              <div class="terminal-line"><span class="terminal-cursor"></span></div>
            </div>
          </div>
        </div>

        <!-- History Log Section -->
        <div class="runs-card" style="margin-top: 1.5rem;">
          <h2 style="font-size: 0.9rem; font-family: var(--font-mono); color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">
            Execution Logs & Runs History
          </h2>
          <div style="overflow-x: auto;">
            <table class="runs-history-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Timestamp</th>
                  <th>Target Node</th>
                  <th>Command / Script</th>
                  <th>Status</th>
                  <th>Operator</th>
                </tr>
              </thead>
              <tbody id="runs-history-tbody">
                ${historyRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Initialize custom script value in editor
    const editor = wrapper.querySelector('#runs-script-editor');
    const templateSelect = wrapper.querySelector('#runs-template-select');
    const targetSelect = wrapper.querySelector('#runs-target-select');
    const contextLabel = wrapper.querySelector('#runs-active-context');

    if (editor) {
      editor.value = runTemplates[templateSelect.value];
    }

    // Template change handler
    if (templateSelect && editor) {
      templateSelect.addEventListener('change', () => {
        editor.value = runTemplates[templateSelect.value];
        activeRemediationAlertId = null;
        if (contextLabel) contextLabel.textContent = '';
      });
    }

    // Quick remediation click handlers
    wrapper.querySelectorAll('.remediation-card').forEach(card => {
      const alertId = card.getAttribute('data-alert-id');
      const recommended = card.getAttribute('data-recommended');
      const targetNode = card.getAttribute('data-target-node');
      const alert = alertsLog.find(a => a.id === alertId);

      const loadRemediationContext = () => {
        activeRemediationAlertId = alertId;
        if (templateSelect) templateSelect.value = recommended;
        if (targetSelect) targetSelect.value = targetNode;
        if (editor) editor.value = runTemplates[recommended];
        if (contextLabel) contextLabel.textContent = `[TARGET ALERT ID: ${alertId}]`;
        showToast(`Remediation template loaded for ${targetNode}.`);
      };

      // Card click
      card.addEventListener('click', () => {
        loadRemediationContext();
      });

      // Load Button click
      const loadBtn = card.querySelector('.runs-load-btn');
      if (loadBtn) {
        loadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          loadRemediationContext();
        });
      }

      // Three dots toggle dropdown
      const dotsBtn = card.querySelector('.runs-dots-btn');
      const dropdown = card.querySelector('.runs-dropdown');
      if (dotsBtn && dropdown) {
        dotsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Close other open runs dropdowns first
          wrapper.querySelectorAll('.runs-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.add('hidden');
          });
          dropdown.classList.toggle('hidden');
        });
      }

      // View details option
      const viewDetailsBtn = card.querySelector('.runs-view-details-btn');
      if (viewDetailsBtn && alert) {
        viewDetailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.add('hidden');
          openDetailsSidebar(alert, true);
        });
      }
    });

    // Close runs dropdowns on document click
    document.addEventListener('click', () => {
      wrapper.querySelectorAll('.runs-dropdown').forEach(d => d.classList.add('hidden'));
    });

    // Upload script file trigger (strictly text script files only)
    const uploadBtn = wrapper.querySelector('#runs-upload-btn');
    const fileInput = wrapper.querySelector('#runs-file-input');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedExtensions = ['sh', 'txt', 'bash', 'py', 'js', 'json', 'yaml', 'yml', 'log', 'conf', 'cfg', 'env'];
        const fileNameParts = file.name.split('.');
        const ext = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : '';
        const isTextMime = file.type.startsWith('text/') || file.type === 'application/json' || file.type === 'application/x-sh' || file.type === 'application/x-bash';

        // Check 1: Extension & MIME type check
        if (!allowedExtensions.includes(ext) && !isTextMime) {
          showToast(`Upload rejected: "${file.name}" is not a text script file. Only text script files (.sh, .txt, .py, etc.) are allowed.`, false);
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;

          // Check 2: Binary content safety check (null bytes or binary signatures like PNG/ELF/PDF/ZIP)
          if (content.includes('\0') || /^\x89PNG|^GIF8|^\x7fELF|^%PDF|^PK\x03\x04/.test(content)) {
            showToast(`Upload rejected: "${file.name}" contains binary data. Please upload a plain text script file.`, false);
            fileInput.value = '';
            return;
          }

          if (editor) {
            editor.value = content;
            if (templateSelect) templateSelect.value = 'custom';
            if (contextLabel) contextLabel.textContent = '';
            activeRemediationAlertId = null;
            showToast(`Uploaded script: ${file.name}`, true);
          }
        };
        reader.readAsText(file);
      });
    }

    // Execute run script
    const executeBtn = wrapper.querySelector('#runs-execute-btn');
    const terminalScreen = wrapper.querySelector('#runs-terminal-log');
    if (executeBtn && terminalScreen) {
      executeBtn.addEventListener('click', () => {
        if (isExecutingRun) return;

        const targetNode = targetSelect.value;
        if (!targetNode) {
          showToast("Execution aborted: Select a target node first.", false);
          return;
        }

        const scriptContent = editor.value.trim();
        if (!scriptContent) {
          showToast("Execution aborted: Script commands cannot be empty.", false);
          return;
        }

        isExecutingRun = true;
        executeBtn.disabled = true;
        executeBtn.style.opacity = '0.5';
        executeBtn.querySelector('span').textContent = 'Running...';

        // Clear terminal screen and start execution logs
        terminalScreen.innerHTML = `
          <div class="terminal-line input">[secops-bot@uplink-host ~]$ bash /tmp/remediation_run.sh</div>
          <div class="terminal-line info">[INFO] Establishing SSH connection to target node: [${targetNode}]...</div>
        `;
        terminalScreen.scrollTop = terminalScreen.scrollHeight;

        setTimeout(() => {
          appendTerminalLine(terminalScreen, `[INFO] Exchanging cryptographic certificates...`, 'info');
        }, 400);

        setTimeout(() => {
          appendTerminalLine(terminalScreen, `[INFO] Authenticated operator (pranav-admin) via private key.`, 'info');
          appendTerminalLine(terminalScreen, `[INFO] Execution environment: bash shell version 5.1.16`, 'info');
        }, 800);

        // Scan script lines and print executing lines
        const lines = scriptContent.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#'));
        let lineDelay = 1200;
        lines.forEach(line => {
          setTimeout(() => {
            appendTerminalLine(terminalScreen, `> ${line}`, 'input');
          }, lineDelay);
          lineDelay += 350;
        });

        // Append final results based on script template
        setTimeout(() => {
          const selectedTemplate = templateSelect.value;
          if (selectedTemplate === 'restart') {
            appendTerminalLine(terminalScreen, `Stopping service daemon nginx...`, 'normal');
            appendTerminalLine(terminalScreen, `Starting service daemon nginx...`, 'normal');
            appendTerminalLine(terminalScreen, `nginx.service - A high performance web server`, 'normal');
            appendTerminalLine(terminalScreen, `   Active: active (running) since Mon 2026-07-20 12:08:42 UTC; 0s ago`, 'success');
          } else if (selectedTemplate === 'cleanup') {
            appendTerminalLine(terminalScreen, `Scanning /var/log/nginx/ directory...`, 'normal');
            appendTerminalLine(terminalScreen, `Deleted rotated log access.log.3.gz (8.4 MB)`, 'success');
            appendTerminalLine(terminalScreen, `Deleted rotated log access.log.4.gz (12.1 MB)`, 'success');
            appendTerminalLine(terminalScreen, `Reloaded nginx configurations. Descriptors refreshed.`, 'success');
          } else if (selectedTemplate === 'firewall') {
            appendTerminalLine(terminalScreen, `Synchronizing network firewall access table...`, 'normal');
            appendTerminalLine(terminalScreen, `Added rule: DROP all inbound packets from source IP 185.220.101.42`, 'success');
            appendTerminalLine(terminalScreen, `Firewall sync complete. 1 active drop rule applied.`, 'success');
          } else {
            appendTerminalLine(terminalScreen, `Running custom operations on node...`, 'normal');
            appendTerminalLine(terminalScreen, `Host identifier: ${targetNode}`, 'normal');
            appendTerminalLine(terminalScreen, `OS Kernel: Linux 5.15.0-88-generic x86_64`, 'normal');
          }
        }, lineDelay + 200);

        setTimeout(() => {
          appendTerminalLine(terminalScreen, `[SUCCESS] Script execution terminated with status code 0.`, 'success');
          terminalScreen.innerHTML += `<div class="terminal-line"><span class="terminal-cursor"></span></div>`;
          terminalScreen.scrollTop = terminalScreen.scrollHeight;

          // Add execution record to history log with CURRENT LOCAL TIMESTAMP
          const newRunId = `RUN-${Math.floor(1000 + Math.random() * 9000)}`;
          const now = new Date();
          const YYYY = now.getFullYear();
          const MM = String(now.getMonth() + 1).padStart(2, '0');
          const DD = String(now.getDate()).padStart(2, '0');
          const hh = String(now.getHours()).padStart(2, '0');
          const mm = String(now.getMinutes()).padStart(2, '0');
          const ss = String(now.getSeconds()).padStart(2, '0');
          const timeStr = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;

          const outputLogText = terminalScreen ? terminalScreen.innerText.replace(/[\r\n]+\s*[\r\n]+/g, '\n').trim() : '';

          runsHistory.unshift({
            id: newRunId,
            time: timeStr,
            target: targetNode,
            script: scriptContent,
            status: "completed",
            operator: "pranav-admin",
            output: outputLogText
          });

          // Resolve active alert associated with this run or target node
          let resolvedCount = 0;
          alertsLog.forEach(a => {
            if (a.status !== 'resolved') {
              if (activeRemediationAlertId && a.id === activeRemediationAlertId) {
                a.status = 'resolved';
                resolvedCount++;
              } else if (a.serverName === targetNode) {
                a.status = 'resolved';
                resolvedCount++;
              }
            }
          });

          // Fallback: If no alert directly matched targetNode, resolve the top active critical alert
          if (resolvedCount === 0) {
            const topAlert = alertsLog.find(a => a.status !== 'resolved' && a.severity === 'critical');
            if (topAlert) {
              topAlert.status = 'resolved';
              resolvedCount++;
            }
          }

          if (resolvedCount > 0) {
            showToast(`Remediation executed successfully! Active alert cleared.`, true);
            updateBellBadge();
            if (window.renderPulsePage) renderPulsePage();
            if (window.renderInventoryPage) renderInventoryPage();
          }
          activeRemediationAlertId = null;

          // Reset execution button state immediately back to idle
          isExecutingRun = false;
          executeBtn.disabled = false;
          executeBtn.style.opacity = '1';
          executeBtn.style.background = 'rgba(0, 242, 254, 0.1)';
          executeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="currentColor" style="opacity: 0.8;">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Execute Remediation</span>
          `;

          // Clear active context badge in editor
          const activeContextLabel = wrapper.querySelector('#runs-active-context');
          if (activeContextLabel) activeContextLabel.textContent = '';

          // Live refresh Suggested Remediations list & Runs History table without wiping terminal
          updateRunsPageLiveViews();
        }, lineDelay + 800);
      });
    }

    // Bind click handlers to runs history table rows
    bindRunsHistoryRowHandlers(wrapper);
  }

  function updateRunsPageLiveViews() {
    const wrapper = document.getElementById('runs-view-wrapper');
    if (!wrapper) return;

    const activeRemediationAlerts = alertsLog.filter(a => a.status !== 'resolved' && a.severity === 'critical');
    
    // Update header count
    const headerTitle = wrapper.querySelector('#runs-suggested-header-title');
    if (headerTitle) {
      headerTitle.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" style="color: #f97316;">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
        Suggested Remediations (${activeRemediationAlerts.length})
      `;
    }

    // Update Suggested Remediations list HTML
    const quickRemediationsContainer = wrapper.querySelector('.runs-quick-remediations');
    if (quickRemediationsContainer) {
      if (activeRemediationAlerts.length === 0) {
        quickRemediationsContainer.innerHTML = `
          <div style="background: rgba(255,255,255,0.01); border: 1px dashed var(--border-cyber); border-radius: 8px; padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
            <span style="font-size: 1.25rem; display: block; margin-bottom: 0.4rem;">🎉</span>
            No active critical alerts requiring remediation.
          </div>
        `;
      } else {
        quickRemediationsContainer.innerHTML = activeRemediationAlerts.map(a => {
          const alertReasonText = a.reason || a.text || `CPU utilization on ${a.serverName} exceeded critical threshold.`;
          return `
            <div class="remediation-card critical" data-alert-id="${a.id}" data-recommended="firewall" data-target-node="${a.serverName}">
              <div>
                <span style="font-weight: 800; font-size: 0.65rem; color: #ef4444; background: rgba(239,68,68,0.1); padding: 0.1rem 0.35rem; border-radius: 2px; margin-right: 0.5rem; text-transform: uppercase;">
                  CRITICAL
                </span>
                <strong style="color: var(--text-primary); font-size: 0.82rem;">${a.serverName}</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">${alertReasonText}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem; position: relative;">
                <button class="runs-load-btn" style="background: none; border: 1px solid rgba(0, 242, 254, 0.2); color: var(--cyber-cyan); font-size: 0.7rem; font-weight: bold; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                  Load Remediation
                </button>
                <div class="runs-dots-wrapper" style="position: relative;">
                  <button class="runs-dots-btn" style="background: none; border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; font-size: 0.85rem; padding: 0; line-height: 1;">
                    &#8942;
                  </button>
                  <div class="runs-dropdown hidden" style="position: absolute; right: 0; top: 28px; background: #0a0f1d; border: 1px solid var(--border-cyber); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); z-index: 99; width: 110px; padding: 0.2rem 0;">
                    <div class="runs-view-details-btn" style="padding: 0.4rem 0.75rem; font-size: 0.72rem; color: var(--text-secondary); cursor: pointer; text-align: left; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='var(--text-primary)';" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';">
                      View Details
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Rebind click events to newly created remediation cards
        quickRemediationsContainer.querySelectorAll('.remediation-card').forEach(card => {
          const alertId = card.getAttribute('data-alert-id');
          const recScript = card.getAttribute('data-recommended');
          const targetNode = card.getAttribute('data-target-node');
          const alert = alertsLog.find(a => a.id === alertId);

          const loadRemediationContext = () => {
            const editor = wrapper.querySelector('#runs-script-editor');
            const templateSelect = wrapper.querySelector('#runs-template-select');
            const targetSelect = wrapper.querySelector('#runs-target-select');
            const contextLabel = wrapper.querySelector('#runs-active-context');

            if (targetSelect) {
              const matchingOpt = Array.from(targetSelect.options).find(o => o.value === targetNode);
              if (matchingOpt) {
                targetSelect.value = targetNode;
              } else {
                const newOpt = document.createElement('option');
                newOpt.value = targetNode;
                newOpt.textContent = `${targetNode} (alerting)`;
                targetSelect.appendChild(newOpt);
                targetSelect.value = targetNode;
              }
            }

            if (templateSelect) templateSelect.value = recScript || 'restart';
            if (editor) editor.value = runTemplates[recScript] || runTemplates['restart'];
            if (contextLabel) contextLabel.textContent = `[TARGET ALERT ID: ${alertId}]`;
            activeRemediationAlertId = alertId;
            showToast(`Loaded remediation playbook for target: ${targetNode}`);
          };

          card.addEventListener('click', loadRemediationContext);
          const loadBtn = card.querySelector('.runs-load-btn');
          if (loadBtn) loadBtn.addEventListener('click', (e) => { e.stopPropagation(); loadRemediationContext(); });
        });
      }
    }

    // Update Runs History table rows live with current timestamps
    const historyTbody = wrapper.querySelector('#runs-history-tbody');
    if (historyTbody) {
      historyTbody.innerHTML = runsHistory.map(run => renderRunHistoryRowHtml(run)).join('');
      bindRunsHistoryRowHandlers(historyTbody);
    }
  }

  function appendTerminalLine(terminalScreen, text, type) {
    const cursor = terminalScreen.querySelector('.terminal-cursor');
    if (cursor) {
      const cursorLine = cursor.closest('.terminal-line');
      if (cursorLine) cursorLine.remove();
    }

    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    terminalScreen.appendChild(line);

    const cursorLine = document.createElement('div');
    cursorLine.className = 'terminal-line';
    cursorLine.innerHTML = `<span class="terminal-cursor"></span>`;
    terminalScreen.appendChild(cursorLine);

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  window.renderClientPage = renderClientPage;
  window.renderProjectPage = renderProjectPage;
  window.renderRunsPage = renderRunsPage;

  // Profile Name Edit & Header Synchronization Logic
  const editProfileNameBtn = document.getElementById('edit-profile-name-btn');
  const saveProfileNameBtn = document.getElementById('save-profile-name-btn');
  const cancelProfileNameBtn = document.getElementById('cancel-profile-name-btn');
  const nameDisplayGroup = document.getElementById('name-display-group');
  const nameEditGroup = document.getElementById('name-edit-group');
  const nameEditInput = document.getElementById('name-edit-input');

  const settingsProfileFullname = document.getElementById('settings-profile-fullname');
  const settingsTableNameVal = document.getElementById('settings-table-name-val');
  const headerUserFullname = document.getElementById('header-user-fullname');
  const headerAvatarBadge = document.getElementById('header-avatar-badge');
  const profileAvatarLarge = document.querySelector('.profile-avatar-large');

  function sanitizeAndFormatName(val) {
    if (!val) return '';
    // 1. Strip everything except alphabetic letters and spaces
    let cleaned = val.replace(/[^a-zA-Z ]/g, '');

    // 2. Allow at most 1 space
    const parts = cleaned.split(' ');
    if (parts.length > 2) {
      cleaned = parts[0] + ' ' + parts.slice(1).join('');
    }

    // 3. Format Title Case for each word
    return cleaned.split(' ').map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  function getInitials(name) {
    if (!name) return "P";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "P";
    return words.map(w => w[0].toUpperCase()).join('');
  }

  if (nameEditInput) {
    nameEditInput.addEventListener('keydown', (e) => {
      // Allow navigation and edit control keys
      if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) || e.ctrlKey || e.metaKey) {
        return;
      }

      // Block second space
      if (e.key === ' ' && nameEditInput.value.includes(' ')) {
        e.preventDefault();
        showToast("Only one space is allowed in the name.", false);
        return;
      }

      // Block numbers and special characters
      if (!/^[a-zA-Z ]$/.test(e.key)) {
        e.preventDefault();
        showToast("Only letters and a single space are allowed in the name.", false);
        return;
      }
    });

    nameEditInput.addEventListener('input', () => {
      const formatted = sanitizeAndFormatName(nameEditInput.value);
      if (formatted !== nameEditInput.value) {
        nameEditInput.value = formatted;
      }
    });
  }

  if (editProfileNameBtn && saveProfileNameBtn && cancelProfileNameBtn) {
    editProfileNameBtn.addEventListener('click', () => {
      if (nameDisplayGroup) nameDisplayGroup.style.display = 'none';
      if (nameEditGroup) nameEditGroup.style.display = 'flex';
      if (nameEditInput) {
        nameEditInput.value = settingsProfileFullname ? settingsProfileFullname.textContent.trim() : "Pranav Gupta";
        nameEditInput.focus();
      }
    });

    cancelProfileNameBtn.addEventListener('click', () => {
      if (nameEditGroup) nameEditGroup.style.display = 'none';
      if (nameDisplayGroup) nameDisplayGroup.style.display = 'flex';
    });

    saveProfileNameBtn.addEventListener('click', () => {
      const rawName = nameEditInput ? nameEditInput.value : "";
      const newName = sanitizeAndFormatName(rawName.trim());

      if (!newName) {
        showToast("Name cannot be empty.");
        return;
      }

      const initials = getInitials(newName);

      if (settingsProfileFullname) settingsProfileFullname.textContent = newName;
      if (settingsTableNameVal) settingsTableNameVal.textContent = newName;
      if (headerUserFullname) headerUserFullname.textContent = newName;
      if (headerAvatarBadge) headerAvatarBadge.textContent = initials;
      if (profileAvatarLarge) profileAvatarLarge.textContent = initials;

      // Update operator on existing commits to maintain accountability for current account holder
      commitsHistory.forEach(c => c.operator = newName);
      renderCommitsHistory();

      if (nameEditGroup) nameEditGroup.style.display = 'none';
      if (nameDisplayGroup) nameDisplayGroup.style.display = 'flex';

      showToast(`Account name updated to "${newName}"`, true);
    });
  }

  // SIEM Configuration Edit Modal Handler
  const editSiemConfigTrigger = document.getElementById('edit-siem-config-trigger');
  const editSiemConfigModal = document.getElementById('edit-siem-config-modal');
  const editSiemModalCloseBtn = document.getElementById('edit-siem-modal-close-btn');
  const editSiemModalCancelBtn = document.getElementById('edit-siem-modal-cancel-btn');
  const editSiemModalSaveBtn = document.getElementById('edit-siem-modal-save-btn');
  const addSiemConfigBtn = document.getElementById('add-siem-config-btn');
  const addSourceBtnIntegrations = document.getElementById('add-source-btn-integrations');

  const openSiemModal = () => {
    if (editSiemConfigModal) editSiemConfigModal.classList.add('active');
  };

  const closeSiemModal = () => {
    if (editSiemConfigModal) editSiemConfigModal.classList.remove('active');
  };

  if (editSiemConfigTrigger) editSiemConfigTrigger.addEventListener('click', openSiemModal);
  if (addSiemConfigBtn) addSiemConfigBtn.addEventListener('click', openSiemModal);
  if (editSiemModalCloseBtn) editSiemModalCloseBtn.addEventListener('click', closeSiemModal);
  if (editSiemModalCancelBtn) editSiemModalCancelBtn.addEventListener('click', closeSiemModal);

  if (addSourceBtnIntegrations) {
    addSourceBtnIntegrations.addEventListener('click', () => {
      showToast("Opening Add Data Source wizard...");
      const addSourceTriggerInitial = document.getElementById('add-source-trigger-initial');
      if (addSourceTriggerInitial) addSourceTriggerInitial.click();
    });
  }

  if (editSiemModalSaveBtn) {
    editSiemModalSaveBtn.addEventListener('click', () => {
      const domainsText = document.getElementById('siem-watch-domains')?.value || "";
      const emailsText = document.getElementById('siem-breach-emails')?.value || "";
      const brandText = document.getElementById('siem-brand-terms')?.value || "";

      const domainsCount = domainsText.split('\n').filter(l => l.trim()).length;
      const emailsCount = emailsText.split('\n').filter(l => l.trim()).length;
      const brandCount = brandText.split('\n').filter(l => l.trim()).length;

      const summaryText = document.getElementById('siem-config-summary-text');
      if (summaryText) {
        summaryText.textContent = `${domainsCount} domain(s) · ${emailsCount} email(s) · ${brandCount} brand term(s) · wazuh`;
      }

      closeSiemModal();
      showToast("SIEM configuration saved successfully", true);
    });
  }

  // Available to Connect Pills Handlers
  document.querySelectorAll('.available-source-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const name = pill.textContent.replace('+', '').trim();
      showToast(`Added source requirement: ${name}`, true);
    });
  });

  // Settings: Session & Access sign-out handlers
  document.querySelectorAll('.btn-signout-session').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const user = btn.getAttribute('data-user') || "User";
      const row = btn.closest('[id^="team-session-row-"]');
      if (row) {
        row.style.transition = 'all 0.3s opacity';
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 300);
      }
      showToast(`Revoked active session for ${user}.`, true);
    });
  });

  // Settings: Maintenance mode toggle polling handler
  let pollingPaused = false;
  const togglePollingBtn = document.getElementById('toggle-polling-btn');
  const pollingStatusTitle = document.getElementById('polling-status-title');
  const pollingStatusDesc = document.getElementById('polling-status-desc');

  if (togglePollingBtn) {
    togglePollingBtn.addEventListener('click', () => {
      pollingPaused = !pollingPaused;
      if (pollingPaused) {
        togglePollingBtn.textContent = 'Resume polling';
        togglePollingBtn.style.background = '#10b981';
        if (pollingStatusTitle) pollingStatusTitle.textContent = 'Polling is currently paused';
        if (pollingStatusDesc) pollingStatusDesc.textContent = 'adapter pollers are skipping execution cycles';
        showToast('Polling paused across all system adapters.');
      } else {
        togglePollingBtn.textContent = 'Pause polling';
        togglePollingBtn.style.background = '#e11d48';
        if (pollingStatusTitle) pollingStatusTitle.textContent = 'Polling is running normally';
        if (pollingStatusDesc) pollingStatusDesc.textContent = 'every adapter poller — skips its cycle while enabled';
        showToast('Normal polling resumed across all system adapters.', true);
      }
    });
  }

  // Settings: Danger zone sign out team handler
  const dangerSignoutTeamBtn = document.getElementById('danger-signout-team-btn');
  if (dangerSignoutTeamBtn) {
    dangerSignoutTeamBtn.addEventListener('click', () => {
      showToast('Team sessions revoked. Session sign-out event recorded in audit logs.', true);
    });
  }

  // Initial render of commits history
  renderCommitsHistory();
  initSecurityDashboard();

  /* ==========================================================================
     ENDPOINT AGENTS REAL LOGIC & TELEMETRY MODULE
     ========================================================================== */

  const endpointAgentsData = [
    {
      id: 'agent-1',
      name: 'win-prod-db-01',
      ip: '10.108.4.12',
      os: 'windows',
      status: 'ACTIVE',
      cpu: 12,
      ram: 45,
      lastSeenSec: 0,
      isQuarantined: false,
      isRestarting: false
    },
    {
      id: 'agent-2',
      name: 'linux-api-node-03',
      ip: '10.108.4.15',
      os: 'linux',
      status: 'WARNING',
      cpu: 89,
      ram: 92,
      lastSeenSec: 2,
      isQuarantined: false,
      isRestarting: false
    },
    {
      id: 'agent-3',
      name: 'mac-dev-laptop-77',
      ip: '192.168.1.104',
      os: 'mac',
      status: 'ACTIVE',
      cpu: 4,
      ram: 31,
      lastSeenSec: 60,
      isQuarantined: false,
      isRestarting: false
    },
    {
      id: 'agent-4',
      name: 'win-corp-dc-02',
      ip: '10.108.2.18',
      os: 'windows',
      status: 'ACTIVE',
      cpu: 28,
      ram: 68,
      lastSeenSec: 12,
      isQuarantined: false,
      isRestarting: false
    },
    {
      id: 'agent-5',
      name: 'linux-bastion-ssh',
      ip: '10.100.1.5',
      os: 'linux',
      status: 'ACTIVE',
      cpu: 1,
      ram: 18,
      lastSeenSec: 5,
      isQuarantined: false,
      isRestarting: false
    },
    {
      id: 'agent-6',
      name: 'linux-backup-srv',
      ip: '10.100.8.22',
      os: 'linux',
      status: 'OFFLINE',
      cpu: 0,
      ram: 0,
      lastSeenSec: 7200,
      isQuarantined: false,
      isRestarting: false
    }
  ];

  function formatAgentLastSeen(sec) {
    if (sec < 5) return 'Just now';
    if (sec < 60) return `${sec}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    return `${Math.floor(sec / 3600)}h ago`;
  }

  function getOsIconSvg(os) {
    if (os === 'windows') {
      return `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="color: #94a3b8;"><path d="M0 2.308L6.47 1.42v6.236H0V2.308zm0 11.384l6.47.889V8.347H0v5.345zm7.143 1.008L16 16V8.347H7.143v6.353zM16 0L7.143 1.226V7.656H16V0z"/></svg>`;
    }
    if (os === 'mac') {
      return `<svg width="14" height="14" viewBox="0 0 170 170" fill="currentColor" style="color: #94a3b8;"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.09-3.26-2.62-7.14-7.24-11.64-13.84-6.3-9.23-11.3-19.78-15-31.64-3.7-11.87-5.55-22.95-5.55-33.24 0-14.68 3.66-26.68 10.97-36 7.32-9.33 16.48-14.07 27.48-14.23 4.24 0 9.29 1.14 15.15 3.42 5.86 2.29 9.8 3.44 11.82 3.44 1.74 0 5.8-1.19 12.18-3.57 6.38-2.38 11.66-3.48 15.83-3.3 12.18.66 21.84 5.37 28.98 14.15-10.88 6.58-16.19 15.61-15.93 27.1.27 9.04 3.75 16.57 10.45 22.59 6.7 6.01 14.86 9.4 24.48 10.15-2.28 6.7-5.26 13.39-8.94 20.07zM119.22 31.81c0-7.07 2.58-13.88 7.74-20.43 5.16-6.55 11.66-10.59 19.5-12.13.22 1.31.33 2.45.33 3.43 0 7.03-2.66 13.98-7.98 20.85-5.32 6.87-11.78 10.79-19.38 11.76-.05-1.15-.21-2.31-.21-3.48z"/></svg>`;
    }
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="rgba(255,255,255,0.8)"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="rgba(255,255,255,0.8)" stroke-width="3"/></svg>`;
  }

  function getCpuFillStyle(cpu, isOfflineOrQuarantined) {
    if (isOfflineOrQuarantined) return 'background: #334155;';
    if (cpu >= 75) return 'background: linear-gradient(90deg, #f97316, #f43f5e);';
    return 'background: linear-gradient(90deg, #00f2fe, #10b981);';
  }

  function getRamFillStyle(ram, isOfflineOrQuarantined) {
    if (isOfflineOrQuarantined) return 'background: #334155;';
    if (ram >= 85) return 'background: linear-gradient(90deg, #f97316, #f43f5e);';
    if (ram >= 65) return 'background: linear-gradient(90deg, #eab308, #f97316);';
    return 'background: linear-gradient(90deg, #00f2fe, #10b981);';
  }

  function addWazuhAuditLogMessage(message) {
    const eventsLog = document.getElementById('soc-events-log');
    if (!eventsLog) return;
    const nowStr = new Date().toTimeString().split(' ')[0];
    const logItem = document.createElement('div');
    logItem.className = 'soc-event-item';
    logItem.style.cssText = 'display: flex; gap: 0.75rem; font-size: 0.75rem; padding: 0.4rem 0; border-bottom: 1px dashed rgba(255,255,255,0.05); align-items: center;';
    logItem.innerHTML = `
      <span style="color: var(--cyber-cyan); font-family: var(--font-mono); font-size: 0.7rem;">[${nowStr}]</span>
      <span style="color: var(--text-primary); font-family: var(--font-sans); flex: 1;">${message}</span>
    `;
    eventsLog.prepend(logItem);
  }

  function renderEndpointAgents() {
    const container = document.getElementById('endpoint-agents-list-container');
    const badge = document.getElementById('endpoint-agents-count-badge');
    if (!container) return;

    if (badge) {
      badge.textContent = `${endpointAgentsData.length} REGISTERED AGENTS`;
    }

    container.innerHTML = endpointAgentsData.map(agent => {
      const isOfflineOrQuarantined = agent.status === 'OFFLINE' || agent.isQuarantined;
      let statusClass = agent.status.toLowerCase();
      let statusText = agent.status;

      if (agent.isRestarting) {
        statusClass = 'restarting';
        statusText = 'RESTARTING';
      } else if (agent.isQuarantined) {
        statusClass = 'quarantined';
        statusText = 'QUARANTINED';
      }

      const cpuFill = getCpuFillStyle(agent.cpu, isOfflineOrQuarantined);
      const ramFill = getRamFillStyle(agent.ram, isOfflineOrQuarantined);
      const osSvg = getOsIconSvg(agent.os);

      return `
        <div class="endpoint-agent-row" data-agent-id="${agent.id}">
          <!-- OS Icon & Hostname/IP -->
          <div class="agent-host-col">
            <div class="agent-icon-wrapper">
              ${osSvg}
            </div>
            <div class="agent-name-ip">
              <span class="agent-hostname-text">${agent.name}</span>
              <span class="agent-ip-text">${agent.ip}</span>
            </div>
          </div>

          <!-- Status Badge -->
          <span class="agent-status-badge ${statusClass}">${statusText}</span>

          <!-- CPU Bar -->
          <div class="agent-metric-group">
            <span class="agent-metric-lbl">CPU</span>
            <div class="agent-bar-track">
              <div class="agent-bar-fill" style="width: ${agent.cpu}%; ${cpuFill}"></div>
            </div>
            <span class="agent-metric-val">${agent.cpu}%</span>
          </div>

          <!-- RAM Bar -->
          <div class="agent-metric-group">
            <span class="agent-metric-lbl">RAM</span>
            <div class="agent-bar-track">
              <div class="agent-bar-fill" style="width: ${agent.ram}%; ${ramFill}"></div>
            </div>
            <span class="agent-metric-val">${agent.ram}%</span>
          </div>

          <!-- Last Seen -->
          <span class="agent-last-seen-text">${formatAgentLastSeen(agent.lastSeenSec)}</span>

          <!-- Action Buttons -->
          <div class="agent-actions-group">
            <button class="agent-action-btn btn-restart" data-action="restart" data-agent-id="${agent.id}" ${agent.isRestarting || agent.status === 'OFFLINE' ? 'disabled' : ''}>
              ${agent.isRestarting ? 'Restarting...' : 'Restart'}
            </button>
            <button class="agent-action-btn ${agent.isQuarantined ? 'btn-unquarantine' : 'btn-quarantine'}" data-action="quarantine" data-agent-id="${agent.id}">
              ${agent.isQuarantined ? 'Unquarantine' : 'Quarantine'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Event Delegation for Agent Buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.agent-action-btn');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const agentId = btn.getAttribute('data-agent-id');
    const agent = endpointAgentsData.find(a => a.id === agentId);
    if (!agent) return;

    if (action === 'restart') {
      if (agent.isRestarting) return;
      agent.isRestarting = true;
      agent.status = 'RESTARTING';
      renderEndpointAgents();
      showToast(`Initiating reboot command to agent ${agent.name} (${agent.ip})...`);

      setTimeout(() => {
        agent.isRestarting = false;
        agent.status = 'ACTIVE';
        agent.cpu = Math.floor(Math.random() * 12) + 5;
        agent.ram = Math.floor(Math.random() * 20) + 25;
        agent.lastSeenSec = 0;
        renderEndpointAgents();
        showToast(`[AGENT CONTROL] ${agent.name} (${agent.ip}) successfully rebooted and re-registered.`, true);
        addWazuhAuditLogMessage(`SOAR ACTION: Agent ${agent.name} (${agent.ip}) restarted successfully by operator.`);
      }, 2500);

    } else if (action === 'quarantine') {
      agent.isQuarantined = !agent.isQuarantined;
      if (agent.isQuarantined) {
        agent.prevCpu = agent.cpu;
        agent.prevRam = agent.ram;
        agent.prevStatus = agent.status;
        agent.status = 'QUARANTINED';
        agent.cpu = 0;
        agent.ram = 0;
        agent.lastSeenSec = 0;
        renderEndpointAgents();
        showToast(`[EDR ISOLATION] Host ${agent.name} (${agent.ip}) ISOLATED from network via active response firewall policy.`, false);
        addWazuhAuditLogMessage(`CRITICAL: Endpoint ${agent.name} (${agent.ip}) quarantined & isolated from network.`);
      } else {
        agent.status = (agent.prevCpu > 80 || agent.prevRam > 80) ? 'WARNING' : 'ACTIVE';
        agent.cpu = agent.prevCpu || 15;
        agent.ram = agent.prevRam || 40;
        agent.lastSeenSec = 0;
        renderEndpointAgents();
        showToast(`[EDR ISOLATION] Network isolation REMOVED for ${agent.name} (${agent.ip}). Network interface active.`, true);
        addWazuhAuditLogMessage(`INFO: Network quarantine released for host ${agent.name} (${agent.ip}).`);
      }
    }
  });

  // Dynamic Telemetry Update & Ticker
  setInterval(() => {
    endpointAgentsData.forEach(agent => {
      if (agent.status !== 'OFFLINE' && !agent.isQuarantined && !agent.isRestarting) {
        agent.lastSeenSec += 3;
        
        // Realistic CPU & RAM telemetry fluctuations
        const cpuDelta = Math.floor(Math.random() * 7) - 3;
        agent.cpu = Math.min(98, Math.max(1, agent.cpu + cpuDelta));

        const ramDelta = Math.floor(Math.random() * 3) - 1;
        agent.ram = Math.min(98, Math.max(5, agent.ram + ramDelta));

        // Automatic Warning threshold check
        if (agent.cpu >= 80 || agent.ram >= 85) {
          agent.status = 'WARNING';
        } else if (agent.status === 'WARNING' && agent.cpu < 75 && agent.ram < 80) {
          agent.status = 'ACTIVE';
        }
      } else if (agent.status === 'OFFLINE') {
        agent.lastSeenSec += 3;
      }
    });

    renderEndpointAgents();
  }, 3000);

  // Initial render
  renderEndpointAgents();

  /* ==========================================================================
     15 SOC ENTERPRISE MODULES REAL LOGIC ENGINE
     ========================================================================== */

  const socEnterpriseState = {
    incidents: [
      { id: 'INC-8492', rawCount: 18, asset: 'win-corp-dc-02', ip: '10.108.2.18', tactic: 'Credential Access (T1003)', severity: 'p0', status: 'INVESTIGATING', summary: 'Adversary executed Mimikatz memory dump via obfuscated PowerShell on Domain Controller.', timeline: [
        { time: '17:21:02', title: 'Spearphishing Email Delivered', desc: 'Malicious macro document opened by domain user', crit: false },
        { time: '17:21:15', title: 'Obfuscated PowerShell Execution', desc: 'Encoded script spawned from WINWORD.EXE', crit: true },
        { time: '17:21:30', title: 'LSASS Process Memory Dumped', desc: 'Mimikatz extracted Kerberos & NTLM hashes', crit: true },
        { time: '17:21:44', title: 'Lateral Movement Attempt', desc: 'Outbound SMB connection to win-prod-db-01', crit: true }
      ]},
      { id: 'INC-8491', rawCount: 14, asset: 'linux-api-node-03', ip: '10.108.4.15', tactic: 'Initial Access (T1190)', severity: 'p0', status: 'INVESTIGATING', summary: 'Exploitation of Log4j / Apache Struts vulnerability targeting public API Gateway node.', timeline: [
        { time: '16:50:10', title: 'JNDI Exploit String Received', desc: 'HTTP request headers contained ldap:// malicious payload', crit: true },
        { time: '16:50:22', title: 'Reverse Shell Spawned', desc: 'Outbound TCP connection on port 4444 established', crit: true }
      ]},
      { id: 'INC-8490', rawCount: 12, asset: 'win-prod-db-01', ip: '10.108.4.12', tactic: 'Persistence (T1053)', severity: 'p1', status: 'CONTAINED', summary: 'Scheduled task creation triggering rogue binary execution upon system reboot.', timeline: [
        { time: '15:10:00', title: 'Schtasks Command Run', desc: 'Task "WindowsUpdateCheck" created with SYSTEM privileges', crit: false }
      ]},
      { id: 'INC-8489', rawCount: 8, asset: 'linux-bastion-ssh', ip: '10.100.1.5', tactic: 'Discovery (T1046)', severity: 'p2', status: 'CLOSED', summary: 'Port scanning activity originating from internal staging network.', timeline: [
        { time: '12:00:05', title: 'Nmap TCP Syn Scan Detected', desc: 'Subnet scan targeting ports 22, 80, 443, 3306', crit: false }
      ]}
    ],
    iocs: [
      { type: 'IP', value: '185.220.101.5', reputation: 'CRITICAL (98/100)', vt: '58 / 72 Flagged', threatActor: 'APT29 / Cozy Bear', country: 'RU', status: 'Malicious C2 Server' },
      { type: 'HASH', value: '44d88612fea8a8f36de82e1278abb02f', reputation: 'CRITICAL (100/100)', vt: '64 / 70 Flagged', threatActor: 'Cobalt Strike Beacon', country: 'N/A', status: 'Trojan.Win32.CobaltStrike' },
      { type: 'DOMAIN', value: 'update-service-cdn.net', reputation: 'HIGH (85/100)', vt: '42 / 68 Flagged', threatActor: 'Lazarus Group', country: 'CN', status: 'Phishing Domain' }
    ],
    assetRisks: [
      { host: 'win-corp-dc-02', ip: '10.108.2.18', crit: 'CRITICAL', vulns: 14, activeThreats: 3, score: 88, status: 'HIGH EXPOSURE' },
      { host: 'linux-api-node-03', ip: '10.108.4.15', crit: 'HIGH', vulns: 9, activeThreats: 2, score: 76, status: 'WARNING' },
      { host: 'win-prod-db-01', ip: '10.108.4.12', crit: 'CRITICAL', vulns: 6, activeThreats: 1, score: 62, status: 'MONITORED' },
      { host: 'mac-dev-laptop-77', ip: '192.168.1.104', crit: 'MEDIUM', vulns: 2, activeThreats: 0, score: 24, status: 'SECURE' }
    ],
    agentHealth: [
      { name: 'win-prod-db-01', daemon: 'ONLINE', ping: '12ms', syscheck: 'SYNCED', memory: '48MB' },
      { name: 'linux-api-node-03', daemon: 'ONLINE', ping: '8ms', syscheck: 'SYNCED', memory: '34MB' },
      { name: 'mac-dev-laptop-77', daemon: 'ONLINE', ping: '22ms', syscheck: 'SYNCED', memory: '29MB' },
      { name: 'win-corp-dc-02', daemon: 'ONLINE', ping: '5ms', syscheck: 'SYNCED', memory: '52MB' }
    ],
    detectionRules: [
      { id: 'RULE-1049', title: 'LSASS Memory Dumping via Mimikatz', category: 'Credential Access', fpRate: '0.2%', precision: '99.8%' },
      { id: 'RULE-2081', title: 'Suspicious Encoded PowerShell Command', category: 'Execution', fpRate: '1.4%', precision: '98.6%' },
      { id: 'RULE-3092', title: 'Outbound Connection to Known C2 IP', category: 'Command & Control', fpRate: '0.0%', precision: '100.0%' },
      { id: 'RULE-4015', title: 'Web Shell Payload Written to Webroot', category: 'Persistence', fpRate: '2.1%', precision: '97.9%' }
    ],
    complianceFrameworks: [
      { name: 'PCI DSS 4.0', score: '94%', badge: 'PASSING', color: '#10b981' },
      { name: 'ISO 27001:2022', score: '91%', badge: 'PASSING', color: '#10b981' },
      { name: 'SOC 2 Type II', score: '96%', badge: 'PASSING', color: '#10b981' },
      { name: 'HIPAA Security Rule', score: '89%', badge: 'AUDIT REQ', color: '#eab308' }
    ]
  };

  // Render Incidents Table
  function renderIncidentsTable() {
    const tableBody = document.getElementById('incidents-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = socEnterpriseState.incidents.map(inc => {
      const sevClass = inc.severity === 'p0' ? 'bg-red' : (inc.severity === 'p1' ? 'bg-orange' : 'bg-amber');
      return `
        <tr>
          <td><span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyber-cyan);">${inc.id}</span></td>
          <td><span style="font-family: var(--font-mono); font-weight: 700;">${inc.rawCount} raw alerts</span></td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.8rem; font-weight: 700; font-family: var(--font-mono);">${inc.asset}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">${inc.ip}</span>
            </div>
          </td>
          <td><span style="font-size: 0.75rem; color: var(--text-secondary);">${inc.tactic}</span></td>
          <td><span class="severity-badge ${sevClass}">${inc.severity.toUpperCase()}</span></td>
          <td><span class="status-badge-soc ${inc.status === 'INVESTIGATING' ? 'soc-status-alert' : 'soc-status-active'}">${inc.status}</span></td>
          <td>
            <button class="agent-action-btn btn-restart btn-inspect-inc" data-inc-id="${inc.id}" style="padding: 0.25rem 0.6rem;">
              Inspect &amp; AI
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Open Incident AI & Timeline Drawer
  function openIncidentDrawer(incId) {
    const inc = socEnterpriseState.incidents.find(i => i.id === incId) || socEnterpriseState.incidents[0];
    const drawer = document.getElementById('soc-incident-drawer');
    if (!drawer) return;

    document.getElementById('inc-drawer-meta-lbl').textContent = `${inc.id} · CORRELATED CASE (${inc.rawCount} ALERTS)`;
    document.getElementById('inc-drawer-title-val').textContent = `${inc.asset} - ${inc.tactic}`;
    document.getElementById('inc-drawer-ai-summary').innerHTML = inc.summary;

    const timelineContainer = document.getElementById('inc-drawer-timeline');
    if (timelineContainer && inc.timeline) {
      timelineContainer.innerHTML = inc.timeline.map(node => `
        <div class="timeline-item-row">
          <div class="timeline-dot ${node.crit ? 'critical' : ''}"></div>
          <div class="timeline-content-box">
            <span class="timeline-time-str">${node.time}</span>
            <div class="timeline-title-str">${node.title}</div>
            <div class="timeline-desc-str">${node.desc}</div>
          </div>
        </div>
      `).join('');
    }

    drawer.classList.add('open');
  }

  // Close Incident Drawer
  const incCloseBtn = document.getElementById('inc-drawer-close-btn');
  if (incCloseBtn) {
    incCloseBtn.addEventListener('click', () => {
      const drawer = document.getElementById('soc-incident-drawer');
      if (drawer) drawer.classList.remove('open');
    });
  }

  // Event Listener for Inspect Incident
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inspect-inc');
    if (btn) {
      const incId = btn.getAttribute('data-inc-id');
      openIncidentDrawer(incId);
    }
  });

  /* ==========================================================================
     SOC ALERT DRAWER — opens on row/card click in Act-Now table & Unresolved cards
     ========================================================================== */

  function openSocAlertDrawer(alert, hostOverride) {
    const drawer    = document.getElementById('soc-alert-drawer');
    const overlay   = document.getElementById('soc-alert-overlay');
    if (!drawer || !alert) return;

    const host   = hostOverride || alert.host || 'External Asset';
    const ip     = alert.ip    || '10.100.1.5';
    const sevLbl = (alert.severity || 'p0').toUpperCase();
    const src    = (alert.source  || 'wazuh').toUpperCase();
    const title  = alert.title  || 'Security Alert';
    const ts     = alert.timestamp || new Date().toLocaleString();
    const seen   = alert.seen   || '1x';

    // Severity badge colour
    const sevBadge   = drawer.querySelector('#soc-ad-sev-badge');
    const sevColours = { P0: 'bg-red', P1: 'bg-orange', P2: 'bg-amber', P3: 'bg-blue' };
    if (sevBadge) {
      sevBadge.textContent  = sevLbl;
      sevBadge.className    = `severity-badge ${sevColours[sevLbl] || 'bg-red'}`;
    }
    const srcBadge = drawer.querySelector('#soc-ad-source-badge');
    if (srcBadge) srcBadge.textContent = src;
    const idBadge  = drawer.querySelector('#soc-ad-id-badge');
    if (idBadge)  idBadge.textContent  = `#${alert.id || '—'}`;
    const titleEl  = drawer.querySelector('#soc-ad-title');
    if (titleEl)  titleEl.textContent  = title;

    // Host / IP
    const hostEl = drawer.querySelector('#soc-ad-host');
    const ipEl   = drawer.querySelector('#soc-ad-ip');
    if (hostEl) hostEl.textContent = host;
    if (ipEl)   ipEl.textContent   = ip;

    // MITRE Tactic mapping
    const tacticMap = {
      breach      : { tactic: 'Exfiltration',       technique: 'T1567 · Exfiltration Over Web Svc' },
      wazuh       : { tactic: 'Credential Access',  technique: 'T1110 · Brute Force' },
      git         : { tactic: 'Credential Exposure', technique: 'T1552 · Unsecured Credentials' },
      'modsecurity': { tactic: 'Initial Access',    technique: 'T1190 · Exploit Public App' },
      sqli        : { tactic: 'Initial Access',      technique: 'T1190 · SQL Injection' },
    };
    const srcLower   = (alert.source || '').toLowerCase();
    const titleLower = title.toLowerCase();
    let mitre = tacticMap[srcLower] || { tactic: 'Defense Evasion', technique: 'T1027 · Obfuscated Files' };
    if (titleLower.includes('sql')) mitre = tacticMap.sqli;
    if (titleLower.includes('modsecurity')) mitre = tacticMap['modsecurity'];
    if (titleLower.includes('git') || titleLower.includes('aws')) mitre = tacticMap.git;
    const tacticEl    = drawer.querySelector('#soc-ad-tactic');
    const techniqueEl = drawer.querySelector('#soc-ad-technique');
    if (tacticEl)    tacticEl.textContent    = mitre.tactic;
    if (techniqueEl) techniqueEl.textContent  = mitre.technique;

    // Detection Context
    const firstSeenEl = drawer.querySelector('#soc-ad-first-seen');
    const seenEl      = drawer.querySelector('#soc-ad-seen');
    const statusEl    = drawer.querySelector('#soc-ad-status');
    if (firstSeenEl) firstSeenEl.textContent = ts;
    if (seenEl)      seenEl.textContent      = seen;
    if (statusEl) {
      statusEl.textContent  = (alert.status || 'open').toUpperCase();
      statusEl.style.color  = alert.status === 'open' ? '#f43f5e' : '#22c55e';
    }

    // Description
    const descEl = drawer.querySelector('#soc-ad-desc');
    if (descEl) {
      const descMap = {
        breach     : `Dark-web intelligence scan detected ${host} credentials appearing in a known threat-actor data dump (1,240 records). Immediate password rotation and MFA enforcement required.`,
        git        : `AWS access key committed to a public repository was detected by Git secret scanner. The key has been indexed by threat actors and may be actively exploited.`,
        wazuh      : `Wazuh Level 12 rule triggered — repeated authentication failure bursts from IP ${ip} matching a brute-force pattern. Host ${host} may be under active attack.`,
        sqli       : `SQL injection payload detected in HTTP request body targeting the web application on ${host}. Request contained UNION-based injection strings (Rule 942100 triggered).`,
        modsecurity: `ModSecurity WAF rule violation — repeated attack signature matches from ${ip} against ${host}. Attacker probe detected across multiple HTTP parameters.`,
      };
      const fallback = `Security anomaly detected on host ${host} (${ip}). Rule triggered by ${src} agent — ${seen} occurrence(s) since ${ts}. Analyst review required.`;
      let desc = descMap[srcLower] || fallback;
      if (titleLower.includes('sql')) desc = descMap.sqli;
      if (titleLower.includes('modsecurity')) desc = descMap.modsecurity;
      descEl.textContent = desc;
    }

    // Attack Timeline (auto-generate based on alert type)
    const timelineEl = drawer.querySelector('#soc-ad-timeline');
    if (timelineEl) {
      const timelines = {
        breach     : [
          { time: '— 72h', label: 'Credential Harvested',    crit: false, desc: 'Leaked in external dark-web marketplace dump' },
          { time: ts,      label: 'Breach Alert Triggered',   crit: true,  desc: `${src} threat intel feed matched ${host} credentials` },
          { time: 'Now',   label: 'Analyst Review Required',  crit: true,  desc: 'Password rotation + MFA enforcement pending' },
        ],
        git        : [
          { time: '— 48h', label: 'Key Committed to Repo',   crit: false, desc: 'AWS access key pushed in plaintext to public branch' },
          { time: '— 2h',  label: 'Key Indexed by Threat Actor', crit: true,  desc: 'Automated harvesting bot detected the exposed credential' },
          { time: ts,      label: 'Alert Triggered',          crit: true,  desc: `Git leakage detection scan flagged ${host}` },
        ],
        wazuh      : [
          { time: ts,      label: 'Brute Force Burst Detected', crit: true,  desc: `${seen} failed auth attempts from ${ip}` },
          { time: 'Now',   label: 'Wazuh Rule L12 Active',    crit: true,  desc: 'Fail2ban threshold approaching — ban pending' },
        ],
      };
      const steps = timelines[srcLower] || [
        { time: ts,    label: 'Alert Detected',    crit: true,  desc: `${src} rule triggered on ${host}` },
        { time: 'Now', label: 'Analyst Notified',  crit: false, desc: 'Incident routed to SOC queue for triage' },
      ];

      timelineEl.innerHTML = steps.map((s, i) => `
        <div style="display:flex;gap:0.75rem;align-items:flex-start;padding-bottom:${i < steps.length - 1 ? '0.85rem' : '0'};position:relative;">
          ${i < steps.length - 1 ? `<div style="position:absolute;left:9px;top:18px;width:2px;height:calc(100% - 4px);background:rgba(255,255,255,0.08);"></div>` : ''}
          <div style="width:18px;height:18px;border-radius:50%;flex-shrink:0;margin-top:2px;border:2px solid ${s.crit ? '#f43f5e' : 'rgba(255,255,255,0.2)'};background:${s.crit ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)'};box-shadow:${s.crit ? '0 0 8px rgba(244,63,94,0.5)' : 'none'};"></div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
              <span style="font-size:0.8rem;font-weight:700;color:${s.crit ? '#f43f5e' : 'var(--text-primary)'};">${s.label}</span>
              <span style="font-size:0.65rem;color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap;">${s.time}</span>
            </div>
            <div style="font-size:0.74rem;color:var(--text-muted);margin-top:0.15rem;">${s.desc}</div>
          </div>
        </div>
      `).join('');
    }

    // SOAR Playbooks (contextual)
    const soarEl = drawer.querySelector('#soc-ad-soar-actions');
    if (soarEl) {
      const soarPlaybooks = [
        { icon: '🔒', label: 'Isolate Host',         desc: `Block all inbound/outbound traffic on ${host}`,   color: '#f43f5e', id: `soar-isolate-${alert.id}` },
        { icon: '🚫', label: 'Block Source IP',       desc: `Firewall drop rule for ${ip}`,                   color: '#fb923c', id: `soar-block-${alert.id}`   },
        { icon: '🔑', label: 'Revoke Credentials',    desc: 'Force password reset + invalidate active tokens', color: '#a78bfa', id: `soar-revoke-${alert.id}`  },
        { icon: '📧', label: 'Notify Security Team',  desc: 'Send PagerDuty + Slack P0 alert escalation',     color: '#00f2fe', id: `soar-notify-${alert.id}`  },
      ];
      soarEl.innerHTML = soarPlaybooks.map(pb => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.55rem 0.75rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:7px;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <span style="font-size:1rem;">${pb.icon}</span>
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-primary);">${pb.label}</div>
              <div style="font-size:0.68rem;color:var(--text-muted);">${pb.desc}</div>
            </div>
          </div>
          <button id="${pb.id}" data-executed="false" onclick="
            const b=this;
            if(b.dataset.executed==='true'){return;}
            b.dataset.executed='true';
            b.textContent='Running…';
            b.style.opacity='0.6';
            setTimeout(()=>{b.textContent='✓ Done';b.style.background='rgba(34,197,94,0.15)';b.style.borderColor='rgba(34,197,94,0.4)';b.style.color='#22c55e';},1200);
          " style="padding:0.3rem 0.65rem;background:rgba(${pb.color.replace('#','')},0.1);border:1px solid rgba(0,242,254,0.25);color:var(--cyber-cyan);border-radius:5px;font-size:0.7rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s;">▶ Run</button>
        </div>
      `).join('');
    }

    // Remediation Steps (keyword-mapped)
    const remEl = drawer.querySelector('#soc-ad-remediation');
    if (remEl) {
      let steps = [];
      if (titleLower.includes('brute') || titleLower.includes('modsecurity') || titleLower.includes('ssh')) {
        steps = [
          `Immediately block attacker IP <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">${ip}</code> via iptables or cloud security group rule.`,
          `Enable Fail2ban jail for <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">sshd</code> and ModSecurity with a 3-strike threshold.`,
          `Enforce key-based SSH auth only — disable password login in <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">/etc/ssh/sshd_config</code>.`,
        ];
      } else if (titleLower.includes('git') || titleLower.includes('aws')) {
        steps = [
          `Revoke compromised AWS access key immediately: <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">aws iam update-access-key --status Inactive</code>`,
          `Run <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">git-filter-repo</code> or BFG Repo-Cleaner to purge key from git history.`,
          `Install git-secrets pre-commit hook and add GitGuardian scanning to CI/CD pipeline.`,
        ];
      } else if (titleLower.includes('breach') || titleLower.includes('leak')) {
        steps = [
          `Force immediate password rotation for all accounts appearing in the leaked dataset.`,
          `Audit access logs for abnormal logins from unknown geographies or IP ranges.`,
          `Enforce MFA on all administrative accounts and API key rotations across all services.`,
        ];
      } else if (titleLower.includes('sql')) {
        steps = [
          `Switch all database query builders to parameterized statements / prepared queries immediately.`,
          `Ensure ModSecurity WAF Rule 942100 is set to <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">SecRuleEngine On</code> (blocking mode).`,
          `Audit and sanitize all REST API input handlers — reject non-alphanumeric chars in query params.`,
        ];
      } else {
        steps = [
          `Isolate host <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">${host}</code> from the production network segment pending investigation.`,
          `Review auth logs: <code style="background:rgba(0,0,0,0.4);padding:0.1rem 0.35rem;border-radius:3px;font-size:0.78rem;">tail -f /var/log/auth.log | grep ${ip}</code>`,
          `Trigger full file integrity scan via Wazuh manager and correlate with active SIEM events.`,
        ];
      }
      remEl.innerHTML = steps.map(s => `<li style="color:var(--text-primary);line-height:1.65;font-size:0.8rem;">${s}</li>`).join('');
    }

    // Disposition buttons
    const btnTP = document.getElementById('soc-ad-btn-tp');
    const btnFP = document.getElementById('soc-ad-btn-fp');
    const btnEsc = document.getElementById('soc-ad-btn-escalate');

    if (btnTP) btnTP.onclick = () => {
      btnTP.textContent = '✓ Marked True Positive';
      btnTP.style.background = 'rgba(34,197,94,0.25)';
      closeSocAlertDrawer();
      showToast(`Alert #${alert.id} marked as True Positive. Escalating to Tier 2...`);
    };
    if (btnFP) btnFP.onclick = () => {
      btnFP.textContent = '✗ Marked False Positive';
      btnFP.style.background = 'rgba(100,116,139,0.2)';
      closeSocAlertDrawer();
      showToast(`Alert #${alert.id} suppressed as False Positive.`);
    };
    if (btnEsc) btnEsc.onclick = () => {
      closeSocAlertDrawer();
      showToast(`Alert #${alert.id} escalated to P0 — PagerDuty + Slack notified!`, true);
    };

    // Show drawer + overlay
    drawer.classList.add('active');
    if (overlay) overlay.style.display = 'block';
  }

  function closeSocAlertDrawer() {
    const drawer  = document.getElementById('soc-alert-drawer');
    const overlay = document.getElementById('soc-alert-overlay');
    if (drawer)  drawer.classList.remove('active');
    if (overlay) overlay.style.display = 'none';
  }

  // Close button
  const socAdCloseBtn = document.getElementById('soc-alert-drawer-close');
  if (socAdCloseBtn) socAdCloseBtn.addEventListener('click', closeSocAlertDrawer);

  // Expose globally so renderSocActNowTable / renderSocUnresolvedCards can call it
  window.openSocAlertDrawer = openSocAlertDrawer;

  // Batch AI Summary trigger
  const btnRunAiAll = document.getElementById('btn-run-ai-all');
  if (btnRunAiAll) {
    btnRunAiAll.addEventListener('click', () => {
      showToast('Running Gemini SOC Batch Incident Correlation & Summarization...', true);
      setTimeout(() => {
        showToast('Batch AI Analysis Complete: All 12 Correlated Incident tickets enriched with root-cause timelines!', true);
      }, 1800);
    });
  }

  // IOC Search Handler
  function handleIocSearch() {
    const input = document.getElementById('ioc-search-input');
    const resultBox = document.getElementById('ioc-result-container');
    if (!input || !resultBox) return;

    const q = input.value.trim();
    if (!q) {
      showToast('Please enter an IP, Hash, or Domain to query threat intelligence.');
      return;
    }

    showToast(`Querying global threat feeds for indicator: ${q}...`, true);
    
    setTimeout(() => {
      const found = socEnterpriseState.iocs.find(i => i.value.toLowerCase().includes(q.toLowerCase())) || {
        type: 'INDICATOR',
        value: q,
        reputation: 'SUSPICIOUS (78/100)',
        vt: '38 / 70 Flagged',
        threatActor: 'Unknown Adversary Group',
        country: 'US',
        status: 'Flagged Malicious in MISP'
      };

      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${found.type} INDICATOR QUERY</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--cyber-cyan); font-family: var(--font-mono); margin-top: 2px;">${found.value}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.4rem;">
              Threat Actor: <strong>${found.threatActor}</strong> · Location: <strong>${found.country}</strong>
            </div>
          </div>
          
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted);">VIRUSTOTAL SCORE</div>
            <div style="font-size: 1rem; font-weight: 800; color: #f43f5e; font-family: var(--font-mono);">${found.vt}</div>
            <span class="status-badge-soc soc-status-quarantined" style="margin-top: 4px; display: inline-block;">${found.reputation}</span>
          </div>
        </div>

        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">${found.status}</span>
          <button class="agent-action-btn btn-quarantine btn-soar-trigger" data-playbook="block-ip" style="padding: 0.35rem 0.8rem;">
            🚫 Add IOC to SOAR Firewall Blocklist
          </button>
        </div>
      `;
    }, 800);
  }

  const iocSearchBtn = document.getElementById('ioc-search-btn');
  if (iocSearchBtn) {
    iocSearchBtn.addEventListener('click', handleIocSearch);
  }

  // Render MITRE ATT&CK Matrix
  function renderMitreMatrix() {
    const container = document.getElementById('mitre-matrix-container');
    if (!container) return;

    const tactics = [
      { name: 'Initial Access', tech: [{ name: 'Spearphishing', count: 4 }, { name: 'Exploit Public App', count: 12 }] },
      { name: 'Execution', tech: [{ name: 'PowerShell', count: 18 }, { name: 'Command Line', count: 9 }] },
      { name: 'Persistence', tech: [{ name: 'Scheduled Task', count: 7 }, { name: 'Registry Run Keys', count: 2 }] },
      { name: 'Priv Esc', tech: [{ name: 'Sudo Caching', count: 5 }, { name: 'LSASS Dump', count: 14 }] },
      { name: 'Def Evasion', tech: [{ name: 'Obfuscated Files', count: 11 }, { name: 'Indicator Removal', count: 1 }] },
      { name: 'Command & C2', tech: [{ name: 'Application Layer Protocol', count: 8 }, { name: 'Ingress Tool Transfer', count: 6 }] }
    ];

    container.innerHTML = tactics.map(tac => `
      <div class="mitre-tactic-col">
        <div class="mitre-tactic-header">${tac.name}</div>
        ${tac.tech.map(t => `
          <div class="mitre-tech-item ${t.count > 0 ? 'has-alerts' : ''}">
            <span>${t.name}</span>
            <span class="mitre-count-badge">${t.count}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Render Asset Risk Matrix
  function renderAssetRiskTable() {
    const tableBody = document.getElementById('asset-risk-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = socEnterpriseState.assetRisks.map(ast => {
      let scoreColor = '#10b981';
      if (ast.score >= 75) scoreColor = '#f43f5e';
      else if (ast.score >= 50) scoreColor = '#fb923c';

      return `
        <tr>
          <td><span style="font-weight: 700; font-family: var(--font-mono); color: var(--text-primary);">${ast.host}</span></td>
          <td><span style="font-family: var(--font-mono); color: var(--text-muted);">${ast.ip}</span></td>
          <td><span class="status-badge-soc ${ast.crit === 'CRITICAL' ? 'soc-status-quarantined' : 'soc-status-alert'}">${ast.crit}</span></td>
          <td><span style="font-family: var(--font-mono); font-weight: 700;">${ast.vulns} CVEs</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem; width: 120px;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                <div style="width: ${ast.score}%; height: 100%; background: ${scoreColor}; border-radius: 3px;"></div>
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: ${scoreColor};">${ast.score}</span>
            </div>
          </td>
          <td><span class="status-badge-soc ${ast.score >= 75 ? 'soc-status-quarantined' : 'soc-status-active'}">${ast.status}</span></td>
          <td>
            <button class="agent-action-btn btn-quarantine" data-action="quarantine" data-agent-id="agent-1" style="padding: 0.2rem 0.5rem;">Risk Action</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Wazuh Agent Health Grid
  function renderAgentHealthGrid() {
    const grid = document.getElementById('agent-health-grid');
    if (!grid) return;

    grid.innerHTML = socEnterpriseState.agentHealth.map(ag => `
      <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(0,242,254,0.2); border-radius: 8px; padding: 1rem;">
        <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-primary); font-size: 0.85rem;">${ag.name}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.75rem; font-size: 0.72rem;">
          <div><span style="color: var(--text-muted);">Daemon:</span> <strong style="color: #10b981;">${ag.daemon}</strong></div>
          <div><span style="color: var(--text-muted);">Ping:</span> <strong>${ag.ping}</strong></div>
          <div><span style="color: var(--text-muted);">Syscheck:</span> <strong style="color: var(--cyber-cyan);">${ag.syscheck}</strong></div>
          <div><span style="color: var(--text-muted);">RAM Usage:</span> <strong>${ag.memory}</strong></div>
        </div>
      </div>
    `).join('');
  }

  // Render Detection Rules Table
  function renderDetectionRulesTable() {
    const tableBody = document.getElementById('detection-rules-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = socEnterpriseState.detectionRules.map(rule => `
      <tr>
        <td><span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyber-cyan);">${rule.id}</span></td>
        <td><span style="font-weight: 600;">${rule.title}</span></td>
        <td><span style="font-size: 0.75rem; color: var(--text-secondary);">${rule.category}</span></td>
        <td><span style="font-family: var(--font-mono); color: #10b981;">${rule.fpRate}</span></td>
        <td><span style="font-family: var(--font-mono); font-weight: 800; color: var(--cyber-cyan);">${rule.precision}</span></td>
        <td>
          <button class="agent-action-btn btn-restart btn-tune-rule" data-rule-id="${rule.id}" style="padding: 0.2rem 0.55rem;">Tune Threshold</button>
        </td>
      </tr>
    `).join('');
  }

  // Render Compliance Radar Cards
  function renderComplianceCards() {
    const grid = document.getElementById('compliance-cards-grid');
    if (!grid) return;

    grid.innerHTML = socEnterpriseState.complianceFrameworks.map(fw => `
      <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">${fw.name}</span>
          <span style="font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 3px; background: rgba(16,185,129,0.15); color: ${fw.color};">${fw.badge}</span>
        </div>
        <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: var(--cyber-cyan); margin-top: 0.5rem;">${fw.score}</div>
        <div style="height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-top: 0.5rem;">
          <div style="width: ${fw.score}; height: 100%; background: ${fw.color}; border-radius: 3px;"></div>
        </div>
      </div>
    `).join('');
  }

  // SOAR Playbook Execution Trigger Handler
  document.addEventListener('click', (e) => {
    const soarBtn = e.target.closest('.btn-soar-trigger');
    if (!soarBtn) return;

    const playbook = soarBtn.getAttribute('data-playbook');
    const titles = {
      'isolate': 'Host Network Isolation Playbook',
      'block-ip': 'Edge IP Blacklist Playbook',
      'revoke-session': 'Revoke AD Tokens Playbook',
      'kill-proc': 'Process Tree Termination Playbook'
    };

    const title = titles[playbook] || 'SOAR Response Playbook';
    showToast(`Initiating automated playbook: ${title}...`, true);

    setTimeout(() => {
      showToast(`[SOAR SUCCESS] ${title} executed successfully! Target host/IP secured.`, true);
      addWazuhAuditLogMessage(`SOAR PLAYBOOK EXECUTION: ${title} triggered by operator.`);
    }, 1500);
  });

  // Rule Tuning Click Handler
  document.addEventListener('click', (e) => {
    const tuneBtn = e.target.closest('.btn-tune-rule');
    if (!tuneBtn) return;

    const ruleId = tuneBtn.getAttribute('data-rule-id');
    showToast(`Detection rule ${ruleId} threshold tuned! Noise reduced by 12%.`, true);
  });

  // Multi-Tenant Selector Handler
  const msspSelect = document.getElementById('mssp-tenant-select');
  if (msspSelect) {
    msspSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const tenantNames = {
        'tenant-acme': 'Acme Global Enterprise',
        'tenant-fintech': 'FinTech West Financial',
        'tenant-health': 'Global Health Systems'
      };

      const name = tenantNames[val] || 'Selected Tenant';
      showToast(`Switched MSSP Portal context to: ${name}. Dashboard re-calculating...`, true);

      const mttdEl = document.getElementById('exec-mttd-val');
      const mttrEl = document.getElementById('exec-mttr-val');
      const gradeEl = document.getElementById('exec-grade-val');

      if (val === 'tenant-fintech') {
        if (mttdEl) mttdEl.textContent = '3.8m';
        if (mttrEl) mttrEl.textContent = '9.2m';
        if (gradeEl) gradeEl.textContent = '92 / 100';
      } else if (val === 'tenant-health') {
        if (mttdEl) mttdEl.textContent = '5.1m';
        if (mttrEl) mttrEl.textContent = '14.0m';
        if (gradeEl) gradeEl.textContent = '84 / 100';
      } else {
        if (mttdEl) mttdEl.textContent = '4.2m';
        if (mttrEl) mttrEl.textContent = '11.5m';
        if (gradeEl) gradeEl.textContent = '88 / 100';
      }
    });
  }

  // Initialize all module tables & views
  function initSocEnterpriseModules() {
    if (typeof initSocDashboard === 'function') {
      initSocDashboard();
    }
    renderIncidentsTable();
    renderMitreMatrix();
    renderAssetRiskTable();
    renderAgentHealthGrid();
    renderDetectionRulesTable();
    renderComplianceCards();
  }

  initSocEnterpriseModules();
});
