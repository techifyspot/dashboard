import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Play, 
  Copy, 
  Check, 
  Code2,
  Loader2,
  Paperclip,
  Wrench,
  BookOpen,
  Languages,
  GitBranch,
  Lightbulb,
  ArrowDownToLine,
  BarChart3,
  GitBranch as WorkflowIcon,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  callGroqAPI,
  generateSnippetPrompt,
  fixBugPrompt,
  explainCodePrompt,
  convertLanguagePrompt,
  generateDiagramPrompt,
  refactoringPrompt,
  minifyCodePrompt,
  analyzeComplexityPrompt,
  generateWorkflowPrompt,
  generateDocumentationPrompt,
} from '@/services/groqApi';

const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'];

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: typeof Code2;
  color: string;
  gradient: string;
}

const aiTools: AITool[] = [
  { 
    id: 'snippet-generator', 
    name: 'AI Snippet Generator', 
    description: 'Generate reusable code snippets from natural language',
    icon: Paperclip,
    color: 'text-primary',
    gradient: ''
  },
  { 
    id: 'bug-fixer', 
    name: 'Smart Bug Fixer', 
    description: 'Analyze and fix code bugs instantly',
    icon: Wrench,
    color: 'text-destructive',
    gradient: ''
  },
  { 
    id: 'code-explainer', 
    name: 'Code Explainer', 
    description: 'Convert complex code into plain English',
    icon: BookOpen,
    color: 'text-success',
    gradient: ''
  },
  { 
    id: 'language-converter', 
    name: 'Language Converter', 
    description: 'Translate code between programming languages',
    icon: Languages,
    color: 'text-warning',
    gradient: ''
  },
  { 
    id: 'diagram-generator', 
    name: 'Diagram Generator', 
    description: 'Generate technical diagrams from descriptions',
    icon: GitBranch,
    color: 'text-accent',
    gradient: ''
  },
  { 
    id: 'refactoring-hints', 
    name: 'Refactoring Hints', 
    description: 'Get smart suggestions for code improvements',
    icon: Lightbulb,
    color: 'text-primary',
    gradient: ''
  },
  { 
    id: 'code-minifier', 
    name: 'Code Minifier', 
    description: 'Minify and compress your code files',
    icon: ArrowDownToLine,
    color: 'text-muted-foreground',
    gradient: ''
  },
  { 
    id: 'complexity-analyzer', 
    name: 'Complexity Analyzer', 
    description: 'Analyze and score code complexity',
    icon: BarChart3,
    color: 'text-info',
    gradient: ''
  },
  { 
    id: 'workflow-automator', 
    name: 'Workflow Automator', 
    description: 'Create automation workflows for repetitive tasks',
    icon: WorkflowIcon,
    color: 'text-success',
    gradient: ''
  },
  { 
    id: 'auto-documentation', 
    name: 'Auto Documentation', 
    description: 'Generate documentation from your code',
    icon: FileText,
    color: 'text-warning',
    gradient: ''
  },
];

