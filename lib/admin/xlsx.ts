// lib/admin/xlsx.ts
//
// Tiny helper around exceljs: turn a list of rows into a downloadable .xlsx
// HTTP Response. Used by the admin export routes.

import ExcelJS from 'exceljs'
import { NextResponse } from 'next/server'

export interface XlsxColumn {
  header: string
  key: string
  width?: number
}

export async function xlsxResponse(
  sheetName: string,
  columns: XlsxColumn[],
  rows: Record<string, unknown>[],
  filename: string,
): Promise<NextResponse> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(sheetName)
  ws.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 20 }))
  ws.getRow(1).font = { bold: true }
  for (const r of rows) ws.addRow(r)

  const buffer = await wb.xlsx.writeBuffer()
  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
