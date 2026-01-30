import mongoose from "mongoose";

const IPAddressSchema =new mongoose.Schema(
    {
     ip:{
        type:String,
        require:true,
        unique:true
     }
    },
    { timestamps: true }
)
export default mongoose.model("IpAddress", IPAddressSchema);