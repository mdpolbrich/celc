window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar")
  nav.classList.toggle("scrolled", window.scrollY > 50)
})

window.addEventListener("load", () => {
  const logo = document.querySelector(".hero-logo")
  if (logo) logo.classList.add("loaded")
})

window.addEventListener("load", () => {
  const btn = document.querySelector("#hero .btn")
  if (btn) btn.classList.add("visible")
})

// =============================
// TWO-STEP CHECKOUT FLOW
// =============================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxc05C5uRfUvoneqiMAczs95SdY6SDUbcrQ0JFmW3vQLj8y9-cXUj6abT7IncFg--Mv/exec"

const AMAZON_LINKS = {
  US: "https://a.co/d/0iy1aP2g",
  CA: "https://www.amazon.ca/dp/B0H846DBC1",
  MX: "https://www.amazon.com.mx/dp/B0H846DBC1",
}

const AMAZON_CHOICE_COUNTRIES = ["US", "MX"]
const AMAZON_ONLY_COUNTRIES = ["CA"]

const PRICING = {
  US: { product: 39.99, shipping: 4.99, currency: "USD", symbol: "$" },
  CA: { product: 39.99, shipping: 6.99, currency: "USD", symbol: "$" },
  MX: { product: 39.99, shipping: 4.99, currency: "USD", symbol: "$" },
  VE: { product: 39.99, shipping: 0.0, currency: "USD", symbol: "$" },
  ES: { product: 29.99, shipping: 0.0, currency: "EUR", symbol: "€" },
  DE: { product: 29.99, shipping: 0.0, currency: "EUR", symbol: "€" },
  UK: { product: 29.99, shipping: 0.0, currency: "GBP", symbol: "£" },
  OTHER: { product: 39.99, shipping: 0.0, currency: "USD", symbol: "$" },
}

const STORES = {
  UK: { name: "Arepa & CO", address: "254 Paradise Row<br>London E2 9LE, UK" },
}

const COUNTRY_NAMES = {
  US: "Estados Unidos",
  CA: "Canadá",
  MX: "México",
  VE: "Venezuela",
  ES: "España",
  DE: "Alemania",
  UK: "Reino Unido",
  OTHER: "Otro país",
}

const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const contactForm = document.getElementById("contactForm")
const continueBtn = document.getElementById("continueBtn")
const editBtn = document.getElementById("editBtn")
const submitBtn = document.getElementById("submitBtn")

const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const countryInput = document.getElementById("country")
const otherCountryInput = document.getElementById("otherCountry")

const displayName = document.getElementById("displayName")
const displayEmail = document.getElementById("displayEmail")
const displayCountry = document.getElementById("displayCountry")
const displayQuantity = document.getElementById("displayQuantity")

const qtyMinus = document.getElementById("qtyMinus")
const qtyPlus = document.getElementById("qtyPlus")
const qtyDisplay = document.getElementById("qtyDisplay")
let quantity = 1

function updateStep1Subtotal() {
  const wrapper = document.getElementById("step1Subtotal")
  const label = document.getElementById("step1SubtotalLabel")
  const total = document.getElementById("step1SubtotalTotal")
  if (!label || !total) return
  const code = countryInput ? countryInput.value : ""
  if (!code || code === "OTHER") {
    if (wrapper) wrapper.style.display = "none"
    return
  }
  if (wrapper) wrapper.style.display = ""
  let unitLabel, totalStr
  if (code === "ES" || code === "DE") {
    unitLabel = "29,99€"
    totalStr = (29.99 * quantity).toFixed(2).replace(".", ",") + "€"
  } else if (code === "UK") {
    unitLabel = "£29.99"
    totalStr = "£" + (29.99 * quantity).toFixed(2)
  } else if (code === "VE") {
    unitLabel = "$34.99 USD"
    totalStr = "$" + (34.99 * quantity).toFixed(2) + " USD"
  } else {
    unitLabel = "$39.99 USD"
    totalStr = "$" + (39.99 * quantity).toFixed(2) + " USD"
  }
  label.textContent = `${quantity} × ${unitLabel}`
  total.textContent = totalStr
}

