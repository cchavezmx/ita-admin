import { useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, Plus, X } from 'lucide-react'
import { mockOrders } from '@/features/ordenes/data'

function FormNuevaOC() {
  const [resultMessage, setResultMessage] = useState('')
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      solicitante: '',
      centroCosto: 'CC-001 MKT',
      proveedor: '',
      rfc: '',
      concepto: '',
      detalle: '',
      monto: '',
      moneda: 'MXN',
      impuesto: 'IVA16',
      fechaRequerida: '',
      proyecto: '',
      adjuntos: [],
    },
  })
  const fileInputRef = useRef(null)

  const resetAttachments = () => {
    setValue('adjuntos', [])
    clearErrors('adjuntos')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values) => {
    // Simulate request
    console.log('Enviar a aprobación', values)
    setResultMessage('Solicitud enviada a aprobación. Recibirás confirmación por correo.')
    reset()
    resetAttachments()
  }

  const handleDraft = handleSubmit((values) => {
    console.log('Guardar borrador', values)
    setResultMessage('Borrador guardado. Puedes retomarlo más tarde desde este panel.')
  })

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardHeader className="flex items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">Nueva solicitud de OC</CardTitle>
          <Badge variant="outline" className="text-[11px]">Folio provisional al guardar</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="solicitante">Solicitante</Label>
            <Input
              id="solicitante"
              placeholder="tu@empresa.com"
              autoComplete="email"
              {...register('solicitante', {
                required: 'Ingresa tu correo institucional',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un correo válido',
                },
              })}
            />
            {errors.solicitante && <p className="mt-1 text-xs text-red-600">{errors.solicitante.message}</p>}
          </div>
          <div>
            <Label>Centro de costo</Label>
            <Controller
              name="centroCosto"
              control={control}
              rules={{ required: 'Selecciona un centro de costo' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona CC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC-001 MKT">CC-001 MKT</SelectItem>
                    <SelectItem value="CC-014 OPS">CC-014 OPS</SelectItem>
                    <SelectItem value="CC-009 IT">CC-009 IT</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.centroCosto && <p className="mt-1 text-xs text-red-600">{errors.centroCosto.message}</p>}
          </div>
          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input
              id="proveedor"
              placeholder="Razón social"
              {...register('proveedor', { required: 'Ingresa el proveedor' })}
            />
            {errors.proveedor && <p className="mt-1 text-xs text-red-600">{errors.proveedor.message}</p>}
          </div>
          <div>
            <Label htmlFor="rfc">RFC proveedor (opcional)</Label>
            <Input
              id="rfc"
              placeholder="XAXX010101000"
              {...register('rfc', {
                pattern: {
                  value: /^([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3})?$/,
                  message: 'RFC no válido',
                },
              })}
            />
            {errors.rfc && <p className="mt-1 text-xs text-red-600">{errors.rfc.message}</p>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="concepto">Concepto</Label>
            <Input
              id="concepto"
              placeholder="Describe brevemente la compra"
              {...register('concepto', { required: 'Describe el concepto de la compra' })}
            />
            {errors.concepto && <p className="mt-1 text-xs text-red-600">{errors.concepto.message}</p>}
          </div>
          <div>
            <Label htmlFor="detalle">Detalle</Label>
            <Textarea
              id="detalle"
              rows={3}
              placeholder="Especificaciones, cantidades, etc."
              {...register('detalle')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('monto', {
                  required: 'Indica el monto estimado',
                  min: { value: 1, message: 'El monto debe ser mayor a 0' },
                })}
              />
              {errors.monto && <p className="mt-1 text-xs text-red-600">{errors.monto.message}</p>}
            </div>
            <div>
              <Label>Moneda</Label>
              <Controller
                name="moneda"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2">
              <Label>Impuesto</Label>
              <Controller
                name="impuesto"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IVA16">IVA 16%</SelectItem>
                      <SelectItem value="IVA8">IVA 8%</SelectItem>
                      <SelectItem value="EXENTO">Exento</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fechaRequerida">Fecha requerida</Label>
            <Input
              id="fechaRequerida"
              type="date"
              {...register('fechaRequerida', { required: 'Selecciona la fecha requerida' })}
            />
            {errors.fechaRequerida && <p className="mt-1 text-xs text-red-600">{errors.fechaRequerida.message}</p>}
          </div>
          <div>
            <Label htmlFor="proyecto">Proyecto (opcional)</Label>
            <Input id="proyecto" placeholder="Nombre del proyecto" {...register('proyecto')} />
          </div>
          <Controller
            name="adjuntos"
            control={control}
            render={({ field: { value = [], onChange }, fieldState }) => {
              const processFiles = (fileList) => {
                const incoming = Array.from(fileList || [])
                if (incoming.length === 0) return
                const valid = incoming.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
                if (valid.length === 0) {
                  setError('adjuntos', { type: 'manual', message: 'Solo se admiten archivos PDF.' })
                  return
                }
                if (valid.length < incoming.length) {
                  setError('adjuntos', { type: 'manual', message: 'Se descartaron archivos que no son PDF.' })
                } else {
                  clearErrors('adjuntos')
                }
                const map = new Map()
                value.forEach((file, index) => {
                  map.set(`${file.name}-${file.size}-${index}`, file)
                })
                valid.forEach((file) => {
                  const key = `${file.name}-${file.size}-${file.lastModified}`
                  if (![...map.keys()].some((k) => k.startsWith(`${file.name}-${file.size}`))) {
                    map.set(key, file)
                  }
                })
                const files = Array.from(map.values())
                onChange(files)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }

              const handleRemove = (idx) => {
                const updated = value.filter((_, index) => index !== idx)
                onChange(updated)
                if (updated.length === 0) {
                  clearErrors('adjuntos')
                }
              }

              const handleFileButton = () => {
                if (fileInputRef.current) {
                  fileInputRef.current.click()
                }
              }

              const onDrop = (event) => {
                event.preventDefault()
                processFiles(event.dataTransfer.files)
              }

              const onDragOver = (event) => {
                event.preventDefault()
              }

              const formatSize = (bytes) => {
                if (!bytes) return '0 KB'
                const kb = bytes / 1024
                if (kb < 1024) return `${kb.toFixed(1)} KB`
                return `${(kb / 1024).toFixed(1)} MB`
              }

              return (
                <div className="md:col-span-2">
                  <Label>Adjuntos (cotización, PDF)</Label>
                  <div
                    className="mt-1 rounded-xl border border-dashed px-3 py-6 text-center text-sm text-neutral-500"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                  >
                    Arrastra y suelta aquí o
                    <Button type="button" size="sm" variant="link" className="ml-1" onClick={handleFileButton}>
                      <Upload className="mr-1 h-4 w-4" />
                      Seleccionar PDF
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      multiple
                      hidden
                      onChange={(event) => processFiles(event.target.files)}
                    />
                    {value.length > 0 && (
                      <ul className="mt-4 space-y-2 text-left text-sm text-neutral-700">
                        {value.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
                          >
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate font-medium">{file.name}</span>
                              <span className="text-xs text-neutral-500">{formatSize(file.size)}</span>
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="text-neutral-500 hover:text-neutral-900"
                              onClick={() => handleRemove(index)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Los adjuntos se vincularán al enviar o guardar el borrador.</p>
                  {fieldState.error && <p className="mt-2 text-xs text-red-600">{fieldState.error.message}</p>}
                </div>
              )
            }}
          />
          <div className="md:col-span-2 flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex-1 text-xs text-neutral-600 sm:text-right">
              {resultMessage && <span>{resultMessage}</span>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleDraft} disabled={isSubmitting}>
                Guardar borrador
              </Button>
              <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800" disabled={isSubmitting}>
                <Plus className="mr-1 h-4 w-4" />
                {isSubmitting ? 'Enviando…' : 'Enviar a aprobación'}
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}

function ResumenOC() {
  const resumen = useMemo(() => {
    const pendientes = mockOrders.filter((oc) => oc.estado === 'PENDIENTE' || oc.estado === 'EN_APROBACION').length
    const aprobadas = mockOrders.filter((oc) => oc.estado === 'APROBADA').length
    const rechazadas = mockOrders.filter((oc) => oc.estado === 'RECHAZADA').length
    const totalMonto = mockOrders.reduce((acc, oc) => acc + oc.monto, 0)

    return {
      pendientes,
      aprobadas,
      rechazadas,
      totalMonto,
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Resumen de órdenes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Pendientes / en aprobación</span>
            <span className="font-semibold text-neutral-900">{resumen.pendientes}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Aprobadas</span>
            <span className="font-semibold text-neutral-900">{resumen.aprobadas}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Rechazadas</span>
            <span className="font-semibold text-neutral-900">{resumen.rechazadas}</span>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-100 px-4 py-3">
          <div className="text-xs uppercase text-neutral-500">Monto circulando</div>
          <div className="text-lg font-semibold text-neutral-900">
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(resumen.totalMonto)}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Incluye moneda MXN. Ajusta para ver otras divisas.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ChecklistPrevio() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Checklist antes de enviar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-neutral-600">
        <p>- Valida las cotizaciones y adjunta evidencia en PDF.</p>
        <p>- Confirma centro de costo y moneda con tu líder.</p>
        <p>- Si es un servicio recurrente, incluye vigencia en el detalle.</p>
        <p>- Usa el chat de cada OC para aclaraciones rápidas con los aprobadores.</p>
      </CardContent>
    </Card>
  )
}

export default function OrdenDeCompra() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-neutral-900 font-bold text-white">
            OC
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Solicitud de órdenes de compra</h1>
            <p className="text-sm text-neutral-500 -mt-0.5">Completa los datos clave, adjunta soporte y envía a aprobación.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="space-y-6">
            <FormNuevaOC />
          </section>

          <aside className="space-y-6">
            {/* <ResumenOC /> */}
            <ChecklistPrevio />
          </aside>
        </div>
      </main>
    </div>
  )
}
