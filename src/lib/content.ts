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
  passThreshold: number;
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

export type LessonSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

export const modules: LearningModule[] = [
  { slug: "phishing-email", title: "Phishing: The Lure (Email)", shortTitle: "Phishing", description: "Spot suspicious emails, verify requests, and report threats.", icon: "Mail", accent: "#19b9a5", softAccent: "#d8faf4", maxPoints: 500, passThreshold: 350, status: "available" },
  { slug: "passwords-2fa", title: "The Strong Vault: Passwords & 2FA", shortTitle: "Passwords & 2FA", description: "Build stronger authentication habits.", icon: "LockKeyhole", accent: "#2965e8", softAccent: "#e2edff", maxPoints: 550, passThreshold: 385, status: "available" },
  { slug: "malware-ransomware", title: "Malware & Ransomware Defense", shortTitle: "Malware Defense", description: "Understand infections, updates, and backups.", icon: "Zap", accent: "#28a653", softAccent: "#ddf9e5", maxPoints: 650, passThreshold: 455, status: "available" },
  { slug: "vishing-smishing", title: "Vishing & Smishing (Non-Email Threats)", shortTitle: "Vishing & Smishing", description: "Recognize phone and text message scams.", icon: "Phone", accent: "#f97316", softAccent: "#fff0df", maxPoints: 550, passThreshold: 385, status: "available" },
  { slug: "physical-travel", title: "Physical, Travel, & Remote Security", shortTitle: "Remote Security", description: "Protect devices and information everywhere.", icon: "Globe2", accent: "#9333ea", softAccent: "#f2e6ff", maxPoints: 600, passThreshold: 420, status: "available" },
  { slug: "data-compliance", title: "Data Handling, Reporting, & Compliance", shortTitle: "Data Handling", description: "Handle sensitive information responsibly.", icon: "ClipboardList", accent: "#5548e8", softAccent: "#ebe9ff", maxPoints: 700, passThreshold: 490, status: "available" },
  { slug: "social-engineering", title: "Social Engineering & Modern Scams", shortTitle: "Modern Scams", description: "Resist manipulation and impersonation.", icon: "Users", accent: "#e7194c", softAccent: "#ffe4eb", maxPoints: 750, passThreshold: 525, status: "available" },
  { slug: "financial-crypto", title: "Financial & Cryptocurrency Scams", shortTitle: "Financial Scams", description: "Recognize investment and crypto fraud.", icon: "Bitcoin", accent: "#f59e0b", softAccent: "#fff2cc", maxPoints: 750, passThreshold: 525, status: "available" },
];

