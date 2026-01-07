import type { DocumentType, Organization } from '@/types/types'
import nomadContractTemplate from '../document-templates/nomad/contract.docx?url'
import xanshaContractTemplate from '../document-templates/xansha/contract.docx?url'
import xanshaInvoiceTemplate from '../document-templates/xansha/invoice.xlsx?url'

class DocumentLoaderService {
  constructor() {}
  async loadTemplate(orgonazation: Organization, documentType: DocumentType = 'CONTRACT') {
    switch (documentType) {
      case 'CONTRACT':
        return await fetch(orgonazation === 'NOMADDOCS' ? nomadContractTemplate : xanshaContractTemplate)
      case 'INVOICE':
        // TODO: Do not forget to add nomad invoice template when it will be available for nomad organization
        return await fetch(orgonazation === 'NOMADDOCS' ? nomadContractTemplate : xanshaInvoiceTemplate)
      case 'ACT':
      case 'CASH_RECEIPT':
      default:
        return await fetch(orgonazation === 'NOMADDOCS' ? nomadContractTemplate : xanshaContractTemplate)
    }
  }
}

export const DocumentLoaderServiceInstance = new DocumentLoaderService()
