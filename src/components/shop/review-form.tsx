"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitReviewAction } from "@/app/actions/shop";

export function ReviewForm({ productId, slug }: { productId: number; slug: string }) {
  const [state, action, pending] = useActionState(submitReviewAction, undefined);
  const [rating, setRating] = useState(5);
  const [open, setOpen] = useState(false);

  if (state?.ok) return <p className="rounded-sm bg-green-50 p-3 text-sm text-green-700">Thanks! Your review has been published.</p>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-outline shadow">
        Rate product
      </button>
    );

  return (
    <form action={action} className="space-y-3 rounded-sm border p-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star`}
            onClick={() => setRating(n)}
            className={`text-2xl ${n <= rating ? "text-success" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <input name="title" required maxLength={160} placeholder="Review title" className="input" />
      <textarea name="comment" required minLength={10} maxLength={2000} rows={4} placeholder="Share your experience…" className="input" />
      {state?.error === "auth" ? (
        <p className="text-sm text-red-600">
          Please <Link href={`/login?next=/p/${slug}`} className="font-semibold underline">login</Link> to write a review.
        </p>
      ) : (
        state?.error && <p className="text-sm text-red-600">{state.error}</p>
      )}
      <button disabled={pending} className="btn-buy">
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
