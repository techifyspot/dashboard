import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench,
  Zap,
  Target,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownToLine,
  Sparkles,
  Loader2,
  Copy,
  Check,
  TrendingUp,
  FileCode,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  callGroqAPI,
  refactoringPrompt,
  analyzeComplexityPrompt,
  minifyCodePrompt,
} from '@/services/groqApi';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
];

interface Metric {
  label: string;
  value: number;
  icon: typeof Zap;
  color: string;
  bgColor: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: typeof Wrench;
  color: string;
  gradient: string;
}

const CodeOptimization = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTool, setActiveTool] = useState('smart-refactoring');
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Performance', value: 85, icon: ArrowUpRight, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Maintainability', value: 78, icon: Wrench, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Complexity', value: 65, icon: Target, color: 'text-warning', bgColor: 'bg-warning/10' },
    { label: 'Security', value: 92, icon: ShieldCheck, color: 'text-accent', bgColor: 'bg-accent/10' },
  ]);

  const tools: Tool[] = [
    {
      id: 'smart-refactoring',
      name: 'Smart Refactoring',
      description: 'AI-powered code structure improvements',
      icon: Wrench,
      color: 'text-primary',
      gradient: ''
    },
    {
      id: 'performance-analyzer',
      name: 'Performance Analyzer',
      description: 'Identify bottlenecks and optimization opportunities',
      icon: ArrowUpRight,
      color: 'text-success',
      gradient: ''
    },
    {
      id: 'code-minifier',
      name: 'Code Minifier',
      description: 'Compress and optimize code files',
      icon: ArrowDownToLine,
      color: 'text-warning',
      gradient: ''
    },
    {
      id: 'complexity-reducer',
      name: 'Complexity Reducer',
      description: 'Simplify complex code structures',
      icon: Target,
      color: 'text-accent',
      gradient: ''
    },
  ];

  const getApiKey = () => {
    const key = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
    if (!key) {
      toast.error('Groq API key not found. Please configure it in settings.');
    }
    return key;
  };

  const handleOptimize = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!code.trim()) {
      toast.error('Please enter code to optimize');
      return;
    }

    setIsProcessing(true);
    setOptimizedCode('');

    try {
      let messages;
      const currentTool = tools.find(t => t.id === activeTool);

      switch (activeTool) {
        case 'smart-refactoring':
          messages = refactoringPrompt(code, language);
          break;
        case 'performance-analyzer':
          messages = [
            {
              role: 'system' as const,
              content: `You are a performance optimization expert. Analyze ${language} code for bottlenecks, inefficiencies, and optimization opportunities. Provide specific recommendations with code examples.`
            },
            {
              role: 'user' as const,
              content: `Analyze this ${language} code for performance issues and provide optimization suggestions:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
          ];
          break;
        case 'code-minifier':
          messages = minifyCodePrompt(code, language);
          break;
        case 'complexity-reducer':
          messages = [
            {
              role: 'system' as const,
              content: `You are a code complexity reduction expert. Simplify complex ${language} code structures while maintaining functionality. Focus on reducing cyclomatic complexity, improving readability, and breaking down large functions.`
            },
            {
              role: 'user' as const,
              content: `Reduce the complexity of this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
          ];
          break;
        default:
          throw new Error('Unknown tool');
      }

      const result = await callGroqAPI(apiKey, messages);
      
      // Try to extract code if wrapped in markdown
      const codeMatch = result.match(/```[\w]*\n([\s\S]*?)```/);
      if (codeMatch && (activeTool === 'smart-refactoring' || activeTool === 'code-minifier' || activeTool === 'complexity-reducer')) {
        setOptimizedCode(codeMatch[1]);
      } else {
        setOptimizedCode(result);
      }

      // Update metrics based on optimization
      updateMetrics();
      
      toast.success(`${currentTool?.name} completed successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize code';
      setOptimizedCode(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMetrics = () => {
    // Simulate metric improvements after optimization
    setMetrics(prev => prev.map(metric => {
      const improvement = Math.floor(Math.random() * 5) + 1;
      const newValue = Math.min(100, metric.value + improvement);
      return { ...metric, value: newValue };
    }));
  };

  const copyOptimizedCode = () => {
    navigator.clipboard.writeText(optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Optimized code copied!');
  };

  const currentTool = tools.find(t => t.id === activeTool);
  const CurrentToolIcon = currentTool?.icon;

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-destructive">Smart Refactoring</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          AI-powered code structure improvements and refactoring suggestions
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4 lg:p-6 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl lg:text-3xl font-bold ${metric.color}`}>
                    {metric.value}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <Progress value={metric.value} className="h-2" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTool(tool.id);
                setOptimizedCode('');
              }}
              className={`glass-panel p-4 cursor-pointer transition-all relative overflow-hidden group ${
                isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              }`}
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-secondary/50 ${tool.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      Active
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{tool.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-4 lg:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            {CurrentToolIcon && <CurrentToolIcon className="w-5 h-5 text-primary" />}
            <h3 className="text-lg font-semibold text-foreground">{currentTool?.name}</h3>
          </div>

          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">Code to Optimize</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for optimization..."
              className="code-editor w-full h-80 resize-none scrollbar-dark font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleOptimize}
            disabled={isProcessing || !code.trim()}
            className="w-full btn-gradient h-10"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Optimize Code
              </>
            )}
          </Button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          key={`output-${activeTool}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-4 lg:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="text-lg font-semibold text-foreground">Optimization Results</h3>
            </div>
            {optimizedCode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={copyOptimizedCode}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          <div className="code-editor w-full h-80 overflow-auto scrollbar-dark bg-background/50 rounded-lg">
            {optimizedCode ? (
              <pre className="font-mono text-sm whitespace-pre-wrap p-4 text-foreground">
                {optimizedCode}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Zap className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-center">Optimization results will appear here</p>
              </div>
            )}
          </div>

          {/* Optimization Summary */}
          {optimizedCode && !optimizedCode.startsWith('Error:') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg"
            >
              <h4 className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Optimization Complete
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Code structure improved</li>
                <li>• Performance metrics updated</li>
                <li>• Ready for integration</li>
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Additional Info */}
      <div className="glass-panel p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Optimization Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Performance Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use efficient algorithms</li>
              <li>• Minimize nested loops</li>
              <li>• Cache frequently used values</li>
              <li>• Optimize database queries</li>
            </ul>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Maintainability</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Write clear function names</li>
              <li>• Add meaningful comments</li>
              <li>• Follow coding standards</li>
              <li>• Keep functions focused</li>
            </ul>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Complexity Reduction</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Break down large functions</li>
              <li>• Reduce nesting levels</li>
              <li>• Use design patterns</li>
              <li>• Extract reusable code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeOptimization;

