insert into public.levels(name, minimum_points, status_name) values
('Level 1', 0, 'Security Starter'), ('Level 2', 250, 'Threat Spotter'), ('Level 3', 500, 'Phishing Defender'), ('Level 4', 1500, 'Security Architect'), ('Level 5', 3000, 'Cyber Sentinel');

insert into public.modules(slug,title,description,icon_key,accent,sort_order,status,max_points,pass_threshold) values
('phishing-email','Phishing: The Lure (Email)','Spot suspicious emails, verify requests, and report threats.','Mail','#19b9a5',1,'available',500,350),
('passwords-2fa','The Strong Vault: Passwords & 2FA','Build stronger authentication habits.','LockKeyhole','#2965e8',2,'coming_soon',550,385),
('malware-ransomware','Malware & Ransomware Defense','Understand infections, updates, and backups.','Zap','#28a653',3,'coming_soon',650,455),
('vishing-smishing','Vishing & Smishing (Non-Email Threats)','Recognize phone and text scams.','Phone','#f97316',4,'coming_soon',550,385),
('physical-travel','Physical, Travel, & Remote Security','Protect devices and information everywhere.','Globe2','#9333ea',5,'coming_soon',600,420),
('data-compliance','Data Handling, Reporting, & Compliance','Handle sensitive information responsibly.','ClipboardList','#5548e8',6,'coming_soon',700,490),
('social-engineering','Social Engineering & Modern Scams','Resist manipulation and impersonation.','Users','#e7194c',7,'coming_soon',750,525),
('financial-crypto','Financial & Cryptocurrency Scams','Recognize investment and crypto fraud.','Bitcoin','#f59e0b',8,'coming_soon',800,560);

insert into public.lesson_sections(module_id,sort_order,title,body,bullets) select id,1,'What is phishing?','Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity, typically through email.','[]' from public.modules where slug='phishing-email';
insert into public.lesson_sections(module_id,sort_order,title,bullets) select id,2,'Red flags of a phishing email?','["Urgent or threatening language","Generic greetings or sender mismatch","Suspicious links and unexpected attachments","Unusual spelling, grammar, or formatting"]' from public.modules where slug='phishing-email';
insert into public.lesson_sections(module_id,sort_order,title,body,bullets) select id,3,'Your best defense: skepticism','Navigate to official websites directly, verify requests through a trusted channel, and report suspicious messages.','[]' from public.modules where slug='phishing-email';

with m as (select id from public.modules where slug='phishing-email')
insert into public.questions(module_id,content_key,sort_order,prompt,explanation,topic,points) select id,'report-phishing',1,'After identifying a suspicious email as a phishing attempt, what is the recommended next step?','Report it through the official IT/Security channel so the organization can respond broadly.','Reporting',150 from m
union all select id,'clicked-link',2,'What should you do if you accidentally click a link in a phishing email?','Disconnecting and reporting quickly helps contain potential harm.','Incident response',100 from m
union all select id,'biggest-red-flag',3,'Which of these is the BIGGEST red flag for a phishing email?','A sender claiming to be a bank while using a public email domain is a strong phishing indicator.','Detection',100 from m
union all select id,'netflix',4,'You receive an email from Netflix saying your account is on hold. What is the safest course of action?','Go directly to the official website through a trusted method to verify the claim.','Verification',150 from m;

insert into public.question_options(question_id,content_key,sort_order,label,is_correct)
select q.id, v.content_key, v.sort_order, v.label, v.is_correct from public.questions q join (values
(1,'forward',1,'Forward it to all your colleagues to warn them.',false),(1,'delete',2,'Mark it as spam and delete it.',false),(1,'reply',3,'Reply to the sender telling them you know it is a scam.',false),(1,'report',4,'Report it to your IT/Security department using the official reporting channel.',true),
(2,'restart',1,'Immediately restart your computer.',false),(2,'disconnect',2,'Disconnect from the internet and report it to IT/Security right away.',true),(2,'delete',3,'Delete the email from your inbox and trash.',false),(2,'scan',4,'Run an antivirus scan and hope for the best.',false),
(3,'logo',1,'The email contains the company official logo.',false),(3,'public-domain',2,'The sender email address is from a public domain but claims to be a bank.',true),(3,'first-name',3,'The email is addressed to you by your first name.',false),(3,'discount',4,'The email offers you a discount on a future purchase.',false),
(4,'click',1,'Click the link and enter your details.',false),(4,'ignore',2,'Ignore the email and assume it is a mistake.',false),(4,'official-site',3,'Open a new browser window, go to the official Netflix website, and check your account status there.',true),(4,'reply',4,'Reply to the email asking for confirmation.',false)
) as v(question_order,content_key,sort_order,label,is_correct) on q.sort_order=v.question_order join public.modules m on m.id=q.module_id and m.slug='phishing-email';

insert into public.cheat_sheet_items(module_id,sort_order,body) select id,1,'Be wary of emails creating a sense of urgency or fear.' from public.modules where slug='phishing-email'
union all select id,2,'Hover over links to inspect the true destination URL before clicking.' from public.modules where slug='phishing-email'
union all select id,3,'Verify the sender email address; do not trust the display name alone.' from public.modules where slug='phishing-email'
union all select id,4,'Never open unexpected attachments, especially from unknown senders.' from public.modules where slug='phishing-email';
