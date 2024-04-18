const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    /*{
        "name": string,
        "year": number,
        "author": string,
        "summary": string,
        "publisher": string,
        "pageCount": number,
        "readPage": number,
        "reading": boolean
    }*/
    const {
        name,
        year = 0,
        author = "",
        summary = "",
        publisher = "",
        pageCount = -1,
        readPage = 0,
        reading = false,
    } = request.payload;

    if (!name) {
        return h
            .response({
                status: "fail",
                message: "Gagal menambahkan buku. Mohon isi nama buku",
            })
            .code(400);
    }
    if (pageCount < readPage) {
        return h
            .response({
                status: "fail",
                message:
                    "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
            })
            .code(400);
    }

    const id = nanoid(16);
    let todayDate = new Date().toISOString();

    let newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: readPage === pageCount,
        reading,
        insertedAt: todayDate,
        updatedAt: todayDate,
    };

    books.push(newBook);

    return h
        .response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        })
        .code(201);
};

const getAllBookHandler = (request, h) => {
    const { name = false, reading = -1, finished = -1 } = request.query;

    let localBooks = books;

    if (name) {
        localBooks = localBooks.filter(
            (item) => item.name.toLowerCase() == name.toLowerCase()
        );
    }

    if (reading == 1) {
        localBooks = localBooks.filter((item) => item.reading === true);
    } else if (reading == 0) {
        localBooks = localBooks.filter((item) => item.reading === false);
    }

    if (finished == 1) {
        localBooks = localBooks.filter((item) => item.finished === true);
    } else if (finished == 0) {
        localBooks = localBooks.filter((item) => item.finished === false);
    }

    if (books.length > 0) {
        return h.response({
            status: "success",
            data: {
                books: localBooks.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher,
                    };
                }),
            },
        });
    } else {
        return h.response({
            status: "success",
            data: {
                books: [],
            },
        });
    }
};

const getBookById = (request, h) => {
    const { bookId } = request.params;
    let resultBook = books.filter((item) => item.id === bookId);

    if (resultBook.length > 0) {
        return h.response({
            status: "success",
            data: {
                book: resultBook[0],
            },
        });
    }

    return h
        .response({
            status: "fail",
            message: "Buku tidak ditemukan",
        })
        .code(404);
};

const editBookById = (request, h) => {
    /*{
    "name": string,
    "year": number,
    "author": string,
    "summary": string,
    "publisher": string,
    "pageCount": number,
    "readPage": number,
    "reading": boolean
}  */

    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return h
            .response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku",
            })
            .code(400);
    }

    if (pageCount < readPage) {
        return h
            .response({
                status: "fail",
                message:
                    "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            })
            .code(400);
    }

    let bookItemIdx = books.findIndex((item) => item.id === bookId);

    if (bookItemIdx < 0) {
        return h
            .response({
                status: "fail",
                message: "Gagal memperbarui buku. Id tidak ditemukan",
            })
            .code(404);
    }

    books[bookItemIdx] = {
        ...books[bookItemIdx],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
    };

    return h
        .response({
            status: "success",
            message: "Buku berhasil diperbarui",
        })
        .code(200);
};

const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    let bookItemIdx = books.findIndex((item) => item.id === bookId);

    if (bookItemIdx < 0) {
        return h
            .response({
                status: "fail",
                message: "Buku gagal dihapus. Id tidak ditemukan",
            })
            .code(404);
    }

    books.splice(bookItemIdx, 1);
    return h
        .response({
            status: "success",
            message: "Buku berhasil dihapus",
        })
        .code(200);
};

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookById,
    editBookById,
    deleteBookById,
};
