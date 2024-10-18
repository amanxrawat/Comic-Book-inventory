import { Router } from "express";
import { createBook,deleteBookById,updateBook,getBookById,getAllBooks } from "../controllers/book.controller.js";


const router = Router();


// route for getting all the books
router.route('/getAllBooks').get(getAllBooks);

// route to create a new book 
router.route('/create').post(createBook);

// router to update a book
router.route('/update/:bookId').put(updateBook);

// route to get book by id in params
router.route('/getBookById/:bookId').get(getBookById)

// route to delete book using Id
router.route('/deleteBookById/:bookId').get(deleteBookById)

export default router;