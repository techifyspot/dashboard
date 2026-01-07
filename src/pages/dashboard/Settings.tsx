import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Camera,
  Moon,
  Sun,
  Monitor,
  Check,
  Key,
  Webhook,
  CreditCard,
  Globe,
  FileText,
  Download,
  Upload,
  Trash2,
  Edit2,
  Plus,
  X,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  Settings as SettingsIcon,
  Zap,
  Mail,
  Lock,
  Smartphone,
  Database,
  Server,
  Code,
  Languages,
  Clock
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
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

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

const Settings = () => {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false,
    security: true,
    project: true,
    mentions: true,
  });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Groq API Key',
      service: 'Groq',
      key: import.meta.env.VITE_GROQ_API_KEY || 'gsk_••••••••••••••••••••',
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date(),
    },
  ]);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [newApiKey, setNewApiKey] = useState({ name: '', service: 'groq', key: '' });
  const [showNewApiKey, setShowNewApiKey] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'CET', label: 'CET (Central European Time)' },
  ];

  const integrations = [
    { id: '1', name: 'GitHub', connected: true, icon: '🔗' },
    { id: '2', name: 'GitLab', connected: false, icon: '🔗' },
    { id: '3', name: 'Slack', connected: true, icon: '💬' },
    { id: '4', name: 'Discord', connected: false, icon: '💬' },
    { id: '5', name: 'Jira', connected: false, icon: '📋' },
    { id: '6', name: 'Trello', connected: true, icon: '📋' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Save to localStorage
    if (newApiKey.key && newApiKey.name) {
      localStorage.setItem('groq_api_key', newApiKey.key);
      toast.success('API key saved to local storage');
    }
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully');
  };

  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.key) {
      toast.error('Please fill in all fields');
      return;
    }
    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      service: newApiKey.service,
      key: newApiKey.key.substring(0, 10) + '••••••••',
      createdAt: new Date(),
    };
    setApiKeys([...apiKeys, apiKey]);
    setNewApiKey({ name: '', service: 'groq', key: '' });
    setShowNewApiKey(false);
    toast.success('API key added successfully');
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast.success('API key deleted');
  };

  const handleCopyApiKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('API key copied to clipboard');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 20, label: 'Weak', color: 'text-destructive' };
    if (strength <= 3) return { strength: 40, label: 'Fair', color: 'text-warning' };
    if (strength <= 4) return { strength: 60, label: 'Good', color: 'text-primary' };
    return { strength: 100, label: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="glass-panel p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-6"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Profile Settings</h2>
                  <p className="text-sm text-muted-foreground">Update your personal information</p>
                </div>
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                      {name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role} Plan</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Verified Account
                    </Badge>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                    <Input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Control how you receive notifications</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
                    { id: 'push', label: 'Push Notifications', description: 'Get real-time browser notifications', icon: Bell },
                    { id: 'updates', label: 'Product Updates', description: 'News about new features and improvements', icon: Zap },
                    { id: 'marketing', label: 'Marketing Emails', description: 'Tips, offers, and promotions', icon: Mail },
                    { id: 'security', label: 'Security Alerts', description: 'Important security notifications', icon: Shield },
                    { id: 'project', label: 'Project Updates', description: 'Updates on your projects', icon: FileText },
                    { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', icon: User },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            notifications[item.id as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <motion.div
                            animate={{ x: notifications[item.id as keyof typeof notifications] ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="w-5 h-5 rounded-full bg-foreground absolute top-0.5"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((t) => (
                      <motion.button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          // Apply theme to document
                          if (t.id === 'light') {
                            document.documentElement.classList.remove('dark');
                            localStorage.setItem('theme', 'light');
                          } else if (t.id === 'dark') {
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                          } else {
                            // System theme
                            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                            if (prefersDark) {
                              document.documentElement.classList.add('dark');
                            } else {
                              document.documentElement.classList.remove('dark');
                            }
                            localStorage.setItem('theme', 'system');
                          }
                          toast.success(`Theme changed to ${t.label}`);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                          theme === t.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-secondary/50 hover:border-muted-foreground'
                        }`}
                      >
                        <t.icon className={`w-8 h-8 ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${theme === t.id ? 'text-primary' : 'text-foreground'}`}>
                          {t.label}
                        </span>
                        {theme === t.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">Preview</label>
                  <div className="p-6 rounded-lg bg-background border border-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20" />
                      <div className="space-y-2">
                        <div className="w-32 h-3 rounded bg-foreground/20" />
                        <div className="w-24 h-2 rounded bg-muted-foreground/30" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-2 rounded bg-muted" />
                      <div className="w-3/4 h-2 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage your account security</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Password Strength</span>
                          <span className={`text-xs font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <Progress value={passwordStrength.strength} className="h-1.5" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <Button onClick={handleChangePassword} className="btn-gradient">
                    Change Password
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-5 h-5 text-warning" />
                        <h4 className="font-medium text-warning">Two-Factor Authentication</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account by enabling 2FA.
                      </p>
                      <Badge variant="outline" className={twoFactorEnabled ? 'border-success text-success' : ''}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
                      }}
                      variant={twoFactorEnabled ? 'outline' : 'default'}
                      className={twoFactorEnabled ? '' : 'bg-warning hover:bg-warning/90'}
                    >
                      {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="font-medium text-foreground mb-2">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded bg-background">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Chrome on Windows</p>
                          <p className="text-xs text-muted-foreground">Current session • Last active: Now</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-background">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Safari on iPhone</p>
                          <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">API Keys</h2>
                    <p className="text-sm text-muted-foreground">Manage your API keys and tokens</p>
                  </div>
                  <Button onClick={() => setShowNewApiKey(true)} className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{apiKey.name}</h4>
                            <Badge variant="outline" className="text-xs">{apiKey.service}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created: {apiKey.createdAt.toLocaleDateString()}
                            {apiKey.lastUsed && ` • Last used: ${apiKey.lastUsed.toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopyApiKey(apiKey.key, apiKey.id)}
                            className="h-8 w-8"
                          >
                            {copied === apiKey.id ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-background font-mono text-sm">
                        <span className="text-muted-foreground flex-1">{apiKey.key}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowApiKey({ ...showApiKey, [apiKey.id]: !showApiKey[apiKey.id] });
                            if (!showApiKey[apiKey.id]) {
                              toast.info('API key revealed');
                            }
                          }}
                        >
                          {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New API Key Modal */}
                {showNewApiKey && (
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Add New API Key</h3>
                      <Button variant="ghost" size="icon" onClick={() => setShowNewApiKey(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <Input
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                        placeholder="e.g., Groq Production Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Service</label>
                      <Select
                        value={newApiKey.service}
                        onValueChange={(value) => setNewApiKey({ ...newApiKey, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="groq">Groq</SelectItem>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
                      <Input
                        type="password"
                        value={newApiKey.key}
                        onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                        placeholder="Enter your API key"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddApiKey} className="btn-gradient flex-1">
                        Add Key
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewApiKey(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Integrations</h2>
                  <p className="text-sm text-muted-foreground">Connect with external services</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{integration.icon}</div>
                          <div>
                            <h4 className="font-medium text-foreground">{integration.name}</h4>
                            <Badge variant={integration.connected ? 'outline' : 'secondary'} className="text-xs mt-1">
                              {integration.connected ? 'Connected' : 'Not Connected'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? 'outline' : 'default'}
                        className="w-full"
                        onClick={() => toast.info(integration.connected ? 'Disconnecting...' : 'Connecting...')}
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Preferences</h2>
                  <p className="text-sm text-muted-foreground">Customize your experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">Data Management</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const data = {
                            user: { name, email, bio, location, website },
                            preferences: { language, timezone, theme },
                            notifications,
                            apiKeys: apiKeys.map(k => ({ name: k.name, service: k.service })),
                          };
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `techifyspot-data-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success('Data exported successfully');
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.json';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const data = JSON.parse(event.target?.result as string);
                                  if (data.user) {
                                    setName(data.user.name || name);
                                    setEmail(data.user.email || email);
                                    setBio(data.user.bio || bio);
                                    setLocation(data.user.location || location);
                                    setWebsite(data.user.website || website);
                                  }
                                  if (data.preferences) {
                                    setLanguage(data.preferences.language || language);
                                    setTimezone(data.preferences.timezone || timezone);
                                    setTheme(data.preferences.theme || theme);
                                  }
                                  toast.success('Data imported successfully');
                                } catch (error) {
                                  toast.error('Failed to import data. Invalid file format.');
                                }
                              };
                              reader.readAsText(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Billing & Subscription</h2>
                  <p className="text-sm text-muted-foreground">Manage your subscription and payment methods</p>
                </div>

                <div className="p-6 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground capitalize">{user?.role} Plan</h3>
                      <p className="text-sm text-muted-foreground">Current subscription</p>
                    </div>
                    <Badge variant="outline" className="text-sm">Active</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Cost</span>
                      <span className="font-medium text-foreground">$29.99/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Billing Date</span>
                      <span className="font-medium text-foreground">Jan 15, 2025</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast.info('Plan change feature coming soon!');
                    }}
                  >
                    Change Plan
                  </Button>
                </div>

                <div className="p-6 rounded-lg bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded bg-background">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">Default</Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {
                      toast.info('Payment method feature coming soon!');
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'api-keys' && activeTab !== 'integrations' && activeTab !== 'billing' && (
              <div className="flex justify-end mt-8 pt-6 border-t border-border">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-gradient"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Save className="w-4 h-4 mr-2" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
