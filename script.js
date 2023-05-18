const addToCartButtons = document.querySelectorAll('.add-to-cart');
const buyNowButton = document.querySelector('#buy-now');
const fishList = document.querySelector('#fish-list');
let cart = []; 

fetch('fish.csv')
  .then(response => response.text())
  .then(text => {
    const lines = text.trim().split('\n').slice(1);
    for (const line of lines) {
      const [name, price, availability, quantity] = line.split(',');

      // Skip the item if availability is "-"
      if (availability === '-') {
        continue;
      }

      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="img/fish/${name.toLowerCase()}.jpg" alt="${name}" class="icons" width="80" height="80">
        <h3>${name}</h3>
        <p class="price">₹${price}</p>
        <p class="availability">${availability}</p>
        <p class="quantity">${quantity}</p>
        <div class="add-to-cart">
            <button class="minus-button" disabled>-</button>
            <span class="count">0</span>
            <button class="plus-button">+</button>
        </div>
      `;
      fishList.appendChild(listItem);

      // add event listeners for plus and minus buttons
      const plusButton = listItem.querySelector('.plus-button');
      const minusButton = listItem.querySelector('.minus-button');
      const countSpan = listItem.querySelector('.count');

      plusButton.addEventListener('click', () => {
        const count = parseInt(countSpan.textContent);
        countSpan.textContent = count + 1;
        minusButton.removeAttribute('disabled');

        // add item to cart
        const itemElement = plusButton.closest('li');
        addItemToCart(itemElement);
      });

      minusButton.addEventListener('click', () => {
        const count = parseInt(countSpan.textContent);
        countSpan.textContent = count - 1;
        if (count - 1 === 0) {
          minusButton.setAttribute('disabled', true);
        }

        // remove item from cart
        const itemElement = minusButton.closest('li');
        removeItemFromCart(itemElement);
      });
    }
  });


/*
fetch('fish.csv')
  .then(response => response.text())
  .then(text => {
    const lines = text.trim().split('\n').slice(1);
    for (const line of lines) {
      const [name, price] = line.split(',');
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="img/fish/${name.toLowerCase()}.jpg" alt="${name}" class="icons" width="80" height="80">
        <h3>${name}</h3>
        <p class="price">₹${price}</p>
        <div class="add-to-cart">
            <button class="minus-button" disabled>-</button>
            <span class="count">0</span>
            <button class="plus-button">+</button>
        </div>
      `;
      fishList.appendChild(listItem);

      // add event listeners for plus and minus buttons
      const plusButton = listItem.querySelector('.plus-button');
      const minusButton = listItem.querySelector('.minus-button');
      const countSpan = listItem.querySelector('.count');

      plusButton.addEventListener('click', () => {
        const count = parseInt(countSpan.textContent);
        countSpan.textContent = count + 1;
        minusButton.removeAttribute('disabled');

        // add item to cart
        const itemElement = plusButton.closest('li');
        addItemToCart(itemElement);
      });

      minusButton.addEventListener('click', () => {
        const count = parseInt(countSpan.textContent);
        countSpan.textContent = count - 1;
        if (count - 1 === 0) {
          minusButton.setAttribute('disabled', true);
        }

        // remove item from cart
	      
            const itemElement = minusButton.closest('li');
            removeItemFromCart(itemElement);
	      
	     

      });
    }
  });
*/
function addItemToCart(itemElement) {
    const name = itemElement.querySelector('h3').textContent;
    const price = itemElement.querySelector('.price').textContent;
    let itemExists = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].count++;
            itemExists = true;
            break;
        }
    }

    if (!itemExists) {
        cart.push({
            name: name,
            price: price,
            count: 1
        });
    }

    updateCart();
}

function removeItemFromCart(itemElement) {
  const name = itemElement.querySelector('h3').textContent;

  // Find the item in the cart
  const itemIndex = cart.findIndex(item => item.name === name);
  if (itemIndex === -1) {
    // Item not found in cart
    return;
  }

  // Decrement the item count or remove the item if count becomes zero
  const item = cart[itemIndex];
  item.count--;
  if (item.count === 0) {
    cart.splice(itemIndex, 1);
  }

  // Update the cart display
  updateCart();
}

function updateCart() {
  const cartItems = document.querySelector('#cart-items');
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your cart is empty';
    cartItems.appendChild(emptyMessage);
    return;
  }

  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = document.createElement('li');
    const itemInfo = document.createElement('div');
    const itemName = document.createElement('h3');
    const itemCount = document.createElement('span');
    const itemPrice = document.createElement('span');

    item.classList.add('cart-item');
    itemName.textContent = cart[i].name;
    itemCount.textContent = ` x${cart[i].count}`;
    const price = parseFloat(cart[i].price.replace('₹', '')); // Extract numerical value from price string
    itemPrice.textContent = `₹${price.toFixed(2)}`; // Display price with Rupee symbol
    totalPrice += price * cart[i].count;	  
//    itemPrice.textContent = cart[i].price;
//    totalPrice += parseFloat(cart[i].price) * cart[i].count; // Convert price to number


   // totalPrice += cart[i].count * cart[i].price;

    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemCount);
    itemInfo.appendChild(itemPrice);
    item.appendChild(itemInfo);
    cartItems.appendChild(item);

    // Update the count displayed for the item in the HTML
   // const itemElement = document.querySelector(`#fish-list li:nth-child(${i + 1})`);
    //const countSpan = itemElement.querySelector('.count');
    //countSpan.textContent = cart[i].count;
  }

  const clearCartButton = document.createElement('button');
  clearCartButton.textContent = 'Clear Cart';
  clearCartButton.classList.add('clear-cart-button');
  clearCartButton.addEventListener('click', () => {
    cart = [];
    updateCart();
  
  // Reset the count displayed for each item in the HTML
  const items = document.querySelectorAll('#fish-list li');
  for (const item of items) {
    const countSpan = item.querySelector('.count');
    countSpan.textContent = '0';
// Disable the minus button
    const minusButton = item.querySelector('.minus-button');
    minusButton.setAttribute('disabled', true);	  
  }	  
});

	
  const totalPriceMessage = document.createElement('p');
  totalPriceMessage.textContent = `Total: ₹${totalPrice.toFixed(2)}`;

  cartItems.appendChild(clearCartButton);
  cartItems.appendChild(totalPriceMessage);
}


buyNowButton.addEventListener('click', (event) => {
	event.preventDefault();
	const name = document.querySelector('#name').value;
	const address = document.querySelector('#address').value;
	const phone = document.querySelector('#phone').value;
	let items = [];

	cart.forEach((item) => {
		items.push(`${item.name} - ${item.price} x ${item.count}`);
	});

	//const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.count, 0).toFixed(2);
        const totalPrice = cart.reduce((acc, item) => {
		const price = parseFloat(item.price.match(/\d+(\.\d+)?/)[0]);
		return acc + price * item.count;
	}, 0).toFixed(2);
	
	if (name === '' || address === '' || phone === '' || items.length === 0) {
		alert('Please fill all the required fields and add at least one item to the cart.');
	} else {
		const message = `Order received\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nItems: ${items.join(', ')}\nTotal price: ${totalPrice}`;

		window.open(`https://wa.me/919607040169?text=${encodeURIComponent(message)}`);

		alert('Order received!');
	}
});





