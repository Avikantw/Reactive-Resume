/* eslint-disable simple-import-sort/imports */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Profile, Strategy } from 'passport-facebook';  // Importing Profile here

import { UserService } from "@/server/user/user.service";
import { processUsername } from '@reactive-resume/utils';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService) {
    super({
      clientID, clientSecret, callbackURL,
      scope: "email",  // Request permissions
      profileFields: ["id", "emails", "name"],  // Specify the fields you need
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,  // Use the Profile interface here
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { emails, name, id } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const displayName = name ? `${name.givenName} ${name.familyName}` : 'Unknown Name';
    const username = processUsername(id || (email ? email.split("@")[0] : ''));

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
          emailVerified: true,  // Assuming email verified by Facebook
          username: username,
        });
      }

      done(null, user);
    } catch (error) {
      throw new BadRequestException("Failed to authenticate with Facebook");
    }
  }
}
