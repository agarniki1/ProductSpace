import React from 'react';
import { Home, Zap, FolderOpen, MessageSquare, Plus, MoreHorizontal, ChevronRight } from 'lucide-react';
import { View, Project, Chat, Profile } from '../types';
import { TaskIcon, TASK_ICONS } from './TaskIcon';

interface SidebarProps {
  currentView: View;
  currentProjectId: string | null;
  currentChatId: string | null;
  projects: Project[];
  chats: Chat[];
  profile: Profile;
  taskCount: number;
  onNav: (v: View) => void;
  onOpenProject: (id: string) => void;
  onOpenChat: (id: string) => void;
  onNewChat: () => void;
  onNewProject: () => void;
  onEditProfile: () => void;
}

const PROJECT_STATUS_COLOR: Record<string, string> = {
  active: '#22C55E',
  planning: '#F59E0B',
  archived: '#A1A1AA',
};

export function Sidebar({
  currentView, currentProjectId, currentChatId, projects, chats, profile,
  taskCount, onNav, onOpenProject, onOpenChat, onNewChat, onNewProject, onEditProfile,
}: SidebarProps) {
  const recentChats = chats.slice(0, 7);

  return (
    <aside style={{
      width: 'var(--sb-width)',
      height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* Brand */}
      <div style={{ padding: '15px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: [
              'radial-gradient(circle at 42% 36%,',
              '#BED4FF 0%, #6B96F5 22%, #5272EC 44%,',
              '#7060E8 66%, #9575E0 85%, #B49AE8 100%)',
            ].join(''),
            boxShadow: '0 2px 10px rgba(91,120,239,.4), inset 0 1px 1px rgba(255,255,255,.35)',
          }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-.015em', color: 'var(--ink)' }}>Product Space</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{profile.company}</div>
          </div>
        </div>
      </div>

      {/* New chat button — full width, prominent, with gap below */}
      <div style={{ padding: '0 12px 14px', flexShrink: 0 }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--ai)', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: 'none', transition: 'background .15s, box-shadow .15s',
            boxShadow: '0 2px 10px rgba(91,120,239,.32)',
            letterSpacing: '-.01em',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--ai-dk)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,120,239,.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--ai)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(91,120,239,.32)'; }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Новый чат
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 12px 10px', flexShrink: 0 }} />

      {/* Primary nav */}
      <div style={{ padding: '2px 10px 4px', flexShrink: 0 }}>
        <NavItem
          icon={<Home size={15} />}
          label="Главная"
          active={currentView === 'dashboard'}
          onClick={() => onNav('dashboard')}
        />

        {/* Tasks — hero item, more visual weight */}
        <button
          onClick={() => onNav('tasks')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 'var(--radius-md)', marginBottom: 1,
            background: currentView === 'tasks'
              ? 'linear-gradient(135deg, rgba(91,120,239,.15), rgba(112,96,232,.1))'
              : 'transparent',
            border: currentView === 'tasks' ? '1px solid rgba(91,120,239,.2)' : '1px solid transparent',
            cursor: 'pointer', textAlign: 'left', transition: 'all .12s',
          }}
          onMouseEnter={e => { if (currentView !== 'tasks') { e.currentTarget.style.background = 'rgba(24,24,27,.05)'; e.currentTarget.style.borderColor = 'transparent'; } }}
          onMouseLeave={e => { if (currentView !== 'tasks') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
            background: currentView === 'tasks' ? 'var(--ai)' : 'rgba(91,120,239,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .12s',
          }}>
            <Zap size={13} color={currentView === 'tasks' ? '#fff' : 'var(--ai)'} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: currentView === 'tasks' ? 700 : 600, color: currentView === 'tasks' ? 'var(--ai)' : 'var(--ink-2)', flex: 1 }}>
            Задачи
          </span>
          <span style={{
            fontSize: 10.5, fontWeight: 600, padding: '1px 7px', borderRadius: 99,
            background: currentView === 'tasks' ? 'var(--ai)' : 'rgba(91,120,239,.12)',
            color: currentView === 'tasks' ? '#fff' : 'var(--ai)',
          }}>{taskCount}</span>
        </button>

        <NavItem
          icon={<FolderOpen size={15} />}
          label="Артефакты"
          active={currentView === 'artifacts'}
          onClick={() => onNav('artifacts')}
        />
      </div>

      {/* Scrollable section */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px 0' }}>

        {/* Recent chats */}
        {recentChats.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionLabel>Недавние чаты</SectionLabel>
            {recentChats.map(c => (
              <button
                key={c.id}
                onClick={() => onOpenChat(c.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                  background: currentChatId === c.id ? 'rgba(91,120,239,.1)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .1s',
                }}
                onMouseEnter={e => { if (currentChatId !== c.id) e.currentTarget.style.background = 'rgba(24,24,27,.05)'; }}
                onMouseLeave={e => { if (currentChatId !== c.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {TASK_ICONS[c.ico]
                  ? <TaskIcon taskId={c.ico} size={18} bg="transparent" color={currentChatId === c.id ? 'var(--ai)' : 'var(--ink-3)'} style={{ borderRadius: 0 }} />
                  : <MessageSquare size={13} color={currentChatId === c.id ? 'var(--ai)' : 'var(--ink-3)'} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                }
                <span style={{
                  fontSize: 12.5, flex: 1, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  color: currentChatId === c.id ? 'var(--ai)' : 'var(--ink-2)',
                  fontWeight: currentChatId === c.id ? 500 : 400,
                }}>{c.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Projects */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 6px' }}>
            <SectionLabel style={{ padding: 0 }}>Проекты</SectionLabel>
            <button onClick={onNewProject} style={{ color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }} title="Новый проект">
              <Plus size={13} />
            </button>
          </div>
          {projects.map(p => {
            const active = currentView === 'project' && currentProjectId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onOpenProject(p.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                  background: active ? 'rgba(91,120,239,.1)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .1s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(24,24,27,.05)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                  background: PROJECT_STATUS_COLOR[p.status] || 'var(--ink-3)',
                  boxShadow: p.status === 'active' ? '0 0 0 2.5px rgba(34,197,94,.18)' : 'none',
                }} />
                <span style={{
                  fontSize: 12.5, flex: 1, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  color: active ? 'var(--ai)' : 'var(--ink-2)', fontWeight: active ? 500 : 400,
                }}>{p.name}</span>
                {p.chats > 0 && (
                  <span style={{ fontSize: 10.5, color: 'var(--ink-3)', background: 'rgba(24,24,27,.06)', padding: '1px 5px', borderRadius: 99, flexShrink: 0 }}>{p.chats}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile footer */}
      <button
        onClick={onEditProfile}
        style={{
          padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', background: 'none', border: 'none',
          borderTop: '1px solid var(--border)', width: '100%', textAlign: 'left',
          transition: 'background .1s', flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,24,27,.04)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: profile.color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, position: 'relative',
        }}>
          {profile.initials}
          <div style={{
            position: 'absolute', bottom: -1, right: -1, width: 8, height: 8,
            borderRadius: '50%', background: '#22C55E', border: '2px solid var(--sidebar-bg)',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.role}</div>
        </div>
        <MoreHorizontal size={14} color="var(--ink-3)" />
      </button>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean;
  onClick: () => void; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderRadius: 'var(--radius-md)', marginBottom: 1,
        background: active ? 'rgba(91,120,239,.1)' : 'transparent',
        border: '1px solid transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'background .1s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(24,24,27,.05)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(91,120,239,.1)' : 'transparent'; }}
    >
      <span style={{ color: active ? 'var(--ai)' : 'var(--ink-3)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ai)' : 'var(--ink-2)', flex: 1 }}>{label}</span>
      {badge !== undefined && (
        <span style={{ fontSize: 10.5, color: 'var(--ink-3)', background: 'rgba(24,24,27,.06)', padding: '1px 6px', borderRadius: 99 }}>{badge}</span>
      )}
    </button>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.07em', padding: '0 8px', marginBottom: 4, ...style }}>
      {children}
    </div>
  );
}
