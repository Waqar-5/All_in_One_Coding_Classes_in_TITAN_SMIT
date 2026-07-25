// ======================================================
// Rate Limiters
// ======================================================
//
// A single global 100-req/15min limit (the previous setup) is far too
// tight for a real SPA session: one page load can fire half a dozen
// parallel requests (auth check, favorites, stats, books list,
// my-books, exchange sent/received...), and React's StrictMode doubles
// every effect-triggered fetch in development. That burns through 100
// requests in a couple of minutes of completely normal browsing.
//
// The actual security concern rate limiting exists for — brute-forcing
// a password — only applies to login/register. Everything else should
// have a generous ceiling that a real user could never hit by accident,
// just enough to blunt a scripted abuse attempt.

const rateLimit = require("express-rate-limit");

// General API limiter — generous, applies to everything by default.
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again in a few minutes."
    }
});

// Auth limiter — strict, applies only to login/register, to slow down
// password-guessing attempts without affecting normal use of the app.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in a few minutes."
    }
});

module.exports = { generalLimiter, authLimiter };
