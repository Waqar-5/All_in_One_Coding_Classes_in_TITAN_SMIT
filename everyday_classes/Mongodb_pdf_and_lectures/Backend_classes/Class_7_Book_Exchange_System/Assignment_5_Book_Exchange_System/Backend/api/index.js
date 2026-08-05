// ======================================================
// Vercel Serverless Entry Point
// ======================================================
// Vercel's Node runtime treats any file under /api as a serverless
// function and expects it to export a request handler. Our actual app
// (routes, middleware, DB connection) lives in ../server.js — this file
// just re-exports it so Vercel has something to invoke.
// ======================================================

module.exports = require("../server.js");
