// utils/superAdmin.js
// Centralizes logic around the permanent "super admin" account, configured
// via SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD environment variables.
// This account:
//   - is automatically created on server startup if it doesn't exist yet
//   - is always given the "admin" role, even if the DB ever says otherwise
//   - can never be blocked
//   - can never have its role changed away from "admin"
// by anyone through the app (registration, login self-heal, the admin
// panel's block/role-change actions, and startup bootstrap all defer to
// this same check).

/**
 * Returns true if the given email matches the configured super admin email
 * (case-insensitive). Returns false if SUPER_ADMIN_EMAIL isn't configured.
 */
const isSuperAdminEmail = (email) => {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!superAdminEmail || !email) return false;
  return email.toLowerCase().trim() === superAdminEmail.toLowerCase().trim();
};

/**
 * Ensures the super admin account exists in the database with the correct
 * role and unblocked status. Called once on server startup (see server.js).
 * Safe to run every time the server boots — it's a no-op if the account
 * already exists and is already correct.
 *
 * Requires the `User` model to be passed in (rather than required directly)
 * to avoid a circular require between this file and models/User.js.
 */
const bootstrapSuperAdmin = async (User) => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      '⚠️  SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set in .env — skipping super admin bootstrap'
    );
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      name: 'Super Admin',
      email: normalizedEmail,
      password, // hashed automatically by the User model's pre-save hook
      role: 'admin',
    });
    console.log(`👑 Super admin account created: ${normalizedEmail}`);
    return;
  }

  // Account already exists — make sure it's still admin and unblocked.
  // (Password is intentionally left untouched here; use the DB directly
  // or the register/forgot-password flow if you ever need to reset it.)
  let changed = false;
  if (user.role !== 'admin') {
    user.role = 'admin';
    changed = true;
  }
  if (user.isBlocked) {
    user.isBlocked = false;
    changed = true;
  }
  if (changed) {
    await user.save();
    console.log(`👑 Super admin account healed (role/block status corrected): ${normalizedEmail}`);
  }
};

module.exports = { isSuperAdminEmail, bootstrapSuperAdmin };
