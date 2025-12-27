import type TypeExcelJS from 'exceljs'
import type { RichText } from 'exceljs'
import type { DocumentFormSchema } from '@/schemes/document-form.schema'
import type { DocumentType, Organization } from '@/types/types'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import Docxtemplater from 'docxtemplater'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import PizZip from 'pizzip'
import { countPerAmount, documentNaming, formatNumberToRussian, formatWithSpacesNumber, isRichTextValue } from '@/lib/utils'
import { DocumentLoaderServiceInstance } from './document-loader.service'

class DocumentService {
  constructor() { }
  async processDocuments(data: DocumentFormSchema, organization: Organization = 'NOMADDOCS') {
    const zip = new JSZip()
    const contract = await this.processDocumentConract(data, organization)
    const invoice = await this.processDocumentXlsx(data, organization, 'INVOICE')

    if (contract) {
      zip.file(contract.filename, contract.blob)
      zip.file(invoice.filename, invoice.blob)

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipFilename = documentNaming('ALL', data.fullnameClient)

      saveAs(zipBlob, zipFilename)
    }
  }

  private async processDocumentXlsx(data: DocumentFormSchema, organization: Organization = 'NOMADDOCS', documentType: DocumentType) {
    const documentTemplateResponse = await DocumentLoaderServiceInstance.loadTemplate(organization, documentType)
    const documentTempalateBuffer = await documentTemplateResponse.arrayBuffer()

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(documentTempalateBuffer)

    const sheet = workbook.getWorksheet(1)
    const countedPerAmount = countPerAmount(Number(data.totalAmount), data.documentDate)

    if (sheet) {
      this.fillTemplatePlaceholdersXlsx(sheet, {
        ...data,
        perAmount: formatWithSpacesNumber(countedPerAmount),
        documentDateFrom: dayjs(new Date(data.documentDate[0])).format('DD MMMM YYYYг'),
        documentDateTo: dayjs(new Date(data.documentDate[1])).format('DD MMMM YYYYг'),
        documentDateFromNumeric: dayjs(new Date(data.documentDate[0])).format('DD.MM.YYYYг'),
        documentDateToNumeric: dayjs(new Date(data.documentDate[1])).format('DD.MM.YYYYг'),
        clientIdDateFrom: dayjs(new Date(data.clientIdDateFrom)).format('DD.MM.YYYY'),
        totalAmount: formatWithSpacesNumber(data.totalAmount),
        totalAmountRussian: formatNumberToRussian(Number(data.totalAmount)).toLocaleLowerCase(),
        perAmountRussian: formatNumberToRussian(countedPerAmount).toLocaleLowerCase(),
      })
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const filename = documentNaming(documentType, data.fullnameClient)

    return { blob, filename }
  }

  private fillTemplatePlaceholdersXlsx(sheet: TypeExcelJS.Worksheet, data: Record<string, unknown>) {
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

      const countedPerAmount = countPerAmount(Number(data.totalAmount), data.documentDate)

      documentTemplate.setData({
        ...data,
        documentDateFrom: dayjs(new Date(data.documentDate[0])).format('«DD» MMMM YYYYг'),
        documentDateTo: dayjs(new Date(data.documentDate[1])).format('«DD» MMMM YYYYг'),
        clientIdDateFrom: dayjs(new Date(data.clientIdDateFrom)).format('DD.MM.YYYY'),
        perAmount: formatWithSpacesNumber(countedPerAmount),
        totalAmount: formatWithSpacesNumber(data.totalAmount),
        totalAmountRussian: formatNumberToRussian(Number(data.totalAmount)),
        perAmountRussian: formatNumberToRussian(countedPerAmount),
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
