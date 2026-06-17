import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Send,
  Copy,
  Share2,
  FolderInput,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Mic,
  Paperclip,
  Plug2,
  Bot,
  Check,
  Briefcase,
  Github,
  Figma,
  SquareKanban,
  Chrome,
  Slack,
  ShieldCheck,
} from 'lucide-react';
import { Task, Chat, Project, TaskEntity, Message } from '../types';
import { CAT_COLORS } from '../data';
import { AiOrb } from './AiOrb';
import { TaskIcon } from './TaskIcon';

interface ChatViewProps {
  chat: Chat | null;
  tasks: Task[];
  projects: Project[];
  currentProjectId?: string | null;
  armedTaskIds: string[];
  heroTaskIds: string[];
  onSend: (text: string, taskIds: string[]) => void;
  onDisarm: () => void;
  onDisarmOne: (id: string) => void;
  onOpenTaskLibrary: () => void;
  onArmTask: (id: string) => void;
  onAttachToProject: (artifactId: string) => void;
  onShareToTeam: (artifactId: string) => void;
  onExpandArtifact: (artifactId: string) => void;
}

type EntityTab = 'all' | TaskEntity;
type MenuSection = 'root' | 'model';
type ModelOption = 'Perplexity' | 'Claude' | 'Lovable' | 'Gemini';

const ENTITY_TABS: { id: EntityTab; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'skill', label: 'Навыки' },
  { id: 'prompt', label: 'Промты' },
];

const MODEL_OPTIONS: ModelOption[] = ['Claude', 'Perplexity', 'Lovable', 'Gemini'];

