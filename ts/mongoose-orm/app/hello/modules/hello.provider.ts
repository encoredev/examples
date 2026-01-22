import { CatModel, ICat } from "../entities/cat.entity";


class  Hello {
    private CatModel: typeof  CatModel
    constructor(){
        this.CatModel = CatModel
    }

    /**
     * @param payload {name: string}
     * @returns  Success Message with true and false with new Entry
     */
    async createNewEntity(payload:{name:string}){
        try {
            const newEntity =  await this.CatModel.create(payload)
              return {Success:true, message:"Success", data:newEntity}
        } catch (error) {
            console.log(error)   
        }
    }


    /**
     * 
     * @returns  List of Data  
     */
    async getEntityList():Promise<{Success:boolean, message:string, data?:ICat[]}>{
        try {
            const entityList = await this.CatModel.find()
            return {Success:true, message:"Success", data:entityList}
            
        } catch (error) {
            console.log(error) 
            return {Success:false, message:"Failed"} 
        }
    }


}

export const helloProvider = new Hello()