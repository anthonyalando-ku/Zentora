export const HeaderSearch = () => (
  <div className="hidden md:flex flex-1 max-w-sm">
    <div className="relative w-full">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        placeholder="Search products..."
        className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  </div>
);
