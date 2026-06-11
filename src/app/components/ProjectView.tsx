import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MessageSquare,
  FolderOpen,
  Users,
  Target,
  Clock3,
  CheckCircle2,
  UserPlus,
  UserMinus,
  CreditCard,
  Wand2,
  Gift,
  BarChart3,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { Project, Artifact, Chat } from '../types';
import { TaskIcon } from './TaskIcon';

interface ProjectViewProps {
  project: Project;
  artifacts: Artifact[];
  tasks: any[];
  chats: Chat[];
  onBack: () => void;
  onNewTask: () => void;
  onOpenChat: (id: string) => void;
  onNewChatInProject: () => void;
}

const MEMBER_DIRECTORY = [
  { initials: 'DS', name: 'Дмитрий Соколов', role: 'Product Lead', color: '#2D6CDF' },
  { initials: 'AM', name: 'Алексей Мосин', role: 'Product Designer', color: '#B0299A' },
  { initials: 'TL', name: 'Тимур Ли', role: 'Analytics', color: '#2F9E6B' },
  { initials: 'PM', name: 'Паша Морозов', role: 'Research', color: '#0D8A8A' },
  { initials: 'AR', name: 'Алексей Романов', role: 'Growth', color: '#FF631F' },
];

export function ProjectView({
  project,
  artifacts,
  chats,
  onBack,
  onNewTask,
  onOpenChat,
}: ProjectViewProps) {
  const projectArtifacts = artifacts.filter(a => a.projectId === project.id);
  const projectChats = chats.filter(c => c.projectId === project.id);

  const visibleArtifacts = projectArtifacts.slice(0, 6);
  const visibleChats = projectChats.slice(0, 6);

  const statusLabel =
    project.status === 'active'
      ? 'В работе'
      : project.status === 'planning'
      ? 'Планирование'
      : 'Завершён';

  const statusTone =
    project.status === 'active'
      ? { bg: 'var(--green-lt)', color: 'var(--green)' }
      : project.status === 'planning'
      ? { bg: 'var(--ai-lt)', color: 'var(--ai)' }
      : { bg: 'rgba(20,24,34,0.08)', color: 'var(--ink-2)' };

  const progress = project.progress ?? 0;
  const team = (project.members || [])
    .map(initials => MEMBER_DIRECTORY.find(m => m.initials === initials))
    .filter(Boolean);

  const productIcon = getProjectIcon(project);
  const aiStatus = buildProjectAiStatus(project, projectChats.length, projectArtifacts.length);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px 40px',
        background:
          'linear-gradient(180deg, #faf8f4 0%, #f7f4ef 42%, #f4f0ea 100%)',
      }}
    >
      <div style={{ maxWidth: 1220, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <button onClick={onBack} style={pillBtn()}>
            <ArrowLeft size={14} />
            Все проекты
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--ink-2)',
            }}
          >
            <CheckCircle2 size={13} color={statusTone.color} />
            {statusLabel}
          </div>
        </div>

        <div
          style={{
            marginBottom: 18,
            padding: '22px',
            borderRadius: 28,
            border: '1px solid var(--border)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.74) 100%)',
            boxShadow: '0 10px 28px rgba(20,24,34,0.04)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 360px',
              gap: 18,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: statusTone.bg,
                  color: statusTone.color,
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                <CheckCircle2 size={12} />
                {statusLabel}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.92)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 18px rgba(20,24,34,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--ai)',
                  }}
                >
                  {productIcon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 28,
                      lineHeight: 1.05,
                      letterSpacing: '-.03em',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--ink)',
                    }}
                  >
                    {project.name}
                  </h1>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: 'var(--ink-2)',
                      lineHeight: 1.65,
                      maxWidth: 760,
                    }}
                  >
                    {project.goal?.trim() ||
                      `Проект сфокусирован на направлении "${project.product}" и помогает команде синхронизировать решения, исследования и AI-артефакты вокруг одной продуктовой цели.`}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 10,
                }}
              >
                <InfoStat label="Продукт" value={project.product || '—'} icon={<Briefcase size={13} />} />
                <InfoStat label="Участники" value={`${team.length}`} icon={<Users size={13} />} />
                <InfoStat label="Мои чаты" value={`${projectChats.length}`} icon={<MessageSquare size={13} />} />
                <InfoStat label="Артефакты" value={`${projectArtifacts.length}`} icon={<FolderOpen size={13} />} />
              </div>
            </div>

            <div
              style={{
                borderRadius: 22,
                border: '1px solid rgba(20,24,34,0.06)',
                background: 'rgba(255,255,255,0.62)',
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--ink-3)',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                Progress
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--ink)',
                  }}
                >
                  {progress}%
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-3)',
                  }}
                >
                  completion
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(20,24,34,0.08)',
                  overflow: 'hidden',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--ai)',
                    borderRadius: 999,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                <MiniMetric label="В работе" value={project.status === 'active' ? 1 : 0} />
                <MiniMetric label="Материалов" value={projectChats.length + projectArtifacts.length} />
              </div>

              <div style={{ marginTop: 14 }}>
                <button onClick={onNewTask} style={primaryActionBtn()}>
                  <Sparkles size={14} />
                  Запустить задачу
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <SectionCard
            title="Статус проекта"
            icon={<ShieldCheck size={13} color="var(--ink-3)" />}
          >
            <div
              style={{
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1.1fr .9fr',
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--ink)',
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Общий вывод AI
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--ink-2)',
                    lineHeight: 1.68,
                  }}
                >
                  {aiStatus.summary}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.58)',
                  border: '1px solid rgba(20,24,34,0.05)',
                }}
              >
                <StatusLine label="Сейчас делается" value={aiStatus.now} />
                <StatusLine label="Дальше ожидаем" value={aiStatus.next} />
                <StatusLine label="Риск / внимание" value={aiStatus.risk} noBorder />
              </div>
            </div>
          </SectionCard>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.08fr .92fr',
            gap: 18,
            marginBottom: 18,
          }}
        >
          <SectionCard
            title="Обзор проекта"
            icon={<Target size={13} color="var(--ink-3)" />}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0,
              }}
            >
              <OverviewCell label="Цель проекта" value={project.goal || 'Не указана'} />
              <OverviewCell label="Направление" value={project.product || 'Не указано'} />
              <OverviewCell label="Статус" value={statusLabel} />
              <OverviewCell label="Прогресс" value={`${progress}%`} />
            </div>
          </SectionCard>

          <SectionCard
            title="Команда и роли"
            icon={<Users size={13} color="var(--ink-3)" />}
            action={{ label: '+ Прикрепить', onClick: () => {} }}
          >
            {team.length === 0 ? (
              <EmptyState icon="👥" text="В проект пока никто не прикреплён." />
            ) : (
              team.map((member, index) => (
                <TeamRow
                  key={member!.initials}
                  member={member!}
                  bordered={index < team.length - 1}
                />
              ))
            )}
          </SectionCard>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          <SectionCard
            title="Мои чаты по проекту"
            icon={<Clock3 size={13} color="var(--ink-3)" />}
            action={{ label: '+ Новая задача', onClick: onNewTask }}
          >
            {visibleChats.length === 0 ? (
              <EmptyState icon="💬" text="Внутри проекта пока нет чатов." />
            ) : (
              visibleChats.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => onOpenChat(c.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom:
                      i < visibleChats.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <TaskIcon
                    taskId={c.ico}
                    size={28}
                    bg="var(--ai-lt)"
                    color="var(--ai)"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--ink-3)',
                      }}
                    >
                      {c.when}
                    </div>
                  </div>

                  <ArrowRight size={14} color="var(--ink-3)" />
                </button>
              ))
            )}
          </SectionCard>

          <SectionCard
            title="Артефакты проекта"
            icon={<FolderOpen size={13} color="var(--ink-3)" />}
            action={{ label: '+ Новая задача', onClick: onNewTask }}
          >
            {visibleArtifacts.length === 0 ? (
              <EmptyState icon="📄" text="Пока нет артефактов, привязанных к проекту." />
            ) : (
              visibleArtifacts.map((a, i) => (
                <ArtifactRow
                  key={a.id}
                  artifact={a}
                  bordered={i < visibleArtifacts.length - 1}
                />
              ))
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function getProjectIcon(project: Project) {
  const text = `${project.name} ${project.product} ${project.goal || ''}`.toLowerCase();

  if (text.includes('card') || text.includes('карта') || text.includes('debit')) {
    return <CreditCard size={28} strokeWidth={1.9} />;
  }

  if (text.includes('onboarding') || text.includes('онбординг') || text.includes('activation')) {
    return <Wand2 size={28} strokeWidth={1.9} />;
  }

  if (text.includes('reward') || text.includes('cashback') || text.includes('loyalty')) {
    return <Gift size={28} strokeWidth={1.9} />;
  }

  if (text.includes('metric') || text.includes('analytics') || text.includes('tracking')) {
    return <BarChart3 size={28} strokeWidth={1.9} />;
  }

  return <Briefcase size={28} strokeWidth={1.9} />;
}

function buildProjectAiStatus(project: Project, chats: number, artifacts: number) {
  const progress = project.progress ?? 0;
  const status =
    progress >= 75
      ? 'Проект движется уверенно: у команды уже есть рабочая база материалов, а дальнейшая работа похожа на доработку деталей и синхронизацию финальных решений.'
      : progress >= 45
      ? 'Проект находится в активной фазе: направление уже собрано, но ещё важно уточнить решения, зафиксировать выводы и связать их с исполнением команды.'
      : 'Проект пока в формировании: сейчас особенно важно быстро собрать первые рабочие чаты, решения и опорные артефакты, чтобы зафиксировать общее направление.';

  return {
    summary: status,
    now:
      chats > 0
        ? `Команда ведёт ${chats} рабочих чатов и собирает контекст внутри проекта.`
        : 'Нужно создать первый рабочий чат внутри проекта и зафиксировать текущий фокус.',
    next:
      artifacts > 0
        ? `Следующий шаг — обновить артефакты, синхронизировать выводы и распределить ownership.`
        : 'Следующий шаг — превратить обсуждение в первый артефакт и назначить ответственных.',
    risk:
      artifacts < chats
        ? 'Есть риск, что обсуждения опережают формализацию решений в артефактах.'
        : 'Главное — не потерять ownership и следить, чтобы новые задачи оставались внутри проекта.',
  };
}

function SectionCard({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.88)',
        borderRadius: 24,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(20,24,34,0.03)',
      }}
    >
      <div
        style={{
          padding: '13px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.52)',
        }}
      >
        {icon}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            flex: 1,
          }}
        >
          {title}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            style={{
              fontSize: 12,
              color: 'var(--ink-2)',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
}

function InfoStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: '12px 13px',
        background: 'rgba(255,255,255,0.58)',
        border: '1px solid rgba(20,24,34,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 7,
          color: 'var(--ink-3)',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {icon}
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--ink)',
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: '10px 11px',
        background: 'rgba(255,255,255,0.74)',
        border: '1px solid rgba(20,24,34,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--ink)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: 'var(--ink-3)',
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function OverviewCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: 'var(--ink-2)',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TeamRow({
  member,
  bordered,
}: {
  member: { initials: string; name: string; role: string; color: string };
  bordered: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: bordered ? '1px solid var(--border)' : 'none',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: member.color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {member.initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--ink)',
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
          }}
        >
          {member.role}
        </div>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: 'var(--ink-2)',
        }}
      >
        <button style={iconActionBtn()}>
          <UserPlus size={13} />
        </button>
        <button style={iconActionBtn()}>
          <UserMinus size={13} />
        </button>
      </div>
    </div>
  );
}

