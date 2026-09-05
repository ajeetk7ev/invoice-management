import * as React from 'react'
import { FileQuestion } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title = 'No Invoices Found',
  description = 'Try adjusting your search criteria or removing active filters to see available records.',
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-border bg-card/50 ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
