import { AppDataSource } from "../config/database";
import { ResiduoModel } from "../models/ResiduoModel";

export class ResiduoService {
    private residuoRepository = AppDataSource.getRepository(ResiduoModel);

    async findAll() {
        return await this.residuoRepository.find();
    }
   
}