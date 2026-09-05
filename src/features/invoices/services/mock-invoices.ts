import type { Customer, Invoice, InvoiceStatus, LineItem } from '../types/invoice.types'
import { calculateAmountDue, calculateLineItemAmount, calculateSubtotal, calculateTax, calculateTotal } from '../utils/invoice-calculations'

const CUSTOMERS: Customer[] = [
  { id: 'cust-01', name: 'Rajesh Sharma', company: 'Maersk India Logistics Ltd', email: 'rajesh.sharma@maersk.com', taxId: '27AAACM1234F1Z1', address: 'Bandra-Kurla Complex', city: 'Mumbai', state: 'Maharashtra', postalCode: '400051', country: 'India' },
  { id: 'cust-02', name: 'Priya Sundaram', company: 'DHL Supply Chain Solutions', email: 'priya.s@dhl.com', taxId: '29AABCD5678G1Z2', address: 'Whitefield Export Zone', city: 'Bangalore', state: 'Karnataka', postalCode: '560066', country: 'India' },
  { id: 'cust-03', name: 'Vikram Malhotra', company: 'BlueDart Express Freight', email: 'v.malhotra@bluedart.com', taxId: '07AAACB9012H1Z3', address: 'Okhla Industrial Area', city: 'New Delhi', state: 'Delhi', postalCode: '110020', country: 'India' },
  { id: 'cust-04', name: 'Ananya Roy', company: 'Reliance Retail Logistics', email: 'ananya.roy@ril.com', taxId: '27AAACR3456I1Z4', address: 'Ghansoli Tech Park', city: 'Navi Mumbai', state: 'Maharashtra', postalCode: '400701', country: 'India' },
  { id: 'cust-05', name: 'Karthik Raman', company: 'Tata Motors Supply Chain', email: 'karthik.r@tatamotors.com', taxId: '27AAACT7890J1Z5', address: 'Pimpri Logistics Hub', city: 'Pune', state: 'Maharashtra', postalCode: '411018', country: 'India' },
  { id: 'cust-06', name: 'Sneha Patel', company: 'Flipkart Fulfilment Services', email: 'sneha.patel@flipkart.com', taxId: '29AAACF2345K1Z6', address: 'Bellandur Outer Ring Road', city: 'Bangalore', state: 'Karnataka', postalCode: '560103', country: 'India' },
  { id: 'cust-07', name: 'Amitabh Sen', company: 'Delhivery Express Networks', email: 'amitabh.sen@delhivery.com', taxId: '06AAACD6789L1Z7', address: 'Sector 44 Logistics Park', city: 'Gurgaon', state: 'Haryana', postalCode: '122003', country: 'India' },
  { id: 'cust-08', name: 'Meera Iyer', company: 'Mahindra Logistics Corp', email: 'meera.iyer@mahindra.com', taxId: '27AAACM0123M1Z8', address: 'Worli Gateway', city: 'Mumbai', state: 'Maharashtra', postalCode: '400018', country: 'India' },
  { id: 'cust-09', name: 'Arjun Deshmukh', company: 'Sun Pharma Cold Chain', email: 'arjun.d@sunpharma.com', taxId: '24AAACS4567N1Z9', address: 'Tandalja R&D Center', city: 'Vadodara', state: 'Gujarat', postalCode: '390012', country: 'India' },
  { id: 'cust-10', name: 'Rohan Verma', company: 'ITC Agro Distribution', email: 'rohan.verma@itc.in', taxId: '19AAACI8901O1Z0', address: 'Virginia House, J.L. Nehru Rd', city: 'Kolkata', state: 'West Bengal', postalCode: '700071', country: 'India' },
  { id: 'cust-11', name: 'Divya Nair', company: 'Asian Paints National Logistics', email: 'divya.nair@asianpaints.com', taxId: '27AAACA2345P1Z1', address: 'Santacruz East Hub', city: 'Mumbai', state: 'Maharashtra', postalCode: '400055', country: 'India' },
  { id: 'cust-12', name: 'Deepak Joshi', company: 'Adani Ports & SEZ Logistics', email: 'deepak.joshi@adani.com', taxId: '24AAACA6789Q1Z2', address: 'Mundra Port Logistics SEZ', city: 'Mundra', state: 'Gujarat', postalCode: '370421', country: 'India' },
  { id: 'cust-13', name: 'Kavita Menon', company: 'TVS Supply Chain Solutions', email: 'kavita.m@tvsscs.com', taxId: '33AAACT0123R1Z3', address: 'Mount Road Industrial Area', city: 'Chennai', state: 'Tamil Nadu', postalCode: '600002', country: 'India' },
  { id: 'cust-14', name: 'Siddharth Rao', company: 'UltraTech Cement Freight', email: 'siddharth.rao@adityabirla.com', taxId: '27AAACU4567S1Z4', address: 'Ahura Centre, Andheri East', city: 'Mumbai', state: 'Maharashtra', postalCode: '400093', country: 'India' },
  { id: 'cust-15', name: 'Pooja Hegde', company: 'Cipla Biotech Logistics', email: 'pooja.h@cipla.com', taxId: '27AAACC8901T1Z5', address: 'Vikhroli West Logistics Park', city: 'Mumbai', state: 'Maharashtra', postalCode: '400079', country: 'India' },
]

