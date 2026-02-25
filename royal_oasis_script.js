/**
 * PROJECT: ARK ENTERPRISE - ROYAL OASIS
 * ENGINE: CORE INTELLIGENCE (CEO EDITION)
 * VERSION: 3.0.1 (STABLE)
 */

// 1. Core Configuration & Firebase Handshake
const firebaseConfig = {
    apiKey: "AIzaSyCAdnfu2R82xbC7H85n_9mvQBE58X3TjbA",
    authDomain: "the-5k-elite-legacy.firebaseapp.com",
    databaseURL: "https://the-5k-elite-legacy-default-rtdb.firebaseio.com",
    projectId: "the-5k-elite-legacy",
    storageBucket: "the-5k-elite-legacy.firebasestorage.app",
    messagingSenderId: "440824313752",
    appId: "1:440824313752:web:2c93344dcfe2ba0a4c5ded"
};

// Initialize Connection
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

/**
 * 2. Intelligent Grid Engine
 * ৩৫টি প্লট জেনারেট করা এবং রিয়েল-টাইম স্ট্যাটাস চেক করা
 */
const initializeLegacyGrid = () => {
    const gridDisplay = document.getElementById('gridDisplay');
    if (!gridDisplay) return;

    // Listen for Real-time Updates from Database
    db.ref('royal_oasis').on('value', (snapshot) => {
        const activePlots = snapshot.val() || {};
        gridDisplay.innerHTML = ''; // Refresh Grid

        for (let i = 1; i <= 35; i++) {
            const plotID = `ROYAL-${String(i).padStart(2, '0')}`;
            const isSold = activePlots[plotID] ? true : false;
            
            // Dynamic Pricing Algorithm (CEO Standard)
            const row = Math.floor((i - 1) / 5);
            let price;
            if (row === 0) price = 99;      // Corner Rows (Premium)
            else if (row === 1) price = 89; // Secondary
            else if (row === 2) price = 59; // Third (Standard)
            else price = 39;                // Remaining

            // Create Visual Element
            const plotElement = document.createElement('div');
            plotElement.className = `plot-unit ${isSold ? 'sold' : ''}`;
            
            // Logic for interaction
            if (!isSold) {
                plotElement.onclick = () => openAcquisitionPortal(i, price);
            }

            plotElement.innerHTML = `
                <div class="plot-glow"></div>
                <span class="plot-num">${plotID}</span>
                <span class="plot-val">${isSold ? 'OWNED' : '$' + price}</span>
            `;
            
            gridDisplay.appendChild(plotElement);
        }
    });
};

/**
 * 3. Acquisition Portal Control
 * মডাল ওপেন এবং ক্লোজ করার সিস্টেম
 */
const openAcquisitionPortal = (id, price) => {
    const portal = document.getElementById('portal');
    const plotInput = document.getElementById('plotTag');
    
    if (portal && plotInput) {
        plotInput.value = id;
        portal.style.display = 'flex';
        // Log to console for audit
        console.log(`[SYSTEM] Initializing protocol for Plot ROYAL-${id} | Price: $${price}`);
    }
};

const closeGate = () => {
    const portal = document.getElementById('portal');
    if (portal) portal.style.display = 'none';
};

/**
 * 4. Execution Logic (Transaction Request)
 * ডাটাবেসে তথ্য পাঠানো এবং হোয়াটসঅ্যাপ অটোমেশন
 */
const executeAcquisition = () => {
    const brandIdentity = document.getElementById('brandTag').value.trim();
    const coordinate = document.getElementById('plotTag').value;

    if (!brandIdentity || !coordinate) {
        triggerFeedback("Incomplete Data. Access Denied.");
        return;
    }

    const finalID = `ROYAL-${String(coordinate).padStart(2, '0')}`;
    
    // CEO Direct Submission
    db.ref('orders/' + finalID).set({
        brand: brandIdentity,
        plot: finalID,
        status: "Reservation Pending",
        security_token: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        launchSuccessSequence(brandIdentity, finalID);
    }).catch(err => {
        console.error("[ERROR] Execution failed:", err);
    });
};

/**
 * 5. Success Sequence & Animation
 */
const launchSuccessSequence = (brand, id) => {
    // Visual Celebration
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#00FFCC', '#FFFFFF']
    });

    closeGate();

    // Prepare Automation Link
    const message = `ARK_CONCIERGE_PROTOCOL\n----------------------\nACQUISITION REQUEST\nBRAND: ${brand}\nPLOT_ID: ${id}\nSTATUS: READY_FOR_ACTIVATION`;
    const waLink = `https://wa.me/8801576940717?text=${encodeURIComponent(message)}`;

    // Redirect with style
    setTimeout(() => {
        window.open(waLink, '_blank');
        location.reload();
    }, 1500);
};

/**
 * 6. Visual Utilities
 */
const triggerFeedback = (msg) => {
    alert(msg); // CEO prefers a cleaner custom UI, but using alert for core stability
};

// Start System
window.onload = () => {
    console.log("%c ARK ENTERPRISE | ROYAL OASIS ENGINE ACTIVE ", "background: #D4AF37; color: #000; font-weight: bold;");
    initializeLegacyGrid();
};
