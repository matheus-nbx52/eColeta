import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ColetaModel } from './ColetaModel';
import { ResiduoModel } from './ResiduoModel';

@Entity('ItensColeta')
export class ItensColetaModel {

    @PrimaryGeneratedColumn()
    id_ItensColeta!: number;

    @ManyToOne(() => ResiduoModel)
    @JoinColumn({ name: 'fk_residuo' })
    residuo!: ResiduoModel;

    @OneToOne(() => ColetaModel)
    @JoinColumn({ name: 'fk_coleta' })
    coleta!: ColetaModel;

    @Column({ type: 'float', nullable: true })
    quantidade_estimada!: number; // O que o morador "acha" que tem (ex: 2 sacolas)

    @Column({ type: 'float', nullable: true })
    peso_real_kg!: number; // O que a COOPERATIVA pesou (ex: 2.5kg)

    @Column({ type: 'int', nullable: true })
    pontos_gerados!: number; // Calculado: peso_real * residuo.pontos_por_kg

}