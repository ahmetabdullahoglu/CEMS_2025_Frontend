import apiClient from './client'
import type {
  Customer,
  CustomerRequest,
  CustomerListResponse,
  CustomerQueryParams,
} from '@/types/customer.types'

export const customerApi = {
  // Get customers list with filters and pagination
  getCustomers: async (params: CustomerQueryParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get<CustomerListResponse>('/customers', { params })
    return response.data
  },

  // Get customer by ID
  getCustomer: async (id: number): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`)
    return response.data
  },

  // Create new customer
  createCustomer: async (data: CustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', data)
    return response.data
  },

  // Update customer
  updateCustomer: async (id: number, data: CustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data)
    return response.data
  },

  // Delete customer
  deleteCustomer: async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`)
  },
}
