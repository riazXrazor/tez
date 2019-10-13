import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
export class BaseModal extends BaseEntity {
  /**
   * Unique Identifier
   */
  @PrimaryGeneratedColumn()
  public id!: number;

  /**
   * Date of creation
   */
  @Column("timestamp")
  public created_at!: Date;

  /**
   * Date of updated
   */
  @Column("timestamp")
  public updated_at!: Date;
}
