'use strict';

/* ==========================================================================
   Translations
   ========================================================================== */

const TRANSLATIONS = {
  en: {
    appTitle: 'Teacher Dashboard',
    appSubtitle: 'Grade 5 Math',
    navStudents: 'Students',
    navReminders: 'Reminders',
    navSettings: 'Settings',
    addStudent: 'Add Student',
    studentNamePlaceholder: 'Student name',
    saveDailyData: 'Save Daily Data',
    points: 'Points',
    behavior: 'Behavior',
    marksUnderstanding: 'Marks / Understanding',
    activity: 'Activity',
    excellent: 'Excellent',
    average: 'Average',
    needsFocus: 'Needs Focus',
    mastered: 'Mastered',
    progressing: 'Progressing',
    needsSupport: 'Needs Support',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    whatsappReport: 'WhatsApp Report',
    removeStudent: 'Remove student',
    deleteConfirm: 'Remove this student from the dashboard?',
    noStudents: 'No students yet. Add your first student above to get started.',
    quickReminder: 'Quick Reminder',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'e.g., Bring geometry set',
    date: 'Date',
    time: 'Time',
    save: 'Save',
    reminderListTitle: 'Recent Reminders',
    noReminders: 'No reminders saved yet.',
    settings: 'Settings',
    backendUrlLabel: 'Google Web App URL',
    backendUrlPlaceholder: 'https://script.google.com/macros/s/.../exec',
    backendUrlHint: 'Paste the Web App URL you get after deploying Code.gs (see README.md). This connects Save Daily Data and Quick Reminder to your Google Sheet and Calendar.',
    statusSaving: 'Saving…',
    statusSaveSuccess: 'Daily data saved successfully!',
    statusSaveError: 'Could not reach the backend. Check the Web App URL in Settings.',
    statusReminderSaving: 'Saving reminder…',
    statusReminderSuccess: 'Reminder saved to Google Calendar!',
    statusReminderError: 'Could not save reminder. Check the Web App URL in Settings.',
    statusNoBackendUrl: 'Please set your Google Web App URL in Settings first.',
    statusSettingsSaved: 'Settings saved.',
    statusNoStudentsToSave: 'Add at least one student before saving.'
  },
  ar: {
    appTitle: 'لوحة تحكم المعلم',
    appSubtitle: 'رياضيات الصف الخامس',
    navStudents: 'الطلاب',
    navReminders: 'التذكيرات',
    navSettings: 'الإعدادات',
    addStudent: 'إضافة طالب',
    studentNamePlaceholder: 'اسم الطالب',
    saveDailyData: 'حفظ بيانات اليوم',
    points: 'النقاط',
    behavior: 'السلوك',
    marksUnderstanding: 'الفهم والتحصيل',
    activity: 'المشاركة',
    excellent: 'ممتاز',
    average: 'متوسط',
    needsFocus: 'يحتاج تركيز',
    mastered: 'متقن',
    progressing: 'يتقدم',
    needsSupport: 'يحتاج دعم',
    high: 'مرتفع',
    medium: 'متوسط',
    low: 'منخفض',
    whatsappReport: 'تقرير واتساب',
    removeStudent: 'حذف الطالب',
    deleteConfirm: 'هل تريد حذف هذا الطالب من اللوحة؟',
    noStudents: 'لا يوجد طلاب بعد. أضف أول طالب من الأعلى للبدء.',
    quickReminder: 'تذكير سريع',
    taskTitle: 'عنوان المهمة',
    taskTitlePlaceholder: 'مثال: إحضار أدوات الهندسة',
    date: 'التاريخ',
    time: 'الوقت',
    save: 'حفظ',
    reminderListTitle: 'أحدث التذكيرات',
    noReminders: 'لا توجد تذكيرات محفوظة بعد.',
    settings: 'الإعدادات',
    backendUrlLabel: 'رابط تطبيق جوجل الإلكتروني',
    backendUrlPlaceholder: 'https://script.google.com/macros/s/.../exec',
    backendUrlHint: 'الصق رابط تطبيق الويب الذي تحصل عليه بعد نشر ملف Code.gs (راجع README.md). هذا الرابط يربط زري حفظ بيانات اليوم والتذكير السريع بجدول بيانات جوجل وتقويم جوجل.',
    statusSaving: 'جارٍ الحفظ...',
    statusSaveSuccess: 'تم حفظ بيانات اليوم بنجاح!',
    statusSaveError: 'تعذر الوصول إلى الخادم. تحقق من رابط تطبيق جوجل في الإعدادات.',
    statusReminderSaving: 'جارٍ حفظ التذكير...',
    statusReminderSuccess: 'تم حفظ التذكير في تقويم جوجل!',
    statusReminderError: 'تعذر حفظ التذكير. تحقق من رابط تطبيق جوجل في الإعدادات.',
    statusNoBackendUrl: 'يرجى تعيين رابط تطبيق جوجل في الإعدادات أولاً.',
    statusSettingsSaved: 'تم حفظ الإعدادات.',
    statusNoStudentsToSave: 'أضف طالباً واحداً على الأقل قبل الحفظ.'
  }
};

