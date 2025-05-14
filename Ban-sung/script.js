const words = [
    "Hello", "Nice", "The Best", "Easy", "Next will be very easy", 
    "Supercalifragilisticexpialidocious", "Pneumonoultramicroscopicsilicovolcanoconiosis",
    "Fantastic", "Wonderful", "Great", "Amazing", "Super", "Cool", "Awesome",
    "Brilliant", "Excellent", "Perfect", "Splendid", "Marvelous", "Terrific", "Fabulous", "Outstanding"
];
let currentWordIndex = 0, score = 0, attempts = 0;
const maxAttempts = 3;
let recognition;
let isSpeaking = false;

const wordDisplay = document.getElementById("word");
const scoreDisplay = document.getElementById("score");
const totalDisplay = document.getElementById("total");
const startBtn = document.getElementById("start-btn");
const answerBtn = document.getElementById("answer-btn");
const errorDisplay = document.getElementById("error");
const speechText = document.getElementById("speech-text");
const statusBar = document.getElementById("status-bar");
const progress = document.getElementById("progress");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const restartBtn = document.getElementById("restart-btn");
const bullet = document.getElementById("bullet");
const tankBullet = document.getElementById("tank-bullet");
const tank = document.getElementById("tank");
const soldier = document.getElementById("soldier");

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase();
        speechText.textContent = spokenWord;
        const currentWord = words[currentWordIndex].toLowerCase();

        statusBar.classList.add("active");
        if (spokenWord === currentWord) {
            progress.classList.add("correct");
            progress.style.width = "100%";
            progress.textContent = "Chúc mừng!";
            shootBullet(true);
            score++;
            scoreDisplay.textContent = score;
            console.log("Đúng, bắn đạn từ soldier!");
            setTimeout(nextWord, 1000);
        } else {
            progress.classList.add("wrong");
            progress.style.width = "100%";
            progress.textContent = "Sai rồi!";
            attempts++;
            if (attempts >= maxAttempts) {
                showModal("Bạn đã thua!");
            } else {
                shootBullet(false);
                errorDisplay.textContent = `Sai rồi! Còn ${maxAttempts - attempts} lần thử.`;
                console.log("Sai, bắn đạn từ tank!");
            }
        }
        setTimeout(() => {
            statusBar.classList.remove("active");
            progress.classList.remove("correct", "wrong");
            progress.style.width = "0";
            progress.textContent = "";
        }, 1000);
        isSpeaking = false;
        answerBtn.disabled = false;
    };

    recognition.onerror = () => {
        errorDisplay.textContent = "Không phát hiện thấy giọng nói. Vui lòng thử lại!";
        isSpeaking = false;
        answerBtn.disabled = false;
    };

    recognition.onend = () => {
        isSpeaking = false;
        answerBtn.disabled = false;
    };
} else {
    alert("Trình duyệt không hỗ trợ nhận diện giọng nói!");
}

startBtn.addEventListener("click", () => {
    wordDisplay.textContent = words[currentWordIndex];
    answerBtn.disabled = false;
    errorDisplay.textContent = "";
    speechText.textContent = "";
    wordDisplay.classList.add("fade-in");
});

answerBtn.addEventListener("click", () => {
    if (!isSpeaking) {
        answerBtn.disabled = true;
        isSpeaking = true;
        recognition.start();
    }
});

function nextWord() {
    currentWordIndex++;
    if (currentWordIndex >= words.length) {
        showModal("Chúc mừng! Bạn đã thắng!");
    } else {
        wordDisplay.textContent = words[currentWordIndex];
        wordDisplay.classList.add("fade-in");
        attempts = 0;
        errorDisplay.textContent = "";
        speechText.textContent = "";
    }
}

function resetGame() {
    currentWordIndex = 0;
    score = 0;
    attempts = 0;
    scoreDisplay.textContent = score;
    wordDisplay.textContent = "Nhấn 'Bắt đầu' để chơi!";
    answerBtn.disabled = true;
    errorDisplay.textContent = "";
    speechText.textContent = "";
    tank.style.transform = "scale(1)";
    soldier.style.transform = "scale(1)";
    modal.style.display = "none";
    bullet.style.left = "100px"; // Reset về soldier
    bullet.style.display = "none"; // Ẩn ngay từ đầu
    tankBullet.style.left = "450px"; // Reset về tank
    tankBullet.style.display = "none"; // Ẩn ngay từ đầu
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "flex";
}

restartBtn.addEventListener("click", resetGame);

function shootBullet(hit) {
    // Ẩn cả hai viên đạn và reset trạng thái trước khi bắn
    bullet.style.display = "none";
    bullet.style.left = "100px"; // Reset về soldier
    tankBullet.style.display = "none";
    tankBullet.style.left = "450px"; // Reset về tank
    console.log("Trước khi bắn: bullet.display =", bullet.style.display, "bullet.left =", bullet.style.left, "tankBullet.display =", tankBullet.style.display, "tankBullet.left =", tankBullet.style.left);

    if (hit) {
        // Soldier bắn tank (khi đúng)
        bullet.style.left = "100px"; // Đặt tại soldier
        bullet.style.bottom = "80px";
        bullet.style.display = "block"; // Hiển thị ngay tại soldier
        console.log("Đạn xuất hiện tại soldier, vị trí:", bullet.style.left);

        // Bắn tới tank
        setTimeout(() => {
            bullet.style.left = "450px";
            console.log("Đạn bắn tới tank, vị trí:", bullet.style.left);
        }, 10);

        // Ẩn và reset về soldier
        setTimeout(() => {
            bullet.style.display = "none";
            tank.style.transform = "scale(0.8)";
            bullet.style.left = "100px"; // Reset về soldier
            console.log("Đạn ẩn và reset về soldier, vị trí:", bullet.style.left);
        }, 600); // 600ms để đảm bảo transition hoàn tất
    } else {
        // Tank bắn soldier (khi sai)
        tankBullet.style.left = "450px"; // Đặt tại tank
        tankBullet.style.bottom = "50px";
        tankBullet.style.display = "block"; // Hiển thị ngay tại tank
        console.log("Đạn xuất hiện tại tank, vị trí:", tankBullet.style.left);

        // Bắn tới soldier
        setTimeout(() => {
            tankBullet.style.left = "100px";
            console.log("Đạn bắn tới soldier, vị trí:", tankBullet.style.left);
        }, 10);

        // Ẩn và reset về tank
        setTimeout(() => {
            tankBullet.style.display = "none";
            soldier.style.transform = "scale(0.8)";
            tankBullet.style.left = "450px"; // Reset về tank
            console.log("Đạn ẩn và reset về tank, vị trí:", tankBullet.style.left);
        }, 600); // 600ms để đảm bảo transition hoàn tất
    }
}

totalDisplay.textContent = words.length;