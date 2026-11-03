from pathlib import Path
from xml.sax.saxutils import escape
import subprocess
D=Path(__file__).parent
P='#F6F4EE'; I='#252A25'; B='#A64C32'; S='#6B7561'; C='#EAE5DB'; L='#D5D1C7'; W='#FFFFFF'
def txt(x,y,t,size=20,color=I,weight=400,anchor='start'):
 return f'<text x="{x}" y="{y}" fill="{color}" font-family="DejaVu Sans,Arial,sans-serif" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(str(t))}</text>'
def rect(x,y,w,h,fill=W,stroke=L,r=12,sw=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def line(x,y,X,Y,color=S,width=2,arrow=False):return f'<path d="M{x},{y} L{X},{Y}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" '+('marker-end="url(#arrow)"' if arrow else '')+'/>'
def svg(w,h,body):return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="{S}"/></marker></defs><rect width="100%" height="100%" fill="{P}"/>{body}</svg>'''
def write(name,w,h,b):
 f=D/(name+'.svg');f.write_text(svg(w,h,b)); subprocess.run(['inkscape',str(f),'--export-filename='+str(D/(name+'.png')),'--export-width='+str(w)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
def box(x,y,w,h,title,ls,fill=W):
 b=rect(x,y,w,h,fill);b+=rect(x,y,5,h,B,B,0,0)+txt(x+22,y+35,title,20,I,700)
 for j,v in enumerate(ls):b+=txt(x+22,y+67+j*27,v,15,S)
 return b
def title(t,sub):return txt(54,66,t,31,I,700)+txt(54,99,sub,16,S)
# system
b=title('System architecture','Sajha Kaam · proposed pilot stack · external components require agreements')
b+=box(55,150,310,133,'Talent PWA',['Browse, apply, deliver','Passport and support'])+box(55,328,310,133,'Client / diaspora web',['Post and review','Offer and accept'])+box(55,506,310,133,'Operator console',['Review and resolve','Restricted staff access'])
b+=box(495,305,350,162,'API and policy layer',['Auth · roles · validations','State machine · idempotency','Audit · consent · rate limits'],C)
b+=box(985,140,355,131,'PostgreSQL',['Projects, terms, events','Outbox, claims, case history'])+box(985,305,355,131,'Private file storage',['Samples and deliveries','Scan + signed short-lived URLs'])+box(985,470,355,131,'Queue / workers',['Alerts, export jobs','Provider event reconciliation'])
b+=box(495,655,350,125,'Identity provider',['OTP · optional checks','No official digital ID'],W)+box(985,655,355,125,'Licensed payment partner',['External invoice / status','No Sajha custody · not live'],W)
for y in (216,394,572):b+=line(365,y,495,386,arrow=True)
for y in (206,371,536):b+=line(845,386,985,y,arrow=True)
b+=line(665,467,665,655,arrow=True)+line(1162,601,1162,655,arrow=True)
b+=txt(55,848,'Demo mode uses simulated partner fixtures. Webhook verification and settlement require a real launch agreement.',17,B,700)
write('system_architecture',1400,900,b)
# data
b=title('Data architecture','Primary keys are UUIDs · foreign keys and access boundaries shown · simplified ER view')
entities=[(50,155,'users',['id · role · locale','contact_verified_at','status']),(50,415,'clients',['id · owner_user_id','verification_source','status']),(390,155,'profiles',['user_id → users','skills · consent','visibility']),(390,415,'projects',['id · client_id','price_minor · currency','scope · state']),(730,155,'samples',['id · user_id','object_key · disclosure','reviewed_at']),(730,415,'applications',['id · project_id','talent_user_id','sample_id · state']),(1070,155,'engagements',['id · application_id','terms_snapshot · state','version']),(1070,415,'milestones',['id · engagement_id','amount_minor · due_at','state']),(50,680,'passport_claims',['id · user_id · source','engagement_id','visibility']),(390,680,'payment_events',['id · engagement_id','partner_ref · source','confirmed_at']),(730,680,'deliveries',['id · milestone_id','object_key · version','submitted_at']),(1070,680,'cases + audit',['engagement_id · actor','status / timestamp','append-only events'])]
# edges behind boxes
for a in [(310,220,390,220),(185,311,185,415),(310,475,390,475),(650,475,730,475),(990,475,1070,218),(1230,311,1230,415),(1120,571,990,680),(185,571,185,680)]:b+=line(*a,arrow=True)
for x,y,t,ls in entities:b+=box(x,y,270,156,t,ls)
b+=txt(50,910,'Additional tables: identity_checks, share_links, outbox_events. Private object keys never appear in public views.',16,B,700)
write('data_architecture',1400,950,b)
# information flow
b=title('Information flow','Consent and payment status are explicit · money never passes through the demo application')
for x,y,w,h,t,ls in [(50,170,300,155,'1. Talent',['Select one proof sample','Consent to share · apply']),(420,170,300,155,'2. API + DB',['Authorize ownership','Save application + outbox']),(790,170,300,155,'3. Client',['Review proof + offer','Set price / scope / rights']),(50,420,300,155,'4. Both parties',['Accept frozen terms','Submit and review work']),(50,680,300,155,'5. Support',['Human case if needed','Evidence, response, appeal']),(790,420,300,155,'6. External partner',['Real launch only: receipt','Signed event + reconciliation']),(420,680,300,125,'7. Work Passport',['Source-labeled claim','Export / revoke shared link'])]:b+=box(x,y,w,h,t,ls)
for a in [(350,247,420,247),(720,247,790,247),(940,325,200,420),(200,575,200,680),(350,530,790,498),(940,575,720,742),(350,551,420,701)]:b+=line(*a,arrow=True)
b+=rect(1130,170,220,405,C,C)+txt(1150,210,'Data boundaries',20,I,700)+txt(1150,255,'Private work files',15,S)+txt(1150,284,'Operator access',15,S)+txt(1150,313,'No public score',15,S)+txt(1150,362,'Partner verified',15,S)+txt(1150,391,'status only',15,S)+txt(1150,440,'DEMO ≠ paid',17,B,700)
write('information_flow',1400,900,b)
# journey
b=title('User journey and decision points','The first confirmed paid result is the core outcome')
steps=[(70,185,'Discover task','Pay + scope visible'),(385,185,'Apply with proof','Consent to share sample'),(700,185,'Offer / accept','Frozen terms'),(1015,185,'Deliver / review','Revision or acceptance'),(700,460,'Partner status','External confirmation'),(385,460,'Portable proof','Source-labeled claim'),(70,460,'Repeat work','Next client / export')]
for x,y,t,s in steps:b+=box(x,y,270,125,t,[s])
for a in [(340,247,385,247),(655,247,700,247),(970,247,1015,247),(1150,310,835,460),(700,522,655,522),(385,522,340,522)]:b+=line(*a,arrow=True)
b+=box(770,665,520,118,'If work is disputed',['Pause misleading completion claim; human resolution; appeal path'],C)+line(1140,310,1030,665,arrow=True)
b+=txt(70,774,'No leaderboards. Private progression is tied to skills and confirmed work, not app engagement.',17,B,700)
write('user_journey',1400,820,b)
# screens 390 x 844
for idx,name in enumerate(['Entry','Talent home','Task detail','Apply with proof','Client review','Workroom','Earnings','Work Passport']):
 b=rect(3,3,384,838,P,I,34,6)+txt(28,29,'9:41',11,I,700)+txt(362,29,'●● ▰',11,I,700,anchor='end')+line(18,44,372,44,L,1)+txt(28,76,'Sajha',21,I,700)+txt(92,76,'Kaam.',21,B,700)+txt(360,74,'Help',12,B,700,anchor='end')
 def t(y,s,z=16,col=I,bold=False):return txt(28,y,s,z,col,700 if bold else 400)
 def c(y,h=100):return rect(26,y,338,h,W,L,10)
 def pill(x,y,w,s):return rect(x,y,w,25,C,C,13)+txt(x+10,y+17,s,10,S,700)
 def button(y,s,outline=False):return rect(27,y,336,48,P if outline else B,L if outline else B,8)+txt(195,y+30,s,15,I if outline else W,700,'middle')
 if idx==0:
  b+=t(145,'साझा काम · WORK FROM NEPAL',12,S,True)+t(207,'Your skills can travel.',27,I,True)+t(241,'You can choose to stay.',27,I,True)+t(283,'Small paid projects with clear terms.',14,S)+t(307,'Proof you can carry to the next client.',14,S)+c(357,113)+t(395,'I want to find work',18,I,True)+t(426,'Browse paid pilots and show your skills.',13,S)+c(486,113)+t(524,'I want to hire talent',18,I,True)+t(555,'Post a small task with clear milestones.',13,S)+t(677,'For adults 18+ · no fee to apply',12,S)+button(717,'Explore Sajha Kaam')
 if idx==1:
  b+=t(134,'Good morning, Asha.',27,I,True)+t(162,'Your next step: first paid pilot.',14,S)+c(191,173)+t(225,'Your path',18,I,True)+t(258,'1   Add a relevant sample     ✓',13,S)+t(290,'2   Finish a paid pilot',13,S)+t(322,'3   Earn a repeat client',13,S)+t(406,'For your skills',17,I,True)+c(425,280)+t(456,'DESIGN · REMOTE · 1 WEEK',11,S,True)+t(493,'12 product listings',20,I,True)+t(523,'Rewrite titles for a UK food shop.',13,S)+t(562,'$60',25,B,True)+pill(286,541,66,'1 revision')+t(600,'Buyer details reviewed · demo',11,S)+button(626,'View task')
 if idx==2:
  b+=t(125,'DESIGN · REMOTE',11,S,True)+t(162,'12 product listings',24,I,True)+t(189,'For a UK Nepali food shop.',14,S)+c(219,96)+t(251,'Fixed project pay',13,S)+t(289,'$60',25,B,True)+t(341,'What you will deliver',17,I,True)+t(377,'• 12 titles and descriptions',13)+t(406,'• One shared document in 7 days',13)+t(435,'• One included revision',13)+line(27,473,363,473,L,1)+t(510,'Hillside Foods',16,I,True)+pill(27,527,211,'Business details reviewed · DEMO')+t(600,'Rights: buyer may use accepted copy.',12,S)+t(628,'Fees shown before a real offer.',12,S)+t(651,'No worker application fee.',12,S)+button(706,'Apply with proof')
 if idx==3:
  b+=t(130,'Show one good example.',23,I,True)+t(158,'Choose exactly what the client can see.',13,S)+t(207,'RELEVANT SAMPLE',11,S,True)+c(225,91)+t(261,'✓  Nepal tea catalog rewrite',15,I,True)+t(287,'Worker supplied · shared with client',11,S)+t(354,'WHY THIS PROJECT?',11,S,True)+c(369,125)+t(406,'I can write concise product copy',13)+t(431,'and deliver in seven days.',13)+t(535,'AVAILABILITY',11,S,True)+c(550,58)+t(584,'I can start this week',13)+t(653,'Your other samples stay private.',12,S)+button(701,'Send application')
 if idx==4:
  b+=t(128,'Review the work,',25,I,True)+t(158,'not a score.',25,I,True)+t(191,'1 application · 12 product listings',13,S)+c(224,303)+pill(45,243,213,'Sample supplied by applicant')+t(308,'Asha K.',22,I,True)+t(337,'Catalog writing · English / Nepali',13,S)+line(47,363,344,363,L,1)+t(396,'Relevant sample',13,S)+t(425,'Nepal tea catalog rewrite',15,I,True)+t(459,'Applicant work; not official ID.',11,S)+button(473,'Offer $60 paid pilot')+t(579,'Before offering',16,I,True)+t(613,'Set price, scope, due date and rights.',13,S)+t(642,'Both parties accept the same terms.',13,S)
 if idx==5:
  b+=t(127,'Product listings pilot',22,I,True)+pill(27,147,129,'IN PROGRESS')+c(199,144)+t(233,'One milestone · $60',17,I,True)+t(264,'12 descriptions · due in 7 days',13,S)+t(294,'1 revision · accepted copy rights',12,S)+t(381,'Project timeline',17,I,True)+line(45,402,45,583,S,2)
  for y,label in [(414,'Application sent'),(465,'Terms accepted'),(516,'Deliverable submitted'),(567,'Client review pending')]:b+=rect(40,y-8,10,10,S,S,5)+t(y,label,13)
  b+=button(634,'Submit deliverable')+t(725,'Need help? Open a human support case.',12,B)
 if idx==6:
  b+=t(130,'Know where pay stands.',23,I,True)+c(181,233)+t(219,'Gross sample project',13,S)+t(261,'$60.00',30,B,True)+line(45,283,344,283,L,1)+t(311,'Platform fee: demo $0',12)+t(337,'Provider fee / FX: not set',12)+pill(44,358,264,'AWAITING PARTNER · DEMO')+t(465,'Client approval is not a receipt.',15,I,True)+t(498,'A real partner must verify settlement.',13,S)+t(527,'No money moves in this demo.',13,S)+button(633,'Open Work Passport')
 if idx==7:
  b+=t(130,'Evidence you can carry.',22,I,True)+t(160,'Share only what you choose.',13,S)+c(193,131)+t(226,'YOUR OWN SAMPLE',11,S,True)+t(260,'Nepal tea catalog rewrite',16,I,True)+t(295,'Source: worker supplied',12,S)+c(339,170)+t(374,'CLIENT-CONFIRMED RESULT',11,S,True)+t(410,'12 product listings',17,I,True)+t(447,'Client accepted delivery.',12,S)+t(475,'Payment claim only if partner confirms.',11,S)+button(555,'Create revocable share link')+button(618,'Export JSON record',True)+t(709,'Not a government identity or tax proof.',11,S)
 b+=line(18,774,372,774,L,1)
 for j,n in enumerate(['Home','Explore','My work','Passport']):b+=txt(44+j*99,811,n,11,B if ((idx==7 and j==3) or (idx<2 and j==0)) else S,700 if j==0 else 400)
 write('ux_'+str(idx+1).zfill(2)+'_'+name.lower().replace(' ','_'),390,844,b)
print('Generated 12 SVG and 12 PNG files')
