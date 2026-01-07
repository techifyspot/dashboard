import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  Code,
  Users,
  Clock,
  Zap,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  GitBranch,
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Rocket
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const velocityData = [
  { week: 'W1', velocity: 42, target: 40, completed: 38 },
  { week: 'W2', velocity: 38, target: 40, completed: 35 },
  { week: 'W3', velocity: 45, target: 42, completed: 42 },
  { week: 'W4', velocity: 52, target: 45, completed: 48 },
  { week: 'W5', velocity: 48, target: 45, completed: 45 },
  { week: 'W6', velocity: 55, target: 48, completed: 52 },
  { week: 'W7', velocity: 62, target: 50, completed: 58 },
  { week: 'W8', velocity: 58, target: 52, completed: 55 },
];

const codeEfficiencyData = [
  { month: 'Jan', linesAdded: 4200, linesRemoved: 1800, commits: 156, tests: 89 },
  { month: 'Feb', linesAdded: 5100, linesRemoved: 2200, commits: 189, tests: 112 },
  { month: 'Mar', linesAdded: 4800, linesRemoved: 2500, commits: 178, tests: 98 },
  { month: 'Apr', linesAdded: 6200, linesRemoved: 2800, commits: 212, tests: 134 },
  { month: 'May', linesAdded: 5800, linesRemoved: 3100, commits: 198, tests: 125 },
  { month: 'Jun', linesAdded: 7200, linesRemoved: 3400, commits: 245, tests: 156 },
];

const bugData = [
  { severity: 'Critical', count: 2, resolved: 2, open: 0 },
  { severity: 'High', count: 8, resolved: 6, open: 2 },
  { severity: 'Medium', count: 24, resolved: 18, open: 6 },
  { severity: 'Low', count: 45, resolved: 32, open: 13 },
];

const aiUsageData = [
  { feature: 'Code Review', usage: 85, efficiency: 92 },
  { feature: 'Bug Detection', usage: 72, efficiency: 88 },
  { feature: 'Suggestions', usage: 95, efficiency: 94 },
  { feature: 'Documentation', usage: 60, efficiency: 75 },
  { feature: 'Testing', usage: 78, efficiency: 86 },
  { feature: 'Refactoring', usage: 65, efficiency: 82 },
];

const teamPerformanceData = [
  { member: 'John Doe', tasks: 45, completed: 42, efficiency: 93 },
  { member: 'Jane Smith', tasks: 52, completed: 48, efficiency: 92 },
  { member: 'Bob Wilson', tasks: 38, completed: 35, efficiency: 92 },
  { member: 'Alice Johnson', tasks: 41, completed: 38, efficiency: 93 },
];

const deploymentData = [
  { date: 'Jan', success: 45, failed: 3, pending: 2 },
  { date: 'Feb', success: 52, failed: 2, pending: 1 },
  { date: 'Mar', success: 48, failed: 4, pending: 3 },
  { date: 'Apr', success: 58, failed: 1, pending: 1 },
  { date: 'May', success: 62, failed: 2, pending: 2 },
  { date: 'Jun', success: 68, failed: 1, pending: 1 },
];

const resourceUsageData = [
  { time: '00:00', cpu: 45, memory: 62, disk: 78, network: 55 },
  { time: '04:00', cpu: 38, memory: 58, disk: 75, network: 48 },
  { time: '08:00', cpu: 65, memory: 82, disk: 88, network: 72 },
  { time: '12:00', cpu: 78, memory: 92, disk: 95, network: 85 },
  { time: '16:00', cpu: 72, memory: 88, disk: 90, network: 78 },
  { time: '20:00', cpu: 55, memory: 70, disk: 82, network: 65 },
];

