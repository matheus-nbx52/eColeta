import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn} from 'typeorm';
import { ColetaModel } from './ColetaModel'

@Entity('Transacao')
export class TransacaoModel {

    @PrimaryGeneratedColumn()
    id_transacao!: number;

    @OneToOne(() => ColetaModel)
    @JoinColumn({ name: 'fk_coleta' })
    coleta!: ColetaModel;

    @Column({ type: 'int' })
    total_pontos_morador!: number;

    @Column({ type: 'float' })
    valor_pago_coletor!: number;

    @CreateDateColumn()
    data_transacao!: Date;
}