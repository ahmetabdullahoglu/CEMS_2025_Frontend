import apiClient from './client'
import type {
  Customer,
  CustomerRequest,
  CustomerListResponse,
  CustomerQueryParams,
  CustomerDocument,
  DocumentUploadResponse,
} from '@/types/customer.types'

export const customerApi = {
  // Get customers list with filters and pagination
  getCustomers: async (params: CustomerQueryParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get<CustomerListResponse>('/customers', { params })
    return response.data
  },

  // Get customer by ID
  getCustomer: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`)
    return response.data
  },

  // Create new customer
  createCustomer: async (data: CustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', data)
    return response.data
  },

  // Update customer
  updateCustomer: async (id: string, data: CustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data)
    return response.data
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`)
  },

  // Get customer documents
  getCustomerDocuments: async (customerId: string): Promise<CustomerDocument[]> => {
    const response = await apiClient.get<CustomerDocument[]>(`/customers/${customerId}/documents`)
    return response.data
  },

  // Upload customer document
  uploadDocument: async (customerId: string, file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<DocumentUploadResponse>(
      `/customers/${customerId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  // Delete customer document
  deleteDocument: async (customerId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/customers/${customerId}/documents/${documentId}`)
  },
}
