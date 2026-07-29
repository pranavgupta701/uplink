const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = 3001;
const SECRET_KEY = 'super_secret_uplink_key';

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Mock Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token, message: 'Login successful' });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// Authentication Middleware for API
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Route for initial fetch
let mockBackendAlerts = [
    { id: "BACKEND-001", source: "wazuh", severity: "p0", title: "Wazuh L12 · Backend API: Unauthorized Access Attempt", timestamp: new Date().toLocaleString(), seen: "5x", status: "open", host: "api-server-prod", ip: "192.168.1.105" },
    { id: "BACKEND-002", source: "breach", severity: "p1", title: "Breach Intel · Backend API: API Key leaked in public gist", timestamp: new Date().toLocaleString(), seen: "1x", status: "open", host: "dev-workstation", ip: "10.0.0.52" },
    { id: "BACKEND-003", source: "git", severity: "p2", title: "Git Leakage · Backend API: Hardcoded secrets in new commit", timestamp: new Date().toLocaleString(), seen: "2x", status: "open", host: "gitlab-runner", ip: "172.16.0.8" }
];

// Mock Detection Rules Data
let mockDetectionRules = [
    { id: "RULE-101", name: "SSH Brute-Force Detection", severity: "P0 - Critical", category: "Authentication", status: "active", matches24h: 142, description: "Triggers on > 5 failed SSH authentication attempts within 60s from single IP." },
    { id: "RULE-102", name: "AWS CloudTrail Root Login", severity: "P0 - Critical", category: "Cloud Security", status: "active", matches24h: 3, description: "Alerts when root account credentials are used for AWS Management Console login." },
    { id: "RULE-103", name: "Kubernetes Privilege Escalation", severity: "P1 - High", category: "Container Security", status: "active", matches24h: 19, description: "Detects pod creation with hostPath volume or privileged security context." },
    { id: "RULE-104", name: "FIM Integrity Violation (etc/shadow)", severity: "P0 - Critical", category: "File Integrity", status: "active", matches24h: 7, description: "Monitors changes or unauthorized write attempts to system shadow authentication files." },
    { id: "RULE-105", name: "SCA Vulnerability Severity > 9.0", severity: "P2 - Medium", category: "Supply Chain", status: "disabled", matches24h: 88, description: "Automated alert when npm or pip dependency vulnerability CVSS score exceeds 9.0." },
    { id: "YARA-201", name: "YARA · Cobalt Strike Beacon Memory Signature", severity: "P0 - Critical", category: "Malware / Memory", status: "active", matches24h: 28, description: "Scans process memory for Cobalt Strike C2 DLL reflective loader headers ($reflect_loader, $c2_pipe)." },
    { id: "YARA-202", name: "YARA · Mimikatz LSA Password Dumper", severity: "P0 - Critical", category: "Credential Access", status: "active", matches24h: 14, description: "Detects unencrypted Mimikatz sekurlsa::logonpasswords and lsass memory injection artifacts." },
    { id: "YARA-203", name: "YARA · Web Shell Detection (PHP/JSP/ASPX)", severity: "P0 - Critical", category: "Web Security", status: "active", matches24h: 45, description: "Identifies obfuscated webshells executing shell_exec, system, passthru, or eval(base64_decode())." },
    { id: "YARA-204", name: "YARA · Ransomware Encryptor Header Pattern", severity: "P0 - Critical", category: "Ransomware", status: "active", matches24h: 2, description: "Detects LockBit / BlackCat file system traversal, VSS deletion commands, and extension appending." },
    { id: "YARA-205", name: "YARA · Reverse Shell / Netcat Spawner", severity: "P1 - High", category: "Execution", status: "active", matches24h: 31, description: "Flags nc -e /bin/bash, bash -i >& /dev/tcp, or python pty socket spawns in user processes." },
    { id: "YARA-206", name: "YARA · Log4j / JNDI Remote Code Execution", severity: "P0 - Critical", category: "Vulnerability / RCE", status: "active", matches24h: 56, description: "Monitors inbound payloads matching ${jndi:ldap://...} or ${jndi:rmi://...} string patterns." },
    { id: "YARA-207", name: "YARA · XMRig CryptoMiner Binary Signature", severity: "P2 - Medium", category: "Resource Abuse", status: "active", matches24h: 92, description: "Scans for Stratum mining protocol headers, CPU-mining loops, and unauthorized xmr-stak binaries." },
    { id: "YARA-208", name: "YARA · Linux Rootkit System Hooking", severity: "P0 - Critical", category: "Persistence", status: "active", matches24h: 5, description: "Identifies LKM (Loadable Kernel Module) rootkits overriding sys_call_table or hijacking /etc/ld.so.preload." }
];

