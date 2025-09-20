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
    EN TU CASO TE RECOMENDAMOS USAR un total de <strong>${formData.totalPoints} puntos de aroma</strong>:<br><br>
    ${formData.small > 0 ? `${formData.small * 1} punto(s) para tus espacios pequeños.<br>` : ""}
    ${formData.medium > 0 ? `${formData.medium * 2} puntos para tus espacios medianos.<br>` : ""}
    ${formData.large > 0 ? `${formData.large * 3} puntos para tus espacios grandes o abiertos.` : ""}
  `;
  document.getElementById("points-summary").innerHTML = summary;

  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep = 2;
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateStepper();
}

function nextStep() {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep++;
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateStepper();
}

function prevStep() {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep--;
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateStepper();
}

function generateFinalRecommendation() {
  const selectedPrefs = Array.from(document.querySelectorAll('.option-cards input:checked')).map(e => e.value);

  if (selectedPrefs.length === 0) {
    alert("Selecciona al menos una opción para cubrir los puntos de aroma.");
    prevStep();
    return;
  }

  formData.prefs = selectedPrefs;

  let remaining = formData.totalPoints;
  const distribution = { Difusores: 0, Velas: 0, "Home Sprays": 0 };

  if (selectedPrefs.includes("Difusores")) {
    const asign = Math.ceil(remaining / 2);
    distribution.Difusores = asign;
    remaining -= asign;
  }
  if (selectedPrefs.includes("Velas") && remaining > 0) {
    const asign = selectedPrefs.length === 2 ? remaining : Math.floor(remaining / 2);
    distribution.Velas = asign;
    remaining -= asign;
  }
  if (selectedPrefs.includes("Home Sprays") && remaining > 0) {
    distribution["Home Sprays"] = remaining;
  }

  for (const type of selectedPrefs) {
    if (distribution[type] === 0) {
      distribution[type] = 1;
    }
  }

  const parts = Object.entries(distribution)
    .filter(([_, qty]) => qty > 0)
    .map(([type, qty]) => `${qty} ${type}`);

  const finalText = parts.join(", ");
  document.getElementById("final-recommendation").innerHTML = `
    <strong>Te recomendamos:</strong><br>
    ${finalText}
  `;

  const waMessage = `Hola quiero mi combo de ${finalText} con mi 20%`;
  document.getElementById("whatsapp-btn").href =
    `https://wa.me/5491151081577?text=${encodeURIComponent(waMessage)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateStepper();

  const step3NextButton = document.querySelector("#step-3 .next-btn");
  step3NextButton.addEventListener("click", () => {
    generateFinalRecommendation();
    nextStep();
  });
});
