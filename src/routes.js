const handler = require("./handlers");

const routes = [
    {
        method: "POST",
        path: "/books",
        handler: handler.addBookHandler,
    },
    {
        method: "GET",
        path: "/books",
        handler: handler.getAllBookHandler,
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: handler.getBookById,
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: handler.editBookById,
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: handler.deleteBookById,
    },
];

module.exports = routes;
