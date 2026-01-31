import type { RichText } from 'exceljs'
import type { DocumentFormSchema } from '@/schemes/document-form.schema'
import type { DynamicKeyValueSchema } from '@/schemes/dynamic-key-value.schema'
import type { DocumentServiceOptions, DocumentType, Organization } from '@/types/types'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import Docxtemplater from 'docxtemplater'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import PizZip from 'pizzip'
import { PostSetAdditionalOptionsInvoice } from '@/api/api'
import { countDays, countTotalAmount, documentNaming, formatNumberToRussian, formatWithSpacesNumber, isRichTextValue, upperCaseFirstLetter } from '@/lib/utils'
import { DocumentLoaderServiceInstance } from './document-loader.service'

class DocumentService {
  constructor() { }
  async processDocuments(data: DocumentFormSchema, organization: Organization = 'NOMADDOCS', options?: DocumentServiceOptions) {
    const zip = new JSZip()
    const contract = await this.processDocumentConract(data, organization)
    const invoice = await this.processDocumentXlsx(data, organization, 'INVOICE')
    const act = await this.processDocumentXlsx(data, organization, 'ACT')
    const cashReceipt = await this.processDocumentXlsx(data, organization, 'CASH_RECEIPT')

    if (contract && invoice && act && cashReceipt) {
      zip.file(contract.filename, contract.blob)
      zip.file(invoice.filename, invoice.blob)
      zip.file(act.filename, act.blob)
      zip.file(cashReceipt.filename, cashReceipt.blob)

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipFilename = documentNaming('ALL', data.fullnameClient)

      saveAs(zipBlob, zipFilename)
    }
    options?.onSuccess?.()
  }

  private async processDocumentXlsx(data: DocumentFormSchema, organization: Organization = 'NOMADDOCS', documentType: DocumentType) {
    const documentTemplateResponse = await DocumentLoaderServiceInstance.loadTemplate(organization, documentType)
    const documentTempalateBuffer = await documentTemplateResponse.arrayBuffer()

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(documentTempalateBuffer)

    const sheet = workbook.getWorksheet(1)
    const countedTotalAmount = countTotalAmount(Number(data.costPerDay), data.documentDate)
    const countOfDays = countDays(data.documentDate)

    if (sheet) {
      this.fillTemplatePlaceholdersXlsx(sheet, {
        ...data,
        enumerationNumeric: data.enumeration.slice(1),
        perAmount: formatWithSpacesNumber(data.costPerDay),
        documentDateFrom: dayjs(new Date(data.documentDate[0])).format('DD MMMM YYYYг'),
        documentDateTo: dayjs(new Date(data.documentDate[1])).format('DD MMMM YYYYг'),
        documentDateFromNumeric: dayjs(new Date(data.documentDate[0])).format('DD.MM.YYYYг'),
        documentDateToNumeric: dayjs(new Date(data.documentDate[1])).format('DD.MM.YYYYг'),
        clientIdDateFrom: dayjs(new Date(data.clientIdDateFrom)).format('DD.MM.YYYY'),
        totalAmount: formatWithSpacesNumber(countedTotalAmount),
        totalAmountRussian: upperCaseFirstLetter(formatNumberToRussian(countedTotalAmount).toLocaleLowerCase()),
        perAmountRussian: upperCaseFirstLetter(formatNumberToRussian(Number(data.costPerDay)).toLocaleLowerCase()),
        countOfDays,
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const filename = documentNaming(documentType, data.fullnameClient)

    if (data.cellsLine.length && documentType === 'INVOICE') {
      const finalBlob = await this.fillDynamicRows(new File([blob], filename, {
        type: blob.type,
        lastModified: Date.now(),
      }), data.cellsLine)

      if (finalBlob) {
        return { blob: finalBlob, filename }
      }
      return { blob, filename }
    }

    return { blob, filename }
  }

  private async fillDynamicRows(file: File, data: DynamicKeyValueSchema) {
    const response = await PostSetAdditionalOptionsInvoice(file, data)

    if (response.status !== 200) {
      notifications.show({
        title: 'Ошибка',
        message: 'Ошибка при сохранении дополнительных опций счет фактуры',
      })
      return
    }

    const blob = await response.blob()

    return blob
  }

  private fillTemplatePlaceholdersXlsx(sheet: ExcelJS.Worksheet, data: Record<string, unknown>) {
    const regex = /\{\{([^}]+)\}\}/g
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === 'string') {
          cell.value = cell.value.replace(regex, (_, key) => {
            const v = data[key]
            return v !== undefined && v !== null ? String(v) : ''
          })
        }
        else if (isRichTextValue(cell.value)) {
          cell.value = {
            richText: cell.value.richText.map((part: RichText) => ({
              ...part,
              text: part.text.replace(
                regex,
                (_, key) => data[key] as string ?? `{{${key}}}`,
              ),
            })),
          }
        }
      })
    })
  }

  private async processDocumentConract(data: DocumentFormSchema, orgonazation: Organization = 'NOMADDOCS') {
    try {
      const documentTemplateResponse = await DocumentLoaderServiceInstance.loadTemplate(orgonazation, 'CONTRACT')
      const documentTempalateBuffer
        = await documentTemplateResponse.arrayBuffer()

      const zip = new PizZip(documentTempalateBuffer)
      const documentTemplate = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      const countedTotalAmount = countTotalAmount(Number(data.costPerDay), data.documentDate)

      documentTemplate.setData({
        ...data,
        documentDateFrom: dayjs(new Date(data.documentDate[0])).format('«DD» MMMM YYYYг'),
        documentDateTo: dayjs(new Date(data.documentDate[1])).format('«DD» MMMM YYYYг'),
        clientIdDateFrom: dayjs(new Date(data.clientIdDateFrom)).format('DD.MM.YYYY'),
        perAmount: formatWithSpacesNumber(data.costPerDay),
        totalAmount: formatWithSpacesNumber(countedTotalAmount),
        totalAmountRussian: formatNumberToRussian(Number(countedTotalAmount)),
        perAmountRussian: formatNumberToRussian(Number(data.costPerDay)),
      })

      documentTemplate.render()

      const blob = documentTemplate.getZip().generate({ type: 'blob' })
      const filename = documentNaming('CONTRACT', data.fullnameClient)

      return { blob, filename }
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании документа'
      notifications.show({
        message: errorMessage,
      })
    }
  }
}

export const DocumentServiceInstance = new DocumentService()