const METRIC_LEVELS = {
  behavior: { excellent: 'good', average: 'mid', needsFocus: 'bad' },
  marks: { mastered: 'good', progressing: 'mid', needsSupport: 'bad' },
  activity: { high: 'good', medium: 'mid', low: 'bad' }
};

/* ==========================================================================
   State
   ========================================================================== */

const STORAGE_KEYS = {
  lang: 'td_lang',
  students: 'td_students',
  reminders: 'td_reminders',
  backendUrl: 'td_backend_url'
};

let currentLang = localStorage.getItem(STORAGE_KEYS.lang) || 'en';
let students = loadStudents();
let reminders = loadJSON(STORAGE_KEYS.reminders, []);
let backendUrl = localStorage.getItem(STORAGE_KEYS.backendUrl) || '';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function loadStudents() {
  const saved = loadJSON(STORAGE_KEYS.students, null);
  if (saved && Array.isArray(saved)) return saved;
  // First run: seed a few sample students so the dashboard isn't empty.
  const seedNames = ['حمد', 'راشد', 'سلطان', 'يوسف', 'عبدالله', 'ناصر'];
  return seedNames.map(name => makeStudent(name));
}

function makeStudent(name) {
  return { id: uid(), name: name, behavior: null, marks: null, activity: null, points: 0 };
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

function saveStudents() { localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students)); }
function saveReminders() { localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders)); }

/* ==========================================================================
   i18n helpers
   ========================================================================== */

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  document.title = t('appTitle');
}

function updateDateDisplay() {
  const el = document.getElementById('todayDate');
  if (!el) return;
  const locale = currentLang === 'ar' ? 'ar-QA' : 'en-QA';
  el.textContent = new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEYS.lang, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  applyStaticTranslations();
  updateDateDisplay();
  renderStudents();
  renderReminders();
}

/* ==========================================================================
   Rendering — students
   ========================================================================== */

function tapButton(metric, value, icon, label) {
  const level = METRIC_LEVELS[metric][value];
  return `<button type="button" class="tap-btn" data-metric="${metric}" data-value="${value}" data-level="${level}"><span class="tap-icon" aria-hidden="true">${icon}</span><span class="tap-label">${label}</span></button>`;
}

const METRIC_ICONS = {
  behavior: { excellent: '🟢', average: '🟡', needsFocus: '🔴' },
  marks: { mastered: '🟢', progressing: '🟡', needsSupport: '🔴' },
  activity: { high: '🟢', medium: '🟡', low: '🔴' }
};

