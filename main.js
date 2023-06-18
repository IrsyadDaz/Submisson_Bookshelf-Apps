const STORAGE_KEY = "STORAGE_KEY";

function storageCheck(){
  if(typeof(Storage) === undefined){
      alert("Browser anda tidak mendukung local storage");
      return false
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event){
    event.preventDefault();
    renderBook();
  });
});

function renderBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const idBook = document.getElementById("inputBookTitle").name;

  if (idBook !== "") {
    const bookData = getBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idBook) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
    resetAllForm();
    showBookList(bookData);
    return;
  }

  const id = +new Date()
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  putBookList(newBook);

  const bookData = getBookList();
  showBookList(bookData);
};

function resetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

function putBookList(data) {
  if (storageCheck()) {
    let bookData = [];

    if (localStorage.getItem(STORAGE_KEY) !== null) {
      bookData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    bookData.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
  }
}

function showBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
  const completeBookshelf = document.getElementById("completeBookshelfList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    let containerAction = document.createElement("div");
    containerAction.classList.add("action");

    const completeButton = createCompleteButton(book, function (event) {
      bookCompleteHandler(event.target.parentElement.parentElement);

      const bookData = getBookList();
      resetAllForm();
      showBookList(bookData);
    });

    const deleteButton = createDeleteButton(function (event) {
      deleteItem(event.target.parentElement.parentElement);

      const bookData = getBookList();
      resetAllForm();
      showBookList(bookData);
    });

    containerAction.append(completeButton, deleteButton);

    bookItem.append(containerAction);

    if (isComplete === false) {
      incompleteBookshelf.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        updateItem(event.target.parentElement);
      });

      continue;
    }

    completeBookshelf.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      updateItem(event.target.parentElement);
    });
  }
}

const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
    check = true;
    
    document.querySelector('span').innerText = 'Selesai dibaca';
  }else {
    check = false;

    document.querySelector('span').innerText = 'Belum selesai dibaca';
  }
});

function createCompleteButton(book, eventListener) {
  const bookCompleted = book.isComplete ? "Belum selesai" : "Selesai";

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerText = bookCompleted + " di Baca";
  completeButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return completeButton;
}

function createDeleteButton(eventListener) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return deleteButton;
}

function bookCompleteHandler(itemElement) {
  const bookData = getBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}

function searchBookList(title) {
  const bookData = getBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function completeButtonHandler(parentElement) {
  let book = bookCompleteHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function getBookList() {
  if (storageCheck) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  return [];
}

function deleteItem(itemElement) {
  const bookData = getBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }
  alert("Buku akan dihapus");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}

function updateItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = getBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = getBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    showBookList(bookData);
    return;
  }
  const bookList = searchBookList(title);
  showBookList(bookList);
});

window.addEventListener("load", function () {
  if (storageCheck) {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      const bookData = getBookList();
      showBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
