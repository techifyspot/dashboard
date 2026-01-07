import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2,
  Sparkles,
  Bug,
  Lightbulb,
  Zap,
  FileCode,
  BarChart3,
  Save,
  Wand2,
  Play,
  Copy,
  Check,
  Loader2,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Replace,
  Terminal,
  File,
  Folder,
  X,
  Maximize2,
  Minimize2,
  Split,
  FileText,
  Command,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  callGroqAPI,
  fixBugPrompt,
  explainCodePrompt,
  refactoringPrompt,
  analyzeComplexityPrompt,
} from '@/services/groqApi';

const languages = [
  { value: 'javascript', label: 'JavaScript', badge: 'JAVASCRIPT', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', badge: 'TYPESCRIPT', extension: '.ts' },
  { value: 'python', label: 'Python', badge: 'PYTHON', extension: '.py' },
  { value: 'java', label: 'Java', badge: 'JAVA', extension: '.java' },
  { value: 'go', label: 'Go', badge: 'GO', extension: '.go' },
  { value: 'rust', label: 'Rust', badge: 'RUST', extension: '.rs' },
  { value: 'cpp', label: 'C++', badge: 'C++', extension: '.cpp' },
  { value: 'csharp', label: 'C#', badge: 'C#', extension: '.cs' },
];

const themes = ['Dark Theme', 'Light Theme', 'Monokai', 'Dracula', 'Nord'];

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

const defaultCode = `// AI-Powered JavaScript Editor
console.log("Welcome to DevAI Code Editor!");

// Example: Smart Algorithm
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// Modern JavaScript features
const asyncExample = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`;

const CodeTools = () => {
  const [tabs, setTabs] = useState<FileTab[]>([
    { id: '1', name: 'main.js', content: defaultCode, language: 'javascript', isDirty: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('Dark Theme');
  const [fontSize, setFontSize] = useState('14px');
  const [tabSize, setTabSize] = useState('2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const activeTab = tabs.find(t => t.id === activeTabId);
  const currentCode = activeTab?.content || '';
  const currentLang = languages.find(l => l.value === (activeTab?.language || language));

  // Update line numbers when code changes
  useEffect(() => {
    const lines = currentCode.split('\n');
    setLineNumbers(lines.map((_, i) => String(i + 1)));
  }, [currentCode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl/Cmd + F - Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      // Ctrl/Cmd + H - Replace
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowSearch(true);
      }
      // Ctrl/Cmd + P - Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Ctrl/Cmd + ` - Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTerminal]);

  const getApiKey = () => {
    const key = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
    if (!key) {
      toast.error('Groq API key not found. Please configure it in settings.');
    }
    return key;
  };

  const updateActiveTab = useCallback((updates: Partial<FileTab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, ...updates, isDirty: true } : tab
    ));
  }, [activeTabId]);

  const handleCodeChange = (newCode: string) => {
    updateActiveTab({ content: newCode });
  };

  const handleAISuggest = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);
    setAiSuggestion('');

    try {
      const messages = [
        {
          role: 'system' as const,
          content: `You are an expert ${currentLang?.label} developer. Provide smart code suggestions and improvements.`
        },
        {
          role: 'user' as const,
          content: `Review this ${currentLang?.label} code and provide suggestions for improvement:\n\n\`\`\`${currentLang?.value}\n${currentCode}\n\`\`\``
        }
      ];

      const result = await callGroqAPI(apiKey, messages);
      setAiSuggestion(result);
      toast.success('AI suggestion generated!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI suggestion';
      setAiSuggestion(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFixCode = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);

    try {
      const messages = fixBugPrompt(currentCode, currentLang?.label || 'JavaScript');
      const result = await callGroqAPI(apiKey, messages);
      
      const codeMatch = result.match(/```[\w]*\n([\s\S]*?)```/);
      const fixedCode = codeMatch ? codeMatch[1] : result;
      updateActiveTab({ content: fixedCode, isDirty: false });
      toast.success('Code fixed!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fix code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExplainCode = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);
    setAiSuggestion('');

    try {
      const messages = explainCodePrompt(currentCode, currentLang?.label || 'JavaScript');
      const result = await callGroqAPI(apiKey, messages);
      setAiSuggestion(result);
      toast.success('Code explanation generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to explain code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimizeCode = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);

    try {
      const messages = refactoringPrompt(currentCode, currentLang?.label || 'JavaScript');
      const result = await callGroqAPI(apiKey, messages);
      
      const codeMatch = result.match(/```[\w]*\n([\s\S]*?)```/);
      if (codeMatch) {
        updateActiveTab({ content: codeMatch[1], isDirty: false });
      } else {
        setAiSuggestion(result);
      }
      toast.success('Code optimized!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to optimize code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateTests = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);
    setAiSuggestion('');

    try {
      const messages = [
        {
          role: 'system' as const,
          content: `You are a testing expert. Generate comprehensive unit tests for ${currentLang?.label} code.`
        },
        {
          role: 'user' as const,
          content: `Generate unit tests for this ${currentLang?.label} code:\n\n\`\`\`${currentLang?.value}\n${currentCode}\n\`\`\``
        }
      ];

      const result = await callGroqAPI(apiKey, messages);
      setAiSuggestion(result);
      toast.success('Tests generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate tests');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeCode = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (!currentCode.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsProcessing(true);
    setAiSuggestion('');

    try {
      const messages = analyzeComplexityPrompt(currentCode, currentLang?.label || 'JavaScript');
      const result = await callGroqAPI(apiKey, messages);
      setAiSuggestion(result);
      toast.success('Code analysis complete!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunCode = () => {
    setShowTerminal(true);
    setTerminalOutput(prev => [
      ...prev,
      `$ Running ${activeTab?.name}...`,
      'Code execution feature coming soon!',
      'In a real implementation, this would execute the code safely.',
      ''
    ]);
  };

  const handleSave = () => {
    if (activeTab) {
      updateActiveTab({ isDirty: false });
      localStorage.setItem(`code_editor_${activeTab.id}`, activeTab.content);
      toast.success('Code saved!');
    }
  };

  const handleFormat = () => {
    try {
      const formatted = currentCode
        .split('\n')
        .map(line => line.trim())
        .join('\n');
      updateActiveTab({ content: formatted, isDirty: false });
      toast.success('Code formatted!');
    } catch {
      toast.error('Failed to format code');
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const lines = currentCode.split('\n');
    const matches = lines
      .map((line, index) => line.includes(searchQuery) ? index + 1 : null)
      .filter((line): line is number => line !== null);
    
    if (matches.length > 0) {
      toast.success(`Found ${matches.length} match(es)`);
    } else {
      toast.info('No matches found');
    }
  };

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return;
    const newCode = currentCode.replace(new RegExp(searchQuery, 'g'), replaceQuery);
    updateActiveTab({ content: newCode });
    toast.success('Replace completed!');
  };

  const handleReplaceAll = () => {
    if (!searchQuery || !replaceQuery) return;
    const newCode = currentCode.replace(new RegExp(searchQuery, 'g'), replaceQuery);
    updateActiveTab({ content: newCode });
    toast.success('All occurrences replaced!');
  };

  const addNewTab = () => {
    const newTab: FileTab = {
      id: Date.now().toString(),
      name: `untitled${tabs.length + 1}${currentLang?.extension || '.js'}`,
      content: '',
      language: language,
      isDirty: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      toast.info('Cannot close the last tab');
      return;
    }
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied!');
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = ' '.repeat(parseInt(tabSize));
      const newCode = currentCode.substring(0, start) + spaces + currentCode.substring(end);
      handleCodeChange(newCode);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const updateCursorPosition = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const textBeforeCursor = currentCode.substring(0, textarea.selectionStart);
    const lines = textBeforeCursor.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-0 min-h-full flex flex-col w-full bg-background text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Advanced Code Editor</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          Professional IDE with AI-powered assistance
        </p>
      </div>

      {/* Top Toolbar */}
      <div className="glass-panel p-3 lg:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Language & Theme */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={language} onValueChange={(val) => {
              setLanguage(val);
              if (activeTab) updateActiveTab({ language: val });
            }}>
              <SelectTrigger className="w-full sm:w-32 text-xs lg:text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full sm:w-32 text-xs lg:text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Editor Settings */}
          <div className="flex items-center gap-2 text-xs lg:text-sm">
            <label className="text-muted-foreground whitespace-nowrap">Font:</label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-20 h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12px">12px</SelectItem>
                <SelectItem value="14px">14px</SelectItem>
                <SelectItem value="16px">16px</SelectItem>
                <SelectItem value="18px">18px</SelectItem>
              </SelectContent>
            </Select>
            <label className="text-muted-foreground whitespace-nowrap ml-2">Tab:</label>
            <Select value={tabSize} onValueChange={setTabSize}>
              <SelectTrigger className="w-16 h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleAISuggest}
              disabled={isProcessing}
              size="sm"
              className="bg-destructive hover:bg-destructive/90 text-xs lg:text-sm h-9 px-3"
            >
              <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
              <span className="hidden sm:inline">AI Suggest</span>
              <span className="sm:hidden">AI</span>
            </Button>
            <Button
              onClick={handleFixCode}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className="text-xs lg:text-sm h-9 px-3"
            >
              <Bug className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
              <span className="hidden sm:inline">Fix</span>
            </Button>
          </div>

          {/* File Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="text-xs lg:text-sm h-9 px-3"
              title="Ctrl+S"
            >
              <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              onClick={handleFormat}
              variant="outline"
              size="sm"
              className="text-xs lg:text-sm h-9 px-3"
            >
              <Wand2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
              <span className="hidden sm:inline">Format</span>
            </Button>
            <Button
              onClick={() => setShowSearch(!showSearch)}
              variant="outline"
              size="sm"
              className="text-xs lg:text-sm h-9 px-3"
              title="Ctrl+F"
            >
              <Search className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
            <Button
              onClick={() => setShowTerminal(!showTerminal)}
              variant="outline"
              size="sm"
              className="text-xs lg:text-sm h-9 px-3"
              title="Ctrl+`"
            >
              <Terminal className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 min-h-0">
        {/* File Explorer */}
        {showFileExplorer && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden xl:block xl:col-span-2 glass-panel p-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Explorer</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={addNewTab}
                className="h-6 w-6 p-0"
              >
                <File className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1 p-1 hover:bg-secondary rounded cursor-pointer">
                <Folder className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">src</span>
              </div>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-1 p-1 rounded cursor-pointer ${
                    activeTabId === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span className="flex-1 truncate">{tab.name}</span>
                  {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Code Editor Area */}
        <div className={`${showFileExplorer ? 'xl:col-span-7' : 'xl:col-span-9'} flex flex-col min-h-0`}>
          {/* Tabs */}
          <div className="glass-panel p-0 overflow-x-auto">
            <div className="flex items-center border-b border-border bg-secondary/30">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer transition-colors ${
                    activeTabId === tab.id
                      ? 'bg-background text-foreground border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span className="text-xs whitespace-nowrap">{tab.name}</span>
                  {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addNewTab}
                className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <File className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="p-2 bg-secondary/50 border-b border-border flex gap-2">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Replace"
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <Button size="sm" onClick={handleReplace} className="h-8 text-xs">Replace</Button>
                <Button size="sm" onClick={handleReplaceAll} className="h-8 text-xs">Replace All</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setReplaceQuery('');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Editor */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
              {/* Line Numbers */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-secondary/30 text-muted-foreground text-xs font-mono p-2 pt-3 select-none border-r border-border z-10"
                style={{ fontSize: fontSize }}
              >
                {lineNumbers.map((num) => (
                  <div key={num} className="h-5 leading-5 text-right pr-1 sm:pr-2">
                    {num}
                  </div>
                ))}
              </div>
              
              {/* Code Textarea */}
              <textarea
                ref={textareaRef}
                value={currentCode}
                onChange={(e) => {
                  handleCodeChange(e.target.value);
                  updateCursorPosition(e);
                }}
                onKeyDown={handleTab}
                className="w-full h-full bg-background text-foreground font-mono text-xs sm:text-sm p-3 sm:p-4 pl-12 sm:pl-16 pr-3 sm:pr-4 resize-none focus:outline-none scrollbar-dark"
                style={{ 
                  fontSize: fontSize,
                  tabSize: parseInt(tabSize) * 8
                }}
                placeholder="Start typing your code..."
                spellCheck={false}
              />

              {/* Minimap */}
              {showMinimap && (
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-secondary/20 border-l border-border overflow-hidden">
                  <div className="text-[2px] font-mono text-muted-foreground p-1 opacity-50">
                    {currentCode.split('\n').slice(0, 100).map((line, i) => (
                      <div key={i} className="truncate">{line.substring(0, 20)}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-secondary/50 border-t border-border flex items-center justify-between px-2 sm:px-3 text-xs text-muted-foreground overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <span className="truncate">{activeTab?.name || 'main.js'}</span>
                  <span className="hidden sm:inline">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                  <span className="hidden md:inline">{currentCode.split('\n').length} lines</span>
                  <span className="hidden lg:inline">{currentCode.length} chars</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:inline">{currentLang?.label}</span>
                  <button
                    onClick={() => setShowMinimap(!showMinimap)}
                    className="hover:text-foreground"
                  >
                    {showMinimap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          {showTerminal && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '200px' }}
              exit={{ height: 0 }}
              className="glass-panel p-3 mt-4 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Terminal</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTerminal(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1 bg-background rounded p-2 overflow-y-auto scrollbar-dark font-mono text-xs">
                {terminalOutput.length === 0 ? (
                  <div className="text-muted-foreground">Terminal ready. Type commands or run code.</div>
                ) : (
                  terminalOutput.map((line, i) => (
                    <div key={i} className="text-foreground">{line}</div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* AI Assistant Panel */}
        <div className="xl:col-span-3 glass-panel p-4 lg:p-6 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          </div>

          <Button
            onClick={handleAISuggest}
            disabled={isProcessing}
            className="w-full mb-4 bg-destructive hover:bg-destructive/90 h-10"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Suggestion
              </>
            )}
          </Button>

          <div className="space-y-2 mb-4">
            <Button
              onClick={handleFixCode}
              disabled={isProcessing}
              variant="outline"
              className="w-full justify-start h-9"
            >
              <Bug className="w-4 h-4 mr-2" />
              Fix Code
            </Button>
            <Button
              onClick={handleExplainCode}
              disabled={isProcessing}
              variant="outline"
              className="w-full justify-start h-9"
            >
              <Check className="w-4 h-4 mr-2" />
              Explain Code
            </Button>
            <Button
              onClick={handleOptimizeCode}
              disabled={isProcessing}
              variant="outline"
              className="w-full justify-start h-9"
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize Code
            </Button>
            <Button
              onClick={handleGenerateTests}
              disabled={isProcessing}
              variant="outline"
              className="w-full justify-start h-9"
            >
              <FileCode className="w-4 h-4 mr-2" />
              Generate Tests
            </Button>
            <Button
              onClick={handleAnalyzeCode}
              disabled={isProcessing}
              variant="outline"
              className="w-full justify-start h-9"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Code
            </Button>
          </div>

          {/* AI Suggestion Output */}
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 p-4 bg-secondary/50 rounded-lg border border-border overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground">AI Response:</h4>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(aiSuggestion);
                    toast.success('Copied!');
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1 text-xs lg:text-sm text-muted-foreground overflow-y-auto scrollbar-dark whitespace-pre-wrap">
                {aiSuggestion}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCommandPalette(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Command className="w-5 h-5 text-primary" />
                <Input
                  placeholder="Type a command..."
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowCommandPalette(false);
                  }}
                />
              </div>
              <div className="space-y-1 text-sm">
                <div className="p-2 hover:bg-secondary rounded cursor-pointer">Save File</div>
                <div className="p-2 hover:bg-secondary rounded cursor-pointer">Format Document</div>
                <div className="p-2 hover:bg-secondary rounded cursor-pointer">Toggle Terminal</div>
                <div className="p-2 hover:bg-secondary rounded cursor-pointer">Toggle File Explorer</div>
                <div className="p-2 hover:bg-secondary rounded cursor-pointer">New File</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeTools;
