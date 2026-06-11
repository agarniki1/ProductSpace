import { Project, Task, Chat, Artifact, Message, Profile, ProjectMember, ProjectMilestone, ProjectConclusion } from './types';

export const TEAM_COLORS = ['#FF631F', '#2D6CDF', '#0D8A8A', '#B0299A', '#2F9E6B', '#7A5CD6'];

export const DEFAULT_PROFILE: Profile = {
  name: 'Алексей Романов',
  initials: 'AR',
  role: 'Product Manager',
  company: 'Revolut',
  color: '#FF631F',
};

export const CATS: { id: string; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'pm', label: 'PM' },
  { id: 'pmm', label: 'PMM' },
  { id: 'res', label: 'Research' },
  { id: 'data', label: 'Data' },
  { id: 'dev', label: 'Dev' },
  { id: 'build', label: 'Build' },
];

export const ALL_TASKS: Task[] = [
  // PM
  { id: 'prd', cat: 'pm', kind: 'doc', ico: 'prd', name: 'PRD / Спецификация', desc: 'Структурированное описание фичи: цели, user stories, скоуп.' },
  { id: 'jtbd', cat: 'pm', kind: 'doc', ico: 'jtbd', name: 'JTBD-карта', desc: 'Functional / emotional / social jobs для целевого сегмента.' },
  { id: 'roadmap', cat: 'pm', kind: 'doc', ico: 'roadmap', name: 'Roadmap / Приоритизация', desc: 'Now–Next–Later и RICE-оценка по фичам.' },
  { id: 'brief', cat: 'pm', kind: 'doc', ico: 'brief', name: 'Product Brief', desc: 'Краткий обзор продуктовой гипотезы и следующих шагов.' },
  { id: 'retro', cat: 'pm', kind: 'doc', ico: 'retro', name: 'Ретроспектива', desc: 'Структурированный разбор итогов спринта или квартала.' },
  { id: 'hypothesis', cat: 'pm', kind: 'doc', ico: 'hypothesis', name: 'Гипотеза / Проблема', desc: 'Формулировка и оценка продуктовой гипотезы с критериями проверки.' },
  // PMM
  { id: 'gtm', cat: 'pmm', kind: 'doc', ico: 'gtm', name: 'GTM-стратегия', desc: 'Каналы, сообщения, приоритеты запусков и KPI по GTM.' },
  { id: 'copy', cat: 'pmm', kind: 'doc', ico: 'copy', name: 'Копирайтинг и месседжи', desc: 'Hero, value prop и ключевые сообщения для лендинга.' },
  { id: 'competitive', cat: 'pmm', kind: 'doc', ico: 'competitive', name: 'Конкурентный анализ', desc: 'Сравнение по функциям, ценам и позиционированию.' },
  { id: 'positioning', cat: 'pmm', kind: 'doc', ico: 'positioning', name: 'Позиционирование', desc: 'Positioning statement и messaging house для продукта.' },
  // Research
  { id: 'desk', cat: 'res', kind: 'doc', ico: 'desk', name: 'Desk Research', desc: 'Сбор и синтез вторичных источников по рынку и конкурентам.' },
  { id: 'synth', cat: 'res', kind: 'doc', ico: 'synth', name: 'Synthesis / Affinity', desc: 'Сгруппированные инсайты после интервью или опросов.' },
  { id: 'persona', cat: 'res', kind: 'doc', ico: 'persona', name: 'User Persona', desc: 'Детальный портрет целевого пользователя с болями и целями.' },
  { id: 'custdev', cat: 'res', kind: 'doc', ico: 'custdev', name: 'Customer Discovery', desc: 'Гайд для проведения глубинных интервью с пользователями.' },
  { id: 'survey', cat: 'res', kind: 'doc', ico: 'survey', name: 'Survey / Опрос', desc: 'Структура и вопросы для количественного исследования.' },
  // Data
  { id: 'metrics', cat: 'data', kind: 'doc', ico: 'metrics', name: 'Metrics / Tracking Plan', desc: 'Ключевые метрики, события и схема трекинга.' },
  { id: 'abtest', cat: 'data', kind: 'doc', ico: 'abtest', name: 'A/B тест', desc: 'Дизайн эксперимента, гипотеза, минимальный эффект, длительность.' },
  { id: 'cohort', cat: 'data', kind: 'doc', ico: 'cohort', name: 'Когортный анализ', desc: 'Сравнение поведения групп пользователей по времени регистрации.' },
  { id: 'funnel', cat: 'data', kind: 'doc', ico: 'funnel', name: 'Воронка / Funnel', desc: 'Анализ конверсии по этапам пользовательского пути.' },
  { id: 'sql', cat: 'data', kind: 'doc', ico: 'sql', name: 'SQL-запрос', desc: 'Аналитический запрос для выгрузки данных из БД.' },
  // Dev
  { id: 'techspec', cat: 'dev', kind: 'doc', ico: 'techspec', name: 'Tech Spec', desc: 'Техническое задание: архитектура, апи, зависимости, риски.' },
  { id: 'apispec', cat: 'dev', kind: 'doc', ico: 'apispec', name: 'API Spec', desc: 'Описание эндпоинтов, параметров и ответов в формате OpenAPI.' },
  { id: 'codereview', cat: 'dev', kind: 'doc', ico: 'codereview', name: 'Code Review', desc: 'Структурированный чеклист для ревью кода: безопасность, качество.' },
  { id: 'bug', cat: 'dev', kind: 'doc', ico: 'bug', name: 'Bug Report', desc: 'Детальный баг-репорт: шаги, ожидаемое/фактическое, окружение.' },
  { id: 'tests', cat: 'dev', kind: 'doc', ico: 'tests', name: 'Test Cases', desc: 'Сценарии тестирования: позитивные, негативные, edge cases.' },
  // Build (prototypes)
  { id: 'proto-mobile', cat: 'build', kind: 'proto', ico: 'proto-mobile', name: 'Mobile App Screen', desc: 'Живой интерактивный прототип мобильного экрана.' },
  { id: 'proto-web', cat: 'build', kind: 'proto', ico: 'proto-web', name: 'Web Component', desc: 'HTML/CSS компонент с интерактивными состояниями.' },
  { id: 'proto-landing', cat: 'build', kind: 'proto', ico: 'proto-landing', name: 'Landing Page', desc: 'Превью лендинга с hero, фичами и CTA.' },
  { id: 'proto-visual', cat: 'build', kind: 'proto', ico: 'proto-visual', name: 'Visual Asset', desc: 'Карточка или баннер для маркетинга и коммуникаций.' },
];

