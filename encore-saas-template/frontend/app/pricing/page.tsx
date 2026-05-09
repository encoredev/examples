'use client'
import { PricingCard } from "@/components/pricing/PricingCard";
import { product } from "@/app/lib/client";
import { getProducts } from "@/app/lib/serverApi";
import { useEffect } from "react";
import { useState } from "react";

const productToTier: Record<'Base' | 'Plus', {
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}> = {
  "Base": {
    features: [
      "Up to 3 projects",
      "10GB storage",
      "Basic analytics",
      "24/7 support",
      "API access",
      "Community access"
    ],
    cta: "Get Started",
    href: "/signup?plan=base"
  },
  "Plus": {
    features: [
      "Unlimited projects",
      "50GB storage",
      "Advanced analytics",
      "24/7 priority support",
      "Advanced API access",
      "Early access features",
      "Custom integrations",
      "Team collaboration tools"
    ],
    cta: "Get Plus",
    href: "/signup?plan=plus",
    featured: true
  }
}

export default function PricingPage() {
  const [products, setProducts] = useState<product.Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBEBDF]">
      <div className="py-32">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-zinc-700 text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {products.map((product) => (
                <PricingCard 
                  key={product.id}
                  product={product}
                  tier={productToTier[product.name as keyof typeof productToTier]}
                />
              ))}
          </div>

          {/* Skeletons if loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse h-[600px] rounded-lg"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 