import { create } from "zustand";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import {
  getInvoices,
  createInvoice,
  updateInvoiceApi,
  deleteInvoiceApi,
} from "@/lib/api";

interface Filters {
  status: InvoiceStatus | "all";
  dateFrom: string | null;
  dateTo: string | null;
  search: string;
}

interface InvoiceStore {
  invoices: Invoice[];
  filters: Filters;
  loading: boolean;

  fetchInvoices: () => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  loading: false,

  filters: {
    status: "all",
    dateFrom: null,
    dateTo: null,
    search: "",
  },

  fetchInvoices: async () => {
    set({ loading: true });

    const data = await getInvoices();
    const sorted = [...data].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    set({
      invoices: sorted,
      loading: false,
    });
  },

  addInvoice: async (invoice) => {
    set({ loading: true });

    await createInvoice(invoice);

    const updated = await getInvoices();
    const sorted = [...updated].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    set({
      invoices: sorted,
      loading: false,
    });
  },

  updateInvoice: async (invoice) => {
    set({ loading: true });

    await updateInvoiceApi(invoice);

    const updated = await getInvoices();
    const sorted = [...updated].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    set({
      invoices: sorted,
      loading: false,
    });
  },

  deleteInvoice: async (id) => {
    set({ loading: true });

    await deleteInvoiceApi(id);

    const updated = await getInvoices();

    set({
      invoices: updated,
      loading: false,
    });
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
