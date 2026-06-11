import React from 'react';
import {
  FileText, Lightbulb, Map, ClipboardList, RefreshCw, HelpCircle,
  Megaphone, Pencil, BarChart2, Target,
  BookOpen, Layers, User, Mic, FileQuestion,
  TrendingUp, TestTube, Users, Filter, Database,
  Cpu, Plug, Code2, Bug, CheckSquare,
  Smartphone, Monitor, Globe, Palette,
  LucideIcon,
} from 'lucide-react';

export const TASK_ICONS: Record<string, LucideIcon> = {
  // PM
  prd: FileText,
  jtbd: Lightbulb,
  roadmap: Map,
  brief: ClipboardList,
  retro: RefreshCw,
  hypothesis: HelpCircle,
  // PMM
  gtm: Megaphone,
  copy: Pencil,
  competitive: BarChart2,
  positioning: Target,
  // Research
  desk: BookOpen,
  synth: Layers,
  persona: User,
  custdev: Mic,
  survey: FileQuestion,
  // Data
  metrics: TrendingUp,
  abtest: TestTube,
  cohort: Users,
  funnel: Filter,
  sql: Database,
  // Dev
  techspec: Cpu,
  apispec: Plug,
  codereview: Code2,
  bug: Bug,
  tests: CheckSquare,
  // Build
  'proto-mobile': Smartphone,
  'proto-web': Monitor,
  'proto-landing': Globe,
  'proto-visual': Palette,
};

interface TaskIconProps {
  taskId: string;
  size?: number;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}

export function TaskIcon({ taskId, size = 32, color = 'var(--ai)', bg = 'var(--ai-lt)', style }: TaskIconProps) {
  const Icon = TASK_ICONS[taskId];
  const iconSize = Math.round(size * 0.5);
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}>
      {Icon ? <Icon size={iconSize} color={color} strokeWidth={1.75} /> : null}
    </div>
  );
}