if (qtyMinus) qtyMinus.addEventListener("click", () => { if (quantity > 1) { quantity--; qtyDisplay.textContent = quantity; updatePricingUI(formData.country); updateStep1Subtotal() } })
if (qtyPlus) qtyPlus.addEventListener("click", () => { if (quantity < 10) { quantity++; qtyDisplay.textContent = quantity; updatePricingUI(formData.country); updateStep1Subtotal() } })

const intlAlert = document.getElementById("intlAlert")
const amazonChoiceOptions = document.getElementById("amazonChoiceOptions")

const priceBreakdown = document.getElementById("priceBreakdown")
const shippingRow = document.getElementById("usShippingRow")
const intlShippingNote = document.getElementById("intlShippingNote")

const priceProduct = document.getElementById("priceProduct")
const priceShipping = document.getElementById("priceShipping")
const priceTotal = document.getElementById("priceTotal")
const totalLabel = document.getElementById("totalLabel")
const shippingLabel = document.getElementById("shippingLabel")
const shippingIcon = document.getElementById("shippingIcon")
const mxCurrencyNote = document.getElementById("mxCurrencyNote")
const esShippingOptions = document.getElementById("esShippingOptions")
const veShippingOptions = document.getElementById("veShippingOptions")
const deShippingOptions = document.getElementById("deShippingOptions")
const storePickupCard = document.getElementById("storePickupCard")
const storePickupNameEl = document.getElementById("storePickupName")
const storePickupAddressEl = document.getElementById("storePickupAddress")

// Store form data between steps
const formData = {
  name: "",
  email: "",
  country: "",
  quantity: 1,
}

function money(symbol, value, currency) {
  const formatted = Number(value).toFixed(2)
  return currency === "EUR" ? `${symbol}${formatted.replace(".", ",")}` : `${symbol}${formatted}`
}

function hasShippingAvailable(countryCode) {
  return ["US", "MX", "ES", "DE", "VE"].includes(countryCode)
}

function getEsShipping() {
  const selected = document.querySelector('input[name="esShipping"]:checked')
  if (!selected || selected.value !== "delivery") return 0
  return quantity > 6 ? 11.5 : 5.99
}

function getDeShipping() {
  const selected = document.querySelector('input[name="deShipping"]:checked')
  if (!selected || selected.value !== "delivery") return 0
  return quantity > 6 ? 11.5 : 5.99
}

function getVeShipping() {
  const selected = document.querySelector('input[name="veShipping"]:checked')
  return selected && selected.value === "delivery" ? 5 : 0
}

function getUsShipping() {
  return 4.99
}

function getVeShippingMode() {
  const selected = document.querySelector('input[name="veShipping"]:checked')
  return selected ? selected.value : "delivery"
}

function getPurchaseMethod() {
  const selected = document.querySelector('input[name="purchaseMethod"]:checked')
  return selected ? selected.value : "direct"
}

function updateContinueButton() {
  if (!continueBtn || !nameInput || !emailInput || !countryInput) return

  const isValid = nameInput.value.trim() && emailInput.value.trim() && countryInput.value

  continueBtn.disabled = !isValid
}

