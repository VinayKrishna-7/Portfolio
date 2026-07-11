import * as THREE from 'three';

// ─── Scene Setup ─────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a14);
scene.fog = new THREE.Fog(0x0a0a14, 22, 65);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 13);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";
document.body.style.background = '#0a0a14';

// ─── Load Inter font ─────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ─── Lighting ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x1a1a3e, 0.8));
const pointLight1 = new THREE.PointLight(0x5533ff, 2.5, 35);
pointLight1.position.set(6, 6, 5);
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight(0x00ccff, 1.8, 28);
pointLight2.position.set(-6, -3, 4);
scene.add(pointLight2);
const pointLight3 = new THREE.PointLight(0x7700ff, 1.2, 22);
pointLight3.position.set(0, 9, -5);
scene.add(pointLight3);

// ─── Star Field ───────────────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starCount = 600;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 80;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xaaaaff, size: 0.08, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(starGeo, starMat);
stars.name = 'stars';
scene.add(stars);

// ─── Background Grid ──────────────────────────────────────────────────────────
const gridHelper = new THREE.GridHelper(80, 50, 0x1a1a5e, 0x0d0d2e);
gridHelper.position.y = -9;
gridHelper.rotation.x = 0.25;
gridHelper.name = 'grid';
scene.add(gridHelper);

// ─── Floating Orbs ────────────────────────────────────────────────────────────
const orbs = [];
const orbDefs = [
  { color: 0x3344ff, emissive: 0x1122ff, r: 0.28 },
  { color: 0x00ccff, emissive: 0x0088ff, r: 0.22 },
  { color: 0x7722ff, emissive: 0x5500ff, r: 0.32 },
  { color: 0x00ffcc, emissive: 0x00cc99, r: 0.18 },
];
orbDefs.forEach((def, i) => {
  const geo = new THREE.SphereGeometry(def.r, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: def.color, emissive: def.emissive, emissiveIntensity: 0.9,
    transparent: true, opacity: 0.6, metalness: 0.9, roughness: 0.05,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `orb_${i}`;
  const a = (i / orbDefs.length) * Math.PI * 2;
  mesh.position.set(Math.cos(a) * 4, Math.sin(a) * 2.5, 1.5);
  scene.add(mesh);
  orbs.push({ mesh, phase: a });
});

// ─── Project Cards (3D panels) ────────────────────────────────────────────────
const projects = [
  { label: 'ML', title: 'Scam Detector', sub: 'Fraud Detection System', color: 0x3366ff },
  { label: 'ML', title: 'AgriPredict', sub: 'Crop Yield Prediction', color: 0x00ccff },
  { label: 'DSA', title: '250+ Problems', sub: 'LeetCode & HackerRank', color: 0x7722ff },
  { label: 'CERT', title: 'Azure AI', sub: 'Microsoft Certified', color: 0x00ffcc },
  { label: 'CERT', title: 'IBM AI', sub: 'Artificial Intelligence', color: 0xff6622 },
  { label: 'CERT', title: 'Stanford CS101', sub: 'Computer Science', color: 0xffcc00 },
];

const panels = [];
const panelGroup = new THREE.Group();
panelGroup.name = 'panelGroup';
scene.add(panelGroup);

projects.forEach((p, i) => {
  const angle = (i / projects.length) * Math.PI * 2;
  const radius = 5.8;
  const group = new THREE.Group();
  group.name = `panel_${i}`;
  group.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.48,
    Math.sin(angle * 1.7) * 1.8
  );

  const panelGeo = new THREE.BoxGeometry(2.9, 1.5, 0.07);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c22, metalness: 0.5, roughness: 0.25,
    transparent: true, opacity: 0.82,
  });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  panel.name = `panelMesh_${i}`;
  group.add(panel);

  const borderGeo = new THREE.EdgesGeometry(panelGeo);
  const borderMat = new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.85 });
  const border = new THREE.LineSegments(borderGeo, borderMat);
  border.name = `border_${i}`;
  group.add(border);

  const barGeo = new THREE.BoxGeometry(2.9, 0.055, 0.09);
  const barMat = new THREE.MeshBasicMaterial({ color: p.color });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.name = `bar_${i}`;
  bar.position.y = 0.75;
  group.add(bar);

  group.userData = { angle, radius, speed: 0.0007 + Math.random() * 0.0004, index: i };
  panels.push(group);
  panelGroup.add(group);
});

// ─── DOM Overlay ──────────────────────────────────────────────────────────────
const ui = document.createElement('div');
ui.style.cssText = `
  position:fixed; top:0; left:0; width:100%; height:100%;
  pointer-events:none; z-index:10; color:#fff;
  font-family:'Inter','Helvetica Neue',Arial,sans-serif;
`;
document.body.appendChild(ui);