export const moduleLessons: Record<string, LessonSection[]> = {
  "phishing-email": [
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
  ],
  "passwords-2fa": [
    {
      title: "Beyond 'password123'",
      body: "A strong password is your first and most crucial line of defense. Attackers use automated software to guess millions of passwords per second. Simple, common, or personal passwords can be cracked almost instantly.",
    },
    {
      title: "The Pillars of a Strong Password",
      bullets: [
        "Length is Strength: Aim for at least 14 characters. Each additional character makes a password exponentially harder to crack.",
        "Complexity is Key: Use a mix of uppercase letters, lowercase letters, numbers, and symbols (e.g., !@#$%).",
        "Uniqueness is Non-Negotiable: Never reuse passwords across different websites. A breach on one site would expose all your accounts.",
      ],
    },
    {
      title: "Your Secret Weapon: The Password Manager",
      body: "It's impossible to remember dozens of unique, complex passwords. A trusted password manager solves this. It generates, stores, and auto-fills ultra-strong passwords for you, so you only need to remember one master password.",
    },
    {
      title: "Two-Factor Authentication (2FA/MFA)",
      body: "2FA is a security force multiplier. It requires a second form of verification (like a code from your phone) besides your password. This means even if an attacker steals your password, they cannot get into your account. Enable it everywhere.",
    },
  ],
  "malware-ransomware": [
    {
      title: "Understanding Malicious Software",
      body: "Malware is any software designed to harm your system. It includes viruses, spyware, and trojans. Ransomware is a particularly nasty type that encrypts all your files, holding them hostage until you pay a fee.",
    },
    {
      title: "Common Infection Vectors",
      bullets: [
        "Phishing Emails: Clicking malicious links or opening infected attachments is the #1 way malware spreads.",
        "Malicious Downloads: Software from untrusted websites, often disguised as 'free' games or utilities, can be bundled with malware.",
        "Unpatched Software: Attackers exploit security holes in outdated software (your OS, browser, or applications). Keeping everything updated is critical.",
      ],
    },
    {
      title: "Your Defensive Strategy",
      body: "A multi-layered defense is key. Use a reputable antivirus/anti-malware program and keep it updated. Be extremely cautious about what you click and download. Regularly back up your important files to an external drive or cloud service; this is your best defense against ransomware.",
    },
  ],
  "vishing-smishing": [
    {
      title: "Phishing Beyond Email",
      body: "Social engineering doesn't just happen in your inbox. Attackers also use phone calls and text messages to trick you. This is known as Vishing (Voice Phishing) and Smishing (SMS Phishing).",
    },
    {
      title: "Common Scams and Tactics",
      bullets: [
        "Urgent Bank Alerts (Smishing): A text message claims your account is frozen and provides a link to 'verify' your identity. The link leads to a fake login page.",
        "Tech Support Scams (Vishing): An unsolicited call from someone claiming to be from Microsoft or Apple, stating your computer is infected. They aim to get remote access or payment.",
        "Impersonation: Attackers may pretend to be from the IRS, a delivery service, or even your own company's IT helpdesk.",
      ],
    },
    {
      title: "How to Respond",
      body: "The golden rule is: Never trust, always verify. Do not click links in suspicious texts. Hang up on unsolicited calls. If the message claims to be from a company you do business with, contact them directly using a phone number or website you know is legitimate. Never use the contact info provided in the message or call.",
    },
  ],
  "physical-travel": [
    {
      title: "Security is Not Just Digital",
      body: "Protecting information goes beyond firewalls. Physical security means protecting your devices and your screen from unauthorized access in the real world.",
    },
    {
      title: "In the Office and On the Go",
      bullets: [
        "Lock Your Screen: Always lock your computer when you step away, even for a moment. (Win+L on Windows, Cmd+Ctrl+Q on Mac).",
        "Beware of Shoulder Surfing: Be aware of your surroundings in public places like cafes or airports. People can watch you enter passwords or view sensitive data over your shoulder.",
        "Secure Your Devices: Never leave laptops, phones, or tablets unattended in public. When traveling, keep them in your possession, not in checked luggage.",
      ],
    },
    {
      title: "The Dangers of Public Wi-Fi",
      body: "Public Wi-Fi is not secure. Attackers on the same network can potentially intercept your data. Avoid logging into sensitive accounts (bank, email) on public Wi-Fi. If you must use it, always use a trusted Virtual Private Network (VPN) to encrypt your connection.",
    },
  ],
  "data-compliance": [
    {
      title: "Not All Data is Equal",
      body: "Data is often classified by its sensitivity: Public (press releases), Internal (org charts), and Confidential/Restricted (personally identifiable information (PII), financial records, health information). You have a responsibility to protect sensitive data.",
    },
    {
      title: "Secure Handling and Disposal",
      bullets: [
        "Need to Know: Only access and share sensitive data with those who have a legitimate business need.",
        "Secure Storage: Store confidential data on approved, encrypted systems, not on personal devices or unsecured cloud services.",
        "Proper Disposal: Don't just throw sensitive information away. Physical documents should be shredded. Digital files should be securely deleted, not just moved to the trash bin.",
      ],
    },
    {
      title: "When Things Go Wrong: Incident Reporting",
      body: "If you suspect a security incident (e.g., you clicked a phishing link, lost a work device, or see suspicious activity), you must report it immediately to the designated contact (IT, InfoSec, your manager). Fast reporting is critical to minimizing damage.",
    },
  ],
  "social-engineering": [
    {
      title: "The Human Element",
      body: "Social engineering is the art of manipulating people so they give up confidential information. Attackers know that humans are often the weakest link in the security chain.",
    },
    {
      title: "Modern Scam Tactics",
      bullets: [
        "CEO Fraud / Business Email Compromise (BEC): An attacker impersonates a high-level executive (like the CEO) and emails an employee, usually in finance, urgently requesting a wire transfer or sensitive data.",
        "Deepfakes & AI Voice Cloning: Scammers use AI to clone the voice of a loved one or an executive, calling to demand immediate financial assistance or authorize transactions.",
        "Baiting & Quid Pro Quo: Leaving an infected USB drive in a parking lot (baiting) or offering a fake benefit in exchange for information (quid pro quo).",
        "Pretexting: Creating a fabricated scenario (a pretext) to steal personal information, such as pretending to be a survey researcher or a bank official.",
      ],
    },
    {
      title: "Defending Against Manipulation",
      body: "Always verify unusual requests, especially those involving money or sensitive data, through a secondary channel. If the 'CEO' emails you for an urgent wire transfer, call them or speak to them in person to confirm. Be skeptical of unsolicited offers and never plug in unknown devices.",
    },
  ],
  "financial-crypto": [
    {
      title: "The Rise of Crypto Scams",
      body: "With the popularity of cryptocurrency, scammers have developed sophisticated methods to steal digital assets. Because crypto transactions are often irreversible, they are a prime target for fraudsters.",
    },
    {
      title: "Common Financial Scams",
      bullets: [
        "Pig Butchering (Investment Scams): Scammers build a long-term relationship (often romantic or friendly) online, then convince the victim to invest in a fake crypto platform. They show fake profits to encourage larger investments before disappearing with the money.",
        "Fake Exchanges & Wallets: Malicious apps or websites designed to look like legitimate crypto exchanges. Once you deposit funds or enter your seed phrase, your assets are stolen.",
        "Tech Support & Refund Scams: Scammers claim you are owed a refund or your account is compromised, then guide you to transfer funds or grant remote access to your device.",
        "Giveaway Scams: Fake social media posts from 'celebrities' promising to double any crypto you send to their address.",
      ],
    },
    {
      title: "Protecting Your Assets",
      body: "Never share your wallet's seed phrase or private keys with anyone. Be extremely skeptical of 'guaranteed' high returns or pressure to invest quickly. Only use well-known, established cryptocurrency exchanges and verify URLs carefully before logging in.",
    },
  ],
};

