import { getPayload } from 'payload'
import config from '@payload-config'
import ExcelJS from 'exceljs'
import path from 'path'
const norm=(s:string)=>s.toLowerCase().replace(/\s+/g,' ').trim()
async function main(){
  const payload=await getPayload({config})
  const all=(await payload.find({collection:'products',limit:5000,depth:0})).docs as any[]
  const bySku=new Map(all.map(p=>[norm(p.sku||''),p]))
  console.log('Total products now:', all.length)
  const wb=new ExcelJS.Workbook(); await wb.xlsx.readFile(path.resolve(process.argv[2]))
  const ws=wb.getWorksheet('Products')!
  const held=new Set(['CBU-20','CBU-22','CBU-26','CBU-28'].map(norm))
  let present=0, missingNotHeld:string[]=[], heldPresent:string[]=[]
  for(let r=2;r<=ws.rowCount;r++){
    const sku=String(ws.getRow(r).getCell(1).value??'').trim(); if(!sku)continue
    const exists=bySku.has(norm(sku))
    if(held.has(norm(sku))){ if(exists) heldPresent.push(sku); continue }
    if(exists)present++; else missingNotHeld.push(sku)
  }
  console.log('File SKUs present (excl. held):', present)
  console.log('File SKUs MISSING (should be 0):', missingNotHeld.length, missingNotHeld.join(', '))
  console.log('Held SKUs that leaked in (should be 0):', heldPresent.length, heldPresent.join(', '))
  console.log('\nSpot checks:')
  for(const s of ['HVN-K970','FSL350PDA','N250S','SBY-AFS-R(S)','POL-S4','FPD-K1','W88']){
    const p=bySku.get(norm(s))
    console.log(`  ${s}: ${p?`name="${p.name}" price=${p.listPrice} img=${p.image??'none'} mats=${(p.materials||[]).length}`:'MISSING'}`)
  }
  // duplicate-name variants
  const afs=all.filter(p=>norm(p.name)==='automatic feeding system afs').map(p=>p.sku)
  const pol=all.filter(p=>norm(p.name)==='coolman hybrid 4-step polishing pad').map(p=>p.sku)
  console.log('\nVariant groups: AFS=', afs, '| Polishing=', pol)
  // taxonomy
  for(const c of ['materials','applications','categories'] as const)
    console.log(`${c}:`, (await payload.find({collection:c,limit:1,depth:0})).totalDocs)
  process.exit(0)
}
main().catch(e=>{console.error(e);process.exit(1)})
