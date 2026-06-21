import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
async function main(){
  const payload=await getPayload({config})
  const out:any={}
  for(const c of ['products','categories','materials','applications','machineTiers'] as const){
    out[c]=(await payload.find({collection:c,limit:5000,depth:0})).docs
  }
  const ts=new Date().toISOString().replace(/[:.]/g,'-').slice(0,19)
  const file=path.resolve('backups',`catalog-backup-${ts}.json`)
  fs.writeFileSync(file,JSON.stringify(out,null,2))
  console.log(`Backed up: products=${out.products.length} categories=${out.categories.length} materials=${out.materials.length} applications=${out.applications.length} tiers=${out.machineTiers.length}`)
  console.log(`File: ${file}`)
  process.exit(0)
}
main().catch(e=>{console.error(e);process.exit(1)})
