import passport from 'passport';
import GoogleAuth from 'passport-google-oauth20';

import User from './models/User';

passport.use(
    new GoogleAuth.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID!!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
        callbackURL: "/api/v1/auth/google/callback",
        passReqToCallback: true
    },
        async function (req, accessToken, refreshToken, profile, cb) {
            let user = await User.findOne({ googleId: profile.id });

            if (user === null) {
                user = await User.create({ googleId: profile.id, email: profile._json.email, displayName: profile.displayName });
            }

            return cb(undefined, user);
        }
    ));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