// ─── Top Bar ──────────────────────────────────────────────────────────────────
const topBar = document.createElement('div');
topBar.style.cssText = `
  position:absolute; top:0; left:0; right:0;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 28px 14px 28px;
  border-bottom:1px solid rgba(255,255,255,0.06);
  backdrop-filter:blur(2px);
`;
ui.appendChild(topBar);

const nameEl = document.createElement('div');
nameEl.innerHTML = `<span style="font-size:15px;font-weight:700;letter-spacing:0.18em;color:#ffffff;">VINAY KRISHNA</span>
  <span style="font-size:15px;font-weight:300;letter-spacing:0.18em;color:#7788ff;"> YANDAMURI</span>`;
nameEl.style.pointerEvents = 'auto';
topBar.appendChild(nameEl);

const topRight = document.createElement('div');
topRight.style.cssText = 'display:flex;gap:24px;align-items:center;';
['PROJECTS', 'SKILLS', 'CONTACT'].forEach(label => {
  const btn = document.createElement('div');
  btn.textContent = label;
  btn.style.cssText = `
    font-size:10px;font-weight:500;letter-spacing:0.2em;
    color:#8899cc;cursor:pointer;pointer-events:auto;
    transition:color 0.2s;
  `;
  btn.addEventListener('mouseenter', () => btn.style.color = '#ffffff');
  btn.addEventListener('mouseleave', () => btn.style.color = '#8899cc');
  topRight.appendChild(btn);
});
topBar.appendChild(topRight);

// ─── Hero Section ─────────────────────────────────────────────────────────────
const hero = document.createElement('div');
hero.style.cssText = `
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  text-align:center; pointer-events:none;
`;
ui.appendChild(hero);

const heroTitle = document.createElement('div');
heroTitle.innerHTML = `
  <div style="font-size:11px;letter-spacing:0.35em;color:#5566aa;font-weight:500;margin-bottom:14px;">B.TECH CSE · CYBERSECURITY · 2023–2027</div>
  <div style="font-size:clamp(32px,5vw,58px);font-weight:700;letter-spacing:0.06em;line-height:1.05;
    background:linear-gradient(135deg,#ffffff 0%,#aabbff 50%,#7788ff 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
    VINAY KRISHNA<br>YANDAMURI
  </div>
  <div style="font-size:12px;letter-spacing:0.25em;color:#5566aa;font-weight:400;margin-top:14px;">
    ML ENGINEER &nbsp;·&nbsp; PYTHON DEVELOPER &nbsp;·&nbsp; CYBERSECURITY
  </div>
`;
hero.appendChild(heroTitle);

const statsRow = document.createElement('div');
statsRow.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap;';
[
  { val: '8.1', lbl: 'CGPA' },
  { val: '~80%', lbl: 'ML ACCURACY' },
  { val: '250+', lbl: 'DSA PROBLEMS' },
  { val: '6', lbl: 'CERTIFICATIONS' },
].forEach(s => {
  const chip = document.createElement('div');
  chip.style.cssText = `
    border:1px solid rgba(85,102,255,0.35);
    background:rgba(20,20,50,0.6);
    border-radius:4px; padding:8px 16px;
    text-align:center; backdrop-filter:blur(6px);
  `;
  chip.innerHTML = `
    <div style="font-size:18px;font-weight:700;color:#aabbff;letter-spacing:0.05em;">${s.val}</div>
    <div style="font-size:9px;letter-spacing:0.2em;color:#556688;font-weight:500;margin-top:2px;">${s.lbl}</div>
  `;
  statsRow.appendChild(chip);
});
hero.appendChild(statsRow);

// ─── Left Sidebar — Projects & Skills ─────────────────────────────────────────
const sidebar = document.createElement('div');
sidebar.style.cssText = `
  position:absolute; top:72px; left:22px; bottom:22px;
  width:220px; pointer-events:auto; overflow:hidden;
`;
ui.appendChild(sidebar);

const sideTitle = document.createElement('div');
sideTitle.textContent = 'PROJECTS';
sideTitle.style.cssText = `font-size:9px;letter-spacing:0.28em;color:#334466;font-weight:600;margin-bottom:14px;padding-top:8px;`;
sidebar.appendChild(sideTitle);

