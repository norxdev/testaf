// --- Global Data ---
let latestData = {};
let volumesData = {};
let itemMapping = {};
let summaryVisible = true;

// --- Utils ---
function formatNum(num) {
    return Number(num)?.toLocaleString() || '—';
}

// --- Fetch Item Mapping ---
async function fetchItemMappingOnce() {
    if (Object.keys(itemMapping).length > 0) return;
    try {
        const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping");
        const mapping = await res.json();
        mapping.forEach(item => itemMapping[String(item.id)] = item);
    } catch (err) {
        console.warn("Mapping fetch failed", err);
    }
}

// --- Profit Calculation ---
function calculateArmorProfit(set) {
    const totalCost = set.items.reduce((s, i) => s + (latestData.data?.[i.id]?.low || 0), 0);
    const sellPrice = Number(latestData.data?.[set.setId]?.high) || 0;

    const rawTax = sellPrice * 0.02;
    const tax = Math.min(rawTax, 5_000_000);

    const profit = Math.round(sellPrice - tax - totalCost);
    const roi = totalCost ? ((profit / totalCost) * 100).toFixed(2) : 0;

    return { profit, totalCost, roi };
}

// --- Create Armor Sections ---
function createArmorSections() {
    const container = document.getElementById("armorSection");
    if (!container) return;
    container.innerHTML = "";

    armorSetsData.forEach((set, idx) => {
        const div = document.createElement("div");
        div.className = "set-wrapper";
        div.id = `armor-set-${idx}`;
        div.dataset.f2p = set.isF2P ? "true" : "false";
        div.style.display = "none"; // hide initially

        // Full set header with image, cost range, and profit
        const setHeader = `
            <div class="set-header" style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <img src="https://oldschool.runescape.wiki/images/${set.setImgName}.png" 
                     alt="${set.name}" loading="lazy"
                     style="width:80px; height:80px; object-fit:contain; border:1px solid #ccc; border-radius:6px;">
                <div>
                    <h2 style="margin:0 0 4px 0;">${set.name}</h2>
                    <div id="armor-setCostRange-${idx}" style="margin-bottom:2px;">Loading cost...</div>
                    <div id="armor-setProfitRange-${idx}" style="font-weight:bold;">Loading profit...</div>
                    <div id="armor-setVolume-${idx}" style="font-size:0.85rem; color:#555;">Loading volume...</div>
                </div>
            </div>
        `;

        // Pieces grid
        const piecesGrid = `
            <div class="pieces-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:8px;">
                ${set.items.map(it => `
                    <div class="piece-card" style="border:1px solid #ccc; border-radius:6px; padding:6px; text-align:center;">
                        <a href="https://prices.runescape.wiki/osrs/item/${it.id}" target="_blank">
                            <img src="https://oldschool.runescape.wiki/images/${it.imgName}.png" 
                                 alt="${it.name}" loading="lazy"
                                 style="width:48px; height:48px; object-fit:contain;">
                        </a>
                        <div class="piece-name" style="font-size:0.85rem; margin-top:4px;">${it.name}</div>
                        <div class="piece-price" style="font-size:0.85rem; margin-top:2px;">Loading...</div>
                        <div class="piece-volume" style="font-size:0.75rem; color:#555;">Loading...</div>
                    </div>
                `).join("")}
            </div>
        `;

        div.innerHTML = setHeader + piecesGrid;
        container.appendChild(div);
    });
}

// --- Update Prices for Armor Section ---
function updateArmorPrices() {
    armorSetsData.forEach((set, idx) => {
    let totalLow = 0;
    let totalHigh = 0;
    let minVol = Infinity; // for set volume

    set.items.forEach(item => {
        const low = Number(latestData.data?.[item.id]?.low) || 0;
        const high = Number(latestData.data?.[item.id]?.high) || 0;
        const vol = volumesData.data?.[item.id] || 0;

        totalLow += low;
        totalHigh += high;
        if (vol) minVol = Math.min(minVol, vol);

        // update piece cards
        const pieceCards = document.querySelectorAll(`#armor-set-${idx} .piece-card img`);
        let pieceCard = null;
        pieceCards.forEach(img => { if (img.alt === item.name) pieceCard = img.closest(".piece-card"); });
        if (pieceCard) {
            const priceEl = pieceCard.querySelector(".piece-price");
            priceEl.textContent = `Buy: ${formatNum(low)} gp | Sell: ${formatNum(high)} gp`;

            const volEl = pieceCard.querySelector(".piece-volume");
            volEl.textContent = vol ? `Daily vol: ${formatNum(vol)}` : `Daily vol: —`;
        }
    });

    // profit range after 2% tax
    const taxLow = Math.min(totalLow * 0.02, 5_000_000);
    const taxHigh = Math.min(totalHigh * 0.02, 5_000_000);

    const profitLow = totalHigh - taxHigh - totalLow;
    const profitHigh = totalHigh - taxLow - totalLow;

    // update set summary
    const costRangeEl = document.getElementById(`armor-setCostRange-${idx}`);
    if (costRangeEl) costRangeEl.textContent = `Total pieces cost: ${formatNum(totalLow)} gp`;

    const profitRangeEl = document.getElementById(`armor-setProfitRange-${idx}`);
    if (profitRangeEl) {
        const volText = minVol !== Infinity ? ` | Daily sets vol: ${formatNum(minVol)}` : '';
        profitRangeEl.textContent = `Potential profit (after tax): ${formatNum(profitLow)} - ${formatNum(profitHigh)} gp${volText}`;
    }
});

}


