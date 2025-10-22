import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MisSolicitudes } from "@/features/ordenes/MisSolicitudes";
import { mockOrders, mockChat } from "@/features/ordenes/data";

function Hero() {
  return (
    <Card className="border-none bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xl">
      <CardContent className="space-y-6 px-8 py-12 md:px-12 md:py-14">
        <div className="space-y-2">
          {/* <p className="text-sm uppercase tracking-[0.25em] text-white/70">Panel del creador</p> */}
          <h1 className="text-3xl font-semibold md:text-4xl">
            Bienvenido de nuevo
          </h1>
          <p className="max-w-2xl text-sm text-white/80 md:text-base">
            Aquí monitoreas el avance de tus órdenes de compra, atiendes
            comentarios de los aprobadores y comienzas nuevas solicitudes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3"></div>
      </CardContent>
    </Card>
  );
}

function ResumenRapido() {
  const pendientes = mockOrders.filter(
    (oc) => oc.estado === "PENDIENTE" || oc.estado === "EN_APROBACION",
  ).length;
  const aprobadas = mockOrders.filter((oc) => oc.estado === "APROBADA").length;
  const rechazadas = mockOrders.filter(
    (oc) => oc.estado === "RECHAZADA",
  ).length;
  const borradores = mockOrders.filter((oc) => oc.estado === "BORRADOR").length;

  const data = [
    { label: "Borradores", value: borradores },
    { label: "Pendientes", value: pendientes },
    { label: "Aprobadas", value: aprobadas },
    { label: "Rechazadas", value: rechazadas },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Resumen rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border px-4 py-3 text-center"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {item.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dhasbord() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <Hero />
        {/* <ResumenRapido /> */}
        <MisSolicitudes orders={mockOrders} chat={mockChat} />
      </main>
    </div>
  );
}
