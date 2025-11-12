import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '@/lib/api/customer.api'
import type { CustomerQueryParams, CustomerRequest } from '@/types/customer.types'

/**
 * Hook for getting customers list with filters and pagination
 */
export const useCustomers = (params: CustomerQueryParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.getCustomers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook for getting a single customer by ID
 */
export const useCustomer = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getCustomer(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for creating a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CustomerRequest) => customerApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

/**
 * Hook for updating a customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerRequest }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

/**
 * Hook for deleting a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

/**
 * Hook for getting customer documents
 */
export const useCustomerDocuments = (customerId: number, enabled = true) => {
  return useQuery({
    queryKey: ['customer', customerId, 'documents'],
    queryFn: () => customerApi.getCustomerDocuments(customerId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for uploading a document
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, file }: { customerId: number; file: File }) =>
      customerApi.uploadDocument(customerId, file),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'documents'] })
    },
  })
}

/**
 * Hook for deleting a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, documentId }: { customerId: number; documentId: number }) =>
      customerApi.deleteDocument(customerId, documentId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'documents'] })
    },
  })
}
