
async function addToCartProduct(event) {
  try {
    const formData = {
      "items": [{
        id: event.dataset.product,
        quantity: 1,
      }]
    };
    const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = response.json();
    const typeMenu = event.dataset.type;
    toggleSideMenu(typeMenu)

    document.dispatchEvent(new CustomEvent('cart:refresh'));
      
  } catch (error) {
    console.error('Error:', error);
  }
}

function toggleSideMenu(type) {
  if (type != "menu") return;
  document.querySelector("header-sidebar").hide()
  document.querySelector("cart-drawer").show()
}