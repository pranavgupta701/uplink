# Uplink SOC Detection Rules Master Ledger

This document serves as the authoritative master ledger of all **14 Detection Rules** (Sigma, Wazuh XML, and YARA signatures) implemented in the **Uplink Security & SOC Platform**.

---

## 📊 Master Summary Table

| Rule ID | Rule Name | Engine / Category | Severity | 24h Matches | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`RULE-101`** | SSH Brute-Force Detection | Sigma / Authentication | `P0 - Critical` | 142 | `Active` |
| **`RULE-102`** | AWS CloudTrail Root Login | Sigma / Cloud Security | `P0 - Critical` | 3 | `Active` |
| **`RULE-103`** | Kubernetes Privilege Escalation | Sigma / Container Security | `P1 - High` | 19 | `Active` |
| **`RULE-104`** | FIM Integrity Violation (`/etc/shadow`) | Wazuh / File Integrity | `P0 - Critical` | 7 | `Active` |
| **`RULE-105`** | SCA Vulnerability Severity > 9.0 | Dependency / Supply Chain | `P2 - Medium` | 88 | `Disabled` |
| **`YARA-201`** | Cobalt Strike Beacon Memory Signature | YARA / Malware Memory | `P0 - Critical` | 28 | `Active` |
| **`YARA-202`** | Mimikatz LSA Password Dumper | YARA / Credential Access | `P0 - Critical` | 14 | `Active` |
| **`YARA-203`** | Web Shell Detection (PHP/JSP/ASPX) | YARA / Web Security | `P0 - Critical` | 45 | `Active` |
| **`YARA-204`** | Ransomware Encryptor Header Pattern | YARA / Ransomware | `P0 - Critical` | 2 | `Active` |
| **`YARA-205`** | Reverse Shell / Netcat Spawner | YARA / Execution | `P1 - High` | 31 | `Active` |
| **`YARA-206`** | Log4j / JNDI Remote Code Execution | YARA / Vulnerability RCE | `P0 - Critical` | 56 | `Active` |
| **`YARA-207`** | XMRig CryptoMiner Binary Signature | YARA / Resource Abuse | `P2 - Medium` | 92 | `Active` |
| **`YARA-208`** | Linux Rootkit System Hooking | YARA / Persistence | `P0 - Critical` | 5 | `Active` |
| **`YARA-209`** | PHP Ransomware Web Encryptor | YARA / Ransomware PHP | `P0 - Critical` | 11 | `Active` |

---

## 🛡️ Complete Rule Signatures & Logic

### 1. `RULE-101`: SSH Brute-Force Detection (Sigma Rule)
```yaml
title: SSH Brute-Force Detection
id: RULE-101
status: active
description: Triggers on > 5 failed SSH authentication attempts within 60s from single IP.
logsource:
    product: linux
    service: sshd
detection:
    selection:
        message|contains: 'Failed password for'
    timeframe: 60s
    condition: selection | count() > 5
falsepositives:
    - Admin password typos
level: critical
```

---

### 2. `RULE-102`: AWS CloudTrail Root Login (Sigma Rule)
```yaml
title: AWS CloudTrail Root Account Login
id: RULE-102
status: active
description: Alerts when root account credentials are used for AWS Management Console login.
logsource:
    product: aws
    service: cloudtrail
detection:
    selection:
        eventName: 'ConsoleLogin'
        userIdentity.type: 'Root'
        responseElements.ConsoleLogin: 'Success'
    condition: selection
level: critical
```

---

### 3. `RULE-103`: Kubernetes Privilege Escalation (Sigma Rule)
```yaml
title: Kubernetes Privilege Escalation Container Pod Creation
id: RULE-103
status: active
description: Detects pod creation with hostPath volume or privileged security context.
logsource:
    product: kubernetes
    service: audit
detection:
    selection:
        verb: 'create'
        objectRef.resource: 'pods'
        requestObject.spec.containers.securityContext.privileged: true
    condition: selection
level: high
```

