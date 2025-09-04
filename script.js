
// const generateForm = document.querySelector(".generate-form");
// const promptInput = document.querySelector(".img-prompt");
// const imageGallery = document.querySelector(".img-gallery");


// const HF_API_KEY = "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"; // Paste your API key here
// const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

// const generateImage = async (prompt) => {
//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${HF_API_KEY}`,
//             },
//             body: JSON.stringify({ inputs: prompt }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "Failed to generate image. The model might be loading.");
//         }

//         const blob = await response.blob();
//         const imgUrl = URL.createObjectURL(blob);
//         return imgUrl;

//     } catch (error) {
//         alert(error.message);
//         return null;
//     }
// };

// const updateImageCard = (imgCard, imgUrl, prompt) => {
//     const imgElement = imgCard.querySelector("img");
//     const downloadBtn = imgCard.querySelector(".download-btn");

//     imgElement.src = imgUrl;

//     downloadBtn.href = imgUrl;
//    downloadBtn.download = `${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
// imgCard.classList.remove("loading");
// };

// // --- Main Handler for Form Submission ---
// const handleImageGeneration = async (e) => {
//     e.preventDefault(); // Prevent the form from submitting and reloading the page

//     const userPrompt = promptInput.value.trim();
//     const imageQuantity = parseInt(document.querySelector("[name='img-quantity']").value);

//     if (!userPrompt) {
//         alert("Please enter a prompt to generate images.");
//         return;
//     }

//     // --- 1. Set Up Loading State ---
//     imageGallery.innerHTML = ""; // Clear previous images
//     for (let i = 0; i < imageQuantity; i++) {
//         const imgCardHtml = `
//             <div class="img-card loading">
//                 <img src="loading.svg" alt="loading...">
//                 <a href="#" class="download-btn">
//                     <img src="download.svg" alt="download icon">
//                 </a>
//             </div>`;
//         imageGallery.insertAdjacentHTML("beforeend", imgCardHtml);
//     }

//     const imgCards = document.querySelectorAll(".img-card");

//     // --- 2. Generate and Update Images ---
//     for (let i = 0; i < imageQuantity; i++) {
//         const imgUrl = await generateImage(userPrompt);
//         if (imgUrl) {
//             updateImageCard(imgCards[i], imgUrl, userPrompt);
//         } else {
//             // If an error occurs, stop the loading animation on that card
//             imgCards[i].classList.remove("loading");
//             // Optional: You could show an error icon on the card itself
//             imgCards[i].querySelector("img").src = "https://static-00.iconduck.com/assets.00/error-icon-512x512-yv02vj0f.png"; // Example error image
//         }
//     }
// };

// // --- Event Listener ---
// generateForm.addEventListener("submit", handleImageGeneration);
const generateForm = document.querySelector(".generate-form");
const promptInput = document.querySelector(".img-prompt");
const imageGallery = document.querySelector(".img-gallery");

const HF_API_KEY = "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"; // Paste your API key here
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

// --- Initialize Download Buttons for Default Images ---
const initializeDefaultImages = () => {
    const imgCards = document.querySelectorAll(".img-card");
    imgCards.forEach((imgCard) => {
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
        const imgSrc = imgElement.src;

        // Only update if the image is not a loading or error image
        if (imgSrc && !imgSrc.includes("loading.svg") && !imgSrc.includes("error-icon")) {
            downloadBtn.href = imgSrc;
            // Use a generic filename for default images, or derive from alt text if available
            const prompt = imgElement.alt || "default-image";
            downloadBtn.download = `${prompt.slice(0, 20).replace(/\s+/g, '-')}.jpg`;
            imgCard.classList.remove("loading");
        }
    });
};

// --- Main Handler for Form Submission ---
const handleImageGeneration = async (e) => {
    e.preventDefault(); // Prevent the form from submitting and reloading the page

    const userPrompt = promptInput.value.trim();
    const imageQuantity = parseInt(document.querySelector("[name='img-quantity']").value);

    if (!userPrompt) {
        alert("Please enter a prompt to generate images.");
        return;
    }

    // --- 1. Set Up Loading State ---
    imageGallery.innerHTML = ""; // Clear previous images
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

    // --- 2. Generate and Update Images ---
    for (let i = 0; i < imageQuantity; i++) {
        const imgUrl = await generateImage(userPrompt);
        if (imgUrl) {
            updateImageCard(imgCards[i], imgUrl, userPrompt);
        } else {
            // If an error occurs, stop the loading animation on that card
            imgCards[i].classList.remove("loading");
            imgCards[i].querySelector("img").src = "https://static-00.iconduck.com/assets.00/error-icon-512x512-yv02vj0f.png";
        }
    }
};

// --- Event Listeners ---
generateForm.addEventListener("submit", handleImageGeneration);
document.addEventListener("DOMContentLoaded", initializeDefaultImages); // Initialize download buttons on page load