"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { MenuItem } from "@/lib/types";

interface MenuRow {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: MenuItem["category"];
  tag: string | null;
  rating: number | null;
  review_count: number;
  prep_time: string | null;
  is_popular: boolean;
}

function mapMenu(row: MenuRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image_url ?? "",
    category: row.category,
    tag: row.tag ?? undefined,
    rating: row.rating ?? undefined,
    reviewCount: row.review_count,
    prepTime: row.prep_time ?? undefined,
    isPopular: row.is_popular,
  };
}

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSupabase()
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) {
          setError(queryError.message);
        } else {
          setItems(((data ?? []) as MenuRow[]).map(mapMenu));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}

export function useMenuItem(id: string) {
  const { items, loading, error } = useMenuItems();
  return { item: items.find((m) => m.id === id), loading, error };
}