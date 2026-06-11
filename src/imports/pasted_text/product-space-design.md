Build a web app called "Product Space" — an AI workspace for product teams (PMs, PMMs, researchers, analysts, engineers) at a fintech company. It combines a free-form AI chat with structured "Tasks" (pre-built scenarios), organizes work into Projects, and stores all outputs in a team Artifacts library. Seed it as if a team is already mid-work.

=== DESIGN SYSTEM (inspired by base44.com) ===
- Single brand accent: orange #FF631F (primary buttons, brand mark, AI avatar, active states). Hover: #E5500F.
- Secondary accent: lime #D9F26E with dark-olive text #3C4A14 — used ONLY for the "team online" presence pill. Nowhere else.
- Backgrounds: working surfaces are calm warm near-white #FAF8F4; cards are solid white #FFFFFF with a 1px border rgba(20,16,12,.09) and soft shadow. Sidebar is warm grey #F3F0EA.
- DO NOT put gradients on working screens. Use a subtle gradient ONLY in the dashboard hero card and the chat empty-state mark (soft sky→lilac→cream: #EAF0F2 → #F1EEF6 → #FBF7F1).
- Status colors: done = green #1a7a4a on #e7f3ec; in-progress = neutral grey #5b6573 on #eef0f3.
- Fonts: headings in "Plus Jakarta Sans" weight 700 (not 800); body/UI in "Inter"; code and tiny labels in "JetBrains Mono".
- Generous rounded corners (10–18px), restrained spacing, clear focus rings in orange. Clean, professional, "tool not toy" — like OpenAI/Claude/Perplexity UIs.

=== LAYOUT ===
Left sidebar (fixed, ~276px) containing top-to-bottom:
1. Brand: small orange circle "sun" mark + "Product Space" with subtitle "команда Revolut".
2. Big orange "Новый чат" (New chat) button.
3. Nav links: Дашборд (Dashboard), Задачи (Tasks), Артефакты команды (Team artifacts).
4. Section "Проекты" (Projects) with a "+" to add — list each project with a status dot + name + chat count.
5. Section "Недавние чаты" (Recent chats) — scrollable list.
6. Bottom: product chip (dark square avatar "Д", label "Продукт / Дебетовая карта", gear icon) and a user row (avatar "АР", "Арман", "Head of Product · Revolut").

Main area: top bar (breadcrumb title left, a status pill "контекст: Дебетовая карта" right) + the active view below.

=== VIEWS ===
1) DASHBOARD (default): hero card with greeting "С возвращением, Арман", a lime "4 в сети" pill with overlapping avatars; section "Активные проекты" showing project cards (status pill, product tag, title, goal, orange progress bar, % + task count, member avatar stack); section "Быстрый старт" (4 task quick-cards); section "Лента команды" (recent artifacts feed: icon, title, author, task type, project tag, status pill, time); a dark purple gradient "Профиль продукта" context card at the bottom.

2) TASKS (full page, not a modal): page title "Задачи"; a search input with magnifier icon ("Поиск задачи…") that live-filters; a row of category filter chips (Все / Стратегия и продукт / Маркетинг и GTM / Исследования / Аналитика / Разработка / Прототипы и визуал); a "Недавние задачи" group; then the full catalog grouped by category. Each task is a card: emoji icon tile, name, description, small category tag; prototype tasks also show a lime "живое превью" badge. Clicking a task arms it in the chat composer and navigates to Chat.

3) CHAT (ChatGPT/Claude style): if a project is active, show a small project banner chip above the thread. Message thread: user messages = right-aligned grey bubble with avatar; AI messages = orange square avatar + content. AI replies can be plain text OR an "artifact card" (bordered card with header: icon, title, type, author; body; footer actions: Доработать/Экспорт/Сохранить в команду; prototypes have an "Открыть превью" expand). Empty state: centered orange circle mark, "Чем займёмся, Арман?", 4 suggestion cards, "Открыть все задачи" button. Bottom composer: rounded input, a "Задачи" button (opens Tasks page), attach icon, round orange send button; when a task is armed show a removable orange chip "Задача: <name>". Typing shows three animated dots before the AI reply.

