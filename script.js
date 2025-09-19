let currentStep = 1;
const totalSteps = 4;
const formData = {
  small: 0,
  medium: 0,
  large: 0,
  preferences: [],
  name: "",
  whatsapp: "",
  email: ""
};

function updateCounter(type, value) {
  formData[type] = Math.max(0, formData[type] + value);
  document.getElementById(`${type}-count`).innerText = formData[type];
}

function nextStep() {
  if (currentStep < totalSteps) {
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.add("active");

    if (currentStep === 4) {
      calculateResults();
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    currentStep--;
    document.getElementById(`step-${currentStep}`).classList.add("active");
  }
}

function calculateResults() {
  const totalProducts = (formData.small * 1) + (formData.medium * 2) + (formData.large * 3);
  const preferences = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                           .map(el => el.value);

  const resultText = `
    Espacios seleccionados: ${formData.small} pequeños, ${formData.medium} medianos, ${formData.large} grandes.<br>
    Total de productos recomendados: <strong>${totalProducts}</strong><br>
    Preferencias: ${preferences.join(", ")}
  `;
  
  document.getElementById("result-text").innerHTML = resultText;
}
