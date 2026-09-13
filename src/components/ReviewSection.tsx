"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

type ReviewUser = { name: string };
type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user: ReviewUser;
};

export default function ReviewSection({
  productId,
  initialReviews,
  locale = "bn",
}: {
  productId: string;
  initialReviews: ReviewItem[];
  locale?: "bn" | "en";
}) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t =
    locale === "bn"
      ? {
          title: "রিভিউ ও রেটিং",
          noReviews: "এখনো কোনো রিভিউ নেই। প্রথম রিভিউ আপনিই দিন!",
          loginPrompt: "রিভিউ দিতে হলে লগইন করুন।",
          placeholder: "আপনার অভিজ্ঞতা লিখুন (ঐচ্ছিক)",
          submit: "রিভিউ জমা দিন",
          submitting: "জমা হচ্ছে...",
          selectRating: "রেটিং দিন",
        }
      : {
          title: "Reviews & Ratings",
          noReviews: "No reviews yet. Be the first to review!",
          loginPrompt: "Please log in to write a review.",
          placeholder: "Share your experience (optional)",
          submit: "Submit Review",
          submitting: "Submitting...",
          selectRating: "Select a rating",
        };

  async function handleSubmit() {
    setError("");
    if (rating < 1) {
      setError(t.selectRating);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "সমস্যা হয়েছে");
        setSubmitting(false);
        return;
      }
      const newReview = await res.json();
      const withUser = { ...newReview, user: { name: session?.user?.name || "" } };
      setReviews((prev) => [withUser, ...prev.filter((r) => r.id !== newReview.id)]);
      setRating(0);
      setComment("");
    } catch {
      setError("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 border-t border-brand-pinkLight pt-6">
      <h2 className="text-xl font-semibold text-brand-ink mb-4">{t.title}</h2>

      {session?.user ? (
        <div className="mb-6 rounded-lg border border-brand-pinkLight p-4">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={24}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-brand-pink text-brand-pink"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
            rows={3}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-3 rounded-md bg-brand-pink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-600">{t.loginPrompt}</p>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">{t.noReviews}</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= r.rating ? "fill-brand-pink text-brand-pink" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-brand-ink">{r.user.name}</span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-gray-700">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
