import {DataSource} from 'typeorm'
import dotenv from 'dotenv'
import path = require('path')
import { EnderecoModel } from '../models/EnderecoModel'
import { MoradorModel } from '../models/MoradorModel'
import { ResiduoModel } from '../models/ResiduoModel'
import { CooperativaModel } from '../models/CooperativaModel'
import { EcoletorModel } from '../models/EcoletorModel'
import { ColetaModel } from '../models/ColetaModel'
import { AvaliacaoModel } from '../models/AvaliacaoModel'


dotenv.config({path: path.resolve(__dirname, '../../../.env') })

const AppDataSource = new DataSource ({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [EnderecoModel, MoradorModel, ResiduoModel, CooperativaModel, EcoletorModel, ColetaModel, AvaliacaoModel], 
    synchronize: true,
    logging: false,
})  

export async function initializeDatabase(): Promise <DataSource> {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize()
        console.log('Database connected successfully');
        
    }
    return AppDataSource
}