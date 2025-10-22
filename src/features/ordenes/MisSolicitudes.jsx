import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Filter, MessageSquare, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockOrders, mockChat } from "./data";

function EstadoBadge({ estado }) {
  const map = {
    PENDIENTE: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    EN_APROBACION: "bg-amber-100 text-amber-700 border border-amber-200",
    APROBADA: "bg-green-100 text-green-700 border border-green-200",
    RECHAZADA: "bg-red-100 text-red-700 border border-red-200",
    BORRADOR: "bg-neutral-200 text-neutral-700 border border-neutral-300",
  };
  return <Badge className={map[estado] || map.PENDIENTE}>{estado}</Badge>;
}

function DetalleOC({ row }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {row.id} — {row.proveedor}
        </DialogTitle>
        <DialogDescription>Centro de costo: {row.cc}</DialogDescription>
      </DialogHeader>
      <Separator />
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <div className="text-neutral-500">Concepto</div>
          <div className="font-medium">{row.concepto}</div>
        </div>
        <div>
          <div className="text-neutral-500">Monto</div>
          <div className="font-medium">
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: row.moneda,
            }).format(row.monto)}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">Estado</div>
          <div>
            <EstadoBadge estado={row.estado} />
          </div>
        </div>
        <div>
          <div className="text-neutral-500">Fecha</div>
          <div className="font-medium">{row.fecha}</div>
        </div>
      </div>
      {row.estado === "RECHAZADA" && (
        <div className="mt-4 rounded-xl border bg-red-50 p-3 text-sm text-red-700">
          <div className="font-semibold">Motivo de rechazo</div>
          <div>{row.rechazo || "—"}</div>
        </div>
      )}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline">
          <X className="mr-1 h-4 w-4" />
          Cerrar
        </Button>
        <Button className="bg-neutral-900 text-white">
          <Check className="mr-1 h-4 w-4" />
          Aceptar
        </Button>
      </div>
    </DialogContent>
  );
}

function ChatOC({ row, chat }) {
  const [msg, setMsg] = useState("");
  const msgs = chat[row.id] || [];

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Chat — {row.id}</SheetTitle>
        <SheetDescription>
          Conversación y razones de rechazo/ajustes.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-4 flex-1 space-y-3 overflow-auto">
        {msgs.length === 0 && (
          <p className="text-sm text-neutral-500">Sin mensajes aún.</p>
        )}
        {msgs.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-2",
              m.who === "owner" && "justify-end",
            )}
          >
            {m.who !== "owner" && (
              <Avatar className="h-7 w-7">
                <AvatarImage alt="Approver" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-2xl border px-3 py-2 text-sm",
                m.who === "owner"
                  ? "border-neutral-800 bg-neutral-900 text-white"
                  : "bg-white",
              )}
            >
              <div className="text-[11px] opacity-70">{m.at}</div>
              <div>{m.text}</div>
            </div>
            {m.who === "owner" && (
              <Avatar className="h-7 w-7">
                <AvatarImage alt="Yo" />
                <AvatarFallback>Yo</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Label className="text-xs">Escribe un mensaje</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Explica o pregunta…"
          />
          <Button className="bg-neutral-900 text-white">Enviar</Button>
        </div>
      </div>
    </SheetContent>
  );
}

function FilaOC({ row, chat }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border p-3 hover:bg-neutral-50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.id}</span>
          <EstadoBadge estado={row.estado} />
        </div>
        <div className="text-sm text-neutral-600">
          {row.proveedor} - {row.concepto}
        </div>
        <div className="text-xs text-neutral-500">
          {row.cc} - {row.fecha}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">
          {new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: row.moneda,
          }).format(row.monto)}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Detalle
              </Button>
            </DialogTrigger>
            <DetalleOC row={row} />
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="bg-neutral-900 text-white">
                <MessageSquare className="mr-1 h-4 w-4" />
                Chat
              </Button>
            </SheetTrigger>
            <ChatOC row={row} chat={chat} />
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export function MisSolicitudes({ orders = mockOrders, chat = mockChat }) {
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();
  const filtered = orders.filter((r) =>
    `${r.id} ${r.proveedor} ${r.concepto}`.toLowerCase().includes(query),
  );
  const pendientes = filtered.filter(
    (r) => r.estado === "PENDIENTE" || r.estado === "EN_APROBACION",
  );
  const aprobadas = filtered.filter((r) => r.estado === "APROBADA");
  const rechazadas = filtered.filter((r) => r.estado === "RECHAZADA");
  const borradores = filtered.filter((r) => r.estado === "BORRADOR");

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base font-semibold">
          Mis solicitudes
        </CardTitle>
        <p className="text-sm text-neutral-500">
          Consulta el estado de las órdenes que has creado y conversa con
          aprobadores.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full gap-2 sm:max-w-sm">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar folio / proveedor / concepto"
              className="h-10"
            />
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-neutral-500">
            {filtered.length} resultados
          </div>
        </div>

        <Tabs defaultValue="pendientes">
          <TabsList className="flex w-full flex-wrap gap-2 bg-transparent p-0 md:bg-muted md:p-1">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
            <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
            <TabsTrigger value="borradores">Borradores</TabsTrigger>
          </TabsList>

          <TabsContent value="pendientes" className="space-y-2 pt-4">
            {pendientes.length === 0 && (
              <p className="text-sm text-neutral-500">Sin pendientes.</p>
            )}
            {pendientes.map((row) => (
              <FilaOC key={row.id} row={row} chat={chat} />
            ))}
          </TabsContent>

          <TabsContent value="aprobadas" className="space-y-2 pt-4">
            {aprobadas.length === 0 && (
              <p className="text-sm text-neutral-500">Sin aprobadas.</p>
            )}
            {aprobadas.map((row) => (
              <FilaOC key={row.id} row={row} chat={chat} />
            ))}
          </TabsContent>

          <TabsContent value="rechazadas" className="space-y-2 pt-4">
            {rechazadas.length === 0 && (
              <p className="text-sm text-neutral-500">Sin rechazadas.</p>
            )}
            {rechazadas.map((row) => (
              <FilaOC key={row.id} row={row} chat={chat} />
            ))}
          </TabsContent>

          <TabsContent value="borradores" className="space-y-2 pt-4">
            {borradores.length === 0 && (
              <p className="text-sm text-neutral-500">Sin borradores.</p>
            )}
            {borradores.map((row) => (
              <FilaOC key={row.id} row={row} chat={chat} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
