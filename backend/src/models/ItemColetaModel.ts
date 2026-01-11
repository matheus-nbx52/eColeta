import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ColetaModel } from './ColetaModel';
import { ResiduoModel } from './ResiduoModel';

@Entity('item_coleta')
export class ItemColetaModel {

    @PrimaryGeneratedColumn()
    id_item_coleta!: number;

    @ManyToOne(() => ResiduoModel)
    @JoinColumn({ name: 'fk_residuo' })
    residuo!: ResiduoModel;

    @ManyToOne(() => ColetaModel, coleta => coleta.itens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_coleta' })
    coleta!: ColetaModel;

    @Column({ type: 'float', nullable: true })
    quantidade_estimada!: number;

    @Column({ type: 'float', nullable: true })
    peso_real_kg!: number;

    @Column({ type: 'int', nullable: true })
    pontos_gerados!: number;

}