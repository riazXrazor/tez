import { Column, Entity } from "typeorm";
import { BaseModal } from "./base";

@Entity("users")
export class User extends BaseModal {
  @Column("text")
  public email!: string;

  @Column("text")
  public first_name!: string;

  @Column("text")
  public last_name!: string;
}