export const moduleQuestions: Record<string, Question[]> = {
  "phishing-email": [
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
  ],
  "passwords-2fa": [
    {
      id: "password-manager",
      prompt: "What is the most effective way to manage unique, complex passwords for all your accounts?",
      points: 150,
      topic: "Password management",
      options: [
        { id: "notebook", label: "Write them down in a notebook" },
        { id: "manager", label: "Use a trusted password manager application" },
        { id: "monthly", label: "Use the same password everywhere but change it monthly" },
        { id: "pet-name", label: "Use variations of your pet's name" },
      ],
      correctOptionId: "manager",
      explanation: "Password managers are designed to securely create, store, and manage unique and strong passwords for every account, eliminating password reuse and the need to remember them all.",
    },
    {
      id: "strong-password",
      prompt: "Which password example follows best practices for strength and uniqueness?",
      points: 150,
      topic: "Password strength",
      options: [
        { id: "yourcompany", label: "YourCompany123" },
        { id: "passwordforwork", label: "P@ssword ForWork!" },
        { id: "applepi", label: "aPpLePi3&C0ff33!" },
        { id: "qwerty", label: "QwertY@123" },
      ],
      correctOptionId: "applepi",
      explanation: "'aPpLePi3&C0ff33!' is a strong passphrase that is long, complex, and avoids common patterns, making it highly resistant to cracking. The others use common patterns or are too short/simple.",
    },
    {
      id: "weakest-password",
      prompt: "Which of the following is the WEAKEST password?",
      points: 100,
      topic: "Password strength",
      options: [
        { id: "random", label: "Fg#9k$2(j@1Po!" },
        { id: "summer", label: "Summer2024!" },
        { id: "dogname", label: "MyDogFido123" },
        { id: "troubadour", label: "Tr0ub4dor&3" },
      ],
      correctOptionId: "summer",
      explanation: "'Summer2024!' is predictable and follows a common pattern (word + year + symbol), making it much easier to guess with automated tools than a truly random string of characters.",
    },
    {
      id: "2fa-benefit",
      prompt: "What is the primary benefit of Two-Factor Authentication (2FA)?",
      points: 150,
      topic: "2FA",
      options: [
        { id: "stronger-password", label: "It makes your password stronger" },
        { id: "prevents-theft", label: "It prevents your password from being stolen" },
        { id: "second-layer", label: "It adds a second layer of security, making your account inaccessible even if your password is stolen" },
        { id: "auto-login", label: "It automatically logs you into your accounts" },
      ],
      correctOptionId: "second-layer",
      explanation: "2FA's main strength is that it requires a second factor (something you have, like your phone) in addition to your password (something you know), stopping attackers who have only stolen the password.",
    },
  ],
  "malware-ransomware": [
    {
      id: "ransomware-definition",
      prompt: "What is the defining characteristic of a ransomware attack?",
      points: 200,
      topic: "Ransomware",
      options: [
        { id: "steals-password", label: "It steals your password" },
        { id: "slows-down", label: "It slows down your computer" },
        { id: "encrypts-files", label: "It encrypts your files and demands a payment for their release" },
        { id: "popups", label: "It displays unwanted pop-up ads" },
      ],
      correctOptionId: "encrypts-files",
      explanation: "Ransomware's goal is extortion. It makes your files unusable by encrypting them and then demands a ransom payment, usually in cryptocurrency, for the decryption key.",
    },
    {
      id: "software-updates",
      prompt: "Why is it crucial to keep your operating system and applications updated?",
      points: 100,
      topic: "Patching",
      options: [
        { id: "new-features", label: "To get new features and a better user interface" },
        { id: "fix-vulnerabilities", label: "To fix security vulnerabilities that malware can exploit" },
        { id: "compatibility", label: "To ensure compatibility with new websites" },
        { id: "faster", label: "To make your software run faster" },
      ],
      correctOptionId: "fix-vulnerabilities",
      explanation: "Software updates frequently include 'patches' for security holes that have been discovered. Attackers specifically target these known vulnerabilities in outdated software to deliver malware.",
    },
    {
      id: "ransomware-recovery",
      prompt: "What is the single most effective way to recover from a ransomware attack without paying the ransom?",
      points: 200,
      topic: "Ransomware recovery",
      options: [
        { id: "unplug", label: "Unplugging your computer from the internet" },
        { id: "scan-after", label: "Running an antivirus scan after the attack" },
        { id: "backups", label: "Having recent, secure backups of your important files" },
        { id: "negotiate", label: "Negotiating with the attackers for a lower price" },
      ],
      correctOptionId: "backups",
      explanation: "If you have clean backups, you can restore your files without needing to pay the attackers. This neutralizes their primary leverage and is a critical part of any security strategy.",
    },
    {
      id: "malware-vectors",
      prompt: "Which of these is NOT a common way malware can infect a computer?",
      points: 150,
      topic: "Malware vectors",
      options: [
        { id: "official-updates", label: "Through official software updates from trusted vendors" },
        { id: "phishing-links", label: "By clicking malicious links in phishing emails" },
        { id: "cracked-software", label: "Downloading cracked software from untrusted websites" },
        { id: "exploit-vuln", label: "Exploiting security vulnerabilities in outdated software" },
      ],
      correctOptionId: "official-updates",
      explanation: "Official software updates from trusted vendors are designed to fix security flaws and add features, not introduce malware. Malware typically spreads through malicious downloads, phishing, or exploiting vulnerabilities.",
    },
  ],
  "vishing-smishing": [
    {
      id: "smishing-link",
      prompt: "You receive a text message from an unknown number that says: 'Your bank account has been locked due to suspicious activity. Click here to unlock it: [link]'. What should you do?",
      points: 200,
      topic: "Smishing",
      options: [
        { id: "click-link", label: "Click the link immediately to secure your account" },
        { id: "reply-stop", label: "Reply 'STOP' to the text message" },
        { id: "official-app", label: "Delete the message and contact your bank using their official website or app" },
        { id: "call-back", label: "Call the phone number the text came from" },
      ],
      correctOptionId: "official-app",
      explanation: "This is a classic smishing tactic. The link leads to a fake site designed to steal your login credentials. Always verify such claims by contacting the institution through an official, trusted channel you find yourself.",
    },
    {
      id: "tech-support-call",
      prompt: "A person calls you claiming to be from 'Microsoft Tech Support' and says they've detected a virus on your computer. They ask to remotely access your machine. You should:",
      points: 200,
      topic: "Vishing",
      options: [
        { id: "follow-instructions", label: "Follow their instructions, as Microsoft is a trusted company" },
        { id: "ask-id", label: "Ask for their employee ID number to verify them" },
        { id: "hang-up", label: "Politely hang up the phone" },
        { id: "give-ip", label: "Give them your IP address so they can run a scan" },
      ],
      correctOptionId: "hang-up",
      explanation: "Legitimate tech support from companies like Microsoft or Apple will never call you unsolicited. This is a scam to gain control of your computer, steal data, or install malware. The only safe action is to hang up.",
    },
    {
      id: "phishing-vishing-smishing",
      prompt: "What is the key difference between Phishing, Vishing, and Smishing?",
      points: 150,
      topic: "Definitions",
      options: [
        { id: "info-type", label: "The type of information they try to steal" },
        { id: "country", label: "The country they originate from" },
        { id: "medium", label: "The medium they use: email, voice call, or SMS text message" },
        { id: "danger-level", label: "The level of danger they pose" },
      ],
      correctOptionId: "medium",
      explanation: "They are all forms of social engineering designed to trick you. The only difference is the communication channel used: Phishing (email), Vishing (voice), and Smishing (SMS).",
    },
  ],
  "physical-travel": [
    {
      id: "shoulder-surfing",
      prompt: "What is 'shoulder surfing'?",
      points: 200,
      topic: "Physical security",
      options: [
        { id: "browsing-technique", label: "A new web browsing technique" },
        { id: "screen-protector", label: "Using a screen protector to block side views" },
        { id: "observing-screen", label: "The act of observing someone's screen or keyboard to steal information" },
        { id: "malware-watch", label: "A type of malware that watches your screen" },
      ],
      correctOptionId: "observing-screen",
      explanation: "Shoulder surfing is a low-tech but effective method of stealing confidential information, like passwords or PINs, by simply looking over someone's shoulder.",
    },
    {
      id: "public-wifi",
      prompt: "When working in a public coffee shop, what is the best way to protect your data on their Wi-Fi network?",
      points: 200,
      topic: "Public Wi-Fi",
      options: [
        { id: "https-only", label: "Only visit websites that use HTTPS" },
        { id: "vpn", label: "Use a Virtual Private Network (VPN)" },
        { id: "ask-barista", label: "Ask the barista if the Wi-Fi is secure" },
        { id: "short-connection", label: "Connect only for a few minutes at a time" },
      ],
      correctOptionId: "vpn",
      explanation: "While HTTPS is good, a VPN is the most comprehensive solution. It encrypts ALL your internet traffic, creating a secure tunnel that prevents anyone on the same network from snooping on your activity.",
    },
    {
      id: "lock-shortcut",
      prompt: "What is the keyboard shortcut to quickly lock your computer screen on Windows?",
      points: 200,
      topic: "Device security",
      options: [
        { id: "ctrl-alt-del", label: "Ctrl + Alt + Delete" },
        { id: "alt-f4", label: "Alt + F4" },
        { id: "win-l", label: "Windows Key + L" },
        { id: "ctrl-l", label: "Ctrl + L" },
      ],
      correctOptionId: "win-l",
      explanation: "Windows Key + L is the fastest way to lock your screen, a critical habit to build whenever you step away from your desk to prevent unauthorized physical access.",
    },
  ],
  "data-compliance": [
    {
      id: "pii-classification",
      prompt: "An employee's home address and phone number is an example of what kind of data?",
      points: 250,
      topic: "Data classification",
      options: [
        { id: "public", label: "Public" },
        { id: "internal", label: "Internal" },
        { id: "pii", label: "Confidential / Personally Identifiable Information (PII)" },
        { id: "trivial", label: "Trivial" },
      ],
      correctOptionId: "pii",
      explanation: "PII is any data that can be used to identify a specific individual. It's considered sensitive, confidential data and must be protected to prevent identity theft and privacy violations.",
    },
    {
      id: "document-disposal",
      prompt: "What is the correct way to dispose of a printed document containing confidential client information?",
      points: 250,
      topic: "Data disposal",
      options: [
        { id: "tear-recycle", label: "Tear it in half and put it in the recycling bin" },
        { id: "regular-trash", label: "Put it in the regular trash can" },
        { id: "shredder", label: "Use a cross-cut shredder" },
        { id: "leave-desk", label: "Leave it on your desk for the cleaning crew to handle" },
      ],
      correctOptionId: "shredder",
      explanation: "Simply throwing away sensitive documents can lead to 'dumpster diving' attacks. A cross-cut shredder makes the documents extremely difficult to reconstruct, which is the standard for secure disposal.",
    },
    {
      id: "incident-reporting",
      prompt: "You realize you accidentally clicked a link in a suspicious email. What is the most important first step?",
      points: 200,
      topic: "Incident reporting",
      options: [
        { id: "antivirus-scan", label: "Immediately run an antivirus scan" },
        { id: "turn-off", label: "Turn off your computer and hope for the best" },
        { id: "tell-no-one", label: "Don't tell anyone to avoid getting in trouble" },
        { id: "report-it", label: "Immediately report the incident to your IT/Security department" },
      ],
      correctOptionId: "report-it",
      explanation: "Time is critical during a potential breach. Your security team has tools and procedures to investigate and contain threats, but they need to know as soon as possible. Reporting quickly is the most responsible action.",
    },
  ],
  "social-engineering": [
    {
      id: "pretexting-goal",
      prompt: "What is the primary goal of a 'pretexting' attack?",
      points: 250,
      topic: "Pretexting",
      options: [
        { id: "ransomware", label: "To infect your computer with ransomware" },
        { id: "fabricated-scenario", label: "To create a fabricated scenario to trick you into revealing sensitive information" },
        { id: "guess-password", label: "To guess your password using automated tools" },
        { id: "steal-laptop", label: "To physically steal your laptop" },
      ],
      correctOptionId: "fabricated-scenario",
      explanation: "Pretexting involves an attacker inventing a scenario (the pretext) to engage a victim and increase the chance they will divulge information or perform actions that would be unlikely in ordinary circumstances.",
    },
    {
      id: "usb-found",
      prompt: "You find a USB drive in the company parking lot. What is the safest course of action?",
      points: 250,
      topic: "Baiting",
      options: [
        { id: "plug-own", label: "Plug it into your computer to see who it belongs to so you can return it" },
        { id: "plug-public", label: "Plug it into a public computer at a library to check its contents safely" },
        { id: "trash", label: "Throw it in the trash" },
        { id: "give-it", label: "Give it to your IT or Security department" },
      ],
      correctOptionId: "give-it",
      explanation: "This is a 'baiting' attack. The USB drive could be loaded with malware that will infect any computer it's plugged into. IT/Security has safe ways to examine such devices.",
    },
    {
      id: "ceo-wire-transfer",
      prompt: "You receive an urgent email from your company's CEO asking you to immediately wire $50,000 to a new vendor. The email address looks correct. What should you do?",
      points: 250,
      topic: "BEC",
      options: [
        { id: "process-transfer", label: "Process the wire transfer immediately to avoid upsetting the CEO" },
        { id: "reply-invoice", label: "Reply to the email asking for the invoice" },
        { id: "verify-secondary", label: "Call the CEO or speak to them in person to verify the request" },
        { id: "forward-finance", label: "Forward the email to the finance department to handle" },
      ],
      correctOptionId: "verify-secondary",
      explanation: "This is a classic Business Email Compromise (BEC) scenario. Always verify unusual or urgent financial requests through a secondary, trusted communication channel (like a phone call or in-person conversation) before taking action.",
    },
  ],
  "financial-crypto": [
    {
      id: "pig-butchering",
      prompt: "Someone you met online a few months ago suggests you invest in a new crypto trading platform that guarantees a 20% weekly return. They even show you screenshots of their profits. What should you do?",
      points: 250,
      topic: "Investment scams",
      options: [
        { id: "small-investment", label: "Start with a small investment to test the waters." },
        { id: "ask-details", label: "Ask them for more details about how the platform works." },
        { id: "pig-butchering", label: "Recognize this as a likely 'pig butchering' scam and cut off contact." },
        { id: "borrow-money", label: "Borrow money to maximize your potential returns." },
      ],
      correctOptionId: "pig-butchering",
      explanation: "This is a classic 'pig butchering' investment scam. Scammers build trust over time and use fake platforms showing fabricated profits to lure victims into investing large sums of money.",
    },
    {
      id: "seed-phrase",
      prompt: "You receive an email from a popular crypto exchange saying your account needs verification and asks you to enter your 12-word seed phrase. What is the correct action?",
      points: 250,
      topic: "Wallet security",
      options: [
        { id: "enter-it", label: "Enter the seed phrase to ensure your account isn't locked." },
        { id: "ignore-email", label: "Ignore the email, as legitimate exchanges will NEVER ask for your seed phrase." },
        { id: "reply-why", label: "Reply to the email asking why they need it." },
        { id: "forward-friend", label: "Forward the email to a friend for advice." },
      ],
      correctOptionId: "ignore-email",
      explanation: "Your seed phrase is the master key to your crypto wallet. Legitimate exchanges or support staff will never ask for it. Anyone asking for your seed phrase is trying to steal your funds.",
    },
    {
      id: "giveaway-scam",
      prompt: "A famous entrepreneur tweets that they are giving back to the community and will double any Bitcoin sent to a specific address. What is this?",
      points: 250,
      topic: "Giveaway scams",
      options: [
        { id: "legit-giveaway", label: "A legitimate promotional giveaway." },
        { id: "giveaway-scam", label: "A common giveaway scam, often using compromised verified accounts." },
        { id: "smart-contract-test", label: "A smart contract testing phase." },
        { id: "investment-opportunity", label: "An exclusive investment opportunity." },
      ],
      correctOptionId: "giveaway-scam",
      explanation: "Giveaway scams are very common on social media. Scammers often hack verified accounts or create convincing fake profiles to trick people into sending crypto, which is never returned.",
    },
  ],
};

