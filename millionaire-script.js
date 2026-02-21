// আপনার বর্তমান সক্রিয় Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    authDomain: "milliondollarhomepage2-71ba3.firebaseapp.com",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
    projectId: "milliondollarhomepage2-71ba3",
    storageBucket: "milliondollarhomepage2-71ba3.firebasestorage.app",
    messagingSenderId: "895107568682",
    appId: "1:895107568682:web:d48003f71701005f3d5f53"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// গ্রিড লোড করার ফাংশন
function initMillionaireGrid() {
    const grid = document.getElementById('main-grid');
    if(!grid) return;
    grid.innerHTML = ''; 

    for (let i = 1; i <= 100; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        
        // লাইভ পিক্সেল ডাটা চেক
        db.ref('millionaire_pixels/' + i).on('value', (snap) => {
            const data = snap.val();
            if (data) {
                plot.style.backgroundImage = `url('${data.image}')`;
                plot.style.backgroundSize = 'cover';
                plot.onclick = () => window.open(data.url || "#", '_blank');
            } else {
                plot.onclick = () => {
                    document.getElementById('plotNumber').value = i;
                    openPurchase(); // পপআপ ওপেন হবে
                };
            }
        });
        grid.appendChild(plot);
    }
}

// কাস্টমার কনফার্ম করলে অর্ডার সাবমিট হবে
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) return alert("সব তথ্য পূরণ করুন!");

    // ডাটাবেজে অর্ডার পাঠানো (Path: millionaire_orders)
    db.ref('millionaire_orders/' + plotNum).set({
        brand: brand,
        plotNum: plotNum,
        time: Date.now()
    }).then(() => {
        confetti({ particleCount: 100, spread: 70 });
        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('success-popup').style.display = 'block';
        
        // হোয়াটসঅ্যাপ লিঙ্ক জেনারেট
        const waMsg = encodeURIComponent(`Plot #${plotNum} Reserve করেছি। নাম: ${brand}`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
    }).catch(e => alert("Error: " + e.message));
};

document.addEventListener('DOMContentLoaded', initMillionaireGrid);
