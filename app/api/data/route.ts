import { NextRequest, NextResponse } from "next/server";
import { getAllCollections, putItems, deleteItems } from "@/lib/db";
import { COLLECTION_NAMES, type CollectionName } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getAllCollections());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

interface Mutation {
  collection: CollectionName;
  put?: { id: string }[];
  delete?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { mutations } = (await req.json()) as { mutations: Mutation[] };
    for (const m of mutations ?? []) {
      if (!COLLECTION_NAMES.includes(m.collection)) continue;
      if (m.put?.length) await putItems(m.collection, m.put);
      if (m.delete?.length) await deleteItems(m.collection, m.delete);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
