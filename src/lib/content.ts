export type ModuleStatus = "available" | "coming-soon";

export type LearningModule = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  accent: string;
  softAccent: string;
  maxPoints: number;
  status: ModuleStatus;
};

export type Question = {
  id: string;
  prompt: string;
  points: number;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
  topic: string;
};

export const modules: LearningModule[] = [
  { slug: "phishing-email", title: "Phishing: The Lure (Email)", shortTitle: "Phishing", description: "Spot suspicious emails, verify requests, and report threats.", icon: "Mail", accent: "#19b9a5", softAccent: "#d8faf4", maxPoints: 500, status: "available" },
  { slug: "passwords-2fa", title: "The Strong Vault: Passwords & 2FA", shortTitle: "Passwords & 2FA", description: "Build stronger authentication habits.", icon: "LockKeyhole", accent: "#2965e8", softAccent: "#e2edff", maxPoints: 550, status: "coming-soon" },
  { slug: "malware-ransomware", title: "Malware & Ransomware Defense", shortTitle: "Malware Defense", description: "Understand infections, updates, and backups.", icon: "Zap", accent: "#28a653", softAccent: "#ddf9e5", maxPoints: 650, status: "coming-soon" },
  { slug: "vishing-smishing", title: "Vishing & Smishing (Non-Email Threats)", shortTitle: "Vishing & Smishing", description: "Recognize phone and text message scams.", icon: "Phone", accent: "#f97316", softAccent: "#fff0df", maxPoints: 550, status: "coming-soon" },
  { slug: "physical-travel", title: "Physical, Travel, & Remote Security", shortTitle: "Remote Security", description: "Protect devices and information everywhere.", icon: "Globe2", accent: "#9333ea", softAccent: "#f2e6ff", maxPoints: 600, status: "coming-soon" },
  { slug: "data-compliance", title: "Data Handling, Reporting, & Compliance", shortTitle: "Data Handling", description: "Handle sensitive information responsibly.", icon: "ClipboardList", accent: "#5548e8", softAccent: "#ebe9ff", maxPoints: 700, status: "coming-soon" },
  { slug: "social-engineering", title: "Social Engineering & Modern Scams", shortTitle: "Modern Scams", description: "Resist manipulation and impersonation.", icon: "Users", accent: "#e7194c", softAccent: "#ffe4eb", maxPoints: 750, status: "coming-soon" },
  { slug: "financial-crypto", title: "Financial & Cryptocurrency Scams", shortTitle: "Financial Scams", description: "Recognize investment and crypto fraud.", icon: "Bitcoin", accent: "#f59e0b", softAccent: "#fff2cc", maxPoints: 800, status: "coming-soon" },
];

export const phishingLesson = [
  {
    title: "What is phishing?",
    body: "Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity, typically through email. It remains one of the most common forms of cyber attack.",
  },
  {
    title: "Red flags of a phishing email",
    bullets: [
      "Urgent or threatening language designed to make you act before thinking.",
      "Generic greetings or a sender address that does not match the claimed organization.",
      "Suspicious links and unexpected attachments.",
      "Spelling, grammar, or formatting that feels unusual for the sender.",
    ],
  },
  {
    title: "Your best defense: skepticism",
    body: "Do not click links or download attachments from suspicious messages. Navigate to the official website directly, verify requests through a trusted channel, and report phishing attempts to IT or Security.",
  },
];

export const phishingQuestions: Question[] = [
  {
    id: "report-phishing",
    prompt: "After identifying a suspicious email as a phishing attempt, what is the recommended next step?",
    points: 150,
    topic: "Reporting",
    options: [
      { id: "forward", label: "Forward it to all your colleagues to warn them." },
      { id: "delete", label: "Mark it as spam and delete it." },
      { id: "reply", label: "Reply to the sender telling them you know it's a scam." },
      { id: "report", label: "Report it to your IT/Security department using the official reporting channel." },
    ],
    correctOptionId: "report",
    explanation: "Reporting phishing attempts to your IT/Security department is crucial. They can analyze the email, block the sender, and implement broader defenses to protect the organization.",
  },
  {
    id: "clicked-link",
    prompt: "What should you do if you accidentally click a link in a phishing email?",
    points: 100,
    topic: "Incident response",
    options: [
      { id: "restart", label: "Immediately restart your computer." },
      { id: "disconnect", label: "Disconnect from the internet and report it to IT/Security right away." },
      { id: "delete", label: "Delete the email from your inbox and trash." },
      { id: "scan", label: "Run an antivirus scan and hope for the best." },
    ],
    correctOptionId: "disconnect",
    explanation: "Disconnecting from the network can prevent potential malware from spreading or phoning home. Reporting immediately allows the security team to take action.",
  },
  {
    id: "biggest-red-flag",
    prompt: "Which of these is the BIGGEST red flag for a phishing email?",
    points: 100,
    topic: "Detection",
    options: [
      { id: "logo", label: "The email contains the company's official logo." },
      { id: "public-domain", label: "The sender's email address is from a public domain (like @gmail.com) but claims to be a bank." },
      { id: "first-name", label: "The email is addressed to you by your first name." },
      { id: "discount", label: "The email offers you a discount on a future purchase." },
    ],
    correctOptionId: "public-domain",
    explanation: "Legitimate businesses, especially banks, use official corporate domains rather than free public ones. A mismatch is a strong indicator of phishing.",
  },
  {
    id: "netflix",
    prompt: "You receive an email from 'Netflix' with the subject 'Your account is on hold'. It asks you to click a link to update your payment details. What is the safest course of action?",
    points: 150,
    topic: "Verification",
    options: [
      { id: "click", label: "Click the link and enter your details; you don't want to miss your shows." },
      { id: "ignore", label: "Ignore the email and assume it's a mistake." },
      { id: "official-site", label: "Open a new browser window, go to the official Netflix website, and check your account status there." },
      { id: "reply", label: "Reply to the email asking for confirmation." },
    ],
    correctOptionId: "official-site",
    explanation: "Never trust links in unexpected account-security emails. Go directly to the official website through a trusted method to verify any claim.",
  },
];

export const phishingCheatSheet = [
  "Be wary of emails creating a sense of urgency or fear.",
  "Hover over links to inspect the true destination URL before clicking.",
  "Verify the sender's email address; do not trust the display name alone.",
  "Never open unexpected attachments, especially from unknown senders.",
];

export const getModule = (slug: string) => modules.find((module) => module.slug === slug);
