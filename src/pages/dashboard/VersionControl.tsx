import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge,
  Plus,
  Search,
  FileText,
  Clock,
  User,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { toast } from 'sonner';

const mockRepos = [
  { id: '1', name: 'ai-code-assistant', description: 'AI-powered code completion system', branches: 12, commits: 234, updated: '2 hours ago' },
  { id: '2', name: 'devops-pipeline', description: 'Automated CI/CD workflow', branches: 5, commits: 156, updated: '1 day ago' },
  { id: '3', name: 'analytics-dashboard', description: 'Real-time metrics visualization', branches: 8, commits: 89, updated: '3 days ago' },
];

let mockCommits = [
  { id: 'c1', message: 'feat: Add AI code suggestions endpoint', author: 'John Doe', date: '2 hours ago', sha: 'a1b2c3d', additions: 145, deletions: 23 },
  { id: 'c2', message: 'fix: Resolve memory leak in analysis module', author: 'Jane Smith', date: '5 hours ago', sha: 'e4f5g6h', additions: 12, deletions: 45 },
  { id: 'c3', message: 'chore: Update dependencies', author: 'John Doe', date: '1 day ago', sha: 'i7j8k9l', additions: 200, deletions: 180 },
  { id: 'c4', message: 'docs: Improve API documentation', author: 'Alice Johnson', date: '2 days ago', sha: 'm0n1o2p', additions: 89, deletions: 12 },
  { id: 'c5', message: 'refactor: Optimize database queries', author: 'Bob Wilson', date: '3 days ago', sha: 'q3r4s5t', additions: 56, deletions: 78 },
];

const mockBranches = ['main', 'develop', 'feature/ai-improvements', 'feature/new-dashboard', 'bugfix/memory-leak'];

const VersionControl = () => {
  const [selectedRepo, setSelectedRepo] = useState(mockRepos[0]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiff, setShowDiff] = useState<string | null>(null);
  const [commits, setCommits] = useState(mockCommits);

  const filteredCommits = commits.filter(
    commit => commit.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast.error('Please enter a commit message');
      return;
    }
    // Mock commit action
    const newCommit = {
      id: `c${Date.now()}`,
      message: commitMessage,
      author: 'You',
      date: 'Just now',
      sha: Math.random().toString(36).substring(2, 9),
      additions: Math.floor(Math.random() * 100),
      deletions: Math.floor(Math.random() * 50),
    };
    setCommits([newCommit, ...commits]);
    setCommitMessage('');
    toast.success('Commit created successfully!');
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    toast.info(`Switched to branch: ${branch}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 lg:pb-0 w-full min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Version Control</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your repositories and commits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Repositories List */}
        <div className="glass-panel p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Repositories</h3>
          <div className="space-y-2 sm:space-y-3">
            {mockRepos.map((repo) => (
              <motion.button
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-3 sm:p-4 rounded-lg text-left transition-all ${
                  selectedRepo.id === repo.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary/50 border border-transparent hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <GitBranch className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base text-foreground truncate">{repo.name}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">{repo.description}</p>
                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {repo.branches}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />
                    {repo.commits}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Branch Selector & Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="input-dark text-sm sm:text-base w-full sm:w-auto sm:min-w-[180px]"
            >
              {mockBranches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commits..."
                className="input-dark w-full pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* New Commit */}
          <div className="glass-panel p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Create Commit</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Enter commit message..."
                className="input-dark flex-1 text-sm sm:text-base"
              />
              <motion.button
                onClick={handleCommit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!commitMessage.trim()}
                className="btn-gradient px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              >
                <GitCommit className="w-4 h-4" />
                <span>Commit</span>
              </motion.button>
            </div>
          </div>

          {/* Commit History */}
          <div className="glass-panel p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Commit History</h3>
            <div className="space-y-2 sm:space-y-3">
              {filteredCommits.map((commit, index) => (
                <motion.div
                  key={commit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 sm:p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <GitCommit className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-sm sm:text-base text-foreground break-words">{commit.message}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{commit.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {commit.date}
                        </span>
                        <code className="px-1.5 py-0.5 rounded bg-muted text-xs break-all sm:break-normal">{commit.sha}</code>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <span className="text-xs text-success flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        +{commit.additions}
                      </span>
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <ArrowDownLeft className="w-3 h-3" />
                        -{commit.deletions}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setShowDiff(showDiff === commit.id ? null : commit.id)}
                    className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 w-full sm:w-auto"
                  >
                    <FileText className="w-3 h-3" />
                    {showDiff === commit.id ? 'Hide diff' : 'View diff'}
                  </motion.button>

                  {showDiff === commit.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 rounded bg-background font-mono text-xs overflow-x-auto"
                    >
                      <div className="text-success">+ const newFeature = () =&gt; {'{'}</div>
                      <div className="text-success">+   console.log('New feature added');</div>
                      <div className="text-success">+ {'}'};</div>
                      <div className="text-muted-foreground mt-2">  export default App;</div>
                      <div className="text-destructive">- // TODO: Remove this</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
