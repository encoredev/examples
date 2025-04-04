
import mongoose, { Document } from "mongoose"
import { EntitiesName } from "./entities"

export interface ICat  extends Document {
 name:string
 _id:mongoose.Schema.Types.ObjectId
}


const CatSchema = new mongoose.Schema<ICat>({
    name:{
        type:String
    }
},{
    timestamps:true,
    collection:EntitiesName.cat.collectionName
})  

export const CatModel = mongoose.model<ICat>(EntitiesName.cat.tableName,CatSchema )