export const HERO_TASKS = ['prd', 'gtm', 'metrics', 'proto-mobile', 'jtbd', 'competitive'];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'rev-card',
    name: 'Debit card DACH',
    product: 'Debit card',
    status: 'active',
    goal: 'Запустить дебетовую карту в Германии и Австрии с локализованным CX и полным GTM.',
    progress: 42,
    members: ['AR', 'DS', 'PM'],
    chats: 3,
    startDate: '1 мая 2025',
    targetDate: '1 авг 2025',
    kpi: 'CAC < €40 · 10 000 активированных карт · NPS > 45',
    teamMembers: [
      { initials: 'AR', name: 'Алексей Романов', role: 'Product Manager', color: '#FF631F', contributions: 8, lastActive: 'Сегодня' },
      { initials: 'DS', name: 'Дмитрий Соколов', role: 'Product Designer', color: '#2D6CDF', contributions: 5, lastActive: 'Вчера' },
      { initials: 'PM', name: 'Паша Морозов', role: 'PMM Lead', color: '#0D8A8A', contributions: 4, lastActive: '2 дн. назад' },
    ],
    milestones: [
      { id: 'm1', title: 'Discovery & Research', date: '15 мая', done: true },
      { id: 'm2', title: 'GTM-стратегия', date: '1 июн', done: true },
      { id: 'm3', title: 'PRD + Tech Spec', date: '20 июн', done: false },
      { id: 'm4', title: 'Soft launch DE', date: '15 июл', done: false },
      { id: 'm5', title: 'Full DACH rollout', date: '1 авг', done: false },
    ],
    conclusions: [
      { id: 'c1', text: 'GTM-стратегия для Германии готова — каналы, месседжи, KPI согласованы с Growth', status: 'done', author: 'Паша Морозов', initials: 'PM', color: '#0D8A8A', when: '3 дн. назад' },
      { id: 'c2', text: 'Конкурентный анализ показал: N26 слабее в локализации — ключевое УТП для DACH', status: 'done', author: 'Алексей Романов', initials: 'AR', color: '#FF631F', when: '5 дн. назад' },
      { id: 'c3', text: 'Сейчас формируем креативную рамку и адаптируем месседжи под немецкий рынок', status: 'in_progress', author: 'Дмитрий Соколов', initials: 'DS', color: '#2D6CDF', when: 'Вчера' },
      { id: 'c4', text: 'PRD: провести финальный review с engineering до конца июня', status: 'planned', author: 'Алексей Романов', initials: 'AR', color: '#FF631F', when: 'Сегодня' },
    ],
  },
  {
    id: 'onboarding-v2',
    name: 'Onboarding v2',
    product: 'Growth',
    status: 'active',
    goal: 'Переработать onboarding flow для снижения time-to-value с 7 до 3 дней.',
    progress: 61,
    members: ['AM', 'TL', 'DS'],
    chats: 5,
    startDate: '10 апр 2025',
    targetDate: '30 июл 2025',
    kpi: 'Time-to-value: 7 → 3 дня · Activation rate > 45% · Drop-off D1 < 25%',
    teamMembers: [
      { initials: 'AM', name: 'Алексей Мосин', role: 'Product Manager', color: '#B0299A', contributions: 10, lastActive: 'Сегодня' },
      { initials: 'TL', name: 'Тимур Ли', role: 'Data Analyst', color: '#2F9E6B', contributions: 7, lastActive: 'Сегодня' },
      { initials: 'DS', name: 'Дмитрий Соколов', role: 'Product Designer', color: '#2D6CDF', contributions: 6, lastActive: 'Вчера' },
    ],
    milestones: [
      { id: 'm1', title: 'JTBD + User Research', date: '25 апр', done: true },
      { id: 'm2', title: 'Прототипы экранов', date: '15 мая', done: true },
      { id: 'm3', title: 'A/B тест Welcome screen', date: '10 июн', done: true },
      { id: 'm4', title: 'Запуск на 20% аудитории', date: '1 июл', done: false },
      { id: 'm5', title: 'Full rollout', date: '30 июл', done: false },
    ],
    conclusions: [
      { id: 'c1', text: 'A/B тест Welcome screen: вариант B даёт +12% activation rate — статзначим после 14 дней', status: 'done', author: 'Тимур Ли', initials: 'TL', color: '#2F9E6B', when: '2 дн. назад' },
      { id: 'c2', text: 'JTBD-исследование выявило: главный job — "открыть счёт за один вечер без бумаг"', status: 'done', author: 'Алексей Мосин', initials: 'AM', color: '#B0299A', when: '1 нед. назад' },
      { id: 'c3', text: 'Трекинг-план реализован, события отправляются корректно в Amplitude', status: 'done', author: 'Тимур Ли', initials: 'TL', color: '#2F9E6B', when: '4 дн. назад' },
      { id: 'c4', text: 'Готовим постепенный rollout на 20% аудитории — feature flag настроен', status: 'in_progress', author: 'Дмитрий Соколов', initials: 'DS', color: '#2D6CDF', when: 'Сегодня' },
    ],
  },
  {
    id: 'sub-pay',
    name: 'Subscriptions · Pay',
    product: 'Payments',
    status: 'planning',
    goal: 'Проверить гипотезы по подписочной модели для SME-сегмента.',
    progress: 18,
    members: ['AR', 'PO'],
    chats: 1,
    startDate: '1 июл 2025',
    targetDate: '30 сен 2025',
    kpi: 'MRR от подписок > €50K · Churn < 8% · NPS SME > 40',
    teamMembers: [
      { initials: 'AR', name: 'Алексей Романов', role: 'Product Manager', color: '#FF631F', contributions: 2, lastActive: 'Сегодня' },
      { initials: 'PO', name: 'Полина Орлова', role: 'Product Analyst', color: '#7A5CD6', contributions: 1, lastActive: '3 дн. назад' },
    ],
    milestones: [
      { id: 'm1', title: 'Market Research', date: '15 июл', done: false },
      { id: 'm2', title: 'Pricing Models', date: '1 авг', done: false },
      { id: 'm3', title: 'MVP Spec', date: '15 авг', done: false },
    ],
    conclusions: [
      { id: 'c1', text: 'Начинаем discovery: изучаем модели Stripe, Paddle, Chargebee для SME', status: 'in_progress', author: 'Алексей Романов', initials: 'AR', color: '#FF631F', when: 'Сегодня' },
    ],
  },
  {
    id: 'b2b-api',
    name: 'B2B API Portal',
    product: 'Platform',
    status: 'planning',
    goal: 'Создать self-serve портал для партнёрских API-интеграций.',
    progress: 8,
    members: ['AR', 'DV'],
    chats: 0,
    startDate: '1 авг 2025',
    targetDate: '31 дек 2025',
    kpi: '20 активных партнёров · API uptime 99.9% · TTI < 3 дня',
    teamMembers: [
      { initials: 'AR', name: 'Алексей Романов', role: 'Product Manager', color: '#FF631F', contributions: 1, lastActive: 'Неделю назад' },
      { initials: 'DV', name: 'Дмитрий Власов', role: 'Tech Lead', color: '#2D6CDF', contributions: 1, lastActive: '2 нед. назад' },
    ],
    milestones: [
      { id: 'm1', title: 'Partner interviews', date: 'авг', done: false },
      { id: 'm2', title: 'API Spec v1', date: 'сен', done: false },
      { id: 'm3', title: 'Portal MVP', date: 'ноя', done: false },
    ],
    conclusions: [],
  },
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function escHtml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function demoDoc(taskId: string, brief: string): string {
  const b = escHtml((brief || '').slice(0, 180));

  if (taskId === 'prd') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Problem &amp; Goals</h2>
    <p class="editable" contenteditable="true">Опишите бизнес-проблему и 2–3 измеримые цели релиза.</p>
    <h2><span class="art-section-num">02</span> User Stories</h2>
    <ul>
      <li class="editable" contenteditable="true">Как [роль] я хочу [действие], чтобы [ценность].</li>
      <li class="editable" contenteditable="true">Как пользователь, я хочу видеть прогресс онбординга, чтобы понимать, сколько осталось.</li>
    </ul>
    <h2><span class="art-section-num">03</span> Scope</h2>
    <table>
      <thead><tr><th>In scope</th><th>Out of scope</th></tr></thead>
      <tbody>
        <tr><td class="editable" contenteditable="true">Core flow A</td><td class="editable" contenteditable="true">Nice-to-have X</td></tr>
        <tr><td class="editable" contenteditable="true">Core flow B</td><td class="editable" contenteditable="true">Phase 2 feature</td></tr>
      </tbody>
    </table>
    <h2><span class="art-section-num">04</span> Риски и зависимости</h2>
    <p class="editable" contenteditable="true">Укажите технические и бизнес-риски, а также зависимости от других команд.</p>
    <div class="art-note"><strong>Next steps:</strong> согласовать с engineering до следующего спринта.</div>
  `;

  if (taskId === 'gtm') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> ICP и сегменты</h2>
    <p class="editable" contenteditable="true">Опишите 2–3 целевых сегмента: отрасль, размер, должности, ключевые боли.</p>
    <h2><span class="art-section-num">02</span> Value Proposition</h2>
    <ul>
      <li class="editable" contenteditable="true">Главный месседж: один тезис, который останется в голове.</li>
      <li class="editable" contenteditable="true">Supporting message для роли CFO.</li>
      <li class="editable" contenteditable="true">Supporting message для роли Product Manager.</li>
    </ul>
    <h2><span class="art-section-num">03</span> Каналы и эксперименты</h2>
    <table>
      <thead><tr><th>Канал</th><th>Гипотеза</th><th>MVP-эксперимент</th><th>Метрика</th></tr></thead>
      <tbody>
        <tr><td>Paid / Performance</td><td class="editable" contenteditable="true">...</td><td class="editable" contenteditable="true">Запустить кампанию на DACH</td><td>CAC &lt; €40</td></tr>
        <tr><td>Content / SEO</td><td class="editable" contenteditable="true">...</td><td class="editable" contenteditable="true">3 статьи за месяц</td><td>Organic leads</td></tr>
        <tr><td>Partnership</td><td class="editable" contenteditable="true">...</td><td class="editable" contenteditable="true">Пилот с одним партнёром</td><td>Referred users</td></tr>
      </tbody>
    </table>
    <div class="art-note"><strong>Next steps:</strong> выберите 3–4 эксперимента и запланируйте даты запусков.</div>
  `;

  if (taskId === 'jtbd') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Core Job Statement</h2>
    <p class="editable" contenteditable="true">Когда [ситуация], я хочу [мотивация], чтобы [желаемый исход].</p>
    <h2><span class="art-section-num">02</span> Jobs Map</h2>
    <table>
      <thead><tr><th>Тип</th><th>Job Statement</th><th>Приоритет</th></tr></thead>
      <tbody>
        <tr><td>Functional</td><td class="editable" contenteditable="true">Быстро открыть счёт без похода в банк</td><td>High</td></tr>
        <tr><td>Emotional</td><td class="editable" contenteditable="true">Чувствовать контроль над финансами</td><td>High</td></tr>
        <tr><td>Social</td><td class="editable" contenteditable="true">Выглядеть технологичным в глазах партнёров</td><td>Medium</td></tr>
      </tbody>
    </table>
    <h2><span class="art-section-num">03</span> Switch Triggers</h2>
    <p class="editable" contenteditable="true">Опишите ситуации, когда пользователь готов переключиться на новое решение.</p>
  `;

  if (taskId === 'metrics') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> North Star Metric</h2>
    <p class="editable" contenteditable="true">Одна метрика, которая лучше всего отражает ценность для пользователя.</p>
    <h2><span class="art-section-num">02</span> Ключевые метрики</h2>
    <table>
      <thead><tr><th>Метрика</th><th>Определение</th><th>Цель</th><th>Частота</th></tr></thead>
      <tbody>
        <tr><td>Activation rate</td><td class="editable" contenteditable="true">% users выполнивших ключевое действие в первые 7 дней</td><td>&gt; 40%</td><td>Weekly</td></tr>
        <tr><td>DAU/MAU</td><td class="editable" contenteditable="true">Отношение дневных к месячным активным пользователям</td><td>&gt; 25%</td><td>Daily</td></tr>
        <tr><td>Retention D30</td><td class="editable" contenteditable="true">% пользователей вернувшихся на 30-й день</td><td>&gt; 35%</td><td>Monthly</td></tr>
      </tbody>
    </table>
    <div class="art-note"><strong>Tracking plan:</strong> добавьте события в аналитику до начала спринта.</div>
  `;

  if (taskId === 'roadmap') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Стратегический контекст</h2>
    <p class="editable" contenteditable="true">Опишите цели квартала и OKR, которые роадмап должен поддерживать.</p>
    <h2><span class="art-section-num">02</span> Now / Next / Later</h2>
    <table>
      <thead><tr><th>Горизонт</th><th>Фича / инициатива</th><th>RICE</th><th>Статус</th></tr></thead>
      <tbody>
        <tr><td><strong>Now</strong> (Q3)</td><td class="editable" contenteditable="true">Onboarding redesign</td><td>840</td><td>In progress</td></tr>
        <tr><td><strong>Now</strong> (Q3)</td><td class="editable" contenteditable="true">Push-уведомления</td><td>620</td><td>Planned</td></tr>
        <tr><td><strong>Next</strong> (Q4)</td><td class="editable" contenteditable="true">API для партнёров</td><td>480</td><td>Discovery</td></tr>
        <tr><td><strong>Later</strong></td><td class="editable" contenteditable="true">AI-ассистент в приложении</td><td>260</td><td>Idea</td></tr>
      </tbody>
    </table>
    <div class="art-note">RICE = (Reach × Impact × Confidence) / Effort</div>
  `;

  if (taskId === 'competitive') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Конкурентный ландшафт</h2>
    <p class="editable" contenteditable="true">Опишите 3–5 ключевых конкурентов и их позиционирование на рынке.</p>
    <h2><span class="art-section-num">02</span> Feature Matrix</h2>
    <table>
      <thead><tr><th>Критерий</th><th>Наш продукт</th><th>Конкурент A</th><th>Конкурент B</th></tr></thead>
      <tbody>
        <tr><td>Цена</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td></tr>
        <tr><td>UX / Onboarding</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td></tr>
        <tr><td>API / Интеграции</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td></tr>
        <tr><td>Поддержка</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td><td class="editable" contenteditable="true">—</td></tr>
      </tbody>
    </table>
    <h2><span class="art-section-num">03</span> Наши преимущества</h2>
    <ul>
      <li class="editable" contenteditable="true">Уникальное преимущество 1</li>
      <li class="editable" contenteditable="true">Уникальное преимущество 2</li>
    </ul>
  `;

  if (taskId === 'persona') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Портрет пользователя</h2>
    <table>
      <thead><tr><th>Параметр</th><th>Описание</th></tr></thead>
      <tbody>
        <tr><td>Имя / роль</td><td class="editable" contenteditable="true">Мария, 31 год, Product Manager в финтех-стартапе</td></tr>
        <tr><td>Цели</td><td class="editable" contenteditable="true">Запускать фичи быстрее, тратить меньше времени на рутину</td></tr>
        <tr><td>Боли</td><td class="editable" contenteditable="true">Слишком много ручной работы, плохая координация с командой</td></tr>
        <tr><td>Контекст</td><td class="editable" contenteditable="true">Работает удалённо, активный пользователь Slack, Notion, Figma</td></tr>
        <tr><td>Цитата</td><td class="editable" contenteditable="true">"Я хочу делать больше за меньшее время"</td></tr>
      </tbody>
    </table>
    <h2><span class="art-section-num">02</span> Путь пользователя</h2>
    <p class="editable" contenteditable="true">Опишите ключевые этапы взаимодействия с продуктом от первого знакомства до покупки.</p>
  `;

  if (taskId === 'abtest') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Гипотеза</h2>
    <p class="editable" contenteditable="true">Мы верим, что [изменение] приведёт к [эффекту] для [метрики] потому что [основание].</p>
    <h2><span class="art-section-num">02</span> Дизайн эксперимента</h2>
    <table>
      <thead><tr><th>Параметр</th><th>Значение</th></tr></thead>
      <tbody>
        <tr><td>Контрольная группа</td><td class="editable" contenteditable="true">Текущий вариант (без изменений)</td></tr>
        <tr><td>Тестовая группа</td><td class="editable" contenteditable="true">Новый вариант с изменением X</td></tr>
        <tr><td>Метрика успеха</td><td class="editable" contenteditable="true">Conversion rate на шаге оплаты</td></tr>
        <tr><td>Минимальный эффект</td><td class="editable" contenteditable="true">+5% относительное улучшение</td></tr>
        <tr><td>Статистическая сила</td><td>80%</td></tr>
        <tr><td>Длительность</td><td class="editable" contenteditable="true">14 дней</td></tr>
        <tr><td>Выборка</td><td class="editable" contenteditable="true">~8 400 пользователей на группу</td></tr>
      </tbody>
    </table>
    <div class="art-note">Не забудьте проверить SRM (Sample Ratio Mismatch) после запуска.</div>
  `;

  if (taskId === 'techspec') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Архитектурный обзор</h2>
    <p class="editable" contenteditable="true">Опишите высокоуровневую архитектуру: сервисы, хранилища данных, внешние зависимости.</p>
    <h2><span class="art-section-num">02</span> API контракт</h2>
    <pre><code><span class="k">POST</span> <span class="f">/api/v1/users/{'{id}'}/onboard</span>
<span class="c">// Request</span>
{
  <span class="s">"step"</span>: <span class="s">"kyc_complete"</span>,
  <span class="s">"data"</span>: { ... }
}
<span class="c">// Response 200</span>
{
  <span class="s">"status"</span>: <span class="s">"success"</span>,
  <span class="s">"nextStep"</span>: <span class="s">"funding"</span>
}</code></pre>
    <h2><span class="art-section-num">03</span> Риски и митигация</h2>
    <table>
      <thead><tr><th>Риск</th><th>Вероятность</th><th>Митигация</th></tr></thead>
      <tbody>
        <tr><td class="editable" contenteditable="true">Задержка внешнего KYC-провайдера</td><td>Medium</td><td class="editable" contenteditable="true">Async flow с fallback</td></tr>
        <tr><td class="editable" contenteditable="true">Нагрузка на БД при пиковом трафике</td><td>Low</td><td class="editable" contenteditable="true">Read replica + кэш</td></tr>
      </tbody>
    </table>
  `;

  if (taskId === 'sql') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Запрос</h2>
    <pre><code><span class="k">SELECT</span>
  u.id,
  u.created_at,
  COUNT(e.id) <span class="k">AS</span> event_count,
  MAX(e.created_at) <span class="k">AS</span> last_event
<span class="k">FROM</span> users u
<span class="k">LEFT JOIN</span> events e
  <span class="k">ON</span> e.user_id = u.id
  <span class="k">AND</span> e.created_at &gt;= <span class="f">NOW()</span> - <span class="k">INTERVAL</span> <span class="s">'30 days'</span>
<span class="k">WHERE</span>
  u.created_at &gt;= <span class="s">'2024-01-01'</span>
  <span class="k">AND</span> u.status = <span class="s">'active'</span>
<span class="k">GROUP BY</span> u.id, u.created_at
<span class="k">HAVING</span> event_count &gt; 0
<span class="k">ORDER BY</span> event_count <span class="k">DESC</span>
<span class="k">LIMIT</span> 1000;</code></pre>
    <div class="art-note">Замените имена таблиц и полей под вашу схему данных.</div>
  `;

  if (taskId === 'custdev') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Цели интервью</h2>
    <p class="editable" contenteditable="true">Что именно мы хотим узнать: боли, поведение, текущие решения, триггеры переключения.</p>
    <h2><span class="art-section-num">02</span> Скрипт интервью</h2>
    <ul>
      <li class="editable" contenteditable="true"><strong>Разогрев:</strong> Расскажите о своей роли и задачах, которые занимают больше всего времени.</li>
      <li class="editable" contenteditable="true"><strong>Боли:</strong> Что сейчас происходит, когда вы [ситуация]? Что не работает?</li>
      <li class="editable" contenteditable="true"><strong>Текущие решения:</strong> Как вы сейчас решаете эту проблему? Какими инструментами пользуетесь?</li>
      <li class="editable" contenteditable="true"><strong>Триггеры:</strong> Когда в последний раз вы искали альтернативу? Что произошло?</li>
      <li class="editable" contenteditable="true"><strong>Ценность:</strong> Что для вас идеальное решение этой задачи?</li>
    </ul>
    <div class="art-note">Помните: слушайте 80% времени, задавайте уточняющие вопросы, не продавайте.</div>
  `;

  if (taskId === 'hypothesis') return `
    <p><strong>Контекст:</strong> ${b}</p>
    <h2><span class="art-section-num">01</span> Формулировка гипотезы</h2>
    <p class="editable" contenteditable="true">Мы верим, что [решение/изменение] поможет [сегменту] достичь [результата], потому что [обоснование].</p>
    <h2><span class="art-section-num">02</span> Критерии проверки</h2>
    <table>
      <thead><tr><th>Критерий</th><th>Описание</th></tr></thead>
      <tbody>
        <tr><td>Метрика успеха</td><td class="editable" contenteditable="true">Конкретная измеримая цель</td></tr>
        <tr><td>Минимальный порог</td><td class="editable" contenteditable="true">Что считаем успехом</td></tr>
        <tr><td>Таймфрейм</td><td class="editable" contenteditable="true">За какой период проверяем</td></tr>
        <tr><td>Метод проверки</td><td class="editable" contenteditable="true">A/B-тест / интервью / анализ данных</td></tr>
      </tbody>
    </table>
    <h2><span class="art-section-num">03</span> Риски и предположения</h2>
    <p class="editable" contenteditable="true">Перечислите ключевые предположения, от которых зависит гипотеза.</p>
  `;

  // Proto generators
  if (taskId === 'proto-mobile') return buildMobileProto(brief);
  if (taskId === 'proto-web') return buildWebProto(brief);
  if (taskId === 'proto-landing') return buildLandingProto(brief);
  if (taskId === 'proto-visual') return buildVisualProto(brief);

  // Generic fallback
  return `
    <p><strong>Контекст:</strong> ${b}</p>
    <p class="editable" contenteditable="true">Здесь появится структурированная заготовка под выбранную задачу. Нажмите для редактирования.</p>
    <div class="art-note">Это демо-шаблон. В продакшне ответ будет сгенерирован на основе вашего контекста продукта.</div>
  `;
}

function buildMobileProto(brief: string): string {
  return `
    <p style="margin-bottom:16px;color:var(--ink-2)">Прототип мобильного экрана · ${escHtml(brief.slice(0, 60))}</p>
    <div style="display:flex;justify-content:center;padding:8px 0 24px">
      <div style="width:280px;background:#fff;border-radius:36px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;border:8px solid #111">
        <div style="background:linear-gradient(135deg,#7C3AED,#4F46E5);padding:28px 20px 20px;color:#fff">
          <div style="font-size:11px;opacity:.7;margin-bottom:4px">9:41</div>
          <div style="font-size:18px;font-weight:700;font-family:var(--font-display)">Revolut</div>
          <div style="margin-top:20px;font-size:24px;font-weight:700">€ 4,823.40</div>
          <div style="font-size:11px;opacity:.75;margin-top:4px">Основной счёт</div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <div style="background:rgba(255,255,255,.25);border-radius:10px;padding:8px 12px;font-size:11px;font-weight:600">Пополнить</div>
            <div style="background:rgba(255,255,255,.25);border-radius:10px;padding:8px 12px;font-size:11px;font-weight:600">Отправить</div>
            <div style="background:rgba(255,255,255,.25);border-radius:10px;padding:8px 12px;font-size:11px;font-weight:600">Обмен</div>
          </div>
        </div>
        <div style="padding:16px">
          <div style="font-size:11px;font-weight:600;color:var(--ink-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Последние операции</div>
          ${['Netflix · подписка · −€15.99', 'Кофе Cofix · −€3.50', 'Зарплата · +€5 200'].map(t => `
            <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #f0ede8">
              <div style="width:32px;height:32px;border-radius:10px;background:#f4f1ea;display:flex;align-items:center;justify-content:center;font-size:14px">${t.includes('Netflix') ? '🎬' : t.includes('Кофе') ? '☕' : '💰'}</div>
              <div style="flex:1;font-size:12px">${escHtml(t.split(' · ')[0])}</div>
              <div style="font-size:12px;font-weight:600;color:${t.includes('+') ? 'var(--green)' : 'var(--ink)'}">${escHtml(t.split(' · ')[2] || '')}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-around;padding:12px 0 8px;border-top:1px solid #f0ede8">
          ${['🏠', '💳', '📊', '👤'].map((ico, i) => `
            <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="font-size:18px">${ico}</div>
              <div style="width:4px;height:4px;border-radius:50%;background:${i===0?'var(--ai)':'transparent'}"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="art-note">Интерактивный прототип. В продакшне — кликабельные состояния и переходы.</div>
  `;
}

function buildWebProto(brief: string): string {
  return `
    <p style="margin-bottom:16px;color:var(--ink-2)">Web-компонент · ${escHtml(brief.slice(0, 60))}</p>
    <div style="background:#f8f7f4;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid var(--border)">
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.07)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--ai-lt);display:flex;align-items:center;justify-content:center;font-size:20px">🚀</div>
          <div>
            <div style="font-weight:600;font-family:var(--font-display)">Promo Card Component</div>
            <div style="font-size:12px;color:var(--ink-3)">Настраиваемый компонент</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          ${['Безопасность', 'Скорость', 'Аналитика', 'API'].map(f => `
            <div style="background:var(--bg-subtle);border-radius:10px;padding:12px;display:flex;align-items:center;gap:8px">
              <div style="width:24px;height:24px;border-radius:6px;background:var(--ai-lt);display:flex;align-items:center;justify-content:center;font-size:12px">✓</div>
              <div style="font-size:13px;font-weight:500">${f}</div>
            </div>
          `).join('')}
        </div>
        <button style="width:100%;background:var(--ai);color:#fff;border-radius:10px;padding:12px;font-weight:600;font-size:14px;border:none;cursor:pointer">Начать бесплатно</button>
      </div>
    </div>
    <div class="art-note">Компонент адаптирован под дизайн-систему. Готов к интеграции.</div>
  `;
}

function buildLandingProto(brief: string): string {
  return `
    <p style="margin-bottom:16px;color:var(--ink-2)">Landing Page Preview · ${escHtml(brief.slice(0, 60))}</p>
    <div style="background:#0d0d0d;border-radius:16px;overflow:hidden;margin-bottom:16px">
      <div style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08)">
        <div style="color:#fff;font-weight:700;font-family:var(--font-display)">Brand</div>
        <div style="display:flex;gap:16px">
          ${['Продукт', 'Цены', 'Блог'].map(t => `<div style="color:rgba(255,255,255,.6);font-size:13px">${t}</div>`).join('')}
        </div>
        <div style="background:var(--ai);color:#fff;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600">Попробовать</div>
      </div>
      <div style="padding:56px 32px 40px;text-align:center">
        <div style="display:inline-block;background:rgba(124,58,237,.2);color:#C084FC;padding:5px 14px;border-radius:99px;font-size:12px;font-weight:600;margin-bottom:20px">Новинка · 2025</div>
        <div style="color:#fff;font-size:28px;font-weight:800;font-family:var(--font-display);line-height:1.2;margin-bottom:14px">AI-инструмент для<br/>продуктовых команд</div>
        <div style="color:rgba(255,255,255,.55);font-size:14px;max-width:380px;margin:0 auto 28px">Создавайте PRD, GTM-стратегии и прототипы в 10× быстрее с помощью AI.</div>
        <div style="display:flex;gap:10px;justify-content:center">
          <div style="background:var(--ai);color:#fff;padding:11px 24px;border-radius:10px;font-weight:600;font-size:14px">Начать бесплатно</div>
          <div style="background:rgba(255,255,255,.1);color:#fff;padding:11px 24px;border-radius:10px;font-size:14px">Посмотреть демо →</div>
        </div>
        <div style="display:flex;justify-content:center;gap:24px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)">
          ${['2 000+ команд', '50+ шаблонов', 'SOC 2 Type II'].map(t => `<div style="color:rgba(255,255,255,.45);font-size:12px">${t}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="art-note">Preview лендинга. В продакшне — адаптивный HTML с анимациями.</div>
  `;
}

function buildVisualProto(brief: string): string {
  return `
    <p style="margin-bottom:16px;color:var(--ink-2)">Visual Asset · ${escHtml(brief.slice(0, 60))}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:linear-gradient(135deg,#7C3AED,#4F46E5);border-radius:16px;padding:24px;color:#fff;aspect-ratio:1.6">
        <div style="font-size:11px;opacity:.7;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Product Space</div>
        <div style="font-size:20px;font-weight:800;font-family:var(--font-display);line-height:1.2;margin-bottom:12px">Collaborate<br/>smarter</div>
        <div style="font-size:12px;opacity:.8">AI для вашей команды</div>
      </div>
      <div style="background:#0d0d0d;border-radius:16px;padding:24px;color:#fff;aspect-ratio:1.6">
        <div style="font-size:28px;margin-bottom:8px">🚀</div>
        <div style="font-size:16px;font-weight:700;font-family:var(--font-display);margin-bottom:6px">Launch faster</div>
        <div style="font-size:11px;opacity:.55">GTM · PRD · Research</div>
      </div>
      <div style="background:var(--ai-lt);border-radius:16px;padding:24px;aspect-ratio:1.6">
        <div style="font-size:13px;font-weight:600;color:var(--ai);margin-bottom:8px">Case Study</div>
        <div style="font-size:14px;font-weight:700;color:var(--ink);font-family:var(--font-display)">+3× скорость<br/>создания PRD</div>
      </div>
      <div style="background:var(--blue-lt);border-radius:16px;padding:24px;aspect-ratio:1.6">
        <div style="font-size:13px;font-weight:600;color:var(--blue);margin-bottom:8px">Метрика</div>
        <div style="font-size:28px;font-weight:800;color:var(--ink);font-family:var(--font-display)">10×</div>
        <div style="font-size:12px;color:var(--ink-3)">быстрее на рутине</div>
      </div>
    </div>
    <div class="art-note">4 варианта визуального ассета. Готовы к экспорту в PNG/SVG.</div>
  `;
}

export function freeReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('prd') || t.includes('спецификац') || t.includes('требован')) {
    return 'Вижу запрос на PRD. Рекомендую использовать задачу **PRD / Спецификация** для структурированного документа. Хотите, я подготовлю шаблон?';
  }
  if (t.includes('gtm') || t.includes('запуск') || t.includes('маркет')) {
    return 'Для Go-to-Market стратегии у меня есть специальный шаблон. Нажмите на задачу **GTM-стратегия** в библиотеке или опишите подробнее — помогу структурировать.';
  }
  if (t.includes('метрик') || t.includes('аналитик') || t.includes('kpi')) {
    return 'Для работы с метриками лучше всего подойдёт задача **Metrics / Tracking Plan** или **A/B тест**. Расскажите подробнее о вашем продукте?';
  }
  if (t.includes('пользовател') || t.includes('интервью') || t.includes('research')) {
    return 'Для пользовательских исследований есть несколько инструментов: **Customer Discovery** (гайд для интервью), **User Persona** и **Synthesis / Affinity**. С чего начнём?';
  }
  return 'Понял! Если хотите структурированный документ — выберите задачу из библиотеки (кнопка слева). Или продолжайте описывать задачу — помогу сформулировать нужный запрос.';
}

