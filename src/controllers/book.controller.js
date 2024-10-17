import Book from "../models/book.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const createBook = asyncHandler(async(req,res)=>{
    try {
        // Input validation can be done here or using a middleware
        const { bookName, authorName, yearOfPublication, price, discount, numberOfPages, condition, description } = req.body;

        // Simple validation example
        if (!bookName || !authorName || !yearOfPublication || !price || !numberOfPages || !condition) {
            return next(new ApiError(400, 'All required fields must be provided'));
        }

        // Create the comic book using the service
        const comicBook = await createComicBook({
            bookName,
            authorName,
            yearOfPublication,
            price,
            discount,
            numberOfPages,
            condition,
            description
        });

        return res.status(200).json( new ApiResponse(200,comicBook,"new comic book created successfullly") )
        
    } catch (error) {
        console.log(error," error in creating new book")
        throw new ApiError(400,"Something went wrong while creating new book ")
    }

});


export {
    createBook
}