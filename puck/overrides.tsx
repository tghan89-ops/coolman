'use client'

/**
 * Editor-only Puck overrides. Adds a lucide icon to every item in the left-hand
 * component list so an editor can tell at a glance what each block is (GH
 * feedback: "have some rich icon to know what that tab is about").
 *
 * `drawerItem` is the current override key (`componentItem` is deprecated). It
 * receives the default label content as `children` plus the component `name`.
 * This file is imported ONLY by the editor client (EditorClient), never by the
 * server <Render> path, so lucide never ships to public pages.
 */
import type { Overrides } from '@puckeditor/core'
import {
  Heading, Type, MousePointerClick, Star, Quote, ListCollapse, ListChecks, Info,
  Image as ImageIcon, Images, GalleryHorizontal, Video, PanelTop, LayoutPanelLeft,
  ListOrdered, BarChart3, Megaphone, LayoutTemplate, Columns3, SquareStack,
  MoveVertical, Minus, Component,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Heading,
  Text: Type,
  Button: MousePointerClick,
  Feature: Star,
  Quote,
  Accordion: ListCollapse,
  Checklist: ListChecks,
  Callout: Info,
  Image: ImageIcon,
  Gallery: Images,
  LogoStrip: GalleryHorizontal,
  Video,
  Hero: PanelTop,
  ImageText: LayoutPanelLeft,
  Steps: ListOrdered,
  Stats: BarChart3,
  CTABanner: Megaphone,
  Section: LayoutTemplate,
  Columns: Columns3,
  Card: SquareStack,
  Spacer: MoveVertical,
  Divider: Minus,
}

export const overrides: Partial<Overrides> = {
  drawerItem: ({ children, name }) => {
    const Icon = ICONS[name] ?? Component
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <Icon size={16} strokeWidth={1.75} style={{ color: '#3b82f6', flexShrink: 0 }} aria-hidden="true" />
        <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      </span>
    )
  },
  // Hide Puck's built-in "Publish" button — we provide our own Save draft /
  // Publish pair in the editor's top bar (with draft-vs-live state). This kills
  // the duplicate Publish; undo/redo and the viewport controls live elsewhere in
  // Puck's header and are unaffected.
  headerActions: () => <></>,
}

export default overrides
