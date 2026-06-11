import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, AppState, Chat, Message, Toast, Profile, Artifact } from './types';
import { INITIAL_PROJECTS, ALL_TASKS, HERO_TASKS, DEFAULT_PROFILE, uid, demoDoc, deriveTitle, freeReply, buildSeedData } from './data';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskLibrary } from './components/TaskLibrary';
import { ProjectView } from './components/ProjectView';
import { ArtifactsView } from './components/ArtifactsView';
import { PrivateWorkspace } from './components/PrivateWorkspace';
import { ArtifactStyles } from './components/ArtifactStyles';

// Build initial seed data
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
    update({ currentChatId: id, currentView: 'chat', sidebarOpen: false });
  }, []);

  const newChat = useCallback(() => {
    update({ currentChatId: null, currentView: 'chat', armedTaskId: null, armedTaskIds: [], sidebarOpen: false });
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
        ? taskIds.map(id => prev.tasks.find(t => t.id === id)?.name?.split('/')[0].trim()).filter(Boolean).join(' + ')
        : (firstTask?.name || text.slice(0, 42));

      if (!chatId || !chats.find(c => c.id === chatId)) {
        const newChat: Chat = {
          id: uid(),
          title: chatTitle,
          ico: firstTask?.ico || 'prd',
          projectId: null,
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

      return { ...prev, chats, currentChatId: chatId, armedTaskId: null, armedTaskIds: [] };
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
            const artMsg: Message = { id: artId, role: 'assistant', type: 'artifact', taskId, title, docHtml: html };
            chat.messages.push(artMsg);
            newArtifacts.push({
              id: artId,
              title,
              taskId,
              skillName: prev.tasks.find(t => t.id === taskId)?.name || '',
              status: 'draft',
              projectName: null,
              projectId: null,
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

  // Overlay close on Escape
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'var(--sb-width) 1fr',
        height: '100vh',
        background: 'var(--bg-soft)',
        overflow: 'hidden',
      }}>
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

        <main style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--bg-soft)',
        }}>
          {/* Topbar */}
          <TopBar state={state} onArmTask={armTask} />

          {/* Content */}
          <div style={{
            flex: 1,
            overflow: state.currentView === 'chat' ? 'hidden' : 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}>
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
                onNewTask={() => goView('tasks')}
                onOpenChat={openChat}
                onNewChatInProject={() => {
                  update({ currentChatId: null, currentView: 'chat', armedTaskId: null, armedTaskIds: [] });
                }}
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

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
        {state.toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--ink)', color: '#fff', padding: '11px 18px',
            borderRadius: 12, fontSize: 13, fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,.22)',
            animation: 'rise .2s ease',
            display: 'flex', alignItems: 'center', gap: 9,
            border: '1px solid rgba(255,255,255,.08)',
          }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.kind === 'success' ? 'var(--green)' : 'var(--ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>
              {t.kind === 'success' ? '✓' : 'i'}
            </div>
            {t.text}
          </div>
        ))}
      </div>

      {/* Overlay: New Project */}
      {state.overlay === 'newProject' && (
        <Modal onClose={closeOverlay} title="Новый проект">
          <NewProjectForm
            onSave={(name, product, goal) => {
              const p = {
                id: uid(), name, product, status: 'planning' as const, goal, progress: 0, members: [state.profile.initials], chats: 0,
              };
              setState(prev => ({ ...prev, projects: [...prev.projects, p], overlay: null }));
              showToast('Проект создан');
            }}
            onCancel={closeOverlay}
          />
        </Modal>
      )}

      {/* Overlay: Profile */}
      {state.overlay === 'profile' && (
        <Modal onClose={closeOverlay} title="Профиль">
          <ProfileForm
            profile={state.profile}
            onSave={(prof) => {
              setState(prev => ({ ...prev, profile: prof, overlay: null }));
              showToast('Профиль обновлён');
            }}
            onCancel={closeOverlay}
          />
        </Modal>
      )}

      {/* Overlay: Artifact expand */}
      {state.overlay === 'artifactExpand' && expandedArtHtml && (
        <Modal onClose={closeOverlay} title={expandedArtTitle || 'Артефакт'} wide>
          <div className="doc" style={{ padding: '4px 0 16px' }} dangerouslySetInnerHTML={{ __html: expandedArtHtml }} />
        </Modal>
      )}
    </>
  );
}

