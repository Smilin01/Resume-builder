import { useResumeStore } from '../store/resumeStore';
import { FileText, Code, Eye, Save, Download, Settings, Moon, Sun, LayoutTemplate } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentTab, setCurrentTab, syncMetadata, settings, setSettings } = useResumeStore();

  const getSyncIcon = () => {
    switch (syncMetadata.syncStatus) {
      case 'synced':
        return <span className="text-green-600">✓</span>;
      case 'syncing':
        return <span className="text-yellow-600 animate-spin">↻</span>;
      case 'error':
        return <span className="text-red-600">✗</span>;
      default:
        return null;
    }
  };

  const toggleTheme = () => {
    setSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`border-b ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center mr-8">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <span className={`text-xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Resume Builder
                </span>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentTab('templates')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${currentTab === 'templates'
                      ? settings.theme === 'dark'
                        ? 'bg-gray-900 text-white border-t border-x border-gray-700'
                        : 'bg-gray-50 text-gray-900 border-t border-x border-gray-300'
                      : settings.theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <LayoutTemplate className="inline h-4 w-4 mr-2" />
                  Templates
                </button>
                <button
                  onClick={() => setCurrentTab('visual')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${currentTab === 'visual'
                      ? settings.theme === 'dark'
                        ? 'bg-gray-900 text-white border-t border-x border-gray-700'
                        : 'bg-gray-50 text-gray-900 border-t border-x border-gray-300'
                      : settings.theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <FileText className="inline h-4 w-4 mr-2" />
                  Visual Editor
                </button>
                <button
                  onClick={() => setCurrentTab('code')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${currentTab === 'code'
                      ? settings.theme === 'dark'
                        ? 'bg-gray-900 text-white border-t border-x border-gray-700'
                        : 'bg-gray-50 text-gray-900 border-t border-x border-gray-300'
                      : settings.theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Code className="inline h-4 w-4 mr-2" />
                  Code Editor
                </button>
                <button
                  onClick={() => setCurrentTab('preview')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${currentTab === 'preview'
                      ? settings.theme === 'dark'
                        ? 'bg-gray-900 text-white border-t border-x border-gray-700'
                        : 'bg-gray-50 text-gray-900 border-t border-x border-gray-300'
                      : settings.theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Eye className="inline h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {syncMetadata.syncStatus === 'synced' && 'Synced'}
                  {syncMetadata.syncStatus === 'syncing' && 'Syncing...'}
                  {syncMetadata.syncStatus === 'error' && 'Sync Failed'}
                </span>
                {getSyncIcon()}
              </div>

              <button
                className={`p-2 rounded-lg ${settings.theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Save Resume"
              >
                <Save className="h-5 w-5" />
              </button>

              <button
                className={`p-2 rounded-lg ${settings.theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Download PDF"
              >
                <Download className="h-5 w-5" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${settings.theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Toggle Theme"
              >
                {settings.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                className={`p-2 rounded-lg ${settings.theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
