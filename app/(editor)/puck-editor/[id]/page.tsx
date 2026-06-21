import { EditorClient } from './EditorClient'

/**
 * Visual editor route (admin-only, desktop). Opened from "Open visual editor"
 * on a Page in the Payload admin. Auth is enforced by the Pages collection
 * access control — the REST calls the client makes require an adminUsers session.
 *
 * Lives in the (editor) route group so it gets its own <html>/<body> layout
 * (this app has no shared root layout). URL stays /puck-editor/:id.
 */
export default async function PuckEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditorClient id={id} />
}
