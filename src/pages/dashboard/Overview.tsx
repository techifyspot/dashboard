import { motion } from 'framer-motion';
import { 
  Users, 
  Rocket, 
  Bug, 
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Activity,
  Server,
  Database,
  Zap,
  BarChart3,
  Monitor
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Development Performance Trends Data
const performanceTrendsData = [
  { month: 'Jan', Bugs: 45, Fixes: 38, Performance: 72 },
  { month: 'Feb', Bugs: 52, Fixes: 48, Performance: 75 },
  { month: 'Mar', Bugs: 38, Fixes: 42, Performance: 78 },
  { month: 'Apr', Bugs: 28, Fixes: 35, Performance: 82 },
  { month: 'May', Bugs: 22, Fixes: 28, Performance: 88 },
  { month: 'Jun', Bugs: 18, Fixes: 24, Performance: 92 },
];

// System Resource Usage Data
const resourceUsageData = [
  { time: '00:00', CPU: 45, Memory: 120, Disk: 85, Network: 65 },
  { time: '04:00', CPU: 38, Memory: 110, Disk: 80, Network: 58 },
  { time: '08:00', CPU: 65, Memory: 180, Disk: 95, Network: 85 },
  { time: '12:00', CPU: 78, Memory: 220, Disk: 110, Network: 95 },
  { time: '16:00', CPU: 72, Memory: 200, Disk: 105, Network: 88 },
  { time: '20:00', CPU: 55, Memory: 150, Disk: 90, Network: 72 },
];

// Code Quality Analysis Data
const codeQualityAnalysisData = [
  { subject: 'Security', A: 95, fullMark: 100 },
  { subject: 'Performance', A: 89, fullMark: 100 },
  { subject: 'Maintainability', A: 91, fullMark: 100 },
  { subject: 'Reliability', A: 88, fullMark: 100 },
  { subject: 'Coverage', A: 87, fullMark: 100 },
  { subject: 'Documentation', A: 82, fullMark: 100 },
];

// Deployment Distribution Data
const deploymentData = [
  { name: 'Production', value: 45, color: 'hsl(142, 70%, 45%)' },
  { name: 'Staging', value: 30, color: 'hsl(199, 89%, 48%)' },
  { name: 'Development', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Testing', value: 10, color: 'hsl(270, 70%, 59%)' },
];

// Team Productivity Data
const teamProductivityData = [
  { name: 'Mon', productivity: 245 },
  { name: 'Tue', productivity: 198 },
  { name: 'Wed', productivity: 312 },
  { name: 'Thu', productivity: 276 },
  { name: 'Fri', productivity: 189 },
];

// Recent Development Activities
const recentActivities = [
  { id: 1, action: 'Fixed authentication bug', status: 'completed', time: '2 hours ago', icon: CheckCircle2 },
  { id: 2, action: 'Generated API documentation', status: 'completed', time: '4 hours ago', icon: CheckCircle2 },
  { id: 3, action: 'Deployed to production', status: 'completed', time: '6 hours ago', icon: CheckCircle2 },
  { id: 4, action: 'Security scan in progress', status: 'in-progress', time: '1 hour ago', icon: Loader2 },
  { id: 5, action: 'Code review pending', status: 'pending', time: '30 minutes ago', icon: Clock },
];

const Overview = () => {
  const { projects } = useAppStore();
  
  const stats = [
    { 
      label: 'Active Users', 
      value: '6',
      change: '+2.5% from last hour',
      changeType: 'positive',
      icon: Users, 
      color: 'text-primary',
      gradient: 'from-blue-500/20 to-purple-500/20'
    },
    { 
      label: 'Deployments Today', 
      value: '10',
      change: '+12% from yesterday',
      changeType: 'positive',
      icon: Rocket, 
      color: 'text-success',
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    { 
      label: 'Bugs Fixed', 
      value: '24',
      change: '+8% efficiency',
      changeType: 'positive',
      icon: Bug, 
      color: 'text-warning',
      gradient: 'from-orange-500/20 to-amber-500/20'
    },
    { 
      label: 'Code Quality', 
      value: '99.4%',
      change: 'Above target',
      changeType: 'positive',
      icon: ShieldCheck, 
      color: 'text-accent',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
  ];

  const codeQualityMetrics = [
    { label: 'Code Quality', value: 92, target: 90 },
    { label: 'Test Coverage', value: 87, target: 90 },
    { label: 'Security Score', value: 95, target: 90 },
    { label: 'Performance', value: 89, target: 85 },
    { label: 'Maintainability', value: 91, target: 85 },
  ];

  const systemStatus = [
    { label: 'System Status', value: 'Healthy', status: 'success', icon: Activity },
    { label: 'API Response Time', value: '127ms', status: 'success', icon: Zap },
    { label: 'Database Connection', value: 'Active', status: 'success', icon: Database },
    { label: 'Cache Hit Rate', value: '94.2%', status: 'success', icon: Server },
  ];

  const quickActions = [
    { label: 'Generate Code', icon: Code2, color: 'text-primary' },
    { label: 'Security Scan', icon: ShieldCheck, color: 'text-success' },
    { label: 'Deploy', icon: Rocket, color: 'text-warning' },
    { label: 'Analytics', icon: BarChart3, color: 'text-accent' },
    { label: 'Data Model', icon: Database, color: 'text-primary' },
    { label: 'Monitor', icon: Monitor, color: 'text-success' },
  ];

  const completedTasks = recentActivities.filter(a => a.status === 'completed').length;
  const inProgressTasks = recentActivities.filter(a => a.status === 'in-progress').length;
  const pendingTasks = recentActivities.filter(a => a.status === 'pending').length;
  const successRate = Math.round((completedTasks / recentActivities.length) * 100);

  return (
    <div className="space-y-6 pb-20 lg:pb-6 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Development Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your development metrics and system performance</p>
      </motion.div>

      {/* Stats Grid - Enhanced with gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card group relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className={`text-xs flex items-center gap-1 ${stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color} backdrop-blur-sm`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Development Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg lg:text-xl font-semibold text-foreground">Development Performance Trends</h3>
        </div>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrendsData}>
              <defs>
                <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFixes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270, 70%, 59%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(270, 70%, 59%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(240, 5%, 60%)" fontSize={12} />
              <YAxis stroke="hsl(240, 5%, 60%)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(240, 10%, 6%)', 
                  border: '1px solid hsl(240, 10%, 18%)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Bugs" 
                stroke="hsl(0, 84%, 60%)" 
                fillOpacity={1} 
                fill="url(#colorBugs)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="Fixes" 
                stroke="hsl(142, 70%, 45%)" 
                fillOpacity={1} 
                fill="url(#colorFixes)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="Performance" 
                stroke="hsl(270, 70%, 59%)" 
                fillOpacity={1} 
                fill="url(#colorPerformance)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* System Resource Usage & Deployment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* System Resource Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-4 lg:p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">System Resource Usage</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resourceUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 18%)" />
                <XAxis dataKey="time" stroke="hsl(240, 5%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(240, 5%, 60%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 10%, 6%)', 
                    border: '1px solid hsl(240, 10%, 18%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="CPU" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Memory" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Disk" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Network" stroke="hsl(270, 70%, 59%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Deployment Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-4 lg:p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Deployment Distribution</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deploymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deploymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 10%, 6%)', 
                    border: '1px solid hsl(240, 10%, 18%)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {deploymentData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}:</span>
                <span className="text-xs font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Code Quality Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel p-4 lg:p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Code Quality Analysis</h3>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={codeQualityAnalysisData}>
              <PolarGrid stroke="hsl(240, 10%, 18%)" />
              <PolarAngleAxis dataKey="subject" stroke="hsl(240, 5%, 60%)" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(240, 5%, 60%)" fontSize={10} />
              <Radar 
                name="Score" 
                dataKey="A" 
                stroke="hsl(270, 70%, 59%)" 
                fill="hsl(270, 70%, 59%)" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(240, 10%, 6%)', 
                  border: '1px solid hsl(240, 10%, 18%)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Team Productivity Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-panel p-4 lg:p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Team Productivity Analysis</h3>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={teamProductivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(240, 5%, 60%)" fontSize={12} />
              <YAxis stroke="hsl(240, 5%, 60%)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(240, 10%, 6%)', 
                  border: '1px solid hsl(240, 10%, 18%)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar 
                dataKey="productivity" 
                fill="hsl(270, 70%, 59%)" 
                radius={[8, 8, 0, 0]}
              />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Code Quality and Performance Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-panel p-4 lg:p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-1">
            Code Quality and Performance Scores
          </h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive metrics tracking code quality, test coverage, security, and performance indicators
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {codeQualityMetrics.map((metric, index) => (
            <Card key={metric.label} className="bg-secondary/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className="text-sm font-bold text-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Target: {metric.target}%</span>
                  {metric.value >= metric.target ? (
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-warning" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quality Insights:
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Code quality exceeds industry standards (92%)</li>
            <li>• Test coverage needs improvement (target: 90%)</li>
            <li>• Security score is excellent (95%)</li>
            <li>• Performance optimization recommended</li>
            <li>• Maintainability score is strong (91%)</li>
          </ul>
        </div>
      </motion.div>

      {/* Recent Development Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Development Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="lg:col-span-2 glass-panel p-4 lg:p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Development Activities</h3>
          <div className="space-y-3 mb-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              const statusColors = {
                completed: 'text-success',
                'in-progress': 'text-warning',
                pending: 'text-muted-foreground'
              };
              const statusBg = {
                completed: 'bg-success/10',
                'in-progress': 'bg-warning/10',
                pending: 'bg-muted/10'
              };
              
              return (
                <div 
                  key={activity.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${statusBg[activity.status]} hover:bg-secondary/50 transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 ${statusColors[activity.status]} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${statusColors[activity.status]} border-current`}
                        >
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-2">Activity Summary:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Completed:</span>
                <span className="text-foreground font-semibold ml-1">{completedTasks} tasks</span>
              </div>
              <div>
                <span className="text-muted-foreground">In Progress:</span>
                <span className="text-foreground font-semibold ml-1">{inProgressTasks} task</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pending:</span>
                <span className="text-foreground font-semibold ml-1">{pendingTasks} task</span>
              </div>
              <div>
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="text-success font-semibold ml-1">{successRate}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-panel p-4 lg:p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 bg-secondary/50 hover:bg-secondary border-border/50"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs text-foreground">{action.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass-panel p-4 lg:p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatus.map((status, index) => (
            <Card key={status.label} className="bg-secondary/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <status.icon className="w-5 h-5 text-success" />
                  <Badge variant="outline" className="text-xs text-success border-success">
                    {status.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{status.label}</p>
                <p className="text-lg font-bold text-foreground">{status.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 bg-secondary/30 rounded-lg p-4 border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2">Recent Activity</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Code deployed to production</li>
            <li>• Security scan completed</li>
            <li>• Bug fix in progress</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
