// Test IDs untuk Owner Dashboard. Naming mengikuti direktif di ./auth.js.

export const DASHBOARD = {
	page: 'dashboard-page',
	sidebar: 'dashboard-sidebar',
	navItem: (id) => `dashboard-nav-${id}`,
	mobileToggle: 'dashboard-mobile-toggle',
	sectionTitle: 'dashboard-section-title',
	metricCard: (id) => `dashboard-metric-${id}`,
	approvalCard: (id) => `approval-card-${id}`,
	approveButton: (id) => `approval-approve-${id}`,
	rejectButton: (id) => `approval-reject-${id}`,
	approvalEmpty: 'approval-empty-state',
	conversationItem: (id) => `inbox-conversation-${id}`,
	conversationThread: 'inbox-thread',
	traceStage: (i) => `inbox-trace-stage-${i}`,
	productRow: (sku) => `catalog-row-${sku}`,
	productSearch: 'catalog-search-input',
	chartDaily: 'analytics-chart-daily',
	chartIntent: 'analytics-chart-intent',
};
