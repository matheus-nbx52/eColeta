import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { CooperativaModel } from "./CooperativaModel";
import { ResiduoModel } from "./ResiduoModel";
import { ColetaModel } from "./ColetaModel";

export type StatusAprovacao = 'Pendente' | 'Aprovado' | 'Invativo';

@Entity("ecoletor")
export class EcoletorModel {

    @PrimaryGeneratedColumn({ name: 'id_ecoletor' })
    id_ecoletor!: number;

    @ManyToOne(() => CooperativaModel, cooperativa => cooperativa.coletores, { nullable: false })
    @JoinColumn({ name: 'fk_cooperativa' })
    cooperativa!: CooperativaModel;

    @Column({ length: 100, nullable: false })
    nome!: string;

    @Column({ length: 14, unique: true, nullable: false })
    cpf!: string;

    @Column({ length: 255, nullable: false })
    senha!: string;

    @Column({ type: 'float', default: 0.00, name: 'saldo_ecoletor'})
    saldo_ecoletor!: number;

    @Column({ type: 'varchar', length: 50, nullable: false})
    veiculo_tipo!: string;

    @Column({ type: 'boolean', default: false})
    disponivel!: boolean;

    @Column({ type: 'enum', 
              enum: ['Pendente', 'Aprovado', 'Inativo'], 
              default: 'Pendente',
              name: 'status_aprovacao'})
    status_aprovacao!: StatusAprovacao;

    @Column({ type: 'float', nullable:true, name: 'latitude'})
    latitude!: number;
    
    @Column({ type: 'float', nullable:true, name: 'longitude'})
    longitude!: number;

    @ManyToMany(() => ResiduoModel)
    @JoinTable({
        name: 'ecoletor_residuo',
        joinColumn: {
            name: 'fk_ecoletor',
            referencedColumnName: 'id_ecoletor'
        },
        inverseJoinColumn: {
            name: 'fk_residuo',
            referencedColumnName: 'id_residuo'
        }
    })
    residuos_habilitados!: ResiduoModel[];

    @OneToMany(() => ColetaModel, (coleta) => coleta.ecoletor)
    coletas_executadas!: ColetaModel[];
}