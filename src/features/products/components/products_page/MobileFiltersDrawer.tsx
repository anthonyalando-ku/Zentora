import { useEffect, useRef } from "react";
import { FilterSidebar, type FilterSidebarProps } from "./FilterSidebar";
import { XIcon } from "./icons";
type MobileFiltersDrawerProps = FilterSidebarProps & { open: boolean; onClose: () => void; activeFilterCount: number; onClearAll: () => void };
export const MobileFiltersDrawer = ({ open, onClose, activeFilterCount, onClearAll, ...filters }: MobileFiltersDrawerProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  return <dialog ref={ref} className="catalogue-drawer" aria-labelledby="mobile-filter-title" onCancel={e => {e.preventDefault(); onClose();}} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="catalogue-drawer-content">
      <div className="catalogue-drawer-header"><h2 id="mobile-filter-title">Filters{activeFilterCount > 0 ? " (" + activeFilterCount + ")" : ""}</h2><div>{activeFilterCount > 0 && <button type="button" onClick={onClearAll}>Clear all</button>}<button type="button" onClick={onClose} aria-label="Close filters"><XIcon/></button></div></div>
      <div className="catalogue-drawer-body">{open && <FilterSidebar {...filters}/>}</div>
      <div className="catalogue-drawer-footer"><button type="button" onClick={onClose}>View results</button></div>
    </div>
  </dialog>;
};
