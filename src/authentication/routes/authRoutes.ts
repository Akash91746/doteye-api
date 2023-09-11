import { Router } from "express";

import * as authController from '../controller/authController';
import passport from "passport";

const router = Router();

router.get("/login/success", authController.getCurrentLoggedInUser);

router.get("/login/google",
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback",
    passport.authenticate('google',
        {
            failureRedirect: '/api/v1/auth/google/failure',
            successRedirect: process.env.CLIENT_URL,
        }
    ),
);

router.get('/google/failure', authController.handleGoogleAuthFailure);

router.get("/logout", (req, res) => {
    req.logout((err) => { console.log("Auth error ", err); });
    res.redirect(process.env.CLIENT_URL!!);
});

export default router;