const menuUrl = 'menu.csv';

fetch(menuUrl)
	.then(response => response.text())
	.then(data => {
		const items = Papa.parse(data, {header: true}).data;
		const fishMenu = document.getElementById('fish-menu');
		const chickenMenu = document.getElementById('chicken-menu');
		items.forEach(item => {
			const menuItem = createMenuItem(item);
			if (item.Category === 'Fish') {
				fishMenu.appendChild(menuItem);
			} else if (item.Category === 'Chicken') {
				chickenMenu.appendChild(menuItem);
			}
		});
	});

function createMenuItem(item) {
	const menuItem = document.createElement('div');
	menuItem.className = 'menu-item';
	const itemImage = document.createElement('img');
	itemImage.src = item['Image URL'];
	itemImage.alt = item['Item name'];
	const itemName = document.createElement('h3');
	itemName.textContent = item['Item name'];
	const itemPrice = document.createElement('p');
	itemPrice.textContent = '$' + item.Price;
	menuItem.appendChild(itemImage);
	menuItem.appendChild(itemName);
	menuItem.appendChild(itemPrice);
	return menuItem;
}

function checkout() {
	const order = getCart();
	if (order.length > 0) {
		const message = 'My order:%0a' + order.join('%0a') + '%0aTotal: $' + getTotal();
		const whatsappUrl = 'https://wa.me/9607040169/?text=' + encodeURIComponent(message);
		window.location.href = whatsappUrl;
	} else {
		alert('Your cart is empty!');
	}
}

function getCart() {
	let cart = [];
	const menuItems = document.querySelectorAll('.menu-item');
	menuItems.forEach(item => {
		const quantity = item.querySelector('input[type="number"]').value;
		if (quantity > 0) {
			const itemName = item.querySelector('h3').textContent;
			cart.push(itemName + ' x' + quantity);
		}
	});
	return cart;
}

function getTotal() {
	let total = 0;
	const menuItems = document.querySelectorAll('.menu-item');
	menuItems.forEach(item => {
		const quantity = item.querySelector('input[type="number"]').value;
		if (quantity > 0) {
			const price = parseFloat(item.querySelector('p').textContent.substring(1));
			total +=
