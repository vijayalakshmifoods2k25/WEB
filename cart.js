let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let cartTotal = 0;

function calculateTotal(){
  cartTotal = cart.reduce((sum,item)=> sum + item.price*item.qty, 0);
}

function renderSummary(){
  const summaryId = "cart-summary";
  let summary = document.getElementById(summaryId);
  if(!summary){
    summary = document.createElement("div");
    summary.id = summaryId;
    summary.className = "cart-summary";
    document.getElementById("cartContainer").after(summary);
  }
  calculateTotal();
  if(cart.length === 0){
    summary.innerHTML = "";
    return;
  }
  summary.innerHTML = `
    <span>Total: ₹${cartTotal}</span>
    <span>Items: ${cart.reduce((c,i)=>c+i.qty,0)}</span>
  `;
}

function displayCart(){
  const container = document.getElementById("cartContainer");
  container.innerHTML = "";
  if(cart.length === 0){
    container.innerHTML = "<p>Cart is empty</p>";
    renderSummary();
    return;
  }
  cart.forEach((i,index)=>{
    const div=document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${i.img || ""}" alt="${i.name}">
      <div class="cart-item-details">
        <h4>${i.name}</h4>
        <p>Weight: ${i.weight}g</p>
        <p>Price: ₹${i.price}</p>
      </div>
      <div class="cart-actions">
        <div class="qty-wrapper">
          <button class="qty-btn minus" data-index="${index}">−</button>
          <div class="qty-value">${i.qty}</div>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  container.addEventListener("click", cartClickHandler, { once:true });
  renderSummary();
}

function cartClickHandler(e){
  if(e.target.classList.contains("qty-btn")){
    const index = parseInt(e.target.dataset.index,10);
    const item = cart[index];
    if(e.target.classList.contains("plus")){
      item.qty++;
    }else{
      if(item.qty > 1) item.qty--;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }else if(e.target.classList.contains("remove-btn")){
    const index = parseInt(e.target.dataset.index,10);
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }
}

// LOCATION FOR CART PAGE
function getLocationCart(){
  const status=document.getElementById("location-status");
  if(!navigator.geolocation){
    status.textContent="Geolocation not supported";
    return;
  }
  status.textContent="Fetching location...";
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const lat=pos.coords.latitude;
      const lon=pos.coords.longitude;
      const link=`https://maps.google.com/?q=${lat},${lon}`;
      const textarea=document.getElementById("address");
      textarea.value = link;
      status.textContent="Location added ✔";
    },
    ()=>{
      status.textContent="Location permission denied";
    }
  );
}

// PLACE ORDER VIA WHATSAPP
function placeOrderCart(){
  if(cart.length===0){
    alert("Cart is empty");
    return;
  }
  const addressField = document.getElementById("address");
  const address = (addressField.value || "").trim();
  if(!address){
    alert("Please click 'Use My Current Location' or enter address");
    return;
  }

  let msg = "Hello Vijaya Lakshmi Foods,%0A%0AI would like to order:%0A";
  let total = 0;
  cart.forEach(i=>{
    const itemTotal = i.price * i.qty;
    total += itemTotal;
    msg += `• ${i.name} (${i.weight}g) × ${i.qty} = ₹${itemTotal}%0A`;
  });
  msg += `%0ATotal: ₹${total}%0A%0ADelivery Address / Location:%0A${encodeURIComponent(address)}%0A%0APlease confirm.`;

  const phone="919618082853";
  window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
}

displayCart();
