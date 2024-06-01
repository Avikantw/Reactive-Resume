import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Strategy } from "passport-facebook";

import { UserService } from "@/server/user/user.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID, // Facebook App ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // Facebook App Secret
      callbackURL: process.env.FACEBOOK_CALLBACK_URL, // Callback URL after authentication
      scope: "email", // Request permissions
      profileFields: ["id", "emails", "name"], // Fields in user profile
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;
    const displayName = `${name.givenName} ${name.familyName}`;

    let user: User | null = null;

    if (!email) {
      throw new BadRequestException("Email not provided by Facebook");
    }

    try {
      user = await this.userService.findOneByIdentifier(email);

      if (!user) {
        user = await this.userService.create({
          email,
          name: displayName,
          provider: "facebook",
          emailVerified: true, // Assuming email verified by Facebook
        });
      }

      done(null, user);
    } catch {
      throw new BadRequestException("Failed to authenticate with Facebook");
    }
  }
}
