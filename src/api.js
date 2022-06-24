const router = require('express').Router();
const books = require('./fake_db');

let booksDirectory = books;

router.get('/books', function (req, res) {
  res.send(booksDirectory);
})

router.get('/books/:id', function (req, res) {
  const { id } = req.params;
  const book = booksDirectory.find(b => b.isbn === id);
  if (!book) return res.status(404).send('Book Not Found');
  res.send(book)
})

router.post('/books', function (req, res) {
  const {
    title,
    isbn,
    pageCount,
    thumbnailUrl,
    status,
    authors,
    categories
  } = req.body;

  const bookExist = booksDirectory.find(b => b.isbn === isbn);
  if (bookExist) return res.send("Book Already exist");
  const book = {
    title,
    isbn,
    pageCount,
    thumbnailUrl,
    status,
    authors,
    categories
  }

  booksDirectory.push(book);
  res.send(book);
})

router.put('/books/:id', function (req, res) {
  const { id } = req.params;
  const {
    title,
    isbn,
    pageCount,
    thumbnailUrl,
    status,
    authors,
    categories
  } = req.body;

  let book = booksDirectory.find(b => b.isbn === id);
  if (!book) return res.status(404).send('Book does not exist');

  const updatedField = (val, prev) => !val ? prev : val;

  const updatedBook = {
    ...book,
    title: updatedField(title, book.title),
    pageCount: updatedField(pageCount, book.pageCount),
    thumbnailUrl: updatedField(thumbnailUrl, book.thumbnailUrl),
    status: updatedField(status, book.status),
    authors: updatedField(authors, book.authors),
    categories: updatedField(categories, book.categories)
  }

  // Ignore this when using a Database. I Using it here because of fakeDb
  // find Book Index
  const bookIndex = booksDirectory.findIndex(b => b.isbn === book.isbn);
  booksDirectory.splice(bookIndex, 1, updatedBook);

  res.status(200).send(updatedBook);
})

router.delete('/books/:id', function (req, res) {
  const { id } = req.params;
  let book = booksDirectory.find(b => b.isbn === id)
  if (!book) return res.status(404).send('book not found');
  booksDirectory = booksDirectory.filter(b => b.isbn !== id)
  res.send('SuccessFully Deleted ')
})

module.exports = router;