const uploadInput = document.getElementById('upload');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const qualityInput = document.getElementById('quality');
const processButton = document.getElementById('process');
const outputImage = document.getElementById('output');
const downloadLink = document.getElementById('download');
const resultDiv = document.getElementById('result');

let imageFile = null;

uploadInput.addEventListener('change', (e) => {
    imageFile = e.target.files[0];
    if (imageFile) {
        const url = URL.createObjectURL(imageFile);
        outputImage.src = url;
        resultDiv.style.display = 'block';
    }
});

processButton.addEventListener('click', () => {
    if (!imageFile) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    img.src = url;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const desiredWidth = parseInt(widthInput.value) || img.width;
        const desiredHeight = parseInt(heightInput.value) || img.height;

        canvas.width = desiredWidth;
        canvas.height = desiredHeight;

        ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

        const quality = parseFloat(qualityInput.value) || 0.8;

        canvas.toBlob((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            outputImage.src = blobUrl;
            downloadLink.href = blobUrl;
            downloadLink.download = `imagem-redimensionada.jpg`;
            resultDiv.style.display = 'block';
        }, 'image/jpeg', quality);
    };
});
