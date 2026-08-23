// Test IDs untuk halaman Audit Log.

export const AUDIT = {
        page: 'audit-page',
        search: 'audit-search-input',
        actionFilter: (id) => `audit-filter-action-${id}`,
        statusFilter: 'audit-filter-status',
        actorFilter: 'audit-filter-actor',
        dateFrom: 'audit-filter-date-from',
        dateTo: 'audit-filter-date-to',
        resetFilters: 'audit-reset-filters',
        exportCsv: 'audit-export-csv',
        refresh: 'audit-refresh',
        summary: 'audit-summary',
        total: 'audit-total-count',
        timeline: 'audit-timeline',
        row: (id) => `audit-row-${id}`,
        rowToggle: (id) => `audit-row-toggle-${id}`,
        rowDetail: (id) => `audit-row-detail-${id}`,
        emptyState: 'audit-empty-state',
        loadMore: 'audit-load-more',
        errorBox: 'audit-error-box',
};
