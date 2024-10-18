import Book from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createBook = asyncHandler(async (req, res) => {
    const { name, author, yearOfPublication, price, discount, numberOfPages, condition, description } = req.body;

    // Input validation
    if (!name || !author || !yearOfPublication || !price || !numberOfPages || !condition) {
        return res.status(400).json(new ApiResponse(400, null, 'All required fields must be provided'));
    }

    try {
        // Create a new comic book document directly in the controller
        const book = await Book.create({
            name,
            author,
            yearOfPublication,
            price,
            discount,
            numberOfPages,
            condition,
            description
        });

        // Save the comic book to the database
        await book.save();

        // Send a success response
        return res.status(201).json(new ApiResponse(201, book, 'New comic book created successfully'));
    } catch (error) {
        console.error('Error in creating new book:', error);
        // Handle any errors that occur during the creation process
        return res.status(500).json(new ApiResponse(500, null, 'Something went wrong while creating the new book'));
    }
});


const getAllBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort, authorName, yearOfPublication, minPrice, maxPrice, condition } = req.query;

    // Build the filter object
    let filter = {};
    if (authorName) filter.authorName = new RegExp(authorName, 'i'); // Case-insensitive search
    if (yearOfPublication) filter.yearOfPublication = yearOfPublication;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build the sort object
    let sortOption = {};
    if (sort) {
        const sortFields = sort.split(','); // Example: "price,-yearOfPublication"
        sortFields.forEach(field => {
            const sortOrder = field.startsWith('-') ? -1 : 1;
            const fieldName = field.replace('-', '');
            sortOption[fieldName] = sortOrder;
        });
    }

    // Pagination options
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch the books from the database
    const books = await Book.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize);

    // Get the total count for pagination
    const totalBooks = await Book.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalBooks / pageSize);

    // Send a success response with the paginated, filtered, and sorted list of books
    return res.status(200).json(new ApiResponse(200, {
        books,
        currentPage: pageNumber,
        totalPages,
        totalBooks
    }, 'Books fetched successfully'));
});


const getBookById = asyncHandler(async (req, res) => {

    const { bookId } = req.params;


    if (!bookId) {
        // Handle the case where the book ID is not provided
        return res.status(400).json(new ApiResponse(400, null, 'Book ID is not provided in the parameters'));
    }

    // Find the book by ID
    const book = await Book.findById(bookId);

    if (!book) {
        // Handle the case where the book is not found
        return res.status(404).json(new ApiResponse(404, null, 'Book not found'));
    }

    // Send a success response with the book details
    return res.status(200).json(new ApiResponse(200, book, 'Book details fetched successfully'));
});


const deleteBookById = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if (!bookId) {
        // Handle the case where the book ID is not provided
        return res.status(400).json(new ApiResponse(400, null, 'Book ID is not provided in the parameters'));
    }

    // Find the book by ID and delete it
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
        // Handle the case where the book is not found
        return res.status(404).json(new ApiResponse(404, null, 'Book not found'));
    }

    // Send a success response indicating that the book was deleted
    return res.status(200).json(new ApiResponse(200, deletedBook, 'Book deleted successfully'));
});

const updateBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params; 
    // console.log(bookId)
    if (!bookId) {
        // Handle the case where the book ID is not provided
        throw new ApiError(400,"Book ID is not provided in the parameters ");
    }

    const { name, author, yearOfPublication, price, discount, numberOfPages, condition, description } = req.body;

    // Validate if at least one field is provided for update
    if (!name && !author && !yearOfPublication && !price && !numberOfPages && !condition && !description) {
        throw new ApiError(400,"At least one field must be provided for update ");
    }

    // Update the book in the database
    const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
            name,
            author,
            yearOfPublication,
            price,
            discount,
            numberOfPages,
            condition,
            description
        },
        { new: true, runValidators: true } // Returns the updated book and runs validation
    );

    if (!updatedBook) {
        // Handle the case where the book is not found
        return res.status(404).json(new ApiResponse(404, null, 'Book not found'));
    }

    // Send a success response with the updated book details
    return res.status(200).json(new ApiResponse(200, updatedBook, 'Book updated successfully'));
});


export {
    createBook,
    getAllBooks,
    deleteBookById,
    updateBook,
    getBookById

}