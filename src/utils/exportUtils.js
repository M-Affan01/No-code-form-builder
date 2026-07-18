export function generateJSONSchema(form) {
  const schema = {
    form: {
      id: form.id,
      title: form.title,
      description: form.description || '',
      fields: form.fields.map(field => ({
        type: field.type,
        id: field.id,
        label: field.label,
        name: field.name || field.id,
        required: field.required || false,
        placeholder: field.placeholder || '',
        validation: field.validation || {},
        options: field.options || []
      })),
      createdAt: form.createdAt,
      updatedAt: form.updatedAt
    },
    submissions: (form.submissions || []).map(sub => ({
      timestamp: sub.timestamp,
      formId: sub.formId,
      data: sub.data,
      submissionId: sub.submissionId
    }))
  }
  return schema
}

export function generateHTML(form) {
  const fieldsHTML = form.fields.map(field => {
    const required = field.required ? 'required' : ''
    const requiredStar = field.required ? ' <span class="required">*</span>' : ''
    const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : ''
    const name = field.name || field.id

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return `    <div class="field-group">
      <label for="${field.id}">${escapeHtml(field.label)}${requiredStar}</label>
      <input type="${field.type}" id="${field.id}" name="${name}" ${placeholder} ${required} class="form-input">
      <span class="error-message" id="${field.id}-error"></span>
    </div>`
      case 'checkbox':
        return `    <div class="field-group">
      <label for="${field.id}" class="checkbox-label">
        <input type="checkbox" id="${field.id}" name="${name}" ${required} class="form-checkbox">
        ${escapeHtml(field.label)}${requiredStar}
      </label>
      <span class="error-message" id="${field.id}-error"></span>
    </div>`
      case 'radio':
        return `    <div class="field-group">
      <label class="radio-group-label">${escapeHtml(field.label)}${requiredStar}</label>
${(field.options || []).map((opt, i) => `      <label for="${field.id}-${i}" class="radio-option">
        <input type="radio" id="${field.id}-${i}" name="${name}" value="${escapeHtml(opt)}" ${required} class="form-radio">
        ${escapeHtml(opt)}
      </label>`).join('\n')}
      <span class="error-message" id="${field.id}-error"></span>
    </div>`
      case 'select':
        return `    <div class="field-group">
      <label for="${field.id}">${escapeHtml(field.label)}${requiredStar}</label>
      <select id="${field.id}" name="${name}" ${required} class="form-select">
        <option value="">Select...</option>
${(field.options || []).map(opt => `        <option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('\n')}
      </select>
      <span class="error-message" id="${field.id}-error"></span>
    </div>`
      case 'file':
        return `    <div class="field-group">
      <label for="${field.id}">${escapeHtml(field.label)}${requiredStar}</label>
      <input type="file" id="${field.id}" name="${name}" ${required} class="form-file">
      <span class="file-hint">Max size: ${field.validation?.maxSize || 10}MB</span>
      <span class="error-message" id="${field.id}-error"></span>
    </div>`
      default:
        return ''
    }
  }).join('\n\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(form.title)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="form-container">
    <h1 class="form-title">${escapeHtml(form.title)}</h1>
${form.description ? `    <p class="form-description">${escapeHtml(form.description)}</p>\n` : ''}
    <form id="${form.id}" class="form-builder-form" onsubmit="return handleSubmit(event)">
${fieldsHTML}

      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit</button>
        <button type="reset" class="reset-btn">Reset</button>
      </div>
    </form>
    <div id="form-message" class="form-message"></div>
    <div id="form-data" class="form-data"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
}

export function generateCSS() {
  return `/* No-code Form Builder - Generated Styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-description {
  color: #666;
  margin-bottom: 1.5rem;
}

.field-group {
  margin-bottom: 1.5rem;
}

.field-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: #333;
}

.required {
  color: #e53e3e;
  font-weight: 700;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-input.error, .form-select.error {
  border-color: #e53e3e;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.form-checkbox, .form-radio {
  margin-right: 0.5rem;
  cursor: pointer;
}

.radio-group-label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
}

.radio-option {
  display: block;
  margin: 0.3rem 0;
  font-weight: normal;
  cursor: pointer;
}

.form-file {
  display: block;
  margin: 0.5rem 0;
}

.file-hint {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.3rem;
}

.error-message {
  display: none;
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.error-message.show {
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn {
  background: #4299e1;
  color: white;
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover { background: #3182ce; }

.reset-btn {
  background: #e2e8f0;
  color: #333;
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover { background: #cbd5e0; }

.form-message {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 4px;
  display: none;
}

.form-message.success {
  display: block;
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.form-message.error {
  display: block;
  background: #fed7d7;
  color: #9b2c2c;
  border: 1px solid #feb2b2;
}

.form-data {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  display: none;
}

@media (max-width: 640px) {
  .form-container { margin: 1rem; padding: 1rem; }
  .form-actions { flex-direction: column; }
  .submit-btn, .reset-btn { width: 100%; }
}`
}

export function generateJS(form) {
  const validationRules = {}
  form.fields.forEach(field => {
    const name = field.name || field.id
    validationRules[name] = {
      type: field.type,
      required: field.required || false,
      requiredMessage: `${field.label || field.name} is required`,
      ...field.validation
    }
  })

  return `// No-code Form Builder - Generated Script
(function() {
  const form = document.getElementById('${form.id}');
  const messageEl = document.getElementById('form-message');
  const dataEl = document.getElementById('form-data');
  const validationRules = ${JSON.stringify(validationRules, null, 2)};

  function validateField(field, value) {
    const name = field.name || field.id;
    const rules = validationRules[name];
    const errorEl = document.getElementById(field.id + '-error');
    if (!rules) return true;
    let isValid = true;
    let errorMessage = '';

    if (rules.required && (!value || value.trim() === '')) {
      isValid = false;
      errorMessage = rules.requiredMessage;
    }

    if (value && isValid) {
      switch (rules.type) {
        case 'email':
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'number':
          var num = parseFloat(value);
          if (isNaN(num)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
          } else {
            if (rules.min !== '' && rules.min !== null && num < parseFloat(rules.min)) {
              isValid = false;
              errorMessage = 'Value must be at least ' + rules.min;
            }
            if (rules.max !== '' && rules.max !== null && num > parseFloat(rules.max)) {
              isValid = false;
              errorMessage = 'Value must be at most ' + rules.max;
            }
          }
          break;
        case 'text':
          if (rules.minLength && value.length < parseInt(rules.minLength)) {
            isValid = false;
            errorMessage = 'Minimum ' + rules.minLength + ' characters required';
          } else if (rules.maxLength && value.length > parseInt(rules.maxLength)) {
            isValid = false;
            errorMessage = 'Maximum ' + rules.maxLength + ' characters allowed';
          } else if (rules.pattern) {
            try {
              if (!new RegExp(rules.pattern).test(value)) {
                isValid = false;
                errorMessage = rules.customError || 'Invalid format';
              }
            } catch(e) {}
          }
          break;
      }
    }

    if (errorEl) {
      if (!isValid) {
        errorEl.textContent = errorMessage;
        errorEl.classList.add('show');
        field.classList.add('error');
      } else {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
        field.classList.remove('error');
      }
    }
    return isValid;
  }

  function validateForm() {
    var fields = form.querySelectorAll('input, select, textarea');
    var valid = true;
    fields.forEach(function(f) { if (!validateField(f, f.value)) valid = false; });
    return valid;
  }

  function getFormData() {
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function(val, key) { data[key] = val; });
    return data;
  }

  window.handleSubmit = function(e) {
    e.preventDefault();
    if (!validateForm()) {
      showMessage('Please fix the errors before submitting', 'error');
      return false;
    }
    var data = getFormData();
    showMessage('Form submitted successfully!', 'success');
    dataEl.style.display = 'block';
    dataEl.textContent = JSON.stringify(data, null, 2);
    console.log('Form Data:', data);
    return false;
  };

  function showMessage(msg, type) {
    messageEl.textContent = msg;
    messageEl.className = 'form-message ' + type;
    if (type === 'success') {
      setTimeout(function() { messageEl.style.display = 'none'; }, 5000);
    }
  }

  form.addEventListener('input', function(e) { validateField(e.target, e.target.value); });
  form.addEventListener('change', function(e) { validateField(e.target, e.target.value); });
  form.addEventListener('reset', function() {
    setTimeout(function() {
      messageEl.style.display = 'none';
      dataEl.style.display = 'none';
      form.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
      form.querySelectorAll('.error-message').forEach(function(el) { el.classList.remove('show'); el.textContent = ''; });
    }, 10);
  });
})();`
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadJSON(data, filename) {
  downloadFile(JSON.stringify(data, null, 2), filename, 'application/json')
}
