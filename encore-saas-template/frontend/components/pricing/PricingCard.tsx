"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { product } from "@/app/lib/client";
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider";
import { handleSubscription, createCustomerPortalSession } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentPlan } from "@/app/lib/hooks";

interface PricingCardProps {
  product: product.Product;
  tier: {
    features: string[];
    cta: string;
    href: string;
    featured?: boolean;
  };
}

export function PricingCard({ product, tier }: PricingCardProps) {
  const router = useRouter();
  const { user, token } = useFirebase();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { currentPlan, isCurrentPlanLoading } = useCurrentPlan(token);

  const handleGetStartedClick = async () => {
    setLoadingCheckout(true);
    try {
      if (currentPlan) {
        const token = await user?.getIdToken();
        await createCustomerPortalSession(token, router);
      } else {
        const token = await user?.getIdToken();
        await handleSubscription(token, product.price.id, router);
      }
    } catch (error) {
      toast.error('Failed to process subscription request');
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <Card 
      className={`p-8 border-zinc-200 bg-white transition-all duration-300 ${
        tier.featured ? 'ring-2 ring-zinc-900' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        {tier.featured && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm text-black font-medium bg-zinc-900/10 text-zinc-900 border border-zinc-900/20 self-start mb-4">
            Most Popular
          </div>
        )}
        
        {currentPlan === product.name && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm text-green-700 font-medium bg-green-100 border border-green-200 self-start mb-4">
            Current Plan
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-black mb-2">{product.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-black">${product.price.unit_amount / 100}</span>
          <span className="text-zinc-600 ml-2">/month</span>
        </div>
        
        <p className="text-zinc-600 mb-6">
          {product.description}
        </p>

        <div className="flex-grow">
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center text-zinc-700">
                <Check className="h-5 w-5 text-zinc-900 mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={handleGetStartedClick}
          className={`w-full ${
            tier.featured 
              ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
              : 'bg-black hover:bg-zinc-800 text-white'
          }`}
          size="lg"
        >
          {loadingCheckout ? "Loading..." : currentPlan ? "Manage Plan" : tier.cta}
        </Button>
      </div>
    </Card>
  );
} 