const projectDistributionData = [
  { name: 'Active', value: 45, color: '#8b5cf6' },
  { name: 'In Progress', value: 30, color: '#3b82f6' },
  { name: 'Completed', value: 15, color: '#10b981' },
  { name: 'On Hold', value: 10, color: '#f59e0b' },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const timeFilters = ['7 days', '30 days', '90 days', '1 year', 'All time'];

const Analytics = () => {
  const [selectedFilter, setSelectedFilter] = useState('30 days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showDetails, setShowDetails] = useState(true);

  const stats = [
    { 
      label: 'Avg. Velocity', 
      value: '52', 
      change: '+12%', 
      trend: 'up',
      icon: Target,
      color: 'text-primary'
    },
    { 
      label: 'Code Efficiency', 
      value: '94%', 
      change: '+5%', 
      trend: 'up',
      icon: Code,
      color: 'text-success'
    },
    { 
      label: 'Bug Resolution', 
      value: '89%', 
      change: '-2%', 
      trend: 'down',
      icon: CheckCircle2,
      color: 'text-warning'
    },
    { 
      label: 'AI Tasks', 
      value: '1,247', 
      change: '+28%', 
      trend: 'up',
      icon: Zap,
      color: 'text-accent'
    },
    { 
      label: 'Deployments', 
      value: '335', 
      change: '+15%', 
      trend: 'up',
      icon: Rocket,
      color: 'text-primary'
    },
    { 
      label: 'Team Activity', 
      value: '2,456', 
      change: '+8%', 
      trend: 'up',
      icon: Users,
      color: 'text-success'
    },
  ];

  const handleExport = () => {
    toast.success('Exporting analytics data...');
    // In a real app, this would trigger a download
  };

  const handleRefresh = () => {
    toast.success('Refreshing analytics...');
    // In a real app, this would refresh the data
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance insights and metrics</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map((filter) => (
                <SelectItem key={filter} value={filter}>{filter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="h-10 w-10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDetails(!showDetails)}
            className="h-10 w-10"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleExport}
            className="btn-gradient"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4 lg:p-6 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-secondary/50 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Velocity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Project Velocity</h3>
              <p className="text-sm text-muted-foreground">Sprint completion tracking</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedFilter}
            </Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="week" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="target"
                  fill="hsl(0, 0%, 20%)"
                  fillOpacity={0.2}
                  stroke="hsl(0, 0%, 40%)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  stroke="hsl(270, 70%, 59%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(270, 70%, 59%)', strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Velocity"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(142, 70%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142, 70%, 45%)', strokeWidth: 0, r: 4 }}
                  name="Completed"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Code Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Code Efficiency</h3>
              <p className="text-sm text-muted-foreground">Lines added, removed, and commits</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={codeEfficiencyData}>
                <defs>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRemoved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="month" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="linesAdded"
                  stroke="hsl(142, 70%, 45%)"
                  fillOpacity={1}
                  fill="url(#colorAdded)"
                  strokeWidth={2}
                  name="Lines Added"
                />
                <Area
                  type="monotone"
                  dataKey="linesRemoved"
                  stroke="hsl(0, 84%, 60%)"
                  fillOpacity={1}
                  fill="url(#colorRemoved)"
                  strokeWidth={2}
                  name="Lines Removed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bug Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Bug Frequency</h3>
              <p className="text-sm text-muted-foreground">By severity level</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bugData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" horizontal={false} />
                <XAxis type="number" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis dataKey="severity" type="category" stroke="hsl(0, 0%, 60%)" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} name="Total" />
                <Bar dataKey="resolved" fill="hsl(142, 70%, 45%)" radius={[0, 4, 4, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">AI Usage Stats</h3>
              <p className="text-sm text-muted-foreground">Feature utilization</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={aiUsageData}>
                <PolarGrid stroke="hsl(0, 0%, 15%)" />
                <PolarAngleAxis dataKey="feature" tick={{ fill: 'hsl(0, 0%, 60%)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(0, 0%, 60%)', fontSize: 10 }} />
                <Radar
                  name="Usage %"
                  dataKey="usage"
                  stroke="hsl(270, 70%, 59%)"
                  fill="hsl(270, 70%, 59%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Project Distribution</h3>
              <p className="text-sm text-muted-foreground">By status</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Team Performance</h3>
              <p className="text-sm text-muted-foreground">Task completion by member</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="member" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="tasks" fill="hsl(270, 70%, 59%)" radius={[4, 4, 0, 0]} name="Total Tasks" />
                <Bar dataKey="completed" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Deployment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Deployment Status</h3>
              <p className="text-sm text-muted-foreground">Success vs failed deployments</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={deploymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                <XAxis dataKey="date" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 8%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="success" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Success" />
                <Bar dataKey="failed" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Failed" />
                <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Pending" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Resource Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">System Resource Usage</h3>
            <p className="text-sm text-muted-foreground">CPU, Memory, Disk, and Network metrics</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={resourceUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
              <XAxis dataKey="time" stroke="hsl(0, 0%, 60%)" fontSize={12} />
              <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 8%)',
                  border: '1px solid hsl(0, 0%, 15%)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 4 }} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} name="Memory %" />
              <Line type="monotone" dataKey="disk" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 4 }} name="Disk %" />
              <Line type="monotone" dataKey="network" stroke="hsl(270, 70%, 59%)" strokeWidth={2} dot={{ r: 4 }} name="Network %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
