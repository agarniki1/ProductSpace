import React from 'react';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Settings2,
  Globe,
  Users,
  Briefcase,
  Target,
} from 'lucide-react';
import { Project, Task, Artifact, Chat, Profile } from '../types';
import { HERO_TASKS, TEAM_COLORS } from '../data';
import { AiOrb } from './AiOrb';
import { TaskIcon } from './TaskIcon';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  artifacts: Artifact[];
  chats: Chat[];
  profile: Profile;
  onNewTask: () => void;
  onOpenProject: (id: string) => void;
  onArmTask: (id: string) => void;
  onAllArtifacts: () => void;
  onNewProject: () => void;
  onOpenChat: (id: string) => void;
  onOpenProfile: () => void;
}

type ExtendedProfile = Profile & {
  bio?: string;
  prompt?: string;
  audience?: string;
  markets?: string;
  goals?: string;
  products?: string;
};

const ONLINE_TEAM = [
  { initials: 'DS', color: TEAM_COLORS[1] },
  { initials: 'AM', color: TEAM_COLORS[2] },
  { initials: 'TL', color: TEAM_COLORS[4] },
];

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  pm: { bg: '#EDE9FE', color: '#7C3AED' },
  pmm: { bg: '#FEF3C7', color: '#D97706' },
  res: { bg: '#DBEAFE', color: '#2563EB' },
  data: { bg: '#DCFCE7', color: '#16A34A' },
  dev: { bg: '#FEE2E2', color: '#DC2626' },
  build: { bg: '#F3E8FF', color: '#9333EA' },
};

const PROJECT_NARRATIVE_PRESETS = [
  {
    name: 'Core Product Experience',
    summary:
      'Главный поток использования продукта: первая ценность, частота использования и удержание.',
    meta: 'Core · adoption',
    progress: 78,
  },
  {
    name: 'Onboarding & Activation',
    summary:
      'Новый клиентский онбординг: путь от первого касания до уверенной активации в первые недели.',
    meta: 'Onboarding · activation',
    progress: 62,
  },
  {
    name: 'Engagement & Loyalty',
    summary:
      'Механики вовлечения, повторного использования и программ лояльности для ключевых сегментов.',
    meta: 'Engagement · loyalty',
    progress: 54,
  },
  {
    name: 'Retention & Reactivation',
    summary:
      'Работа с churn: сигналы оттока, реактивационные сценарии и прозвон “на грани” ухода.',
    meta: 'Retention · lifecycle',
    progress: 41,
  },
];

