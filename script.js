// PRODUCTS
const products = [
  {name:"Finger Millet (Ragi)", img:"/images/ragi.png", price500:70, price1kg:120},
  {name:"Sorghum (Jowar)", img:"/images/jowar.png", price500:65, price1kg:110},
  {name:"Red Chilli Powder", img:"/images/chilli.png", price500:90, price1kg:170},
  {name:"Turmeric Powder", img:"/images/turmeric.png", price500:80, price1kg:150},
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// DISPLAY PRODUCTS
const container = document.getElementById("productsContainer");
if(container){
  products.forEach((p, i)=>{
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <select class="weight-select" data-index="${i}">
        <option value="500">500g</option>
        <option value="1000">1 Kg</option>
      </select>
      <div class="price">₹${p.price500}</div>

      <div class="qty-wrapper" data-index="${i}">
        <button class="qty-btn minus">−</button>
        <div class="qty-value">0</div>
        <button class="qty-btn plus">+</button>
      </div>

      <button data-index="${i}" class="add-btn">Add to Cart</button>
    `;
    container.appendChild(div);
  });

  // change price on weight
  container.addEventListener("change", (e)=>{
    if(e.target.classList.contains("weight-select")){
      const index = parseInt(e.target.dataset.index,10);
      const priceDiv = e.target.parentElement.querySelector(".price");
      const val = e.target.value;
      priceDiv.innerText = val==="500" ? "₹"+products[index].price500 : "₹"+products[index].price1kg;
    }
  });

  // quantity + / −
  container.addEventListener("click", (e)=>{
    const wrapper = e.target.closest(".qty-wrapper");
    if(!wrapper) return;
    const valueDiv = wrapper.querySelector(".qty-value");
    let current = parseInt(valueDiv.textContent,10) || 0;
    if(e.target.classList.contains("plus")){
      current++;
    }else if(e.target.classList.contains("minus")){
      if(current>0) current--;
    }
    valueDiv.textContent = current;
  });

  // add to cart
  container.addEventListener("click", (e)=>{
    if(e.target.classList.contains("add-btn")){
      const index = parseInt(e.target.dataset.index,10);
      const card = e.target.parentElement;
      const weight = card.querySelector(".weight-select").value;
      const qty = parseInt(card.querySelector(".qty-value").textContent,10) || 0;
      if(qty === 0){
        alert("Please increase quantity before adding to cart.");
        return;
      }
      const price = weight==="500" ? products[index].price500 : products[index].price1kg;

      const existing = cart.find(c=>c.name===products[index].name && c.weight===weight);
      if(existing){ existing.qty += qty; }
      else{
        cart.push({
          name:products[index].name,
          weight,
          qty,
          price,
          img:products[index].img
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to Cart ✔");
    }
  });
}

// GO TO CART
function goToCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "/HTML/addtocart.html";
}

// LOCATION (PRODUCTS PAGE)
function getLocation(){
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

// CAROUSEL (HOME)
const track = document.getElementById("sliderTrack");
if(track){
  const slides = document.querySelectorAll(".slide");
  let slideIndex = 0;
  function autoSlide(){
    slideIndex++;
    if(slideIndex >= slides.length) slideIndex = 0;
    track.style.transform = `translateX(-${slideIndex*100}%)`;
  }
  setInterval(autoSlide,3000);
}
