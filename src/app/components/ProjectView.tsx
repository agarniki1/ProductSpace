import React, { useState } from 'react';
import { ArrowLeft, Plus, MessageSquare, FileText, Users, LayoutDashboard, CheckCircle2, Circle, Clock, Target, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react';
import { Project, Artifact, Task, Chat } from '../types';
import { TEAM_COLORS } from '../data';
import { TaskIcon } from './TaskIcon';

interface ProjectViewProps {
  project: Project;
  artifacts: Artifact[];
  tasks: Task[];
  chats: Chat[];
  onBack: () => void;
  onNewTask: () => void;
  onOpenChat: (id: string) => void;
  onNewChatInProject: () => void;
}

type Tab = 'dashboard' | 'team' | 'artifacts' | 'conclusions';

const CONCLUSION_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  done:        { label: 'Готово',          color: '#16A34A', bg: '#DCFCE7' },
  in_progress: { label: 'В работе',        color: '#2563EB', bg: '#DBEAFE' },
  planned:     { label: 'Запланировано',   color: '#D97706', bg: '#FEF3C7' },
};

export function ProjectView({ project, artifacts, tasks, chats, onBack, onNewTask, onOpenChat, onNewChatInProject }: ProjectViewProps) {
  const [tab, setTab] = useState<Tab>('dashboard');

  const projectArtifacts = artifacts.filter(a => a.projectId === project.id);
  const projectChats = chats.filter(c => c.projectId === project.id);
  const statusLabel = project.status === 'active' ? 'Активный' : project.status === 'planning' ? 'Планирование' : 'Архив';
  const statusColor = project.status === 'active' ? '#5de8a0' : project.status === 'planning' ? '#FCD34D' : '#A1A1AA';

  const milestones = project.milestones || [];
  const conclusions = project.conclusions || [];
  const teamMembers = project.teamMembers || project.members.map((m, i) => ({
    initials: m, name: m, role: 'Участник', color: TEAM_COLORS[i % TEAM_COLORS.length], contributions: 0, lastActive: '—',
  }));

  const doneMilestones = milestones.filter(m => m.done).length;
  const doneConclusions = conclusions.filter(c => c.status === 'done').length;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard',   label: 'Дашборд',                       icon: <LayoutDashboard size={14} /> },
    { id: 'team',        label: 'Команда',                       icon: <Users size={14} /> },
    { id: 'artifacts',   label: `Артефакты (${projectArtifacts.length})`, icon: <FileText size={14} /> },
    { id: 'conclusions', label: `Выводы (${conclusions.length})`, icon: <Target size={14} /> },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Back */}
      <div style={{ padding: '20px 36px 0' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 18, padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}>
          <ArrowLeft size={14} /> Назад к проектам
        </button>
      </div>

      {/* Project header */}
      <div style={{ margin: '0 36px' }}>
        <div style={{ background: 'linear-gradient(150deg, #18181B 0%, #1C1C2E 60%, #201830 100%)', padding: '24px 28px', color: '#fff', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>{project.product}</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-.02em', lineHeight: 1.1 }}>{project.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onNewChatInProject} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.15)', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={12} /> Новый чат
              </button>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: project.status === 'active' ? 'rgba(22,163,74,.25)' : 'rgba(255,255,255,.1)', color: statusColor }}>{statusLabel}</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.6, marginBottom: 12 }}>{project.goal}</div>
          {project.kpi && (
            <div style={{ marginBottom: 14, fontSize: 11.5, color: 'rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={12} /> {project.kpi}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${project.progress}%`, background: 'linear-gradient(90deg, #818CF8, #6366F1)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{project.progress}%</span>
            {project.startDate && <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{project.startDate} → {project.targetDate}</span>}
            <div style={{ display: 'flex' }}>
              {teamMembers.map((m, i) => (
                <div key={m.initials} style={{ width: 24, height: 24, borderRadius: '50%', background: m.color, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #18181B', marginLeft: i > 0 ? -7 : 0 }}>{m.initials}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', border: '1px solid var(--border)', borderTop: 'none' }}>
          {[
            { label: 'Артефактов', value: projectArtifacts.length, color: 'var(--ai)' },
            { label: 'Чатов', value: projectChats.length, color: '#7C3AED' },
            { label: `Вех ${doneMilestones}/${milestones.length}`, value: milestones.length > 0 ? `${Math.round(doneMilestones / milestones.length * 100)}%` : '—', color: '#16A34A' },
            { label: 'Выводов готово', value: doneConclusions, color: '#D97706' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '12px 18px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, padding: '0 36px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '11px 14px',
            fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
            color: tab === t.id ? 'var(--ai)' : 'var(--ink-3)',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t.id ? '2px solid var(--ai)' : '2px solid transparent',
            marginBottom: -1, transition: 'color .15s',
          }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 36px 40px' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Milestones */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
                <TrendingUp size={14} color="var(--ink-3)" />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>Вехи проекта</div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{doneMilestones}/{milestones.length}</span>
              </div>
              <div>
                {milestones.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: i < milestones.length - 1 ? '1px solid var(--border)' : 'none', opacity: m.done ? 0.65 : 1 }}>
                    {m.done ? <CheckCircle2 size={16} color="var(--green)" /> : <Circle size={16} color="var(--border-md)" />}
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: m.done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', flexShrink: 0 }}>{m.date}</div>
                  </div>
                ))}
                {milestones.length === 0 && <div style={{ padding: '28px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>Нет вех</div>}
              </div>
            </div>

            {/* Chats */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
                <MessageSquare size={14} color="var(--ink-3)" />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>Последние чаты</div>
                <button onClick={onNewChatInProject} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--ai)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={12} /> Новый</button>
              </div>
              {projectChats.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--ink-3)' }}>
                  <MessageSquare size={24} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                  <div style={{ fontSize: 13, marginBottom: 12 }}>Нет чатов</div>
                  <button onClick={onNewTask} style={{ padding: '7px 16px', background: 'var(--ai)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Выбрать задачу</button>
                </div>
              ) : projectChats.slice(0, 5).map((c, i) => (
                <button key={c.id} onClick={() => onOpenChat(c.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i < Math.min(4, projectChats.length - 1) ? '1px solid var(--border)' : 'none', transition: 'background .1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <TaskIcon taskId={c.ico} size={28} bg="var(--ai-lt)" color="var(--ai)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.when}</div>
                  </div>
                  <ChevronRight size={14} color="var(--ink-3)" />
                </button>
              ))}
            </div>

            {/* Recent artifacts full row */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', gridColumn: '1 / -1' }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
                <FileText size={14} color="var(--ink-3)" />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>Последние артефакты</div>
                <button onClick={() => setTab('artifacts')} style={{ fontSize: 12, color: 'var(--ai)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Все →</button>
              </div>
              {projectArtifacts.length === 0 ? (
                <div style={{ padding: '28px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>Нет артефактов — создайте первый через чат</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {projectArtifacts.slice(0, 3).map((a, i) => {
                    const ac = TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];
                    return (
                      <div key={a.id} style={{ padding: '14px 16px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <TaskIcon taskId={a.taskId} size={32} bg="var(--ai-lt)" color="var(--ai)" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{a.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8 }}>{a.skillName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 18, height: 18, borderRadius: '50%', background: ac, color: '#fff', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.initials}</div>
                              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{a.author.split(' ')[0]} · {a.when}</span>
                              <div style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 99, background: a.status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)', color: a.status === 'done' ? 'var(--green)' : 'var(--ai)' }}>{a.status === 'done' ? 'Готово' : 'Черновик'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM */}
        {tab === 'team' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 24 }}>
              {teamMembers.map(member => (
                <div key={member.initials} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: member.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{member.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{member.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{member.role}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ai)', fontFamily: 'var(--font-display)' }}>{member.contributions}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>артефактов</div>
                    </div>
                    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: member.lastActive === 'Сегодня' ? 'var(--green)' : 'var(--ink-3)' }} />
                        <div style={{ fontSize: 11, fontWeight: 600, color: member.lastActive === 'Сегодня' ? 'var(--green)' : 'var(--ink-3)' }}>{member.lastActive}</div>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>последняя активность</div>
                    </div>
                  </div>
                  {projectArtifacts.filter(a => a.initials === member.initials).slice(0, 2).map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                      <TaskIcon taskId={a.taskId} size={20} bg="var(--ai-lt)" color="var(--ai)" />
                      <div style={{ fontSize: 12, color: 'var(--ink-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Активность команды</div>
              </div>
              {projectArtifacts.length === 0 ? (
                <div style={{ padding: '28px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>Пока нет активности</div>
              ) : projectArtifacts.map((a, i) => {
                const ac = TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < projectArtifacts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: ac, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{a.author.split(' ')[0]}</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-3)' }}> создал </span>
                      <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{a.title}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', flexShrink: 0 }}>{a.when}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ARTIFACTS */}
        {tab === 'artifacts' && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 90px 80px', padding: '9px 18px', borderBottom: '1.5px solid var(--border-md)', background: 'var(--bg-subtle)' }}>
              {['Артефакт', 'Автор', 'Дата', 'Статус'].map(h => (
                <div key={h} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
              ))}
            </div>
            {projectArtifacts.length === 0 ? (
              <div style={{ padding: '52px', textAlign: 'center', color: 'var(--ink-3)' }}>
                <FileText size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                <div style={{ fontSize: 14, marginBottom: 14 }}>Нет артефактов по этому проекту</div>
                <button onClick={onNewChatInProject} style={{ padding: '8px 18px', background: 'var(--ai)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Создать первый</button>
              </div>
            ) : projectArtifacts.map((a, i) => {
              const ac = TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];
              return (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 90px 80px', padding: '11px 18px', alignItems: 'center', borderBottom: i < projectArtifacts.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-soft)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <TaskIcon taskId={a.taskId} size={30} bg="var(--ai-lt)" color="var(--ai)" />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{a.skillName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: ac, color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.initials}</div>
                    <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{a.author.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.when}</div>
                  <div style={{ display: 'inline-flex', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: a.status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)', color: a.status === 'done' ? 'var(--green)' : 'var(--ai)' }}>{a.status === 'done' ? 'Готово' : 'Черновик'}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONCLUSIONS */}
        {tab === 'conclusions' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Ключевые решения, инсайты и статус работы по проекту</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(CONCLUSION_STATUS).map(([key, val]) => (
                  <div key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 99, background: val.bg, fontSize: 11.5, fontWeight: 600, color: val.color }}>
                    {val.label}: {conclusions.filter(c => c.status === key).length}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {conclusions.map(c => {
                const s = CONCLUSION_STATUS[c.status];
                return (
                  <div key={c.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)', borderLeft: `3px solid ${s.color}`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 10 }}>{c.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: c.color, color: '#fff', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.initials}</div>
                        <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{c.author} · {c.when}</span>
                        <div style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {conclusions.length === 0 && (
                <div style={{ padding: '56px', textAlign: 'center', color: 'var(--ink-3)', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <Target size={28} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div style={{ fontSize: 14 }}>Нет выводов по проекту</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
