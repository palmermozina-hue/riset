// Test IDs untuk halaman Pengaturan (profil toko, user management, preferensi agent).
// Naming mengikuti direktif di ./auth.js.

export const SETTINGS = {
        page: 'settings-page',
        tab: (id) => `settings-tab-${id}`,

        // Profil toko
        profileForm: 'settings-profile-form',
        profileNameInput: 'settings-profile-name-input',
        profileStoreInput: 'settings-profile-store-input',
        profileEmailInput: 'settings-profile-email-input',
        profilePhoneInput: 'settings-profile-phone-input',
        profileAddressInput: 'settings-profile-address-input',
        profileSaveButton: 'settings-profile-save-button',

        // User management
        usersPanel: 'settings-users-panel',
        usersCount: 'settings-users-count',
        usersSearchInput: 'settings-users-search-input',
        usersEmptyState: 'settings-users-empty-state',
        userRow: (id) => `settings-user-row-${id}`,
        userRoleSelect: (id) => `settings-user-role-select-${id}`,
        userStatus: (id) => `settings-user-status-${id}`,
        userRemoveButton: (id) => `settings-user-remove-${id}`,

        // Invite dialog
        inviteOpenButton: 'settings-invite-open-button',
        inviteDialog: 'settings-invite-dialog',
        inviteNameInput: 'settings-invite-name-input',
        inviteEmailInput: 'settings-invite-email-input',
        inviteRoleOption: (id) => `settings-invite-role-${id}`,
        inviteSubmitButton: 'settings-invite-submit-button',
        inviteCancelButton: 'settings-invite-cancel-button',
        inviteError: 'settings-invite-error',

        // Preferensi agent
        prefsPanel: 'settings-prefs-panel',
        prefToggle: (id) => `settings-pref-toggle-${id}`,
};