[
  { cat: 'ML', title: 'Scam Detector', sub: '~80% accuracy · 2025', color: '#3366ff' },
  { cat: 'ML', title: 'AgriPredict', sub: '~78% accuracy · 2024', color: '#00ccff' },
].forEach((p) => {
  const row = document.createElement('div');
  row.style.cssText = `
    padding:10px 12px; margin-bottom:6px;
    border:1px solid rgba(255,255,255,0.06);
    border-left:2px solid ${p.color};
    background:rgba(10,10,30,0.5);
    border-radius:3px; cursor:pointer;
    transition:background 0.2s;
    backdrop-filter:blur(4px);
  `;
  row.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
      <span style="font-size:8px;letter-spacing:0.18em;font-weight:600;color:${p.color};">${p.cat}</span>
      <span style="font-size:11px;font-weight:500;color:#ddeeff;">${p.title}</span>
    </div>
    <div style="font-size:9px;color:#445577;letter-spacing:0.05em;">${p.sub}</div>
  `;
  row.addEventListener('mouseenter', () => row.style.background = 'rgba(30,30,70,0.7)');
  row.addEventListener('mouseleave', () => row.style.background = 'rgba(10,10,30,0.5)');
  sidebar.appendChild(row);
});

const skillTitle = document.createElement('div');
skillTitle.textContent = 'SKILLS';
skillTitle.style.cssText = `font-size:9px;letter-spacing:0.28em;color:#334466;font-weight:600;margin-bottom:10px;margin-top:20px;`;
sidebar.appendChild(skillTitle);

[
  { name: 'Python', pct: 90, color: '#3366ff' },
  { name: 'Machine Learning', pct: 82, color: '#00ccff' },
  { name: 'SQL / DSA', pct: 78, color: '#7722ff' },
  { name: 'JavaScript', pct: 65, color: '#00ffcc' },
  { name: 'C', pct: 60, color: '#ffcc00' },
].forEach(s => {
  const wrap = document.createElement('div');
  wrap.style.marginBottom = '9px';
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
      <span style="font-size:9px;color:#8899bb;letter-spacing:0.08em;">${s.name}</span>
      <span style="font-size:9px;color:#556688;">${s.pct}%</span>
    </div>
    <div style="height:2px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;">
      <div style="height:100%;width:${s.pct}%;background:${s.color};border-radius:2px;box-shadow:0 0 6px ${s.color}88;"></div>
    </div>
  `;
  sidebar.appendChild(wrap);
});

// ─── Right Panel ──────────────────────────────────────────────────────────────
const rightPanel = document.createElement('div');
rightPanel.style.cssText = `
  position:absolute; top:72px; right:22px; bottom:22px;
  width:210px; pointer-events:auto; overflow:hidden;
`;
ui.appendChild(rightPanel);

const eduCard = document.createElement('div');
eduCard.style.cssText = `
  padding:14px; margin-bottom:10px;
  border:1px solid rgba(255,255,255,0.07);
  border-top:2px solid #7722ff;
  background:rgba(10,10,30,0.55);
  border-radius:3px; backdrop-filter:blur(4px);
`;
eduCard.innerHTML = `
  <div style="font-size:9px;letter-spacing:0.22em;color:#7722ff;font-weight:600;margin-bottom:8px;">EDUCATION</div>
  <div style="font-size:11px;font-weight:600;color:#ddeeff;margin-bottom:4px;line-height:1.4;">
    B.Tech CSE · <span style="color:#8899cc;font-weight:400;">Cybersecurity</span>
  </div>
  <div style="font-size:9px;color:#556688;margin-bottom:6px;">Pragati Engineering College</div>
  <div style="font-size:9px;color:#445566;">Surampalem &nbsp;·&nbsp; 2023–2027</div>
  <div style="margin-top:10px;display:flex;align-items:center;gap:10px;">
    <div style="font-size:22px;font-weight:700;color:#7722ff;">8.1</div>
    <div style="font-size:8px;color:#445577;letter-spacing:0.12em;">CGPA</div>
  </div>
`;
rightPanel.appendChild(eduCard);

const achCard = document.createElement('div');
achCard.style.cssText = `
  padding:14px; margin-bottom:10px;
  border:1px solid rgba(255,255,255,0.07);
  border-top:2px solid #00ffcc;
  background:rgba(10,10,30,0.55);
  border-radius:3px; backdrop-filter:blur(4px);
`;
achCard.innerHTML = `
  <div style="font-size:9px;letter-spacing:0.22em;color:#00ffcc;font-weight:600;margin-bottom:10px;">ACHIEVEMENTS</div>
  <div style="margin-bottom:8px;">
    <div style="font-size:10px;color:#ddeeff;font-weight:500;margin-bottom:2px;">🏆 Top 10 — National Hackathon</div>
    <div style="font-size:9px;color:#445566;">Built functional solution under time constraints</div>
  </div>
  <div>
    <div style="font-size:10px;color:#ddeeff;font-weight:500;margin-bottom:2px;">⚡ 250+ DSA Problems</div>
    <div style="font-size:9px;color:#445566;">Arrays · Trees · Graphs · DP · SQL</div>
  </div>
`;
rightPanel.appendChild(achCard);

const certCard = document.createElement('div');
certCard.style.cssText = `
  padding:14px;
  border:1px solid rgba(255,255,255,0.07);
  border-top:2px solid #3366ff;
  background:rgba(10,10,30,0.55);
  border-radius:3px; backdrop-filter:blur(4px);
`;
certCard.innerHTML = `<div style="font-size:9px;letter-spacing:0.22em;color:#3366ff;font-weight:600;margin-bottom:10px;">CERTIFICATIONS</div>`;
[
  { name: 'Azure AI Fundamentals', org: 'Microsoft', color: '#3366ff' },
  { name: 'Getting Started with AI', org: 'IBM', color: '#00ccff' },
  { name: 'Computer Science 101', org: 'Stanford', color: '#7722ff' },
  { name: 'Privacy & Security', org: 'IIT Madras', color: '#00ffcc' },
  { name: 'Problem Solving', org: 'HackerRank', color: '#ffcc00' },
  { name: 'Python', org: 'Microsoft', color: '#ff6622' },
].forEach(c => {
  const item = document.createElement('div');
  item.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
  item.innerHTML = `
    <div style="width:4px;height:4px;border-radius:50%;background:${c.color};flex-shrink:0;box-shadow:0 0 5px ${c.color};"></div>
    <div>
      <div style="font-size:9px;color:#ccdded;font-weight:500;">${c.name}</div>
      <div style="font-size:8px;color:#445566;">${c.org}</div>
    </div>
  `;
  certCard.appendChild(item);
});
rightPanel.appendChild(certCard);

// ─── Bottom Bar ───────────────────────────────────────────────────────────────
const bottomBar = document.createElement('div');
bottomBar.style.cssText = `
  position:absolute; bottom:0; left:0; right:0;
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 28px;
  border-top:1px solid rgba(255,255,255,0.05);
  backdrop-filter:blur(2px);
`;
ui.appendChild(bottomBar);

const contactInfo = document.createElement('div');
contactInfo.style.cssText = 'display:flex;gap:20px;align-items:center;';
[
  { icon: '✉', text: 'vinaykrishna220@gmail.com' },
  { icon: '📍', text: 'Rajahmundry, India' },
  { icon: '📞', text: '+91-7702882126' },
].forEach(c => {
  const el = document.createElement('div');
  el.innerHTML = `<span style="opacity:0.4;margin-right:5px;">${c.icon}</span><span style="font-size:9px;letter-spacing:0.06em;color:#556688;">${c.text}</span>`;
  contactInfo.appendChild(el);
});
bottomBar.appendChild(contactInfo);

const links = document.createElement('div');
links.style.cssText = 'display:flex;gap:14px;pointer-events:auto;';
['GitHub', 'LeetCode', 'HackerRank'].forEach(l => {
  const a = document.createElement('div');
  a.textContent = l;
  a.style.cssText = `font-size:9px;letter-spacing:0.18em;color:#334466;cursor:pointer;transition:color 0.2s;font-weight:500;`;
  a.addEventListener('mouseenter', () => a.style.color = '#7788ff');
  a.addEventListener('mouseleave', () => a.style.color = '#334466');
  links.appendChild(a);
});
bottomBar.appendChild(links);

// ─── Mouse Parallax ──────────────────────────────────────────────────────────
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

// ─── Resize ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Animate ─────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.035;
  camera.position.y += (mouseY * 0.7 - camera.position.y) * 0.035;
  camera.lookAt(0, 0, 0);

  panels.forEach((g) => {
    g.userData.angle += g.userData.speed;
    const a = g.userData.angle;
    const r = g.userData.radius;
    g.position.x = Math.cos(a) * r;
    g.position.y = Math.sin(a) * r * 0.48 + Math.sin(t * 0.5 + a) * 0.18;
    g.position.z = Math.sin(a * 1.7) * 1.8;
    g.rotation.y = -a * 0.35;
    g.rotation.x = Math.sin(t * 0.35 + a) * 0.04;
  });

  orbs.forEach((o, i) => {
    o.phase += 0.007;
    o.mesh.position.x = Math.cos(o.phase) * 4 + Math.sin(t * 0.25 + i) * 0.6;
    o.mesh.position.y = Math.sin(o.phase) * 2.5 + Math.cos(t * 0.3 + i) * 0.4;
    o.mesh.position.z = Math.sin(o.phase * 1.2) * 1.4 + 1.5;
  });

  stars.rotation.y = t * 0.01;
  stars.rotation.x = t * 0.004;

  pointLight1.intensity = 2.5 + Math.sin(t * 1.1) * 0.6;
  pointLight2.intensity = 1.8 + Math.cos(t * 0.85) * 0.4;
  pointLight3.position.x = Math.sin(t * 0.45) * 5;

  gridHelper.position.z = (t * 0.35) % 3;

  renderer.render(scene, camera);
}
animate();