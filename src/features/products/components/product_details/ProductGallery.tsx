import { Badge } from "@/shared/components/ui";
import { HeartIcon, ShareIcon, ShieldCheckIcon, TruckIcon, ArrowReturnIcon, WhatsAppIcon, ChevronRightIcon } from "./icons";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

type ProductGalleryProps = {
  imageUrls: string[];
  selectedImage: number;
  onSelectImage: (idx: number) => void;
  productName: string;
  discountPercent: number;
  isFeatured: boolean;
  isDigital: boolean;
  isWished: boolean;
  isAuthenticated: boolean;
  wishlistPending: boolean;
  selectedVariantId: number | undefined;
  canonicalUrl: string;
  whatsAppUrl: string;
  onToggleWishlist: () => void;
};

export const ProductGallery = ({
  imageUrls,
  selectedImage,
  onSelectImage,
  productName,
  discountPercent,
  isFeatured,
  isDigital,
  isWished,
  isAuthenticated,
  wishlistPending,
  selectedVariantId,
  canonicalUrl,
  whatsAppUrl,
  onToggleWishlist,
}: ProductGalleryProps) => {
  return (
    <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-24 flex flex-col gap-4">

      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-border group">
        <img
          src={imageUrls[selectedImage] ?? imageUrls[0]}
          alt={productName}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && <Badge variant="sale">-{discountPercent}%</Badge>}
          {isFeatured && <Badge variant="featured">Featured</Badge>}
          {isDigital && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/90 text-white backdrop-blur">
              Digital
            </span>
          )}
        </div>

        {/* Mobile wishlist */}
        <button
          type="button"
          className="absolute top-3 right-3 lg:hidden w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur flex items-center justify-center transition hover:bg-background disabled:opacity-50"
          onClick={onToggleWishlist}
          disabled={!isAuthenticated || wishlistPending || !selectedVariantId}
          title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
        >
          <HeartIcon filled={isWished} className={isWished ? "text-primary" : "text-foreground/60"} />
        </button>

        {/* Share */}
        <button
          type="button"
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur flex items-center justify-center transition hover:bg-background text-foreground/60 hover:text-foreground"
          onClick={() => navigator.share?.({ title: productName, url: canonicalUrl })}
          title="Share product"
        >
          <ShareIcon />
        </button>
      </div>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {imageUrls.map((img, idx) => (
            <button
              key={img}
              onClick={() => onSelectImage(idx)}
              className={cn(
                "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 bg-white",
                selectedImage === idx
                  ? "border-primary shadow-sm shadow-primary/20 scale-105"
                  : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-contain bg-gray-50"
              />
            </button>
          ))}
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        {[
          { icon: <ShieldCheckIcon />, label: "Secure Payment" },
          { icon: <TruckIcon />, label: "Fast Delivery" },
          { icon: <ArrowReturnIcon />, label: "7-Day Returns" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background p-3 text-center"
          >
            <span className="text-primary">{icon}</span>
            <span className="text-[10px] font-medium text-foreground/60 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* WhatsApp enquiry banner */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors px-4 py-3"
      >
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
          <WhatsAppIcon className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-[#25D366]">Have a question?</div>
          <div className="text-[11px] text-foreground/50 truncate">Chat with us on WhatsApp</div>
        </div>
        <ChevronRightIcon />
      </a>

    </div>
  );
};