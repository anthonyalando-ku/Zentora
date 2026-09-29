import { useId, useState } from "react";
import { Search } from "lucide-react";
import { FilterSection } from "./FilterSection";
import "@/styles/catalogue.css";
export type FilterSidebarProps = {
  disabled: boolean;
  categories: { id: string | number; name: string }[];
  brands: { id: string | number; name: string }[];
  selectedCategoryId: string | null;
  selectedBrandId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  discountOnly: boolean;
  inStockOnly: boolean;
  onChange: (patch: {
    category_id?: string | null;
    brand_id?: string | null;
    price_min?: string | null;
    price_max?: string | null;
    min_rating?: string | null;
    discount_only?: boolean;
    in_stock_only?: boolean;
  }) => void;
};


function ChoiceFilter({ title, items, selected, disabled, onSelect }: { title: string; items: {id: string | number; name: string}[]; selected: string | null; disabled: boolean; onSelect: (value: string | null) => void }) {
  const [search, setSearch] = useState("");
  const name = useId();
  const visible = items.filter(item => item.name.toLowerCase().includes(search.trim().toLowerCase()));
  return <FilterSection title={title}>
    {items.length > 7 && <label className="catalogue-filter-search"><Search size={14} aria-hidden="true"/><input aria-label={"Search " + title.toLowerCase()} placeholder={"Search " + title.toLowerCase() + "…"} value={search} onChange={e => setSearch(e.target.value)} disabled={disabled}/></label>}
    <div className="catalogue-choices" role="group" aria-label={title}>
      <label><input type="radio" name={name} checked={!selected} onChange={() => onSelect(null)} disabled={disabled}/><span>All {title === "Category" ? "categories" : "brands"}</span></label>
      {visible.map(item => <label key={item.id}><input type="radio" name={name} checked={String(item.id) === selected} onChange={() => onSelect(String(item.id))} disabled={disabled}/><span>{item.name}</span></label>)}
      {!visible.length && <p className="catalogue-filter-note">No matches found.</p>}
    </div>
  </FilterSection>;
}
function PriceFields({ priceMin, priceMax, disabled, onChange }: Pick<FilterSidebarProps, "priceMin" | "priceMax" | "disabled" | "onChange">) {
  const [min, setMin] = useState(priceMin == null ? "" : String(priceMin));
  const [max, setMax] = useState(priceMax == null ? "" : String(priceMax));
  const invalid = min !== "" && max !== "" && Number(min) > Number(max);
  const errorId = useId();
  return <form onSubmit={e => { e.preventDefault(); if (!invalid) onChange({price_min: min || null, price_max: max || null}); }}>
    <div className="catalogue-price-inputs"><label>Minimum<input type="number" min="0" step="any" value={min} onChange={e => setMin(e.target.value)} placeholder="Any" disabled={disabled} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined}/></label><span>–</span><label>Maximum<input type="number" min="0" step="any" value={max} onChange={e => setMax(e.target.value)} placeholder="Any" disabled={disabled} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined}/></label></div>
    {invalid && <p id={errorId} className="catalogue-price-error" role="alert">Maximum must be at least the minimum.</p>}
    <button type="submit" className="catalogue-price-apply" disabled={disabled || invalid}>Apply price</button>
  </form>;
}
export const FilterSidebar = (props: FilterSidebarProps) => {
  const {disabled, categories, brands, selectedCategoryId, selectedBrandId, minRating, discountOnly, inStockOnly, onChange} = props;
  const ratingName = useId();
  return <fieldset disabled={disabled} className="catalogue-filter-fields">
    <legend className="sr-only">Product filters</legend>
    <ChoiceFilter title="Category" items={categories} selected={selectedCategoryId} disabled={disabled} onSelect={value => onChange({category_id:value})}/>
    {brands.length > 0 && <ChoiceFilter title="Brand" items={brands} selected={selectedBrandId} disabled={disabled} onSelect={value => onChange({brand_id:value})}/>}
    <FilterSection title="Price (KSh)"><PriceFields key={String(props.priceMin) + ":" + String(props.priceMax)} {...props}/></FilterSection>
    <FilterSection title="Availability"><div className="catalogue-choices">
      <label><input type="checkbox" checked={inStockOnly} onChange={e => onChange({in_stock_only:e.target.checked})}/><span>In stock only</span></label>
      <label><input type="checkbox" checked={discountOnly} onChange={e => onChange({discount_only:e.target.checked})}/><span>Discount only</span></label>
    </div></FilterSection>
    <FilterSection title="Minimum rating"><div className="catalogue-choices">{[null,4.5,4,3.5,3].map(rating => <label key={String(rating)}><input type="radio" name={ratingName} checked={minRating === rating} onChange={() => onChange({min_rating:rating == null ? null : String(rating)})}/><span>{rating == null ? "Any rating" : <><span className="catalogue-rating-star" aria-hidden="true">★</span> {rating} & up</>}</span></label>)}</div></FilterSection>
  </fieldset>;
};
