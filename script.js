const generateForm = document.querySelector(".generate-form");
const promptInput = document.querySelector(".img-prompt");
const imageGallery = document.querySelector(".img-gallery");

const HF_API_KEY = "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";
const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const generateImage = async (prompt) => {
   
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_API_KEY}`,
            },
            body: JSON.stringify({ inputs: prompt }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate image. The model might be loading.");
        }
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        return imgUrl;

    } catch (error) {
        alert(error.message);
        return null;
    }
};

const updateImageCard = (imgCard, imgUrl, prompt) => {
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    imgElement.src = imgUrl;
    downloadBtn.href = imgUrl;
    downloadBtn.download = `${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
    imgCard.classList.remove("loading");
};

const initializeDefaultImages = () => {
    const imgCards = document.querySelectorAll(".img-card");
    imgCards.forEach((imgCard) => {
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
        const imgSrc = imgElement.src;

        if (imgSrc && !imgSrc.includes("loading.svg") && !imgSrc.includes("error-icon")) {
            downloadBtn.href = imgSrc;
            const prompt = imgElement.alt || "default-image";
            downloadBtn.download = `${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
            imgCard.classList.remove("loading");
        }
    });
};

const handleImageGeneration = async (e) => {
    e.preventDefault(); 
    const userPrompt = promptInput.value.trim();
    const imageQuantity = parseInt(document.querySelector("[name='img-quantity']").value);
    if (!userPrompt) {
        alert("Please enter a prompt to generate images.");
        return;
    }

    imageGallery.innerHTML = "";//clear all html inside it
    for (let i = 0; i < imageQuantity; i++) {
        const imgCardHtml = `
            <div class="img-card loading">
                <img src="loading.svg" alt="loading...">
                <a href="#" class="download-btn">
                    <img src="download.svg" alt="download icon">
                </a>
            </div>`;
        imageGallery.insertAdjacentHTML("beforeend", imgCardHtml);
    }

    const imgCards = document.querySelectorAll(".img-card");

   
    for (let i = 0; i < imageQuantity; i++) { //if 3 than its 0,1,2
        const imgUrl = await generateImage(userPrompt);
        if (imgUrl) {
            updateImageCard(imgCards[i], imgUrl, userPrompt);
        } else {
            imgCards[i].classList.remove("loading");
            imgCards[i].querySelector("img").src = "https://static-00.iconduck.com/assets.00/error-icon-512x512-yv02vj0f.png";
        }
    }
};

generateForm.addEventListener("submit", handleImageGeneration);
document.addEventListener("DOMContentLoaded", initializeDefaultImages); // Initialize download buttons on page load