import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, AppState, Chat, Message, Toast, Profile, Artifact } from './types';
import {
  INITIAL_PROJECTS,
  ALL_TASKS,
  HERO_TASKS,
  DEFAULT_PROFILE,
  uid,
  demoDoc,
  deriveTitle,
  freeReply,
  buildSeedData,
} from './data';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskLibrary } from './components/TaskLibrary';
import { ProjectView } from './components/ProjectView';
import { ArtifactsView } from './components/ArtifactsView';
import { PrivateWorkspace } from './components/PrivateWorkspace';
import { ArtifactStyles } from './components/ArtifactStyles';

function buildInitialState(): AppState {
  const { chats: chats1, artifacts: arts1 } = buildSeedData('rev-card', 'Debit card DACH', [
    { taskId: 'gtm', brief: 'GTM-стратегия для запуска дебетовой карты в Германии', author: 'Алексей Романов', initials: 'AR', color: '#FF631F', daysAgo: 5 },
    { taskId: 'prd', brief: 'PRD: дебетовая карта DACH, локализация и лимиты', author: 'Дмитрий Соколов', initials: 'DS', color: '#2D6CDF', daysAgo: 3 },
    { taskId: 'competitive', brief: 'Конкурентный анализ: N26, Bunq, Wise в DACH', author: 'Паша Морозов', initials: 'PM', color: '#0D8A8A', daysAgo: 1 },
  ]);

  const { chats: chats2, artifacts: arts2 } = buildSeedData('onboarding-v2', 'Onboarding v2', [
    { taskId: 'jtbd', brief: 'JTBD-карта для нового онбординга: сегмент freelance', author: 'Алексей Мосин', initials: 'AM', color: '#B0299A', daysAgo: 7 },
    { taskId: 'metrics', brief: 'Tracking plan: ключевые события онбординга v2', author: 'Тимур Ли', initials: 'TL', color: '#2F9E6B', daysAgo: 4 },
    { taskId: 'abtest', brief: 'A/B тест: новый экран Welcome vs старый', author: 'Дмитрий Соколов', initials: 'DS', color: '#2D6CDF', daysAgo: 2 },
    { taskId: 'proto-mobile', brief: 'Прототип экрана Welcome — новый онбординг', author: 'Алексей Мосин', initials: 'AM', color: '#B0299A', daysAgo: 1 },
  ]);

  const projects = INITIAL_PROJECTS.map(p => ({
    ...p,
    chats: p.id === 'rev-card' ? chats1.length : p.id === 'onboarding-v2' ? chats2.length : p.chats,
  }));

  return {
    currentView: 'chat',
    currentProjectId: null,
    currentChatId: null,
    projects,
    tasks: ALL_TASKS,
    chats: [...chats1, ...chats2],
    artifacts: [...arts1, ...arts2],
    armedTaskId: null,
    armedTaskIds: [],
    taskFilter: 'all',
    taskQuery: '',
    sidebarOpen: false,
    profile: DEFAULT_PROFILE,
    overlay: null,
    expandedArtifactId: null,
    toasts: [],
    recentTaskIds: ['prd', 'gtm', 'metrics'],
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(buildInitialState);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const update = (patch: Partial<AppState>) =>
    setState(prev => ({ ...prev, ...patch }));

  const showToast = useCallback((text: string, kind: Toast['kind'] = 'success') => {
    const id = uid();
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, text, kind }] }));
    const t = setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
      toastTimers.current.delete(id);
    }, 3200);
    toastTimers.current.set(id, t);
  }, []);

  const goView = useCallback((view: View) => {
    update({ currentView: view, sidebarOpen: false });
  }, []);

  const openProject = useCallback((id: string) => {
    update({ currentView: 'project', currentProjectId: id, sidebarOpen: false });
  }, []);

  const armTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      armedTaskId: id,
      armedTaskIds: prev.armedTaskIds.includes(id) ? prev.armedTaskIds : [...prev.armedTaskIds, id],
      currentView: 'chat',
      sidebarOpen: false,
      recentTaskIds: [id, ...prev.recentTaskIds.filter(r => r !== id)].slice(0, 5),
    }));
  }, []);

  const disarmOne = useCallback((id: string) => {
    setState(prev => {
      const next = prev.armedTaskIds.filter(x => x !== id);
      return { ...prev, armedTaskIds: next, armedTaskId: next[0] || null };
    });
  }, []);

  const disarm = useCallback(() => update({ armedTaskId: null, armedTaskIds: [] }), []);

  const openChat = useCallback((id: string) => {
    setState(prev => {
      const chat = prev.chats.find(c => c.id === id) || null;
      return {
        ...prev,
        currentChatId: id,
        currentProjectId: chat?.projectId || null,
        currentView: 'chat',
        sidebarOpen: false,
      };
    });
  }, []);

  const newChat = useCallback(() => {
    update({
      currentChatId: null,
      currentProjectId: null,
      currentView: 'chat',
      armedTaskId: null,
      armedTaskIds: [],
      sidebarOpen: false,
    });
  }, []);

  const newChatInProject = useCallback((projectId: string) => {
    update({
      currentProjectId: projectId,
      currentChatId: null,
      currentView: 'chat',
      armedTaskId: null,
      armedTaskIds: [],
      sidebarOpen: false,
    });
  }, []);

  const newProject = useCallback(() => update({ overlay: 'newProject' }), []);
  const editProfile = useCallback(() => update({ overlay: 'profile' }), []);
  const closeOverlay = useCallback(() => update({ overlay: null, expandedArtifactId: null }), []);

  const expandArtifact = useCallback((id: string) => {
    update({ overlay: 'artifactExpand', expandedArtifactId: id });
  }, []);

  const sendMessage = useCallback((text: string, taskIds: string[]) => {
    setState(prev => {
      let chatId = prev.currentChatId;
      let chats = [...prev.chats];
      const firstTask = taskIds.length > 0 ? prev.tasks.find(t => t.id === taskIds[0]) : null;
      const chatTitle = taskIds.length > 1
        ? taskIds
            .map(id => prev.tasks.find(t => t.id === id)?.name?.split('/')[0].trim())
            .filter(Boolean)
            .join(' + ')
        : (firstTask?.name || text.slice(0, 42));

      if (!chatId || !chats.find(c => c.id === chatId)) {
        const newChat: Chat = {
          id: uid(),
          title: chatTitle,
          ico: firstTask?.ico || 'prd',
          projectId: prev.currentProjectId,
          when: 'Сегодня',
          messages: [],
        };
        chatId = newChat.id;
        chats = [newChat, ...chats];
      }

      const chatIdx = chats.findIndex(c => c.id === chatId);
      const chat = { ...chats[chatIdx], messages: [...chats[chatIdx].messages] };
      chat.messages.push({ id: uid(), role: 'user', text, taskId: taskIds[0] || undefined });
      chat.messages.push({ id: uid(), role: 'thinking' });
      chats[chatIdx] = chat;

      return {
        ...prev,
        chats,
        currentChatId: chatId,
        armedTaskId: null,
        armedTaskIds: [],
      };
    });

    const delay = taskIds.length > 0 ? 1100 : 700;
    setTimeout(() => {
      setState(prev => {
        const chatId = prev.currentChatId;
        if (!chatId) return prev;
        const chats = [...prev.chats];
        const chatIdx = chats.findIndex(c => c.id === chatId);
        if (chatIdx === -1) return prev;
        const chat = { ...chats[chatIdx], messages: [...chats[chatIdx].messages] };

        const thinkIdx = [...chat.messages].reverse().findIndex(m => m.role === 'thinking');
        if (thinkIdx !== -1) chat.messages.splice(chat.messages.length - 1 - thinkIdx, 1);

        const newArtifacts: Artifact[] = [];

        if (taskIds.length > 0) {
          for (const taskId of taskIds) {
            const artId = uid();
            const title = deriveTitle(taskId, text, prev.tasks);
            const html = demoDoc(taskId, text);
            const artMsg: Message = {
              id: artId,
              role: 'assistant',
              type: 'artifact',
              taskId,
              title,
              docHtml: html,
            };
            chat.messages.push(artMsg);
            newArtifacts.push({
              id: artId,
              title,
              taskId,
              skillName: prev.tasks.find(t => t.id === taskId)?.name || '',
              status: 'draft',
              projectName: prev.projects.find(p => p.id === prev.currentProjectId)?.name || null,
              projectId: prev.currentProjectId,
              author: prev.profile.name,
              initials: prev.profile.initials,
              when: 'Сегодня',
              chatId,
            });
          }
        } else {
          const replyText = freeReply(text);
          chat.messages.push({ id: uid(), role: 'assistant', type: 'text', text: replyText });
        }

        chats[chatIdx] = chat;

        return {
          ...prev,
          chats,
          artifacts: newArtifacts.length > 0 ? [...newArtifacts, ...prev.artifacts] : prev.artifacts,
        };
      });
    }, delay);
  }, []);

  const attachToProject = useCallback((artifactId: string) => {
    setState(prev => {
      const project = prev.projects.find(p => p.status === 'active') || prev.projects[0];
      return {
        ...prev,
        artifacts: prev.artifacts.map(a =>
          a.id === artifactId
            ? { ...a, projectName: project.name, projectId: project.id, status: 'done' as const }
            : a
        ),
      };
    });
    showToast('Артефакт прикреплён к проекту', 'success');
  }, [showToast]);

  const shareToTeam = useCallback((artifactId: string) => {
    setState(prev => ({
      ...prev,
      artifacts: prev.artifacts.map(a =>
        a.id === artifactId ? { ...a, status: 'done' as const } : a
      ),
    }));
    showToast('Поделились с командой', 'success');
  }, [showToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeOverlay]);

  const currentChat = state.chats.find(c => c.id === state.currentChatId) || null;
  const currentProject = state.projects.find(p => p.id === state.currentProjectId) || null;

  let expandedArtHtml: string | null = null;
  let expandedArtTitle: string | null = null;
  if (state.expandedArtifactId) {
    const eid = state.expandedArtifactId;
    for (const chat of state.chats) {
      const msg = chat.messages.find(m => m.id === eid && m.type === 'artifact');
      if (msg) {
        expandedArtHtml = msg.docHtml || null;
        expandedArtTitle = msg.title || null;
        break;
      }
    }
  }

  return (
    <>
      <ArtifactStyles />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'var(--sb-width) 1fr',
          height: '100vh',
          background: 'var(--bg-soft)',
          overflow: 'hidden',
        }}
      >
        <Sidebar
          currentView={state.currentView}
          currentProjectId={state.currentProjectId}
          currentChatId={state.currentChatId}
          projects={state.projects}
          chats={state.chats}
          profile={state.profile}
          taskCount={state.tasks.length}
          onNav={goView}
          onOpenProject={openProject}
          onOpenChat={openChat}
          onNewChat={newChat}
          onNewProject={newProject}
          onEditProfile={editProfile}
        />

        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--bg-soft)',
          }}
        >
          <TopBar state={state} />

          <div
            style={{
              flex: 1,
              overflow: state.currentView === 'chat' ? 'hidden' : 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {state.currentView === 'dashboard' && (
              <Dashboard
                projects={state.projects}
                tasks={state.tasks}
                artifacts={state.artifacts}
                chats={state.chats}
                profile={state.profile}
                onNewTask={() => goView('tasks')}
                onOpenProject={openProject}
                onArmTask={armTask}
                onAllArtifacts={() => goView('artifacts')}
                onNewProject={newProject}
                onOpenChat={openChat}
                onOpenProfile={editProfile}
              />
            )}

            {state.currentView === 'tasks' && (
              <TaskLibrary
                tasks={state.tasks}
                recentTaskIds={state.recentTaskIds}
                onArmTask={armTask}
              />
            )}

            {state.currentView === 'project' && currentProject && (
              <ProjectView
                project={currentProject}
                artifacts={state.artifacts}
                tasks={state.tasks}
                chats={state.chats}
                onBack={() => goView('dashboard')}
                onNewTask={() => newChatInProject(currentProject.id)}
                onOpenChat={openChat}
                onNewChatInProject={() => newChatInProject(currentProject.id)}
              />
            )}

            {state.currentView === 'artifacts' && (
              <ArtifactsView
                artifacts={state.artifacts}
                tasks={state.tasks}
                projects={state.projects}
                onExpandArtifact={expandArtifact}
              />
            )}

            {state.currentView === 'chat' && (
              <PrivateWorkspace
                chat={currentChat}
                tasks={state.tasks}
                projects={state.projects}
                currentProjectId={state.currentProjectId}
                armedTaskIds={state.armedTaskIds}
                heroTaskIds={HERO_TASKS}
                onSend={sendMessage}
                onDisarm={disarm}
                onDisarmOne={disarmOne}
                onOpenTaskLibrary={() => goView('tasks')}
                onArmTask={armTask}
                onAttachToProject={attachToProject}
                onShareToTeam={shareToTeam}
                onExpandArtifact={expandArtifact}
              />
            )}
          </div>
        </main>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {state.toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: 'rgba(28,29,32,0.94)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 14,
              fontSize: 12.5,
              fontWeight: 500,
              boxShadow: '0 14px 38px rgba(20,24,34,.14)',
              animation: 'rise .2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(255,255,255,.06)',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: t.kind === 'success' ? 'var(--green)' : 'var(--ai)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                flexShrink: 0,
                color: '#fff',
              }}
            >
              {t.kind === 'success' ? '✓' : 'i'}
            </div>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {state.overlay === 'newProject' && (
        <Modal onClose={closeOverlay} title="Новый проект">
          <NewProjectForm
            onSave={(name, product, goal) => {
              const p = {
                id: uid(),
                name,
                product,
                status: 'planning' as const,
                goal,
                progress: 0,
                members: [state.profile.initials],
                chats: 0,
              };
              setState(prev => ({ ...prev, projects: [...prev.projects, p], overlay: null }));
              showToast('Проект создан');
            }}
            onCancel={closeOverlay}
          />
        </Modal>
      )}

      {state.overlay === 'profile' && (
        <Modal onClose={closeOverlay} title="Company Brief">
          <CompanyBriefForm
            profile={state.profile}
            onSave={(prof) => {
              setState(prev => ({
                ...prev,
                profile: {
                  ...prev.profile,
                  ...prof,
                },
                overlay: null,
              }));
              showToast('Бриф компании обновлён');
            }}
            onCancel={closeOverlay}
          />
        </Modal>
      )}

      {state.overlay === 'artifactExpand' && expandedArtHtml && (
        <Modal onClose={closeOverlay} title={expandedArtTitle || 'Артефакт'} wide>
          <div
            style={{
              width: '100%',
              maxWidth: 760,
              margin: '0 auto',
            }}
          >
            <div
              className="doc"
              style={{ padding: '2px 0 8px' }}
              dangerouslySetInnerHTML={{ __html: expandedArtHtml }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

function TopBar({ state }: { state: AppState }) {
  const { currentView, currentProjectId, currentChatId, projects, chats } = state;

  let title: React.ReactNode;
  if (currentView === 'dashboard') {
    title = <>Главная</>;
  } else if (currentView === 'tasks') {
    title = <>Библиотека</>;
  } else if (currentView === 'artifacts') {
    title = <>Артефакты</>;
  } else if (currentView === 'chat') {
    const chat = chats.find(c => c.id === currentChatId);

    if (!chat && currentProjectId) {
      const p = projects.find(x => x.id === currentProjectId);
      title = (
        <>
          <Dim>Проект</Dim>
          <span style={{ color: 'rgba(20,24,34,0.22)' }}>·</span>
          <span>{p?.name || 'Проект'}</span>
          <span style={{ color: 'rgba(20,24,34,0.22)' }}>·</span>
          <span>Новый чат</span>
        </>
      );
    } else {
      title = chat?.projectId ? (
        <>
          <Dim>Проект</Dim>
          <span style={{ color: 'rgba(20,24,34,0.22)' }}>·</span>
          <span>{projects.find(p => p.id === chat.projectId)?.name || 'Проект'}</span>
          <span style={{ color: 'rgba(20,24,34,0.22)' }}>·</span>
          <span>{chat?.title || 'Новый чат'}</span>
        </>
      ) : (
        <>{chat?.title || 'Новый чат'}</>
      );
    }
  } else if (currentView === 'project') {
    const p = projects.find(x => x.id === currentProjectId);
    title = (
      <>
        <Dim>Проект</Dim>
        <span style={{ color: 'rgba(20,24,34,0.22)' }}>·</span>
        <span>{p?.name}</span>
      </>
    );
  } else {
    title = <>Главная</>;
  }

  return (
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        borderBottom: '1px solid rgba(20,24,34,0.06)',
        flexShrink: 0,
        background: 'rgba(248,246,242,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          minWidth: 0,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--ink)',
            letterSpacing: '-.01em',
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function Dim({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        color: 'var(--ink-3)',
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function CompanyBriefForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  onCancel: () => void;
}) {
  const extended = profile as Profile & {
    bio?: string;
    prompt?: string;
    audience?: string;
    markets?: string;
    goals?: string;
    products?: string;
  };

  const [form, setForm] = useState(() => ({
    ...profile,
    bio: extended.bio || '',
    prompt: extended.prompt || '',
    audience: extended.audience || 'Retail customers, freelancers, SME',
    markets: extended.markets || 'UK, EEA, US, Australia, Japan, Singapore',
    goals: extended.goals || 'Рост активации, spend, retention и cross-sell',
    products: extended.products || 'Debit cards, onboarding, rewards, cashback, business spend',
  }));

  const setField =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(20,24,34,0.10)',
    borderRadius: 12,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-ui)',
    background: 'rgba(255,255,255,0.96)',
    color: 'var(--ink)',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: 92,
    lineHeight: 1.55,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--ink-2)',
    marginBottom: 6,
    display: 'block',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '14px',
    borderRadius: 16,
    border: '1px solid rgba(20,24,34,0.06)',
    background: 'rgba(255,255,255,0.72)',
  };

  const helperStyle: React.CSSProperties = {
    fontSize: 11.5,
    color: 'var(--ink-3)',
    lineHeight: 1.5,
    marginTop: 5,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '2px 2px 6px',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: form.color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {form.initials}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {form.company || 'Компания не указана'}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--ink-3)',
              marginTop: 4,
              lineHeight: 1.45,
            }}
          >
            Продуктовый контекст для AI: кто вы, для кого строите продукт и какие задачи решаете.
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Компания</label>
          <input
            style={inputStyle}
            value={form.company}
            onChange={setField('company')}
            placeholder="Например: Revolut"
          />
        </div>

        <div>
          <label style={labelStyle}>Владелец / роль</label>
          <input
            style={inputStyle}
            value={form.role}
            onChange={setField('role')}
            placeholder="Например: Senior Product Manager"
          />
        </div>

        <div>
          <label style={labelStyle}>Короткий контекст компании</label>
          <textarea
            style={textareaStyle}
            value={form.bio}
            onChange={setField('bio')}
            placeholder="Коротко опиши компанию, стадию, фокус, тип бизнеса и важный контекст, который AI должен помнить."
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Целевая аудитория</label>
          <textarea
            style={textareaStyle}
            value={form.audience}
            onChange={setField('audience')}
            placeholder="Retail customers, freelancers, SME..."
          />
        </div>

        <div>
          <label style={labelStyle}>Рынки / страны</label>
          <textarea
            style={textareaStyle}
            value={form.markets}
            onChange={setField('markets')}
            placeholder="UK, EEA, US, Australia..."
          />
        </div>

        <div>
          <label style={labelStyle}>Бизнес-цели</label>
          <textarea
            style={textareaStyle}
            value={form.goals}
            onChange={setField('goals')}
            placeholder="Рост активации, retention, spend, conversion..."
          />
        </div>

        <div>
          <label style={labelStyle}>Ключевые продукты / направления</label>
          <textarea
            style={textareaStyle}
            value={form.products}
            onChange={setField('products')}
            placeholder="Debit cards, onboarding, rewards, cashback..."
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div>
          <label style={labelStyle}>Инструкции для AI</label>
          <textarea
            style={textareaStyle}
            value={form.prompt}
            onChange={setField('prompt')}
            placeholder="Например: учитывай fintech-контекст, пиши кратко, выделяй риски, предлагай решения на уровне PM / strategy / GTM."
          />
          <div style={helperStyle}>
            Этот текст можно использовать как устойчивый контекст для генерации PRD, исследований, GTM и других артефактов.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          marginTop: 2,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: '9px 18px',
            borderRadius: 10,
            border: '1px solid rgba(20,24,34,0.10)',
            background: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--ink-2)',
          }}
        >
          Отмена
        </button>

        <button
          onClick={() => onSave(form as Profile)}
          style={{
            padding: '9px 20px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--ink)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Сохранить бриф
        </button>
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const frame = requestAnimationFrame(() => {
      const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>('[data-modal-close]');
      closeBtn?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(31,28,24,0.18)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wide ? '20px' : '28px',
      }}
    >
      <div
        ref={panelRef}
        style={{
          width: '100%',
          maxWidth: wide ? 1040 : 620,
          maxHeight: 'min(88vh, 920px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(251,250,247,0.98)',
          border: '1px solid rgba(20,24,34,0.08)',
          borderRadius: wide ? 24 : 20,
          boxShadow: '0 24px 80px rgba(20,24,34,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
            padding: wide ? '16px 18px' : '15px 16px',
            borderBottom: '1px solid rgba(20,24,34,0.06)',
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink)',
                letterSpacing: '-.02em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 11.5,
                color: 'var(--ink-3)',
                lineHeight: 1.4,
              }}
            >
              {wide ? 'Просмотр артефакта' : 'Диалог'}
            </div>
          </div>

          <button
            data-modal-close
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: '1px solid rgba(20,24,34,0.08)',
              background: 'rgba(255,255,255,0.78)',
              color: 'var(--ink-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              fontSize: 16,
              lineHeight: 1,
              transition: 'background .12s ease, border-color .12s ease, color .12s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = 'rgba(20,24,34,0.12)';
              e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.78)';
              e.currentTarget.style.borderColor = 'rgba(20,24,34,0.08)';
              e.currentTarget.style.color = 'var(--ink-3)';
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: wide ? '20px 22px 22px' : '18px 16px 16px',
            background: 'transparent',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}