import mongosse, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongosse.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n mongoDB  connected !!  db host : ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("mongoDb connection Failed " ,error);
        process.exit(1);
    }
}
export default connectDB