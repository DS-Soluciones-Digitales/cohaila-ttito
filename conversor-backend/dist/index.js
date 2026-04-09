"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const exchangeRate_1 = __importDefault(require("./routes/exchangeRate"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 3001);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
app.use(exchangeRate_1.default);
app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});
