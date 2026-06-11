import React, { useMemo } from 'react';
import {
  Home,
  Zap,
  FolderOpen,
  MessageSquare,
  Plus,
  MoreHorizontal,
  History,
} from 'lucide-react';
import { View, Project, Chat, Profile } from '../types';
import { TaskIcon, TASK_ICONS } from './TaskIcon';
import { AiOrb } from './AiOrb';

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
  active: '#4E8E5A',
  planning: '#B88A3B',
  archived: '#A6A29A',
};

const SIDEBAR_BG = '#f5f1eb';
const SURFACE_ACTIVE = 'rgba(255,255,255,0.88)';
const BORDER = 'rgba(20,24,34,0.065)';
const BORDER_SOFT = 'rgba(20,24,34,0.055)';
const BRAND_SURFACE =
  'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.62) 100%)';
const BRAND_BORDER = 'rgba(20,24,34,0.06)';
const PROFILE_AVATAR_BG = '#8F8A83';

export function Sidebar({
  currentView,
  currentProjectId,
  currentChatId,
  projects,
  chats,
  profile,
  taskCount,
  onNav,
  onOpenProject,
  onOpenChat,
  onNewChat,
  onNewProject,
  onEditProfile,
}: SidebarProps) {
  const recentChats = useMemo(() => chats.slice(0, 7), [chats]);

  return (
    <aside
      style={{
        width: 'var(--sb-width)',
        height: '100vh',
        padding: '12px 10px 12px 12px',
        background: SIDEBAR_BG,
        borderRight: '1px solid rgba(20,24,34,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      <div style={{ padding: '2px 4px 0', flexShrink: 0, minWidth: 0 }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 12px',
            borderRadius: 18,
            border: `1px solid ${BRAND_BORDER}`,
            background: BRAND_SURFACE,
            boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              flexShrink: 0,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(20,24,34,0.055)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 2px rgba(20,24,34,0.04)',
            }}
          >
            <AiOrb size={20} style={{ opacity: 1 }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '-0.018em',
                color: 'var(--ink)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Product Space
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'rgba(20,24,34,0.56)',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.25,
              }}
            >
              Revolut
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 4px 10px', flexShrink: 0 }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            padding: '0 12px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.42)',
            color: 'var(--ink)',
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            border: `1px solid ${BORDER}`,
            cursor: 'pointer',
            boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset',
            transition: 'background .14s ease, border-color .14s ease, color .14s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.62)';
            e.currentTarget.style.borderColor = 'rgba(20,24,34,0.08)';
            e.currentTarget.style.color = 'var(--ink)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.42)';
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.color = 'var(--ink)';
          }}
        >
          <Plus size={14} strokeWidth={2.1} />
          Новый чат
        </button>
      </div>

      <div
        style={{
          height: 1,
          background: 'rgba(20,24,34,0.055)',
          margin: '0 6px 10px',
          flexShrink: 0,
        }}
      />

      <div style={{ padding: '0 4px 6px', flexShrink: 0, minWidth: 0 }}>
        <NavItem
          icon={<Home size={15} strokeWidth={1.9} />}
          label="Главная"
          active={currentView === 'dashboard'}
          onClick={() => onNav('dashboard')}
        />

        <NavItem
          icon={<Zap size={15} strokeWidth={1.9} />}
          label="Задачи"
          active={currentView === 'tasks'}
          badge={taskCount}
          onClick={() => onNav('tasks')}
        />

        <NavItem
          icon={<FolderOpen size={15} strokeWidth={1.9} />}
          label="Артефакты"
          active={currentView === 'artifacts'}
          onClick={() => onNav('artifacts')}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 4px 0',
          minWidth: 0,
        }}
      >
        <div style={{ marginBottom: 18, minWidth: 0 }}>
          <SectionHeader
            label="Проекты"
            onAdd={onNewProject}
            addTitle="Новый проект"
          />

          <div style={{ display: 'grid', gap: 3, minWidth: 0 }}>
            {projects.map(p => {
              const active =
                currentView === 'project' && currentProjectId === p.id;

              return (
                <ListRowButton
                  key={p.id}
                  active={active}
                  onClick={() => onOpenProject(p.id)}
                  title={p.name}
                  leading={
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background:
                          PROJECT_STATUS_COLOR[p.status] || 'var(--ink-3)',
                      }}
                    />
                  }
                  trailing={
                    p.chats > 0 ? (
                      <span
                        style={{
                          flexShrink: 0,
                          fontSize: 10.5,
                          lineHeight: 1.2,
                          color: active ? 'var(--ink)' : 'var(--ink-3)',
                          background: active
                            ? 'rgba(20,24,34,0.06)'
                            : 'rgba(20,24,34,0.04)',
                          padding: '2px 6px',
                          borderRadius: 999,
                        }}
                      >
                        {p.chats}
                      </span>
                    ) : null
                  }
                >
                  {p.name}
                </ListRowButton>
              );
            })}
          </div>
        </div>

        {recentChats.length > 0 && (
          <div style={{ marginBottom: 12, minWidth: 0 }}>
            <SectionHeader
              label="Недавние чаты"
              onAdd={onNewChat}
              addTitle="Новый чат"
            />

            <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
              {recentChats.map(chat => {
                const active = currentChatId === chat.id;
                const hasTaskIcon = Boolean(TASK_ICONS[chat.ico]);
                const cleanTitle = buildRecentChatTitle(chat);

                return (
                  <RecentChatRow
                    key={chat.id}
                    active={active}
                    title={cleanTitle}
                    when={chat.when}
                    onClick={() => onOpenChat(chat.id)}
                    leading={
                      hasTaskIcon ? (
                        <TaskIcon
                          taskId={chat.ico}
                          size={16}
                          bg="transparent"
                          color={active ? 'var(--ink)' : 'var(--ink-3)'}
                          style={{ borderRadius: 0, flexShrink: 0 }}
                        />
                      ) : (
                        <MessageSquare
                          size={13}
                          color={active ? 'var(--ink)' : 'var(--ink-3)'}
                          strokeWidth={1.75}
                          style={{ flexShrink: 0 }}
                        />
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        <div style={{ padding: '2px 4px 0', marginBottom: 4 }}>
          <button
            onClick={() => onNav('chats')}
            style={{
              width: '100%',
              minHeight: 34,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '0 10px',
              borderRadius: 12,
              background: 'transparent',
              border: `1px solid ${BORDER_SOFT}`,
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--ink-2)',
              transition: 'background .14s ease, border-color .14s ease, color .14s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.borderColor = BORDER;
              e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = BORDER_SOFT;
              e.currentTarget.style.color = 'var(--ink-2)';
            }}
          >
            <History size={14} strokeWidth={1.9} />
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              История
            </span>
          </button>
        </div>
      </div>

      <div style={{ padding: '10px 4px 2px', flexShrink: 0, minWidth: 0 }}>
        <div
          style={{
            borderTop: '1px solid rgba(20,24,34,0.055)',
            paddingTop: 10,
          }}
        >
          <button
            type="button"
            onClick={onEditProfile}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 10px',
              border: `1px solid ${BORDER_SOFT}`,
              borderRadius: 14,
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: 0,
              transition: 'background .14s ease, border-color .14s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.56)';
              e.currentTarget.style.borderColor = BORDER;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = BORDER_SOFT;
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                flexShrink: 0,
                background: PROFILE_AVATAR_BG,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                position: 'relative',
              }}
            >
              {profile.initials}
              <div
                style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4E8E5A',
                  border: `2px solid ${SIDEBAR_BG}`,
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {profile.name}
                </div>

                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '.03em',
                    color: 'var(--ink-2)',
                    background: 'rgba(20,24,34,0.06)',
                    border: '1px solid rgba(20,24,34,0.06)',
                    padding: '2px 6px',
                    borderRadius: 999,
                    lineHeight: 1.1,
                  }}
                >
                  Pro
                </span>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: 'var(--ink-3)',
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile.role}
              </div>
            </div>

            <MoreHorizontal
              size={14}
              color="var(--ink-3)"
              style={{ flexShrink: 0 }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 36,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '0 10px',
        borderRadius: 12,
        marginBottom: 2,
        background: active ? SURFACE_ACTIVE : 'transparent',
        border: active ? `1px solid ${BORDER}` : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background .14s ease, border-color .14s ease',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.44)';
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span
        style={{
          display: 'flex',
          color: active ? 'var(--ink)' : 'var(--ink-3)',
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? 'var(--ink)' : 'var(--ink-2)',
        }}
      >
        {label}
      </span>

      {badge !== undefined && (
        <span
          style={{
            flexShrink: 0,
            fontSize: 10.5,
            lineHeight: 1.2,
            color: active ? 'var(--ink)' : 'var(--ink-3)',
            background: active
              ? 'rgba(20,24,34,0.06)'
              : 'rgba(20,24,34,0.04)',
            padding: '2px 6px',
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function RecentChatRow({
  active,
  onClick,
  leading,
  title,
  when,
}: {
  active: boolean;
  onClick: () => void;
  leading: React.ReactNode;
  title: string;
  when?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 8px',
        borderRadius: 14,
        background: active ? SURFACE_ACTIVE : 'transparent',
        border: active ? `1px solid ${BORDER}` : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background .14s ease, border-color .14s ease',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.46)';
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span
        style={{
          width: 18,
          minWidth: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? 'var(--ink)' : 'var(--ink-3)',
          flexShrink: 0,
        }}
      >
        {leading}
      </span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 12.5,
            color: active ? 'var(--ink)' : 'var(--ink-2)',
            fontWeight: active ? 600 : 500,
            lineHeight: 1.35,
          }}
        >
          {title}
        </span>

        {when ? (
          <span
            style={{
              flexShrink: 0,
              fontSize: 10.5,
              color: active ? 'var(--ink-2)' : 'var(--ink-3)',
              lineHeight: 1.2,
            }}
          >
            {when}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function ListRowButton({
  active,
  onClick,
  leading,
  trailing,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  leading: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '100%',
        minHeight: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 12,
        background: active ? SURFACE_ACTIVE : 'transparent',
        border: active ? `1px solid ${BORDER}` : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background .14s ease, border-color .14s ease',
        minWidth: 0,
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.44)';
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: active ? 'var(--ink)' : 'var(--ink-3)',
        }}
      >
        {leading}
      </span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: 12.5,
          color: active ? 'var(--ink)' : 'var(--ink-2)',
          fontWeight: active ? 500 : 400,
        }}
      >
        {children}
      </span>

      {trailing ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            marginLeft: 6,
          }}
        >
          {trailing}
        </span>
      ) : null}
    </button>
  );
}

function SectionHeader({
  label,
  onAdd,
  addTitle,
}: {
  label: string;
  onAdd: () => void;
  addTitle: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '0 8px 6px',
        minWidth: 0,
      }}
    >
      <SectionLabel style={{ padding: 0, marginBottom: 0 }}>
        {label}
      </SectionLabel>

      <button
        onClick={onAdd}
        title={addTitle}
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          border: 'none',
          background: 'transparent',
          color: 'var(--ink-3)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background .14s ease, color .14s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
          e.currentTarget.style.color = 'var(--ink)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--ink-3)';
        }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--ink-3)',
        textTransform: 'uppercase',
        letterSpacing: '.06em',
        padding: '0 8px',
        marginBottom: 6,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function buildRecentChatTitle(chat: Chat): string {
  const raw = typeof chat.title === 'string' ? chat.title.trim() : '';

  if (!raw) return 'Новый чат';

  let title = raw
    .replace(/^\[[^\]]+\]\s*/i, '')
    .replace(/^Проект:\s*/i, '')
    .replace(/^Project:\s*/i, '')
    .replace(/^Тема:\s*/i, '')
    .replace(/^Theme:\s*/i, '')
    .replace(/\s+[—-]\s+(Проект|Project|Тема|Theme)\s*:?.*$/i, '')
    .replace(/\s+\|\s+(Проект|Project|Тема|Theme)\s*:?.*$/i, '')
    .trim();

  if (!title) return 'Новый чат';

  return title.length > 42 ? `${title.slice(0, 42)}…` : title;
}