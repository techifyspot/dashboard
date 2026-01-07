import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Clock,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  Link2,
  Tag,
  MessageSquare,
  Paperclip,
  Key,
  Search,
  Filter,
  Settings,
  Users,
  FileText,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId: string;
  assignee?: string;
  projectKey: string;
  taskNumber: number;
  labels?: string[];
  links?: { url: string; title: string }[];
  comments?: number;
  attachments?: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  createdAt: Date;
  tasks: Task[];
  members?: string[];
}

const mockMembers = [
  { id: '1', name: 'John Doe', avatar: 'JD' },
  { id: '2', name: 'Jane Smith', avatar: 'JS' },
  { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
  { id: '4', name: 'Sarah Wilson', avatar: 'SW' },
];

const labels = [
  { id: 'frontend', name: 'Frontend', color: 'bg-blue-500' },
  { id: 'backend', name: 'Backend', color: 'bg-green-500' },
  { id: 'bug', name: 'Bug', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature', color: 'bg-purple-500' },
  { id: 'urgent', name: 'Urgent', color: 'bg-orange-500' },
];

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete 
}: { 
  task: Task; 
  onEdit: () => void; 
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-info/20 text-info border-info/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const assignee = mockMembers.find(m => m.id === task.assignee);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group mb-3"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              {task.projectKey}-{task.taskNumber}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((labelId) => {
            const label = labels.find(l => l.id === labelId);
            return label ? (
              <span key={labelId} className={`text-xs px-2 py-0.5 rounded ${label.color} text-white`}>
                {label.name}
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          {task.assignee && assignee && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {assignee.avatar}
            </div>
          )}
          {task.links && task.links.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Link2 className="w-3.5 h-3.5" />
              <span className="text-xs">{task.links.length}</span>
            </div>
          )}
          {task.attachments && task.attachments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-xs">{task.attachments}</span>
            </div>
          )}
          {task.comments && task.comments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{task.comments}</span>
            </div>
          )}
        </div>
        {task.dueDate && (
          <span className={`text-xs flex items-center gap-1 ${
            new Date(task.dueDate) < new Date() ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            <Calendar className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const ProjectManagement = () => {
  const { projects, addTask, updateTask, deleteTask, moveTask, addProject, deleteProject } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: '',
    labels: [] as string[],
    links: [] as { url: string; title: string }[],
    dueDate: '',
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    key: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Initialize with first project or create mock projects
  const allProjects: Project[] = projects.length > 0 ? projects.map(p => ({
    ...p,
    key: p.name.substring(0, 4).toUpperCase(),
    members: mockMembers.map(m => m.id),
    tasks: (p.tasks || []).map((t, idx) => ({
      ...t,
      projectKey: p.name.substring(0, 4).toUpperCase(),
      taskNumber: idx + 1,
      status: t.status as 'todo' | 'in-progress' | 'review' | 'done',
      assignee: undefined,
      labels: [],
      links: undefined,
    } as Task)),
  })) : [
    {
      id: '1',
      name: 'Web Application',
      description: 'Main web application project',
      key: 'WEB',
      status: 'active',
      progress: 65,
      createdAt: new Date(),
      tasks: [
        {
          id: 't1',
          title: 'Implement user authentication',
          description: 'Add login and signup functionality',
          status: 'done',
          priority: 'high',
          projectId: '1',
          assignee: '1',
          projectKey: 'WEB',
          taskNumber: 1,
          labels: ['frontend', 'feature'],
          links: [{ url: 'https://example.com', title: 'Design Mockup' }],
          comments: 3,
          attachments: 2,
        },
        {
          id: 't2',
          title: 'Fix responsive layout issues',
          description: 'Mobile view needs improvements',
          status: 'in-progress',
          priority: 'medium',
          projectId: '1',
          assignee: '2',
          projectKey: 'WEB',
          taskNumber: 2,
          labels: ['frontend', 'bug'],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: 't3',
          title: 'Setup API endpoints',
          description: 'Create REST API for data management',
          status: 'todo',
          priority: 'high',
          projectId: '1',
          assignee: '3',
          projectKey: 'WEB',
          taskNumber: 3,
          labels: ['backend', 'feature'],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      members: mockMembers.map(m => m.id),
    },
  ];

  const currentProject = selectedProject || allProjects[0];
  const tasks = currentProject?.tasks || [];

  const columns: { id: 'todo' | 'in-progress' | 'review' | 'done'; label: string; icon: React.ReactNode }[] = [
    { id: 'todo', label: 'To Do', icon: <Circle className="w-4 h-4 text-muted-foreground" /> },
    { id: 'in-progress', label: 'In Progress', icon: <Clock className="w-4 h-4 text-warning" /> },
    { id: 'review', label: 'Review', icon: <Eye className="w-4 h-4 text-primary" /> },
    { id: 'done', label: 'Done', icon: <CheckCircle2 className="w-4 h-4 text-success" /> },
  ];

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        const overColumn = columns.find(col => {
          const columnTasks = tasks.filter(t => t.status === col.id);
          return columnTasks.some(t => t.id === over.id) || over.id === col.id;
        });
        
        if (overColumn) {
          // Map review status to in-progress for store compatibility
          const storeStatus = overColumn.id === 'review' ? 'in-progress' : (overColumn.id === 'todo' || overColumn.id === 'in-progress' || overColumn.id === 'done' ? overColumn.id : 'in-progress');
          if (storeStatus === 'todo' || storeStatus === 'in-progress' || storeStatus === 'done') {
            moveTask(taskId, storeStatus);
          }
          // Update local task status
          if (currentProject) {
            const updatedTasks = currentProject.tasks.map(t =>
              t.id === taskId ? { ...t, status: overColumn.id } : t
            );
            setSelectedProject({ ...currentProject, tasks: updatedTasks });
          }
          toast.success(`Task moved to ${overColumn.label}`);
        }
      }
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (!currentProject) {
      toast.error('Please select a project');
      return;
    }

    const taskNumber = tasks.length + 1;
    // Create task data compatible with store
    const storeTaskData = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'todo' as const,
      projectId: currentProject.id,
    };

    addTask(storeTaskData);
    
    // Update local project tasks
    if (currentProject) {
      const localTask: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'todo',
        projectId: currentProject.id,
        assignee: newTask.assignee || undefined,
        projectKey: currentProject.key,
        taskNumber,
        labels: newTask.labels,
        links: newTask.links.length > 0 ? newTask.links : undefined,
      };
      setSelectedProject({
        ...currentProject,
        tasks: [...currentProject.tasks, localTask],
      });
    }
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      labels: [],
      links: [],
      dueDate: '',
    });
    setShowNewTaskModal(false);
    toast.success('Task created successfully');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee || '',
      labels: task.labels || [],
      links: task.links || [],
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) {
      toast.error('No task selected for editing');
      return;
    }

    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    // Update store task (basic fields only)
    updateTask(editingTask.id, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    });

    // Update local project task with extended fields
    if (currentProject) {
      const updatedTasks = currentProject.tasks.map(t =>
        t.id === editingTask.id
          ? {
              ...t,
              title: newTask.title,
              description: newTask.description,
              priority: newTask.priority,
              assignee: newTask.assignee || undefined,
              labels: newTask.labels,
              links: newTask.links.length > 0 ? newTask.links : undefined,
              dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
            }
          : t
      );
      setSelectedProject({
        ...currentProject,
        tasks: updatedTasks,
      });
    }

    setShowEditTaskModal(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      labels: [],
      links: [],
      dueDate: '',
    });
    toast.success('Task updated successfully');
  };

  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!newProject.key.trim()) {
      toast.error('Please enter a project key');
      return;
    }

    addProject({
      name: newProject.name,
      description: newProject.description,
      status: 'active',
      progress: 0,
    });
    
    setNewProject({ name: '', description: '', key: '' });
    setShowNewProjectModal(false);
    toast.success('Project created successfully');
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      `${task.projectKey}-${task.taskNumber}`.toLowerCase().includes(query)
    );
  });

  const getColumnTasks = (columnId: string) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  const draggedTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground mt-1">Trello-like project boards with tasks and assignments</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={currentProject?.id || ''}
            onValueChange={(value) => setSelectedProject(allProjects.find(p => p.id === value) || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {allProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-primary" />
                    <span>{project.key}</span>
                    <span className="text-muted-foreground">- {project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowNewProjectModal(true)}
            variant="outline"
            size="icon"
            className="h-10 w-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Project Info */}
      {currentProject && (
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm font-semibold text-primary">{currentProject.key}</span>
                  <h2 className="text-xl font-bold text-foreground">{currentProject.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{currentProject.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="text-lg font-bold text-foreground">{currentProject.progress}%</div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{currentProject.members?.length || 0} members</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <Button
        onClick={() => {
          if (!currentProject) {
            toast.error('Please select a project first');
            return;
          }
          setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            assignee: '',
            labels: [],
            links: [],
            dueDate: '',
          });
          setShowNewTaskModal(true);
        }}
        className="btn-gradient"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = getColumnTasks(column.id);
            
            return (
              <div key={column.id} className="glass-panel p-4 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {column.icon}
                    <h3 className="font-semibold text-foreground">{column.label}</h3>
                    <Badge variant="outline" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>
                
                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[400px]">
                    <AnimatePresence>
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={() => handleEditTask(task)}
                          onDelete={() => {
                            deleteTask(task.id);
                            toast.success('Task deleted');
                          }}
                        />
                      ))}
                    </AnimatePresence>
                    
                    {columnTasks.length === 0 && (
                      <div className="h-32 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Drop tasks here</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
        <DragOverlay>
          {draggedTask ? (
            <div className="p-4 rounded-lg bg-card border-2 border-primary shadow-lg w-[300px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {draggedTask.projectKey}-{draggedTask.taskNumber}
                </span>
              </div>
              <h4 className="font-semibold text-foreground">{draggedTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTaskModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl glass-panel p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Create New Task</h2>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
                    <Select
                      value={newTask.assignee}
                      onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {mockMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => {
                          const newLabels = newTask.labels.includes(label.id)
                            ? newTask.labels.filter(l => l !== label.id)
                            : [...newTask.labels, label.id];
                          setNewTask({ ...newTask, labels: newLabels });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          newTask.labels.includes(label.id)
                            ? `${label.color} text-white`
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    onClick={() => setShowNewTaskModal(false)}
                    variant="outline"
                    className="flex-1 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTask}
                    className="flex-1 w-full sm:w-auto btn-gradient"
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {showEditTaskModal && editingTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditTaskModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] md:w-full max-w-2xl glass-panel p-4 sm:p-6 z-50 max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Edit Task</h2>
                <button
                  onClick={() => setShowEditTaskModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
                    <Select
                      value={newTask.assignee}
                      onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {mockMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => {
                          const newLabels = newTask.labels.includes(label.id)
                            ? newTask.labels.filter(l => l !== label.id)
                            : [...newTask.labels, label.id];
                          setNewTask({ ...newTask, labels: newLabels });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          newTask.labels.includes(label.id)
                            ? `${label.color} text-white`
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    onClick={() => setShowEditTaskModal(false)}
                    variant="outline"
                    className="flex-1 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTask}
                    className="flex-1 w-full sm:w-auto btn-gradient"
                  >
                    Update Task
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewProjectModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] md:w-full max-w-md glass-panel p-4 sm:p-6 z-50 mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Create New Project</h2>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Key *</label>
                  <Input
                    type="text"
                    value={newProject.key}
                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                    placeholder="e.g., WEB, API, MOB"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Name *</label>
                  <Input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    onClick={() => setShowNewProjectModal(false)}
                    variant="outline"
                    className="flex-1 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProject}
                    className="flex-1 w-full sm:w-auto btn-gradient"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagement;
