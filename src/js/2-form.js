const formData = {
  email: '',
  message: '',
};

const refs = {
  emailInput: document.querySelector('.email-input'),
  textInput: document.querySelector('.message-input'),
  feedbackForm: document.querySelector('.feedback-form'),
};

const storedFormData = localStorage.getItem('feedback-form-state');
if (storedFormData) {
  const parsedData = JSON.parse(storedFormData);
  refs.emailInput.value = parsedData.email;
  refs.textInput.value = parsedData.message;
  Object.assign(formData, parsedData);
}

function saveFormDataToLocalStorage() {
  localStorage.setItem('feedback-form-state', JSON.stringify(formData));
}

function onFormSubmit(event) {
  event.preventDefault();
  if (refs.emailInput.value.trim() === '' || formData.message.trim() === '') {
    alert('Please fill all fields');
    return;
  }
  console.log(formData);
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
  localStorage.removeItem('feedback-form-state');
  refs.feedbackForm.reset();
}

refs.emailInput.addEventListener('input', event => {
  const inputValue = event.target.value.trim();
  formData.email = inputValue;
  saveFormDataToLocalStorage();
});

refs.textInput.addEventListener('input', event => {
  const messageValue = event.target.value;
  formData.message = messageValue;
  saveFormDataToLocalStorage();
});

refs.feedbackForm.addEventListener('submit', onFormSubmit);
