const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {
    versionKey:false,
    timestamps: true,
    }
)

userSchema.statics.encriptar = async function(password){
    const hash = await bcrypt.hash(password, 10)
    return hash
}

userSchema.statics.comparar = function(plainPassword, password){
    const valido = bcrypt.compare(plainPassword, password)
    return valido
}

module.exports = model("User", userSchema)