import React from 'react';
import { ArrowRight, Plus, Sparkles, TrendingUp, Clock } from 'lucide-react';
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
}

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

export function Dashboard({
  projects, tasks, artifacts, chats, profile,
  onNewTask, onOpenProject, onArmTask, onAllArtifacts, onNewProject, onOpenChat,
}: DashboardProps) {
  const heroTasks = HERO_TASKS.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  const activeProjects = projects.filter(p => p.status === 'active');
  const recentArtifacts = artifacts.slice(0, 4);
  const recentChats = chats.slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px 40px' }}>

      {/* Greeting header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <AiOrb size={44} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-.02em', lineHeight: 1.2 }}>
              {greeting}, {profile.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 3 }}>Чем займёмся сегодня?</div>
          </div>
        </div>

        {/* Online badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 999,
          background: '#fff', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex' }}>
            {ONLINE_TEAM.map((m, i) => (
              <div key={m.initials} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: m.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700,
                border: '2px solid #fff',
                marginLeft: i > 0 ? -7 : 0, zIndex: ONLINE_TEAM.length - i, position: 'relative',
              }}>{m.initials}</div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{ONLINE_TEAM.length} онлайн</span>
          </div>
        </div>
      </div>

      {/* Quick-start tasks */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Sparkles size={14} color="var(--ai)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Быстрый старт</span>
          </div>
          <button
            onClick={onNewTask}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--ai)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
          >Все задачи <ArrowRight size={12} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {heroTasks.map(t => {
            const cc = CAT_COLORS[t.cat] || { bg: 'var(--ai-lt)', color: 'var(--ai)' };
            return (
              <button
                key={t.id}
                onClick={() => onArmTask(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 13px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', background: '#fff',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'box-shadow .15s, transform .1s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <TaskIcon taskId={t.id} size={30} bg={cc.bg} color={cc.color} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                  {t.kind === 'proto' && <span style={{ fontSize: 10, color: cc.color, fontWeight: 600 }}>живое превью</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>

        {/* Active projects */}
        <Card title="Активные проекты" action={{ label: '+ Новый', onClick: onNewProject }}>
          {activeProjects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onOpenProject(p.id)}
              style={{
                width: '100%', display: 'block', padding: '12px 16px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                borderBottom: i < activeProjects.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background .1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.product}</div>
                </div>
                <div style={{ display: 'flex', gap: -5 }}>
                  {p.members.slice(0, 3).map((m, mi) => (
                    <div key={m} style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: TEAM_COLORS[mi % TEAM_COLORS.length], color: '#fff',
                      fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid #fff', marginLeft: mi > 0 ? -6 : 0,
                    }}>{m[0]}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 3, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--ai)', borderRadius: 99, transition: 'width .3s' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, flexShrink: 0 }}>{p.progress}%</span>
              </div>
            </button>
          ))}
        </Card>

        {/* Product context — dark card */}
        <div style={{
          background: 'linear-gradient(150deg, #18181B 0%, #1C1C2E 50%, #1E1B2E 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Product Context</div>
          <div>
            <AiOrb size={32} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{profile.company} · Product</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.45)', marginTop: 5, lineHeight: 1.55 }}>Финтех для частных пользователей и SME. Мультивалютность, онбординг, API-экосистема.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {[
              { label: 'Проектов', value: projects.length },
              { label: 'Артефактов', value: artifacts.length },
              { label: 'Задач AI', value: 29 },
              { label: 'Участников', value: 6 },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 11px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.35)', marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Chats */}
        <Card title="Чаты" icon={<Clock size={13} color="var(--ink-3)" />}>
          {recentChats.length === 0 ? (
            <EmptyState icon="💬" text="Нет чатов. Начните новый!" />
          ) : (
            recentChats.map((c, i) => (
              <button
                key={c.id}
                onClick={() => onOpenChat(c.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: i < recentChats.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <TaskIcon taskId={c.ico} size={28} bg="var(--ai-lt)" color="var(--ai)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.when}</div>
                </div>
              </button>
            ))
          )}
        </Card>

        {/* Team artifacts */}
        <Card title="Артефакты команды" icon={<TrendingUp size={13} color="var(--ink-3)" />} action={{ label: 'Все →', onClick: onAllArtifacts }}>
          {recentArtifacts.length === 0 ? (
            <EmptyState icon="📄" text="Нет артефактов. Создайте первый!" />
          ) : (
            recentArtifacts.map((a, i) => {
              const avatarColor = TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 16px',
                  borderBottom: i < recentArtifacts.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: avatarColor, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{a.skillName} · {a.when}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, icon, action, children }: { title: string; icon?: React.ReactNode; action?: { label: string; onClick: () => void }; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>{title}</div>
        {action && <button onClick={action.onClick} style={{ fontSize: 12, color: 'var(--ai)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{action.label}</button>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ink-3)' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12.5 }}>{text}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'done' | 'draft' }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, flexShrink: 0,
      background: status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)',
      color: status === 'done' ? 'var(--green)' : 'var(--ai)',
    }}>{status === 'done' ? 'Готово' : 'Черновик'}</div>
  );
}
