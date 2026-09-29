import type { CollectionIdentity } from "./collections";

type CollectionHeaderProps = {
  identity: CollectionIdentity;
  /** Real collection size from the feed; undefined while loading or unavailable. */
  count?: number;
  loading?: boolean;
};

/**
 * Compact editorial banner for /collections/:slug. Same structure for every
 * collection; only the icon, tone and copy change. Kept short so products
 * stay high on the page.
 */
export const CollectionHeader = ({ identity: { label, lead, description, tone, Icon }, count, loading }: CollectionHeaderProps) => (
  <header className={"collection-header collection-tone-" + tone}>
    <Icon className="collection-header-motif" aria-hidden="true" strokeWidth={1.25} />
    <div className="collection-header-icon" aria-hidden="true"><Icon strokeWidth={2} /></div>
    <div className="collection-header-copy">
      <span className="collection-header-eyebrow">Collection</span>
      <h1>{label}</h1>
      <p className="collection-header-lead">{lead}</p>
      <p className="collection-header-desc">{description}</p>
    </div>
    {(loading || count !== undefined) && <p className="collection-header-count">
      {loading ? <span className="collection-header-count-loading">Counting products…</span>
        : <><strong>{count!.toLocaleString()}</strong> {count === 1 ? "product" : "products"}</>}
    </p>}
  </header>
);