function ArtifactRow({
  artifact,
  bordered,
}: {
  artifact: Artifact;
  bordered: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderBottom: bordered ? '1px solid var(--border)' : 'none',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--ai-lt)',
          color: 'var(--ai)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        A
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {artifact.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
          }}
        >
          {artifact.skillName} · {artifact.when}
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 8px',
          borderRadius: 99,
          flexShrink: 0,
          background: artifact.status === 'done' ? 'var(--green-lt)' : 'var(--ai-lt)',
          color: artifact.status === 'done' ? 'var(--green)' : 'var(--ai)',
          border: '1px solid rgba(20,24,34,0.04)',
        }}
      >
        {artifact.status === 'done' ? 'Готово' : 'Черновик'}
      </div>
    </div>
  );
}

function StatusLine({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) {
  return (
    <div
      style={{
        paddingBottom: noBorder ? 0 : 10,
        marginBottom: noBorder ? 0 : 10,
        borderBottom: noBorder ? 'none' : '1px solid rgba(20,24,34,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          lineHeight: 1.55,
          color: 'var(--ink-2)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        padding: '28px 16px',
        textAlign: 'center',
        color: 'var(--ink-3)',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12.5 }}>{text}</div>
    </div>
  );
}

function pillBtn(): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.82)',
    color: 'var(--ink)',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  };
}

function primaryActionBtn(): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid transparent',
    background: 'var(--orange)',
    color: '#fff',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  };
}

function iconActionBtn(): React.CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.78)',
    color: 'var(--ink-2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };
}