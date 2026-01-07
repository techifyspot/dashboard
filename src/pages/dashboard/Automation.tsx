import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Workflow, 
  Zap, 
  ArrowRight, 
  Play,
  Pause,
  Trash2,
  X,
  CheckCircle2,
  GitBranch as LinkIcon,
  UploadCloud,
  Server,
  Loader2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  GitBranch,
  Shield,
  BarChart3,
  Send,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  callGroqAPI,
  generateWorkflowPrompt,
} from '@/services/groqApi';

const triggers = [
  'On Push',
  'On Pull Request',
  'Pull Request Merged',
  'Code Committed',
  'On Build Failure',
  'Deployment Complete',
  'Scheduled (Daily)',
  'Scheduled (Weekly)',
];

interface WorkflowAction {
  label: string;
  icon: typeof Play;
  color: string;
}

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  actions: WorkflowAction[];
  isActive: boolean;
  description?: string;
}

interface FeatureCard {
  id: string;
  name: string;
  description: string;
  icon: typeof Workflow;
  color: string;
  gradient: string;
}

const featureCards: FeatureCard[] = [
  {
    id: 'workflow-automator',
    name: 'Workflow Automator',
    description: 'Create custom automation workflows',
    icon: LinkIcon,
    color: 'text-primary',
    gradient: ''
  },
  {
    id: 'smart-deployment',
    name: 'Smart Deployment',
    description: 'AI-managed CI/CD with automated testing',
    icon: UploadCloud,
    color: 'text-success',
    gradient: ''
  },
  {
    id: 'cloud-deploy',
    name: 'Cloud Deploy',
    description: 'One-click cloud deployment simulation',
    icon: Server,
    color: 'text-warning',
    gradient: ''
  },
];

const Automation = () => {
  const { workflows: storeWorkflows, addWorkflow, toggleWorkflow, deleteWorkflow } = useAppStore();
  const [activeFeature, setActiveFeature] = useState('workflow-automator');
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('On Push');
  const [isGenerating, setIsGenerating] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Auto Deploy on PR Merge',
      trigger: 'Pull Request Merged',
      isActive: true,
      actions: [
        { label: 'Run Tests', icon: Play, color: 'text-primary' },
        { label: 'Build', icon: Zap, color: 'text-warning' },
        { label: 'Deploy to Staging', icon: Server, color: 'text-success' },
      ]
    },
    {
      id: '2',
      name: 'Security Scan on Commit',
      trigger: 'Code Committed',
      isActive: true,
      actions: [
        { label: 'Security Scan', icon: Shield, color: 'text-destructive' },
        { label: 'Send Report', icon: Send, color: 'text-primary' },
        { label: 'Block if Critical', icon: AlertTriangle, color: 'text-warning' },
      ]
    },
    {
      id: '3',
      name: 'Performance Monitoring',
      trigger: 'Deployment Complete',
      isActive: false,
      actions: [
        { label: 'Run Performance Tests', icon: Activity, color: 'text-success' },
        { label: 'Send Metrics', icon: BarChart3, color: 'text-primary' },
        { label: 'Alert if Degraded', icon: AlertTriangle, color: 'text-warning' },
      ]
    },
  ]);

  const getApiKey = () => {
    return import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
  };

  const handleGenerateWorkflow = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast.error('Groq API key not found. Please configure it first.');
      return;
    }

    if (!workflowDescription.trim()) {
      toast.error('Please describe what the workflow should do');
      return;
    }

    setIsGenerating(true);

    try {
      const messages = generateWorkflowPrompt(workflowDescription);
      const result = await callGroqAPI(apiKey, messages);
      
      // Parse the AI response to extract workflow details
      // For now, we'll create a workflow with the description
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: workflowName || 'AI Generated Workflow',
        trigger: selectedTrigger,
        description: workflowDescription,
        isActive: true,
        actions: [
          { label: 'Run Tests', icon: Play, color: 'text-primary' },
          { label: 'Build', icon: Zap, color: 'text-warning' },
          { label: 'Deploy', icon: Server, color: 'text-success' },
        ]
      };

      setWorkflows([...workflows, newWorkflow]);
      addWorkflow({
        name: newWorkflow.name,
        trigger: newWorkflow.trigger,
        action: newWorkflow.actions.map(a => a.label).join(', '),
        isActive: true,
      });

      setWorkflowName('');
      setWorkflowDescription('');
      toast.success('Workflow created successfully with AI assistance!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate workflow');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
    toggleWorkflow(id);
    const workflow = workflows.find(w => w.id === id);
    toast.success(workflow?.isActive ? 'Workflow paused' : 'Workflow activated');
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    deleteWorkflow(id);
    toast.success('Workflow deleted');
  };

  const handleActionClick = (workflowId: string, actionLabel: string) => {
    toast.info(`${actionLabel} triggered for workflow`);
    // In a real implementation, this would trigger the actual action
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-destructive">Workflow Automator</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          Create custom automation workflows with AI-powered configuration
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFeature(feature.id)}
              className={`glass-panel p-4 cursor-pointer transition-all relative overflow-hidden group ${
                isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              }`}
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-secondary/50 ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <Badge variant="outline" className="text-xs border-destructive text-destructive">
                      Active
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{feature.name}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Workflow Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-4 lg:p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Create New Workflow</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Workflow Name</label>
              <Input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g., Auto Deploy on PR Merge"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Describe what this workflow should do..."
                className="w-full h-32 resize-none"
              />
              <div className="flex items-center justify-end mt-1">
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Trigger</label>
              <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggers.map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateWorkflow}
              disabled={isGenerating || !workflowDescription.trim()}
              className="w-full bg-destructive hover:bg-destructive/90 h-11"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Active Workflows Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-4 lg:p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Active Workflows</h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-dark">
            {workflows.map((workflow) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  workflow.isActive 
                    ? 'bg-secondary/30 border-primary/20' 
                    : 'bg-secondary/10 border-border/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{workflow.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          workflow.isActive 
                            ? 'border-destructive text-destructive' 
                            : 'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {workflow.isActive ? 'active' : 'paused'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Trigger: {workflow.trigger}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleWorkflow(workflow.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        workflow.isActive ? 'bg-destructive' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          workflow.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {workflow.actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index}
                        onClick={() => handleActionClick(workflow.id, action.label)}
                        variant="outline"
                        size="sm"
                        className={`h-8 text-xs ${action.color} border-border/50 hover:border-current`}
                      >
                        <ActionIcon className="w-3 h-3 mr-1" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {workflows.length === 0 && (
              <div className="text-center py-12">
                <Workflow className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No workflows yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Automation;
