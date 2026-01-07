import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MessageSquare,
  Mail,
  X,
  Send,
  Clock,
  Activity,
  GitBranch,
  Code,
  Monitor,
  Share2,
  Video,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Webhook,
  Cloud,
  Server,
  Terminal,
  BarChart3,
  Calendar,
  User,
  Eye,
  Download,
  Upload,
  Link2,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  editing?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  project: string;
}

interface Deployment {
  id: string;
  project: string;
  environment: 'production' | 'staging' | 'development';
  status: 'success' | 'failed' | 'running' | 'pending';
  version: string;
  commit: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  triggeredBy: string;
  buildNumber: number;
}

interface Integration {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'jenkins' | 'docker' | 'kubernetes' | 'aws';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  webhook?: string;
}

const mockMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', email: 'john@techifyspot.com', role: 'admin', avatar: 'JD', status: 'online', lastActive: 'Now', editing: 'dashboard.tsx' },
  { id: '2', name: 'Jane Smith', email: 'jane@techifyspot.com', role: 'editor', avatar: 'JS', status: 'online', lastActive: 'Now', editing: 'api.ts' },
  { id: '3', name: 'Bob Wilson', email: 'bob@techifyspot.com', role: 'editor', avatar: 'BW', status: 'away', lastActive: '15 min ago' },
  { id: '4', name: 'Alice Johnson', email: 'alice@techifyspot.com', role: 'viewer', avatar: 'AJ', status: 'offline', lastActive: '2 hours ago' },
];

const mockComments: Comment[] = [
  { id: '1', author: 'Jane Smith', avatar: 'JS', content: 'Great progress on the AI module!', time: '10 min ago', project: 'AI Code Assistant' },
  { id: '2', author: 'Bob Wilson', avatar: 'BW', content: 'Found a bug in the deployment script', time: '1 hour ago', project: 'DevOps Pipeline' },
  { id: '3', author: 'John Doe', avatar: 'JD', content: 'Updated the documentation for the API', time: '2 hours ago', project: 'AI Code Assistant' },
];

const mockDeployments: Deployment[] = [
  {
    id: '1',
    project: 'Web Application',
    environment: 'production',
    status: 'success',
    version: 'v2.1.0',
    commit: 'a3f5b2c',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    duration: 5,
    triggeredBy: 'John Doe',
    buildNumber: 1245,
  },
  {
    id: '2',
    project: 'API Service',
    environment: 'staging',
    status: 'running',
    version: 'v1.8.3',
    commit: 'd7e9f1a',
    startedAt: new Date(Date.now() - 10 * 60 * 1000),
    triggeredBy: 'Jane Smith',
    buildNumber: 892,
  },
  {
    id: '3',
    project: 'Mobile App',
    environment: 'development',
    status: 'failed',
    version: 'v0.5.2',
    commit: 'b4c6d8e',
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2 * 60 * 1000),
    duration: 2,
    triggeredBy: 'Bob Wilson',
    buildNumber: 567,
  },
];

const mockIntegrations: Integration[] = [
  { id: '1', name: 'GitHub', type: 'github', status: 'connected', lastSync: new Date(Date.now() - 5 * 60 * 1000), webhook: 'https://api.github.com/webhook' },
  { id: '2', name: 'Jenkins CI', type: 'jenkins', status: 'connected', lastSync: new Date(Date.now() - 10 * 60 * 1000) },
  { id: '3', name: 'Docker Hub', type: 'docker', status: 'connected', lastSync: new Date(Date.now() - 15 * 60 * 1000) },
  { id: '4', name: 'AWS ECS', type: 'aws', status: 'error', lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000) },
];