---

### 4. `RULE-104`: FIM Integrity Violation (`/etc/shadow`) (Wazuh XML Rule)
```xml
<group name="syscheck,fim,">
  <rule id="104000" level="12">
    <if_sid>550</if_sid>
    <field name="file">/etc/shadow</field>
    <description>FIM Integrity Violation: Modification or unauthorized access attempt to /etc/shadow file.</description>
    <mitre>
      <id>T1003.008</id>
    </mitre>
  </rule>
</group>
```

---

### 5. `RULE-105`: SCA Vulnerability Severity > 9.0 (Supply Chain Rule)
```yaml
title: Software Composition Analysis (SCA) Critical CVSS > 9.0
id: RULE-105
status: disabled
description: Automated alert when npm or pip dependency vulnerability CVSS score exceeds 9.0.
detection:
    cvss_score: ">= 9.0"
    package_managers: ["npm", "pip", "cargo", "maven"]
condition: cvss_score >= 9.0
level: medium
```

---

### 6. `YARA-201`: Cobalt Strike Beacon Memory Signature
```yara
rule YARA_Cobalt_Strike_Beacon_Memory {
    meta:
        id = "YARA-201"
        author = "Uplink Threat Research Team"
        description = "Scans process memory for Cobalt Strike C2 DLL reflective loader headers ($reflect_loader, $c2_pipe)."
        category = "Malware / Memory"
        severity = "P0 - Critical"
    strings:
        $reflect_loader = { 4D 5A 41 52 55 48 89 E5 48 81 EC }
        $c2_pipe = "\\\\.\\pipe\\msagent_" ascii wide
        $beacon_loader = "ReflectiveLoader" ascii
    condition:
        uint16(0) == 0x5A4D and ($reflect_loader or ($c2_pipe and $beacon_loader))
}
```

---

### 7. `YARA-202`: Mimikatz LSA Password Dumper
```yara
rule YARA_Mimikatz_LSA_Password_Dumper {
    meta:
        id = "YARA-202"
        author = "Uplink Threat Research Team"
        description = "Detects unencrypted Mimikatz sekurlsa::logonpasswords and lsass memory injection artifacts."
        category = "Credential Access"
        severity = "P0 - Critical"
    strings:
        $mimikatz_str1 = "sekurlsa::logonpasswords" ascii wide nocase
        $mimikatz_str2 = "lsadump::sam" ascii wide nocase
        $mimikatz_dll1 = "mimidrv.sys" ascii wide nocase
    condition:
        2 of ($mimikatz_str*) or $mimikatz_dll1
}
```

---

### 8. `YARA-203`: Web Shell Detection (PHP/JSP/ASPX)
```yara
rule YARA_Obfuscated_Webshell {
    meta:
        id = "YARA-203"
        author = "Uplink Threat Research Team"
        description = "Identifies obfuscated webshells executing shell_exec, system, passthru, or eval(base64_decode())."
        category = "Web Security"
        severity = "P0 - Critical"
    strings:
        $php_tag = "<?php" ascii
        $exec_func1 = "shell_exec(" ascii nocase
        $exec_func2 = "passthru(" ascii nocase
        $b64_eval = "eval(base64_decode(" ascii nocase
        $c99_shell = "c99shell" ascii nocase
    condition:
        ($php_tag and ($b64_eval or 2 of ($exec_func*))) or $c99_shell
}
```

---

### 9. `YARA-204`: Ransomware Encryptor Header Pattern
```yara
rule YARA_Ransomware_LockBit_BlackCat {
    meta:
        id = "YARA-204"
        author = "Uplink Threat Research Team"
        description = "Detects LockBit / BlackCat file system traversal, VSS deletion commands, and extension appending."
        category = "Ransomware"
        severity = "P0 - Critical"
    strings:
        $vss_delete = "vssadmin.exe Delete Shadows /All /Quiet" ascii wide nocase
        $bcdedit = "bcdedit /set {default} recoveryenabled No" ascii wide nocase
        $note_text = "ALL YOUR FILES HAVE BEEN ENCRYPTED" ascii wide nocase
    condition:
        any of ($vss_delete, $bcdedit) or $note_text
}
```