export function deriveTitle(taskId: string, brief: string, tasks: Task[]): string {
  const t = tasks.find(s => s.id === taskId);
  const short = (brief || '').trim();
  if (short && short.length < 64) return short;
  return t ? t.name : 'Артефакт';
}

// Build seed chats and artifacts for a project
export function buildSeedData(
  projectId: string,
  projectName: string,
  seedItems: Array<{ taskId: string; brief: string; author: string; initials: string; color: string; daysAgo: number }>
): { chats: Chat[]; artifacts: Artifact[] } {
  const chats: Chat[] = [];
  const artifacts: Artifact[] = [];

  for (const item of seedItems) {
    const task = ALL_TASKS.find(t => t.id === item.taskId);
    if (!task) continue;

    const chatId = uid();
    const artId = uid();
    const userMsg: Message = { id: uid(), role: 'user', text: item.brief };
    const artMsg: Message = {
      id: artId,
      role: 'assistant',
      type: 'artifact',
      taskId: item.taskId,
      title: item.brief.length < 64 ? item.brief : task.name,
      docHtml: demoDoc(item.taskId, item.brief),
    };

    const date = new Date(Date.now() - item.daysAgo * 86400000);
    const when = formatDate(date);

    chats.push({
      id: chatId,
      title: item.brief.length < 50 ? item.brief : task.name,
      ico: task.ico,
      projectId,
      when,
      messages: [userMsg, artMsg],
    });

    artifacts.push({
      id: artId,
      title: item.brief.length < 64 ? item.brief : task.name,
      taskId: item.taskId,
      skillName: task.name,
      status: 'done',
      projectName,
      projectId,
      author: item.author,
      initials: item.initials,
      when,
      chatId,
    });
  }

  return { chats, artifacts };
}

function formatDate(d: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
