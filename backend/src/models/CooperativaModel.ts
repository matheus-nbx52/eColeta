import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { EnderecoModel } from "./EnderecoModel";
import { EcoletorModel } from "./EcoletorModel";
import { ColetaModel } from "./ColetaModel";

@Entity("cooperativa")
export class CooperativaModel {

    @PrimaryGeneratedColumn({ name: 'id_cooperativa' })
    id_cooperativa!: number;

    @OneToOne(() => EnderecoModel)
    @JoinColumn({ name: 'fk_endereco' })
    endereco!: EnderecoModel;

    @Column({ length: 100, nullable: false })
    nome!: string;

    @Column({ length: 18, unique: true, nullable: false })
    cnpj!: string;

    @Column({ length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ length: 255, nullable: false })
    senha!: string;

    @Column({ length: 15, nullable: false })
    telefone!: string;
    
    @OneToMany(() => EcoletorModel, (ecoletor) => ecoletor.cooperativa)
    coletores!: EcoletorModel[];

    @OneToMany(() => ColetaModel, coleta => coleta.cooperativa)
    coletas!: ColetaModel[];
}