export function Dashboard({
  projects,
  tasks,
  artifacts,
  chats,
  profile,
  onNewTask,
  onOpenProject,
  onArmTask,
  onAllArtifacts,
  onNewProject,
  onOpenChat,
  onOpenProfile,
}: DashboardProps) {
  const heroTasks = HERO_TASKS.map(id => tasks.find(t => t.id === id)).filter(
    Boolean
  ) as Task[];

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentArtifacts = artifacts.slice(0, 4);
  const recentChats = chats.slice(0, 5);

  const brief = profile as ExtendedProfile;

  const companyName = brief.company?.trim() || 'Ваша компания';
  const audience =
    brief.audience?.trim() || 'Retail customers, freelancers, SME';
  const goals =
    brief.goals?.trim() ||
    'Рост активации, usage, retention и cross-sell по ключевым продуктам';
  const markets =
    brief.markets?.trim() ||
    'UK, EEA, US, Australia, Japan, Singapore, Switzerland, New Zealand, Brazil';
  const productsSummary =
    brief.products?.trim() ||
    'Core продукт(ы), onboarding, engagement / loyalty, retention';

  const companySummary =
    brief.bio?.trim() ||
    `${companyName} помогает ${audience.toLowerCase()} решать ключевые задачи на рынках ${markets}. Главный фокус — ${goals.toLowerCase()}, через продуктовые направления вроде ${productsSummary.toLowerCase()}.`;

  const displayProjects = activeProjects.slice(0, 4).map((p, index) => {
    const preset = PROJECT_NARRATIVE_PRESETS[index];
    return {
      ...p,
      name: preset?.name || p.name,
      progress: preset?.progress ?? p.progress,
      summary:
        preset?.summary || p.product || 'Продуктовая инициатива',
      meta:
        preset?.meta ||
        `${companyName || 'Product'} · initiative`,
    };
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px 40px',
        background:
          'linear-gradient(180deg, #faf8f4 0%, #f7f4ef 42%, #f4f0ea 100%)',
      }}
    >
      <div style={{ maxWidth: 1220, margin: '0 auto' }}>
        {/* Top unified block */}
        <div
          style={{
            marginBottom: 24,
            padding: '22px 22px 18px',
            borderRadius: 28,
            border: '1px solid var(--border)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 100%)',
            boxShadow: '0 10px 28px rgba(20,24,34,0.04)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 16,
              alignItems: 'start',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 18px rgba(20,24,34,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AiOrb size={42} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-.025em',
                    lineHeight: 1.18,
                    color: 'var(--ink)',
                    marginBottom: 4,
                  }}
                >
                  {greeting}, {profile.name.split(' ')[0]}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--ink-2)',
                    lineHeight: 1.55,
                  }}
                >
                  Единый контекст компании: кто наши пользователи, какие рынки покрываем
                  и какие продуктовые инициативы в фокусе.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid var(--border)',
                alignSelf: 'start',
              }}
            >
              <div style={{ display: 'flex' }}>
                {ONLINE_TEAM.map((m, i) => (
                  <div
                    key={m.initials}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: m.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      border: '2px solid #fff',
                      marginLeft: i > 0 ? -7 : 0,
                      zIndex: ONLINE_TEAM.length - i,
                      position: 'relative',
                    }}
                  >
                    {m.initials}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 0 4px rgba(47,158,107,0.12)',
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ONLINE_TEAM.length} онлайн
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 22,
              border: '1px solid rgba(20,24,34,0.06)',
              background: 'rgba(255,255,255,0.58)',
              padding: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sparkles size={14} color="var(--ai)" />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  Быстрый старт
                </span>
              </div>

              <button
                onClick={onNewTask}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: 'var(--ink-2)',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Все задачи <ArrowRight size={12} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              {heroTasks.map(t => {
                const cc = CAT_COLORS[t.cat] || {
                  bg: 'var(--ai-lt)',
                  color: 'var(--ai)',
                };

                return (
                  <button
                    key={t.id}
                    onClick={() => onArmTask(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '13px 14px',
                      borderRadius: 18,
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.86)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition:
                        'background .12s ease, box-shadow .12s ease, border-color .12s ease, transform .12s ease',
                      boxShadow: '0 2px 8px rgba(20,24,34,0.015)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.boxShadow =
                        '0 8px 18px rgba(20,24,34,0.03)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.borderColor = `${cc.color}22`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.86)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(20,24,34,0.015)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <TaskIcon taskId={t.id} size={30} bg={cc.bg} color={cc.color} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          lineHeight: 1.32,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t.name}
                      </div>

                      {t.kind === 'proto' && (
                        <span
                          style={{
                            fontSize: 10,
                            color: cc.color,
                            fontWeight: 600,
                          }}
                        >
                          живое превью
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Context */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              borderRadius: 26,
              padding: '18px',
              background:
                'linear-gradient(180deg, rgba(111,127,242,0.10) 0%, rgba(255,255,255,0.84) 38%, rgba(255,255,255,0.76) 100%)',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 24px rgba(20,24,34,0.04)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: 16,
                alignItems: 'start',
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: 'var(--ink-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    marginBottom: 8,
                  }}
                >
                  Company Context
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.82)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AiOrb size={34} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--ink)',
                        marginBottom: 4,
                      }}
                    >
                      {companyName}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: 'var(--ink-2)',
                        lineHeight: 1.6,
                        maxWidth: 760,
                      }}
                    >
                      {companySummary}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenProfile}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.86)',
                  color: 'var(--ink-2)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Settings2 size={13} />
                Настроить бриф
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <ContextRow
                icon={<Users size={13} color="var(--ink-3)" />}
                label="Целевая аудитория"
                value={audience}
              />
              <ContextRow
                icon={<Target size={13} color="var(--ink-3)" />}
                label="Бизнес-цели"
                value={goals}
              />
              <ContextRow
                icon={<Globe size={13} color="var(--ink-3)" />}
                label="Рынки / страны"
                value={markets}
              />
              <ContextRow
                icon={<Briefcase size={13} color="var(--ink-3)" />}
                label="Продуктовые направления"
                value={productsSummary}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 8,
              }}
            >
              {[
                { label: 'Проектов', value: projects.length },
                { label: 'Артефактов', value: artifacts.length },
                { label: 'Задач AI', value: 29 },
                { label: 'Участников', value: 6 },
              ].map(s => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(255,255,255,0.74)',
                    borderRadius: 14,
                    padding: '10px 11px',
                    border: '1px solid rgba(20,24,34,0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--ink)',
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--ink-3)',
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active projects overview */}
        <div style={{ marginBottom: 18 }}>
          <Card
            title="Активные проекты"
            action={{ label: '+ Новый', onClick: onNewProject }}
          >
            <div
              style={{
                padding: '14px 16px 8px',
                fontSize: 12.5,
                color: 'var(--ink-2)',
                lineHeight: 1.6,
                borderBottom: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.42)',
              }}
            >
              Здесь — overview продуктовых инициатив: от core‑опыта до онбординга,
              вовлечения и удержания. Детали живут на страницах проектов.
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0,
              }}
            >
              {displayProjects.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => onOpenProject(p.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                    borderBottom:
                      i < displayProjects.length - 2
                        ? '1px solid var(--border)'
                        : 'none',
                    transition: 'background .12s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.46)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: 3,
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--ink-3)',
                        }}
                      >
                        {p.meta}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: 'var(--ink-3)',
                        flexShrink: 0,
                      }}
                    >
                      {p.progress}%
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-2)',
                      lineHeight: 1.58,
                    }}
                  >
                    {p.summary}
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: 5,
                      background: 'rgba(20,24,34,0.06)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${p.progress}%`,
                        background: 'var(--ai)',
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          <Card title="Чаты" icon={<Clock size={13} color="var(--ink-3)" />}>
            {recentChats.length === 0 ? (
              <EmptyState icon="💬" text="Нет чатов. Начните новый!" />
            ) : (
              recentChats.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => onOpenChat(c.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom:
                      i < recentChats.length - 1
                        ? '1px solid var(--border)'
                        : 'none',
                    transition: 'background .12s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <TaskIcon
                    taskId={c.ico}
                    size={28}
                    bg="var(--ai-lt)"
                    color="var(--ai)"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                      {c.when}
                    </div>
                  </div>
                </button>
              ))
            )}
          </Card>

          <Card
            title="Артефакты команды"
            icon={<TrendingUp size={13} color="var(--ink-3)" />}
            action={{ label: 'Все →', onClick: onAllArtifacts }}
          >
            {recentArtifacts.length === 0 ? (
              <EmptyState icon="📄" text="Нет артефактов. Создайте первый!" />
            ) : (
              recentArtifacts.map((a, i) => {
                const avatarColor =
                  TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];

                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      borderBottom:
                        i < recentArtifacts.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: avatarColor,
                        color: '#fff',
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {a.initials}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: 'var(--ink)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                        {a.skillName} · {a.when}
                      </div>
                    </div>

                    <StatusBadge status={a.status} />
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.88)',
        borderRadius: 24,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(20,24,34,0.03)',
      }}
    >
      <div
        style={{
          padding: '13px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.52)',
        }}
      >
        {icon}

        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            flex: 1,
          }}
        >
          {title}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            style={{
              fontSize: 12,
              color: 'var(--ink-2)',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
}

function ContextRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '14px 108px minmax(0, 1fr)',
        alignItems: 'start',
        gap: 8,
        padding: '10px 11px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.58)',
        border: '1px solid rgba(20,24,34,0.05)',
      }}
    >
      <div style={{ marginTop: 1 }}>{icon}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--ink-3)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: 'var(--ink-2)',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        padding: '28px 16px',
        textAlign: 'center',
        color: 'var(--ink-3)',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12.5 }}>{text}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'done' | 'draft' }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: 99,
        flexShrink: 0,
        background: status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)',
        color: status === 'done' ? 'var(--green)' : 'var(--ai)',
        border: '1px solid rgba(20,24,34,0.04)',
      }}
    >
      {status === 'done' ? 'Готово' : 'Черновик'}
    </div>
  );
}