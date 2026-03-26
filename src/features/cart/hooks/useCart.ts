import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useMeCart } from "@/features/cart/hooks/useMeCart";
import { useUpsertMeCartItem } from "@/features/cart/hooks/useUpsertMeCartItem";
import { useRemoveMeCartItem } from "@/features/cart/hooks/useRemoveMeCartItem";

export type UnifiedCartItem =
  | {
      mode: "guest";
      key: string;
      product_id: number;
      variant_id: number;
      quantity: number;
      unit_price: number;
      name: string;
      slug: string;
      thumbnail: string;
      category?: string;
      brand?: string;
      sku?: string;
    }
  | {
      mode: "auth";
      key: string;
      item_id: number;
      product_id: number;
      variant_id: number;
      quantity: number;
      unit_price: number;

      name: string;
      slug: string;
      thumbnail: string;
      category?: string;
      brand?: string;
    };

export const useCart = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const guestItems = useCartStore((s) => s.items);
  const guestUpdateQty = useCartStore((s) => s.updateQuantity);
  const guestRemove = useCartStore((s) => s.removeVariantItem);
  const guestClear = useCartStore((s) => s.clearCart);

  const meCartQuery = useMeCart();
  const upsert = useUpsertMeCartItem();
  const remove = useRemoveMeCartItem();

  const items: UnifiedCartItem[] = useMemo(() => {
    if (!isAuthenticated) {
      return guestItems.map((i) => ({
        mode: "guest",
        key: `g:${i.product_id}:${i.variant_id}`,
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        unit_price: i.price,
        name: i.name,
        slug: i.slug,
        thumbnail: i.thumbnail,
        sku: i.sku,
      }));
    }

    const cart = meCartQuery.data;
    const authItems = cart?.items ?? [];

    return authItems.map((i) => {
      const info = i.product_info;

      return {
        mode: "auth",
        key: `a:${i.id}`,
        item_id: i.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        unit_price: Number(i.price_at_added ?? info?.price ?? 0),

        name: info?.name ?? `Product #${i.product_id}`,
        slug: info?.slug ?? "",
        thumbnail: info?.primary_image ?? "https://picsum.photos/seed/zentora-cart/200/200",
        category: info?.category,
        brand: info?.brand,
      };
    });
  }, [guestItems, isAuthenticated, meCartQuery.data]);

  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0), [items]);

  const setQuantity = async (item: UnifiedCartItem, nextQty: number) => {
    if (item.mode === "guest") {
      guestUpdateQty(item.product_id, item.variant_id, nextQty);
      return;
    }

    if (nextQty <= 0) {
      await remove.mutateAsync(item.item_id);
      return;
    }

    await upsert.mutateAsync({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: nextQty,
      price_at_added: String(item.unit_price),
    });
  };

  const removeItem = async (item: UnifiedCartItem) => {
    if (item.mode === "guest") {
      guestRemove(item.product_id, item.variant_id);
      return;
    }
    await remove.mutateAsync(item.item_id);
  };

  const clear = async () => {
    if (!isAuthenticated) {
      guestClear();
      return;
    }

    const authItems = items.filter((i) => i.mode === "auth") as Extract<UnifiedCartItem, { mode: "auth" }>[];
    for (const it of authItems) {
      // eslint-disable-next-line no-await-in-loop
      await remove.mutateAsync(it.item_id);
    }
  };

  return {
    mode: isAuthenticated ? ("auth" as const) : ("guest" as const),
    isLoading: isAuthenticated ? meCartQuery.isLoading  || meCartQuery.isFetching : false,
    items,
    itemCount,
    subtotal,
    setQuantity,
    removeItem,
    clear,
    refetch: meCartQuery.refetch,
  };
};