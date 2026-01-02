import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";

@Entity("endereco")
export class EnderecoModel {

    @PrimaryGeneratedColumn({name:'id_endereco'})
    id_endereco!: number;

    @Column({length: 10, nullable: false})
    cep!: string;

    @Column({length: 255, nullable: false})
    rua!: string;

    @Column({length: 10, nullable: false})
    numero!: string;

    @Column({length: 100, nullable: false})
    bairro!: string;

    @Column({length: 100, nullable: false, default: 'Igarassu'})
    cidade!: string;

    @Column({type: 'char', length: 2, nullable: false, default: 'PE'})
    estado!: string;

   // @OneToOne(() => EnderecoModel, { cascade: true }) 
    //@JoinColumn({ name: "id_endereco_fk" }) // Cria a coluna id_endereco_fk na tabela morador
    //endereco: EnderecoModel;
}

