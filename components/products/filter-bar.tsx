"use client"

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useLanguage } from '@/lib/i18n/context'
import { 
  MATERIALS, 
  APPLICATIONS, 
  MACHINE_POWERS,
  type Material,
  type Application,
  type MachinePower,
} from '@/lib/data/products'

interface FilterBarProps {
  selectedMaterials: Material[]
  selectedApplications: Application[]
  selectedMachinePower: MachinePower[]
  onMaterialsChange: (materials: Material[]) => void
  onApplicationsChange: (applications: Application[]) => void
  onMachinePowerChange: (powers: MachinePower[]) => void
  resultCount: number
}

export function FilterBar({
  selectedMaterials,
  selectedApplications,
  selectedMachinePower,
  onMaterialsChange,
  onApplicationsChange,
  onMachinePowerChange,
  resultCount,
}: FilterBarProps) {
  const { t } = useLanguage()
  const [materialOpen, setMaterialOpen] = useState(true)
  const [appOpen, setAppOpen] = useState(true)
  const [powerOpen, setPowerOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalFilters = selectedMaterials.length + selectedApplications.length + selectedMachinePower.length

  const handleMaterialToggle = (material: Material) => {
    if (selectedMaterials.includes(material)) {
      onMaterialsChange(selectedMaterials.filter(m => m !== material))
    } else {
      onMaterialsChange([...selectedMaterials, material])
    }
  }

  const handleApplicationToggle = (app: Application) => {
    if (selectedApplications.includes(app)) {
      onApplicationsChange(selectedApplications.filter(a => a !== app))
    } else {
      onApplicationsChange([...selectedApplications, app])
    }
  }

  const handlePowerToggle = (power: MachinePower) => {
    if (selectedMachinePower.includes(power)) {
      onMachinePowerChange(selectedMachinePower.filter(p => p !== power))
    } else {
      onMachinePowerChange([...selectedMachinePower, power])
    }
  }

  const clearAll = () => {
    onMaterialsChange([])
    onApplicationsChange([])
    onMachinePowerChange([])
  }

  const getMaterialLabel = (material: Material): string => {
    const key = material.toLowerCase().replace(/\s+/g, '') as keyof typeof t.materials
    return t.materials[key] || material
  }

  const getApplicationLabel = (app: Application): string => {
    const key = app.toLowerCase().replace(/\s+/g, '') as keyof typeof t.applications
    return t.applications[key] || app
  }

  const FilterSections = () => (
    <div className="space-y-6">
      {/* Materials */}
      <Collapsible open={materialOpen} onOpenChange={setMaterialOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-semibold text-navy">Material</span>
          <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${materialOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            {MATERIALS.map((material) => (
              <label key={material} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={selectedMaterials.includes(material)}
                  onCheckedChange={() => handleMaterialToggle(material)}
                  className="border-rule data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                />
                <span className="text-sm text-ink-muted">{getMaterialLabel(material)}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-rule" />

      {/* Applications */}
      <Collapsible open={appOpen} onOpenChange={setAppOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-semibold text-navy">Application</span>
          <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${appOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            {APPLICATIONS.map((app) => (
              <label key={app} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={selectedApplications.includes(app)}
                  onCheckedChange={() => handleApplicationToggle(app)}
                  className="border-rule data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                />
                <span className="text-sm text-ink-muted">{getApplicationLabel(app)}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-rule" />

      {/* Machine Power */}
      <Collapsible open={powerOpen} onOpenChange={setPowerOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-semibold text-navy">Machine Power</span>
          <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${powerOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            {MACHINE_POWERS.map(({ value, label }) => (
              <label key={value} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={selectedMachinePower.includes(value)}
                  onCheckedChange={() => handlePowerToggle(value)}
                  className="border-rule data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                />
                <span className="text-sm text-ink-muted">{label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )

  return (
    <div className="rounded-2xl border border-rule bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-navy">Filters</h3>
        {totalFilters > 0 && (
          <button 
            onClick={clearAll}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent-dark"
          >
            <X className="h-3 w-3" />
            Clear ({totalFilters})
          </button>
        )}
      </div>

      {/* Mobile: Collapsible */}
      <Collapsible open={mobileOpen} onOpenChange={setMobileOpen} className="lg:hidden">
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between border-rule"
          >
            <span>Show filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6">
          <FilterSections />
        </CollapsibleContent>
      </Collapsible>

      {/* Desktop: Always visible */}
      <div className="hidden lg:block">
        <FilterSections />
      </div>
    </div>
  )
}
