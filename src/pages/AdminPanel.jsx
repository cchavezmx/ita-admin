import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Plus, Download } from 'lucide-react'
import { useCatalogos } from '@/features/catalogos/context'
import { mockChat, mockOrders } from '@/features/ordenes/data'

const ESTADOS = ['TODOS', 'PENDIENTE', 'EN_APROBACION', 'APROBADA', 'RECHAZADA', 'BORRADOR']

const estadoStyles = {
  PENDIENTE: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  EN_APROBACION: 'bg-amber-100 text-amber-700 border border-amber-200',
  APROBADA: 'bg-green-100 text-green-700 border border-green-200',
  RECHAZADA: 'bg-red-100 text-red-700 border border-red-200',
  BORRADOR: 'bg-neutral-200 text-neutral-700 border border-neutral-300',
}

const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount)

const formatFileSize = (bytes = 0) => {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const nowStamp = () =>
  new Date().toLocaleString('es-MX', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

const getLabel = (value, catalog) => catalog.find((item) => item.value === value)?.label || '—'

function EstadoBadge({ estado }) {
  return <Badge className={estadoStyles[estado] || estadoStyles.PENDIENTE}>{estado}</Badge>
}

function DetalleSolicitud({ oc, tipoLabel, empresaLabel }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {oc.id} — {oc.proveedor}
        </DialogTitle>
        <DialogDescription>Centro de costo: {oc.cc}</DialogDescription>
      </DialogHeader>
      <Separator />
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <div className="text-neutral-500">Solicitante</div>
          <div className="font-medium">{oc.solicitante}</div>
        </div>
        <div>
          <div className="text-neutral-500">Tipo de OC</div>
          <div className="font-medium">{tipoLabel}</div>
        </div>
        <div>
          <div className="text-neutral-500">Empresa</div>
          <div className="font-medium">{empresaLabel}</div>
        </div>
        <div>
          <div className="text-neutral-500">Monto</div>
          <div className="font-medium">{formatCurrency(oc.monto, oc.moneda)}</div>
        </div>
        <div>
          <div className="text-neutral-500">Estado</div>
          <EstadoBadge estado={oc.estado} />
        </div>
        <div>
          <div className="text-neutral-500">Fecha solicitada</div>
          <div className="font-medium">{oc.fecha}</div>
        </div>
      </div>
      {oc.rechazo && (
        <div className="mt-4 rounded-xl border bg-red-50 p-3 text-sm text-red-700">
          <div className="font-semibold">Motivo de rechazo</div>
          <div>{oc.rechazo}</div>
        </div>
      )}
      {Array.isArray(oc.adjuntos) && oc.adjuntos.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-neutral-700">Adjuntos</div>
          <ul className="space-y-2 text-sm">
            {oc.adjuntos.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-neutral-50 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">{file.name}</p>
                  <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0">
                  <a href={file.url} target="_blank" rel="noreferrer">
                    <Download className="mr-1 h-4 w-4" /> Ver / descargar
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DialogContent>
  )
}

function ChatAdministrador({ oc, mensajes, onSend }) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const text = value.trim()
    if (!text) return
    onSend({ who: 'admin', at: nowStamp(), text })
    setValue('')
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Chat con solicitante</SheetTitle>
        <SheetDescription>{oc.id} — {oc.proveedor}</SheetDescription>
      </SheetHeader>
      <div className="mt-4 flex-1 space-y-3 overflow-auto">
        {mensajes.length === 0 && <p className="text-sm text-neutral-500">Sin mensajes aún.</p>}
        {mensajes.map((msg, index) => (
          <div key={index} className="flex items-start gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback>{msg.who.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 rounded-2xl border bg-white px-3 py-2 text-sm">
              <div className="text-[11px] text-neutral-500">{msg.at}</div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        <Label className="text-xs" htmlFor="admin-message">
          Enviar mensaje al solicitante
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="admin-message"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Escribe tu comentario"
          />
          <Button onClick={handleSend} className="bg-neutral-900 text-white">
            Enviar
          </Button>
        </div>
      </div>
    </SheetContent>
  )
}

function CatalogoManager({ titulo, onAdd, items, emptyLabel }) {
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedLabel = label.trim()
    const trimmedValue = value.trim()
    if (!trimmedLabel || !trimmedValue) {
      setMessage('Completa clave y descripción para agregar una nueva opción.')
      return
    }
    onAdd({ value: trimmedValue, label: trimmedLabel })
    setLabel('')
    setValue('')
    setMessage('Opción registrada. Ya está disponible en los formularios.')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${titulo}-valor`}>Clave / ID</Label>
            <Input
              id={`${titulo}-valor`}
              placeholder="Ej. 21"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor={`${titulo}-texto`}>Descripción visible</Label>
            <Input
              id={`${titulo}-texto`}
              placeholder={emptyLabel}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="bg-neutral-900 text-white">
              <Plus className="mr-1 h-4 w-4" /> Agregar
            </Button>
          </div>
        </form>
        {message && <p className="text-sm text-neutral-600">{message}</p>}
        <div className="flex flex-wrap gap-2 text-xs">
          {items
            .filter((item) => item.value)
            .map((item) => (
              <Badge key={`${item.value}-${item.label}`} variant="outline">
                {item.value} · {item.label}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPanel() {
  const { tiposOc, empresas, addTipoOc, addEmpresa } = useCatalogos()
  const [orders] = useState(mockOrders)
  const [messages, setMessages] = useState(mockChat)
  const [query, setQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('TODOS')
  const [tipoFilter, setTipoFilter] = useState('TODOS')
  const [empresaFilter, setEmpresaFilter] = useState('TODOS')

  const filteredOrders = useMemo(() => {
    const text = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesText = `${order.id} ${order.proveedor} ${order.concepto}`
        .toLowerCase()
        .includes(text)
      const matchesEstado = estadoFilter === 'TODOS' || order.estado === estadoFilter
      const matchesTipo = tipoFilter === 'TODOS' || order.tipoOc === tipoFilter
      const matchesEmpresa = empresaFilter === 'TODOS' || order.empresa === empresaFilter
      return matchesText && matchesEstado && matchesTipo && matchesEmpresa
    })
  }, [orders, query, estadoFilter, tipoFilter, empresaFilter])

  const handleSendMessage = (orderId, newMessage) => {
    setMessages((prev) => {
      const history = prev[orderId] ? [...prev[orderId]] : []
      history.push(newMessage)
      return { ...prev, [orderId]: history }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Panel administrativo</h1>
          <p className="text-sm text-neutral-600">
            Gestiona las solicitudes de OC, responde dudas y actualiza catálogos compartidos con el área de compras.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-base font-semibold">Solicitudes recibidas</CardTitle>
            <p className="text-sm text-neutral-500">
              Aplica filtros combinados para localizar rápidamente las órdenes y conversar con los solicitantes.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <Label htmlFor="buscarOc">Buscar</Label>
                <Input
                  id="buscarOc"
                  placeholder="Folio, proveedor o concepto"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="estadoOc">Estado</Label>
                <select
                  id="estadoOc"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                  value={estadoFilter}
                  onChange={(event) => setEstadoFilter(event.target.value)}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="tipoOcFiltro">Tipo de OC</Label>
                <select
                  id="tipoOcFiltro"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                  value={tipoFilter}
                  onChange={(event) => setTipoFilter(event.target.value)}
                >
                  <option value="TODOS">TODOS</option>
                  {tiposOc
                    .filter((tipo) => tipo.value)
                    .map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="empresaFiltro">Empresa</Label>
                <select
                  id="empresaFiltro"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                  value={empresaFilter}
                  onChange={(event) => setEmpresaFilter(event.target.value)}
                >
                  <option value="TODOS">TODOS</option>
                  {empresas
                    .filter((empresa) => empresa.value)
                    .map((empresa) => (
                      <option key={empresa.value} value={empresa.value}>
                        {empresa.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-100 text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Folio</th>
                    <th className="px-4 py-3 text-left font-medium">Proveedor</th>
                    <th className="px-4 py-3 text-left font-medium">Tipo de OC</th>
                    <th className="px-4 py-3 text-left font-medium">Empresa</th>
                    <th className="px-4 py-3 text-left font-medium">Monto</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-neutral-500" colSpan={7}>
                        No encontramos solicitudes con los filtros actuales.
                      </td>
                    </tr>
                  )}
                  {filteredOrders.map((order) => {
                    const tipoLabel = getLabel(order.tipoOc, tiposOc)
                    const empresaLabel = getLabel(order.empresa, empresas)
                    const orderMessages = messages[order.id] || []
                    return (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium text-neutral-900">{order.id}</td>
                        <td className="px-4 py-3 text-neutral-700">{order.proveedor}</td>
                        <td className="px-4 py-3 text-neutral-700">{tipoLabel}</td>
                        <td className="px-4 py-3 text-neutral-700">{empresaLabel}</td>
                        <td className="px-4 py-3 text-neutral-700">
                          {formatCurrency(order.monto, order.moneda)}
                        </td>
                        <td className="px-4 py-3 text-neutral-700">
                          <EstadoBadge estado={order.estado} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Detalle
                                </Button>
                              </DialogTrigger>
                              <DetalleSolicitud oc={order} tipoLabel={tipoLabel} empresaLabel={empresaLabel} />
                            </Dialog>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button size="sm" className="bg-neutral-900 text-white">
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  Mensaje
                                </Button>
                              </SheetTrigger>
                              <ChatAdministrador
                                oc={order}
                                mensajes={orderMessages}
                                onSend={(msg) => handleSendMessage(order.id, msg)}
                              />
                            </Sheet>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <CatalogoManager
            titulo="Tipos de OC"
            items={tiposOc}
            onAdd={addTipoOc}
            emptyLabel="Ej. SERVICIOS ESPECIALES"
          />
          <CatalogoManager
            titulo="Empresas"
            items={empresas}
            onAdd={addEmpresa}
            emptyLabel="Nombre de la empresa"
          />
        </div>
      </div>
    </div>
  )
}
