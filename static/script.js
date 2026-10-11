const imageInput = document.getElementById('imageInput');
const fileMeta = document.getElementById('fileMeta');
const dropzone = document.getElementById('dropzone');
const processBtn = document.getElementById('processBtn');
const beforeBox = document.getElementById('beforeBox');
const afterBox = document.getElementById('afterBox');

let selectedFile = null;
let selectedPreviewUrl = "";

const setPlaceholder = (target, text) => {
  target.innerHTML = `<div class="placeholder">${text}</div>`;
};

const updateFileMeta = (name) => {
  fileMeta.textContent = name ? `Selected file: ${name}` : 'No file selected';
};

const renderImagePreview = (target, url, altText) => {
  target.innerHTML = `<img src="${url}" alt="${altText}" />`;
};

const handleFileSelection = (file) => {
  if (!file || !file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    return;
  }

  selectedFile = file;
  updateFileMeta(file.name);

  const previewUrl = URL.createObjectURL(file);
  if (selectedPreviewUrl) {
    URL.revokeObjectURL(selectedPreviewUrl);
  }
  selectedPreviewUrl = previewUrl;

  renderImagePreview(beforeBox, previewUrl, 'Original upload preview');
  setPlaceholder(afterBox, 'Processed image will appear here');
};

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleFileSelection(file);
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragover');
  });
});

dropzone.addEventListener('drop', (event) => {
  const file = event.dataTransfer.files[0];
  handleFileSelection(file);
});

dropzone.addEventListener('click', () => {
  imageInput.click();
});

dropzone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    imageInput.click();
  }
});

processBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    alert('Please upload an image first.');
    return;
  }

  processBtn.disabled = true;
  processBtn.textContent = 'Processing...';
  setPlaceholder(afterBox, 'Processing image...');

  try {
    const formData = new FormData();
    formData.append('image', selectedFile);

    const response = await fetch('/remove-bg', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to remove background.');
    }

    const blob = await response.blob();
    const resultUrl = URL.createObjectURL(blob);

    renderImagePreview(afterBox, resultUrl, 'Background removed result');
  } catch (error) {
    setPlaceholder(afterBox, error.message || 'Something went wrong.');
  } finally {
    processBtn.disabled = false;
    processBtn.textContent = 'Remove Background';
  }
});