function studentCardHTML(student) {
  const initial = student.name.trim().charAt(0) || '?';
  const behaviorBtns = ['excellent', 'average', 'needsFocus']
    .map(v => tapButton('behavior', v, METRIC_ICONS.behavior[v], t(v))).join('');
  const marksBtns = ['mastered', 'progressing', 'needsSupport']
    .map(v => tapButton('marks', v, METRIC_ICONS.marks[v], t(v))).join('');
  const activityBtns = ['high', 'medium', 'low']
    .map(v => tapButton('activity', v, METRIC_ICONS.activity[v], t(v))).join('');

  return `
  <div class="student-card" data-id="${student.id}">
    <div class="student-card-header">
      <div class="student-avatar">${escapeHtml(initial)}</div>
      <div class="student-name">${escapeHtml(student.name)}</div>
      <button type="button" class="remove-student-btn" data-action="remove" data-i18n-title="removeStudent" title="${t('removeStudent')}">×</button>
    </div>

    <div class="points-row">
      <span class="points-label">${t('points')}</span>
      <div class="points-control">
        <button type="button" class="point-btn" data-action="point-minus" aria-label="-1">−</button>
        <span class="points-value">${student.points}</span>
        <button type="button" class="point-btn" data-action="point-plus" aria-label="+1">+</button>
      </div>
    </div>

    <div class="metric-row" data-metric-group="behavior">
      <span class="metric-label">${t('behavior')}</span>
      <div class="btn-group">${behaviorBtns}</div>
    </div>

    <div class="metric-row" data-metric-group="marks">
      <span class="metric-label">${t('marksUnderstanding')}</span>
      <div class="btn-group">${marksBtns}</div>
    </div>

    <div class="metric-row" data-metric-group="activity">
      <span class="metric-label">${t('activity')}</span>
      <div class="btn-group">${activityBtns}</div>
    </div>

    <button type="button" class="whatsapp-btn" data-action="whatsapp">
      <span aria-hidden="true">📱</span> ${t('whatsappReport')}
    </button>
  </div>`;
}

