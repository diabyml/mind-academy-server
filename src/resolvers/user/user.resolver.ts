import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../../entities/User.entity";
import { ErrorType } from "../error.type";
import { LoginInput, RegisterInput, UserResponse } from "./user.input";
import { UserRepository } from "./user.repository";
import { validateEmail } from "../../utils/validateEmail";
import argon2 from "argon2";
import MyContext from "../../utils/MyContext";
import { COOKIE_NAME } from "../../constants";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    const userId = req.session.userId;

    if (!userId) {
      return null;
    }

    // repo
    const repo = UserRepository;

    return repo.findOne({ where: { id: userId } });
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req }: MyContext,
    @Arg("data") newUserData: RegisterInput
  ): Promise<UserResponse> {
    // validate inputs
    const errors: ErrorType[] = [];

    // Check for empty fields
    if (!newUserData.username)
      errors.push({ field: "username", message: "Nom utilisateur vide" });

    if (!newUserData.email)
      errors.push({ field: "email", message: "Email est vide" });

    if (!newUserData.password)
      errors.push({ field: "password", message: "Mot de password est vide" });

    // password length must be more or equal to 6
    if (newUserData.password.length < 6) {
      errors.push({ field: "password", message: "Mot de pass trop court" });
    }

    // check if email is a valid email address
    if (!validateEmail(newUserData.email)) {
      errors.push({ field: "email", message: "Email invalid" });
    }

    // get the repo for db operations
    const repo = UserRepository;

    // check if username already exists in db
    const userExists = await repo.findOne({
      where: { username: newUserData.username },
    });

    // console.log("userExists:", userExists);

    if (userExists) {
      errors.push({
        field: "username",
        message: "Nom utitlisateur existe deja",
      });
    }

    // if any error occured return errors
    if (errors.length) {
      return {
        errors,
      };
    }

    // hash user pwd
    const hashedPassword = await argon2.hash(newUserData.password);

    // save user to db
    const userObject = repo.create({
      username: newUserData.username,
      email: newUserData.email,
      passwordHash: hashedPassword,
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      mobile: newUserData.mobile,
    });

    const user = await repo.save(userObject);

    // set user cookie with userId
    req.session.userId = user.id;

    return {
      data: user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("data") { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const repo = UserRepository;
    // validate inputs
    const errors: ErrorType[] = [];

    // is user loging in with email or username
    let isEmailAddres = true;

    if (!usernameOrEmail) {
      errors.push({
        field: "usernameOrEmail",
        message: "Nom utilisateur ou Email vide",
      });
    }

    if (!password) {
      errors.push({
        field: "password",
        message: "Mot de pass vide",
      });
    }

    if (password.length < 6) {
      errors.push({ field: "password", message: "Mot de pass trop court" });
    }

    //check if usernameOrEnmail is a valid email if not its a username
    if (!validateEmail(usernameOrEmail)) {
      isEmailAddres = false;
    }

    // check if user exists in db based on email or username
    const user = await repo.findByUsernameOrEmail(
      usernameOrEmail,
      isEmailAddres
    );

    if (!user) {
      errors.push({
        field: "usernameOrEmail",
        message: "Nom utilisateur ou Email n'existe pas",
      });
    }

    console.log("user:", user);

    if (user) {
      // check user pwd hashed with hashed pwd in db
      const matchedPassword = await argon2.verify(
        user.passwordHash as string,
        password
      );

      // // pwds does not match
      if (!matchedPassword) {
        errors.push({
          field: "password",
          message: "Mot de pass incorrecte",
        });
        console.log("pwd does not match");
      }

      // pwds match login user
      // set user cookie
      req.session.userId = user.id;
    }

    // check if any erros occured return them

    if (errors.length) {
      return {
        errors,
      };
    }

    // return user
    return {
      data: user as User,
    };
  }
}
