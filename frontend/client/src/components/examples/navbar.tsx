import Navbar from '../navbar'
import { ThemeProvider } from '../theme-provider'

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Navbar 
        onExport={() => console.log('Export clicked')}
        exportEnabled={true}
      />
    </ThemeProvider>
  )
}