4) PROJECT (full page): back link "Все проекты"; project header card (title, goal text, meta row: Статус with dot, Продукт, Команда avatars, Прогресс bar); buttons "Контекст" and "Новый чат в проекте"; section "Чаты и задачи проекта" (list); section "Артефакты проекта" (table: Артефакт / Автор / Тип / Когда / Статус).

5) ARTIFACTS (full page): title "Артефакты команды"; project filter chips (Все + each project); a table with columns Артефакт / Автор (colored avatar) / Проект / Когда / Статус.

=== TASKS CATALOG (28 tasks, 6 categories, each with an emoji) ===
Стратегия и продукт: Конкурентный анализ ⚔️, JTBD/персоны 🎯, Стратегия продукта 🧭, Гипотезы 🧪, Приоритизация 🗺️.
Маркетинг и GTM: GTM-план 🚀, Позиционирование 📣, Персоны 🧑, Тексты лендинга ✍️.
Исследования: Desk research 📚, Синтез интервью 🧵, Custdev-гайд 🔍, Анализ опроса 📊, Discovery-план 🧭.
Аналитика: SQL/анализ данных 🗄️, Метрики и события 📐, Дизайн A/B-теста ⚗️, Когортный анализ 📈, Анализ воронки 🔻.
Разработка: Код-ревью 🧐, Тех-спецификация (RFC) 📝, API-контракт 🔌, Разбор инцидента 🐞, Тест-кейсы 🧷.
Прототипы и визуал (these output live previews): Прототип мобильного компонента 📱, Веб-компонент 🖥️, Прототип лендинга 🌐, Создание визуала 🎨.

Document-type tasks render as a structured doc inside the artifact card (section headers with mono number badges, tables, bullet lists, callout boxes; analytics/dev tasks include dark code blocks for SQL/JSON/snippets). Prototype tasks render real previews: the mobile one is a phone frame showing a banking savings screen (dark balance card with €3 240,18, 4.5% rate, quick actions Пополнить/Снять/Round-up/Цель, a list of accruals, bottom tab bar); the landing one is a browser frame with a Revolut savings landing (hero, 3 feature cards, stat strip); the visual one shows two SVG launch graphics (dark + light) in the brand palette.

=== SEED DATA (team already working) ===
Product context: "Дебетовая карта" (Revolut debit card — multi-currency, cashback, savings).
Team (name → avatar initials → color): Арман АР #FF631F, Лена ЛК #2d6cdf, Игорь ИП #0d8a8a, Мария МД #b0299a, Дима (analyst) ДА #2f9e6b, Костя (engineer) СД #7a5cd6.
Project 1 — "Запуск накопительного счёта" (active, 62%, product: Дебетовая карта): tasks — GTM-план (Арман), SQL воронка открытия счёта (Дима), Код-ревью экрана счёта (Костя), Синтез 12 интервью (Мария), Мобильный прототип экрана (Игорь), Custdev-гайд страх блокировки (Лена, draft), Лендинг накоплений (Арман).
Project 2 — "Кэшбэк 2.0 по дебетовой карте" (planning, 24%): tasks — Конкурентный анализ Monzo (Игорь), API-контракт правил кэшбэка (Костя, draft), Гипотезы по кэшбэку (Арман, draft), Прототип управления кэшбэком (Игорь).
Recent chats and the artifacts library should be pre-populated from these.

=== INTERACTIONS ===
- Clicking a task → opens Chat with that task armed; "sending" shows a typing indicator, then inserts a generated artifact card into the thread and into the library.
- Free chat works too: typing a question returns a short helpful AI reply that references the product context and may suggest a relevant task.
- "Новый чат в проекте" attaches the new chat to that project.
- Artifacts can be edited inline (contenteditable highlighted blocks), exported, saved to team, and prototypes expanded fullscreen.
- A "Профиль продукта" modal lets you edit product name/stage/description/audience/competitors; saving updates context everywhere.

Make it a single responsive app; on narrow screens the sidebar collapses behind a hamburger. Keep all UI text in Russian as written above. Prioritize clean typography, calm surfaces, and the single orange accent.