const SERVICE_TEMPLATES = [
  { description: 'Full Truckload (FTL) Multi-Axle 32ft Container Transit', unitPrice: 48500, taxRate: 0.18 },
  { description: 'Dedicated Line-Haul Inter-State Freight Corridor', unitPrice: 62000, taxRate: 0.18 },
  { description: 'Cold Chain Refrigerated Container Transport (-20°C)', unitPrice: 78000, taxRate: 0.18 },
  { description: 'Less-Than-Truckload (LTL) Palletized Cargo Consolidation', unitPrice: 16500, taxRate: 0.18 },
  { description: 'Customs Port Clearance & Nhava Sheva Terminal Handling', unitPrice: 24000, taxRate: 0.18 },
  { description: 'Warehouse Pallet Storage & Ambient Humidity Monitoring', unitPrice: 32000, taxRate: 0.18 },
  { description: 'First-Mile Inter-Facility Bulk Cargo Shuttling', unitPrice: 19500, taxRate: 0.18 },
  { description: 'High-Value In-transit Security Escort & GPS Telematics', unitPrice: 14500, taxRate: 0.18 },
  { description: 'Specialized Over-Dimensional Cargo (ODC) Heavy Transit', unitPrice: 125000, taxRate: 0.18 },
  { description: 'Reverse Logistics & Warranty Asset Reclamation', unitPrice: 21000, taxRate: 0.18 },
]

const HUBS = [
  'Bhiwandi Central Hub, Mumbai',
  'Nelamangala Logistics Park, Bangalore',
  'Bilaspur Transhipment Hub, Gurgaon',
  'Sriperumbudur Freight Park, Chennai',
  'Dankuni Junction Logistics Center, Kolkata',
  'Sanand Industrial Corridor, Ahmedabad',
  'Kallakal Warehousing Zone, Hyderabad',
  'Chakan Auto Freight Hub, Pune',
]

function generateMockInvoices(count: number = 85): Invoice[] {
  const invoices: Invoice[] = []

  // Seed with predictable variety
  for (let i = 1; i <= count; i++) {
    const padded = String(i).padStart(4, '0')
    const invoiceNumber = `INV-2026-${padded}`
    const customer = CUSTOMERS[(i - 1) % CUSTOMERS.length]

    // Status distribution: ~45% PAID, ~30% PENDING, ~15% OVERDUE, ~10% DRAFT
    let status: InvoiceStatus
    if (i % 10 === 0) {
      status = 'DRAFT'
    } else if (i % 6 === 0) {
      status = 'OVERDUE'
    } else if (i % 3 === 0) {
      status = 'PENDING'
    } else {
      status = 'PAID'
    }

    // Generate dates: distributed between Jan 2026 and Sep 2026
    const issueMonth = Math.min(8, Math.floor((i - 1) / 10))
    const issueDay = 1 + ((i * 3) % 27)
    const issueDateStr = `2026-${String(issueMonth + 1).padStart(2, '0')}-${String(issueDay).padStart(2, '0')}`

    // Due date is typically +15 or +30 days
    const dueDay = Math.min(28, issueDay + ((i % 2 === 0) ? 15 : 30))
    const dueMonth = dueDay < issueDay ? issueMonth + 2 : issueMonth + 1
    const dueDateStr = `2026-${String(Math.min(12, dueMonth)).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`

    // Generate 1 to 4 line items
    const itemCount = 1 + (i % 4)
    const lineItems: LineItem[] = []

    for (let j = 0; j < itemCount; j++) {
      const template = SERVICE_TEMPLATES[(i + j * 3) % SERVICE_TEMPLATES.length]
      const quantity = 1 + ((i + j) % 5)
      const amount = calculateLineItemAmount(quantity, template.unitPrice)
      lineItems.push({
        id: `li-${i}-${j + 1}`,
        description: template.description,
        quantity,
        unitPrice: template.unitPrice,
        taxRate: template.taxRate,
        amount,
      })
    }

    const subtotal = calculateSubtotal(lineItems)
    const tax = calculateTax(lineItems)
    const total = calculateTotal(subtotal, tax)

    let amountPaid: number
    let amountDue: number

    if (status === 'PAID') {
      amountPaid = total
      amountDue = 0
    } else if (status === 'PENDING') {
      // Partial payment on some pending invoices
      amountPaid = i % 4 === 0 ? Math.round((total * 0.4) * 100) / 100 : 0
      amountDue = calculateAmountDue(total, amountPaid)
    } else if (status === 'OVERDUE') {
      amountPaid = i % 5 === 0 ? Math.round((total * 0.25) * 100) / 100 : 0
      amountDue = calculateAmountDue(total, amountPaid)
    } else {
      // DRAFT
      amountPaid = 0
      amountDue = total
    }

    const originHub = HUBS[(i * 2) % HUBS.length]
    const destinationHub = HUBS[(i * 2 + 3) % HUBS.length]
    const trackingNumber = `FF-AWB-${20260000 + i}`

    invoices.push({
      id: `inv-${padded}`,
      invoiceNumber,
      customer,
      customerEmail: customer.email,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      status,
      subtotal,
      tax,
      total,
      amountPaid,
      amountDue,
      currency: 'INR',
      lineItems,
      originHub,
      destinationHub,
      trackingNumber,
      paymentTerms: 'Net 30 Days',
      notes: `Consignment for ${customer.company}. Standard SLA guarantee applicable.`,
      createdAt: `${issueDateStr}T09:30:00.000Z`,
      updatedAt: `${issueDateStr}T10:15:00.000Z`,
    })
  }

  return invoices
}

export const INITIAL_MOCK_INVOICES: Invoice[] = generateMockInvoices(85)
