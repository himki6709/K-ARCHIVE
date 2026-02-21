/**
 * K ARCHIVE - MILLIONAIRE CLUB ENGINE
 * Full Ready Script with Firebase Compat Mode
 */

const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    authDomain: "milliondollarhomepage2-71ba3.firebaseapp.com",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
    projectId: "milliondollarhomepage2-71ba3",
    storageBucket: "milliondollarhomepage2-71ba3.firebasestorage.app",
    messagingSenderId: "895107568682",
    appId: "1:895107568682:web:d48003f71701005f3d5f53",
    measurementId: "G-RG50BVDLTX"
};

// Initialize Firebase (Compat mode for easy use)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// গ্রিড তৈরি এবং ডেটা লোড করার ফাংশন
function initMillionaireGrid() {
    const grid = document.getElementById('main-grid');
    if(!grid) return;
    grid.innerHTML = ''; 

    for (let i = 1; i <= 100; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = `plot-${i}`;

        // প্রাথমিক প্রাইস
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // রিয়েল-টাইম ডেটা চেক (Path: millionaire_pixels)
        db.ref('millionaire_pixels/' + i).on('value', (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                if (data.image) {
                    plot.style.backgroundImage = `url('${data.image}')`;
                    plot.style.backgroundSize = 'cover';
                    plot.innerHTML = ''; 
                } else {
                    plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b style="color:#FCD535">${data.name.substring(0, 8)}</b>`;
                }
                plot.onclick = () => data.url ? window.open(data.url, '_blank') : alert("Owned by: "+data.name);
            } else {
                plot.style.backgroundImage = 'none';
                plot.onclick = () => {
                    document.getElementById('plotNumber').value = i;
                    if(typeof openPurchase === 'function') openPurchase();
                };
            }
        });
        grid.appendChild(plot);
    }
}

// অর্ডার সাবমিট করার ফাংশন
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) {
        alert("Please fill in Brand Name and Plot Number.");
        return;
    }

    // ডাটাবেজে অর্ডার পাঠানো (Path: millionaire_orders)
    db.ref('millionaire_orders').push({
        brand: brand,
        plotNum: plotNum,
        status: "pending",
        orderTime: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        // সাকসেস এনিমেশন
        if(typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('success-popup').style.display = 'block';
        document.getElementById('congrats-msg').innerText = "WELCOME, " + brand.toUpperCase();
        
        const price = Math.round(1000 - (plotNum - 1) * 9.09);
        const waMsg = encodeURIComponent(`Hello K Archive Concierge,\n\nI want Plot #${plotNum}.\nBrand: ${brand}\nPrice: $${price}`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
        
    }).catch((e) => alert("Database Error: " + e.message));
};

document.addEventListener('DOMContentLoaded', initMillionaireGrid);
