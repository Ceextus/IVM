import { Invoice } from "@/types/invoice";

const STORAGE_KEY = "invoices";

/**
 * Simulate real API delay
 */
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely read invoices from localStorage
 */
const readStorage = (): Invoice[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Save invoices to localStorage
 */
const writeStorage = (invoices: Invoice[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

/**
 * GET ALL INVOICES
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  await delay(500);
  return readStorage();
};

/**
 * GET SINGLE INVOICE
 */
export const getInvoiceById = async (
  id: string
): Promise<Invoice | null> => {
  await delay(300);

  const invoices = readStorage();
  return invoices.find((invoice) => invoice.id === id) || null;
};

/**
 * CREATE INVOICE
 */
export const createInvoice = async (
  invoice: Invoice
): Promise<Invoice> => {
  await delay(500);

  const invoices = readStorage();
  const updated = [...invoices, invoice];

  writeStorage(updated);

  return invoice;
};

/**
 * UPDATE INVOICE
 */
export const updateInvoiceApi = async (
  updatedInvoice: Invoice
): Promise<Invoice> => {
  await delay(500);

  const invoices = readStorage();

  const updated = invoices.map((invoice) =>
    invoice.id === updatedInvoice.id ? updatedInvoice : invoice
  );

  writeStorage(updated);

  return updatedInvoice;
};

/**
 * DELETE INVOICE
 */
export const deleteInvoiceApi = async (
  id: string
): Promise<string> => {
  await delay(500);

  const invoices = readStorage();

  const updated = invoices.filter(
    (invoice) => invoice.id !== id
  );

  writeStorage(updated);

  return id;
};