export const moduleCheatSheets: Record<string, string[]> = {
  "phishing-email": [
    "Be wary of emails creating a sense of urgency or fear.",
    "Hover over links to inspect the true destination URL before clicking.",
    "Verify the sender's email address; do not trust the display name alone.",
    "Never open unexpected attachments, especially from unknown senders.",
  ],
  "passwords-2fa": [
    "Use a password manager to create unique passwords for every service.",
    "Enable Two-Factor Authentication (2FA) on all critical accounts.",
    "Make passwords long (14+ characters) and complex (mix of cases, numbers, symbols).",
    "Never reuse passwords. A breach on one site will compromise others.",
  ],
  "malware-ransomware": [
    "Ransomware encrypts your files and demands payment; backups are your best defense.",
    "Keep your operating system, browser, and all applications fully updated.",
    "Use a reputable antivirus program and keep its definitions current.",
    "Be highly suspicious of unsolicited email attachments and downloads from untrusted sites.",
  ],
  "vishing-smishing": [
    "Vishing = Voice Phishing (scams via phone calls).",
    "Smishing = SMS Phishing (scams via text messages).",
    "Never click links or call numbers from unsolicited texts or calls.",
    "Verify any urgent request by contacting the company through their official website or phone number.",
  ],
  "physical-travel": [
    "Always lock your computer when you step away (Win+L or Cmd+Ctrl+Q).",
    "Use a VPN to encrypt your connection on public Wi-Fi networks.",
    "Be aware of 'shoulder surfers' watching your screen in public places.",
    "Never leave devices like laptops or phones unattended.",
  ],
  "data-compliance": [
    "Classify data based on sensitivity (Public, Internal, Confidential).",
    "Handle confidential data with care and only share on a 'need-to-know' basis.",
    "Securely dispose of sensitive data by shredding physical documents.",
    "Report any suspected security incident to your IT/Security team IMMEDIATELY.",
  ],
  "social-engineering": [
    "Verify urgent financial requests from executives via a secondary channel (e.g., phone call).",
    "Be aware that AI can now clone voices and create convincing deepfakes.",
    "Never plug unknown USB drives or devices into your computer.",
    "Be skeptical of unsolicited requests for information, even if they seem to come from an authority figure.",
  ],
  "financial-crypto": [
    "Never share your crypto wallet's seed phrase or private keys with anyone.",
    "Be highly skeptical of online acquaintances pushing 'guaranteed' high-return investments.",
    "Legitimate tech support will never ask you to send cryptocurrency.",
    "If an offer sounds too good to be true (like doubling your money), it is a scam.",
  ],
};

export const getModule = (slug: string) => modules.find((module) => module.slug === slug);
export const getModuleLesson = (slug: string): LessonSection[] => moduleLessons[slug] ?? [];
export const getModuleQuestions = (slug: string): Question[] => moduleQuestions[slug] ?? [];
export const getModuleCheatSheet = (slug: string): string[] => moduleCheatSheets[slug] ?? [];
