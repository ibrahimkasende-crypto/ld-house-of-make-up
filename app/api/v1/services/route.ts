import { NextResponse } from "next/server";
import { getActiveServices } from "@/lib/queries";

export async function GET() {
  const rows = await getActiveServices();
  return NextResponse.json({
    services: rows.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.pricePublic && service.priceCents != null ? service.priceCents / 100 : null,
      priceLabel: service.pricePublic ? null : "Tarif sur demande",
      availability: service.availability,
    })),
  });
}
