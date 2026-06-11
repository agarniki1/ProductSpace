import { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { Task, TaskCat, TaskEntity } from '../types';
import { CATS, CAT_COLORS } from '../data';
import { TaskIcon } from './TaskIcon';

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

export function TaskLibrary({ tasks, recentTaskIds, onArmTask }: TaskLibraryProps) {
  const [entityTab, setEntityTab] = useState<EntityTab>('all');
  const [filter, setFilter] = useState<'all' | TaskCat>('all');
  const [query, setQuery] = useState('');

  const filtered = tasks.filter(t => {
    const matchesEntity = entityTab === 'all' || t.entity === entityTab;
    const matchesCat = filter === 'all' || t.cat === filter;
    const matchesQ =
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase());

    return matchesEntity && matchesCat && matchesQ;
  });

  const recentTasks = recentTaskIds
    .map(id => tasks.find(t => t.id === id))
    .filter(Boolean) as Task[];

  const grouped: Record<string, Task[]> = {};
  for (const t of filtered) {
    if (!grouped[t.cat]) grouped[t.cat] = [];
    grouped[t.cat].push(t);
  }

  const catLabel = (cat: string) => CATS.find(c => c.id === cat)?.label || cat;

  const skillCount = tasks.filter(t => t.entity === 'skill').length;
  const promptCount = tasks.filter(t => t.entity === 'prompt').length;

  const tabCount = (id: EntityTab) =>
    id === 'all' ? tasks.length : id === 'skill' ? skillCount : promptCount;

  const subtitle =
    entityTab === 'skill'
      ? 'Навыки — готовые сценарии, которые собирают структурированный артефакт'
      : entityTab === 'prompt'
        ? 'Промты — быстрые заготовки запросов для свободной работы в чате'
        : `${tasks.length} сценариев · выберите навык или промт, и AI соберёт документ`;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-.02em',
            marginBottom: 5,
          }}
        >
          Библиотека
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>{subtitle}</div>
      </div>

      {/* Entity tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 0,
          borderBottom: '1px solid var(--border)',
          marginBottom: 14,
        }}
      >
        {ENTITY_TABS.map(tab => {
          const active = entityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setEntityTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 4px',
                marginRight: 14,
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--ai)' : 'var(--ink-3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderBottom: active ? '2px solid var(--ai)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color .15s',
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: 11, color: active ? 'var(--ai)' : 'var(--ink-3)' }}>
                {tabCount(tab.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search
          size={14}
          color="var(--ink-3)"
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск…"
          style={{
            width: '100%',
            padding: '9px 14px 9px 36px',
            border: '1.5px solid var(--border-md)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13.5,
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            color: 'var(--ink)',
            transition: 'border-color .15s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ai-md)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-md)')}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATS.map(c => {
          const cc = CAT_COLORS[c.id];
          const active = filter === c.id;

          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id as 'all' | TaskCat)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 13px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: active ? 'none' : '1.5px solid var(--border-md)',
                background: active ? (cc?.dot || 'var(--ink)') : '#fff',
                color: active ? '#fff' : 'var(--ink-2)',
                transition: 'all .12s',
                boxShadow: active ? '0 2px 8px rgba(0,0,0,.15)' : 'none',
              }}
            >
              {c.id !== 'all' && cc && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: active ? 'rgba(255,255,255,.6)' : cc.dot,
                  }}
                />
              )}
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Recent tasks */}
      {recentTasks.length > 0 && entityTab === 'all' && filter === 'all' && !query && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Clock size={12} color="var(--ink-3)" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '.07em',
              }}
            >
              Недавние
            </span>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {recentTasks.map(t => (
              <button
                key={t.id}
                onClick={() => onArmTask(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 11px 5px 7px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 500,
                  border: '1.5px solid var(--border-md)',
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'border-color .12s, box-shadow .12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--ai-md)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-md)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <TaskIcon taskId={t.id} size={22} bg="var(--ai-lt)" color="var(--ai)" />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grouped tasks */}
      {Object.entries(grouped).map(([cat, catTasks]) => {
        const cc = CAT_COLORS[cat] || {
          bg: 'var(--ai-lt)',
          color: 'var(--ai)',
          dot: 'var(--ai)',
        };

        return (
          <div key={cat} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: cc.dot,
                  boxShadow: `0 0 0 2px ${cc.bg}`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '.07em',
                }}
              >
                {catLabel(cat)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>({catTasks.length})</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 9,
              }}
            >
              {catTasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => onArmTask(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 11,
                    padding: '13px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'box-shadow .15s, border-color .12s, transform .1s',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = `${cc.color}30`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <TaskIcon taskId={t.id} size={32} bg={cc.bg} color={cc.color} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        marginBottom: 3,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          lineHeight: 1.3,
                        }}
                      >
                        {t.name}
                      </div>

                      {t.entity === 'prompt' && (
                        <span
                          style={{
                            fontSize: 9.5,
                            color: 'var(--ink-3)',
                            fontWeight: 700,
                            background: 'var(--bg-soft)',
                            padding: '2px 6px',
                            borderRadius: 4,
                            flexShrink: 0,
                            letterSpacing: '.02em',
                          }}
                        >
                          промт
                        </span>
                      )}

                      {t.kind === 'proto' && (
                        <span
                          style={{
                            fontSize: 9.5,
                            color: cc.color,
                            fontWeight: 700,
                            background: cc.bg,
                            padding: '2px 6px',
                            borderRadius: 4,
                            flexShrink: 0,
                            letterSpacing: '.02em',
                          }}
                        >
                          превью
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                      {t.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--ink-3)' }}>
          <Search size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14 }}>Ничего по запросу «{query}»</div>
        </div>
      )}
    </div>
  );
}
