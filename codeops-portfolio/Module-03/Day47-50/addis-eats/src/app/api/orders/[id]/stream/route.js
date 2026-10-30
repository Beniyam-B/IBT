import { getOrder } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
const DONE = new Set(["DELIVERED", "CANCELLED"]);

export async function GET(request, { params }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) return new Response("Not signed in", { status: 401 });
  const first = await getOrder(id);
  if (!first || (first.userId !== user.id && user.role !== "staff")) {
    return new Response("Not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  let timer;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      let last = null;
      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        try { controller.close(); } catch {}
      };
      const tick = async () => {
        try {
          const order = await getOrder(id);
          if (!order) return close();
          if (order.status !== last && !closed) {
            last = order.status;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: order.status })}\n\n`));
          }
          if (DONE.has(order.status)) close();
        } catch {
          close();
        }
      };
      tick();
      timer = setInterval(tick, 2000);
      request.signal.addEventListener("abort", close);
    },
    cancel() {
      closed = true;
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
  });
}