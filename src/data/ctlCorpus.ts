import {
  PolicyDocument,
  StandardDocument,
  ProcedureDocument,
  ControlDefinition,
  HistoricalFinding,
  RemediationAction,
  EvidenceArtifact,
} from '../types/ctl';

export const POLICIES: PolicyDocument[] = [
  {
    id: 'pol-sec-01',
    code: 'POL-SEC-01',
    title: 'Enterprise Information Security Governance Policy',
    category: 'policy',
    version: '4.2',
    effectiveDate: '2024-01-15',
    owner: 'Chief Information Security Officer (CISO)',
    regulatoryFrameworks: ['SOX Section 404', 'SOC 2 Type II (CC6, CC7)', 'ISO/IEC 27001:2022 A.5, A.9', 'NIST CSF 2.0 PR.AC'],
    summary: 'Establishes top-level executive mandates for information security, role-based access governance, cryptographic safeguards, and mandatory continuous control testing.',
    sections: [
      {
        sectionNumber: '3.1',
        title: 'Principle of Least Privilege and Segregation of Duties',
        content: 'All computing assets, production environments, and financial processing systems must enforce least privilege. No single individual shall possess end-to-end authorization to author, approve, and execute production changes or financial ledger modifications. Privileged administrative rights require dual authorization and formal quarterly re-attestation.',
        keyRequirements: [
          'Dual authorization for all privileged access elevations.',
          'Quarterly recertification of administrative credentials.',
          'Strict segregation between software developers and production deployment pipelines.'
        ],
        controllerFocusPoints: [
          'Verify that access requests include business rationale signed off by resource owner.',
          'Validate that developer IAM roles do not contain AWS AdministratorAccess or direct SQL write permissions.'
        ]
      },
      {
        sectionNumber: '4.2',
        title: 'User Lifecycle Management and Timely Revocation',
        content: 'Access privileges for terminated employees, contractors, and third-party vendors must be revoked within 24 hours of separation notice. For involuntary separations or adverse terminations, access must be revoked immediately upon HR notification, but never exceeding 2 hours.',
        keyRequirements: [
          'Voluntary terminations: Deactivation within 24 hours.',
          'Involuntary/Hostile terminations: Immediate deactivation (max 2 hours).',
          'Automated synchronization between Core HRIS (Workday) and Identity Provider (Okta).'
        ],
        controllerFocusPoints: [
          'Cross-match HR effective termination timestamp against Okta suspension audit timestamp.',
          'Sample both full-time employees and external contractors.'
        ]
      },
      {
        sectionNumber: '5.4',
        title: 'Independent Control Assurance and Testing Cadence',
        content: 'Control Testing & Lifecycle (CTL) teams shall conduct independent design and operating effectiveness assessments on all Key Financial Reporting Controls at least semi-annually. All findings must be registered in the enterprise GRC system within 5 business days of test completion.',
        keyRequirements: [
          'Semi-annual testing for ITGC Key Controls.',
          'Registration of deficiencies within 5 business days.',
          'Mandatory human controller sign-off; algorithmic scripts cannot independently issue final control certifications.'
        ],
        controllerFocusPoints: [
          'Verify workpaper audit trails include primary evidence attachments and controller signoff timestamps.'
        ]
      }
    ]
  },
  {
    id: 'pol-dat-02',
    code: 'POL-DAT-02',
    title: 'Enterprise Data Protection and Cryptographic Security Policy',
    category: 'policy',
    version: '3.1',
    effectiveDate: '2023-11-01',
    owner: 'Chief Privacy Officer & VP Security Architecture',
    regulatoryFrameworks: ['GLBA', 'GDPR Art. 32', 'PCI-DSS v4.0 Req 3, 4', 'SOC 2 CC6.6'],
    summary: 'Governs classification, retention, encryption in transit and at rest, and disposal of confidential customer, financial, and personal identifiable information.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Mandatory Encryption Standards for Data at Rest and in Transit',
        content: 'All sensitive customer records (Restricted and Confidential tiers) must be encrypted using AES-256 or ChaCha20-Poly1305 at rest. All network communications across untrusted or inter-datacenter links must enforce TLS 1.3 or TLS 1.2 with Perfect Forward Secrecy. Unencrypted cleartext protocols (HTTP, FTP, Telnet) are strictly prohibited.',
        keyRequirements: [
          'AES-256 for all relational and object data stores.',
          'TLS 1.2+ mandatory for all external and internal microservice endpoints.',
          'Annual automated rotation of customer data encryption keys (KMS keys).'
        ],
        controllerFocusPoints: [
          'Inspect Terraform/CloudFormation templates and AWS Config rules for s3-bucket-server-side-encryption-enabled and rds-storage-encrypted.',
          'Verify TLS cipher suites disable SHA-1 and 3DES.'
        ]
      },
      {
        sectionNumber: '4.3',
        title: 'Data Retention and Immutable Log Archiving',
        content: 'Audit logs reflecting authentication events, administrative privilege escalation, and database modifications must be retained for a minimum of 365 days in Write-Once-Read-Many (WORM) storage with cryptographic integrity seals.',
        keyRequirements: [
          '365 days retention for ITGC audit logs.',
          'Immutable storage (S3 Object Lock Compliance Mode or Azure Immutable Blob).',
          'Weekly audit trail integrity validation.'
        ],
        controllerFocusPoints: [
          'Validate compliance mode locks cannot be bypassed even by AWS root or domain administrator accounts.'
        ]
      }
    ]
  },
  {
    id: 'pol-bcp-04',
    code: 'POL-BCP-04',
    title: 'Business Continuity and Disaster Recovery Governance Policy',
    category: 'policy',
    version: '2.8',
    effectiveDate: '2024-02-01',
    owner: 'Head of Infrastructure Resilience & COO',
    regulatoryFrameworks: ['FINRA Rule 4370', 'FFIEC BCP Handbook', 'SOC 2 CC9.1', 'ISO 22301:2019'],
    summary: 'Defines enterprise Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for Tier-1 mission-critical processing pipelines.',
    sections: [
      {
        sectionNumber: '1.4',
        title: 'Tier-1 System Resilience and Maximum Tolerable Downtime',
        content: 'Tier-1 core transactional banking and ledger systems must maintain a Recovery Time Objective (RTO) of less than 4 hours and a Recovery Point Objective (RPO) of less than 15 minutes. Multi-region automated replication and cold/warm standbys must be deployed across independent availability regions separated by at least 250 miles.',
        keyRequirements: [
          'Tier-1 RTO < 4 Hours; Tier-1 RPO < 15 Minutes.',
          'Cross-region geographical redundancy (>250 miles).',
          'Daily automated backup snapshot validation with checksum verification.'
        ],
        controllerFocusPoints: [
          'Review configuration of AWS Aurora Global Database or Azure SQL Active Geo-Replication.',
          'Examine recovery time metrics during actual outage simulations.'
        ]
      },
      {
        sectionNumber: '3.2',
        title: 'Annual Live Failover and Restoration Simulation Mandate',
        content: 'All Tier-1 business systems must undergo a live or full-scale sandbox failover exercise at least annually. Paper walk-throughs or tabletop-only reviews are insufficient for control certification of operational effectiveness.',
        keyRequirements: [
          'Annual live failover restoration exercise.',
          'Production snapshot restoration into an isolated VPC with functional transactional testing.',
          'Post-mortem reporting submitted to Executive Risk Committee within 14 calendar days.'
        ],
        controllerFocusPoints: [
          'Ensure evidence includes execution logs, snapshot restore IDs, and independent database consistency checks.'
        ]
      }
    ]
  },
  {
    id: 'pol-vrm-03',
    code: 'POL-VRM-03',
    title: 'Third-Party and Vendor Risk Management Policy',
    category: 'policy',
    version: '3.0',
    effectiveDate: '2023-09-15',
    owner: 'Chief Procurement Officer & VP Third-Party Risk',
    regulatoryFrameworks: ['OCC Bulletin 2013-29', 'EBA Guidelines on Outsourcing', 'SOC 2 CC9.2', 'ISO 27001 A.15'],
    summary: 'Enforces due diligence, annual SOC 2 report inspections, subprocessor risk tiering, and contractually binding security commitments for external SaaS and cloud vendors.',
    sections: [
      {
        sectionNumber: '2.3',
        title: 'Mandatory Vendor Assurance and SOC 2 Type II Evaluation',
        content: 'All critical third-party vendors hosting or processing customer data must provide an independent SOC 2 Type II report annually covering Security, Confidentiality, and Availability. Bridge letters are required for any gap between report expiration and fiscal year-end exceeding 30 calendar days.',
        keyRequirements: [
          'Annual SOC 2 Type II examination covering minimum 6 months testing period.',
          'Bridge letters mandatory for reporting gaps exceeding 30 days (max bridge span: 90 days).',
          'Annual review of User Entity Controls (CUECs / Complementary User Entity Controls).'
        ],
        controllerFocusPoints: [
          'Verify that internal controls satisfy all required CUECs specified in vendor SOC reports.',
          'Check that bridge letters are signed by an authorized corporate officer of the vendor.'
        ]
      }
    ]
  },
  {
    id: 'pol-iam-05',
    code: 'POL-IAM-05',
    title: 'Identity, Authentication and Credential Governance Policy',
    category: 'policy',
    version: '2.4',
    effectiveDate: '2024-03-01',
    owner: 'VP Identity and Access Management',
    regulatoryFrameworks: ['NIST SP 800-63B', 'SOX 404 ITGC', 'SOC 2 CC6.1', 'CIS Control 5, 6'],
    summary: 'Mandates enterprise password entropy, phishing-resistant multi-factor authentication, privileged account vaults, and continuous credential rotation.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Phishing-Resistant Multi-Factor Authentication',
        content: 'All interactive access to corporate and production infrastructure requires phishing-resistant multi-factor authentication (FIDO2/WebAuthn or hardware security keys). Legacy SMS and voice OTPs are banned for all corporate and privileged workforce accounts.',
        keyRequirements: [
          'FIDO2/WebAuthn mandatory for all employees and contractors.',
          'Zero exceptions for production SSH, database access, or AWS console logins.',
          'Session timeout enforced after 15 minutes of inactivity on production jump hosts.'
        ],
        controllerFocusPoints: [
          'Inspect Okta sign-on policies and verify SMS/Voice factors are set to Deny.',
          'Review session timeout parameters across privileged bastion hosts.'
        ]
      },
      {
        sectionNumber: '4.1',
        title: 'Service Accounts and Machine Identity Governance',
        content: 'Machine identities, CI/CD runners, and API service accounts must utilize ephemeral tokens or vault-managed credentials. Hardcoded static API keys or long-lived credentials in source code repositories result in immediate revocation.',
        keyRequirements: [
          'Maximum 90-day lifetime for machine credentials unless managed by HashiCorp Vault.',
          'Zero hardcoded secrets allowed in source repositories or container images.',
          'Automated secrets scanning on all Git pull requests.'
        ],
        controllerFocusPoints: [
          'Verify GitHub Secret Scanning / Trufflehog integration blocking commits containing API keys.',
          'Sample 25 service accounts in IAM and check credential creation dates.'
        ]
      }
    ]
  },
  {
    id: 'pol-chg-06',
    code: 'POL-CHG-06',
    title: 'Software Development Lifecycle and Change Governance Policy',
    category: 'policy',
    version: '3.5',
    effectiveDate: '2024-01-20',
    owner: 'VP Engineering & Head of Quality Assurance',
    regulatoryFrameworks: ['SOX Section 404 (Change Management ITGC)', 'SOC 2 CC8.1', 'ISO 27001 A.12.1.2'],
    summary: 'Governs code review, branch protection, peer approval, CI/CD automated test gates, and formal Change Advisory Board (CAB) authorization before production deployment.',
    sections: [
      {
        sectionNumber: '2.2',
        title: 'Peer Code Review and Branch Protection Mandates',
        content: 'All source code destined for production must undergo peer code review by at least one qualified engineer other than the author. Pull requests must satisfy automated security scanning, unit testing (>80% coverage), and signed commit verification before merge.',
        keyRequirements: [
          'Minimum 1 independent peer review approval on all production pull requests.',
          'Branch protection rules enforcing required status checks and disabling direct push to main/prod.',
          'Cryptographically signed commits (GPG/SSH keys).'
        ],
        controllerFocusPoints: [
          'Sample 30 production releases; cross-reference GitHub PR author vs reviewer IDs.',
          'Confirm that repository admin privileges are restricted and do not bypass branch protection.'
        ]
      },
      {
        sectionNumber: '3.4',
        title: 'Segregation Between Software Developers and Production Deployment',
        content: 'Developers shall not have direct write or deployment privileges to production environments. Deployments must occur strictly via automated CI/CD deployment pipelines operating with dedicated service identities.',
        keyRequirements: [
          'No interactive developer access to production clusters or servers.',
          'Pipeline authorization tied to approved Jira/ServiceNow change tickets.',
          'Automated deployment logs archived to SIEM.'
        ],
        controllerFocusPoints: [
          'Audit AWS IAM and Kubernetes RBAC roles to verify zero developer group bindings to cluster-admin.'
        ]
      }
    ]
  },
  {
    id: 'pol-vul-07',
    code: 'POL-VUL-07',
    title: 'Enterprise Vulnerability Management and Patching Policy',
    category: 'policy',
    version: '2.6',
    effectiveDate: '2023-12-05',
    owner: 'Head of Vulnerability Operations & Red Team',
    regulatoryFrameworks: ['PCI-DSS Req 6.2', 'SOC 2 CC7.1', 'NIST CSF PR.IP-12', 'ISO 27001 A.12.6'],
    summary: 'Establishes vulnerability scanning cadences, asset inventory requirements, and strict remediation Service Level Agreements (SLAs) based on CVSS severity ratings.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Vulnerability Remediation SLAs by CVSS Severity',
        content: 'Identified vulnerabilities must be remediated or mitigated with compensating controls within strict deadlines: Critical (CVSS 9.0-10.0) within 7 calendar days; High (CVSS 7.0-8.9) within 30 calendar days; Medium (CVSS 4.0-6.9) within 60 calendar days.',
        keyRequirements: [
          'Critical (CVSS 9+): 7 calendar days.',
          'High (CVSS 7.0-8.9): 30 calendar days.',
          'Medium (CVSS 4.0-6.9): 60 calendar days.',
          'Mandatory re-scan verification within 24 hours of patch deployment.'
        ],
        controllerFocusPoints: [
          'Calculate remediation duration from initial detection timestamp to verified closure timestamp.',
          'Sample 25 closed vulnerability tickets to verify compliance with the 7/30/60 day SLAs.'
        ]
      }
    ]
  },
  {
    id: 'pol-log-08',
    code: 'POL-LOG-08',
    title: 'Security Telemetry, Logging and SIEM Surveillance Policy',
    category: 'policy',
    version: '2.9',
    effectiveDate: '2024-02-15',
    owner: 'Head of Security Operations Center (SOC)',
    regulatoryFrameworks: ['PCI-DSS Req 10', 'SOX 404 ITGC', 'SOC 2 CC7.2', 'NIST SP 800-92'],
    summary: 'Directs the capture, clock synchronization, centralized forwarding, alerting, and retention of all security events across infrastructure and applications.',
    sections: [
      {
        sectionNumber: '1.3',
        title: 'Centralized Log Ingestion and Clock Synchronization',
        content: 'All production servers, network appliances, and cloud workloads must synchronize system clocks using authenticated Network Time Protocol (NTP) with drift under 50ms. Security logs must be forwarded in near real-time to the enterprise SIEM platform.',
        keyRequirements: [
          'NTP synchronization across all hosts; max allowable clock drift: 50 milliseconds.',
          'Centralized ingestion to enterprise SIEM within 5 minutes of event generation.',
          'Log loss alerts triggered if agent ingestion stops for more than 15 minutes.'
        ],
        controllerFocusPoints: [
          'Verify chrony or ntp daemon configurations across baseline OS Golden Images.',
          'Inspect SIEM pipeline forwarder health metrics and drop alarms.'
        ]
      }
    ]
  },
  {
    id: 'pol-inc-09',
    code: 'POL-INC-09',
    title: 'Cyber Incident Response and Regulatory Breach Notification Policy',
    category: 'policy',
    version: '3.2',
    effectiveDate: '2024-01-10',
    owner: 'General Counsel & CISO',
    regulatoryFrameworks: ['SEC Form 8-K Cyber Disclosure Rules', 'GDPR Art. 33/34', 'NYDFS 23 NYCRR 500.17', 'HIPAA'],
    summary: 'Governs incident classification, severity triage, containment procedures, and statutory regulatory disclosure deadlines.',
    sections: [
      {
        sectionNumber: '3.1',
        title: 'Regulatory Escalation and Disclosure Deadlines',
        content: 'Material cybersecurity incidents must be reported to the SEC via Form 8-K Item 1.05 within 4 business days of determining materiality. Breaches involving EU citizen PII must be notified to supervisory authorities within 72 hours of becoming aware under GDPR Art. 33.',
        keyRequirements: [
          'SEC Form 8-K Item 1.05: File within 4 business days of materiality determination.',
          'GDPR Art. 33: Notify Data Protection Authorities within 72 hours.',
          'Annual executive tabletop simulation with legal and audit representation.'
        ],
        controllerFocusPoints: [
          'Verify legal materiality review documentation and timestamped escalation forms.',
          'Inspect incident workpapers for root-cause and containment post-mortems.'
        ]
      }
    ]
  },
  {
    id: 'pol-phy-10',
    code: 'POL-PHY-10',
    title: 'Physical Datacenter and Environmental Security Policy',
    category: 'policy',
    version: '2.1',
    effectiveDate: '2023-08-01',
    owner: 'Head of Facilities & Corporate Security',
    regulatoryFrameworks: ['SOC 2 CC6.4, CC6.5', 'ISO 27001 A.11', 'NIST SP 800-53 PE'],
    summary: 'Establishes badge access barriers, biometric controls, visitor logging, CCTV surveillance retention, and environmental monitoring for corporate datacenters.',
    sections: [
      {
        sectionNumber: '2.2',
        title: 'Physical Access Control and Visitor Escort',
        content: 'Datacenter server rooms require biometric dual-factor entry and electronic badge logging. Visitors must be escorted at all times by badged personnel and logged in visitor registers retained for at least 3 years.',
        keyRequirements: [
          'Biometric and badge dual authorization.',
          'Continuous 24/7 CCTV surveillance with 90-day video retention.',
          'Quarterly review of physical badge authorization rosters.'
        ],
        controllerFocusPoints: [
          'Sample physical access badge swipe logs against terminated employee lists.',
          'Review third-party colocation SOC 2 Type II reports for physical security testing.'
        ]
      }
    ]
  },
  {
    id: 'pol-dev-11',
    code: 'POL-DEV-11',
    title: 'Secure Application Development and CI/CD Governance Policy',
    category: 'policy',
    version: '2.3',
    effectiveDate: '2024-02-28',
    owner: 'Head of Application Security (AppSec)',
    regulatoryFrameworks: ['OWASP Top 10', 'NIST SSDF (SP 800-218)', 'SOC 2 CC8.1'],
    summary: 'Mandates Static Application Security Testing (SAST), Software Bill of Materials (SBOM) generation, container vulnerability scanning, and signed artifact provenance.',
    sections: [
      {
        sectionNumber: '2.4',
        title: 'Mandatory Automated Security Testing in Build Pipelines',
        content: 'Every deployment pipeline must integrate automated SAST and Software Composition Analysis (SCA). Build pipelines must automatically fail and block promotion if Critical or High severity flaws are introduced.',
        keyRequirements: [
          'Automated SAST scanning on every pull request.',
          'SCA scanning blocking vulnerable dependencies with known exploits.',
          'Cryptographic artifact signing via Cosign or Sigstore.'
        ],
        controllerFocusPoints: [
          'Inspect GitHub Actions or Jenkins pipeline configuration for mandatory security gate blocks.'
        ]
      }
    ]
  },
  {
    id: 'pol-ai-12',
    code: 'POL-AI-12',
    title: 'Enterprise Artificial Intelligence and Algorithmic Model Governance Policy',
    category: 'policy',
    version: '1.2',
    effectiveDate: '2024-04-01',
    owner: 'Chief AI Ethics Officer & Chief Risk Officer',
    regulatoryFrameworks: ['EU AI Act', 'NIST AI RMF 1.0', 'SEC Proposed Predictive Data Analytics Rules'],
    summary: 'Establishes governance boundaries, source-grounding mandates, model validation standards, and strict human-in-the-loop accountability for AI decision support tools.',
    sections: [
      {
        sectionNumber: '1.1',
        title: 'Decision Support Only and Human Controller Sovereignty',
        content: 'AI systems deployed in internal audit, compliance, financial reporting, and controls management operate strictly in an advisory, decision support capacity. AI models are prohibited from issuing autonomous pass/fail audit determinations, accepting risks, or certifying regulatory filings. All final decisions remain the sole statutory responsibility of the human controller.',
        keyRequirements: [
          'AI outputs must be explicitly labeled as Decision Support Only.',
          'Every AI recommendation must include source-grounded citations to governing policies/standards.',
          'Controllers must manually review, corroborate, and sign off on all workpapers.'
        ],
        controllerFocusPoints: [
          'Validate that compliance software interfaces contain prominent disclaimers and require manual controller approval steps.'
        ]
      }
    ]
  }
];

