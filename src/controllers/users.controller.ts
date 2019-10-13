import { Controller } from "#controllers/controller.controller";
import { User } from "#models/user";
import { NotFoundError } from "#utils";
import {Body, Get, Post, Query, Route, Security, SuccessResponse, Tags  } from "tsoa";

export interface IMeta {
  message: string;
  status: number;
}
export interface IError {
  field: string;
  message: string;
}
export interface IGetUsers {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
export interface IGetNewUsers {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ICreateUser {
  name: string;
  email: string;
}
@Route("users")
export class UsersController extends Controller  {
  @Get("/")
  @Tags("Users")
  public async GetUsers(): Promise<IGetUsers[]> {
    const users = await User.find({});
    return this.response(users);
  }
  @Get("/new")
  @Tags("Users")
  public async GetNewUsers(@Query() id: number): Promise<IGetNewUsers> {
    this.fastify.log.info("ok");
    this.fastify.log.info(id);
    const user = await User.findOne(id);
    if (!user) {
      this.setStatus(404);
      throw new NotFoundError(`no user found with id ${id}`);
    }
    user.id = this.fastify.jwt.sign({ id: user.id });
    this.fastify.log.warn(user);
    return this.response(user);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post("/create")
  @Security("api_key")
  public async createUser(@Body() requestBody: ICreateUser): Promise<ICreateUser> {
      this.setStatus(201);
      return this.response(requestBody);
  }
}