// --- Update Volumes for Pieces Only ---
function updateVolumes() {
    armorSetsData.forEach((set, idx) => {
        set.items.forEach(item => {
            const pieceCards = document.querySelectorAll(`#armor-set-${idx} .piece-card img`);
            let pieceCard = null;
            pieceCards.forEach(img => {
                if (img.alt === item.name) pieceCard = img.closest(".piece-card");
            });

            if (pieceCard) {
                const volEl = pieceCard.querySelector(".piece-volume");
                const vol = volumesData.data?.[item.id] || 0;
                volEl.textContent = `Daily vol: ${formatNum(vol)}`;
            }
        });
    });
}


// --- F2P Filter for Armor Section ---
function applyArmorF2PFilter(onlyF2P) {
    armorSetsData.forEach((set, idx) => {
        // Cards
        const cards = document.querySelectorAll(`#armor-set-${idx} .card`);
        cards.forEach(card => {
            const isF2P = card.closest(".set-wrapper").dataset.f2p === "true";
            card.style.display = (onlyF2P && !isF2P) ? "none" : "";
        });

        // Table rows
        set.items.forEach(item => {
            const row = document.getElementById(`armor-table-row-${idx}-${item.id}`);
            if (row) {
                const isF2P = item.isF2P || false;
                row.style.display = (onlyF2P && !isF2P) ? "none" : "";
            }
        });
    });
}


// --- Update Summaries ---
function updateSummaries() {
    const armorSummary = document.getElementById("armorSummary");
    if (!armorSummary) return;

    const list = armorSetsData.map((s, i) => {
        const calc = calculateArmorProfit(s) || {};
        return { ...calc, name: s.name, index: i };
    }).sort((a,b)=>b.profit - a.profit);

    armorSummary.innerHTML = `
        <label style="display:block; margin-bottom:8px;">
            <input type="checkbox" id="f2pFilter"> Show only F2P sets
        </label>
        <table class="summary-table" id="armorSummaryTable">
            <thead>
                <tr>
                    <th>Armor Set</th>
                    <th>Profit per set</th>
                    <th>ROI %</th>
                    <th>Total Pieces Cost</th>
                </tr>
            </thead>
            <tbody>
                ${list.map(l => `
                    <tr class="${l.profit >=0 ? 'profit-positive':'profit-negative'}"
                        data-index="${l.index}" data-f2p="${armorSetsData[l.index].isF2P}">
                        <td>${l.name}</td>
                        <td>${formatNum(l.profit)} gp</td>
                        <td>${l.roi}%</td>
                        <td>${formatNum(l.totalCost)} gp</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("f2pFilter").addEventListener("change", function() {
        applyF2PFilter(this.checked);
        localStorage.setItem("f2pFilter", this.checked ? "true":"false");
    });

    document.querySelectorAll("#armorSummaryTable tbody tr").forEach(row => {
        row.addEventListener("click", () => {
            const idx = row.getAttribute("data-index");
            window.location.hash = `#${armorSetsData[idx].setImgName}`;
            document.querySelector(".main-content").style.display = "none";
            armorSummary.style.display = "none";

            const armorSection = document.getElementById("armorSection");
            armorSection.style.display = "block";

            // hide all except selected
            armorSetsData.forEach((s,i)=>{
                const el = document.getElementById(`armor-set-${i}`);
                if(el) el.style.display = i==idx?"block":"none";
            });

            // scroll top for full page effect
            window.scrollTo({top:0, behavior:"smooth"});
        });
    });
}

// --- Fetch Prices ---
async function fetchLatestPrices() {
    try {
        const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/latest");
        latestData = await res.json();
        updateArmorPrices();
        updateSummaries();
        await fetchDailyVolumes();
    } catch(err){ console.warn("Failed to fetch latest prices", err); }
}

// --- Fetch Daily Volumes ---
async function fetchDailyVolumes() {
    try {
        const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/volumes");
        const data = await res.json();
        volumesData = data;
        updateVolumes();
    } catch(err){ console.warn("Failed to fetch volumes", err); }
}

// --- Init ---
window.addEventListener("load", async () => {
    await fetchItemMappingOnce();
    createArmorSections();
    updateSummaries();

    const armorSection = document.getElementById("armorSection");
    armorSection.style.display = "none"; // hide details by default

    // show selected set if hash exists
    const hash = window.location.hash.substring(1);
    if (hash) {
        const idx = armorSetsData.findIndex(s => s.setImgName === hash);
        if (idx >= 0) {
            document.querySelector(".main-content").style.display = "none";
            document.getElementById("armorSummary").style.display = "none";
            armorSection.style.display = "block";

            armorSetsData.forEach((s, i) => {
                const el = document.getElementById(`armor-set-${i}`);
                if (el) el.style.display = i == idx ? "block" : "none";
            });
        }
    }

    await fetchLatestPrices();
});

// --- Handle hash changes ---
window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    const armorSection = document.getElementById("armorSection");
    const mainContent = document.querySelector(".main-content");
    const armorSummary = document.getElementById("armorSummary");

    if (!hash) {
        // Show main summary again
        mainContent.style.display = "block";
        armorSummary.style.display = "block";
        armorSection.style.display = "none";
        return;
    }

    // Otherwise show the correct armor set page
    const idx = armorSetsData.findIndex(s => s.setImgName === hash);
    if (idx >= 0) {
        mainContent.style.display = "none";
        armorSummary.style.display = "none";
        armorSection.style.display = "block";

        armorSetsData.forEach((s, i) => {
            const el = document.getElementById(`armor-set-${i}`);
            if (el) el.style.display = i === idx ? "block" : "none";
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

