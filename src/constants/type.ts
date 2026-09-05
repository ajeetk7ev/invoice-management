/**
 * Centralized Semantic Design Tokens: Typography
 * Defines typography scale, weights, and line heights.
 */

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px - table body & dense text
    base: '1rem',     // 16px - body default
    lg: '1.125rem',   // 18px - subheadings
    xl: '1.25rem',    // 20px - section headers
    '2xl': '1.5rem',  // 24px - stat values
    '3xl': '1.875rem',// 30px - page titles
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const
