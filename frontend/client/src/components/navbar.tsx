import { Button } from '@/components/ui/button'
import { useTheme } from './theme-provider'
import { Moon, Sun, CheckCircle } from 'lucide-react'

interface NavbarProps {
  onExport?: () => void
  exportEnabled?: boolean
}

export default function Navbar({ onExport, exportEnabled = false }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="bg-background/60 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-chart-1" />
            <span className="text-xl font-bold">Resume Rater</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              onClick={onExport}
              disabled={!exportEnabled}
              data-testid="button-export"
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}