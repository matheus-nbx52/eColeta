import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";

export enum ResiduoCategoria {
    COMUM = 'Comum',
    ESPECIAL = 'Especial'
}

@Entity("residuo")
export class ResiduoModel {

    @PrimaryGeneratedColumn({name:'id_residuo'})
    id_residuo!: number;

    @Column({length: 50, unique: true, nullable: false})
    nome!: string;

    @Column({type: 'enum',
             enum: ResiduoCategoria, 
             nullable: false,
             name: 'tipo_categoria'})
    tipo_categoria!: ResiduoCategoria;

    @Column({type: 'int', nullable: false, default: '1'})
    pontos_por_kg!: number;

    @Column({type: 'text', nullable: true})
    descricao!: string;

}
