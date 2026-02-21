/**
 * K ARCHIVE - MILLIONAIRE CLUB ENGINE
 * Handles real-time grid generation and purchase sync
 */

const db = firebase.database();
const grid = document.getElementById('main-grid');
const totalPlots = 100;

function initMillionaireGrid() {
    grid.innerHTML = ''; // Clear existing grid

    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = `plot-${i}`;

        // Calculate Initial Price
        const initialPrice = Math.round(1000 - (i - 1) * 9.09);
        plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b>$${initialPrice}</b>`;

        // Real-time Database Sync
        db.ref('pixels/' + i).on('value', (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                
                // If plot is sold and has image
                if (data.image) {
                    plot.style.backgroundImage = `url('${data.image}')`;
                    plot.innerHTML = ''; // Clear text for image view
                } else {
                    plot.style.backgroundImage = 'none';
                    plot.innerHTML = `<span>#${String(i).padStart(3, '0')}</span><b style="color:var(--gold)">${data.name.substring(0, 8)}</b>`;
                }

                // Interaction: Open URL if exists
                plot.onclick = () => {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    } else {
                        alert("Owned by: " + data.name);
                    }
                };
            } else {
                // Plot is empty - default view
                plot.onclick = () => {
                    document.getElementById('plotNumber').value = i;
                    openPurchase();
                };
            }
        });

        grid.appendChild(plot);
    }
}

// Global scope injection for HTML buttons
window.processPurchase = function() {
    const b = document.getElementById('brandName').value;
    const p = document.getElementById('plotNumber').value;
    
    if(!b || !p) {
        alert("Please fill in Brand Name and Plot Number.");
        return;
    }
    
    // Price calculation for auto-message
    const price = Math.round(1000 - (p - 1) * 9.09);

    confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#bf953f', '#000', '#fff'] 
    });

    document.getElementById('purchase-modal').style.display = 'none';
    document.getElementById('congrats-msg').innerText = "WELCOME, " + b.toUpperCase();
    
    const waMsg = encodeURIComponent(`Hello K Archive Concierge,\n\nI want to acquire Millionaire Plot #${p}.\nBrand: ${b}\nPrice: $${price}\n\nPlease guide me for the next steps.`);
    document.getElementById('wa-btn').href = `https://wa.me/8801576940717?text=${waMsg}`;
    
    document.getElementById('success-popup').style.display = 'block';
};

// Start the engine
document.addEventListener('DOMContentLoaded', initMillionaireGrid);