export const STANDARDS: StandardDocument[] = [
  {
    id: 'std-iam-101',
    code: 'STD-IAM-101',
    title: 'Identity and Access Management Technical Standard',
    category: 'standard',
    version: '4.1',
    effectiveDate: '2024-02-01',
    governingPolicyCode: 'POL-SEC-01',
    owner: 'Director of Identity Architecture',
    scope: 'Enterprise-wide identity stores, directory services (Okta, Azure AD, AWS IAM), and privileged accounts.',
    sections: [
      {
        sectionNumber: '2.2',
        title: 'Authentication, Passwords, and Multi-Factor Authentication',
        content: 'Hardware-backed or FIDO2/WebAuthn phishing-resistant MFA is mandatory for all administrative access to production systems, code repositories, and cloud management consoles. SMS and telephony-based OTP are strictly prohibited. Passwords must contain a minimum of 16 characters with high entropy if used in conjunction with MFA.',
        specifications: [
          'FIDO2/WebAuthn for production jump hosts and AWS SSO.',
          'Password length: minimum 16 characters.',
          'Max invalid login attempts before lockout: 5 attempts; lockout duration: 30 minutes minimum.'
        ],
        enforcementCriteria: [
          'Automated policy push via Okta sign-on rules.',
          'Exemptions require formal CISO risk acceptance with 90-day max duration.'
        ]
      },
      {
        sectionNumber: '3.5',
        title: 'Automated Account Deprovisioning SLAs and Inactivity Purge',
        content: 'Standard employee departures must result in Okta account suspension within 24 hours of HR separation trigger. Associated cloud infrastructure accounts (AWS IAM roles, GitHub org seats, production SSH keys) must be purged within 48 hours. Involuntary terminations require immediate suspension within 2 hours. Accounts inactive for greater than 60 days must be automatically locked.',
        specifications: [
          'Voluntary separation: Okta suspension <= 24 hours.',
          'Involuntary separation: Okta suspension <= 2 hours.',
          'Downstream SaaS/Cloud accounts revoked <= 48 hours.',
          'Inactivity lockout threshold: 60 consecutive days without successful authentication.'
        ],
        enforcementCriteria: [
          'Daily reconciliation script comparing Workday termination dates against Okta status.',
          'Exceptions logged to Security Incident Response Queue.'
        ]
      },
      {
        sectionNumber: '4.1',
        title: 'Quarterly User Access Review Scope and Evidence Artifacts',
        content: 'UAR campaigns must be executed quarterly via SailPoint IdentityNow covering 100% of privileged roles, domain admins, database superusers, and production financial systems. Managers must review, confirm business need, or revoke each entitlement within 15 calendar days.',
        specifications: [
          '100% census of privileged and financial reporting entitlements.',
          'Review window: 15 calendar days from campaign launch.',
          'Un-reviewed accounts auto-revoked on Day 16 (fail-safe revocation).'
        ],
        enforcementCriteria: [
          'SailPoint signed campaign summary PDF archived to GRC repository.'
        ]
      }
    ]
  },
  {
    id: 'std-cry-202',
    code: 'STD-CRY-202',
    title: 'Cryptographic Architecture, Ciphers and Key Management Standard',
    category: 'standard',
    version: '3.3',
    effectiveDate: '2023-12-01',
    governingPolicyCode: 'POL-DAT-02',
    owner: 'Chief Cryptographer & Principal Security Engineer',
    scope: 'All database encryption, file systems, API communications, and Hardware Security Modules (HSMs).',
    sections: [
      {
        sectionNumber: '1.2',
        title: 'Approved and Prohibited Cryptographic Primitives',
        content: 'Approved symmetric algorithms: AES-GCM (256-bit key) and ChaCha20-Poly1305. Approved asymmetric algorithms: RSA-3072 or higher, ECDSA with Curve P-256 or Curve P-384, and Ed25519. Prohibited algorithms: DES, 3DES, RC4, MD5, SHA-1, and RSA keys under 2048 bits.',
        specifications: [
          'AES-256-GCM required for all database transparent data encryption (TDE).',
          'TLS cipher suites must enforce PFS: ECDHE-RSA-AES256-GCM-SHA384 or ECDHE-ECDSA-AES256-GCM-SHA384.',
          'All cryptographic keys must reside in FIPS 140-2 Level 3 validated HSMs (AWS CloudHSM, Azure Dedicated HSM).'
        ],
        enforcementCriteria: [
          'SonarQube static analysis scanning for banned cipher primitives in source code.'
        ]
      },
      {
        sectionNumber: '2.4',
        title: 'Customer Master Key (CMK) Lifecycle and Automated Rotation',
        content: 'Customer Master Keys (CMKs) in AWS KMS or Azure Key Vault must have automated annual rotation enabled. Key destruction requires a minimum 30-day pending window with dual-custodian cryptographic authorization.',
        specifications: [
          'Automated KMS rotation period: Exactly 365 calendar days.',
          'Pending deletion duration: 30 days mandatory hold period.',
          'Dual custodian approval required to initiate key retirement.'
        ],
        enforcementCriteria: [
          'AWS Config rule kms-cmk-rotation-enabled evaluated on all accounts.'
        ]
      }
    ]
  },
  {
    id: 'std-log-303',
    code: 'STD-LOG-303',
    title: 'Security Telemetry, Ingestion Pipelines and SIEM Storage Standard',
    category: 'standard',
    version: '2.5',
    effectiveDate: '2024-01-10',
    governingPolicyCode: 'POL-LOG-08',
    owner: 'Lead SOC Architect',
    scope: 'Centralized SIEM (Splunk Cloud / Datadog), cloud trail logs, VPC flow logs, and IAM activity feeds.',
    sections: [
      {
        sectionNumber: '1.1',
        title: 'Mandatory Audit Event Fields and JSON Log Schema',
        content: 'All application and infrastructure audit logs must contain the following standard JSON schema fields: event_id (UUID), timestamp_utc (ISO 8601 with millisecond precision), actor_id, actor_ip, session_id, action_name, resource_target, http_status, and result (SUCCESS/FAILURE). Missing required fields causes pipeline validation drop alerts.',
        specifications: [
          'Schema compliance: 100% adherence to Enterprise Common Event Format (ECEF).',
          'Time zone standard: Coordinated Universal Time (UTC) exclusively.',
          'NTP synchronization accuracy: Maximum drift 50ms from pool.ntp.org stratum 1 servers.'
        ],
        enforcementCriteria: [
          'Kafka pipeline schema validation filter rejecting non-compliant payloads.'
        ]
      },
      {
        sectionNumber: '2.3',
        title: 'SIEM Ingestion Latency and WORM Storage Protection',
        content: 'Security logs must be indexed in the SIEM within 5 minutes of occurrence. Once written to object storage, logs must be secured using AWS S3 Object Lock in Compliance Mode for 365 days. Retention periods cannot be altered or bypassed even by root AWS account credentials.',
        specifications: [
          'End-to-end ingestion latency: < 300 seconds (5 minutes).',
          'WORM lock duration: 365 calendar days.',
          'Object Lock mode: COMPLIANCE mode mandatory (Governance mode is prohibited).'
        ],
        enforcementCriteria: [
          'Automated health probe checking S3 Bucket ObjectLockConfiguration.'
        ]
      }
    ]
  },
  {
    id: 'std-vul-404',
    code: 'STD-VUL-404',
    title: 'Vulnerability Prioritization, Scoring and Remediation SLAs Standard',
    category: 'standard',
    version: '3.0',
    effectiveDate: '2023-11-20',
    governingPolicyCode: 'POL-VUL-07',
    owner: 'Director of Vulnerability Management',
    scope: 'Cloud virtual machines, container images, external web perimeters, and third-party libraries.',
    sections: [
      {
        sectionNumber: '1.4',
        title: 'Vulnerability Scoring Criteria and Exploitation Multipliers',
        content: 'Vulnerabilities are prioritized by CVSS v3.1 base score adjusted by CISA Known Exploited Vulnerabilities (KEV) catalog presence. Any vulnerability listed on CISA KEV automatically escalates to Critical SLA (7 calendar days) regardless of base score.',
        specifications: [
          'Critical (CVSS >= 9.0 or CISA KEV): 7 calendar days to patch or mitigate.',
          'High (CVSS 7.0 - 8.9): 30 calendar days to patch or mitigate.',
          'Medium (CVSS 4.0 - 6.9): 60 calendar days to patch.',
          'Low (CVSS < 4.0): 90 calendar days or next maintenance cycle.'
        ],
        enforcementCriteria: [
          'Weekly Qualys/Wiz automated scans across 100% of IP and cloud asset census.',
          'Overdue tickets automatically escalate to VP Engineering and CISO.'
        ]
      }
    ]
  },
  {
    id: 'std-net-505',
    code: 'STD-NET-505',
    title: 'Network Segmentation, Microsegmentation and Zero-Trust Perimeters Standard',
    category: 'standard',
    version: '2.2',
    effectiveDate: '2024-02-10',
    governingPolicyCode: 'POL-SEC-01',
    owner: 'Principal Network Security Architect',
    scope: 'Corporate VPCs, AWS Transit Gateways, Kubernetes service meshes, and perimeter firewalls.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Microsegmentation and Ingress/Egress Restrictive Filtering',
        content: 'Production VPCs must enforce explicit default-deny inbound and outbound security group rules. Direct SSH (port 22) or RDP (port 3389) from the public Internet (0.0.0.0/0) is strictly blocked by AWS SCPs. Inter-service traffic must utilize mutual TLS (mTLS) with Envoy proxies.',
        specifications: [
          'Default deny on all security groups.',
          'Zero public IPv4 addresses assigned to database or application tier workloads.',
          'mTLS encryption with automated certificate rotation every 30 days.'
        ],
        enforcementCriteria: [
          'AWS GuardDuty and AWS Config rule vpc-default-security-group-closed.'
        ]
      }
    ]
  },
  {
    id: 'std-cld-606',
    code: 'STD-CLD-606',
    title: 'Multi-Cloud Infrastructure Security Configuration Standard',
    category: 'standard',
    version: '3.1',
    effectiveDate: '2024-03-05',
    governingPolicyCode: 'POL-SEC-01',
    owner: 'Director of Cloud Engineering & DevSecOps',
    scope: 'AWS, Azure, and GCP organizations, accounts, and infrastructure-as-code modules.',
    sections: [
      {
        sectionNumber: '1.3',
        title: 'Cloud Storage Public Access Block and SCP Guardrails',
        content: 'S3 Block Public Access must be enabled at both the AWS Account level and Bucket level. Service Control Policies (SCPs) must prevent any IAM user or administrator from disabling public access blocks or deleting CloudTrail multi-region trails.',
        specifications: [
          'S3 Public Access Block: 4/4 flags enabled at Account level.',
          'CloudTrail multi-region logging enabled with log file validation on.',
          'AWS IAM root accounts secured with hardware MFA and zero access keys generated.'
        ],
        enforcementCriteria: [
          'Wiz CSPM continuous posture monitoring running 24/7 with zero Critical misconfigurations allowed.'
        ]
      }
    ]
  },
  {
    id: 'std-ep-707',
    code: 'STD-EP-707',
    title: 'Endpoint Protection, EDR Fleet Telemetry and Mobile Device Standard',
    category: 'standard',
    version: '2.0',
    effectiveDate: '2023-10-15',
    governingPolicyCode: 'POL-SEC-01',
    owner: 'Head of IT End User Computing',
    scope: 'All corporate laptops, workstations, virtual desktop interfaces, and mobile devices.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Endpoint Detection and Response (EDR) Agent Installation',
        content: 'CrowdStrike Falcon sensor must be installed and active on 100% of corporate endpoints before network access is granted. Full disk encryption (FileVault 2 for macOS, BitLocker with TPM for Windows) is strictly mandatory with recovery keys vaulted in MDM.',
        specifications: [
          'CrowdStrike Falcon active with prevention policies set to Full Protection.',
          'Full Disk Encryption mandatory (AES-XTS 128 or 256).',
          'OS patching enforced within 14 days of Apple/Microsoft release.'
        ],
        enforcementCriteria: [
          'Jamf Pro and Microsoft Intune zero-trust compliance gates in Okta.'
        ]
      }
    ]
  },
  {
    id: 'std-api-808',
    code: 'STD-API-808',
    title: 'Enterprise API Security, OAuth2 Token Scoping and Gateway Standard',
    category: 'standard',
    version: '2.7',
    effectiveDate: '2024-01-25',
    governingPolicyCode: 'POL-DAT-02',
    owner: 'Principal API Architect',
    scope: 'All internal and external REST/GraphQL API endpoints, gateways (Kong/Apigee), and client applications.',
    sections: [
      {
        sectionNumber: '2.3',
        title: 'OAuth 2.0 / OIDC Bearer Token Lifetime and Scoping',
        content: 'APIs must authenticate callers using signed JWT access tokens conforming to OAuth 2.0 framework. Access tokens must have a maximum lifetime of 60 minutes. Refresh tokens must enforce rotation upon every usage and expire within 7 calendar days.',
        specifications: [
          'Maximum JWT access token validity: 60 minutes.',
          'Maximum refresh token validity: 7 calendar days with single-use rotation.',
          'Strict parameter validation and schema conformance against OpenAPI 3.1.'
        ],
        enforcementCriteria: [
          'Kong Gateway automated token introspection and rate limiting.'
        ]
      }
    ]
  },
  {
    id: 'std-bcp-909',
    code: 'STD-BCP-909',
    title: 'Business Resilience, High Availability and RTO/RPO Architecture Standard',
    category: 'standard',
    version: '2.4',
    effectiveDate: '2024-02-12',
    governingPolicyCode: 'POL-BCP-04',
    owner: 'Principal Infrastructure Resilience Architect',
    scope: 'Tier-1, Tier-2, and Tier-3 cloud application architectures and disaster recovery environments.',
    sections: [
      {
        sectionNumber: '1.2',
        title: 'Technical Implementation of RTO and RPO Architecture Tiers',
        content: 'Tier-1 systems require automated multi-AZ active-active or active-hot-standby topology. Cross-region asynchronous replication lag must be monitored continuously with alerts triggered if lag exceeds 5 minutes (to guarantee 15-minute RPO).',
        specifications: [
          'Tier-1 RTO target: <= 240 minutes (4 hours); RPO target: <= 15 minutes.',
          'Automated failover health checks evaluating HTTP 200 responses every 10 seconds.',
          'Backup retention: 35 days point-in-time recovery (PITR) + monthly archives for 7 years.'
        ],
        enforcementCriteria: [
          'CloudWatch alert on AuroraReplicaLag > 300 seconds.'
        ]
      }
    ]
  },
  {
    id: 'std-dat-1010',
    code: 'STD-DAT-1010',
    title: 'Database Hardening, Dynamic Masking and Vault Credential Standard',
    category: 'standard',
    version: '2.6',
    effectiveDate: '2023-12-18',
    governingPolicyCode: 'POL-DAT-02',
    owner: 'Lead Database Administrator & Data Architect',
    scope: 'All production databases (PostgreSQL, Aurora, DynamoDB, Snowflake) and data warehouses.',
    sections: [
      {
        sectionNumber: '2.2',
        title: 'Direct Database Access Restrictions and Ephemeral Credentials',
        content: 'Engineers are strictly barred from having permanent direct login credentials to production databases. Administrative queries and emergency break-glass sessions must be routed via Teleport Database Access with credentials expiring after 4 hours.',
        specifications: [
          'Maximum break-glass session duration: 4 hours.',
          'Session recording enabled for 100% of SQL queries executed in production.',
          'Sensitive customer PII fields dynamically masked for non-production environments.'
        ],
        enforcementCriteria: [
          'Teleport RBAC audit logs ingested into Splunk.'
        ]
      }
    ]
  },
  {
    id: 'std-ops-1111',
    code: 'STD-OPS-1111',
    title: 'Production Operational Change Gating and Automated Testing Standard',
    category: 'standard',
    version: '3.2',
    effectiveDate: '2024-01-30',
    governingPolicyCode: 'POL-CHG-06',
    owner: 'Director of Release Engineering',
    scope: 'Change management pipelines, ServiceNow Change Management modules, and deployment triggers.',
    sections: [
      {
        sectionNumber: '2.1',
        title: 'Standard and Emergency Change Classification Gates',
        content: 'Standard Changes must be pre-approved by CAB and executed via pre-tested automation scripts. Emergency Changes deployed to resolve P1/P2 incidents require Verbal Approval from Incident Commander and formal Retrospective CAB approval within 48 hours post-deployment.',
        specifications: [
          'Retrospective CAB review SLA: <= 48 hours post-deployment.',
          'Zero untested manual hotfixes deployed directly to servers.',
          'Rollback plan documented and validated in staging before release initiation.'
        ],
        enforcementCriteria: [
          'ServiceNow Change Request hard-gating pipeline promotion.'
        ]
      }
    ]
  },
  {
    id: 'std-vrm-1212',
    code: 'STD-VRM-1212',
    title: 'Vendor Cybersecurity Assessment, Tiering and SOC 2 Assurance Standard',
    category: 'standard',
    version: '2.9',
    effectiveDate: '2023-11-05',
    governingPolicyCode: 'POL-VRM-03',
    owner: 'Director of Third-Party Assurance',
    scope: 'All external SaaS providers, outsourced technology vendors, and cloud hosting platforms.',
    sections: [
      {
        sectionNumber: '1.4',
        title: 'Critical Vendor Tiering and Annual SOC 2 Bridge Letter Rules',
        content: 'Tier-1 Critical Vendors (hosting customer PII or financial transactions) must submit a SOC 2 Type II report with unqualified opinion covering minimum 6 months. When the report period ends prior to our fiscal year-end, a bridge letter covering up to 90 days must be executed by vendor leadership.',
        specifications: [
          'Maximum bridge letter gap coverage: 90 calendar days.',
          'Reports older than 12 months deemed non-compliant and trigger executive risk review.',
          'Quarterly continuous threat rating evaluation via BitSight or SecurityScorecard (>750 score required).'
        ],
        enforcementCriteria: [
          'OneTrust Vendor Risk Management system tracking report validity dates.'
        ]
      }
    ]
  }
];

