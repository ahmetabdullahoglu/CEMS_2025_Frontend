import { useRef, useState } from 'react'
import { Upload, File, Trash2, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCustomerDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useCustomers'
import { format } from 'date-fns'

interface DocumentUploadProps {
  customerId: string
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  national_id: 'National ID',
  passport: 'Passport',
  driving_license: 'Driving License',
  utility_bill: 'Utility Bill',
  bank_statement: 'Bank Statement',
  commercial_registration: 'Commercial Registration',
  tax_certificate: 'Tax Certificate',
  other: 'Other',
}

export default function DocumentUpload({ customerId }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const { data: documents, isLoading, isError } = useCustomerDocuments(customerId)
  const { mutate: uploadDocument } = useUploadDocument()
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument()

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    uploadDocument(
      { customerId, file },
      {
        onSuccess: () => {
          setUploading(false)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
        onError: () => {
          setUploading(false)
        },
      }
    )
  }

  const handleDelete = (documentId: string) => {
    deleteDocument(
      { customerId, documentId },
      {
        onSuccess: () => {
          setShowDeleteConfirm(null)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="ml-3 text-sm text-muted-foreground">Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-sm text-destructive">Failed to load documents</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to upload a document
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={handleFileSelect} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Select File'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: PDF, JPG, PNG, DOC, DOCX
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {!documents || documents.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <File className="w-8 h-8 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
                        </p>
                        {doc.is_verified ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {doc.document_number && (
                          <>
                            <span className="font-mono">{doc.document_number}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Uploaded {format(new Date(doc.uploaded_at), 'PP')}</span>
                        {doc.expiry_date && (
                          <>
                            <span>•</span>
                            <span>Expires {format(new Date(doc.expiry_date), 'PP')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.document_url, '_blank')}
                      title="View Document"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(doc.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Delete Document</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this document? This action cannot be undone.
                  </p>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(showDeleteConfirm)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