const Collaboration = () => {
  const [members, setMembers] = useState(mockMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [deployments] = useState(mockDeployments);
  const [integrations] = useState(mockIntegrations);
  const [activeTab, setActiveTab] = useState<'collaboration' | 'deployment'>('collaboration');

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    toast.success('Invitation sent!', { description: `Invited ${inviteEmail} as ${inviteRole}` });
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'YO',
      content: newComment,
      time: 'Just now',
      project: 'AI Code Assistant',
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added');
  };

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success('Role updated');
  };

  const statusColors = {
    online: 'bg-success',
    away: 'bg-warning',
    offline: 'bg-muted-foreground',
  };

  const roleColors = {
    admin: 'bg-primary/20 text-primary border-primary/30',
    editor: 'bg-accent/20 text-accent border-accent/30',
    viewer: 'bg-muted text-muted-foreground border-border',
  };

  const deploymentStatusColors = {
    success: 'bg-success/20 text-success border-success/30',
    failed: 'bg-destructive/20 text-destructive border-destructive/30',
    running: 'bg-warning/20 text-warning border-warning/30',
    pending: 'bg-muted text-muted-foreground border-border',
  };

  const integrationStatusColors = {
    connected: 'bg-success/20 text-success',
    disconnected: 'bg-muted text-muted-foreground',
    error: 'bg-destructive/20 text-destructive',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team Collaboration & Deployment</h1>
          <p className="text-muted-foreground mt-1">Multi-user editing, version control, and deployment monitoring</p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="btn-gradient"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('collaboration')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'collaboration'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Team Collaboration
        </button>
        <button
          onClick={() => setActiveTab('deployment')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'deployment'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cloud className="w-4 h-4 inline mr-2" />
          Deployment & Integration
        </button>
      </div>

      {/* Collaboration Tab */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          {/* Team Members Section */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Team Members</h3>
                <p className="text-sm text-muted-foreground">Multi-user editing and real-time collaboration</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {members.length} members
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {member.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusColors[member.status]}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {member.editing && (
                    <div className="mb-3 p-2 rounded bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-xs">
                        <Code className="w-3 h-3 text-primary" />
                        <span className="text-primary font-medium">Editing:</span>
                        <span className="text-muted-foreground font-mono">{member.editing}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {member.lastActive}
                      </span>
                    </div>
                    <Select
                      value={member.role}
                      onValueChange={(value: 'admin' | 'editor' | 'viewer') => handleRoleChange(member.id, value)}
                    >
                      <SelectTrigger className={`h-7 text-xs border ${roleColors[member.role]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Collaboration Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Multi-User Editing</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time collaborative editing with live cursor positions and change tracking.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Live cursor tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Conflict resolution</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Version history</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Version Control</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Integrated Git workflow with branch management and merge requests.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Git integration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Branch management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Merge requests</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Communication</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Integrated chat, comments, and notifications for seamless collaboration.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Real-time chat</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Code comments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-foreground">Notifications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Project Comments</h3>
            </div>
            
            <div className="flex gap-3 mb-6">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="btn-gradient"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-foreground">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                    <Badge variant="outline" className="text-xs">
                      {comment.project}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deployment Tab */}
      {activeTab === 'deployment' && (
        <div className="space-y-6">
          {/* Integration Status */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Integration Status</h3>
                <p className="text-sm text-muted-foreground">Connected services and webhooks</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Webhook className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{integration.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{integration.type}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${integrationStatusColors[integration.status]}`}>
                      {integration.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-foreground">
                        {new Date(integration.lastSync).toLocaleTimeString()}
                      </span>
                    </div>
                    {integration.webhook && (
                      <div className="flex items-center gap-2 text-xs">
                        <Link2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{integration.webhook}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deployment History */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Deployment History</h3>
                <p className="text-sm text-muted-foreground">CI/CD pipeline monitoring and status</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Simulate refresh
                  toast.success('Deployment history refreshed');
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4 overflow-x-auto">
              {deployments.map((deployment, index) => (
                <motion.div
                  key={deployment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 sm:p-4 rounded-lg bg-secondary/50 border border-border min-w-[300px]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{deployment.project}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {deployment.environment}
                        </Badge>
                        <Badge className={`text-xs border ${deploymentStatusColors[deployment.status]}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(deployment.status)}
                            {deployment.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5" />
                          {deployment.version}
                        </span>
                        <span className="font-mono text-xs">{deployment.commit}</span>
                        <span>Build #{deployment.buildNumber}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground mb-1">Triggered by</p>
                      <p className="text-sm font-medium text-foreground">{deployment.triggeredBy}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="truncate">{new Date(deployment.startedAt).toLocaleString()}</span>
                      </span>
                      {deployment.duration && (
                        <span>Duration: {deployment.duration} min</span>
                      )}
                    </div>
                    {deployment.status === 'running' && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-warning" />
                        <span className="text-warning">In Progress</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CI/CD Pipeline Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Continuous Integration</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Build Success Rate</span>
                    <span className="text-sm font-semibold text-success">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Test Coverage</span>
                    <span className="text-sm font-semibold text-primary">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Average Build Time</span>
                    <span className="text-sm font-semibold text-foreground">4.2 min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Continuous Deployment</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Deployment Success Rate</span>
                    <span className="text-sm font-semibold text-success">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Uptime</span>
                    <span className="text-sm font-semibold text-success">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">Average Deployment Time</span>
                    <span className="text-sm font-semibold text-foreground">2.8 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
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
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Invite Team Member</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="pl-11"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value: 'admin' | 'editor' | 'viewer') => setInviteRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin - Full access</SelectItem>
                      <SelectItem value="editor">Editor - Can edit projects</SelectItem>
                      <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    onClick={() => setShowInviteModal(false)}
                    variant="outline"
                    className="flex-1 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInvite}
                    className="flex-1 w-full sm:w-auto btn-gradient"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Invite
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

export default Collaboration;