function renderStudents() {
  const grid = document.getElementById('studentGrid');
  const emptyMsg = document.getElementById('noStudentsMsg');
  if (students.length === 0) {
    grid.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');
  grid.innerHTML = students.map(studentCardHTML).join('');

  // Reflect selected metric state on the freshly rendered buttons.
  students.forEach(student => {
    const card = grid.querySelector(`.student-card[data-id="${student.id}"]`);
    if (!card) return;
    ['behavior', 'marks', 'activity'].forEach(metric => {
      const value = student[metric];
      if (!value) return;
      const btn = card.querySelector(`.tap-btn[data-metric="${metric}"][data-value="${value}"]`);
      if (btn) btn.classList.add('selected');
    });
  });
}

/* ==========================================================================
   Rendering — reminders
   ========================================================================== */

function renderReminders() {
  const list = document.getElementById('reminderList');
  const emptyMsg = document.getElementById('noRemindersMsg');
  const recent = reminders.slice(0, 8);
  if (recent.length === 0) {
    list.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');
  const locale = currentLang === 'ar' ? 'ar-QA' : 'en-QA';
  list.innerHTML = recent.map(r => {
    let when = r.date;
    try {
      const d = new Date(r.time ? `${r.date}T${r.time}` : `${r.date}T00:00:00`);
      when = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
      if (r.time) when += ' • ' + new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
    } catch (e) { /* keep raw date string */ }
    return `
    <li class="reminder-item">
      <span class="reminder-icon" aria-hidden="true">📌</span>
      <div class="reminder-info">
        <div class="reminder-title">${escapeHtml(r.title)}</div>
        <div class="reminder-when">${escapeHtml(when)}</div>
      </div>
    </li>`;
  }).join('');
}

/* ==========================================================================
   Student state mutations
   ========================================================================== */

function findStudent(id) { return students.find(s => s.id === id); }

function setMetric(id, metric, value) {
  const student = findStudent(id);
  if (!student) return;
  student[metric] = student[metric] === value ? null : value;
  saveStudents();
  renderStudents();
}

function changePoints(id, delta) {
  const student = findStudent(id);
  if (!student) return;
  student.points = Math.max(0, Math.min(999, student.points + delta));
  saveStudents();
  renderStudents();
}

function addStudent(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  students.push(makeStudent(trimmed));
  saveStudents();
  renderStudents();
}

function removeStudent(id) {
  if (!confirm(t('deleteConfirm'))) return;
  students = students.filter(s => s.id !== id);
  saveStudents();
  renderStudents();
}

/* ==========================================================================
   WhatsApp report generation — message is always Arabic, regardless of UI language
   ========================================================================== */

function generateWhatsAppMessage(student) {
  const name = student.name.trim();
  const opening = `السلام عليكم ورحمة الله وبركاته 🌙\nولي أمر الطالب *${name}* المحترم\n\n`;
  const closing = `\n\nنشكر لكم متابعتكم المستمرة، ونحن هنا دائماً للتعاون من أجل مستقبل ${name} الدراسي 🌷\nمعلم مادة الرياضيات`;

  let body;
  if (student.marks === 'mastered' && student.activity === 'high') {
    body = `يسعدنا أن نُخبركم بأن *${name}* يقدّم أداءً متميزاً في مادة الرياضيات هذه الأيام 🌟📐 فهو يُتقن المفاهيم بثقة وسرعة، ويشارك بحماس وفاعلية لافتة في كل حصة، وهذا يعكس روح القيادة والانضباط التي يتحلى بها. نحن فخورون جداً بمستواه ونشجعه دائماً ليكون قدوة لزملائه. أحسنتم تربيته 🏆`;
  } else if (student.marks === 'needsSupport' && student.behavior === 'excellent') {
    body = `نود أن نشكركم على تربية *${name}* الرائعة؛ فهو طالب مهذّب ومحترم جداً داخل الصف، وسلوكه يسعدنا دائماً 🌸 كما نلاحظ أنه يملك ذكاءً وقدرة واضحة، وكل ما يحتاجه الآن هو القليل من التدريب الإضافي والمراجعة الخفيفة في المنزل لبعض مفاهيم الرياضيات حتى يصل إلى المستوى الذي نعلم أنه قادر عليه بإذن الله 💪 نصف ساعة يومياً من المراجعة معكم ستُحدث فرقاً كبيراً.`;
  } else if (student.behavior === 'needsFocus') {
    body = `*${name}* طالب يمتلك طاقة وحيوية رائعة لا تنضب ⚡ ونحن نعمل معه هذه الأيام بحب على تنظيم هذه الطاقة الإيجابية وتوجيهها نحو التركيز والمشاركة البنّاءة في حصة الرياضيات. بمجرد أن يتمكن من ذلك، سنلاحظ أثره الجميل على فهمه واستيعابه أيضاً بإذن الله 🌱 دعمكم في المنزل بخصوص أهمية التركيز والهدوء سيكون له أثر كبير جداً 🙏`;
  } else if (student.marks === 'mastered') {
    body = `*${name}* يُظهر فهماً ممتازاً وإتقاناً واضحاً لمفاهيم الرياضيات 🌟 ونتمنى أن نراه أكثر مشاركة وتفاعلاً داخل الحصة حتى يستفيد زملاؤه أيضاً من قدراته المميزة وأفكاره الذكية. طالب واعد جداً بإذن الله 👏`;
  } else {
    body = `*${name}* يبذل مجهوداً طيباً في مادة الرياضيات، ونلاحظ تقدماً مستمراً لديه يوماً بعد يوم 🌱 مع القليل من المتابعة والتشجيع من المنزل، نحن على ثقة تامة بأنه سيصل إلى مستويات متميزة قريباً بإذن الله 💫`;
  }

  return opening + body + closing;
}

function openWhatsAppReport(id) {
  const student = findStudent(id);
  if (!student) return;
  const message = generateWhatsAppMessage(student);
  const url = 'https://wa.me/?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener');
}

/* ==========================================================================
   Status toast
   ========================================================================== */

let toastTimer = null;
function showStatus(message, type) {
  const toast = document.getElementById('statusToast');
  toast.textContent = message;
  toast.className = 'status-toast visible' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('visible'); }, 3500);
}

/* ==========================================================================
   Backend integration (Google Apps Script Web App)
   ========================================================================== */

