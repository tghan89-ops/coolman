import '../globals.css'

/**
 * Root layout for the visual-editor route group. This app has no shared
 * <html>/<body> root layout (app/layout.tsx just returns children) — each route
 * group provides its own, so the editor needs one too. URL is unaffected by the
 * (editor) group; the route stays /puck-editor/:id.
 */
export const metadata = { title: 'Visual editor — Coolman' }

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
