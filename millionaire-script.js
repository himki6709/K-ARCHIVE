/**
 * K ARCHIVE - MILLIONAIRE CLUB ENGINE
 * Updated with New Firebase Config
 */

const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    authDomain: "milliondollarhomepage2-71ba3.firebaseapp.com",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
    projectId: "milliondollarhomepage2-71ba3",
    storageBucket: "milliondollarhomepage2-71ba3.firebasestorage.app",
    messagingSenderId: "895107568682",
    appId: "1:895107568682:web:d48003f71701005f3d5f53"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const grid = document.getElementById('main-grid');

function initMillionaireGrid() {
    if(!grid) return;
    grid.innerHTML = ''; 

    for (let i = 1; i <= 100; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = `plot-${i}`;
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // লাইভ ডাটা লোড (millionaire_pixels)
        db.ref('millionaire_pixels/' + i).on('value', (snap) => {
            const data = snap.val();
            if (data) {
                if (data.image) {
                    plot.style.backgroundImage = `url('${data.image}')`;
                    plot.style.backgroundSize = 'cover';
                    plot.innerHTML = ''; 
                } else {
                    plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b style="color:#FCD535">${data.name}</b>`;
                }
                plot.onclick = () => data.url ? window.open(data.url, '_blank') : alert("Owned by: "+data.name);
            } else {
                plot.onclick = () => { 
                    document.getElementById('plotNumber').value = i;
                    openPurchase(); 
                };
            }
        });
        grid.appendChild(plot);
    }
}

// কাস্টমার অর্ডার সাবমিট করলে এখানে আসবে
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) return alert("Please fill all details!");

    // ডাটাবেজে অর্ডার পাঠানো (millionaire_orders)
    db.ref('millionaire_orders').push({
        brand: brand,
        plotNum: plotNum,
        time: Date.now()
    }).then(() => {
        // এনিমেশন এবং মেসেজ
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('success-popup').style.display = 'block';
        
        const price = Math.round(1000 - (plotNum - 1) * 9.09);
        const waMsg = encodeURIComponent(`Hello, I want Plot #${plotNum}.\nBrand: ${brand}\nPrice: $${price}`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
    }).catch(e => alert("Error: " + e.message));
};

document.addEventListener('DOMContentLoaded', initMillionaireGrid);
