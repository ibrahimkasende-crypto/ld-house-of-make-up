import { NextResponse } from "next/server";
import { requireApiAuth, unauthorized } from "@/lib/api-auth";
import { listRequests } from "@/lib/queries";
import { clientName } from "@/lib/utils";

export async function GET(request: Request) {
  if (!(await requireApiAuth(request))) return unauthorized();
  const rows = await listRequests();
  return NextResponse.json({
    requests: rows.map(({ request: item, client }) => ({
      id: item.id,
      reference: item.publicRef,
      client: clientName(client),
      email: client.email,
      service: item.serviceLabel,
      desiredDate: item.desiredDate,
      location: item.location,
      budget: item.budget,
      status: item.status,
      createdAt: item.createdAt,
    })),
  });
}
