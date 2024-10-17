import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    yearOfPublication: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    numberOfPages: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: true
    },
    description: {
        type: String
    }
})

const Book = mongoose.model('Book', bookSchema);
export default Book;