export const PROCEDURES: ProcedureDocument[] = [
  {
    id: 'sop-iam-02',
    code: 'SOP-IAM-02',
    title: 'Quarterly User Access Review (UAR) Execution Operating Procedure',
    category: 'procedure',
    version: '3.1',
    effectiveDate: '2024-01-05',
    governingStandardCode: 'STD-IAM-101',
    cadence: 'Quarterly (Campaign runs days 1-15 of calendar quarter start)',
    ownerRole: 'IAM Governance Lead & IT Compliance Manager',
    steps: [
      {
        stepNumber: '1',
        name: 'Population Extract and Snapshot Generation',
        description: 'On Day 1 of the review cycle, generate a full census of active users, privileged groups, and application entitlements from Okta, Active Directory, and SailPoint. Verify that data ingestion timestamp is frozen as of 23:59 UTC on the final day of the prior quarter.',
        requiredArtifacts: ['Master Census CSV', 'SHA-256 hash manifest of population extract', 'SailPoint campaign launch log'],
        slaTimeline: 'Day 1 of quarter by 12:00 UTC'
      },
      {
        stepNumber: '2',
        name: 'Manager Review Distribution and Attestation Window',
        description: 'Distribute individualized certification worksheets to people managers and resource owners. Managers must verify legitimate business need for each assigned entitlement and explicitly mark "Maintain Access" or "Revoke Access".',
        requiredArtifacts: ['Email campaign notifications', 'SailPoint in-app audit trail with reviewer timestamps'],
        slaTimeline: 'Days 1 through 15 (15 calendar days)'
      },
      {
        stepNumber: '3',
        name: 'Revocation Execution and Automated Deprovisioning Gate',
        description: 'On Day 16 at 00:01 UTC, SailPoint automatically triggers SCIM revocation workflows for all accounts marked "Revoke Access" or left un-reviewed (fail-safe revocation rule). Verify downstream ticket creation and entitlement removal.',
        requiredArtifacts: ['Okta deprovisioning audit log', 'SailPoint completed campaign certification report'],
        slaTimeline: 'Day 16 (executed within 24 hours)'
      },
      {
        stepNumber: '4',
        name: 'Workpaper Assembly and Controller Review Archive',
        description: 'Assemble final certification report signed by IT Security Director. Upload artifacts to GRC repository for CTL Controller sampling and operating effectiveness testing.',
        requiredArtifacts: ['Final Signed UAR Memorandum', 'Exception tracking register'],
        slaTimeline: 'Within 5 business days of campaign closure'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Attribute sampling over census population',
      sampleSizeGuideline: 'Minimum 25 sampled items across business units (or 100% census re-performance)',
      failConditions: [
        'Any manager signed off after the 15-day deadline without documented exception approval.',
        'Any account marked "Revoke" still had active credentials in production after Day 16.',
        'Population extract omitted cloud infrastructure roles (e.g. AWS IAM or GitHub).'
      ]
    }
  },
  {
    id: 'sop-chg-05',
    code: 'SOP-CHG-05',
    title: 'Emergency and Standard Change Management Operating Procedure',
    category: 'procedure',
    version: '4.0',
    effectiveDate: '2024-02-18',
    governingStandardCode: 'STD-OPS-1111',
    cadence: 'Continuous / Event-driven upon deployment request',
    ownerRole: 'Change Advisory Board (CAB) Chair & ITIL Process Manager',
    steps: [
      {
        stepNumber: '1',
        name: 'Change Request Registration and Peer Approval Verification',
        description: 'Author submits change ticket in ServiceNow linking Git commit hash, Jira user story, rollback procedure, and automated test outputs. Pipeline validates peer approval in GitHub pull request.',
        requiredArtifacts: ['ServiceNow CHG ticket', 'GitHub PR link with passing CI/CD status badge'],
        slaTimeline: 'Submitted minimum 24 hours prior to scheduled CAB for standard changes'
      },
      {
        stepNumber: '2',
        name: 'CAB Review and Production Release Authorization',
        description: 'CAB conducts risk review assessing cross-system blast radius, maintenance window, and rollback readiness. Release approval is electronically signed in ServiceNow.',
        requiredArtifacts: ['CAB meeting minutes', 'Electronic approval timestamp in ServiceNow'],
        slaTimeline: 'Concluded prior to deployment window opening'
      },
      {
        stepNumber: '3',
        name: 'Emergency Change Protocol and Retrospective Authorization',
        description: 'For active P1/P2 incidents, Incident Commander grants verbal or Slack authorization for rapid deployment. Author must register Emergency Change ticket and obtain Retrospective CAB approval within 48 hours post-deployment.',
        requiredArtifacts: ['P1 incident bridge transcript', 'Retrospective CAB sign-off in ServiceNow'],
        slaTimeline: 'Retrospective approval within 48 hours of emergency deployment'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Non-statistical or attribute sampling across all closed change tickets in period',
      sampleSizeGuideline: 'Sample 30 changes (25 standard releases + 5 emergency releases)',
      failConditions: [
        'Change ticket approved by the same engineer who authored the Git commit.',
        'Emergency change lacked retrospective CAB approval within the 48-hour SLA.',
        'Deployment logs showed direct manual command execution instead of CI/CD runner.'
      ]
    }
  },
  {
    id: 'sop-inc-12',
    code: 'SOP-INC-12',
    title: 'Security Incident Escalation, P1 Severity Triage and SEC 8-K Notification Procedure',
    category: 'procedure',
    version: '2.8',
    effectiveDate: '2024-01-20',
    governingStandardCode: 'POL-INC-09',
    cadence: 'Trigger-based upon security alert escalation',
    ownerRole: 'Incident Commander & Corporate Security Legal Counsel',
    steps: [
      {
        stepNumber: '1',
        name: 'Detection, Initial Triage and Incident Bridge Activation',
        description: 'SOC detects anomaly and classifies severity. For P1/P2 incidents, Incident Commander spins up dedicated incident response bridge within 15 minutes of escalation.',
        requiredArtifacts: ['PagerDuty incident timeline', 'SIEM correlation alert payload'],
        slaTimeline: 'Bridge activation <= 15 minutes from triage'
      },
      {
        stepNumber: '2',
        name: 'Legal Materiality Assessment and Breach Determination',
        description: 'Incident Commander briefs CISO and Legal Counsel on quantitative data scope, systems compromised, and potential financial impact. Legal assesses SEC Form 8-K materiality and GDPR Art. 33 criteria.',
        requiredArtifacts: ['Privileged legal materiality assessment memo', 'Forensic containment log'],
        slaTimeline: 'Daily briefing until containment'
      },
      {
        stepNumber: '3',
        name: 'Regulatory Disclosure Filing and Executive Sign-Off',
        description: 'If deemed material, SEC Form 8-K Item 1.05 disclosure is drafted, reviewed by Audit Committee, and filed with EDGAR within 4 business days of materiality determination.',
        requiredArtifacts: ['SEC Form 8-K acceptance receipt', 'Audit Committee approval record'],
        slaTimeline: '<= 4 business days post materiality determination'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: '100% census of all P1 and P2 security incidents in test period',
      sampleSizeGuideline: 'Review all qualifying major incidents',
      failConditions: [
        'Incident materiality determination was delayed without documented justification.',
        'Regulator notification occurred after statutory deadline (e.g. >72 hours for GDPR).'
      ]
    }
  },
  {
    id: 'sop-bcp-03',
    code: 'SOP-BCP-03',
    title: 'Annual Disaster Recovery Failover Testing and Database Restoration Procedure',
    category: 'procedure',
    version: '2.5',
    effectiveDate: '2024-02-15',
    governingStandardCode: 'STD-BCP-909',
    cadence: 'Annual live exercise or full-scale sandbox restoration',
    ownerRole: 'Lead DR Coordinator & Cloud Infrastructure Operations Manager',
    steps: [
      {
        stepNumber: '1',
        name: 'Snapshot Selection and Isolated Recovery VPC Preparation',
        description: 'Select unannounced production snapshot from active backup vault. Provision clean, isolated DR VPC in alternate geographic region (e.g. us-west-2 while primary is us-east-1).',
        requiredArtifacts: ['AWS Backup restore request ID', 'Terraform execution log for DR VPC'],
        slaTimeline: 'Exercise Kickoff T+0'
      },
      {
        stepNumber: '2',
        name: 'Database Instance Restoration and Integrity Verification',
        description: 'Restore Aurora PostgreSQL cluster from point-in-time snapshot. Execute automated integrity check script verifying row counts, cryptographic checksums, and financial ledger balances against production baseline.',
        requiredArtifacts: ['Restore completion timestamp log', 'Data verification script output'],
        slaTimeline: 'Restoration completed within 2 hours of snapshot trigger'
      },
      {
        stepNumber: '3',
        name: 'Application Service Initialization and Synthetic Transaction Validation',
        description: 'Spin up core application containers in DR region. Run automated synthetic test suite simulating deposit, withdrawal, and ledger settlement transactions.',
        requiredArtifacts: ['Synthetic transaction pass/fail test report', 'End-to-end RTO measurement certificate'],
        slaTimeline: 'Full operational state verified within 4 hours (Tier-1 RTO)'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Re-performance and inspection of primary test runbooks',
      sampleSizeGuideline: '1 annual primary failover exercise + quarterly technical component restore logs',
      failConditions: [
        'DR exercise was conducted as paper review without actual server/database restoration.',
        'Restoration took longer than the 4-hour RTO threshold.',
        'Synthetic transaction test suite identified ledger consistency errors upon restore.'
      ]
    }
  },
  {
    id: 'sop-vul-04',
    code: 'SOP-VUL-04',
    title: 'Monthly Host and Container Vulnerability Scanning and SLA Tracking Procedure',
    category: 'procedure',
    version: '2.9',
    effectiveDate: '2024-01-12',
    governingStandardCode: 'STD-VUL-404',
    cadence: 'Continuous automated scans with monthly executive governance rollup',
    ownerRole: 'Lead Vulnerability Analyst',
    steps: [
      {
        stepNumber: '1',
        name: 'Cloud Census Synchronization and Target Discovery',
        description: 'Query AWS Organizations and Kubernetes clusters to sync full compute inventory into Wiz and Qualys. Ensure 100% of running workloads have active sensor coverage.',
        requiredArtifacts: ['Asset discovery delta report', 'Wiz coverage matrix'],
        slaTimeline: 'Day 1 of each calendar month'
      },
      {
        stepNumber: '2',
        name: 'Vulnerability Triage and Jira Ticket Generation',
        description: 'Scan results ingested and enriched with CISA KEV tags. Automated Jira tickets dispatched to responsible service engineering teams with mandatory SLA countdown timer.',
        requiredArtifacts: ['Automated Jira ticket batch export', 'CVSS v3.1 calculation log'],
        slaTimeline: 'Within 12 hours of scan completion'
      },
      {
        stepNumber: '3',
        name: 'Remediation Verification and Ticket Closure Audit',
        description: 'Upon engineering patch release, run targeted delta scan. If vulnerability is confirmed resolved, mark ticket closed with scan verification artifact attached.',
        requiredArtifacts: ['Post-remediation clean scan report', 'Closed Jira ticket with timestamp'],
        slaTimeline: 'Within 24 hours of patch deployment'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Stratified sampling across Critical, High, and Medium vulnerability populations',
      sampleSizeGuideline: 'Sample 25 closed vulnerability remediation tickets',
      failConditions: [
        'Critical vulnerability exceeded 7 calendar days without approved executive risk acceptance.',
        'High severity vulnerability exceeded 30 calendar days.',
        'Vulnerability ticket was closed manually without automated scan corroboration.'
      ]
    }
  },
  {
    id: 'sop-off-08',
    code: 'SOP-OFF-08',
    title: 'Employee and Contractor Timely Deprovisioning Execution Runbook',
    category: 'procedure',
    version: '3.3',
    effectiveDate: '2024-02-20',
    governingStandardCode: 'STD-IAM-101',
    cadence: 'Event-driven upon HR separation event notification',
    ownerRole: 'Identity Operations Center Lead',
    steps: [
      {
        stepNumber: '1',
        name: 'HRIS Termination Webhook Ingestion',
        description: 'Workday HRIS sends automated REST webhook upon separation status change to Okta Workflow engine. Webhook specifies departure type: Voluntary or Involuntary.',
        requiredArtifacts: ['Workday separation payload JSON', 'Okta workflow trigger execution log'],
        slaTimeline: 'Real-time (instantaneous trigger)'
      },
      {
        stepNumber: '2',
        name: 'Immediate Primary Identity Suspension',
        description: 'Okta sets user status to SUSPENDED. All active session tokens (OIDC, SAML, Web sessions) are globally revoked across Google Workspace, Slack, and cloud consoles.',
        requiredArtifacts: ['Okta System Log showing core.user.account.suspend', 'Session revocation receipt'],
        slaTimeline: '<= 2 hours for involuntary; <= 24 hours for voluntary'
      },
      {
        stepNumber: '3',
        name: 'Downstream Cloud Credential and SSH Key Deprovisioning',
        description: 'SCIM connectors purge GitHub organization membership, AWS IAM identity center associations, and delete production SSH public keys from jump bastion servers.',
        requiredArtifacts: ['AWS IAM identity center audit log', 'GitHub audit log seat deallocation'],
        slaTimeline: '<= 48 hours from HR separation timestamp'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Stratified sampling across voluntary vs involuntary and employees vs contractors',
      sampleSizeGuideline: 'Sample 30 separated personnel (15 voluntary, 10 contractors, 5 involuntary)',
      failConditions: [
        'Elapsed time between HR termination timestamp and Okta suspension exceeded 24h for voluntary or 2h for involuntary.',
        'Contractor account remained active in AWS after the contract end date.',
        'Active login events detected in SIEM following formal termination timestamp.'
      ]
    }
  },
  {
    id: 'sop-kms-09',
    code: 'SOP-KMS-09',
    title: 'Annual Cryptographic Root Key Rotation and Envelope Key Ceremony Procedure',
    category: 'procedure',
    version: '2.2',
    effectiveDate: '2023-11-25',
    governingStandardCode: 'STD-CRY-202',
    cadence: 'Annual scheduled execution during Q4 maintenance window',
    ownerRole: 'Principal Cryptographic Custodian & Cloud Security Engineer',
    steps: [
      {
        stepNumber: '1',
        name: 'Automated KMS Key Rotation Status Audit',
        description: 'Query AWS KMS API across all production accounts to confirm AutomaticKeyRotation is enabled on all Customer Master Keys. Verify key version history in CloudTrail.',
        requiredArtifacts: ['aws kms get-key-rotation-status CLI JSON output', 'CloudTrail KMS rotation event log'],
        slaTimeline: 'Annual audit completed by November 30'
      },
      {
        stepNumber: '2',
        name: 'Root Signing Key Ceremony and Custodian Attestation',
        description: 'For offline HSM root certificate keys, two authorized cryptographic custodians convene in secure enclave. Generate new root certificate pair, sign intermediate CAs, and vault backup shards in separate physical safes.',
        requiredArtifacts: ['Ceremony video log and signed custodian manifest', 'HSM cryptographic audit log'],
        slaTimeline: 'Executed annually'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: '100% census of all production Customer Master Keys (CMKs)',
      sampleSizeGuideline: 'Review all production KMS keys across active cloud regions',
      failConditions: [
        'Any customer data CMK found with key rotation status set to Disabled.',
        'Key rotation ceremony lacked independent witness or second custodian sign-off.'
      ]
    }
  },
  {
    id: 'sop-log-11',
    code: 'SOP-LOG-11',
    title: 'SIEM Pipeline Health Monitoring, WORM Lock Validation and NTP Audit Runbook',
    category: 'procedure',
    version: '2.4',
    effectiveDate: '2024-02-10',
    governingStandardCode: 'STD-LOG-303',
    cadence: 'Weekly automated health run with monthly controller compliance review',
    ownerRole: 'SIEM Operations Lead',
    steps: [
      {
        stepNumber: '1',
        name: 'Weekly Clock Drift and NTP Telemetry Inspection',
        description: 'Execute automated probe across all Kubernetes nodes and EC2 instances checking time drift against corporate NTP servers. Identify any host exceeding 50ms drift.',
        requiredArtifacts: ['NTP drift report CSV', 'Chrony client synchronization log'],
        slaTimeline: 'Every Monday by 08:00 UTC'
      },
      {
        stepNumber: '2',
        name: 'WORM Compliance Mode Retention Policy Verification',
        description: 'Audit destination S3 audit logging buckets using AWS CLI. Inspect ObjectLockConfiguration verifying Mode is COMPLIANCE and default retention period is >= 365 days.',
        requiredArtifacts: ['get-object-lock-configuration CLI output', 'S3 bucket policy JSON'],
        slaTimeline: 'Monthly verification snapshot'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Re-performance of configuration inspect commands over all logging buckets',
      sampleSizeGuideline: 'Inspect 100% of centralized audit logging S3 buckets and SIEM endpoints',
      failConditions: [
        'S3 bucket object lock configured in GOVERNANCE mode rather than COMPLIANCE mode.',
        'NTP client drift exceeded 50ms on hosts generating financial audit records.'
      ]
    }
  },
  {
    id: 'sop-api-14',
    code: 'SOP-API-14',
    title: 'Production API Endpoint Gatekeeping, Token Revocation and WAF Rule Update SOP',
    category: 'procedure',
    version: '2.1',
    effectiveDate: '2024-03-01',
    governingStandardCode: 'STD-API-808',
    cadence: 'Continuous / Bi-weekly review',
    ownerRole: 'API Gateway Administrator & Security Engineer',
    steps: [
      {
        stepNumber: '1',
        name: 'API Discovery and Shadow Endpoint Audit',
        description: 'Run automated API discovery against cloud load balancers. Verify all public HTTP endpoints terminate at Kong API Gateway and enforce OAuth 2.0 authentication.',
        requiredArtifacts: ['Kong route inventory export', 'Shadow API delta report'],
        slaTimeline: 'Bi-weekly on Wednesdays'
      },
      {
        stepNumber: '2',
        name: 'WAF Rate Limiting and OWASP Protection Rule Tuning',
        description: 'Inspect AWS WAF logs for rate limit triggers and SQL injection detection patterns. Update managed rule groups to block unauthorized scraping and credential stuffing.',
        requiredArtifacts: ['WAF block metrics dashboard', 'Rule update change ticket'],
        slaTimeline: 'Continuous real-time enforcement'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Sample 20 public API routes',
      sampleSizeGuideline: 'Verify OAuth 2.0 JWT authentication on all sampled routes',
      failConditions: [
        'Found unauthenticated public API endpoint exposing customer records.',
        'JWT tokens accepted with expired signatures or missing cryptographic claims.'
      ]
    }
  },
  {
    id: 'sop-cld-16',
    code: 'SOP-CLD-16',
    title: 'Cloud Security Posture Management (CSPM) Alert Triage and Drift Remediation Runbook',
    category: 'procedure',
    version: '2.3',
    effectiveDate: '2024-02-25',
    governingStandardCode: 'STD-CLD-606',
    cadence: 'Daily operational triage',
    ownerRole: 'Cloud Security Operations Engineer',
    steps: [
      {
        stepNumber: '1',
        name: 'Daily CSPM Critical Finding Review',
        description: 'Log into Wiz CSPM dashboard. Filter for Critical severity misconfigurations (e.g. S3 bucket public access, unencrypted RDS, IAM role with wildcard administrative privileges).',
        requiredArtifacts: ['Daily Wiz alert report', 'Jira remediation tickets'],
        slaTimeline: 'Daily by 10:00 UTC'
      },
      {
        stepNumber: '2',
        name: 'Automated Guardrail Drift Correction',
        description: 'Trigger automated Lambda remediation scripts to revoke unauthorized public security group rules or re-enable bucket public access blocks.',
        requiredArtifacts: ['Lambda remediation execution logs', 'CloudTrail event record'],
        slaTimeline: '<= 1 hour for public exposure alerts'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Sample 25 historical CSPM alerts',
      sampleSizeGuideline: 'Review resolution logs and response times',
      failConditions: [
        'Public S3 bucket alert remained un-remediated for greater than 24 hours.',
        'Wildcard administrator IAM policy attached without documented break-glass approval.'
      ]
    }
  },
  {
    id: 'sop-vrm-18',
    code: 'SOP-VRM-18',
    title: 'Vendor SOC 2 Bridge Letter Procurement and Fourth-Party Subprocessor Review SOP',
    category: 'procedure',
    version: '2.5',
    effectiveDate: '2023-10-30',
    governingStandardCode: 'STD-VRM-1212',
    cadence: 'Annual review per vendor contract anniversary',
    ownerRole: 'Third-Party Risk Analyst',
    steps: [
      {
        stepNumber: '1',
        name: 'Vendor Assurance Inventory and Expiration Tracking',
        description: 'Review OneTrust vendor register 60 days prior to SOC 2 report expiration. Send formal requisition to vendor procurement contact requesting latest SOC 2 Type II report.',
        requiredArtifacts: ['Vendor requisition email', 'OneTrust audit tracker entry'],
        slaTimeline: '60 days prior to report expiration'
      },
      {
        stepNumber: '2',
        name: 'Report Evaluation and Bridge Letter Requisition',
        description: 'Evaluate vendor SOC 2 Type II testing period. If testing period ends prior to enterprise fiscal year-end (December 31), requisition signed bridge letter covering up to 90 days.',
        requiredArtifacts: ['Completed CUEC review matrix', 'Signed bridge letter PDF'],
        slaTimeline: 'Received within 15 days of fiscal year end'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: '100% census of Tier-1 Critical Vendors',
      sampleSizeGuideline: 'Sample 15 Critical Vendors supporting financial reporting systems',
      failConditions: [
        'Tier-1 vendor lacked current SOC 2 report and no bridge letter was obtained.',
        'Bridge letter covered gap exceeding 90 calendar days without risk acceptance.'
      ]
    }
  },
  {
    id: 'sop-db-20',
    code: 'SOP-DB-20',
    title: 'Production Database Privilege Elevation, Break-Glass and Query Audit Procedure',
    category: 'procedure',
    version: '2.0',
    effectiveDate: '2024-01-18',
    governingStandardCode: 'STD-DAT-1010',
    cadence: 'Event-driven upon break-glass database access request',
    ownerRole: 'Lead Production DBA & Security Operations Lead',
    steps: [
      {
        stepNumber: '1',
        name: 'Teleport Break-Glass Access Request Submission',
        description: 'Engineer requests temporary database elevation via Teleport CLI linking approved ServiceNow emergency ticket. System requires manager approval via Slack bot.',
        requiredArtifacts: ['Teleport access request JSON', 'Slack approval timestamp from engineering manager'],
        slaTimeline: 'Approved before session start'
      },
      {
        stepNumber: '2',
        name: 'Session Recording and Automatic Timeout Enforcement',
        description: 'Teleport issues ephemeral X.509 certificate valid for exactly 4 hours. All SQL statements executed are recorded in audit logs and stream to SIEM in real-time.',
        requiredArtifacts: ['Teleport session recording archive', 'PostgreSQL pgAudit log entries'],
        slaTimeline: 'Max session duration: 4 hours (hard cutoff)'
      }
    ],
    controllerTestingGuidance: {
      samplingMethod: 'Sample 25 break-glass database access sessions in period',
      sampleSizeGuideline: 'Review all sessions for financial ledger databases',
      failConditions: [
        'Database session initiated without valid ServiceNow change ticket reference.',
        'Session exceeded 4-hour timeout without re-authorization.',
        'Direct schema modification executed outside of CI/CD migration scripts.'
      ]
    }
  }
];

export const CONTROLS: ControlDefinition[] = [
  {
    id: 'ctl-ac-01',
    code: 'CTL-AC-01',
    name: 'Privileged Access Quarterly Recertification and Entitlement Review',
    category: 'control',
    controlOwner: 'Identity & Access Governance Manager',
    frequency: 'Quarterly',
    nature: 'Detective',
    type: 'Semi-Automated',
    associatedRisk: {
      riskId: 'RSK-IAM-01',
      title: 'Privilege Accumulation and Dormant Administrative Backdoors',
      inherentRiskRating: 'Critical',
      description: 'Employees transferring roles or leaving projects retain unnecessary administrative rights to financial ledger systems, leading to unauthorized ledger manipulation or fraud.',
      financialOrRegulatoryImpact: 'Material misstatement of financial statements under SOX Section 404 and severe regulatory sanction by SEC / PCAOB.'
    },
    policyLink: 'POL-SEC-01 Section 3.1',
    standardLink: 'STD-IAM-101 Section 4.1',
    procedureLink: 'SOP-IAM-02 Steps 1-4',
    testingCriteria: [
      'Verify that population of review included 100% of privileged Active Directory, Okta, and AWS IAM roles.',
      'Validate that managers completed certification within the 15 calendar day campaign window.',
      'Inspect revocation execution records to confirm that all revoked entitlements were deactivated in target systems within 24 hours of campaign closure.',
      'Verify that un-reviewed accounts were automatically revoked on Day 16 (fail-safe).'
    ],
    requiredEvidenceTypes: ['SailPoint Campaign Summary PDF', 'Population Extraction SQL/JSON Manifest', 'Okta Deprovisioning Event Logs']
  },
  {
    id: 'ctl-sec-08',
    code: 'CTL-SEC-08',
    name: 'Timely Deprovisioning of Terminated Employees and Contractors',
    category: 'control',
    controlOwner: 'Identity Operations Lead',
    frequency: 'Continuous',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-IAM-04',
      title: 'Orphaned Account Exploitation by Former Personnel',
      inherentRiskRating: 'High',
      description: 'Terminated employees retaining active corporate credentials can access proprietary customer financial data, exfiltrate IP, or sabotage production services post-departure.',
      financialOrRegulatoryImpact: 'Direct data breach liability, regulatory fines under GDPR / GLBA, and SOX 404 ITGC deficiency.'
    },
    policyLink: 'POL-SEC-01 Section 4.2',
    standardLink: 'STD-IAM-101 Section 3.5',
    procedureLink: 'SOP-OFF-08 Steps 1-3',
    testingCriteria: [
      'Cross-reference HR official departure timestamp against Okta suspension timestamp for sample of terminated employees.',
      'Verify deactivation elapsed time was <= 24 hours for voluntary departures and <= 2 hours for involuntary terminations.',
      'Ensure external contractor account expirations correspond to contract end dates without unapproved extensions.'
    ],
    requiredEvidenceTypes: ['Workday HR Separation Census', 'Okta User Status Audit Log', 'AWS IAM Session Termination Receipts']
  },
  {
    id: 'ctl-cm-04',
    code: 'CTL-CM-04',
    name: 'Production Deployment Segregation of Duties and Peer Review Enforcement',
    category: 'control',
    controlOwner: 'Director of Release Engineering',
    frequency: 'Continuous',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-CHG-02',
      title: 'Unauthorized or Malicious Code Injected Directly to Production',
      inherentRiskRating: 'Critical',
      description: 'A rogue developer or compromised workstation pushes unreviewed code directly into production financial calculation engines, resulting in fraudulent disbursements.',
      financialOrRegulatoryImpact: 'Fraud loss, catastrophic production outage, and failure of SOX 404 Change Management ITGC.'
    },
    policyLink: 'POL-CHG-06 Section 2.2',
    standardLink: 'STD-OPS-1111 Section 2.1',
    procedureLink: 'SOP-CHG-05 Steps 1-3',
    testingCriteria: [
      'Sample production Git releases and verify each commit underwent peer review by someone other than the author.',
      'Verify GitHub branch protection rules prevent direct commits to protected branches without review approval.',
      'Confirm developer IAM roles have zero direct write or deployment privileges in production cloud accounts.'
    ],
    requiredEvidenceTypes: ['GitHub Branch Protection Configuration', 'Sampled Pull Request Review Histories', 'AWS IAM Policy JSONs']
  },
  {
    id: 'ctl-dr-02',
    code: 'CTL-DR-02',
    name: 'Tier-1 Disaster Recovery Database Snapshot Restoration and Failover Test',
    category: 'control',
    controlOwner: 'Head of Infrastructure Resilience',
    frequency: 'Annual',
    nature: 'Detective',
    type: 'Manual',
    associatedRisk: {
      riskId: 'RSK-BCP-01',
      title: 'Catastrophic Regional Cloud Outage Causing Prolonged Service Loss',
      inherentRiskRating: 'Critical',
      description: 'Major regional catastrophe renders primary datacenter unavailable; inability to recover financial database from snapshots within 4 hours leads to market transaction halt.',
      financialOrRegulatoryImpact: 'Regulatory fines up to $50M, massive reputational impairment, and breach of FINRA Rule 4370.'
    },
    policyLink: 'POL-BCP-04 Section 1.4',
    standardLink: 'STD-BCP-909 Section 1.2',
    procedureLink: 'SOP-BCP-03 Steps 1-3',
    testingCriteria: [
      'Review primary execution logs of annual disaster recovery failover exercise.',
      'Validate that production database snapshot was restored in isolated alternate region and validated with synthetic transactions.',
      'Confirm that end-to-end recovery time met Tier-1 RTO (< 4 hours) and RPO (< 15 minutes) statutory mandates.'
    ],
    requiredEvidenceTypes: ['Annual DR Execution Memorandum', 'AWS Backup Restore Job Logs', 'Synthetic Transaction Pass/Fail Reports']
  },
  {
    id: 'ctl-vr-03',
    code: 'CTL-VR-03',
    name: 'Critical Third-Party Vendor Annual SOC 2 Type II Evaluation',
    category: 'control',
    controlOwner: 'Vendor Risk Management Lead',
    frequency: 'Annual',
    nature: 'Detective',
    type: 'Manual',
    associatedRisk: {
      riskId: 'RSK-VRM-03',
      title: 'Supply Chain Compromise and Third-Party Security Control Failure',
      inherentRiskRating: 'High',
      description: 'A third-party SaaS provider hosting customer financial records suffers a security breach due to deficient internal controls, resulting in downstream data compromise.',
      financialOrRegulatoryImpact: 'Breach of trust, regulatory audit findings under OCC/EBA outsourcing guidelines, and customer lawsuit damages.'
    },
    policyLink: 'POL-VRM-03 Section 2.3',
    standardLink: 'STD-VRM-1212 Section 1.4',
    procedureLink: 'SOP-VRM-18 Steps 1-2',
    testingCriteria: [
      'Sample Tier-1 Critical Vendors and confirm active SOC 2 Type II report on file covering minimum 6 months.',
      'Verify that any gap between report end date and company fiscal year-end is covered by an authorized bridge letter (max 90 days).',
      'Inspect evaluation of Complementary User Entity Controls (CUECs) and ensure internal controls map to vendor expectations.'
    ],
    requiredEvidenceTypes: ['Vendor SOC 2 Type II Reports', 'Executed Vendor Bridge Letters', 'CUEC Internal Control Mapping Matrix']
  },
  {
    id: 'ctl-log-05',
    code: 'CTL-LOG-05',
    name: 'Centralized SIEM Immutable WORM Logging and Retention Enforcement',
    category: 'control',
    controlOwner: 'SOC Engineering Manager',
    frequency: 'Continuous',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-LOG-02',
      title: 'Security Telemetry Destruction and Audit Log Tampering',
      inherentRiskRating: 'Critical',
      description: 'An attacker or compromised insider deletes access logs and CloudTrail records to erase forensic evidence of data theft or unauthorized financial transactions.',
      financialOrRegulatoryImpact: 'Inability to substantiate audit trails, destruction of evidence under Sarbanes-Oxley, and criminal penalties.'
    },
    policyLink: 'POL-DAT-02 Section 4.3',
    standardLink: 'STD-LOG-303 Section 2.3',
    procedureLink: 'SOP-LOG-11 Steps 1-2',
    testingCriteria: [
      'Inspect AWS S3 bucket configurations storing audit logs to verify Object Lock is active in COMPLIANCE mode.',
      'Confirm retention period is configured for minimum 365 calendar days.',
      'Verify that attempt to delete bucket or object returns AccessDenied even when executed with AWS Root credentials.'
    ],
    requiredEvidenceTypes: ['AWS S3 ObjectLockConfiguration JSON', 'Splunk Ingestion Pipeline Metrics', 'KMS Key Policy for Log Bucket']
  },
  {
    id: 'ctl-vul-06',
    code: 'CTL-VUL-06',
    name: 'Critical and High Vulnerability Patch SLA Enforcement',
    category: 'control',
    controlOwner: 'Vulnerability Operations Lead',
    frequency: 'Weekly',
    nature: 'Corrective',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-VUL-01',
      title: 'Exploitation of Known Public Vulnerabilities and Zero-Days',
      inherentRiskRating: 'Critical',
      description: 'Unpatched public-facing vulnerabilities (e.g. Log4j, OpenSSL bugs) allow external threat actors to execute remote code on production financial calculation servers.',
      financialOrRegulatoryImpact: 'Complete system compromise, ransomware extortion, and regulatory non-compliance with PCI-DSS Req 6.2.'
    },
    policyLink: 'POL-VUL-07 Section 2.1',
    standardLink: 'STD-VUL-404 Section 1.4',
    procedureLink: 'SOP-VUL-04 Steps 1-3',
    testingCriteria: [
      'Sample 25 vulnerability tickets across production assets in period.',
      'Verify Critical vulnerabilities were patched within 7 days and High within 30 days.',
      'Ensure exceptions are documented with formal CISO risk acceptance and compensating controls.'
    ],
    requiredEvidenceTypes: ['Qualys/Wiz Weekly Scan Reports', 'Jira Vulnerability Remediation Export', 'CISO Risk Acceptance Sign-offs']
  },
  {
    id: 'ctl-cry-07',
    code: 'CTL-CRY-07',
    name: 'Customer Master Key (CMK) Automated Annual Cryptographic Rotation',
    category: 'control',
    controlOwner: 'Lead Cryptographer',
    frequency: 'Annual',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-CRY-01',
      title: 'Long-Lived Cryptographic Key Compromise and Mass Data Decryption',
      inherentRiskRating: 'High',
      description: 'Un-rotated encryption keys exposed through cryptanalytic breakthrough or compromised administrator allow retroactive decryption of years of archived customer data.',
      financialOrRegulatoryImpact: 'Catastrophic data breach liability and non-compliance with PCI-DSS Req 3.6 and SOC 2 CC6.6.'
    },
    policyLink: 'POL-DAT-02 Section 2.1',
    standardLink: 'STD-CRY-202 Section 2.4',
    procedureLink: 'SOP-KMS-09 Steps 1-2',
    testingCriteria: [
      'Query AWS KMS API across 100% of production accounts.',
      'Verify AutomaticKeyRotation is enabled on all Customer Master Keys used for database and S3 encryption.',
      'Inspect CloudTrail logs to confirm automatic key rotation events fired within 365-day cycle.'
    ],
    requiredEvidenceTypes: ['AWS KMS get-key-rotation-status CLI Outputs', 'AWS Config Rule Compliance History', 'CloudTrail KMS Rotation Logs']
  },
  {
    id: 'ctl-net-09',
    code: 'CTL-NET-09',
    name: 'Production Ingress Filtering and Default-Deny Security Group Enforcement',
    category: 'control',
    controlOwner: 'Network Security Architect',
    frequency: 'Continuous',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-NET-02',
      title: 'Lateral Movement Across Network Segments Following Perimeter Breach',
      inherentRiskRating: 'High',
      description: 'Overly permissive security groups permit unrestricted lateral movement between staging environments and sensitive financial production databases.',
      financialOrRegulatoryImpact: 'Cross-environment contamination and failure of network segmentation ITGC under PCI-DSS / SOC 2.'
    },
    policyLink: 'POL-SEC-01 Section 2.1',
    standardLink: 'STD-NET-505 Section 2.1',
    procedureLink: 'SOP-CLD-16 Steps 1-2',
    testingCriteria: [
      'Inspect security group configurations across production VPCs to confirm zero open ingress rules from 0.0.0.0/0 on sensitive ports (22, 3389, 5432).',
      'Verify default-deny ingress filtering is active on all database subnets.',
      'Ensure AWS SCP blocks creation of public IP addresses in database subnets.'
    ],
    requiredEvidenceTypes: ['AWS Config Security Group Compliance Evaluation', 'Terraform VPC Module Definitions', 'GuardDuty Network Threat Logs']
  },
  {
    id: 'ctl-api-10',
    code: 'CTL-API-10',
    name: 'API Gateway OAuth 2.0 Bearer Token Authentication Gatekeeping',
    category: 'control',
    controlOwner: 'API Gateway Team Lead',
    frequency: 'Continuous',
    nature: 'Preventive',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-API-03',
      title: 'Broken Object Level Authentication (BOLA) and Unauthorized Data Access',
      inherentRiskRating: 'Critical',
      description: 'API endpoints failing to validate OAuth 2.0 token scopes permit external callers to enumerate other customers accounts by tampering with resource IDs.',
      financialOrRegulatoryImpact: 'Regulatory enforcement, public data leak, and breach of FTC / SEC privacy rules.'
    },
    policyLink: 'POL-DAT-02 Section 2.1',
    standardLink: 'STD-API-808 Section 2.3',
    procedureLink: 'SOP-API-14 Steps 1-2',
    testingCriteria: [
      'Sample 25 public API routes and verify OAuth 2.0 JWT authentication is enforced at gateway.',
      'Verify access tokens expire within 60 minutes.',
      'Check that API gateway automatically rejects requests missing valid signed bearer tokens.'
    ],
    requiredEvidenceTypes: ['Kong API Route Authentication Plugins', 'OAuth Token Introspection Config', 'Synthetic API Security Penetration Test Logs']
  },
  {
    id: 'ctl-inc-11',
    code: 'CTL-INC-11',
    name: 'P1 Incident Materiality Triage and 72-Hour Regulatory Disclosure Governance',
    category: 'control',
    controlOwner: 'Incident Response Commander & Legal Counsel',
    frequency: 'Event-driven',
    nature: 'Detective',
    type: 'Manual',
    associatedRisk: {
      riskId: 'RSK-REG-01',
      title: 'Failure to Disclose Material Cyber Breach Within Statutory SEC/GDPR Deadlines',
      inherentRiskRating: 'Critical',
      description: 'Management conceals or delays disclosure of a major cybersecurity incident beyond the 4 business day SEC Form 8-K or 72-hour GDPR statutory notification deadline.',
      financialOrRegulatoryImpact: 'SEC Division of Enforcement legal action against officers, class action shareholder lawsuits, and fines up to 4% global turnover.'
    },
    policyLink: 'POL-INC-09 Section 3.1',
    standardLink: 'STD-OPS-1111 Section 2.1',
    procedureLink: 'SOP-INC-12 Steps 1-3',
    testingCriteria: [
      'Review 100% of P1 and P2 incident records in testing period.',
      'Inspect formal Legal Counsel materiality determination timestamps.',
      'Verify that SEC Form 8-K filings occurred within 4 business days of materiality determination and GDPR notifications occurred within 72 hours.'
    ],
    requiredEvidenceTypes: ['P1 Incident Post-Mortem Records', 'Legal Materiality Sign-Off Memos', 'SEC EDGAR Filing Confirmation Receipts']
  },
  {
    id: 'ctl-csp-12',
    code: 'CTL-CSP-12',
    name: 'Cloud Security Posture Management (CSPM) Continuous Drift Detection',
    category: 'control',
    controlOwner: 'Cloud Security Lead',
    frequency: 'Continuous',
    nature: 'Detective',
    type: 'Automated',
    associatedRisk: {
      riskId: 'RSK-CLD-04',
      title: 'Infrastructure-as-Code Drift and Accidental Public Cloud Exposure',
      inherentRiskRating: 'High',
      description: 'Manual changes made directly in cloud console bypass Terraform pipelines, leaving S3 buckets or database snapshots exposed without encryption or access controls.',
      financialOrRegulatoryImpact: 'Cloud data leakage, compliance audit deficiency, and unexpected data transfer egress costs.'
    },
    policyLink: 'POL-SEC-01 Section 2.1',
    standardLink: 'STD-CLD-606 Section 1.3',
    procedureLink: 'SOP-CLD-16 Steps 1-2',
    testingCriteria: [
      'Inspect Wiz CSPM dashboard for unresolved Critical infrastructure misconfigurations.',
      'Verify automated alerts trigger when S3 public access blocks are modified.',
      'Validate that drift detection scripts compare active cloud infrastructure state against Git IaC main branch hourly.'
    ],
    requiredEvidenceTypes: ['Wiz CSPM Dashboard Snapshot', 'Terraform Drift Detection Pipeline Logs', 'AWS CloudTrail Event Alerts']
  }
];

export const HISTORICAL_FINDINGS: HistoricalFinding[] = [
  {
    id: 'fnd-2024-01',
    code: 'FND-2024-01',
    category: 'historical_finding',
    auditYear: 2024,
    auditScope: '2024 SOX 404 ITGC Annual Audit',
    relatedControlCode: 'CTL-AC-01',
    title: 'AWS Cloud IAM Roles Excluded from SailPoint Quarterly Recertification Campaign',
    deficiencyClassification: 'Significant Deficiency',
    rootCause: 'SailPoint IdentityNow automated connector configuration was limited to on-prem Active Directory and Okta groups; newly provisioned AWS IAM Identity Center permission sets were not mapped into the quarterly census extract.',
    auditObservation: 'During sample re-performance of Q2 and Q3 2024 User Access Reviews, external auditors identified 42 engineers who maintained active AWS AdministratorAccess roles despite transitioning off the cloud infrastructure engineering team 6+ months prior.',
    businessImpact: 'Unmitigated administrative access to cloud accounts hosting core General Ledger databases created a significant deficiency in Logical Access ITGC under PCAOB AS 2201 standards.',
    status: 'Remediated & Closed',
    closedDate: '2024-11-15',
    remediationReferenceId: 'REM-2024-01-B'
  },
  {
    id: 'fnd-2023-04',
    code: 'FND-2023-04',
    category: 'historical_finding',
    auditYear: 2023,
    auditScope: '2023 SOC 2 Type II Examination',
    relatedControlCode: 'CTL-SEC-08',
    title: 'Contractor Offboarding Exceeded 24-Hour Revocation SLA by 39 Hours',
    deficiencyClassification: 'Deficiency',
    rootCause: 'Contractor separation notices were processed manually via an email ticketing queue from third-party staffing agencies, rather than via automated Workday contingent worker lifecycle webhooks.',
    auditObservation: 'In a sample of 25 terminated contingent workers, 4 contractors retained active Okta credentials and corporate email access between 36 and 63 hours following official contract termination date (violating POL-SEC-01 Section 4.2).',
    businessImpact: 'Control deficiency reported in 2023 SOC 2 Type II report under Common Criteria CC6.2. No unauthorized data access was detected in SIEM logs during the gap period.',
    status: 'Remediated & Closed',
    closedDate: '2024-03-01',
    remediationReferenceId: 'REM-2023-04-A'
  },
  {
    id: 'fnd-2024-09',
    code: 'FND-2024-09',
    category: 'historical_finding',
    auditYear: 2024,
    auditScope: '2024 Q3 Internal Audit ITGC Review',
    relatedControlCode: 'CTL-CM-04',
    title: 'Emergency Changes Deployed Without Documented 48-Hour Retrospective CAB Approval',
    deficiencyClassification: 'Significant Deficiency',
    rootCause: 'Engineering leads relied on Slack channel verbal confirmations during P1 outages but failed to transition emergency change tickets in ServiceNow from "Draft" to "Retrospective Review" following incident resolution.',
    auditObservation: 'Auditors examined 12 emergency changes deployed in FY2024. 5 changes (41%) lacked retrospective CAB review records, and 2 changes exceeded the 48-hour approval window by more than 12 business days.',
    businessImpact: 'Significant Deficiency in Change Management controls. Increased risk of unreviewed defective code or unauthorized schema modifications persisting in production financial transaction engines.',
    status: 'Under Active Remediation',
    remediationReferenceId: 'REM-2024-09-C'
  },
  {
    id: 'fnd-2024-07',
    code: 'FND-2024-07',
    category: 'historical_finding',
    auditYear: 2024,
    auditScope: '2024 SOX 404 ITGC Interim Audit',
    relatedControlCode: 'CTL-DR-02',
    title: 'Annual Disaster Recovery Tabletop Drill Conducted Without Active Database Snapshot Restoration',
    deficiencyClassification: 'Significant Deficiency',
    rootCause: 'Infrastructure team executed an architectural paper walk-through and tabletop discussion due to budget constraints, rather than spinning up an isolated DR VPC and restoring live snapshots as required by POL-BCP-04.',
    auditObservation: 'No technical restore logs, snapshot IDs, or synthetic transaction test results existed for FY2023-2024 testing cycle. Operating effectiveness of database restoration could not be substantiated.',
    businessImpact: 'Significant Deficiency under SOX Section 404 ITGC Computer Operations. Auditors could not rely on disaster recovery controls for business continuity assurance.',
    status: 'Remediated & Closed',
    closedDate: '2024-10-30',
    remediationReferenceId: 'REM-2024-07-D'
  },
  {
    id: 'fnd-2023-11',
    code: 'FND-2023-11',
    category: 'historical_finding',
    auditYear: 2023,
    auditScope: '2023 SOX 404 ITGC Audit',
    relatedControlCode: 'CTL-VR-03',
    title: 'Vendor SOC 2 Bridge Letter Missing for 4-Month Fiscal Year-End Gap',
    deficiencyClassification: 'Deficiency',
    rootCause: 'Vendor management tracking spreadsheet failed to flag that critical payroll SaaS provider SOC 2 report testing period ended on August 31, leaving a gap until our fiscal year-end on December 31.',
    auditObservation: 'No bridge letter was requested or on file for the 4-month gap period (exceeding the 30-day policy allowance in POL-VRM-03 Section 2.3). The vendor was only requested for an update after auditors raised the exception.',
    businessImpact: 'Deficiency in Third-Party Assurance ITGC. Required controller to perform extensive compensating manual review of general ledger payroll reconciliations.',
    status: 'Remediated & Closed',
    closedDate: '2024-02-15',
    remediationReferenceId: 'REM-2023-11-D'
  },
  {
    id: 'fnd-2022-03',
    code: 'fnd-2022-03',
    category: 'historical_finding',
    auditYear: 2022,
    auditScope: '2022 SOC 2 Type II Audit',
    relatedControlCode: 'CTL-LOG-05',
    title: 'Security Telemetry Logging S3 Bucket Lacked Compliance Mode Object Lock',
    deficiencyClassification: 'Deficiency',
    rootCause: 'Terraform S3 bucket module used deprecated variable s3_object_lock_configuration without specifying COMPLIANCE mode; bucket was provisioned with Governance Mode, allowing admin bypass.',
    auditObservation: 'Central audit log bucket in AWS account lacked immutable write-once compliance locking. An AWS account with AdministratorAccess possessed technical capabilities to delete audit log archives before 365 days elapsed.',
    businessImpact: 'Deficiency under SOC 2 CC7.2. Remediated through Terraform module update and S3 Compliance Mode activation.',
    status: 'Remediated & Closed',
    closedDate: '2023-01-20',
    remediationReferenceId: 'REM-2022-03-A'
  },
  {
    id: 'fnd-2024-14',
    code: 'FND-2024-14',
    category: 'historical_finding',
    auditYear: 2024,
    auditScope: '2024 Internal Audit Cyber Assessment',
    relatedControlCode: 'CTL-VUL-06',
    title: 'High Severity CVSS 8.4 OpenSSL Vulnerabilities Exceeded 30-Day Remediation SLA',
    deficiencyClassification: 'Deficiency',
    rootCause: 'Service engineering team assigned to consumer banking API prioritized feature deliverables over patching sprint, and automated Jira ticket reminder notifications were routed to an unmonitored distribution list.',
    auditObservation: '7 production virtual machines in the payment processing subnet remained unpatched against CVE-2023-3817 for 74 calendar days, exceeding the 30-day High severity SLA in STD-VUL-404 Section 1.4 by 44 days.',
    businessImpact: 'Deficiency in Vulnerability Management. Increased risk of remote denial of service on payment ingestion endpoints during peak trading hours.',
    status: 'Remediated & Closed',
    closedDate: '2024-08-12',
    remediationReferenceId: 'REM-2024-14-A'
  },
  {
    id: 'fnd-2023-18',
    code: 'FND-2023-18',
    category: 'historical_finding',
    auditYear: 2023,
    auditScope: '2023 SOX 404 ITGC Year-End Audit',
    relatedControlCode: 'CTL-AC-01',
    title: 'Direct Production Database Write Access Granted Without Break-Glass Ticket Reference',
    deficiencyClassification: 'Significant Deficiency',
    rootCause: 'Lead DBA manually executed GRANT statement in PostgreSQL during an urgent customer data repair without routing through Teleport Database Access or linking an emergency ServiceNow ticket.',
    auditObservation: 'Audit logs revealed 3 non-DBA software engineers held direct psql login credentials with INSERT/UPDATE rights to the core General Ledger transactions table for 28 consecutive days.',
    businessImpact: 'Significant Deficiency in Segregation of Duties. Directly violated POL-SEC-01 Section 3.1 and required substantive testing of 100% of journal entries during the period.',
    status: 'Remediated & Closed',
    closedDate: '2024-01-30',
    remediationReferenceId: 'REM-2023-18-B'
  },
  {
    id: 'fnd-2024-21',
    code: 'FND-2024-21',
    category: 'historical_finding',
    auditYear: 2024,
    auditScope: '2024 External Penetration Test & ITGC Audit',
    relatedControlCode: 'CTL-NET-09',
    title: 'Cloud Security Group Permitted Ingress 0.0.0.0/0 on Port 22 for Staging Bastion',
    deficiencyClassification: 'Deficiency',
    rootCause: 'A contractor engineer temporarily opened port 22 to 0.0.0.0/0 to troubleshoot a deployment from home and forgot to revert the security group rule prior to project completion.',
    auditObservation: 'External penetration testers discovered an open SSH port on public IP 52.14.88.192. Workstation was in staging VPC, but peering connections existed between staging and production VPCs.',
    businessImpact: 'Control deficiency in Network Security. Flagged under CIS Benchmark 5.2 and resolved by AWS SCP rule prohibiting 0.0.0.0/0 on port 22.',
    status: 'Remediated & Closed',
    closedDate: '2024-06-18',
    remediationReferenceId: 'REM-2024-21-E'
  },
  {
    id: 'fnd-2023-27',
    code: 'FND-2023-27',
    category: 'historical_finding',
    auditYear: 2023,
    auditScope: '2023 Red Team & AppSec Review',
    relatedControlCode: 'CTL-API-10',
    title: 'Production API Master Service Key Hardcoded in Test Automation Repository',
    deficiencyClassification: 'Significant Deficiency',
    rootCause: 'Test automation engineers hardcoded a static Bearer API token with full administrator scopes into a Git test repository rather than referencing HashiCorp Vault dynamic secrets.',
    auditObservation: 'Red team discovered a valid production API token in plain text inside a Jenkins build workspace. The token had been active for 14 months without rotation, violating POL-IAM-05 Section 4.1.',
    businessImpact: 'Significant Deficiency in Credential Governance. The token permitted unauthenticated data extraction across all customer accounts.',
    status: 'Remediated & Closed',
    closedDate: '2023-12-22',
    remediationReferenceId: 'REM-2023-27-C'
  }
];

export const REMEDIATIONS: RemediationAction[] = [
  {
    id: 'rem-2024-01-b',
    code: 'REM-2024-01-B',
    category: 'remediation',
    relatedFindingCode: 'FND-2024-01',
    relatedControlCode: 'CTL-AC-01',
    actionTitle: 'Automated AWS EventBridge and SailPoint Cloud IAM Role Ingestion Pipeline',
    remediationStrategy: 'Configured automated AWS EventBridge rule that syncs IAM Identity Center permission set assignments to SailPoint IdentityNow via REST API every 6 hours. Extended quarterly UAR campaign scope to automatically include all AWS accounts.',
    implementationDate: '2024-10-15',
    leadOwner: 'VP Identity Engineering & Director of Cloud Architecture',
    verificationEvidence: 'SailPoint Q3 UAR Campaign Ingestion Log showing 100% of AWS cloud permission sets included and reviewed.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Cloud identity stores must be integrated into GRC census pipelines at initial architecture provisioning, rather than treated as separate infrastructure islands.'
  },
  {
    id: 'rem-2023-04-a',
    code: 'REM-2023-04-A',
    category: 'remediation',
    relatedFindingCode: 'FND-2023-04',
    relatedControlCode: 'CTL-SEC-08',
    actionTitle: 'Workday Contingent Worker SCIM Webhook and Okta Auto-Deprovisioning',
    remediationStrategy: 'Eliminated manual email ticketing. Configured direct SCIM integration between Workday Contingent Worker module and Okta. Terminations trigger instantaneous account suspension webhook.',
    implementationDate: '2024-01-20',
    leadOwner: 'Head of Enterprise Applications (Workday Lead) & IAM Operations Lead',
    verificationEvidence: 'Okta System Log extract for 50 subsequent contractor terminations demonstrating mean deprovisioning time of 4.2 minutes (well within the 24-hour SLA).',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Third-party staffing agencies cannot be relied on for manual email offboarding notices; contract end dates must be strictly programmed into HRIS.'
  },
  {
    id: 'rem-2024-09-c',
    code: 'REM-2024-09-C',
    category: 'remediation',
    relatedFindingCode: 'FND-2024-09',
    relatedControlCode: 'CTL-CM-04',
    actionTitle: 'ServiceNow Hard Gating, P1 Incident Auto-Link and Retrospective CAB Escalations',
    remediationStrategy: 'Implemented automated ServiceNow business rule: when emergency change is marked "Deployed", a 48-hour countdown timer begins. If retrospective approval is not recorded within 36 hours, automated alerts dispatch to VP Engineering. At 48 hours, engineer deployment permissions in GitHub Actions are suspended.',
    implementationDate: '2024-11-01',
    leadOwner: 'ITSM Platform Lead & VP Engineering Operations',
    verificationEvidence: 'ServiceNow workflow definition, business rule script, and audit log for 4 recent emergency releases all approved within 28 hours.',
    retestResult: 'Partially Effective',
    lessonsLearned: 'Soft email warnings are ignored during crisis recovery; automated pipeline permission gating drives 100% compliance.'
  },
  {
    id: 'rem-2024-07-d',
    code: 'REM-2024-07-D',
    category: 'remediation',
    relatedFindingCode: 'FND-2024-07',
    relatedControlCode: 'CTL-DR-02',
    actionTitle: 'Dedicated Monthly Automated Aurora PostgreSQL Snapshot Restore VPC',
    remediationStrategy: 'Built automated Terraform and Python pipeline running monthly in us-west-2. It pulls the latest production database snapshot, restores an isolated Aurora cluster, executes 500 automated financial consistency queries, logs elapsed time, and terminates the environment.',
    implementationDate: '2024-09-30',
    leadOwner: 'Principal Cloud Resilience Engineer & Lead DBA',
    verificationEvidence: 'CloudWatch dashboard showing 3 consecutive monthly automated restorations completed with average RTO of 82 minutes (well below the 4-hour mandate).',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Testing disaster recovery once a year creates high anxiety and execution failure; automating monthly non-disruptive restores makes recovery muscle memory.'
  },
  {
    id: 'rem-2023-11-d',
    code: 'REM-2023-11-D',
    category: 'remediation',
    relatedFindingCode: 'FND-2023-11',
    relatedControlCode: 'CTL-VR-03',
    actionTitle: 'OneTrust Automated Fiscal Gap Calculator and Bridge Letter Requisition Trigger',
    remediationStrategy: 'Configured automated rule in OneTrust Vendor Risk Management: calculates gap between SOC 2 report testing end date and enterprise fiscal year-end (December 31). If gap > 30 days, generates vendor task requisitioning bridge letter 45 days in advance.',
    implementationDate: '2024-01-15',
    leadOwner: 'Director of Third-Party Risk Management',
    verificationEvidence: 'OneTrust workflow audit log showing bridge letters collected for 100% of Tier-1 Critical Vendors for FY2024.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Spreadsheets fail to track overlapping vendor fiscal calendars; automated GRC rule triggers eliminate audit surprises.'
  },
  {
    id: 'rem-2022-03-a',
    code: 'REM-2022-03-A',
    category: 'remediation',
    relatedFindingCode: 'FND-2022-03',
    relatedControlCode: 'CTL-LOG-05',
    actionTitle: 'Terraform Module Hard-Coded S3 Object Lock in Compliance Mode',
    remediationStrategy: 'Refactored enterprise terraform-aws-secure-bucket module. Hard-coded ObjectLockConfiguration to COMPLIANCE mode and minimum 365 days retention. Added pre-commit hook preventing deployment of logging buckets without lock configuration.',
    implementationDate: '2022-12-10',
    leadOwner: 'Cloud Security Engineering Lead',
    verificationEvidence: 'AWS CLI describe-bucket output verifying ObjectLockEnabled=Enabled and Mode=COMPLIANCE on all 8 corporate logging buckets.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Infrastructure-as-Code modules must enforce compliance by default so individual project teams cannot inadvertently configure insecure governance options.'
  },
  {
    id: 'rem-2024-14-a',
    code: 'REM-2024-14-A',
    category: 'remediation',
    relatedFindingCode: 'FND-2024-14',
    relatedControlCode: 'CTL-VUL-06',
    actionTitle: 'Automated Golden AMI Patch Pipeline and EC2 Fleet Auto-Recycle',
    remediationStrategy: 'Implemented Packer and AWS EC2 Image Builder pipeline that builds patched Golden AMIs weekly. Auto-Scaling Groups automatically recycle instances every 14 days, guaranteeing host OS patches are applied without manual engineering intervention.',
    implementationDate: '2024-07-30',
    leadOwner: 'DevOps Lead & Vulnerability Operations Manager',
    verificationEvidence: 'Qualys scan report showing 0 OpenSSL vulnerabilities and 100% EC2 fleet running Golden AMI build < 7 days old.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Treating servers as immutable cattle rather than pets eliminates vulnerability patching backlog.'
  },
  {
    id: 'rem-2023-18-b',
    code: 'REM-2023-18-B',
    category: 'remediation',
    relatedFindingCode: 'FND-2023-18',
    relatedControlCode: 'CTL-AC-01',
    actionTitle: 'Teleport Database Access Deployment and Revocation of Static DB Passwords',
    remediationStrategy: 'Revoked all static master database user credentials. Integrated Teleport Database Access across all Aurora PostgreSQL clusters. Direct database connections require temporary certificate valid for 4 hours with dual-approval workflow in Slack.',
    implementationDate: '2024-01-15',
    leadOwner: 'Chief Information Security Officer & Principal DBA',
    verificationEvidence: 'PostgreSQL pg_user table extract showing zero individual engineer accounts; 100% of connections routed through Teleport proxy with cryptographic audit log.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Static database passwords will inevitably be shared or abused during high-stress operational incidents; ephemeral certificate access is essential.'
  },
  {
    id: 'rem-2024-21-e',
    code: 'REM-2024-21-E',
    category: 'remediation',
    relatedFindingCode: 'FND-2024-21',
    relatedControlCode: 'CTL-NET-09',
    actionTitle: 'AWS Organization SCP Banning 0.0.0.0/0 on Sensitive Ports and VPC Peering Severance',
    remediationStrategy: 'Deployed mandatory Service Control Policy (SCP) across all AWS accounts that explicitly denies any authorize-security-group-ingress API call containing 0.0.0.0/0 on ports 22, 3389, and 5432. Severed legacy peering connections between Staging and Production VPCs.',
    implementationDate: '2024-06-25',
    leadOwner: 'Principal Cloud Network Architect',
    verificationEvidence: 'AWS SCP policy document JSON and AWS Config rule compliance dashboard showing 100% compliance across 48 AWS accounts.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Never rely on individual engineers to remember security group best practices; enforce preventive guardrails at the AWS Organization root level.'
  },
  {
    id: 'rem-2023-27-c',
    code: 'REM-2023-27-C',
    category: 'remediation',
    relatedFindingCode: 'FND-2023-27',
    relatedControlCode: 'CTL-API-10',
    actionTitle: 'HashiCorp Vault Dynamic Secrets and GitHub Pre-Commit Secret Blocking',
    remediationStrategy: 'Rotated compromised production master API key immediately. Integrated HashiCorp Vault dynamic API credentials into Jenkins CI/CD. Installed GitHub Secret Scanning and pre-commit Git hooks that automatically reject any commit containing API key patterns.',
    implementationDate: '2023-12-20',
    leadOwner: 'Lead Application Security Architect',
    verificationEvidence: 'GitHub secret scanning audit dashboard showing zero un-remediated secrets and HashiCorp Vault lease audit logs.',
    retestResult: 'Sustained / Effective',
    lessonsLearned: 'Preventing secret leakage at the developer workstation commit stage is 100x cheaper than remediating a leaked key in production.'
  }
];

export const SAMPLE_EVIDENCE_ARTIFACTS: EvidenceArtifact[] = [
  {
    id: 'ev-uar-2024-q3',
    title: 'SailPoint IdentityNow Q3 2024 Privileged Access Certification Report',
    controlCode: 'CTL-AC-01',
    period: 'FY2024-Q3',
    artifactType: 'Access Log',
    rawText: `SAILPOINT IDENTITYNOW CERTIFICATION CAMPAIGN REPORT
Campaign Name: 2024-Q3-Privileged-Infrastructure-Review
Target Census: 184 Accounts with AWS-Admin, K8s-Cluster-Admin, or Okta-SuperAdmin
Launch Date: 2024-07-01 00:00:00 UTC
Closing Date: 2024-07-15 23:59:59 UTC
Status: COMPLETED (100% certified)

Summary Statistics:
Total Entitlements Evaluated: 412
Entitlements Maintained (Approved): 389
Entitlements Revoked: 23
Revocation Verification Timestamp: 2024-07-16 02:14:22 UTC via automated SCIM connector.

Sample Items:
[Item #1] User: j.doe@company.com | Role: AWS-AdministratorAccess | Manager: s.williams@company.com | Decision: MAINTAINED | Decision Date: 2024-07-08 14:12 UTC
[Item #2] User: m.chen@company.com | Role: Okta-SuperAdmin | Manager: r.patel@company.com | Decision: MAINTAINED | Decision Date: 2024-07-12 09:30 UTC
[Item #3] User: k.smith@company.com | Role: DB-Prod-Superuser | Manager: s.williams@company.com | Decision: REVOKED | Decision Date: 2024-07-14 16:45 UTC | SCIM Deprovisioned: 2024-07-16 01:05 UTC (Verified Pass)
[Item #4] User: t.rodriguez@company.com | Role: CloudTrail-Admin | Manager: a.novak@company.com | Decision: MAINTAINED | Decision Date: 2024-07-15 21:10 UTC`,
    metadata: {
      sourceSystem: 'SailPoint IdentityNow API v3',
      exportHash: 'sha256:4a8b72e19f90240187ba51c4',
      campaignSigner: 'A. Novak, VP Security Operations'
    }
  },
  {
    id: 'ev-deprov-contr-4412',
    title: 'Workday vs Okta Contractor Deprovisioning Audit Extract (CONTR-4412)',
    controlCode: 'CTL-SEC-08',
    period: 'FY2024-Q3',
    artifactType: 'Access Log',
    rawText: `EMPLOYEE / CONTRACTOR SEPARATION RECONCILIATION REPORT
Audit Sample: Q3 2024 Contingent Worker Separations
Target SLA: POL-SEC-01 Section 4.2 (Max 24 hours voluntary; Max 2 hours involuntary)

Sample Population (5 Selected Records):
Record #1: EMP-1092 | Type: Full-Time | HR Termination Time: 2024-08-14 17:00:00 UTC | Okta Suspension Time: 2024-08-14 18:12:00 UTC | Delta: 1h 12m | Status: COMPLIANT
Record #2: CONTR-3901 | Type: Contractor | HR Termination Time: 2024-08-20 23:59:00 UTC | Okta Suspension Time: 2024-08-21 04:30:00 UTC | Delta: 4h 31m | Status: COMPLIANT
Record #3: CONTR-4412 | Type: Contractor | HR Termination Time: 2024-08-25 18:00:00 UTC | Okta Suspension Time: 2024-08-28 09:22:00 UTC | Delta: 63h 22m | Status: NON-COMPLIANT (EXCEEDS 24H SLA by 39h 22m)
Record #4: EMP-2290 | Type: Full-Time (Involuntary) | HR Notice Time: 2024-09-02 14:10:00 UTC | Okta Suspension Time: 2024-09-02 14:48:00 UTC | Delta: 38m | Status: COMPLIANT (Under 2h Involuntary SLA)
Record #5: CONTR-4590 | Type: Contractor | HR Termination Time: 2024-09-10 17:00:00 UTC | Okta Suspension Time: 2024-09-10 19:40:00 UTC | Delta: 2h 40m | Status: COMPLIANT

ANOMALY AUDIT NOTE:
Record #3 (CONTR-4412): Contractor access was not revoked until 63 hours 22 minutes after HR effective termination date. Historical precedent matches FND-2023-04. Requires Controller Exception Evaluation.`,
    metadata: {
      reconciliationScript: 'python3 verify_deprov_reconciliation.py --sample=q3',
      exportTimestamp: '2024-09-15T08:00:00Z',
      generatedBy: 'Internal Audit Automated Testing Bot'
    },
    knownAnomalies: [
      'CONTR-4412 exceeded 24-hour SLA by 39 hours 22 minutes (Policy breach: POL-SEC-01 §4.2, Standard breach: STD-IAM-101 §3.5).'
    ]
  },
  {
    id: 'ev-chg-emergency-09',
    title: 'ServiceNow Emergency Change Record CHG0088219 Post-Mortem',
    controlCode: 'CTL-CM-04',
    period: 'FY2024-Q3',
    artifactType: 'Change Ticket',
    rawText: `SERVICENOW CHANGE RECORD CHG0088219
Change Type: EMERGENCY
Short Description: Hotfix for Memory Leak in Payment Ingestion Gateway
Deployment Target: Production EKS Cluster (AWS us-east-1)
Deployment Timestamp: 2024-08-19 02:40:00 UTC
Incident Reference: INC0094120 (P1 Outage: Ingestion Gateway Crashing)

Authorization Audit Trail:
- Verbal Approval: Granted by Incident Commander (M. Taylor) on Incident Bridge at 2024-08-19 02:32:00 UTC.
- Retrospective CAB Submission: 2024-08-24 14:00:00 UTC (131 hours post-deployment).
- Retrospective CAB Sign-Off: 2024-08-24 16:30:00 UTC by CAB Chair.

CONTROLLER TESTING OBSERVATION:
SOP-CHG-05 Step 3 requires retrospective CAB approval within 48 hours of emergency deployment.
Actual retrospective submission occurred at 131 hours post-deployment (83 hours late).
Correlates with active Historical Finding FND-2024-09.`,
    metadata: {
      changeNumber: 'CHG0088219',
      incidentRef: 'INC0094120',
      system: 'Payment Ingestion Service'
    },
    knownAnomalies: [
      'Retrospective CAB review executed 131 hours post-deployment, violating 48-hour SLA in SOP-CHG-05.'
    ]
  },
  {
    id: 'ev-dr-restore-2024',
    title: 'FY2024 Annual Disaster Recovery Database Restoration and RTO Log',
    controlCode: 'CTL-DR-02',
    period: 'FY2024',
    artifactType: 'Disaster Recovery Log',
    rawText: `FY2024 DISASTER RECOVERY RESTORATION DRILL REPORT
Exercise Type: LIVE ISOLATED REGIONAL RESTORATION
Date of Exercise: 2024-09-22
Primary Region: us-east-1 | Target DR Region: us-west-2
Target Objective: Tier-1 RTO < 4 Hours (POL-BCP-04 Section 1.4)
Target Snapshot: rds:aurora-prod-cluster-2024-09-22-01-00-utc

Execution Timeline:
- 08:00:00 UTC: Unannounced failover signal initiated by DR Lead.
- 08:05:00 UTC: Terraform provisioned isolated recovery VPC in us-west-2.
- 08:14:00 UTC: AWS Backup restoration job started (Job ID: restore-98214-usw2).
- 09:36:00 UTC: Database cluster online in us-west-2 (Elapsed DB Restore Time: 1 hour 22 minutes).
- 09:50:00 UTC: Automated data integrity script completed:
    * Total accounts evaluated: 1,420,912
    * Ledger balance checksum: MATCH (0 variance against us-east-1 master)
- 10:45:00 UTC: Core synthetic transaction tests passed (Deposit, Transfer, Query: 100% success).
- 11:12:00 UTC: DR Lead certified full operational capability in us-west-2.

TOTAL END-TO-END RTO MEASURED: 3 Hours 12 Minutes (192 Minutes).
GOVERNANCE VERDICT: PASS (Under 4-hour statutory threshold).`,
    metadata: {
      exerciseLead: 'R. Vance, Lead DR Coordinator',
      rtoMeasuredMinutes: '192',
      rtoThresholdMinutes: '240'
    }
  }
];
