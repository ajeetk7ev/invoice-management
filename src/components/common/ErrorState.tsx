import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Failed to Load Invoices',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card className={`border-destructive/30 bg-destructive/5 ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>

        {onRetry && (
          <div className="flex items-center justify-center">
            <Button variant="default" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Retry Request</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
