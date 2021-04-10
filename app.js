//DOM Selectors
const list = document.querySelector('#book-list')
const form = document.querySelector('#book-form')
const titleInput = document.querySelector('#title')
const authorInput = document.querySelector('#author')
const isbnInput = document.querySelector('#isbn')
const deleteBtns = document.querySelectorAll('.delete')

// book class
class Book {
    constructor(title, author, isbn) {
        this.title = title,
        this.author = author,
        this.isbn  = isbn
    }
}
// UI class
class UI {
    static displayBooks() {
        const storedBooks = Store.getBooks()
        storedBooks.forEach((book)=>UI.addBookToList(book))
    }

    static addBookToList(book) {
        let row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row)
    }

    static clearFields() {
        titleInput.value = ''
        authorInput.value = ''
        isbnInput.value = ''
    }

    static deleteBook(btn) {
        if(btn.classList.contains('delete')) {
            let isbn = btn.parentElement.previousElementSibling.textContent
            Store.removeBook(isbn)

            btn.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div  = document.createElement('div')
        div.className = `alert alert-${className}`;
        div.innerText=message
        const container = document.querySelector('.container')
        container.insertBefore(div, form)

        setTimeout(()=>{
            document.querySelector('.alert').remove()
        }, 3000)
    }
}

// store class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []
        }else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        let books = Store.getBooks()

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
              books.splice(index, 1);
            }
        });

        console.log(books)

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// event: add book
form.addEventListener('submit', (e)=>{
    e.preventDefault()

    let title = titleInput.value
    let author = authorInput.value
    let isbn = isbnInput.value

    //validation 
    if(title==='' && author==='' && isbn==='') {
        UI.showAlert('Please fill in all fields', 'danger')
    } else {
        const book = new Book(title, author, isbn)

        UI.addBookToList(book)

        Store.addBook(book)

        UI.showAlert('Book Added', 'success')

        UI.clearFields()
    }
})

// event: display book
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// event: remove book
list.addEventListener('click', (e)=>{
    UI.deleteBook(e.target)

    

    UI.showAlert('Book Removed', 'success')

})