let currentStep = 1;
const totalSteps = 4;
const formData = { small: 0, medium: 0, large: 0 };

function sendHeight() {
  // Informa altura al padre para que ajuste el iframe
  const height = document.documentElement.scrollHeight;
  parent.postMessage({ type: 'VELAROMA_FORM_HEIGHT', height }, '*');
}

function updateStepper() {
  const pct = (currentStep / totalSteps) * 100;
  document.getElementById('step-label').textContent = `Paso ${currentStep} de ${totalSteps}`;
  document.getElementById('stepper-progress').style.width = `${pct}%`;
  sendHeight();
}

function updateCounter(type, value) {
  formData[type] = Math.max(0, formData[type] + value);
  document.getElementById(`${type}-count`).innerText = formData[type];
  sendHeight();
}

function sumSpaces(){ return formData.small + formData.medium + formData.large; }

function canProceed(step){
  if (step === 1) return sumSpaces() > 0;
  if (step === 2) return document.querySelectorAll('.checkbox-group input:checked').length > 0;
  if (step === 3) {
    const name = document.getElementById('name');
    const wa   = document.getElementById('whatsapp');
    const mail = document.getElementById('email');
    [name,wa,mail].forEach(i => i.classList.remove('input-error'));
    let ok = true;
    if (!name.value.trim()){ name.classList.add('input-error'); ok=false; }
    if (!wa.value.trim()){ wa.classList.add('input-error'); ok=false; }
    if (!mail.value.trim()){ mail.classList.add('input-error'); ok=false; }
    return ok;
  }
  return true;
}

function goToStep(n){
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  currentStep = n;
  document.getElementById(`step-${currentStep}`).classList.add('active');
  updateStepper();
}

function nextStep(){
  if (!canProceed(currentStep)) { alert('Completá este paso antes de continuar.'); return; }
  if (currentStep < totalSteps){
    goToStep(currentStep + 1);
    if (currentStep === 4) calculateResults();
  }
}
function prevStep(){ if (currentStep > 1) goToStep(currentStep - 1); }

function calculateResults(){
  const total = formData.small*1 + formData.medium*2 + formData.large*3;
  const prefs = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(e=>e.value);
  const name  = document.getElementById('name').value.trim();

  document.getElementById('result-text').innerHTML =
    `<strong>Total recomendado:</strong> ${total} productos<br>`+
    `<small>Preferencias: ${prefs.join(', ') || '—'}</small>`;

  const msg = `Hola! Soy ${name}. Quiero mi kit Velaroma.%0A`+
              `Espacios: pequeños ${formData.small}, medianos ${formData.medium}, grandes ${formData.large}.%0A`+
              `Preferencias: ${prefs.join(', ') || '—'}.%0A`+
              `Total recomendado: ${total} productos.`;
  document.querySelector('.whatsapp-final-btn').href = `https://wa.me/?text=${msg}`;
  sendHeight();
}

// Ajustes de altura en eventos comunes
window.addEventListener('load', sendHeight);
window.addEventListener('resize', sendHeight);
new MutationObserver(sendHeight).observe(document.body, { childList:true, subtree:true });

document.addEventListener('DOMContentLoaded', updateStepper);

// Exponer funciones usadas en HTML
window.updateCounter = updateCounter;
window.nextStep = nextStep;
window.prevStep = prevStep;