// Google Apps Script Web Apps only return readable CORS responses for
// "simple" (non-preflighted) requests, so we deliberately send
// text/plain instead of application/json and let Code.gs parse the JSON
// itself. Switching this to 'application/json' will trigger a CORS
// preflight that Apps Script cannot answer, and the request will fail.
async function postToBackend(payload) {
  if (!backendUrl) {
    showStatus(t('statusNoBackendUrl'), 'error');
    return null;
  }
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}

async function saveDailyData() {
  if (!backendUrl) { showStatus(t('statusNoBackendUrl'), 'error'); return; }
  if (students.length === 0) { showStatus(t('statusNoStudentsToSave'), 'error'); return; }

  const btn = document.getElementById('saveDataBtn');
  btn.disabled = true;
  showStatus(t('statusSaving'), 'info');

  try {
    const payload = {
      action: 'saveData',
      timestamp: new Date().toISOString(),
      students: students.map(s => ({
        name: s.name, behavior: s.behavior, marks: s.marks, activity: s.activity, points: s.points
      }))
    };
    const result = await postToBackend(payload);
    if (result && result.status === 'error') throw new Error(result.message || 'error');
    showStatus(t('statusSaveSuccess'), 'success');
  } catch (err) {
    showStatus(t('statusSaveError'), 'error');
  } finally {
    btn.disabled = false;
  }
}

async function submitReminder(title, date, time) {
  const btn = document.getElementById('reminderSaveBtn');
  btn.disabled = true;
  showStatus(t('statusReminderSaving'), 'info');

  try {
    const payload = { action: 'addCalendarEvent', title, date, time: time || '' };
    const result = await postToBackend(payload);
    if (result === null) return; // no backend url configured, already reported
    if (result.status === 'error') throw new Error(result.message || 'error');

    reminders.unshift({ id: uid(), title, date, time, createdAt: new Date().toISOString() });
    saveReminders();
    renderReminders();
    showStatus(t('statusReminderSuccess'), 'success');
    document.getElementById('reminderForm').reset();
  } catch (err) {
    showStatus(t('statusReminderError'), 'error');
  } finally {
    btn.disabled = false;
  }
}

/* ==========================================================================
   Event wiring
   ========================================================================== */

function wireTabs() {
  document.getElementById('tabNav').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    const tabId = 'tab-' + btn.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === tabId));
  });
}

function wireLangToggle() {
  document.getElementById('langToggle').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
  });
}

function wireAddStudentForm() {
  document.getElementById('addStudentForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('newStudentName');
    addStudent(input.value);
    input.value = '';
    input.focus();
  });
}

function wireStudentGrid() {
  document.getElementById('studentGrid').addEventListener('click', e => {
    const card = e.target.closest('.student-card');
    if (!card) return;
    const id = card.dataset.id;

    const tapBtn = e.target.closest('.tap-btn');
    if (tapBtn) { setMetric(id, tapBtn.dataset.metric, tapBtn.dataset.value); return; }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    switch (actionEl.dataset.action) {
      case 'point-plus': changePoints(id, 1); break;
      case 'point-minus': changePoints(id, -1); break;
      case 'remove': removeStudent(id); break;
      case 'whatsapp': openWhatsAppReport(id); break;
    }
  });
}

function wireSaveDataButton() {
  document.getElementById('saveDataBtn').addEventListener('click', saveDailyData);
}

function wireReminderForm() {
  document.getElementById('reminderForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('reminderTitle').value.trim();
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    if (!title || !date) return;
    submitReminder(title, date, time);
  });
}

function wireSettings() {
  document.getElementById('backendUrl').value = backendUrl;
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    backendUrl = document.getElementById('backendUrl').value.trim();
    localStorage.setItem(STORAGE_KEYS.backendUrl, backendUrl);
    showStatus(t('statusSettingsSaved'), 'success');
  });
}

/* ==========================================================================
   Init
   ========================================================================== */

function init() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  applyStaticTranslations();
  updateDateDisplay();
  renderStudents();
  renderReminders();

  wireTabs();
  wireLangToggle();
  wireAddStudentForm();
  wireStudentGrid();
  wireSaveDataButton();
  wireReminderForm();
  wireSettings();
}

document.addEventListener('DOMContentLoaded', init);
