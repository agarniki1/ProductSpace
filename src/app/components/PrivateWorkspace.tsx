import React, { useRef, useEffect, useState } from 'react';
import { Send, Zap, Copy, Share2, FolderInput, Maximize2, ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { Message, Task, Chat, Project } from '../types';
import { AiOrb } from './AiOrb';
import { TaskIcon } from './TaskIcon';

interface ChatViewProps {
  chat: Chat | null;
  tasks: Task[];
  projects: Project[];
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

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  pm: { bg: '#EDE9FE', color: '#7C3AED' },
  pmm: { bg: '#FEF3C7', color: '#D97706' },
  res: { bg: '#DBEAFE', color: '#2563EB' },
  data: { bg: '#DCFCE7', color: '#16A34A' },
  dev: { bg: '#FEE2E2', color: '#DC2626' },
  build: { bg: '#F3E8FF', color: '#9333EA' },
};

export function PrivateWorkspace({
  chat, tasks, projects, armedTaskIds,
  heroTaskIds, onSend, onDisarm, onDisarmOne, onOpenTaskLibrary,
  onArmTask, onAttachToProject, onShareToTeam, onExpandArtifact,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const armedTasks = armedTaskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  const heroTasks = heroTaskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  const hasArmed = armedTaskIds.length > 0;
  const hasMessages = chat && chat.messages.some(m => m.role !== 'thinking');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages?.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    onSend(text, armedTaskIds);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: hasMessages ? '24px 0 0' : '0' }}>

        {/* Empty state */}
        {!hasMessages && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', padding: '0 24px 80px', animation: 'fade-in .3s ease',
          }}>
            {/* Icon cluster */}
            {armedTasks.length === 1 ? (
              <TaskIcon taskId={armedTasks[0].id} size={56} bg="var(--ai-lt)" color="var(--ai)" style={{ marginBottom: 20 }} />
            ) : armedTasks.length > 1 ? (
              <div style={{ display: 'flex', marginBottom: 20 }}>
                {armedTasks.slice(0, 3).map((t, i) => (
                  <div key={t.id} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: armedTasks.length - i }}>
                    <TaskIcon taskId={t.id} size={48} bg="var(--ai-lt)" color="var(--ai)"
                      style={{ border: '2px solid #fff', boxShadow: 'var(--shadow-sm)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <AiOrb size={56} style={{ marginBottom: 20 }} />
            )}

            <div style={{
              fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)',
              letterSpacing: '-.02em', marginBottom: 8, color: 'var(--ink)', textAlign: 'center',
            }}>
              {hasArmed
                ? armedTasks.length === 1 ? armedTasks[0].name : `${armedTasks.length} задачи выбраны`
                : 'Чем могу помочь?'}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-3)', textAlign: 'center', maxWidth: 440, lineHeight: 1.6, marginBottom: 24 }}>
              {hasArmed
                ? armedTasks.length === 1
                  ? armedTasks[0].desc
                  : `Опишите контекст — AI создаст ${armedTasks.length} артефакта по всем выбранным задачам`
                : 'Выберите одну или несколько задач, или напишите свободный запрос'}
            </div>

            {/* Active task chips in empty state */}
            {hasArmed && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 500, marginBottom: 24 }}>
                {armedTasks.map(t => {
                  const cc = CAT_COLORS[t.cat] || { bg: 'var(--ai-lt)', color: 'var(--ai)' };
                  return (
                    <div key={t.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 10px 6px 8px', borderRadius: 99,
                      background: cc.bg, border: `1px solid ${cc.color}22`,
                      fontSize: 12.5, fontWeight: 600, color: cc.color,
                    }}>
                      <TaskIcon taskId={t.id} size={20} bg="transparent" color={cc.color} style={{ borderRadius: 0 }} />
                      {t.name}
                      <button onClick={() => onDisarmOne(t.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: cc.color, opacity: 0.55 }}>
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
                <button onClick={onOpenTaskLibrary} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 10px', borderRadius: 99,
                  background: 'var(--bg-subtle)', border: '1px dashed var(--border-md)',
                  fontSize: 12.5, fontWeight: 500, color: 'var(--ink-3)', cursor: 'pointer',
                }}><Plus size={12} /> Добавить задачу</button>
              </div>
            )}

            {/* Hero task grid (when nothing armed) */}
            {!hasArmed && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 560, width: '100%' }}>
                {heroTasks.map(t => {
                  const cc = CAT_COLORS[t.cat] || { bg: 'var(--ai-lt)', color: 'var(--ai)' };
                  return (
                    <button key={t.id} onClick={() => onArmTask(t.id)} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      gap: 6, padding: '13px 13px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: '#fff',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'box-shadow .15s, transform .1s', boxShadow: 'var(--shadow-sm)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <TaskIcon taskId={t.id} size={28} bg={cc.bg} color={cc.color} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{t.name}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {chat && chat.messages.map(msg => (
          <div key={msg.id} style={{ maxWidth: 760, margin: '0 auto 20px', padding: '0 28px', animation: 'rise .2s ease' }}>

            {msg.role === 'thinking' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AiOrb size={28} thinking />
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: 'var(--ai-md)', display: 'inline-block',
                      animation: `blink 1.2s infinite ${i * 0.18}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {msg.role === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: 'var(--ink)', color: '#fff',
                  borderRadius: '16px 16px 4px 16px',
                  padding: '10px 15px', fontSize: 14, maxWidth: '72%', lineHeight: 1.6,
                }}>{msg.text}</div>
              </div>
            )}

            {msg.role === 'assistant' && msg.type !== 'artifact' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                <AiOrb size={28} style={{ marginTop: 3 }} />
                <div style={{
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '4px 16px 16px 16px', padding: '12px 16px',
                  fontSize: 14, lineHeight: 1.65, color: 'var(--ink)',
                  flex: 1, boxShadow: 'var(--shadow-sm)',
                }}>{msg.text}</div>
              </div>
            )}

            {msg.role === 'assistant' && msg.type === 'artifact' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                <AiOrb size={28} style={{ marginTop: 3, flexShrink: 0 }} />
                <div style={{
                  flex: 1, background: '#fff',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '11px 15px',
                    borderBottom: '1px solid var(--border)', background: 'var(--bg-soft)',
                  }}>
                    <TaskIcon taskId={msg.taskId || ''} size={28} bg="var(--ai-lt)" color="var(--ai)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{tasks.find(t => t.id === msg.taskId)?.name}</div>
                    </div>
                    <button onClick={() => onExpandArtifact(msg.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 7, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--ink-3)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Maximize2 size={12} /></button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div className="doc" style={{ padding: '16px 18px', maxHeight: expandedMsgs.has(msg.id) ? 'none' : 300, overflow: 'hidden' }}
                      dangerouslySetInnerHTML={{ __html: msg.docHtml || '' }} />
                    {!expandedMsgs.has(msg.id) && (msg.docHtml?.length || 0) > 300 && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 52, background: 'linear-gradient(transparent, #fff)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
                        <button onClick={() => toggleExpand(msg.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--ai)', fontWeight: 500, background: 'var(--ai-lt)', border: 'none', padding: '4px 10px', borderRadius: 99, cursor: 'pointer' }}>
                          <ChevronDown size={12} /> Показать полностью
                        </button>
                      </div>
                    )}
                  </div>
                  {expandedMsgs.has(msg.id) && (
                    <div style={{ padding: '4px 18px 10px', display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => toggleExpand(msg.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--ai)', fontWeight: 500, background: 'var(--ai-lt)', border: 'none', padding: '4px 10px', borderRadius: 99, cursor: 'pointer' }}>
                        <ChevronUp size={12} /> Свернуть
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
                    <ActionBtn icon={<Copy size={12} />} label="Копировать" onClick={() => copyText(msg.docHtml || '')} />
                    <ActionBtn icon={<FolderInput size={12} />} label="В проект" onClick={() => onAttachToProject(msg.id)} />
                    <div style={{ flex: 1 }} />
                    <button onClick={() => onShareToTeam(msg.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--ai)', color: '#fff', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--ai-dk)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--ai)')}>
                      <Share2 size={11} /> Поделиться
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '12px 28px 16px', borderTop: '1px solid var(--border)',
        background: 'rgba(248,248,252,.96)', backdropFilter: 'blur(10px)', flexShrink: 0,
      }}>
        {/* Multi-task chips */}
        {hasArmed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9, flexWrap: 'wrap' }}>
            {armedTasks.map(t => {
              const cc = CAT_COLORS[t.cat] || { bg: 'var(--ai-lt)', color: 'var(--ai)' };
              return (
                <div key={t.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 8px 3px 6px', borderRadius: 99,
                  background: cc.bg, border: `1px solid ${cc.color}33`,
                  fontSize: 11.5, fontWeight: 600, color: cc.color,
                }}>
                  <TaskIcon taskId={t.id} size={16} bg="transparent" color={cc.color} style={{ borderRadius: 0 }} />
                  {t.name}
                  <button onClick={() => onDisarmOne(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: cc.color, opacity: 0.55 }}>
                    <X size={11} />
                  </button>
                </div>
              );
            })}
            <button onClick={onOpenTaskLibrary} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 500,
              background: 'transparent', border: '1px dashed var(--border-md)',
              color: 'var(--ink-3)', cursor: 'pointer',
            }}><Plus size={11} /> Добавить</button>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
              {armedTasks.length > 1 ? `AI создаст ${armedTasks.length} артефакта` : 'Опишите задачу — AI создаст артефакт'}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: '#fff', borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-md)', padding: '10px 10px 10px 14px',
          boxShadow: '0 2px 16px rgba(24,24,27,.07)', transition: 'box-shadow .15s, border-color .15s',
        }}
          onFocusCapture={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 20px rgba(91,120,239,.12)'; el.style.borderColor = 'var(--ai-md)'; }}
          onBlurCapture={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 16px rgba(24,24,27,.07)'; el.style.borderColor = 'var(--border-md)'; }}
        >
          <button onClick={onOpenTaskLibrary} title="Выбрать задачи из библиотеки" style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hasArmed ? 'var(--ai-lt)' : 'var(--bg-subtle)',
            border: 'none', cursor: 'pointer', color: hasArmed ? 'var(--ai)' : 'var(--ink-3)',
            position: 'relative',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--ai-lt)')}
            onMouseLeave={e => (e.currentTarget.style.background = hasArmed ? 'var(--ai-lt)' : 'var(--bg-subtle)')}>
            <Zap size={14} strokeWidth={2} />
            {armedTaskIds.length > 1 && (
              <div style={{
                position: 'absolute', top: -5, right: -5, width: 14, height: 14,
                borderRadius: '50%', background: 'var(--ai)', color: '#fff',
                fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fff',
              }}>{armedTaskIds.length}</div>
            )}
          </button>

          <textarea ref={textareaRef} value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; }}
            onKeyDown={handleKeyDown}
            placeholder={
              hasArmed
                ? armedTasks.length === 1 ? `Опишите задачу для «${armedTasks[0].name}»…` : `Опишите контекст для ${armedTasks.length} задач…`
                : 'Напишите вопрос или выберите задачу (⚡)…'
            }
            style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: 14, lineHeight: 1.6, background: 'transparent', fontFamily: 'var(--font-ui)', color: 'var(--ink)', minHeight: 24, maxHeight: 200 }}
            rows={1} />

          <button onClick={handleSend} disabled={!input.trim()} style={{
            width: 34, height: 34, borderRadius: 10, border: 'none', flexShrink: 0,
            background: input.trim() ? 'var(--ai)' : 'var(--bg-subtle)',
            color: input.trim() ? '#fff' : 'var(--ink-3)',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: input.trim() ? '0 2px 8px rgba(91,120,239,.3)' : 'none',
          }}><Send size={13} strokeWidth={2} /></button>
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginTop: 7 }}>
          Enter — отправить · ⚡ — выбрать задачи · можно выбрать несколько
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11.5, fontWeight: 500, padding: '5px 9px', borderRadius: 7,
      border: '1px solid var(--border)', background: '#fff', cursor: 'pointer',
      color: 'var(--ink-2)', transition: 'background .1s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
    >{icon}{label}</button>
  );
}
