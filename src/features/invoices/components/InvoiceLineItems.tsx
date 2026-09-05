import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table'
import type { Invoice } from '../types/invoice.types'
import { formatCurrency } from '../utils/invoice-calculations'

interface InvoiceLineItemsProps {
  invoice: Invoice
}

export function InvoiceLineItems({ invoice }: InvoiceLineItemsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Freight Services & Charges</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Charge Description</TableHead>
              <TableHead className="w-20 text-right">Qty</TableHead>
              <TableHead className="w-32 text-right">Unit Rate</TableHead>
              <TableHead className="w-24 text-right">Tax Rate</TableHead>
              <TableHead className="w-36 text-right">Amount (INR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((item, idx) => (
              <TableRow key={item.id || idx}>
                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium text-foreground text-sm">
                  {item.description}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  {(item.taxRate * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-foreground text-sm">
                  {formatCurrency(item.amount, invoice.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
