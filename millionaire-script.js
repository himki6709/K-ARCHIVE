/**
 * K ARCHIVE - MILLIONAIRE CLUB ENGINE
 * Handles real-time grid generation and purchase sync
 */

const db = firebase.database();
const grid = document.getElementById('main-grid');
const totalPlots = 100;

// গ্রিড তৈরি এবং ডেটা লোড করার ফাংশন
function initMillionaireGrid() {
    grid.innerHTML = ''; // গ্রিড রিসেট

    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = `plot-${i}`;

        // প্রাথমিক প্রাইস ক্যালকুলেশন
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // ফায়ারবেজ থেকে রিয়েল-টাইম ডেটা চেক (Path: millionaire_pixels)
        db.ref('millionaire_pixels/' + i).on('value', (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                
                // যদি প্লট বিক্রি হয়ে যায় এবং ছবি থাকে
                if (data.image) {
                    plot.style.backgroundImage = `url('${data.image}')`;
                    plot.style.backgroundSize = 'cover';
                    plot.style.backgroundPosition = 'center';
                    plot.innerHTML = ''; // ছবি থাকলে টেক্সট মুছে যাবে
                } else {
                    plot.style.backgroundImage = 'none';
                    plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b style="color:var(--gold)">${data.name.substring(0, 8)}</b>`;
                }

                // ক্লিক করলে লিংকে নিয়ে যাবে
                plot.onclick = () => {
                    if (data.url && data.url !== "#") {
                        window.open(data.url, '_blank');
                    } else {
                        alert("Owned by: " + data.name);
                    }
                };
            } else {
                // প্লট খালি থাকলে কেনার অপশন আসবে
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

// কাস্টমার যখন 'Confirm' বাটনে ক্লিক করবে
window.processPurchase = function() {
    const brand = document.getElementById('brandName').value;
    const plotNum = document.getElementById('plotNumber').value;
    
    if(!brand || !plotNum) {
        alert("Please fill in Brand Name and Plot Number.");
        return;
    }

    // ১. ফায়ারবেজে অর্ডার পাঠানো (যাতে অ্যাডমিন প্যানেলে দেখা যায়)
    const orderData = {
        brand: brand,
        plotNum: plotNum,
        status: "pending",
        timestamp: Date.now()
    };

    // millionaire_orders পাথে ডেটা সেভ হচ্ছে
    db.ref('millionaire_orders').push(orderData).then(() => {
        
        // ২. অর্ডার সফল হলে কনফেটি এনিমেশন
        const price = Math.round(1000 - (plotNum - 1) * 9.09);
        confetti({ 
            particleCount: 100, 
            spread: 70, 
            origin: { y: 0.6 }, 
            colors: ['#bf953f', '#000', '#fff'] 
        });

        // ৩. পপআপ দেখানো এবং হোয়াটসঅ্যাপ লিংক তৈরি
        document.getElementById('purchase-modal').style.display = 'none';
        document.getElementById('congrats-msg').innerText = "WELCOME, " + brand.toUpperCase();
        
        const waMsg = encodeURIComponent(`Hello K Archive Concierge,\n\nI want to acquire Millionaire Plot #${plotNum}.\nBrand: ${brand}\nPrice: $${price}\n\nPlease guide me for the next steps.`);
        document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
        
        document.getElementById('success-popup').style.display = 'block';

    }).catch((error) => {
        alert("Database Error: " + error.message);
    });
};

// পেজ লোড হলে ইঞ্জিন স্টার্ট হবে
document.addEventListener('DOMContentLoaded', initMillionaireGrid);