---

### 10. `YARA-205`: Reverse Shell / Netcat Spawner
```yara
rule YARA_Reverse_Shell_Netcat_Spawner {
    meta:
        id = "YARA-205"
        author = "Uplink Threat Research Team"
        description = "Flags nc -e /bin/bash, bash -i >& /dev/tcp, or python pty socket spawns in user processes."
        category = "Execution"
        severity = "P1 - High"
    strings:
        $nc_exec = "nc -e /bin/" ascii nocase
        $bash_tcp = "bash -i >& /dev/tcp/" ascii nocase
        $python_pty = "python -c 'import pty; pty.spawn(\"/bin/sh\")'" ascii nocase
    condition:
        any of them
}
```

---

### 11. `YARA-206`: Log4j / JNDI Remote Code Execution
```yara
rule YARA_Log4j_JNDI_Exploit {
    meta:
        id = "YARA-206"
        author = "Uplink Threat Research Team"
        description = "Monitors inbound payloads matching ${jndi:ldap://...} or ${jndi:rmi://...} string patterns."
        category = "Vulnerability / RCE"
        severity = "P0 - Critical"
    strings:
        $jndi_ldap = "${jndi:ldap://" ascii nocase
        $jndi_rmi = "${jndi:rmi://" ascii nocase
        $jndi_dns = "${jndi:dns://" ascii nocase
    condition:
        any of them
}
```

---

### 12. `YARA-207`: XMRig CryptoMiner Binary Signature
```yara
rule YARA_XMRig_CryptoMiner {
    meta:
        id = "YARA-207"
        author = "Uplink Threat Research Team"
        description = "Scans for Stratum mining protocol headers, CPU-mining loops, and unauthorized xmr-stak binaries."
        category = "Resource Abuse"
        severity = "P2 - Medium"
    strings:
        $xmrig_str1 = "xmrig" ascii nocase
        $xmrig_str2 = "stratum+tcp://" ascii nocase
        $xmrig_str3 = "rx/0" ascii nocase
    condition:
        2 of ($xmrig_str*)
}
```

---

### 13. `YARA-208`: Linux Rootkit System Hooking
```yara
rule YARA_Linux_LKM_Rootkit {
    meta:
        id = "YARA-208"
        author = "Uplink Threat Research Team"
        description = "Identifies LKM (Loadable Kernel Module) rootkits overriding sys_call_table or hijacking /etc/ld.so.preload."
        category = "Persistence"
        severity = "P0 - Critical"
    strings:
        $preload = "/etc/ld.so.preload" ascii
        $syscall_table = "sys_call_table" ascii
        $module_hide = "list_del(&THIS_MODULE->list)" ascii
    condition:
        $preload or ($syscall_table and $module_hide)
}
```

---

### 14. `YARA-209`: PHP Ransomware Web Encryptor
```yara
rule YARA_PHP_Ransomware_Encryptor {
    meta:
        id = "YARA-209"
        author = "Uplink Threat Research Team"
        description = "Detects PHP scripts executing directory traversal with openssl_encrypt to encrypt web root files."
        category = "Ransomware / PHP"
        severity = "P0 - Critical"
    strings:
        $php_tag = "<?php" ascii nocase
        $crypto_func = "openssl_encrypt(" ascii nocase
        $dir_iter = "RecursiveDirectoryIterator" ascii nocase
        $file_op = "file_put_contents(" ascii nocase
        $ransom_msg = "YOUR FILES HAVE BEEN ENCRYPTED" ascii nocase
    condition:
        $php_tag and $crypto_func and ($dir_iter or $ransom_msg) and $file_op
}
```
