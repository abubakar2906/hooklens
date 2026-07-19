import { ClerkExpressRequireAuth, StrictAuthProp } from '@clerk/clerk-sdk-node';
import { RequestHandler } from 'express';

// StrictAuthProp adds `req.auth.userId` and other Clerk properties securely.
export const requireAuth = ClerkExpressRequireAuth({
    // If testing locally without HTTPS or full domain setups, you might need to relax some checks,
    // but default options usually work fine if NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are set.
}) as unknown as RequestHandler;

declare global {
    namespace Express {
        interface Request extends StrictAuthProp {}
    }
}