function updatePricingUI(code) {
  if (!priceBreakdown || !priceProduct || !priceTotal || !totalLabel) return

  if (!code || !PRICING[code]) return

  const { product, shipping, symbol, currency } = PRICING[code]
  const localShip = hasShippingAvailable(code)

  // Show/hide delivery options
  if (esShippingOptions) esShippingOptions.style.display = code === "ES" ? "block" : "none"
  if (veShippingOptions) veShippingOptions.style.display = code === "VE" ? "block" : "none"
  if (deShippingOptions) deShippingOptions.style.display = code === "DE" ? "block" : "none"

  // Alternative purchase option (US, Canada, Mexico)
  if (amazonChoiceOptions) amazonChoiceOptions.style.display = AMAZON_CHOICE_COUNTRIES.includes(code) ? "block" : "none"

  const subtotal = product * quantity
  const baseShip = code === "DE" ? getDeShipping()
    : !localShip ? 0
    : code === "ES" ? getEsShipping()
    : code === "VE" ? getVeShipping()
    : code === "US" ? getUsShipping()
    : shipping
  const ship = baseShip
  const total = subtotal + ship

  // Product price
  const priceProductLabel = document.getElementById("priceProductLabel")
  if (priceProductLabel) {
    priceProductLabel.textContent = quantity > 1 ? `Precio del juego × ${quantity}` : "Precio del juego"
  }
  priceProduct.textContent = money(symbol, subtotal, currency)

  // Shipping row
  const showShipRow = localShip
  if (shippingRow) shippingRow.style.display = showShipRow ? "flex" : "none"
  if (priceShipping && showShipRow) {
    if (code === "VE" && getVeShippingMode() === "nacional") {
      priceShipping.textContent = "Cobro a destino"
    } else {
      priceShipping.textContent = ((code === "ES" || code === "VE" || code === "DE") && ship === 0) ? "Gratis" : money(symbol, ship, currency)
    }
  }

  // International note (OTHER only — not for store countries)
  if (intlShippingNote) intlShippingNote.style.display = "none"

  // Store card inside price breakdown (UK only)
  if (storePickupCard) {
    const store = code === "UK" ? STORES["UK"] : null
    if (store) {
      storePickupNameEl.textContent = store.name
      storePickupAddressEl.innerHTML = store.address
      storePickupCard.style.display = "block"
    } else {
      storePickupCard.style.display = "none"
    }
  }

  // Total label + total amount
  totalLabel.textContent = (localShip || code === "UK") ? "Total" : "Total (producto)"
  priceTotal.textContent = money(symbol, total, currency)

  // Label shipping row accurately
  if (shippingLabel && showShipRow) {
    if (code === "US") { shippingLabel.textContent = "Envío (EE.UU.)"; if (shippingIcon) shippingIcon.textContent = "🚚" }
    else if (code === "MX") { shippingLabel.textContent = "Envío (México)"; if (shippingIcon) shippingIcon.textContent = "🚚" }
    else if (code === "ES") {
      const isPickup = ship === 0
      shippingLabel.textContent = isPickup ? "Recogida (Madrid)" : "Envío (España)"
      if (shippingIcon) shippingIcon.textContent = isPickup ? "📍" : "🚚"
    }
    else if (code === "VE") {
      const mode = getVeShippingMode()
      if (mode === "delivery") { shippingLabel.textContent = "Delivery (Caracas)"; if (shippingIcon) shippingIcon.textContent = "🛵" }
      else { shippingLabel.textContent = "Envío nacional"; if (shippingIcon) shippingIcon.textContent = "🚚" }
    }
    else if (code === "DE") {
      const isPickup = getDeShipping() === 0
      shippingLabel.textContent = isPickup ? "Recogida (Berlín)" : "Envío (Alemania)"
      if (shippingIcon) shippingIcon.textContent = isPickup ? "📍" : "🚚"
    }
  }

  // USD clarification for Mexico
  if (mxCurrencyNote) mxCurrencyNote.style.display = (code === "MX" || code === "VE") ? "block" : "none"
}

