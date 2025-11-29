import {DataSource} from 'typeorm'
import dotenv from 'dotenv'
import path = require('path')
import { EnderecoModel } from '../models/EnderecoModel'
import { MoradorModel } from '../models/MoradorModel'
import { ResiduoModel } from '../models/ResiduoModel'


dotenv.config({path: path.resolve(__dirname, '../../../.env') })

const AppDataSource = new DataSource ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [EnderecoModel, MoradorModel, ResiduoModel], 
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