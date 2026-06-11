export type View = 'dashboard' | 'tasks' | 'project' | 'chat' | 'artifacts' | 'team';

export type TaskCat = 'pm' | 'pmm' | 'res' | 'data' | 'dev' | 'build';
export type TaskKind = 'doc' | 'proto';

// Фаза 1: аддитивная подготовка к модели «Навык / Промт».
// Навык — устойчивый сценарий с предсказуемой структурой артефакта.
// Промт — более лёгкая заготовка / свободный запуск.
// Поле необязательное, существующий код продолжает работать с Task как раньше.
export type TaskEntity = 'skill' | 'prompt';

export interface Task {
  id: string;
  cat: TaskCat;
  kind: TaskKind;
  ico: string;
  name: string;
  desc: string;
  entity?: TaskEntity;
}

export interface ProjectMember {
  initials: string;
  name: string;
  role: string;
  color: string;
  contributions: number;
  lastActive: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  date: string;
  done: boolean;
}

export interface ProjectConclusion {
  id: string;
  text: string;
  status: 'done' | 'in_progress' | 'planned';
  author: string;
  initials: string;
  color: string;
  when: string;
}

export interface Project {
  id: string;
  name: string;
  product: string;
  status: 'active' | 'planning' | 'archived';
  goal: string;
  progress: number;
  members: string[];
  chats: number;
  teamMembers?: ProjectMember[];
  milestones?: ProjectMilestone[];
  conclusions?: ProjectConclusion[];
  startDate?: string;
  targetDate?: string;
  kpi?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'thinking';
  type?: 'artifact' | 'text';
  text?: string;
  taskId?: string;
  title?: string;
  docHtml?: string;
}

export interface Chat {
  id: string;
  title: string;
  ico: string;
  projectId: string | null;
  when: string;
  messages: Message[];
}

export interface Artifact {
  id: string;
  title: string;
  taskId: string;
  skillName: string;
  status: 'done' | 'draft';
  projectName: string | null;
  projectId: string | null;
  author: string;
  initials: string;
  when: string;
  chatId: string | null;
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  company: string;
  color: string;
}

export type OverlayKind = 'newProject' | 'profile' | 'artifactExpand' | 'companyProfile' | null;

export interface AppState {
  currentView: View;
  currentProjectId: string | null;
  currentChatId: string | null;
  projects: Project[];
  tasks: Task[];
  chats: Chat[];
  artifacts: Artifact[];
  armedTaskId: string | null;
  armedTaskIds: string[];
  taskFilter: 'all' | TaskCat;
  taskQuery: string;
  sidebarOpen: boolean;
  profile: Profile;
  overlay: OverlayKind;
  expandedArtifactId: string | null;
  toasts: Toast[];
  recentTaskIds: string[];
}

export interface Toast {
  id: string;
  text: string;
  kind: 'success' | 'info';
}