function updateStep2UI(code) {
  const isOther = code === "OTHER"
  const isAmazonOnly = AMAZON_ONLY_COUNTRIES.includes(code)

  const otherBanner = document.getElementById("otherCountryBanner")
  const amazonOnlyBanner = document.getElementById("amazonOnlyBanner")
  const amazonOnlyMsg = document.getElementById("amazonOnlyMsg")
  const priceBreakdownSection = document.getElementById("priceBreakdownSection")
  const otherCountryNameEl = document.getElementById("otherCountryName")

  if (isOther) {
    if (otherBanner) otherBanner.style.display = "block"
    if (amazonOnlyBanner) amazonOnlyBanner.style.display = "none"
    if (priceBreakdownSection) priceBreakdownSection.style.display = "none"
    const countryName = otherCountryInput ? otherCountryInput.value.trim() || "tu país" : "tu país"
    if (otherCountryNameEl) otherCountryNameEl.textContent = countryName
    if (intlAlert) intlAlert.style.display = "none"
    if (submitBtn) submitBtn.textContent = "Avísame cuando lleguen"
  } else if (isAmazonOnly) {
    if (otherBanner) otherBanner.style.display = "none"
    if (amazonOnlyBanner) amazonOnlyBanner.style.display = "block"
    if (amazonOnlyMsg) amazonOnlyMsg.textContent = `Por ahora en ${COUNTRY_NAMES[code] || "tu país"} distribuimos exclusivamente a través de Amazon.`
    if (priceBreakdownSection) priceBreakdownSection.style.display = "none"
    if (intlAlert) intlAlert.style.display = "none"
    if (submitBtn) submitBtn.textContent = "Ir a Amazon"
  } else {
    const isAmazonChoice = AMAZON_CHOICE_COUNTRIES.includes(code) && getPurchaseMethod() === "amazon"
    if (otherBanner) otherBanner.style.display = "none"
    if (amazonOnlyBanner) amazonOnlyBanner.style.display = "none"
    if (priceBreakdownSection) priceBreakdownSection.style.display = isAmazonChoice ? "none" : "block"
    if (intlAlert) intlAlert.style.display = "none"
    if (submitBtn) submitBtn.textContent = isAmazonChoice ? "Ir a Amazon" : "Confirmar pedido"
  }
}

// Step 1: Show initial description
function showStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('checkoutDescription').textContent = 'Completa tus datos para realizar el pedido';
}

// Step 2: Show confirmation description
function showStep2() {
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  document.getElementById('checkoutDescription').textContent = 'Confirma tus datos para completar el pedido';

  var countrySelect = document.getElementById('country');
  var otherCountryInput = document.getElementById('otherCountry');
  var countryValue = countrySelect.value === 'OTHER' ? otherCountryInput.value : countrySelect.options[countrySelect.selectedIndex].text;
  document.getElementById('displayCountry').textContent = countryValue;
}

// Helper to send data to Google Sheets
function sendToSheets(data) {
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: new URLSearchParams(data)
  })
  .then(response => response.text())
  .then(result => console.log('Sheets response:', result))
  .catch(error => console.error('Sheets error:', error));
}

let orderRowEmail = null; // email currently on file in the Sheet row for this order, once created

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    formData.name = nameInput.value.trim();
    formData.email = emailInput.value.trim();
    formData.country = countryInput.value;
    formData.quantity = quantity;
    const typedCountry = countryInput.value === 'OTHER' ? otherCountryInput.value.trim() : '';
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!orderRowEmail) {
      // First submission — create the pending row
      sendToSheets({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        typedCountry: typedCountry,
        quantity: formData.quantity,
        phone: phone
      });
    } else {
      // Resubmission after "Editar" — update the existing row instead of duplicating it
      sendToSheets({
        updateEmail: orderRowEmail,
        name: formData.name,
        email: formData.email,
        country: formData.country,
        typedCountry: typedCountry,
        quantity: formData.quantity,
        phone: phone
      });
    }
    orderRowEmail = formData.email;

    // Update display in step 2
    if (displayName) displayName.textContent = formData.name;
    if (displayEmail) displayEmail.textContent = formData.email;
    if (displayCountry) displayCountry.textContent = formData.country === "OTHER" ? otherCountryInput.value : COUNTRY_NAMES[formData.country] || formData.country;
    if (displayQuantity) displayQuantity.textContent = formData.quantity;

    // Update pricing
    updatePricingUI(formData.country);
    updateStep2UI(formData.country);

    // Show step 2, hide step 1
    showStep2();

    // Scroll to top of checkout section
    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (editBtn) {
  editBtn.addEventListener("click", () => {
    showStep1()

    // Scroll to top of checkout section
    const checkoutSection = document.getElementById("checkout")
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })
}

// Listen for changes in step 1 form fields
if (nameInput) nameInput.addEventListener("input", updateContinueButton)
if (emailInput) emailInput.addEventListener("input", updateContinueButton)
if (countryInput) countryInput.addEventListener("change", () => { updateContinueButton(); updateStep1Subtotal() })

