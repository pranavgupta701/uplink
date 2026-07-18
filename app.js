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

  // Custom Toast notification
  const showToast = (message, isSuccess = false) => {
    let toast = document.querySelector('.uplink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'uplink-toast';
      document.body.appendChild(toast);
      
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.right = '2rem';
      toast.style.backdropFilter = 'blur(8px)';
      toast.style.padding = '0.85rem 1.4rem';
      toast.style.borderRadius = '8px';
      toast.style.fontFamily = "'Outfit', sans-serif";
      toast.style.fontSize = '0.9rem';
      toast.style.zIndex = '1100';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.transform = 'translateY(100px)';
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
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
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
              <button class="confirm-all-subs-btn" style="background: rgba(0, 242, 254, 0.06); border: 1px solid rgba(0, 242, 254, 0.15); color: var(--cyber-cyan); font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; font-family: var(--font-sans);">
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
      // Onboarding complete
      actionBtn.innerHTML = `
        Onboarding Completed
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      actionBtn.style.background = 'rgba(5, 255, 196, 0.1)';
      actionBtn.style.border = '1px solid var(--cyber-green)';
      actionBtn.style.color = 'var(--cyber-green)';
      actionBtn.style.boxShadow = '0 0 15px rgba(5, 255, 196, 0.15)';
      actionBtn.style.cursor = 'default';
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
    
    // Reveal Ingested From section at the bottom
    ingestedSection.classList.remove('hidden');
    
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

  // Bind Confirm All Subdomains buttons
  const bindConfirmAllSubsButtons = () => {
    document.querySelectorAll('.confirm-all-subs-btn').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const block = btn.closest('.domain-block') || btn.parentElement.parentElement;
          if (block) {
            let confirmedAny = false;
            block.querySelectorAll('.nested-subdomains .infra-row.sub-row').forEach(subRow => {
              const confirmBtn = subRow.querySelector('.action-confirm-btn');
              if (confirmBtn && confirmBtn.style.display !== 'none' && !confirmBtn.classList.contains('hidden')) {
                confirmBtn.click();
                confirmedAny = true;
              }
            });
            if (confirmedAny) {
              showToast("Confirmed all subdomains for this domain.");
            } else {
              showToast("All subdomains are already confirmed.");
            }
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
  };

  // Setup instances tab triggers initially
  setupInstancesTabs();

  // Click handler for top navigation tabs (Discovery etc.)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tabName = link.textContent.trim();
      
      if (!isCommitted) {
        if (!link.classList.contains('active')) {
          e.preventDefault();
          e.stopPropagation();
          showToast(`"${tabName}" is locked. Complete all onboarding steps and commit on Step 6 first.`);
        }
      } else {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Hide/show wrappers based on active tab
        const href = link.getAttribute('href');
        const discoveryWrapper = document.getElementById('discovery-view-wrapper');
        const stateWrapper = document.getElementById('state-view-wrapper');
        const pulseWrapper = document.getElementById('pulse-view-wrapper');
        const inventoryWrapper = document.getElementById('inventory-view-wrapper');
        const settingsWrapper = document.getElementById('settings-view-wrapper');
        const socWrapper = document.getElementById('soc-view-wrapper');
        const securityWrapper = document.getElementById('security-view-wrapper');
        
        // Hide all wrappers first
        if (discoveryWrapper) discoveryWrapper.classList.add('hidden');
        if (stateWrapper) stateWrapper.classList.add('hidden');
        if (pulseWrapper) pulseWrapper.classList.add('hidden');
        if (inventoryWrapper) inventoryWrapper.classList.add('hidden');
        if (settingsWrapper) settingsWrapper.classList.add('hidden');
        if (socWrapper) socWrapper.classList.add('hidden');
        if (securityWrapper) securityWrapper.classList.add('hidden');
        
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
        }
      }
    });
  });

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

  // Initialize settings options
  const initializeSettings = () => {
    // 1. Sidebar tab switching listeners
    document.querySelectorAll('.settings-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-settings-tab');
        switchSettingsTab(tab);
      });
    });

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

  // Web Audio Alert Sound Synthesizer
  function playAlertSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      
      // Double Beep Alert synth
      const triggerBeep = (time) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(988, time); // B5 note
        gain.gain.setValueAtTime(0.12, time);
        osc.start(time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        osc.stop(time + 0.2);
      };

      triggerBeep(audioCtx.currentTime);
      triggerBeep(audioCtx.currentTime + 0.22);
    } catch (e) {
      console.warn("Web Audio Context could not start: ", e);
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
      confirmedDomains.forEach(domain => {
        const extra = `
          <div class="inventory-details-block">
            <span class="inventory-details-label">Category</span>
            <span class="inventory-details-value">${domain.isSub ? 'Mapped Subdomain App' : 'Apex Domain'}</span>
          </div>
          <div class="inventory-details-block">
            <span class="inventory-details-label">SSL Certificate</span>
            <span class="inventory-details-value" style="color: var(--cyber-green);">Verified Valid</span>
          </div>
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
          <span class="alert-pallet-status-tag ${statusClass}">${statusLabel}</span>
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
      } else {
        status = alertObj.severity || 'critical';
        statusLabel = status === 'critical' ? 'Critical' : 'Warning';
      }
      timestamp = alertObj.timestamp;
      reason = alertObj.reason;
      remediations = alertObj.remediations;
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
        remediations = activeAlert.remediations;
      } else {
        status = node.cpu >= 90 ? 'critical' : (node.cpu >= 80 ? 'warning' : 'healthy');
        statusLabel = node.cpu >= 90 ? 'Critical' : (node.cpu >= 80 ? 'Warning' : 'Healthy');
        reason = node.cpu >= 90 
          ? `CPU utilization on ${serverName} exceeded the 90% critical threshold.` 
          : (node.cpu >= 80 ? `CPU utilization on ${serverName} exceeded the 80% warning threshold.` : `CPU utilization on ${serverName} is running within normal limits.`);
        
        remediations = [
          `Monitor system resources and check logs via SSH if CPU load increases.`,
          `Ensure load balancer is distributing traffic evenly across all application boxes.`
        ];
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

  function initSocDashboard() {
    if (socInitialized) return;
    socInitialized = true;

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
        const host = btn.getAttribute('data-host');
        const row = btn.closest('.act-row');

        if (row) {
          row.classList.add('actioned-row');
          row.querySelectorAll('.btn-disp').forEach(b => b.disabled = true);
        }

        if (action === 'TP') {
          showToast(`Escalated alert on ${host} as True Positive (TP). Playbook initiated.`, false);
        } else {
          showToast(`Dismissed alert on ${host} as False Positive (FP). Exception rule created.`, true);
        }
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

    eventsLogData.forEach(event => {
      const row = document.createElement('div');
      row.className = `event-log-row severity-${event.severity}`;

      let statusClass = "status-bg-blocked";
      if (event.status === "alerting") statusClass = "status-bg-alerting";
      else if (event.status === "isolated") statusClass = "status-bg-isolated";
      else if (event.status === "resolved") statusClass = "status-bg-resolved";

      row.innerHTML = `
        <span class="event-time">${event.time}</span>
        <span class="event-type">${event.type}</span>
        <span class="event-host">${event.host}</span>
        <span class="event-desc">${event.desc}</span>
        <span class="event-status ${statusClass}">${event.status}</span>
      `;
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
    { id: "16396", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 110.35.80.116", timestamp: "7/18/2026, 9:52:51 AM", seen: "8x", status: "open" },
    { id: "16395", source: "wazuh", severity: "p1", title: "Wazuh L10 · Multiple Windows error application events.", timestamp: "7/18/2026, 9:52:47 AM", seen: "2x", status: "open" },
    { id: "16394", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 82.197.69.40", timestamp: "7/18/2026, 9:52:52 AM", seen: "12x", status: "open" },
    { id: "16393", source: "wazuh", severity: "p0", title: "Wazuh L12 · Repeated ModSecurity attacks from same source IP: 202.183.141.133", timestamp: "7/18/2026, 9:53:12 AM", seen: "24x", status: "open" },
    { id: "16388", source: "git", severity: "p2", title: "Git leakage · AWS Access Key ID exposed in commit message.", timestamp: "7/18/2026, 9:31:05 AM", seen: "1x", status: "open" },
    { id: "16380", source: "breach", severity: "p0", title: "Breach Intelligence · Leaked admin credentials found on darkweb repository.", timestamp: "7/18/2026, 8:44:12 AM", seen: "1x", status: "open" },
    { id: "16372", source: "brand", severity: "p3", title: "Brand abuse · Rogue phishing domain registered: secure-uplink-portal.com", timestamp: "7/18/2026, 7:15:20 AM", seen: "1x", status: "open" }
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
        if (drawer.classList.contains('active') && !drawer.contains(e.target) && !grid.contains(e.target) && !selectAllBtn.contains(e.target)) {
          drawer.classList.remove('active');
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

      playbooks.forEach(p => {
        const card = document.createElement('div');
        card.className = 'drawer-playbook-card';
        card.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.8rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; transition: all 0.2s; margin-top: 0.5rem;';
        
        // Restore run states
        const hasRun = executedPlaybooks[alertId] && executedPlaybooks[alertId][p.key];
        const statusClass = hasRun ? 'btn-run-playbook success' : 'btn-run-playbook';
        const buttonText = hasRun ? p.successText : p.runText;
        const isDisabled = hasRun ? 'disabled' : '';

        card.innerHTML = `
          <div class="playbook-card-info" style="display: flex; flex-direction: column; gap: 0.15rem;">
            <span class="playbook-name" style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">${p.name}</span>
            <span class="playbook-desc" style="font-size: 0.68rem; color: var(--text-muted);">${p.desc}</span>
          </div>
          <button class="${statusClass}" data-key="${p.key}" ${isDisabled} style="font-size: 0.72rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 4px; cursor: pointer; transition: all 0.2s;">${buttonText}</button>
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
            drawerMetaLbl.textContent = `${alert.severity.toUpperCase()} · ${alert.source.toUpperCase()} · #${alert.id}`;
            
            const titleParts = alert.title.split(' · ');
            drawerTitleVal.textContent = titleParts[1] || alert.title;
            drawerDescVal.textContent = titleParts[0] + " finding reported from security agent logs.";
            
            const hostMatch = alert.title.match(/host\s+(\S+)|IP:\s+(\S+)/);
            const host = hostMatch ? (hostMatch[1] || hostMatch[2]) : "External Asset";
            drawerHostVal.textContent = host;

            drawerTimeVal.textContent = `seen ${alert.seen} · last ${alert.timestamp}`;
            
            // Get security remediation steps
            let secRemediations = [];
            const titleLower = alert.title.toLowerCase();
            if (titleLower.includes("brute force") || titleLower.includes("modsecurity")) {
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
            } else if (titleLower.includes("malware") || titleLower.includes("mimikatz")) {
              secRemediations = [
                `Quarantine the infected endpoint: <code>${host}</code> from the network immediately using the playbook action.`,
                `Run a full security scan using Windows Defender or installed EDR agent to locate and purge the binaries.`,
                `Audit Active Directory login sessions originating from the host to ensure credentials weren't dumped or reused.`
              ];
            } else if (titleLower.includes("hijack") || titleLower.includes("rogue process")) {
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

            bindPlaybookControls(alert);
            drawer.classList.add('active');
          }
        });

        grid.appendChild(card);
      });
    };

    renderSecurityAlerts();
  }


});
