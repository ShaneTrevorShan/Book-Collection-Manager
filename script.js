const defaultBooks = [
  {
    title: 'One Piece',
    author: 'Eiichiro Oda',
    genre: 'Action, Adventure',
    available: true,
    rating: 5,
    photo: 'books/One Piece.png',
  },
  {
    title: 'War of the Ancients Trilogy',
    author: 'Richard A. Knaak',
    genre: 'Fantasy',
    available: true,
    rating: 5,
    photo: 'books/Warcraft.png',
  },
  {
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C. S. Lewis',
    genre: 'Fantasy',
    available: false,
    rating: 4,
    photo: 'books/Narnia.png',
  },
];

function loadBooks() {
  const saved = localStorage.getItem('books');
  if (saved !== null) {
    return JSON.parse(saved);
  }
  return defaultBooks;
}

const books = loadBooks();

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

if (localStorage.getItem('books') === null) {
  saveBooks();
}

const bookForm = document.getElementById('book-form');
const addDialog = document.getElementById('add-dialog');
const addMessage = document.getElementById('add-message');
const bookList = document.getElementById('book-list');

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const genre = document.getElementById('book-genre').value.trim();
  const available =
    document.getElementById('book-availability').value === 'yes';

  if (!title || !author || !genre) {
    addMessage.textContent = 'Please fill in all the boxes.';
    addDialog.showModal();
    return;
  }

  const photoFile = document.getElementById('book-photo').files[0];

  function addBook(photoData) {
    books.push({
      title,
      author,
      genre,
      available,
      rating: 0,
      photo: photoData,
    });
    saveBooks();
    showBooks();

    addMessage.textContent = `${title} by ${author} has been added!`;
    addDialog.showModal();
    bookForm.reset();
  }

  if (photoFile) {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      addBook(reader.result);
    });
    reader.readAsDataURL(photoFile);
  } else {
    addBook('');
  }
});

function showBooks() {
  bookList.innerHTML = '';

  /* show available only
  const availableBooks = books.filter(function (books) {
    return book.available === true;
  }); */

  if (books.length === 0) {
    bookList.textContent = 'No books added. Add One!';
    return;
  }

  for (let i = 0; i < books.length; i++) {
    const book = books[i]; /* change to const book = availableBooks[i]; */
    const card = document.createElement('div');
    card.className = 'book-card';

    if (book.photo) {
      const photo = document.createElement('img');
      photo.className = 'book-photo';
      photo.src = book.photo;
      photo.alt = `Cover of ${book.title}`;
      card.appendChild(photo);
    }

    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'book-author';
    author.textContent = `by ${book.author}`;

    const genre = document.createElement('p');
    genre.className = 'book-genre';
    genre.textContent = book.genre;

    const availability = document.createElement('p');
    availability.className = book.available
      ? 'book-availability available'
      : 'book-availability unavailable';
    availability.textContent = book.available ? 'Available' : 'Not Available';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function () {
      if (confirm(`Remove "${book.title}"?`)) {
        /* add this for showing available books only*/
        /* const originalIndex = books.indexOf(books);

        if (originalIndex !== -1) { */
        books.splice(i, 1); /*change to (originalIndex, 1)*/
        saveBooks();
        showBooks();
      }
    });

    //create container for stars and button
    const actions = document.createElement('div');
    actions.className = 'book-actions';

    //create star container
    const starRating = document.createElement('div');
    starRating.className = 'star-rating';

    //store the rating for each book
    if (book.rating === undefined) {
      book.rating = 0;
    }

    //create 5 clickable stars
    for (let star = 1; star <= 5; star++) {
      const starButton = document.createElement('button');
      starButton.type = 'button';
      starButton.textContent = star <= book.rating ? '★' : '☆';
      starButton.className = star <= book.rating ? 'active' : '';
      starButton.setAttribute('aria-label', `Rate ${star} stars`);

      starButton.addEventListener('click', function () {
        book.rating = star;
        saveBooks();
        showBooks();
      });

      starRating.appendChild(starButton);
    }

    actions.appendChild(removeButton);
    actions.appendChild(starRating);

    const info = document.createElement('div');
    info.className = 'book-info';
    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(genre);
    info.appendChild(availability);

    bookList.appendChild(card);
    card.appendChild(info);
    card.appendChild(actions);
  }
}

document.getElementById('close-dialog').addEventListener('click', function () {
  addDialog.close();
});

showBooks();
