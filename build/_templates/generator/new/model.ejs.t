---
to: ./../src/models/<%= name %>.ts
unless_exists: true
---
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseModal } from "./base";

@Entity("users")
export class <%= h.inflection.camelize(name) %> extends BaseModal {
    
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

}
