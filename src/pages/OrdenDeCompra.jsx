import { useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Upload, X } from 'lucide-react'
import { mockOrders } from '@/features/ordenes/data'
import { useCatalogos } from '@/features/catalogos/context'

const URGENTE_OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: '1', label: 'PROGRAMADO' },
  { value: '14', label: 'PAGADO' },
  { value: '0', label: 'IMPORTANTE' },
  { value: '11', label: 'Cancelada' },
  { value: '2', label: 'URGENTE' },
  { value: '5', label: '' },
]

const CONDICIONES_COMERCIALES_OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: '1', label: 'CONTADO' },
  { value: '9', label: 'REEMBOLSO' },
  { value: '3', label: 'FINIQUITO' },
  { value: '2', label: '8 DIAS' },
  { value: '106', label: '14 DIAS' },
  { value: '12', label: '15 DIAS' },
  { value: '10', label: '20 DIAS' },
  { value: '157', label: '26 DIAS' },
  { value: '5', label: '28 DIAS' },
  { value: '11', label: '30 DIAS' },
  { value: '18', label: '45 DIAS' },
  { value: '8', label: '60 DIAS' },
  { value: '15', label: '120 DIAS' },
  { value: '16', label: 'ANTICIPO 10%' },
  { value: '4', label: 'ANTICPO 30%' },
  { value: '7', label: 'ANTICIPO 50%' },
  { value: '153', label: 'ANTICIPO 60%' },
  { value: '0', label: 'ANTICIPO 65%' },
  { value: '14', label: 'ANTICIPO 70%' },
  { value: '108', label: 'TARJETA DE CREDITO' },
  { value: '6', label: 'PAGO SEMESTRAL' },
  { value: '13', label: 'PAGO MENSUAL' },
  { value: '19', label: 'COMPRA EN LINEA' },
  { value: '17', label: 'N/A' },
]

const CENTRO_COSTO_2_OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: '5', label: 'N/A' },
  { value: '104', label: 'TOLTECAS' },
  { value: '103', label: 'I3D' },
  { value: '110', label: 'CHINT ENERGIXM' },
  { value: '17', label: 'CHINT HOAXING' },
  { value: '14', label: 'CHINT LIZHONG' },
  { value: '18', label: 'CHINT LGMG' },
  { value: '158', label: 'LULU LEMON' },
  { value: '12', label: 'SPT POSTES PERIMETRALES' },
  { value: '153', label: 'STRADIVARIUS SATELITE' },
  { value: '154', label: 'STRADIVARIUS MTY' },
  { value: '19', label: 'STRADIVARIUS ALM HUIXQUILUCAN' },
  { value: '15', label: 'STRADIVARIUS ANTEA QRO' },
  { value: '4', label: 'STRADIVARIUS PLAYA DEL CARMEN' },
  { value: '6', label: 'STRADIVARIUS PLAZA DE LAS AMERICAS' },
  { value: '7', label: 'STRADIVARIUS TIJUANA' },
  { value: '152', label: 'ALMACEN PULL&BEAR OASIS COYOACAN' },
  { value: '8', label: 'ALMACEN STRADIVARIUS HERMOSILLO' },
  { value: '10', label: 'ALMACEN STRADIVARIUS HUIXQUILUCAN' },
  { value: '3', label: 'ALMACEN ZARA HERMOSILLO' },
  { value: '1', label: 'ALMACEN ZARA MORELIA' },
  { value: '102', label: 'PLAN ALIMENTADORES AEREADORES BALSA' },
  { value: '108', label: 'PLAN CABLEADO MT N5' },
  { value: '16', label: 'PLAN CONTRATO 54' },
  { value: '13', label: 'PULL & BEAR ANDARES GDL' },
  { value: '0', label: 'LIVERPOOL QRO - COMEDOR' },
  { value: '101', label: "SUBURBIA BANCOS" },
  { value: '2', label: 'ZARA ALTARIA AGUASCALIENTES' },
  { value: '159', label: "IDC'S SUMINISTRO CONTRATO 2" },
  { value: '105', label: 'Liverpool Tezontle' },
  { value: '155', label: 'PROTECSA CHAPALA' },
  { value: '157', label: 'AMESA CHAPALA' },
  { value: '151', label: 'PH Monterrey SAN PEDRO' },
  { value: '109', label: 'PH Monterrey BUFFER' },
  { value: '160', label: 'PH Monterrey MOV de INST  fase 3' },
  { value: '9', label: '´PH Monterrey DOMO' },
  { value: '106', label: 'IGLESIA' },
  { value: '107', label: 'CAPACITACION DC3' },
  { value: '11', label: 'MTI447 - CELDAS XBC' },
  { value: '156', label: 'MTI PB2 PROTECSA' },
]

const MONEDA_OPTIONS = [
  { value: '', label: 'Seleccione...' },
  { value: '1', label: 'MXN' },
  { value: '3', label: 'USD' },
  { value: '4', label: 'EUR' },
  { value: '0', label: 'LIBRA ESTERLINA' },
]

const selectClass =
  'block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50'

