// Sidebar link in the Payload admin pointing at /admin/search-analytics.
// Rendered above the auto-generated collection links via admin.components.beforeNavLinks.

import React from 'react'
import Link from 'next/link'

const SearchAnalyticsNavLink: React.FC = () => {
  return (
    <Link
      href="/admin/search-analytics"
      style={{
        display: 'block',
        padding: '8px 12px',
        marginBottom: 4,
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--theme-text)',
        textDecoration: 'none',
        background: 'var(--theme-elevation-100)',
      }}
    >
      📊 Search Analytics
    </Link>
  )
}

export default SearchAnalyticsNavLink
