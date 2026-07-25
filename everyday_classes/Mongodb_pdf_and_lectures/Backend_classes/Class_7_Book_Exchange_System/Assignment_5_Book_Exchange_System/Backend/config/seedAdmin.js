// ======================================================
// Bootstrap Admin Seeder
// ======================================================
//
// Ensures a permanent admin account exists for ADMIN_EMAIL (from .env),
// and self-heals its role back to "Admin" every time the server starts —
// so it can never accidentally get stuck as a regular User (e.g. from a
// manual DB edit that didn't take, or another admin demoting it by
// mistake). This is the one account that's always guaranteed to have
// admin access without relying on manually editing MongoDB.

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.log("ℹ️  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap.");
        return;
    }

    try {

        const existing = await User.findOne({ email: adminEmail.toLowerCase() });

        if (existing) {

            // Already exists — just make sure it's still an admin and
            // not soft-deleted, in case either was changed by mistake.
            let changed = false;

            if (existing.role !== "Admin") {
                existing.role = "Admin";
                changed = true;
            }

            if (existing.isDeleted) {
                existing.isDeleted = false;
                changed = true;
            }

            if (changed) {
                await existing.save();
                console.log(`👑 Restored admin role for ${adminEmail}.`);
            }

            return;

        }

        // Doesn't exist yet — create it.
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: "Admin",
            email: adminEmail.toLowerCase(),
            password: hashedPassword,
            role: "Admin"
        });

        console.log(`👑 Created bootstrap admin account: ${adminEmail}`);

    }

    catch (error) {

        console.error("⚠️  Admin bootstrap failed:", error.message);

    }

};

module.exports = seedAdmin;
