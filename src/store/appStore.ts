import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'individual' | 'team' | 'enterprise';
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  createdAt: Date;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId: string;
}

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  projects: Project[];
  workflows: Workflow[];
  notifications: Notification[];
  sidebarCollapsed: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  
  // Workflow actions
  addWorkflow: (workflow: Omit<Workflow, 'id'>) => void;
  toggleWorkflow: (id: string) => void;
  deleteWorkflow: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // UI actions
  toggleSidebar: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock data for initial state
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'AI Code Assistant',
    description: 'Build an intelligent code completion system',
    status: 'active',
    progress: 75,
    createdAt: new Date('2024-01-15'),
    tasks: [
      { id: 't1', title: 'Set up ML pipeline', description: 'Configure TensorFlow model', status: 'done', priority: 'high', projectId: '1' },
      { id: 't2', title: 'Implement code analysis', description: 'Parse AST for context', status: 'in-progress', priority: 'high', projectId: '1' },
      { id: 't3', title: 'Build suggestion UI', description: 'Create autocomplete dropdown', status: 'todo', priority: 'medium', projectId: '1' },
    ],
  },
  {
    id: '2',
    name: 'DevOps Pipeline',
    description: 'Automated CI/CD workflow system',
    status: 'active',
    progress: 45,
    createdAt: new Date('2024-02-01'),
    tasks: [
      { id: 't4', title: 'Configure GitHub Actions', description: 'Set up workflow files', status: 'done', priority: 'high', projectId: '2' },
      { id: 't5', title: 'Add test automation', description: 'Jest and Cypress setup', status: 'in-progress', priority: 'medium', projectId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Real-time metrics visualization platform',
    status: 'active',
    progress: 30,
    createdAt: new Date('2024-02-15'),
    tasks: [
      { id: 't6', title: 'Design chart components', description: 'Create reusable Recharts', status: 'in-progress', priority: 'high', projectId: '3' },
    ],
  },
];

const mockWorkflows: Workflow[] = [
  { id: 'w1', name: 'Auto Deploy', trigger: 'On merge to main', action: 'Deploy to production', isActive: true },
  { id: 'w2', name: 'Code Review', trigger: 'On PR opened', action: 'Run AI code review', isActive: true },
  { id: 'w3', name: 'Notify Slack', trigger: 'On build failure', action: 'Send Slack alert', isActive: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      projects: mockProjects,
      workflows: mockWorkflows,
      notifications: [
        { id: 'n1', title: 'Welcome!', message: 'Your AI workspace is ready', type: 'success', read: false, createdAt: new Date() },
        { id: 'n2', title: 'Build Complete', message: 'AI Code Assistant deployed successfully', type: 'info', read: false, createdAt: new Date() },
      ],
      sidebarCollapsed: false,

      login: async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (email && password.length >= 6) {
          set({
            user: {
              id: generateId(),
              name: email.split('@')[0],
              email,
              role: 'individual',
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      signup: async (name, email, password, role) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (name && email && password.length >= 6) {
          set({
            user: {
              id: generateId(),
              name,
              email,
              role,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: generateId(),
          createdAt: new Date(),
          tasks: [],
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addTask: (task) => {
        const newTask: Task = { ...task, id: generateId() };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === task.projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
          ),
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          })),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.filter((t) => t.id !== id),
          })),
        }));
      },

      moveTask: (taskId, newStatus) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          })),
        }));
      },

      addWorkflow: (workflow) => {
        set((state) => ({
          workflows: [...state.workflows, { ...workflow, id: generateId() }],
        }));
      },

      toggleWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, isActive: !w.isActive } : w
          ),
        }));
      },

      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            { ...notification, id: generateId(), createdAt: new Date(), read: false },
            ...state.notifications,
          ],
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
    }),
    {
      name: 'techifyspot-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        projects: state.projects,
        workflows: state.workflows,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
