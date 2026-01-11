import 'reflect-metadata';
import { AppDataSource } from '../config/database';

async function dropTables() {
    try {
        await AppDataSource.initialize();
        console.log('Conectado ao banco de dados');

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        // Lista de tabelas na ordem correta (respeitando foreign keys)
        // Ordem: primeiro as tabelas que dependem de outras, depois as independentes
        const tabelas = [
            'transacao',
            'avaliacao',
            'item_coleta',
            'coleta',
            'ecoletor_residuo', // Tabela de relacionamento many-to-many
            'ecoletor',
            'cooperativa',
            'morador',
            'residuo',
            'endereco'
        ];

        console.log('\n⚠️  ATENÇÃO: Este script irá DROPAR todas as tabelas!');
        console.log('Tabelas que serão removidas:');
        tabelas.forEach((tabela, index) => {
            console.log(`  ${index + 1}. ${tabela}`);
        });

        // Desabilitar verificação de foreign keys temporariamente (PostgreSQL)
        await queryRunner.query('SET session_replication_role = replica;');

        console.log('\n🗑️  Iniciando drop das tabelas...\n');

        for (const tabela of tabelas) {
            try {
                await queryRunner.query(`DROP TABLE IF EXISTS ${tabela} CASCADE;`);
                console.log(`✅ Tabela "${tabela}" removida com sucesso!`);
            } catch (error: any) {
                console.log(`⚠️  Erro ao remover tabela "${tabela}": ${error.message}`);
            }
        }

        // Reabilitar verificação de foreign keys
        await queryRunner.query('SET session_replication_role = DEFAULT;');

        console.log('\n✅ Drop de tabelas concluído!');
        console.log('💡 Dica: Execute o servidor novamente para recriar as tabelas (synchronize: true)');
        
        await queryRunner.release();
        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Erro ao dropar tabelas:', error);
        await AppDataSource.destroy();
        process.exit(1);
    }
}

// Função para dropar apenas uma tabela específica
async function dropTableEspecifica(nomeTabela: string) {
    try {
        await AppDataSource.initialize();
        console.log('Conectado ao banco de dados');

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.query(`DROP TABLE IF EXISTS ${nomeTabela} CASCADE;`);
        console.log(`✅ Tabela "${nomeTabela}" removida com sucesso!`);

        await queryRunner.release();
        await AppDataSource.destroy();
    } catch (error) {
        console.error(`❌ Erro ao remover tabela "${nomeTabela}":`, error);
        await AppDataSource.destroy();
        process.exit(1);
    }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === '--table' && args[1]) {
    // Dropar tabela específica
    dropTableEspecifica(args[1]);
} else {
    // Dropar todas as tabelas
    dropTables();
}