function FormNuevaOC() {
  const [resultMessage, setResultMessage] = useState('')
  const { tiposOc, empresas, centrosCosto } = useCatalogos()
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
      name: '',
      text1: '',
      status51: '',
      proveedor: '',
      status2: '',
      long_text: '',
      date5: '',
      status6: '',
      status54: '',
      files: [],
      monto: '',
      status0: '',
      centro_de_costo: '',
      color: '',
      date9: '',
    },
  })
  const fileInputRef = useRef(null)

  const resetAttachments = () => {
    setValue('files', [])
    clearErrors('files')
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Nombre del solicitante"
              {...register('name', { required: 'Ingresa el nombre del solicitante' })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="text1">GESTOR DEL PULSO</Label>
            <Input
              id="text1"
              placeholder="Nombre completo del gestor"
              {...register('text1', { required: 'Ingresa el gestor del pulso' })}
            />
            {errors.text1 && <p className="mt-1 text-xs text-red-600">{errors.text1.message}</p>}
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor="status51">TIPO DE OC</Label>
            <select
              id="status51"
              className={selectClass}
              {...register('status51', { required: 'Selecciona el tipo de OC' })}
            >
              {tiposOc.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status51 && <p className="mt-1 text-xs text-red-600">{errors.status51.message}</p>}
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Textarea
              id="proveedor"
              rows={3}
              placeholder="Coloca razón social y datos relevantes"
              {...register('proveedor', { required: 'Ingresa la información del proveedor' })}
            />
            {errors.proveedor && <p className="mt-1 text-xs text-red-600">{errors.proveedor.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="status2">URGENTE</Label>
            <select
              id="status2"
              className={selectClass}
              {...register('status2', { required: 'Selecciona el estatus de urgencia' })}
            >
              {URGENTE_OPTIONS.map((option) => (
                <option key={`${option.value}-${option.label || 'blank'}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status2 && <p className="mt-1 text-xs text-red-600">{errors.status2.message}</p>}
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor="long_text">OBSERVACIONES</Label>
            <Textarea id="long_text" rows={4} {...register('long_text')} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="date5">FECHA ENTREGA OC</Label>
            <Input
              id="date5"
              type="date"
              {...register('date5', { required: 'Selecciona la fecha de entrega de la OC' })}
            />
            {errors.date5 && <p className="mt-1 text-xs text-red-600">{errors.date5.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="status6">CONDICIONES COMERCIALES</Label>
            <select
              id="status6"
              className={selectClass}
              {...register('status6', { required: 'Selecciona las condiciones comerciales' })}
            >
              {CONDICIONES_COMERCIALES_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status6 && <p className="mt-1 text-xs text-red-600">{errors.status6.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="status54">EMPRESAS</Label>
            <select
              id="status54"
              className={selectClass}
              {...register('status54', { required: 'Selecciona la empresa' })}
            >
              {empresas.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status54 && <p className="mt-1 text-xs text-red-600">{errors.status54.message}</p>}
          </div>
          <Controller
            name="files"
            control={control}
            render={({ field: { value = [], onChange }, fieldState }) => {
              const processFiles = (fileList) => {
                const incoming = Array.from(fileList || [])
                if (incoming.length === 0) return
                const valid = incoming.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
                if (valid.length === 0) {
                  setError('files', { type: 'manual', message: 'Solo se admiten archivos PDF.' })
                  return
                }
                if (valid.length < incoming.length) {
                  setError('files', { type: 'manual', message: 'Se descartaron archivos que no son PDF.' })
                } else {
                  clearErrors('files')
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

              const handleRemove = (indexToRemove) => {
                const updated = value.filter((_, index) => index !== indexToRemove)
                onChange(updated)
                if (updated.length === 0) {
                  clearErrors('files')
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
                <div className="md:col-span-2 flex flex-col gap-1">
                  <Label htmlFor="files">REQ/COTIZACION</Label>
                  <div
                    id="files"
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
                  <p className="text-xs text-neutral-500">Solo PDF. Se adjuntarán al enviar o guardar el borrador.</p>
                  {fieldState.error && <p className="text-xs text-red-600">{fieldState.error.message}</p>}
                </div>
              )
            }}
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="monto">MONTO PESOS</Label>
            <Input
              id="monto"
              type="number"
              step="any"
              placeholder="0.00"
              {...register('monto', {
                required: 'Ingresa el monto en pesos',
                min: { value: 0, message: 'El monto debe ser mayor o igual a 0' },
              })}
            />
            {errors.monto && <p className="mt-1 text-xs text-red-600">{errors.monto.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="status0">MONEDA</Label>
            <select
              id="status0"
              className={selectClass}
              {...register('status0', { required: 'Selecciona la moneda' })}
            >
              {MONEDA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status0 && <p className="mt-1 text-xs text-red-600">{errors.status0.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="centro_de_costo">CENTRO DE COSTO 1</Label>
            <select
              id="centro_de_costo"
              className={selectClass}
              {...register('centro_de_costo', { required: 'Selecciona el centro de costo principal' })}
            >
              {centrosCosto.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.centro_de_costo && <p className="mt-1 text-xs text-red-600">{errors.centro_de_costo.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="color">CENTRO DE COSTO 2</Label>
            <select id="color" className={selectClass} {...register('color')}>
              {CENTRO_COSTO_2_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="date9">FECHA ESTIMADA DE PAGO</Label>
            <Input
              id="date9"
              type="date"
              {...register('date9', { required: 'Selecciona la fecha estimada de pago' })}
            />
            {errors.date9 && <p className="mt-1 text-xs text-red-600">{errors.date9.message}</p>}
          </div>
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
