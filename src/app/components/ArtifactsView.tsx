import React, { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { Artifact, Task, Project } from '../types';
import { TEAM_COLORS } from '../data';
import { TaskIcon } from './TaskIcon';

interface ArtifactsViewProps {
  artifacts: Artifact[];
  tasks: Task[];
  projects: Project[];
  onExpandArtifact: (id: string) => void;
}

export function ArtifactsView({ artifacts, tasks, projects, onExpandArtifact }: ArtifactsViewProps) {
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  let filtered = artifacts;
  if (projectFilter === '__personal__') filtered = filtered.filter(a => !a.projectId);
  else if (projectFilter) filtered = filtered.filter(a => a.projectId === projectFilter);
  if (query) filtered = filtered.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.skillName.toLowerCase().includes(query.toLowerCase()));

  const projectsWithArtifacts = projects.filter(p => artifacts.some(a => a.projectId === p.id));

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    border: active ? 'none' : '1.5px solid var(--border-md)',
    background: active ? 'var(--ink)' : '#fff',
    color: active ? '#fff' : 'var(--ink-2)',
    transition: 'all .12s',
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-.02em', marginBottom: 5 }}>Артефакты команды</div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>{artifacts.length} документов · все проекты</div>
        </div>
        {/* Search */}
        <div style={{ position: 'relative', width: 240 }}>
          <Search size={13} color="var(--ink-3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск…"
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1.5px solid var(--border-md)', borderRadius: 'var(--radius-md)',
              fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--ai-md)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-md)')}
          />
        </div>
      </div>

      {/* Project filter chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={() => setProjectFilter(null)} style={chipStyle(projectFilter === null)}>Все</button>
        {projectsWithArtifacts.map(p => (
          <button key={p.id} onClick={() => setProjectFilter(p.id)} style={chipStyle(projectFilter === p.id)}>{p.name}</button>
        ))}
        <button onClick={() => setProjectFilter('__personal__')} style={chipStyle(projectFilter === '__personal__')}>Личные</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 150px 130px 90px 80px',
          padding: '9px 18px', borderBottom: '1.5px solid var(--border-md)',
          background: 'var(--bg-subtle)',
        }}>
          {['Артефакт', 'Автор', 'Проект', 'Дата', 'Статус'].map(h => (
            <div key={h} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '52px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <FileText size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
            <div style={{ fontSize: 14 }}>Нет артефактов{query ? ` по запросу «${query}»` : ''}</div>
          </div>
        ) : (
          filtered.map((a, i) => {
            const avatarColor = TEAM_COLORS[a.initials.charCodeAt(0) % TEAM_COLORS.length];
            return (
              <div
                key={a.id}
                onClick={() => onExpandArtifact(a.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 150px 130px 90px 80px',
                  padding: '11px 18px', alignItems: 'center', cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-soft)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <TaskIcon taskId={a.taskId} size={30} bg="var(--ai-lt)" color="var(--ai)" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{a.skillName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: avatarColor, color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.initials}</div>
                  <span style={{ fontSize: 12, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.author.split(' ')[0]}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.projectName || '—'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.when}</div>
                <div style={{
                  display: 'inline-flex', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                  background: a.status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)',
                  color: a.status === 'done' ? 'var(--green)' : 'var(--ai)',
                }}>{a.status === 'done' ? 'Готово' : 'Черновик'}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
