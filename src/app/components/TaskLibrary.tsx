import { useMemo, useState } from 'react';
import { Search, Clock, Sparkles } from 'lucide-react';
import { Task, TaskCat, TaskEntity } from '../types';
import { CATS, CAT_COLORS } from '../data';
import { TaskIcon } from './TaskIcon';
import { AiOrb } from './AiOrb';

interface TaskLibraryProps {
  tasks: Task[];
  recentTaskIds: string[];
  onArmTask: (id: string) => void;
}

type EntityTab = 'all' | TaskEntity;

const ENTITY_TABS: { id: EntityTab; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'skill', label: 'Навыки' },
  { id: 'prompt', label: 'Промты' },
];

export function TaskLibrary({
  tasks,
  recentTaskIds,
  onArmTask,
}: TaskLibraryProps) {
  const [entityTab, setEntityTab] = useState<EntityTab>('all');
  const [filter, setFilter] = useState<'all' | TaskCat>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      tasks.filter(t => {
        const matchesEntity = entityTab === 'all' || t.entity === entityTab;
        const matchesCat = filter === 'all' || t.cat === filter;
        const q = query.trim().toLowerCase();
        const matchesQ =
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q);

        return matchesEntity && matchesCat && matchesQ;
      }),
    [tasks, entityTab, filter, query]
  );

  const recentTasks = useMemo(
    () =>
      recentTaskIds
        .map(id => tasks.find(t => t.id === id))
        .filter(Boolean) as Task[],
    [recentTaskIds, tasks]
  );

  const grouped = useMemo(() => {
    const result: Record<string, Task[]> = {};
    for (const t of filtered) {
      if (!result[t.cat]) result[t.cat] = [];
      result[t.cat].push(t);
    }
    return result;
  }, [filtered]);

  const catLabel = (cat: string) => CATS.find(c => c.id === cat)?.label || cat;

  const skillCount = tasks.filter(t => t.entity === 'skill').length;
  const promptCount = tasks.filter(t => t.entity === 'prompt').length;

  const tabCount = (id: EntityTab) =>
    id === 'all' ? tasks.length : id === 'skill' ? skillCount : promptCount;

  const subtitle =
    entityTab === 'skill'
      ? 'Готовые сценарии для быстрого запуска работы'
      : entityTab === 'prompt'
        ? 'Короткие заготовки для быстрых запросов'
        : `${tasks.length} сценариев для исследования, генерации и анализа`;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px 44px',
        background:
          'linear-gradient(180deg, #faf8f4 0%, #f7f4ef 44%, #f5f1eb 100%)',
      }}
    >
      <div style={{ maxWidth: 1220, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 24,
            padding: '22px 22px 18px',
            borderRadius: 28,
            border: '1px solid var(--border)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.7) 100%)',
            boxShadow: '0 10px 28px rgba(20,24,34,0.038)',
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
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  background: 'rgba(255,255,255,0.94)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AiOrb size={24} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 9px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.88)',
                    border: '1px solid var(--border)',
                    color: 'var(--ink-2)',
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: '.03em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  <Sparkles size={11} />
                  Библиотека
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-.045em',
                    lineHeight: 1.04,
                    color: 'var(--ink)',
                    marginBottom: 8,
                  }}
                >
                  Навыки и промты
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--ink-2)',
                    lineHeight: 1.58,
                    maxWidth: 620,
                  }}
                >
                  {subtitle}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                maxWidth: 320,
              }}
            >
              {ENTITY_TABS.map(tab => {
                const active = entityTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setEntityTab(tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 11px',
                      borderRadius: 999,
                      border: active ? '1px solid var(--border-md)' : '1px solid transparent',
                      background: active ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.36)',
                      color: active ? 'var(--ink)' : 'var(--ink-2)',
                      cursor: 'pointer',
                      fontSize: 11.5,
                      fontWeight: active ? 600 : 500,
                      transition: 'background .12s ease, color .12s ease, border-color .12s ease',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.56)';
                        e.currentTarget.style.color = 'var(--ink)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.36)';
                        e.currentTarget.style.color = 'var(--ink-2)';
                      }
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        color: active ? 'var(--ink-2)' : 'var(--ink-3)',
                        fontWeight: 600,
                      }}
                    >
                      {tabCount(tab.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: 920,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                position: 'relative',
                marginBottom: 16,
                width: '100%',
              }}
            >
              <Search
                size={18}
                color="var(--ink-3)"
                style={{
                  position: 'absolute',
                  left: 18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />

              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по названию, описанию или сценарию"
                style={{
                  width: '100%',
                  height: 60,
                  padding: '0 18px 0 50px',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  fontSize: 14.5,
                  background: 'rgba(255,255,255,0.98)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: 'var(--ink)',
                  boxShadow:
                    '0 10px 24px rgba(20,24,34,0.035), inset 0 1px 0 rgba(255,255,255,0.7)',
                  transition: 'border-color .15s ease, box-shadow .15s ease, background .15s ease',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(111,127,242,0.3)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 4px rgba(111,127,242,0.08), 0 12px 28px rgba(20,24,34,0.05)';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 24px rgba(20,24,34,0.035), inset 0 1px 0 rgba(255,255,255,0.7)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.98)';
                }}
              />
            </div>

            {recentTasks.length > 0 && entityTab === 'all' && filter === 'all' && !query && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    paddingLeft: 2,
                  }}
                >
                  <Clock size={12} color="var(--ink-3)" />
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  >
                    Недавние
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {recentTasks.map(t => (
                    <button
                      key={t.id}
                      onClick={() => onArmTask(t.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 10px 7px 8px',
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 500,
                        border: '1px solid rgba(20,24,34,0.06)',
                        background: 'rgba(255,255,255,0.72)',
                        cursor: 'pointer',
                        color: 'var(--ink-2)',
                        transition: 'background .12s ease, border-color .12s ease, color .12s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = 'var(--border-md)';
                        e.currentTarget.style.color = 'var(--ink)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.72)';
                        e.currentTarget.style.borderColor = 'rgba(20,24,34,0.06)';
                        e.currentTarget.style.color = 'var(--ink-2)';
                      }}
                    >
                      <TaskIcon taskId={t.id} size={18} bg="var(--ai-lt)" color="var(--ai)" />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            borderRadius: 26,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.72)',
            boxShadow: '0 8px 24px rgba(20,24,34,0.028)',
            padding: '16px 16px 18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            {CATS.map(c => {
              const active = filter === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id as 'all' | TaskCat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 11px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    border: active ? '1px solid var(--border-md)' : '1px solid transparent',
                    background: active ? 'rgba(255,255,255,0.96)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--ink-2)',
                    transition: 'background .12s ease, color .12s ease, border-color .12s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.52)';
                      e.currentTarget.style.color = 'var(--ink)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--ink-2)';
                    }
                  }}
                >
                  {c.id}
                </button>
              );
            })}
          </div>

          {Object.entries(grouped).map(([cat, catTasks]) => {
            const cc = CAT_COLORS[cat] || {
              bg: 'var(--ai-lt)',
              color: 'var(--ai)',
              dot: 'var(--ai)',
            };

            return (
              <div key={cat} style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: cc.dot,
                    }}
                  />

                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  >
                    {catLabel(cat)}
                  </span>

                  <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
                    {catTasks.length}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(276px, 1fr))',
                    gap: 12,
                  }}
                >
                  {catTasks.map(t => {
                    const isPrompt = t.entity === 'prompt';
                    const isSkill = t.entity === 'skill';

                    return (
                      <button
                        key={t.id}
                        onClick={() => onArmTask(t.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '15px 15px 14px',
                          borderRadius: 20,
                          border: '1px solid var(--border)',
                          background: 'rgba(255,255,255,0.84)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition:
                            'background .12s ease, border-color .12s ease, transform .12s ease, box-shadow .12s ease',
                          boxShadow: '0 2px 8px rgba(20,24,34,0.015)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.borderColor = 'var(--border-md)';
                          e.currentTarget.style.boxShadow = '0 8px 18px rgba(20,24,34,0.028)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.84)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(20,24,34,0.015)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <TaskIcon taskId={t.id} size={30} bg={cc.bg} color={cc.color} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              marginBottom: 7,
                              flexWrap: 'wrap',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: 'var(--ink)',
                                lineHeight: 1.34,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {t.name}
                            </div>

                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 600,
                                padding: '2px 6px',
                                borderRadius: 999,
                                background: 'rgba(20,24,34,0.042)',
                                color: 'var(--ink-2)',
                                flexShrink: 0,
                              }}
                            >
                              {isSkill ? 'навык' : isPrompt ? 'промт' : t.entity}
                            </span>

                            {t.kind === 'proto' && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  color: cc.color,
                                  fontWeight: 600,
                                  background: cc.bg,
                                  padding: '2px 6px',
                                  borderRadius: 999,
                                  flexShrink: 0,
                                }}
                              >
                                превью
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: 12.5,
                              color: 'var(--ink-2)',
                              lineHeight: 1.62,
                              maxWidth: '97%',
                              marginBottom: 13,
                            }}
                          >
                            {t.desc}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10.5,
                                color: 'var(--ink-3)',
                              }}
                            >
                              {catLabel(t.cat)}
                            </div>

                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--ink-2)',
                              }}
                            >
                              Открыть
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '58px 0',
                color: 'var(--ink-3)',
                borderRadius: 20,
                border: '1px dashed rgba(20,24,34,0.10)',
                background: 'rgba(255,255,255,0.56)',
              }}
            >
              <Search size={24} style={{ marginBottom: 10, opacity: 0.38 }} />
              <div
                style={{
                  fontSize: 13.5,
                  color: 'var(--ink-2)',
                }}
              >
                Ничего не найдено
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}