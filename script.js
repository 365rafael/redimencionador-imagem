const uploadInput = document.getElementById('upload');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const qualityInput = document.getElementById('quality');
const processBtn = document.getElementById('process');
const outputImg = document.getElementById('output');
const downloadLink = document.getElementById('download');
const resultDiv = document.getElementById('result');
const maintainAspect = document.getElementById('maintainAspect');

let originalWidth = 0;
let originalHeight = 0;
let img = new Image();
let imgLoaded = false;

// Quando seleciona a imagem
uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Quando a imagem carrega, salva as dimensões originais
img.onload = () => {
  originalWidth = img.width;
  originalHeight = img.height;
  imgLoaded = true;

  // Se não houver valor definido, preenche com os valores originais
  if (!widthInput.value) widthInput.value = originalWidth;
  if (!heightInput.value) heightInput.value = originalHeight;
};

// Atualiza altura ao mudar largura, se "manter proporção" estiver marcado
widthInput.addEventListener('input', () => {
  if (!imgLoaded) return;
  if (maintainAspect.checked) {
    const ratio = originalHeight / originalWidth;
    if (widthInput.value) {
      heightInput.value = Math.round(widthInput.value * ratio);
    }
  }
});

// Atualiza largura ao mudar altura, se "manter proporção" estiver marcado
heightInput.addEventListener('input', () => {
  if (!imgLoaded) return;
  if (maintainAspect.checked) {
    const ratio = originalWidth / originalHeight;
    if (heightInput.value) {
      widthInput.value = Math.round(heightInput.value * ratio);
    }
  }
});

// Ao clicar em redimensionar
processBtn.addEventListener('click', () => {
  if (!imgLoaded) {
    alert('Por favor, selecione uma imagem primeiro.');
    return;
  }

  // Pega os valores, usando os originais caso campo vazio
  const newWidth = widthInput.value ? parseInt(widthInput.value) : originalWidth;
  const newHeight = heightInput.value ? parseInt(heightInput.value) : originalHeight;
  let quality = parseFloat(qualityInput.value);
  if (isNaN(quality) || quality < 0.1 || quality > 1) quality = 0.8;

  // Cria um canvas para desenhar a imagem redimensionada
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  // Gera o blob JPEG com a qualidade definida
  canvas.toBlob(
    blob => {
      const url = URL.createObjectURL(blob);
      outputImg.src = url;
      downloadLink.href = url;
      downloadLink.download = 'imagem.jpg';
      resultDiv.style.display = 'block';
    },
    'image/jpeg',
    quality
  );
});
