/**
 * K ARCHIVE - MILLIONAIRE CLUB ENGINE
 * Handles real-time grid generation and purchase sync
 */

const db = firebase.database();
const grid = document.getElementById('main-grid');
const totalPlots = 100;

// ১. গ্রিড তৈরি এবং লাইভ ডাটা লোড করা
function initMillionaireGrid() {
    grid.innerHTML = ''; 

    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = `plot-${i}`;

        // প্রাথমিক প্রাইস দেখানো
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // রিয়েল-টাইম ডাটা সিঙ্ক (Path: millionaire_pixels)
        db.ref('millionaire_pixels/' + i).on('value', (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                
                if (data.image) {
                    plot.style.backgroundImage = `url('${data.image}')`;
                    plot.style.backgroundSize = 'cover';
                    plot.style.backgroundPosition = 'center';
                    plot.innerHTML = ''; 
                } else {
                    plot.style.backgroundImage = 'none';
                    plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b style="color:#FCD535">${data.name.substring(0, 8)}</b>`;
                }

                plot.onclick = () => {
                    if (data.url && data.url !== "#") {
                        window.open(data.url, '_blank');
                    } else {
                        alert("Owned by: " + data.name);
                    }
                };
            } else {
                plot.style.backgroundImage = 'none';
                plot.onclick = () => {
                    document.getElementById('plotNumber').value = i;
                    openPurchase();
                };
            }
        });

        grid.appendChild(plot);
    }
}

// ২. কাস্টমার যখন 'Confirm' দিবে (অর্ডার পাঠানোর ফাংশন)
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) {
        alert("Please fill in Brand Name and Plot Number.");
        return;
    }

    // ফায়ারবেজে অর্ডার পাঠানো (Path: millionaire_orders)
    const orderData = {
        brand: brand,
        plotNum: plotNum,
        status: "pending",
        orderTime: Date.now()
    };

    db.ref('millionaire_orders').push(orderData).then(() => {
        // এনিমেশন এবং সাকসেস মেসেজ
        const price = Math.round(1000 - (plotNum - 1) * 9.09);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('congrats-msg').innerText = "WELCOME, " + brand.toUpperCase();
        
        const waMsg = encodeURIComponent(`Hello K Archive Concierge,\n\nI want to acquire Millionaire Plot #${plotNum}.\nBrand: ${brand}\nPrice: $${price}\n\nPlease guide me for the next steps.`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
        
        document.getElementById('success-popup').style.display = 'block';
    }).catch((e) => alert("Error: " + e.message));
};

document.addEventListener('DOMContentLoaded', initMillionaireGrid);
