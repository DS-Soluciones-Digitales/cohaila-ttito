"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const VALID_CODES = ['USD', 'EUR', 'PEN', 'CNY'];
const ALLOWED_COMBINATIONS = {
    USD: { USD: false, EUR: true, PEN: true, CNY: false },
    EUR: { USD: true, EUR: false, PEN: true, CNY: true },
    PEN: { USD: true, EUR: true, PEN: false, CNY: true },
    CNY: { USD: false, EUR: true, PEN: true, CNY: false },
};
const BASE_RATES = {
    'USD-EUR': 0.92,
    'USD-PEN': 3.71,
    'EUR-USD': 1.15,
    'EUR-PEN': 4.03,
    'EUR-CNY': 7.9,
    'PEN-USD': 0.27,
    'PEN-EUR': 0.25,
    'PEN-CNY': 1.95,
    'CNY-EUR': 0.13,
    'CNY-PEN': 0.51,
};
const DAY_MS = 24 * 60 * 60 * 1000;
const atStartOfDayUtc = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS);
const formatIso = (date) => `${date.toISOString().split('T')[0]}T00:00:00.000Z`;
const parseDateFrom = (value) => {
    if (!value)
        return null;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()))
        return null;
    return atStartOfDayUtc(parsed);
};
const isDateAllowed = (date) => {
    const today = atStartOfDayUtc(new Date());
    const minDate = addDays(today, -4);
    return date >= minDate && date <= today;
};
const hash = (text) => text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
const buildRates = (from, to, startDate) => {
    const today = atStartOfDayUtc(new Date());
    const key = `${from}-${to}`;
    const base = BASE_RATES[key] ?? 1;
    const exchangeRates = [];
    for (let date = startDate; date <= today; date = addDays(date, 1)) {
        const daySeed = hash(`${key}-${formatIso(date)}`) % 7;
        const swing = (daySeed - 3) * 0.003;
        const value = Number((base + swing).toFixed(4));
        exchangeRates.push({
            date: formatIso(date),
            exchangeRate: value,
        });
    }
    return exchangeRates;
};
router.get('/exchangeRate/:from/:to', (req, res) => {
    const from = String(req.params.from || '').toUpperCase();
    const to = String(req.params.to || '').toUpperCase();
    const dateFromRaw = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
    if (!VALID_CODES.includes(from)) {
        return res.status(400).json({ error: 'Parametro from invalido' });
    }
    if (!VALID_CODES.includes(to)) {
        return res.status(400).json({ error: 'Parametro to invalido' });
    }
    if (!ALLOWED_COMBINATIONS[from][to]) {
        return res.status(400).json({ error: 'Combinacion de monedas no permitida' });
    }
    const parsedDateFrom = parseDateFrom(dateFromRaw);
    if (dateFromRaw && !parsedDateFrom) {
        return res.status(400).json({ error: 'dateFrom invalido, use formato YYYY-MM-DD' });
    }
    const today = atStartOfDayUtc(new Date());
    const defaultStart = addDays(today, -4);
    const startDate = parsedDateFrom ?? defaultStart;
    if (!isDateAllowed(startDate)) {
        return res.status(400).json({ error: 'dateFrom debe estar entre hoy y los 4 dias anteriores' });
    }
    return res.json({
        from,
        to,
        server: 'servidor propio',
        exchangeRates: buildRates(from, to, startDate),
    });
});
exports.default = router;