export function PrivateWorkspace({
  chat,
  tasks,
  projects,
  currentProjectId = null,
  armedTaskIds,
  heroTaskIds,
  onSend,
  onDisarm: _onDisarm,
  onDisarmOne,
  onOpenTaskLibrary,
  onArmTask,
  onAttachToProject,
  onShareToTeam,
  onExpandArtifact,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(new Set());
  const [entityTab, setEntityTab] = useState<EntityTab>('all');

  const [plusOpen, setPlusOpen] = useState(false);
  const [menuSection, setMenuSection] = useState<MenuSection>('root');
  const [selectedModel, setSelectedModel] = useState<ModelOption>('Claude');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [filesEnabled, setFilesEnabled] = useState(false);
  const [connectorsEnabled, setConnectorsEnabled] = useState(false);
  const [connected, setConnected] = useState<Record<string, boolean>>({ github: true, figma: true });

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dockedTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const stageTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const scopedProjectId = chat?.projectId || currentProjectId || null;
  const activeProject = useMemo(
    () => (scopedProjectId ? projects.find(p => p.id === scopedProjectId) || null : null),
    [projects, scopedProjectId]
  );

  const armedTasks = useMemo(
    () =>
      armedTaskIds
        .map(id => tasks.find(t => t.id === id))
        .filter(Boolean) as Task[],
    [armedTaskIds, tasks]
  );

  const heroTasks = useMemo(
    () =>
      heroTaskIds
        .map(id => tasks.find(t => t.id === id))
        .filter(Boolean) as Task[],
    [heroTaskIds, tasks]
  );

  const hasArmed = armedTasks.length > 0;
  const hasMessages = !!chat && chat.messages.some(m => m.role !== 'thinking');

  const heroFiltered = useMemo(
    () => (entityTab === 'all' ? heroTasks : heroTasks.filter(t => t.entity === entityTab)),
    [entityTab, heroTasks]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages?.length]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setPlusOpen(false);
        setMenuSection('root');
      }
    };

    if (plusOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [plusOpen]);

  const resetTextarea = (el: HTMLTextAreaElement | null) => {
    if (el) el.style.height = 'auto';
  };

  const autosizeTextarea = (el: HTMLTextAreaElement | null, maxHeight: number) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text, armedTaskIds);
    setInput('');
    resetTextarea(dockedTextareaRef.current);
    resetTextarea(stageTextareaRef.current);
    setPlusOpen(false);
    setMenuSection('root');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMsgs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    navigator.clipboard.writeText(div.textContent || '').catch(() => {});
  };

  const renderProjectPill = () => {
    if (!activeProject) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 11px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(20,24,34,0.05)',
            color: 'var(--ink-2)',
            fontSize: 11.5,
            fontWeight: 500,
          }}
        >
          <Briefcase size={12.5} color="var(--ink-3)" />
          <span style={{ color: 'var(--ink-3)' }}>Проект</span>
          <span style={{ color: 'rgba(20,24,34,0.18)' }}>·</span>
          <span style={{ color: 'var(--ink)' }}>{activeProject.name}</span>
        </div>
      </div>
    );
  };

  const renderArmedChips = (compact = false) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: compact ? 6 : 8,
        justifyContent: compact ? 'flex-start' : 'center',
      }}
    >
      {armedTasks.map(t => {
        const cc = CAT_COLORS[t.cat] || {
          bg: 'var(--ai-lt)',
          color: 'var(--ai)',
        };

        return (
          <div
            key={t.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: compact ? '5px 9px 5px 7px' : '6px 10px 6px 8px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(20,24,34,0.05)',
              fontSize: compact ? 11.5 : 12,
              fontWeight: 500,
              color: 'var(--ink-2)',
            }}
          >
            <TaskIcon taskId={t.id} size={compact ? 16 : 17} bg={cc.bg} color={cc.color} />
            <span
              style={{
                maxWidth: compact ? 180 : 240,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t.name}
            </span>
            <button
              onClick={() => onDisarmOne(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                color: 'var(--ink-3)',
                opacity: 0.72,
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <X size={compact ? 11 : 12} />
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderPlusMenu = () => {
    if (!plusOpen) return null;

    return (
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 'calc(100% + 10px)',
          width: 236,
          borderRadius: 16,
          background: 'rgba(255,255,255,0.98)',
          border: '1px solid rgba(20,24,34,0.075)',
          boxShadow: '0 18px 40px rgba(20,24,34,0.07)',
          padding: 6,
          zIndex: 20,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {menuSection === 'root' && (
          <>
            <MenuItem
              icon={<Bot size={14} />}
              label="Модель"
              value={selectedModel}
              onClick={() => setMenuSection('model')}
            />
            <MenuItem
              icon={<Paperclip size={14} />}
              label="Файлы"
              value={filesEnabled ? 'Вкл' : 'Выкл'}
              onClick={() => setFilesEnabled(v => !v)}
              active={filesEnabled}
            />
            <MenuItem
              icon={<Mic size={14} />}
              label="Аудио"
              value={audioEnabled ? 'Вкл' : 'Выкл'}
              onClick={() => setAudioEnabled(v => !v)}
              active={audioEnabled}
            />
            <MenuItem
              icon={<Plug2 size={14} />}
              label="Коннекторы"
              value={connectorsEnabled ? 'Вкл' : 'Выкл'}
              onClick={() => setConnectorsEnabled(v => !v)}
              active={connectorsEnabled}
            />
          </>
        )}

        {menuSection === 'model' && (
          <>
            <button
              onClick={() => setMenuSection('root')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px 8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--ink-3)',
                fontSize: 12,
                fontWeight: 600,
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} />
              Назад
            </button>

            {MODEL_OPTIONS.map(model => {
              const active = selectedModel === model;
              return (
                <button
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setMenuSection('root');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '9px 10px',
                    borderRadius: 10,
                    border: 'none',
                    background: active ? 'rgba(20,24,34,0.045)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--ink-2)',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: active ? 600 : 500,
                    outline: 'none',
                    boxShadow: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <span>{model}</span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderAttachedSuggestions = () => {
    const picks = heroFiltered.slice(0, 8);
    if (picks.length === 0 && !hasArmed) return null;

    return (
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(20,24,34,0.045)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 6,
          }}
        >
          {ENTITY_TABS.map(tab => {
            const active = entityTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEntityTab(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: active
                    ? '1px solid rgba(20,24,34,0.05)'
                    : '1px solid transparent',
                  background: active ? 'rgba(255,255,255,0.84)' : 'transparent',
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: active ? 'var(--ink)' : 'var(--ink-3)',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {hasArmed && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {renderArmedChips(false)}
          </div>
        )}

        {picks.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 7,
            }}
          >
            {picks.map(t => {
              const cc = CAT_COLORS[t.cat] || {
                bg: 'var(--ai-lt)',
                color: 'var(--ai)',
              };

              return (
                <button
                  key={t.id}
                  onClick={() => onArmTask(t.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    minWidth: 0,
                    maxWidth: 212,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(20,24,34,0.04)',
                    background: 'rgba(20,24,34,0.03)',
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: 'var(--ink-2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <TaskIcon taskId={t.id} size={15} bg={cc.bg} color={cc.color} />
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}

            <button
              onClick={onOpenTaskLibrary}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px dashed rgba(20,24,34,0.08)',
                background: 'transparent',
                fontSize: 10.5,
                fontWeight: 500,
                color: 'var(--ink-3)',
                cursor: 'pointer',
                transition: 'none',
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <Plus size={12} />
              Все сценарии
            </button>
          </div>
        )}
      </div>
    );
  };

  const CONNECTORS = [
    { id: 'github', name: 'GitHub', Icon: Github, color: '#1b1c20' },
    { id: 'figma', name: 'Figma', Icon: Figma, color: '#A259FF' },
    { id: 'jira', name: 'Jira', Icon: SquareKanban, color: '#2D6CDF' },
    { id: 'google', name: 'Google', Icon: Chrome, color: '#1A73E8' },
    { id: 'slack', name: 'Slack', Icon: Slack, color: '#4A154B' },
  ];

  const renderConnectorsStrip = () => (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', flexShrink: 0 }}>
        Точнее с вашими источниками
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        {CONNECTORS.map(c => {
          const on = !!connected[c.id];
          return (
            <button
              key={c.id}
              onClick={() => setConnected(s => ({ ...s, [c.id]: !s[c.id] }))}
              title={on ? `${c.name} — подключено` : `Подключить ${c.name}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 9px',
                borderRadius: 9,
                cursor: 'pointer',
                background: on ? `${c.color}14` : 'transparent',
                border: `1px solid ${on ? `${c.color}40` : 'var(--border)'}`,
                color: on ? c.color : 'var(--ink-3)',
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              <c.Icon size={14} />
              {c.name}
              {on && <Check size={11} />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderComposer = (variant: 'stage' | 'docked') => {
    const isStage = variant === 'stage';
    const ref = isStage ? stageTextareaRef : dockedTextareaRef;
    const maxHeight = 180;

    return (
      <div
        style={{
          width: '100%',
          maxWidth: isStage ? 1320 : 860,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: isStage ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)',
            borderRadius: isStage ? 32 : 16,
            border: '1px solid rgba(20,24,34,0.06)',
            padding: isStage ? '18px 20px 14px' : '8px 9px',
            transition: 'border-color .15s, background .15s, box-shadow .15s',
            boxShadow: isStage
              ? '0 18px 42px rgba(20,24,34,0.04)'
              : '0 4px 14px rgba(20,24,34,0.02)',
          }}
          onFocusCapture={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(20,24,34,0.08)';
            el.style.background = '#fff';
            el.style.boxShadow = isStage
              ? '0 18px 44px rgba(20,24,34,0.045)'
              : '0 8px 22px rgba(20,24,34,0.03)';
          }}
          onBlurCapture={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(20,24,34,0.06)';
            el.style.background = isStage ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)';
            el.style.boxShadow = isStage
              ? '0 18px 42px rgba(20,24,34,0.04)'
              : '0 4px 14px rgba(20,24,34,0.02)';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isStage ? 12 : 8,
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => {
                  setPlusOpen(v => !v);
                  setMenuSection('root');
                }}
                title="Инструменты"
                style={{
                  width: isStage ? 40 : 30,
                  height: isStage ? 40 : 30,
                  borderRadius: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(20,24,34,0.035)',
                  border: '1px solid rgba(20,24,34,0.05)',
                  cursor: 'pointer',
                  color: 'var(--ink-3)',
                  flexShrink: 0,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <Plus size={isStage ? 16 : 13.5} strokeWidth={2.2} />
              </button>
              {renderPlusMenu()}
            </div>

            <textarea
              ref={ref}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                autosizeTextarea(e.target, maxHeight);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                hasArmed
                  ? armedTasks.length === 1
                    ? `Опишите задачу для «${armedTasks[0].name}»…`
                    : `Опишите контекст для ${armedTasks.length} сценариев…`
                  : activeProject
                  ? `Что нужно сделать в проекте «${activeProject.name}»?`
                  : 'Сформулируйте задачу, идею или вопрос'
              }
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: isStage ? 17 : 14,
                lineHeight: isStage ? 1.55 : 1.56,
                background: 'transparent',
                fontFamily: 'var(--font-ui)',
                color: 'var(--ink)',
                minHeight: isStage ? 38 : 22,
                maxHeight,
                paddingTop: 0,
              }}
              rows={1}
            />

            {isStage && (
              <button
                onClick={() => setAudioEnabled(v => !v)}
                title="Микрофон"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  border: '1px solid rgba(20,24,34,0.05)',
                  background: 'transparent',
                  color: 'var(--ink-3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <Mic size={14.5} strokeWidth={1.95} />
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: isStage ? 40 : 33,
                height: isStage ? 40 : 33,
                borderRadius: isStage ? 13 : 12,
                border: '1px solid rgba(20,24,34,0.08)',
                flexShrink: 0,
                background: input.trim() ? 'var(--ink)' : 'rgba(20,24,34,0.04)',
                color: input.trim() ? '#fff' : 'var(--ink-3)',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'none',
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <Send size={isStage ? 13.5 : 12} strokeWidth={2} />
            </button>
          </div>

          {isStage && renderConnectorsStrip()}
          {isStage && renderAttachedSuggestions()}
        </div>
      </div>
    );
  };

  const stageTitle = activeProject ? 'Над чем поработаем?' : 'Я готов когда ты готов';
  const stageSubtitle = activeProject ? activeProject.goal?.trim() || null : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #fbfaf8 0%, #f8f6f2 46%, #f7f5f1 100%)',
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: hasMessages ? '28px 0 0' : 0,
        }}
      >
        {!hasMessages && (
          <div
            style={{
              minHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 32px 44px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 1380,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {renderProjectPill()}

              <AiOrb
                size={42}
                style={{
                  marginBottom: 14,
                  opacity: 0.94,
                }}
              />

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-.05em',
                  lineHeight: 1.04,
                  color: 'var(--ink)',
                  textAlign: 'center',
                  marginBottom: stageSubtitle ? 8 : 18,
                }}
              >
                {stageTitle}
              </div>

              {stageSubtitle && (
                <div
                  style={{
                    maxWidth: 700,
                    textAlign: 'center',
                    fontSize: 13.5,
                    lineHeight: 1.62,
                    color: 'var(--ink-2)',
                    marginBottom: 20,
                  }}
                >
                  {stageSubtitle}
                </div>
              )}

              {renderComposer('stage')}
            </div>
          </div>
        )}

        {chat &&
          chat.messages.map(msg => (
            <div
              key={msg.id}
              style={{
                maxWidth: 820,
                margin: '0 auto 20px',
                padding: '0 28px',
              }}
            >
              {msg.role === 'thinking' && <ThinkingMessage />}

              {msg.role === 'user' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.88)',
                      color: 'var(--ink)',
                      border: '1px solid rgba(20,24,34,0.055)',
                      borderRadius: '16px 16px 10px 16px',
                      padding: '11px 14px',
                      fontSize: 14,
                      maxWidth: '68%',
                      lineHeight: 1.62,
                      boxShadow: '0 3px 12px rgba(20,24,34,0.018)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && msg.type !== 'artifact' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <AiOrb size={18} style={{ marginTop: 5, opacity: 0.84 }} />
                  <div
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '2px 0',
                      fontSize: 14,
                      lineHeight: 1.74,
                      color: 'var(--ink)',
                      flex: 1,
                      maxWidth: 690,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && msg.type === 'artifact' && (
                <ArtifactMessage
                  msg={msg}
                  tasks={tasks}
                  expandedMsgs={expandedMsgs}
                  onToggleExpand={toggleExpand}
                  onCopy={copyText}
                  onAttachToProject={onAttachToProject}
                  onShareToTeam={onShareToTeam}
                  onExpandArtifact={onExpandArtifact}
                />
              )}
            </div>
          ))}

        <div ref={bottomRef} style={{ height: 24 }} />
      </div>

      {hasMessages && (
        <div
          style={{
            padding: '10px 28px 14px',
            borderTop: '1px solid rgba(20,24,34,0.05)',
            background: 'rgba(248,246,242,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            flexShrink: 0,
          }}
        >
          {hasArmed && (
            <div style={{ marginBottom: 8, maxWidth: 860, marginInline: 'auto' }}>
              {renderArmedChips(true)}
            </div>
          )}

          {renderComposer('docked')}
        </div>
      )}
    </div>
  );
}

function ThinkingMessage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 2,
      }}
    >
      <AiOrb size={18} thinking />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '7px 9px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.74)',
          border: '1px solid rgba(20,24,34,0.055)',
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--ink-3)',
              display: 'inline-block',
              animation: `blink 1.2s infinite ${i * 0.18}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ArtifactMessage({
  msg,
  tasks,
  expandedMsgs,
  onToggleExpand,
  onCopy,
  onAttachToProject,
  onShareToTeam,
  onExpandArtifact,
}: {
  msg: Message;
  tasks: Task[];
  expandedMsgs: Set<string>;
  onToggleExpand: (id: string) => void;
  onCopy: (html: string) => void;
  onAttachToProject: (artifactId: string) => void;
  onShareToTeam: (artifactId: string) => void;
  onExpandArtifact: (artifactId: string) => void;
}) {
  const taskName = tasks.find(t => t.id === msg.taskId)?.name;
  const isExpanded = expandedMsgs.has(msg.id);
  const [sent, setSent] = useState<null | 'review' | 'artifact'>(null);
  const isLong = (msg.docHtml?.length || 0) > 300;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <AiOrb size={18} style={{ marginTop: 5, flexShrink: 0, opacity: 0.88 }} />

      <div
        style={{
          flex: 1,
          maxWidth: 700,
          borderRadius: 18,
          border: '1px solid rgba(20,24,34,0.055)',
          background: 'rgba(255,255,255,0.72)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(20,24,34,0.02)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            borderBottom: '1px solid rgba(20,24,34,0.05)',
            background: 'rgba(255,255,255,0.36)',
          }}
        >
          <TaskIcon
            taskId={msg.taskId || ''}
            size={20}
            bg="rgba(91,120,239,0.10)"
            color="var(--ai)"
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--ink)',
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {msg.title}
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'var(--ink-3)',
                marginTop: 2,
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {taskName}
            </div>
          </div>

          <button
            onClick={() => onExpandArtifact(msg.id)}
            aria-label="Открыть полностью"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(20,24,34,0.065)',
              cursor: 'pointer',
              color: 'var(--ink-3)',
              flexShrink: 0,
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            <Maximize2 size={11.5} />
          </button>
        </div>

        <div
          style={{
            padding: '13px',
            background: 'rgba(255,255,255,0.30)',
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 14,
              border: '1px solid rgba(20,24,34,0.045)',
              background: 'rgba(255,255,255,0.86)',
              overflow: 'hidden',
            }}
          >
            <div
              className="doc"
              style={{
                padding: '16px 16px 14px',
                maxHeight: isExpanded ? 'none' : 320,
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{
                __html: msg.docHtml || '',
              }}
            />

            {!isExpanded && isLong && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '20px 12px 10px',
                  background:
                    'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 56%, rgba(255,255,255,0.98) 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <button
                  onClick={() => onToggleExpand(msg.id)}
                  style={{
                    pointerEvents: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11.5,
                    color: 'var(--ink-2)',
                    fontWeight: 500,
                    background: 'rgba(255,255,255,0.96)',
                    border: '1px solid rgba(20,24,34,0.075)',
                    padding: '6px 11px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <ChevronDown size={12} />
                  Показать полностью
                </button>
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div
            style={{
              padding: '0 13px 12px',
              display: 'flex',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.30)',
            }}
          >
            <button
              onClick={() => onToggleExpand(msg.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11.5,
                color: 'var(--ink-2)',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid rgba(20,24,34,0.075)',
                padding: '6px 11px',
                borderRadius: 999,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <ChevronUp size={12} />
              Свернуть
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 12px',
            borderTop: '1px solid rgba(20,24,34,0.05)',
            background: 'rgba(255,255,255,0.36)',
          }}
        >
          <ActionBtn
            icon={<Copy size={12} />}
            label="Копировать"
            onClick={() => onCopy(msg.docHtml || '')}
          />

          {sent ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>
              <Check size={13} /> {sent === 'review' ? 'Отправлено на ревью' : 'Добавлено в артефакты'}
            </span>
          ) : (
            <>
              <ActionBtn
                icon={<ShieldCheck size={12} />}
                label="На ревью"
                onClick={() => { setSent('review'); onShareToTeam(msg.id); }}
              />
              <ActionBtn
                icon={<FolderInput size={12} />}
                label="В артефакты"
                onClick={() => { setSent('artifact'); onAttachToProject(msg.id); }}
              />
            </>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => onShareToTeam(msg.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 11px',
              borderRadius: 10,
              border: '1px solid rgba(20,24,34,0.08)',
              background: 'rgba(20,24,34,0.92)',
              color: '#fff',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            <Share2 size={11} />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        fontWeight: 500,
        padding: '6px 10px',
        borderRadius: 9,
        border: '1px solid rgba(20,24,34,0.07)',
        background: 'rgba(255,255,255,0.90)',
        cursor: 'pointer',
        color: 'var(--ink-2)',
        outline: 'none',
        boxShadow: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function MenuItem({
  icon,
  label,
  value,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 10px',
        borderRadius: 10,
        border: 'none',
        background: active ? 'rgba(20,24,34,0.045)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--ink-2)',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
        boxShadow: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{label}</span>
      {value && (
        <span
          style={{
            fontSize: 11.5,
            color: 'var(--ink-3)',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      )}
    </button>
  );
}