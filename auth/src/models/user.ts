import mongoose from "mongoose";
import bcrypt from "bcrypt"
// Interface that describes the properties that are required to create a new user
interface userAttrs { 
    email: String,
    password: String,
}
// Interface that describes all the properties that a user is going to have
interface userDoc extends mongoose.Document {
    email: String,
    password: String,
    createdAt: String,
    updatedAt: String,
}
// Interface that describes the properties that a user model has
interface userModel extends mongoose.Model<userDoc> {
    build(attrs: userAttrs): userDoc;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, { 
    timestamps: true, 
    toJSON:{ // This is the object that is going to be used to transform the response of the user every time we create a new user
        transform(doc, ret) { 
            ret.id = ret._id // We want to send the id to the user 
            delete ret._id 
            delete ret.password 
            delete ret.__v  
        }
    } 
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt  =  await bcrypt.genSalt(10);
    this.set('password', await bcrypt.hash(this.get('password'), salt));
    next();
})

// This function is to make sure that the user is created with the correct attributes
// because we need to verify the types and names of the attributes before creating the user
userSchema.statics.build = (attrs:userAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<userDoc, userModel>('User', userSchema);

export { User }