// New Firebase Config
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

// গ্রিড জেনারেশন
function initMillionaireGrid() {
    const grid = document.getElementById('main-grid');
    if(!grid) return;
    grid.innerHTML = ''; 

    for (let i = 1; i <= 100; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // লাইভ ডাটা চেক (Path: millionaire_pixels)
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
                    if(typeof openPurchase === 'function') openPurchase(); 
                };
            }
        });
        grid.appendChild(plot);
    }
}

// অর্ডার সাবমিট ফাংশন
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) {
        alert("Please fill all details!");
        return;
    }

    // অর্ডার ডাটাবেজে পাঠানো (Path: millionaire_orders)
    db.ref('millionaire_orders').push({
        brand: brand,
        plotNum: plotNum,
        time: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        if(typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('success-popup').style.display = 'block';
        
        const price = Math.round(1000 - (plotNum - 1) * 9.09);
        const waMsg = encodeURIComponent(`Hello, I want Plot #${plotNum}.\nBrand: ${brand}\nPrice: $${price}`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
    }).catch(e => {
        console.error(e);
        alert("Rules Error: ডাটাবেজ অনুমতি দিচ্ছে না। ফায়ারবেজ রুলস চেক করুন।");
    });
};

document.addEventListener('DOMContentLoaded', initMillionaireGrid);
