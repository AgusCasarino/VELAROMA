let currentStep = 1;
const totalSteps = 4;

const formData = {
  small: 0,
  medium: 0,
  large: 0,
  prefs: [],
  totalPoints: 0
};

// Actualiza el stepper visual
function updateStepper() {
  const progress = (currentStep / totalSteps) * 100;
  const stepLabel = document.getElementById("step-label");
  const stepProgress = document.getElementById("stepper-progress");
  if (stepLabel) stepLabel.textContent = `Paso ${currentStep} de ${totalSteps}`;
  if (stepProgress) stepProgress.style.width = `${progress}%`;
}

// Actualiza contador de cada tamaño
function updateCounter(type, value) {
  formData[type] = Math.max(0, formData[type] + value);
  document.getElementById(`${type}-count`).textContent = formData[type];
}

// Suma total de espacios
function sumSpaces() {
  return formData.small + formData.medium + formData.large;
}

// Calcula puntos de aroma totales
function calculateTotalPoints() {
  return formData.small * 1 + formData.medium * 2 + formData.large * 3;
}

// Avanza a paso 2 con validación
function goToStep2() {
  if (sumSpaces() === 0) {
    alert("Selecciona al menos un espacio.");
    return;
  }

  formData.totalPoints = calculateTotalPoints();
  const s = formData.small, m = formData.medium, l = formData.large;
  const pts = formData.totalPoints;

  const summary =
    `EN TU CASO TE RECOMENDAMOS USAR un total de <strong>${pts} puntos de aroma</strong><br><br>` +
    (s ? `${s} punto(s) para tus espacios pequeños.<br>` : "") +
    (m ? `${m * 2} puntos para tus espacios medianos.<br>` : "") +
    (l ? `${l * 3} puntos para tus espacios grandes o abiertos.` : "");

  document.getElementById("points-summary").innerHTML = summary;

  changeStep(2);
}

// Valida selección de opciones en paso 2
function validateStep2() {
  const selectedPrefs = Array.from(document.querySelectorAll('.option-cards input:checked'));
  if (selectedPrefs.length === 0) {
    alert("Por favor selecciona al menos una opción para cubrir los puntos de aroma.");
    return;
  }
  formData.prefs = selectedPrefs.map(e => e.value);
  changeStep(3);
}

// Valida datos en paso 3 antes de avanzar
function validateStep3() {
  const name = document.getElementById("name").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !whatsapp || !email) {
    alert("Por favor completa todos los campos antes de continuar.");
    return;
  }

  generateFinalRecommendation();
  changeStep(4);
}

// Genera la recomendación final
function generateFinalRecommendation() {
  const total = formData.totalPoints;
  const prefs = formData.prefs;

  const result = distribute(total, prefs);

  const parts = Object.entries(result)
    .filter(([_, qty]) => qty > 0)
    .map(([type, qty]) => `${qty} ${type}`);

  const finalText = parts.join(", ");
  document.getElementById("final-recommendation").innerHTML = `
    <strong>Te recomendamos:</strong><br>${finalText}
  `;

  const waMessage = `Hola quiero mi combo de ${finalText} con mi 20%`;
  document.getElementById("whatsapp-btn").href =
    `https://wa.me/5491151081577?text=${encodeURIComponent(waMessage)}`;
}

// Distribuye puntos entre productos según prioridad
function distribute(total, prefs) {
  const out = { Difusores: 0, Velas: 0, 'Home Sprays': 0 };
  let rest = total;

  // 1) Prioridad Difusores
  if (prefs.includes('Difusores')) {
    const x = Math.max(1, Math.ceil(total * 0.5));
    out.Difusores = x;
    rest -= x;
  }

  // 2) Prioridad Velas
  if (prefs.includes('Velas') && rest > 0) {
    const x = prefs.length === 2 ? rest : Math.max(1, Math.floor(rest * 0.67));
    out.Velas = x;
    rest -= x;
  }

  // 3) Prioridad Home Sprays
  if (prefs.includes('Home Sprays') && rest > 0) {
    out['Home Sprays'] = rest;
    rest = 0;
  }

  // Garantiza al menos 1 unidad por tipo seleccionado
  prefs.forEach(t => { if (out[t] === 0) out[t] = 1; });

  // Ajusta si el total se pasa
  const sum = Object.values(out).reduce((a, b) => a + b, 0);
  let delta = sum - total;
  while (delta > 0) {
    for (const t of ['Home Sprays', 'Velas', 'Difusores']) {
      if (out[t] > 1 && delta > 0) {
        out[t]--;
        delta--;
      }
    }
  }
  return out;
}

// Cambio entre pasos
function changeStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep = step;
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateStepper();
}

document.addEventListener("DOMContentLoaded", () => {
  updateStepper();
});