// --- Topbar ---
function TopBar({ state, onArmTask }: { state: AppState; onArmTask: (id: string) => void }) {
  const { currentView, currentProjectId, currentChatId, projects, chats, profile } = state;

  let title: React.ReactNode;
  if (currentView === 'dashboard') title = <><Dim>Главная</Dim> · Product Space</>;
  else if (currentView === 'tasks') title = <>Библиотека задач</>;
  else if (currentView === 'artifacts') title = <><Dim>Team Space</Dim> · Артефакты</>;
  else if (currentView === 'chat') {
    const chat = chats.find(c => c.id === currentChatId);
    title = <><Dim>{chat?.title || 'Новый чат'}</Dim></>;
  } else if (currentView === 'project') {
    const p = projects.find(x => x.id === currentProjectId);
    title = <><Dim>Проект</Dim> · {p?.name}</>;
  } else title = <>Product Space</>;

  return (
    <div style={{
      height: 52,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 22px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      background: 'rgba(248,248,252,.94)',
      backdropFilter: 'blur(12px)',
      zIndex: 10,
    }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11.5, padding: '4px 10px', borderRadius: 99,
          border: '1px solid var(--border)', background: '#fff', color: 'var(--ink-2)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
          {profile.company}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: profile.color, color: '#fff',
          fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,.15)',
        }}>{profile.initials}</div>
      </div>
    </div>
  );
}

function Dim({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{children}</span>;
}

// --- Modal ---
function Modal({ onClose, title, children, wide }: { onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, backdropFilter: 'blur(4px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        width: wide ? 760 : 480, maxWidth: 'calc(100vw - 40px)',
        maxHeight: '85vh', overflow: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,.22)',
        animation: 'rise .2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{title}</div>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

// --- New Project Form ---
function NewProjectForm({ onSave, onCancel }: { onSave: (name: string, product: string, goal: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-md)',
    borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-ui)',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 5, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div><label style={labelStyle}>Название проекта</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Debit card DACH" /></div>
      <div><label style={labelStyle}>Продукт / Домен</label><input style={inputStyle} value={product} onChange={e => setProduct(e.target.value)} placeholder="Payments, Growth, Platform…" /></div>
      <div><label style={labelStyle}>Цель проекта</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={goal} onChange={e => setGoal(e.target.value)} placeholder="Опишите цель одним предложением…" /></div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onCancel} style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid var(--border-md)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-2)' }}>Отмена</button>
        <button onClick={() => name.trim() && onSave(name.trim(), product.trim() || 'General', goal.trim())} disabled={!name.trim()} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: name.trim() ? 'var(--orange)' : 'var(--border)', color: name.trim() ? '#fff' : 'var(--ink-3)', fontSize: 13, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default' }}>Создать</button>
      </div>
    </div>
  );
}

// --- Profile Form ---
function ProfileForm({ profile, onSave, onCancel }: { profile: Profile; onSave: (p: Profile) => void; onCancel: () => void }) {
  const [form, setForm] = useState(profile);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-md)',
    borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-ui)',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 5, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: form.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{form.initials}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{form.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{form.role} · {form.company}</div>
        </div>
      </div>
      <div><label style={labelStyle}>Имя</label><input style={inputStyle} value={form.name} onChange={set('name')} /></div>
      <div><label style={labelStyle}>Инициалы (2 буквы)</label><input style={inputStyle} value={form.initials} onChange={set('initials')} maxLength={2} /></div>
      <div><label style={labelStyle}>Должность</label><input style={inputStyle} value={form.role} onChange={set('role')} /></div>
      <div><label style={labelStyle}>Компания</label><input style={inputStyle} value={form.company} onChange={set('company')} /></div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onCancel} style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid var(--border-md)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-2)' }}>Отмена</button>
        <button onClick={() => onSave(form)} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: 'var(--orange)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
      </div>
    </div>
  );
}