// Mock Execution Runs / Audit Trails
let mockExecutionRuns = [
    { id: "RUN-9021", type: "SOAR Playbook", action: "Perimeter Firewall IP Block", target: "192.168.1.105", status: "Completed", duration: "1.2s", triggeredBy: "SOAR Engine / Auto", timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleString() },
    { id: "RUN-9020", type: "Syslog Ingest", action: "Threat Intel Enrichment & Ingest", target: "syslog-relay", status: "Completed", duration: "0.4s", triggeredBy: "Wazuh Ingestion API", timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString() },
    { id: "RUN-9019", type: "FIM Scan", action: "File Integrity Hash Verification", target: "prod-db-master", status: "Completed", duration: "4.8s", triggeredBy: "Scheduled Cron", timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleString() },
    { id: "RUN-9018", type: "Vulnerability Scan", action: "CVE Vulnerability Sweep", target: "k8s-ingress-prod", status: "Completed", duration: "12.3s", triggeredBy: "Admin User", timestamp: new Date(Date.now() - 1000 * 60 * 240).toLocaleString() }
];

app.get('/api/soc/alerts', authenticateToken, (req, res) => {
    res.json({ alerts: mockBackendAlerts });
});

app.get('/api/soc/rules', authenticateToken, (req, res) => {
    res.json({ rules: mockDetectionRules });
});

app.post('/api/soc/rules/toggle', authenticateToken, (req, res) => {
    const { id } = req.body;
    const rule = mockDetectionRules.find(r => r.id === id);
    if (rule) {
        rule.status = rule.status === 'active' ? 'disabled' : 'active';
        return res.json({ success: true, rule });
    }
    res.status(404).json({ error: 'Rule not found' });
});

app.get('/api/soc/runs', authenticateToken, (req, res) => {
    res.json({ runs: mockExecutionRuns });
});

// Socket.io Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return next(new Error("Authentication error"));
        socket.user = user;
        next();
    });
});

// WebSocket Connection Handling
let alertCounter = 4;
io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.username}`);

    // Listen for SOAR remediation request from client
    socket.on('remediate_incident', (data) => {
        console.log(`[SOAR] Executing playbook to quarantine ${data.host} (${data.ip}) for alert ${data.id}`);
        // Simulate a delay for the SOAR playbook to run
        setTimeout(() => {
            const runEntry = {
                id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`,
                type: "SOAR Playbook",
                action: `Network Isolation & IP Block (${data.ip})`,
                target: data.host || "perimeter-firewall",
                status: "Completed",
                duration: "1.5s",
                triggeredBy: socket.user ? socket.user.username : "Analyst",
                timestamp: new Date().toLocaleString()
            };
            mockExecutionRuns.unshift(runEntry);

            // Acknowledge the remediation success to the specific client
            socket.emit('remediation_success', {
                id: data.id,
                message: `Successfully quarantined IP ${data.ip} at perimeter firewall.`
            });

            // Broadcast run_executed to all clients to update audit log in real time
            io.emit('run_executed', { run: runEntry });
        }, 1500);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] User disconnected: ${socket.user.username}`);
    });
});

// Real-Time Syslog Ingestion Endpoint with Threat Intel Enrichment
app.post('/api/logs/ingest', (req, res) => {
    const { syslog } = req.body;
    if (!syslog) {
        return res.status(400).json({ error: 'Missing syslog payload' });
    }

    // 1. Parse syslog (Extract IP if exists)
    const ipMatch = syslog.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    const ip = ipMatch ? ipMatch[0] : 'Unknown IP';
    
    // 2. Simulate Threat Intelligence API enrichment
    let threatScore = 0;
    let tags = [];
    if (ip !== 'Unknown IP') {
        threatScore = Math.floor(Math.random() * 100);
        if (threatScore > 80) tags.push("MALICIOUS");
        if (syslog.toLowerCase().includes('brute') || syslog.toLowerCase().includes('failed password')) tags.push("BRUTE_FORCE");
        if (syslog.toLowerCase().includes('sudo')) tags.push("PRIV_ESCALATION");
    }

    const isCritical = tags.includes("MALICIOUS");
    const alertId = `INGEST-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newAlert = {
        id: alertId,
        source: "wazuh",
        severity: isCritical ? "p0" : "p2",
        title: `Wazuh L15 · Ingested Syslog: ${syslog.substring(0, 40)}... (Intel Score: ${threatScore})`,
        timestamp: new Date().toLocaleString(),
        seen: "1x",
        status: "open",
        host: "syslog-relay",
        ip: ip,
        threat_score: threatScore,
        intel_tags: tags
    };

    const runEntry = {
        id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`,
        type: "Syslog Ingest",
        action: `Ingested Syslog & Threat Intel Score (${threatScore})`,
        target: ip,
        status: "Completed",
        duration: "0.3s",
        triggeredBy: "Syslog Ingestion API",
        timestamp: new Date().toLocaleString()
    };
    mockExecutionRuns.unshift(runEntry);
    
    // 3. Broadcast alert and run execution to UI
    io.emit('new_alert', { alert: newAlert });
    io.emit('run_executed', { run: runEntry });
    
    return res.json({ success: true, message: 'Log successfully ingested, enriched, and broadcasted.', alert: newAlert });
});

server.listen(PORT, () => {
    console.log(`Backend server running with WebSockets on http://localhost:${PORT}`);
});
