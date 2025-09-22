# Resume Analyzer Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern productivity tools like Notion and Linear, combined with data visualization patterns from analytics dashboards. This approach suits the utility-focused nature of resume analysis while maintaining professional appeal.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 219 39% 11% (deep navy for headers and key elements)
- Secondary: 220 13% 18% (dark gray for body text)
- Background: 0 0% 100% (pure white)
- Surface: 220 13% 97% (light gray for cards and sections)
- Accent: 142 76% 36% (success green for scores and positive feedback)
- Warning: 25 95% 53% (orange for improvement areas)

**Dark Mode:**
- Primary: 220 13% 97% (light text)
- Secondary: 220 9% 75% (muted text)
- Background: 222 84% 5% (deep dark background)
- Surface: 217 33% 17% (dark cards and sections)
- Accent: 142 71% 45% (brighter green for dark mode)
- Warning: 25 95% 60% (adjusted orange for dark contrast)

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headers**: 600-700 font weight for strong hierarchy
- **Body**: 400-500 font weight for comfortable reading
- **Code/Data**: 400 font weight with monospace fallback for scores and metrics

### Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, and 12 for consistent rhythm
- Small gaps: p-4, m-4
- Medium spacing: p-6, gap-6
- Large sections: p-8, mb-8
- Major divisions: p-12, space-y-12

### Component Library

**Navigation:**
- Clean horizontal navbar with logo, navigation links, and theme toggle
- Sticky positioning for easy access during long analysis reviews
- Minimal design with subtle hover states

**Cards & Sections:**
- Rounded corners (rounded-lg) for modern appearance
- Subtle shadows for depth and hierarchy
- Clear section dividers with consistent padding

**Data Visualization:**
- Progress bars for scores with gradient fills matching accent colors
- Chart.js integration for analytics with consistent color theming
- Badge-style elements for keywords and skills
- Timeline components for career progression

**Interactive Elements:**
- Drag-and-drop upload area with clear visual feedback
- Buttons with solid primary style for main actions
- Outline variants for secondary actions
- Loading states with skeleton components

**Content Organization:**
- Grid-based layout for analysis sections
- Collapsible sections for detailed recommendations
- Before/after comparison layouts for improvement suggestions
- Tabbed interface for different analysis categories

### Visual Hierarchy
- **Primary**: Large headings and key scores prominently displayed
- **Secondary**: Section headers and important metrics clearly defined
- **Tertiary**: Supporting text and detailed breakdowns appropriately sized
- Strategic use of color to guide attention to actionable insights

### Responsive Design
- Mobile-first approach with progressive enhancement
- Collapsible navigation for mobile devices
- Stacked layouts on smaller screens with maintained readability
- Touch-friendly interactive elements

This design framework creates a professional, data-focused application that clearly presents resume analysis results while maintaining excellent usability and modern aesthetic appeal.