const AICodingAssistant = () => {
  // Get API key from environment variable or localStorage
  const getApiKey = () => {
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    const localKey = localStorage.getItem('groq_api_key');
    const key = envKey || localKey || '';
    
    // Debug: Log if key is found (but not the key itself)
    console.log('Environment check:', {
      hasEnvKey: !!envKey,
      hasLocalKey: !!localKey,
      hasKey: !!key,
      envKeyLength: envKey?.length || 0
    });
    
    if (key) {
      console.log('API key loaded successfully');
    } else {
      console.warn('No API key found. Checking .env file...');
    }
    
    return key;
  };

  const initialApiKey = getApiKey();
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [apiKeyInput, setApiKeyInput] = useState(initialApiKey || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(() => !initialApiKey);
  const [activeTool, setActiveTool] = useState<string>('snippet-generator');
  const [language, setLanguage] = useState('JavaScript');
  const [targetLanguage, setTargetLanguage] = useState('TypeScript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);


  const handleProcess = async () => {
    console.log('Generate button clicked');
    console.log('API Key present:', !!apiKey);
    console.log('Input:', input.substring(0, 50));
    console.log('Active tool:', activeTool);

    if (!apiKey) {
      const errorMsg = 'API key not found. Please set VITE_GROQ_API_KEY in your .env file and restart the dev server.';
      toast.error(errorMsg);
      setOutput(`Error: ${errorMsg}\n\nTo fix this:\n1. Create a .env file in the root directory\n2. Add: VITE_GROQ_API_KEY=your_api_key_here\n3. Restart the development server`);
      return;
    }

    if (!input.trim()) {
      toast.error('Please provide input');
      return;
    }

    setIsProcessing(true);
    setOutput('Processing... Please wait.');

    try {
      let messages;
      const currentTool = aiTools.find(t => t.id === activeTool);

      if (!currentTool) {
        throw new Error('Selected tool not found');
      }

      console.log('Generating prompt for tool:', currentTool.name);

      switch (activeTool) {
        case 'snippet-generator':
          messages = generateSnippetPrompt(input, language);
          break;
        case 'bug-fixer':
          messages = fixBugPrompt(input, language);
          break;
        case 'code-explainer':
          messages = explainCodePrompt(input, language);
          break;
        case 'language-converter':
          messages = convertLanguagePrompt(input, language, targetLanguage);
          break;
        case 'diagram-generator':
          messages = generateDiagramPrompt(input);
          break;
        case 'refactoring-hints':
          messages = refactoringPrompt(input, language);
          break;
        case 'code-minifier':
          messages = minifyCodePrompt(input, language);
          break;
        case 'complexity-analyzer':
          messages = analyzeComplexityPrompt(input, language);
          break;
        case 'workflow-automator':
          messages = generateWorkflowPrompt(input);
          break;
        case 'auto-documentation':
          messages = generateDocumentationPrompt(input, language);
          break;
        default:
          throw new Error(`Unknown tool: ${activeTool}`);
      }

      console.log('Calling Groq API...');
      const result = await callGroqAPI(apiKey, messages);
      console.log('API response received, length:', result.length);
      
      setOutput(result);
      toast.success(`${currentTool.name} completed successfully!`);
    } catch (error) {
      console.error('Error in handleProcess:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const fullError = `Error: ${errorMessage}\n\nPlease check:\n1. Your API key is correct\n2. You have internet connection\n3. The Groq API is accessible`;
      setOutput(fullError);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const clearOutput = () => {
    setOutput('');
    setInput('');
  };

  const currentTool = aiTools.find(t => t.id === activeTool);

  return (
    <div className="space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Code Tools</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive AI-powered development tools to boost your productivity
        </p>
      </div>

      {/* API Key Input (Fallback if env variable not loaded) */}
      {showApiKeyInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 border-2 border-warning/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">API Key Required</h3>
              <p className="text-xs text-muted-foreground mb-3">
                The API key from your .env file wasn't loaded. This usually means the dev server needs to be restarted. 
                You can also enter it manually below as a temporary solution.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Groq API key (gsk_...)"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && apiKeyInput.trim()) {
                      const newKey = apiKeyInput.trim();
                      setApiKey(newKey);
                      localStorage.setItem('groq_api_key', newKey);
                      setShowApiKeyInput(false);
                      toast.success('API key saved');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (apiKeyInput.trim()) {
                      const newKey = apiKeyInput.trim();
                      setApiKey(newKey);
                      localStorage.setItem('groq_api_key', newKey);
                      setShowApiKeyInput(false);
                      toast.success('API key saved');
                    }
                  }}
                  disabled={!apiKeyInput.trim()}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Try to reload from env
                    const envKey = import.meta.env.VITE_GROQ_API_KEY;
                    if (envKey) {
                      setApiKey(envKey);
                      setShowApiKeyInput(false);
                      toast.success('API key loaded from environment');
                    } else {
                      toast.error('Environment variable still not found. Please restart the dev server.');
                    }
                  }}
                >
                  Reload from Env
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 <strong>Tip:</strong> Restart your dev server (Ctrl+C then npm run dev) to load the .env file automatically.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {aiTools.map((tool) => {
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
                setInput('');
                setOutput('');
              }}
              className={`glass-panel p-3 cursor-pointer transition-all relative overflow-hidden group ${
                isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              }`}
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg bg-secondary/50 ${tool.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isActive && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary">
                      Active
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1 leading-tight">{tool.name}</h3>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{tool.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{currentTool?.name}</h3>
            {activeTool === 'language-converter' && (
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">→</span>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {(activeTool === 'snippet-generator' || 
              activeTool === 'bug-fixer' || 
              activeTool === 'code-explainer' ||
              activeTool === 'refactoring-hints' ||
              activeTool === 'code-minifier' ||
              activeTool === 'complexity-analyzer' ||
              activeTool === 'auto-documentation') && (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeTool === 'snippet-generator' || activeTool === 'diagram-generator' || activeTool === 'workflow-automator'
                ? 'e.g., Create a React hook for managing form state with validation'
                : activeTool === 'language-converter'
                ? 'Paste your code here...'
                : 'Paste your code here...'
            }
            className="code-editor w-full h-80 resize-none scrollbar-dark font-mono text-sm"
          />

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !input.trim()}
              className="btn-gradient flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearOutput}
              disabled={isProcessing}
            >
              Clear
            </Button>
          </div>
          {!apiKey && (
            <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
              ⚠️ API key not found. Please set VITE_GROQ_API_KEY in your .env file and restart the server.
            </div>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          key={`output-${activeTool}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Generated Result
            </h3>
            {output && (
              <Button
                variant="ghost"
                size="icon"
                onClick={copyOutput}
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

          <div className="code-editor w-full h-80 overflow-auto scrollbar-dark bg-background/50">
            {output ? (
              <pre className="font-mono text-sm whitespace-pre-wrap p-4 text-foreground">
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your generated result will appear here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AICodingAssistant;
