let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let quantity = document.getElementById('quantity');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let tbody = document.getElementById('tbody');


let submitMood  = 'create';
let tempIndex, searchMood;


// Calc total
function getTotal () {
    if(price.value !== ''){
        let result = (+price.value) + (+taxes.value) + (+ads.value) - (+discount.value);
        total.innerHTML = result;
        total.style.backgroundColor = '#040';
    } else {
        total.innerHTML = ''
        total.style.backgroundColor = '#100d02';
    }
}

let products;

// Get old data from localstorage
if(localStorage.products != null) {
    products = JSON.parse(localStorage.products);
} else {
    products = [];
}

// Create new product
submit.onclick = function () {
    let newProdcut = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        quantity: quantity.value,
        category: category.value.toLowerCase()
    }; 

    if(validData(newProdcut)){
        if(submitMood === 'create'){
            for(let i = 1; i <= newProdcut.quantity; i++){
                products.push(newProdcut);
            }
        } else {
            products[tempIndex] = newProdcut;
            submitMood = 'create';
            submit.innerHTML = 'Create';
            quantity.style.display = 'block';
        }
        clearInputsData();
    } else {
        alert('Enter Valid Data.');
    }

    localStorage.setItem('products', JSON.stringify(products));

    showData();
}

// Clear input fildes
function clearInputsData () {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    quantity.value = '';
    category.value = '';
}

// Read and show data in table
function showData () {
    getTotal();
    let table = '';
    for(let i = 0; i < products.length; i++){
        table += `
        <tr>
            <td>${i+1}</td>
            <td>${products[i].title}</td>
            <td>${products[i].price}</td>
            <td>${products[i].taxes}</td>
            <td>${products[i].ads}</td>
            <td>${products[i].discount}</td>
            <td>${products[i].total}</td>
            <td>${products[i].category}</td>
            <td><button onclick="updateItem(${i})" id="update">update</button></td>
            <td><button onclick="deleteItem(${i})" id="delete">delete</button></td>
        </tr>
        `
    }

    tbody.innerHTML = table;

    let deleteAlldiv = document.getElementById('delete-all');
    if(products.length > 0){
        deleteAlldiv.innerHTML = `<button onclick="deleteAll()">Delete All (${products.length})</button>`;
    } else {
        deleteAlldiv.innerHTML = ''; 
    }

}
showData();

// delete product
function deleteItem (itemId) {
    products.splice(itemId,1);
    localStorage.products = JSON.stringify(products);
    showData();
}

// delete all products
function deleteAll () {
    products = [];
    localStorage.removeItem('products');
    showData();
}

// Upadte a product
function updateItem (itemId) {
    title.value = products[itemId].title;
    price.value = products[itemId].price;
    taxes.value = products[itemId].taxes;
    ads.value = products[itemId].ads;
    discount.value = products[itemId].discount;
    category.value = products[itemId].category;
    getTotal();
    quantity.style.display = 'none';
    submit.innerHTML = 'Update';
    submitMood = 'update'
    tempIndex = itemId;
    scroll({
        top: 0,
        behavior: "smooth"
    })
}

// search
function getSearchMood (id) {
    searchMood = (id === 'search-by-title') ? 'title' : 'category';
    let search = document.getElementById('search');
    search.placeholder = `Search By ${searchMood.toUpperCase()}`;
    search.focus();
    search.innerHTML = '';
    showData();

}

function search (value) {
    let table = '';
    for(let i = 0; i < products.length; i++){
        if((searchMood === 'title' && products[i].title.includes(value.toLowerCase())) ||
        (searchMood === 'category' && products[i].category.includes(value.toLowerCase()))) {
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${products[i].title}</td>
                <td>${products[i].price}</td>
                <td>${products[i].taxes}</td>
                <td>${products[i].ads}</td>
                <td>${products[i].discount}</td>
                <td>${products[i].total}</td>
                <td>${products[i].category}</td>
                <td><button onclick="updateItem(${i})" id="update">update</button></td>
                <td><button onclick="deleteItem(${i})" id="delete">delete</button></td>
            </tr>
            `
        }
    }
    
    tbody.innerHTML = table;
    
}


// Validation
function validData (product) {
    return product.title.length > 1 &&
            product.price > 0 &&
            product.total >= 0 &&
            product.quantity > 0 && product.quantity < 50 &&
            product.category.length > 1;
}