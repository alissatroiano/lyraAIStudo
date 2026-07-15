import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Sparkles, CreditCard, Lock, ArrowRight, ShieldCheck, Check, Info } from "lucide-react";

interface SubscriptionWallProps {
  user: any;
  onSuccess: () => void;
}

export const SubscriptionWall: React.FC<SubscriptionWallProps> = ({ user, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan] = useState<"pro" | "camp">("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = {
    pro: {
      id: "pro",
      name: "STEM Educator Pro",
      price: "$29",
      period: "month",
      desc: "Perfect for individual teachers, tutors, and classroom instructors seeking the ultimate STEM copilot.",
      features: [
        "Unlimited custom lesson generations",
        "Full slide deck outputs with audio/TTS",
        "Adaptive classroom memory profiles",
        "Printable worksheets & jeopardy quizzes",
        "Priority Gemini 1.5 Pro processing"
      ]
    },
    camp: {
      id: "camp",
      name: "STEM Camp Director",
      price: "$95",
      period: "month",
      desc: "Built for summer camps, program directors, and schools managing multiple educators and cohorts.",
      features: [
        "Everything in Educator Pro",
        "Up to 5 instructor sub-accounts",
        "Shared curriculum resource vault",
        "Export directly to PowerPoint / PDF",
        "Dedicated customer success rep"
      ]
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const amountInCents = selectedPlan === "pro" ? 2900 : 9500;

    try {
      // 1. Create payment intent on server
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents, currency: "usd" }),
      });

      if (!res.ok) {
        throw new Error("Failed to contact payment gateway server.");
      }

      const { clientSecret, isMock } = await res.json();

      if (isMock) {
        // Mock flow for dev/testing environment
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Update user profile in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          isSubscribed: true,
          stripeCustomerId: "cus_mock_" + Math.random().toString(36).substring(2, 10),
          stripeSubscriptionId: "sub_mock_" + Math.random().toString(36).substring(2, 10),
          updatedAt: serverTimestamp(),
        });

        setPaymentSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        // Real Stripe payment flow
        if (!stripe || !elements) {
          throw new Error("Stripe.js has not loaded yet. Please wait a moment and try again.");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Payment form elements not ready.");
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement as any,
            billing_details: {
              email: user.email || "",
              name: user.displayName || "Subscriber",
            },
          },
        });

        if (result.error) {
          throw new Error(result.error.message || "Payment confirmation failed.");
        }

        if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
          // Update user profile in Firestore
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            isSubscribed: true,
            stripeCustomerId: result.paymentIntent.id,
            stripeSubscriptionId: "sub_live_" + result.paymentIntent.id,
            updatedAt: serverTimestamp(),
          });

          setPaymentSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          throw new Error("Transaction was not fully authorized.");
        }
      }
    } catch (err: any) {
      console.error("Subscription payment failed:", err);
      setError(err?.message || "An unexpected error occurred during subscription.");
    } finally {
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#0f1117",
        fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#dc2626",
        iconColor: "#dc2626",
      },
    },
    hidePostalCode: true,
  };

  if (paymentSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-md animate-bounce">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-teal-dark mb-2">Subscription Activated!</h2>
        <p className="text-sm text-secondary max-w-sm mb-4">
          Thank you for subscribing! Your account is upgraded to <strong>{plans[selectedPlan].name}</strong>.
        </p>
        <p className="text-xs text-teal-brand font-medium">Unlocking Lyra STEM Engine...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
      {/* Eyebrow & Headline */}
      <div className="text-center max-w-2xl space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#e0faf8] text-[#1a4a45] rounded-full text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-brand animate-pulse" />
          <span>Instructor Membership</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Choose your plan to unlock <span className="text-teal-dark underline decoration-teal-brand/40 underline-offset-4">Lyra Copilot</span>
        </h2>
        <p className="text-sm text-secondary leading-relaxed">
          Transform wordy curriculum materials into immersive interactive presentations, slides, and hands-on laboratory lessons built for accessibility.
        </p>
      </div>

      {/* Plan selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
        {Object.values(plans).map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as "pro" | "camp")}
              className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-teal-brand bg-teal-light/20 shadow-md transform scale-[1.01]"
                  : "border-black/[0.08] hover:border-black/[0.18] bg-white"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-teal-dark font-sans">{plan.name}</span>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-teal-brand bg-teal-light px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-semibold text-primary">{plan.price}</span>
                  <span className="text-xs text-secondary">/ {plan.period}</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed font-sans">{plan.desc}</p>
                
                <ul className="space-y-2 pt-2 border-t border-black/[0.06]">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-secondary">
                      <Check className="w-3.5 h-3.5 text-teal-brand shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secure payment form */}
      <div className="w-full max-w-md bg-white border border-black/[0.09] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-black/[0.06] pb-3">
          <span className="text-[10px] font-bold font-mono tracking-wider text-teal-brand uppercase">
            Secure Payment Form
          </span>
          <span className="text-xs font-semibold text-secondary font-sans flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            SSL Encrypted
          </span>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-teal-dark block font-sans">Credit or Debit Card</label>
            <div className="p-3.5 border border-black/[0.12] rounded-xl bg-surface-0/30">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-900 flex gap-2 font-sans leading-normal">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="bg-surface-0 border border-black/[0.04] p-3.5 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
            <p className="text-[10px] text-secondary leading-relaxed font-sans">
              No real Stripe key configured? Simply fill any mock details (e.g. <strong>4242 4242...</strong>) to simulate checkout and unlock immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-dark hover:bg-opacity-95 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Pay &amp; Activate Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
