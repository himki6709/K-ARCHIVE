aconst firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    authDomain: "milliondollarhomepage2-71ba3.firebaseapp.com",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
    projectId: "milliondollarhomepage2-71ba3",
    storageBucket: "milliondollarhomepage2-71ba3.firebasestorage.app",
    messagingSenderId: "895107568682",
    appId: "1:895107568682:web:d48003f71701005f3d5f53"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas'), ctx = cv.getContext('2d');
const tooltip = document.getElementById('legacy-tooltip');
const blockSize = 30; const cols = 100; const rows = 200; 
cv.width = cols * blockSize; cv.height = rows * blockSize;

let pixels = {};
const imgCache = {};

// ম্যাপ রেন্ডার করা
function render() {
    ctx.fillStyle = "#1E2329"; // ব্যাকগ্রাউন্ড কালার
    ctx.fillRect(0, 0, cv.width, cv.height);

    Object.values(pixels).forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const x = (id % cols) * blockSize;
        const y = Math.floor(id / cols) * blockSize;

        if (p.imageUrl) {
            if (imgCache[p.imageUrl]) {
                ctx.drawImage(imgCache[p.imageUrl], x, y, blockSize, blockSize);
            } else {
                const img = new Image();
                img.src = p.imageUrl;
                img.onload = () => {
                    imgCache[p.imageUrl] = img;
                    ctx.drawImage(img, x, y, blockSize, blockSize);
                };
            }
        }
    });
}

// ডাটাবেজ থেকে পিক্সেল ডাটা আনা
db.ref('pixels').on('value', s => {
    pixels = s.val() || {};
    render();
    document.getElementById('sold-count').innerText = Object.keys(pixels).length;
    document.getElementById('rem-count').innerText = 20000 - Object.keys(pixels).length;
});

// টুলটিপ লজিক
cv.addEventListener('mousemove', (e) => {
    const rect = cv.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width / cv.width);
    const y = (e.clientY - rect.top) / (rect.height / cv.height);
    let found = false;
    
    Object.values(pixels).forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const px = (id % cols) * blockSize; 
        const py = Math.floor(id / cols) * blockSize;
        
        if (x >= px && x <= px + blockSize && y >= py && y <= py + blockSize) {
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 15) + 'px'; 
            tooltip.style.top = (e.pageY + 15) + 'px';
            tooltip.innerHTML = `<strong>${p.name}</strong><br>Plot #${p.plotID}`;
            cv.style.cursor = 'pointer'; found = true;
        }
    });
    if (!found) { tooltip.style.display = 'none'; cv.style.cursor = 'default'; }
});
