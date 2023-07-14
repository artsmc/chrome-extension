import MagicLoginStrategy from "passport-magic-login"
// @ts-ignore
import passport from "passport";
import Mailgun = require('mailgun-js');
import { userCreateController } from "./user/user.create.controller";
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });
// IMPORTANT: ALL OPTIONS ARE REQUIRED!

export const magicLogin = new MagicLoginStrategy({
  // Used to encrypt the authentication token. Needs to be long, unique and (duh) secret.
  secret: process.env.MAGIC_LINK_SECRET,
  // The authentication callback URL
  callbackUrl: "/signup",

  // Called with th e generated magic link so you can send it to the user
  // "destination" is what you POST-ed from the client
  // "href" is your confirmUrl with the confirmation token,
  // for example "/auth/magiclogin/confirm?token=<longtoken>"
  sendMagicLink: async (destination, href) => {
    const data = {
        from: 'Melville Admin <admin@melville.app>',
        to: `${destination}`,
        template: 'PodTitle-MagicLink',
        'o:tracking-opens': 'yes',
        'o:tag': ['PodTitle-MagicLink'],
        'h:X-Mailgun-Variables': JSON.stringify({
          ...{
            siteUrl: process.env.API_HOST, ...{
              email: destination,
              authLink: `${process.env.URL}${href}`
            }
          }
        }),
      };
      mailgun.messages().send(data, (error, body) => {
        if (error) {
          console.log(error);
        }
      });
  },
  // Once the user clicks on the magic link and verifies their login attempt,
  // you have to match their email to a user record in the database.
  // If it doesn't exist yet they are trying to sign up so you have to create a new one.
  // "payload" contains { "destination": "email" }
  // In standard passport fashion, call callback with the error as the first argument (if there was one)
  // and the user data as the second argument!
  verify: (payload, callback) => {
    // Get or create a user with the provided email from the database
    userCreateController.findOrCreate({email:payload.destination})
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        console.log({verifyingError: err})
        callback(err)
      })
  },
  jwtOptions: {
    expiresIn: "2 days",
  }
});

// Add the passport-magic-login strategy to Passport
passport.use(magicLogin);