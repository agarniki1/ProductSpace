import React, { useMemo, useState } from 'react';
import { FileText, Search, X } from 'lucide-react';
import { Artifact, Task, Project } from '../types';
import { TEAM_COLORS } from '../data';
import { TaskIcon } from './TaskIcon';

interface ArtifactsViewProps {
  artifacts: Artifact[];
  tasks: Task[];
  projects: Project[];
  onExpandArtifact: (id: string) => void;
}

export function ArtifactsView({
  artifacts,
  tasks: _tasks,
  projects,
  onExpandArtifact,
}: ArtifactsViewProps) {
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let next = artifacts;

    if (projectFilter === '__personal__') {
      next = next.filter(a => !a.projectId);
    } else if (projectFilter) {
      next = next.filter(a => a.projectId === projectFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      next = next.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.skillName.toLowerCase().includes(q) ||
          (a.projectName || '').toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }

    return next;
  }, [artifacts, projectFilter, query]);

  const projectsWithArtifacts = useMemo(
    () => projects.filter(p => artifacts.some(a => a.projectId === p.id)),
    [projects, artifacts]
  );

  const activeProjectName =
    projectFilter === null
      ? 'Все'
      : projectFilter === '__personal__'
      ? 'Личные'
      : projects.find(p => p.id === projectFilter)?.name || 'Проект';

  const hasActiveFilters = projectFilter !== null || query.trim().length > 0;

  const formatCount = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return `${count} документ`;
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return `${count} документа`;
    }
    return `${count} документов`;
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 500,
    cursor: 'pointer',
    border: active
      ? '1px solid rgba(20,24,34,0.075)'
      : '1px solid rgba(20,24,34,0.055)',
    background: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.58)',
    color: active ? 'var(--ink)' : 'var(--ink-2)',
    transition: 'background .14s ease, border-color .14s ease, color .14s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '28px 32px 36px',
        background: 'linear-gradient(180deg, #fbfaf8 0%, #f8f6f2 52%, #f7f5f1 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1080,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-.035em',
                lineHeight: 1.05,
                color: 'var(--ink)',
                marginBottom: 4,
              }}
            >
              Артефакты
            </div>

            <div
              style={{
                fontSize: 13,
                color: 'var(--ink-3)',
                lineHeight: 1.5,
              }}
            >
              {formatCount(filtered.length)} · {activeProjectName}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 280,
            }}
          >
            <Search
              size={13}
              color="var(--ink-3)"
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />

            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск"
              style={{
                width: '100%',
                height: 36,
                padding: query ? '0 34px 0 32px' : '0 12px 0 32px',
                border: '1px solid rgba(20,24,34,0.075)',
                borderRadius: 11,
                fontSize: 13,
                color: 'var(--ink)',
                background: 'rgba(255,255,255,0.86)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color .14s ease, background .14s ease',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(20,24,34,0.13)';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(20,24,34,0.075)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.86)';
              }}
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Очистить поиск"
                style={{
                  position: 'absolute',
                  right: 9,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  border: 'none',
                  background: 'rgba(20,24,34,0.05)',
                  color: 'var(--ink-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => setProjectFilter(null)}
            style={chipStyle(projectFilter === null)}
          >
            Все
          </button>

          {projectsWithArtifacts.map(p => (
            <button
              key={p.id}
              onClick={() => setProjectFilter(p.id)}
              style={chipStyle(projectFilter === p.id)}
            >
              {p.name}
            </button>
          ))}

          <button
            onClick={() => setProjectFilter('__personal__')}
            style={chipStyle(projectFilter === '__personal__')}
          >
            Личные
          </button>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.68)',
            borderRadius: 18,
            border: '1px solid rgba(20,24,34,0.075)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1.7fr) 156px 148px 96px 96px',
              padding: '10px 18px',
              borderBottom: '1px solid rgba(20,24,34,0.055)',
              background: 'rgba(255,255,255,0.42)',
            }}
          >
            {['Артефакт', 'Автор', 'Проект', 'Дата', 'Статус'].map(h => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                padding: '56px 24px',
                textAlign: 'center',
                color: 'var(--ink-3)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  margin: '0 auto 12px',
                  borderRadius: 12,
                  background: 'rgba(20,24,34,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={18} style={{ opacity: 0.55 }} />
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}
              >
                Ничего не найдено
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--ink-3)',
                  marginBottom: hasActiveFilters ? 12 : 0,
                }}
              >
                {query
                  ? `Нет артефактов по запросу «${query}»`
                  : 'Здесь пока нет артефактов'}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setProjectFilter(null);
                    setQuery('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(20,24,34,0.08)',
                    background: 'rgba(255,255,255,0.9)',
                    color: 'var(--ink-2)',
                    fontSize: 11.5,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            filtered.map((a, i) => {
              const avatarColor =
                TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];

              return (
                <div
                  key={a.id}
                  onClick={() => onExpandArtifact(a.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 1.7fr) 156px 148px 96px 96px',
                    padding: '12px 18px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom:
                      i < filtered.length - 1
                        ? '1px solid rgba(20,24,34,0.055)'
                        : 'none',
                    transition: 'background .14s ease',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.48)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <TaskIcon
                      taskId={a.taskId}
                      size={28}
                      bg="rgba(91,120,239,0.10)"
                      color="var(--ai)"
                    />

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--ink)',
                          marginBottom: 2,
                        }}
                      >
                        {a.title}
                      </div>

                      <div
                        style={{
                          fontSize: 11.5,
                          color: 'var(--ink-3)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.skillName}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: avatarColor,
                        color: '#fff',
                        fontSize: 8,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {a.initials}
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--ink-2)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.author.split(' ')[0]}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-3)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.projectName || '—'}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-3)',
                    }}
                  >
                    {a.when}
                  </div>

                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: 999,
                        background:
                          a.status === 'done'
                            ? 'rgba(78,142,90,0.10)'
                            : 'rgba(20,24,34,0.045)',
                        color:
                          a.status === 'done'
                            ? 'rgb(78,142,90)'
                            : 'var(--ink-2)',
                        border:
                          a.status === 'done'
                            ? '1px solid rgba(78,142,90,0.12)'
                            : '1px solid rgba(20,24,34,0.06)',
                      }}
                    >
                      {a.status === 'done' ? 'Готово' : 'Черновик'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}