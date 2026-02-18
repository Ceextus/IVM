export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;         // base64 data URL
  size: number;        // bytes
  uploadedAt: string;  // ISO string
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;   // ISO date string
  dueDate: string;     // ISO date string
  items: LineItem[];
  subtotal: number;
  tax: number;         // percentage
  discount: number;    // percentage
  total: number;
  status: InvoiceStatus;
  attachments: Attachment[];
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
}
