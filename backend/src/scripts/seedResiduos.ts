import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { ResiduoModel, ResiduoCategoria } from '../models/ResiduoModel';

async function seedResiduos() {
    try {
        await AppDataSource.initialize();
        console.log('Conectado ao banco de dados');

        const residuoRepository = AppDataSource.getRepository(ResiduoModel);

        const residuos = [
            {
                nome: 'Papel',
                tipo_categoria: ResiduoCategoria.COMUM,
                pontos_por_kg: 10,
                descricao: 'Papel e papelão recicláveis'
            },
            {
                nome: 'Plástico',
                tipo_categoria: ResiduoCategoria.COMUM,
                pontos_por_kg: 10,
                descricao: 'Materiais plásticos recicláveis'
            },
            {
                nome: 'Metal',
                tipo_categoria: ResiduoCategoria.COMUM,
                pontos_por_kg: 10,
                descricao: 'Metais e latas recicláveis'
            },
            {
                nome: 'Vidro',
                tipo_categoria: ResiduoCategoria.COMUM,
                pontos_por_kg: 10,
                descricao: 'Vidros transparentes e coloridos'
            },
            {
                nome: 'Eletrônicos',
                tipo_categoria: ResiduoCategoria.ESPECIAL,
                pontos_por_kg: 15,
                descricao: 'Equipamentos eletrônicos e eletrodomésticos'
            },
            {
                nome: 'Óleo',
                tipo_categoria: ResiduoCategoria.ESPECIAL,
                pontos_por_kg: 20,
                descricao: 'Óleo de cozinha usado'
            }
        ];

        for (const residuoData of residuos) {
            const existe = await residuoRepository.findOne({
                where: { nome: residuoData.nome }
            });

            if (!existe) {
                const residuo = residuoRepository.create(residuoData);
                await residuoRepository.save(residuo);
                console.log(`✅ Resíduo "${residuoData.nome}" inserido com sucesso!`);
            } else {
                console.log(`⚠️  Resíduo "${residuoData.nome}" já existe, pulando...`);
            }
        }

        console.log('\n✅ Seed de resíduos concluído!');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Erro ao inserir resíduos:', error);
        await AppDataSource.destroy();
        process.exit(1);
    }
}

seedResiduos();
