let currentStep = 1;
const totalSteps = 4;

const formData = {
  small: 0,
  medium: 0,
  large: 0,
  prefs: [],
  totalPoints: 0
};

function updateStepper() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById("step-label").textContent = `Paso ${currentStep} de ${totalSteps}`;
  document.getElementById("stepper-progress").style.width = `${progress}%`;
}

function updateCounter(type, value) {
  formData[type] = Math.max(0, formData[type] + value);
  document.getElementById(`${type}-count`).textContent = formData[type];
}

function sumSpaces() {
  return formData.small + formData.medium + formData.large;
}

function calculateTotalPoints() {
  return formData.small * 1 + formData.medium * 2 + formData.large * 3;
}

function goToStep2() {
  if (sumSpaces() === 0) {
    alert("Selecciona al menos un espacio.");
    return;
  }

  formData.totalPoints = calculateTotalPoints();

  const summary = `
    EN TU CASO TE RECOMENDAMOS USAR un total de <strong>${formData.totalPoints} puntos de aroma</strong><br><br>
    ${formData.small > 0 ? `${formData.small * 1} punto(s) para tus espacios pequeños.<br>` : ""}
    ${formData.medium > 0 ? `${formData.medium * 2} puntos para tus espacios medianos.<br>` : ""}
    ${formData.large > 0 ? `${formData.large * 3} puntos para tus espacios grandes o abiertos.` : ""}
  `;
  document.getElementById("points-summary").innerHTML = summary;

  changeStep(2);
}

function validateStep2() {
  const selectedPrefs = Array.from(document.querySelectorAll('.option-cards input:checked'));
  if (selectedPrefs.length === 0) {
    alert("Por favor selecciona al menos una opción para cubrir los puntos de aroma.");
    return;
  }
  formData.prefs = selectedPrefs.map(e => e.value);
  changeStep(3);
}

function validateStep3() {
  const name = document.getElementById("name").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !whatsapp || !email) {
    alert("Por favor completa todos los campos antes de continuar.");
    return;
  }

  sendEmail(name, whatsapp, email);
  generateFinalRecommendation();
  changeStep(4);
}

function generateFinalRecommendation() {
  let remaining = formData.totalPoints;
  const distribution = { Difusores: 0, Velas: 0, "Home Sprays": 0 };

  if (formData.prefs.includes("Difusores")) {
    const asign = Math.ceil(remaining / 2);
    distribution.Difusores = asign;
    remaining -= asign;
  }
  if (formData.prefs.includes("Velas") && remaining > 0) {
    const asign = formData.prefs.length === 2 ? remaining : Math.floor(remaining / 2);
    distribution.Velas = asign;
    remaining -= asign;
  }
  if (formData.prefs.includes("Home Sprays") && remaining > 0) {
    distribution["Home Sprays"] = remaining;
  }

  for (const type of formData.prefs) {
    if (distribution[type] === 0) {
      distribution[type] = 1;
    }
  }

  const finalText = Object.entries(distribution)
    .filter(([_, qty]) => qty > 0)
    .map(([type, qty]) => `${qty} ${type}`)
    .join(", ");

  document.getElementById("final-recommendation").innerHTML = `
    <strong>Te recomendamos:</strong><br>${finalText}
  `;

  const waMessage = `Hola quiero mi combo de ${finalText} con mi 20%`;
  document.getElementById("whatsapp-btn").href =
    `https://wa.me/5491151081577?text=${encodeURIComponent(waMessage)}`;
}

function changeStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep = step;
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateStepper();
}

document.addEventListener("DOMContentLoaded", () => {
  updateStepper();
});
