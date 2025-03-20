import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, { timestamps: true });

// Attach the pagination plugin
productSchema.plugin(mongoosePaginate);

productSchema.pre('save', async function (next) {
    if (!this.isModified('name')) return next();
    this.name = this.name.toLowerCase();
    next();
})

export const Product = mongoose.model('Product', productSchema)


