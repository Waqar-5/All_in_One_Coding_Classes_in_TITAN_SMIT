// ======================================================
// Orphaned Image Cleanup Script
// ======================================================
//
// Scans every book in the catalog and checks whether its
// "coverImage" actually exists in Backend/uploads/. Books end up
// pointing at a missing file when the uploads/ folder is reset
// (e.g. re-extracting a fresh copy of the project) while the
// database — which lives in MongoDB Atlas — still has the old
// filename saved.
//
// USAGE
//   node scripts/checkImages.js            → dry run, just reports
//   node scripts/checkImages.js --fix       → also clears the
//                                              coverImage field on
//                                              any book whose file
//                                              is missing, so the
//                                              frontend placeholder
//                                              shows instead of a
//                                              broken image
//
// or via the npm scripts added to package.json:
//   npm run check-images
//   npm run check-images:fix
// ======================================================

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../config/db");
const Book = require("../models/book");

const UPLOAD_ROOT = path.join(__dirname, "..");
const shouldFix = process.argv.includes("--fix");

const run = async () => {

    await connectDB();

    console.log("====================================");
    console.log(shouldFix ? "🧹 Checking images (FIX mode)" : "🔍 Checking images (dry run)");
    console.log("====================================");

    // Check every book, including soft-deleted ones — a stale
    // reference is still worth reporting either way.
    const books = await Book.find({}).select("title coverImage isDeleted");

    const orphaned = [];

    for (const book of books) {

        if (!book.coverImage) continue; // no image set at all — nothing to check

        const filePath = path.join(UPLOAD_ROOT, book.coverImage);
        const exists = fs.existsSync(filePath);

        if (!exists) {
            orphaned.push(book);
        }

    }

    if (orphaned.length === 0) {

        console.log(`✅ Checked ${books.length} books — no orphaned images found.`);

    } else {

        console.log(`⚠️  Found ${orphaned.length} book(s) pointing at a missing image file:\n`);

        orphaned.forEach((book) => {
            console.log(`  - [${book._id}] "${book.title}"${book.isDeleted ? " (soft-deleted)" : ""} → ${book.coverImage}`);
        });

        if (shouldFix) {

            for (const book of orphaned) {
                book.coverImage = "";
                await book.save();
            }

            console.log(`\n🧹 Cleared coverImage on ${orphaned.length} book(s). They'll show the placeholder icon until re-uploaded.`);

        } else {

            console.log("\nRun with --fix to clear these (they'll fall back to the placeholder icon):");
            console.log("  node scripts/checkImages.js --fix");

        }

    }

    console.log("====================================");

    await mongoose.disconnect();
    process.exit(0);

};

run().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
});
