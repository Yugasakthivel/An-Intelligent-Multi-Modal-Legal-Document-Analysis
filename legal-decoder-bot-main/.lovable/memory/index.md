Design system and UI architecture for LegalDocAI — Light Green Theme.

## Design System
- Font: Plus Jakarta Sans (body + headings), JetBrains Mono (code)
- Primary: Green (#22c55e / 142 71% 45%), Accent: Darker green (#16a34a / 142 76% 36%)
- Background: White (#ffffff), secondary: #f8fafc
- Text primary: #1e293b, text secondary: #64748b
- Border: #e2e8f0
- Cards: white with border + subtle shadow, hover lift
- Gradient: green → darker green on buttons, login panel, avatars
- Risk cards: border-left colored by severity on white/light backgrounds

## Auth
- Auto-confirm enabled (no email verification needed)
- Signup captures full_name in user_metadata
- Navbar displays user's full_name (falls back to email prefix)
- Logout works from sidebar + navbar dropdown

## Component Architecture
- AppLayout wraps dashboard/analysis with SidebarProvider + top navbar + user dropdown
- AppSidebar: collapsible icon sidebar with Operations/Analysis/System groups
- Dashboard: MetricCards, UploadArea, DocumentsTable, PipelineProgress
- Analysis: ConfidenceGauge (green gradient), EntityTags (colored chips), RiskClauseCard, TimelineView
- Auth: split-screen (green gradient left, white form right) with full name field on signup

## Backend
- NO backend changes. All edge functions, DB schema, API endpoints unchanged.
