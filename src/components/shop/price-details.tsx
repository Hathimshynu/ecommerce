import { formatPrice } from "@/lib/format";

export function PriceDetails({ count, subtotal, mrpTotal }: { count: number; subtotal: number; mrpTotal: number }) {
  const delivery = subtotal >= 500 ? 0 : 40;
  const savings = mrpTotal - subtotal;
  return (
    <aside className="card self-start lg:sticky lg:top-20">
      <h2 className="border-b px-6 py-3 text-sm font-semibold uppercase text-gray-500">Price details</h2>
      <dl className="space-y-4 px-6 py-4 text-sm">
        <div className="flex justify-between"><dt>Price ({count} item{count === 1 ? "" : "s"})</dt><dd>{formatPrice(mrpTotal)}</dd></div>
        <div className="flex justify-between"><dt>Discount</dt><dd className="text-success">− {formatPrice(savings)}</dd></div>
        <div className="flex justify-between"><dt>Delivery Charges</dt><dd className={delivery ? "" : "text-success"}>{delivery ? formatPrice(delivery) : "FREE"}</dd></div>
        <div className="flex justify-between border-y border-dashed py-4 text-base font-semibold"><dt>Total Amount</dt><dd>{formatPrice(subtotal + delivery)}</dd></div>
      </dl>
      {savings > 0 && <p className="px-6 pb-4 text-sm font-semibold text-success">You will save {formatPrice(savings)} on this order</p>}
    </aside>
  );
}
