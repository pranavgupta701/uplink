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

app.get('/api/soc/alerts', authenticateToken, (req, res) => {
    res.json({ alerts: mockBackendAlerts });
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
            // Acknowledge the remediation success to the specific client
            socket.emit('remediation_success', {
                id: data.id,
                message: `Successfully quarantined IP ${data.ip} at perimeter firewall.`
            });
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
    // E.g. Querying AlienVault/VT
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
    
    // 3. Broadcast to UI
    io.emit('new_alert', { alert: newAlert });
    
    return res.json({ success: true, message: 'Log successfully ingested, enriched, and broadcasted.', alert: newAlert });
});
server.listen(PORT, () => {
    console.log(`Backend server running with WebSockets on http://localhost:${PORT}`);
});