document.getElementById('country').addEventListener('change', function() {
  var otherInput = document.getElementById('otherCountry');
  var phoneField = document.getElementById('phoneField');
  var phoneInput = document.getElementById('phone');

  if (this.value === 'OTHER') {
    otherInput.style.display = 'block';
    otherInput.required = true;
  } else {
    otherInput.style.display = 'none';
    otherInput.required = false;
    otherInput.value = '';
  }

  if (this.value === 'VE' || this.value === 'MX') {
    phoneField.style.display = 'block';
    phoneInput.required = true;
    phoneInput.placeholder = this.value === 'VE' ? '+58 412 000 0000' : '+52 55 0000 0000';
  } else {
    phoneField.style.display = 'none';
    phoneInput.required = false;
    phoneInput.value = '';
  }
});

// Initialize
updateContinueButton()

// Re-calculate pricing when Spain or Germany delivery option changes
document.querySelectorAll('input[name="esShipping"]').forEach(radio => {
  radio.addEventListener("change", () => updatePricingUI(formData.country))
})
document.querySelectorAll('input[name="deShipping"]').forEach(radio => {
  radio.addEventListener("change", () => updatePricingUI(formData.country))
})
document.querySelectorAll('input[name="veShipping"]').forEach(radio => {
  radio.addEventListener("change", () => updatePricingUI(formData.country))
})
document.querySelectorAll('input[name="purchaseMethod"]').forEach(radio => {
  radio.addEventListener("change", () => updateStep2UI(formData.country))
})

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    const code = formData.country;
    if (!code) return;

    const isAmazonChoice = AMAZON_CHOICE_COUNTRIES.includes(code) && getPurchaseMethod() === "amazon"
    const isAmazonOnly = AMAZON_ONLY_COUNTRIES.includes(code)

    if (isAmazonChoice || isAmazonOnly) {
      sendToSheets({ email: formData.email, status: 'Precio confirmado', purchaseMethod: 'amazon' });
      window.open(AMAZON_LINKS[code], "_blank", "noopener");
      return;
    }

    // Only send status update (email is the identifier)
    const sheetsData = { email: formData.email, status: 'Precio confirmado' };
    if (code === 'ES') sheetsData.esShipping = getEsShipping() > 0 ? 'envío' : 'recogida';
    if (code === 'DE') sheetsData.deShipping = getDeShipping() > 0 ? 'envío' : 'recogida';
    if (code === 'VE') sheetsData.veShipping = getVeShippingMode();
    sendToSheets(sheetsData);

    const localShip = hasShippingAvailable(code);
    if (localShip) {
      const ship = code === "ES" ? getEsShipping()
        : code === "DE" ? getDeShipping()
        : code === "VE" ? getVeShipping()
        : code === "US" ? getUsShipping()
        : PRICING[code] ? PRICING[code].shipping : 0;

      const isPickup = (code === "ES" && getEsShipping() === 0) ||
        (code === "DE" && getDeShipping() === 0);
      const mode = isPickup ? "pickup" : "shipping";

      const params = new URLSearchParams({
        country: code,
        quantity: formData.quantity,
        email: formData.email,
        shipping: ship,
        mode: mode
      });
      if (code === "VE") params.set("veShippingMode", getVeShippingMode());

      submitBtn.textContent = "Redirigiendo...";
      submitBtn.disabled = true;
      fetch(APPS_SCRIPT_URL + "?" + params.toString())
        .then(r => r.json())
        .then(data => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            submitBtn.textContent = "Confirmar pedido";
            submitBtn.disabled = false;
            alert("Error al conectar con Stripe. Por favor intenta de nuevo.");
          }
        })
        .catch(() => {
          submitBtn.textContent = "Confirmar pedido";
          submitBtn.disabled = false;
          alert("Error al conectar con Stripe. Por favor intenta de nuevo.");
        });
      return;
    }

    const successMessage = document.getElementById("successMessage");
    if (successMessage) {
      submitBtn.style.display = "none";
      if (code === "OTHER") {
        const countryName = otherCountryInput ? otherCountryInput.value.trim() || "tu país" : "tu país"
        successMessage.innerHTML = `<strong>¡Listo!</strong> Quedaste en la lista y te avisaremos por correo apenas abramos en ${countryName}.`
      }
      successMessage.style.display = "block";
      successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
