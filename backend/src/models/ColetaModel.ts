import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MoradorModel } from "./MoradorModel";
import { EcoletorModel } from "./EcoletorModel";
import { AvaliacaoModel } from "./AvaliacaoModel";
import { TransacaoModel } from "./TransacaoModel";
import { ItemColetaModel } from "./ItemColetaModel";
import { CooperativaModel } from "./CooperativaModel";

export enum StatusColeta {
    PENDENTE = "Pendente",
    ACEITA = "Aceito",
    EM_CAMINHO = "A Caminho",
    ENTREGUE = "Entregue_Coop",
    VALIDADA = "Concluido",
    CANCELADA = "Cancelado"
}

@Entity("coleta")
export class ColetaModel {

    @PrimaryGeneratedColumn({ name: 'id_coleta' })
    id_coleta!: number;

    @ManyToOne(() => MoradorModel, morador => morador.coletas, { nullable: false })
    @JoinColumn({ name: 'fk_morador' })
    morador!: MoradorModel;

    @ManyToOne(() => CooperativaModel, cooperativa => cooperativa.coletas, { nullable: true })
    @JoinColumn({ name: 'fk_cooperativa' })
    cooperativa!: CooperativaModel | null;

    @ManyToOne(() => EcoletorModel, ecoletor => ecoletor.coletas_executadas, { nullable: true })
    @JoinColumn({ name: 'fk_ecoletor' })
    ecoletor!: EcoletorModel | null;

    @Column({
        type: 'enum',
        enum: StatusColeta,
        default: StatusColeta.PENDENTE
    })
    status_coleta!: StatusColeta;

    @Column({ type: 'timestamp', nullable: true })
    data_solicitacao!: Date;

    @Column({ type: 'timestamp', nullable: true })
    data_agendada!: Date;

    @Column({ length: 255, nullable: true })
    observacoes!: string;

    @Column({ type: 'float', nullable: true })
    peso_kg!: number | null;

    @Column({ type: 'int', nullable: true })
    pontos_gerados!: number | null;

    @Column({ type: 'timestamp', nullable: true })
    entregue_em!: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    validada_em!: Date | null;

    @OneToOne(() => AvaliacaoModel, avaliacao => avaliacao.coleta, { nullable: true })
    avaliacao!: AvaliacaoModel | null;

    @OneToOne(() => TransacaoModel, transacao => transacao.coleta, { nullable: true })
    transacao!: TransacaoModel | null;

    @OneToMany(() => ItemColetaModel, item => item.coleta, { cascade: true, eager: true })
    itens!: ItemColetaModel[];

    @CreateDateColumn({ type: 'timestamp' })
    criada_em!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    atualizada_em!: Date;

}