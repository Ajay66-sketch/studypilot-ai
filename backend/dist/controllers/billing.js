"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBillingController = verifyBillingController;
const crypto_1 = __importDefault(require("crypto"));
const prisma_js_1 = require("../lib/prisma.js");
const env_js_1 = require("../config/env.js");
const zod_1 = require("zod");
const VerifyBillingSchema = zod_1.z.object({
    plan: zod_1.z.enum(['pro', 'premium']),
    razorpay_payment_id: zod_1.z.string().min(1),
    razorpay_order_id: zod_1.z.string().optional(),
    razorpay_signature: zod_1.z.string().optional(),
});
async function verifyBillingController(req, res, next) {
    try {
        const userId = req.user.userId;
        const { plan, razorpay_payment_id, razorpay_order_id, razorpay_signature } = VerifyBillingSchema.parse(req.body);
        const secret = env_js_1.env.RAZORPAY_KEY_SECRET;
        if (secret) {
            if (!razorpay_order_id || !razorpay_signature) {
                res.status(400).json({ error: 'Missing Razorpay signature details for verification' });
                return;
            }
            const hmac = crypto_1.default.createHmac('sha256', secret);
            hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
            const generated_signature = hmac.digest('hex');
            if (generated_signature !== razorpay_signature) {
                res.status(400).json({ error: 'Invalid Razorpay payment signature' });
                return;
            }
        }
        // Record subscription
        await prisma_js_1.prisma.subscription.create({
            data: {
                userId,
                plan,
                status: 'active',
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                razorpaySignature: razorpay_signature,
            },
        });
        // Update user plan
        const updatedUser = await prisma_js_1.prisma.user.update({
            where: { id: userId },
            data: { plan },
        });
        res.json({
            message: 'Plan upgraded successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                plan: updatedUser.plan,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=billing.js.map