// Book Class: Represents a book

class Book {
    constructor(title, author, isbn) {
        this.title = title; 
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI tasks. Includes Dom manipulation.

    class UI {
        static displayBooks() {
           const books = Store.getBooks(); // Above is an array and we set "books" to that array

           // loop through stored books and then use a method; addBookToList. 
           books.forEach((book) => UI.addBookToList(book));
        }

        static addBookToList(book) { // Here we want to grab the element on the DOM to create a row, to put in the <tbody>
            const list = document.querySelector("#book-list");

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
            
            list.appendChild(row);

        }

        static deleteBook(el){
            if(el.classList.contains("delete")) {
                el.parentElement.parentElement.remove();
            }
        }

        static showAlert(message, className){
            const div = document.createElement("div");
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector(".container");
            const form = document.querySelector("#book-form");
            container.insertBefore(div, form);

            // Make msgs dissapear
            setTimeout(() => document.querySelector(".alert").remove(), 2000);
        }

        static clearFields () {
            document.querySelector("#title").value = "";
            document.querySelector("#author").value = "";
            document.querySelector("#isbn").value = "";

        }

    }

// Store Class: Handles local storage // LOCAL STORAGE O.O
class Store {
    static getBooks() {
    let books; 
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books")); // with this code the array will be displayed as a string so we use Json.parse to get it as an array of objects
        }

        return books; // then return whatever is in books
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
    
        books.forEach((book, index) => {
          if(book.isbn === isbn) {
            books.splice(index, 1);
          }
    });
    localStorage.setItem("books", JSON.stringify(books));
    }
}
//---------------------------------------------------------------------------------------------
// Event: display books. 
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add a book. 
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // Prevent actual sumbit
    e.preventDefault();
    
    // Get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate: 
    // Fill all forms before adding book alert code. 
    if(title === "" || author === "" || isbn === ""){
        UI.showAlert("Please fill in all the fields", "danger");
    } else {
    // Instansiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book); // actual function to add books to the list.

    // Add book to store
    Store.addBook(book);

    // Success msg
        UI.showAlert("Book added", "success");

    // Clear gutter
    UI.clearFields(); 
    }
});

// event: Remove a book.
document.querySelector("#book-list").addEventListener("click", (e) => {
    
    // Remove book from UI
    UI.deleteBook(e.target); // Here we target the book list and in there we said that if it contains "delete" then remove the parent parent of the thing we click in the book list

    // Remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Success msg
    UI.showAlert("Book removed", "success");
});