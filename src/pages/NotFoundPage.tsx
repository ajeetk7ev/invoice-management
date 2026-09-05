import { FileQuestion, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <FileQuestion className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
        <h2 className="text-lg font-semibold text-foreground">Page Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The invoice page or resource you requested could not be located in FreightFox.
        </p>
        <div className="pt-2">
          <Link to="/invoices">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              <span>Return to Invoices Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
