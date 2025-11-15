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

// --- Refresh Tracking ---
let lastRefresh = Date.now(); // start with now instead of "Never"
let refreshInterval = null;

function getFreshnessColor() {
    if (!lastRefresh) return "#888"; // neutral if no refresh
    const diff = (Date.now() - lastRefresh) / 1000; // seconds
    if (diff < 120) return "green";      
    if (diff < 300) return "yellow";     
    return "red";                         
}

function formatTimeAgo(ms) {
    const diff = Math.floor((Date.now() - ms)/1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    return `${Math.floor(diff/3600)}h ago`;
}

function updateRefreshIndicator() {
    const dot = document.querySelector(".refresh-dot");
    const timeEl = document.getElementById("refreshTime");
    if (!dot || !timeEl) return;

    dot.style.backgroundColor = getFreshnessColor();
    timeEl.textContent = lastRefresh ? formatTimeAgo(lastRefresh) : "";
}

async function refreshData() {
    lastRefresh = Date.now();
    updateRefreshIndicator();
    await fetchLatestPrices(); // your existing function
}

// auto-update the freshness indicator every 15s
function startRefreshTicker() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(updateRefreshIndicator, 15000);
}

// Start the ticker
window.addEventListener("load", () => {
    startRefreshTicker();
    updateRefreshIndicator(); // show last refresh immediately
});



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

        // Each piece shown as its own row
        const piecesList = `
            <div class="pieces-list">
                ${set.items.map(it => `
                    <div class="piece-card">
                        <div class="piece-left">
                            <div class="piece-icon-box">
                                <a href="https://prices.runescape.wiki/osrs/item/${it.id}" target="_blank">
                                    <img src="https://oldschool.runescape.wiki/images/${it.imgName}.png" 
                                         alt="${it.name}" loading="lazy" class="piece-icon">
                                </a>
                            </div>
                            <div class="piece-info">
                                <div class="piece-name">${it.name}</div>
                                <div class="piece-volume">Loading volume...</div>
                            </div>
                        </div>
                        <div class="piece-price-buy">Loading...</div>
                    </div>
                `).join("")}
            </div>
        `;

        // Total buy cost below pieces
        const totalBuyDiv = `<div class="set-total-buy">Loading total buy cost...</div>`;

        // Set info with image inside the set info container
       // Set info with image inside the set info container
const setBottom = `
    <div class="set-main-card">
        <!-- Set info (icon + name + volume + sell price) -->
        <div class="piece-card set-main-info">
            <div class="piece-left">
                <div class="piece-icon-box">
                    <img src="https://oldschool.runescape.wiki/images/${set.setImgName}.png"
                         alt="${set.name}" loading="lazy"
                         onclick="window.open('https://prices.runescape.wiki/osrs/item/${set.setId}', '_blank')">
                </div>
                <div class="piece-info">
                    <div class="piece-name">${set.name}</div>
                    <div class="piece-volume" id="armor-setVolume-${idx}">Loading set volume...</div>
                </div>
            </div>
            <div class="piece-price-buy" id="armor-setSell-${idx}">Loading set sell price...</div>
        </div>

        <!-- Set profit + ROI at bottom -->
        <div class="set-bottom-summary">
            <div id="armor-setProfitRange-${idx}" class="set-profit">Loading profit after tax...</div>
            <div id="armor-setROI-${idx}" class="set-roi">Loading ROI...</div>
        </div>
    </div>
`;


        div.innerHTML = piecesList + totalBuyDiv + setBottom;
        container.appendChild(div);
    });
}

function updateArmorPrices() {
    armorSetsData.forEach((set, idx) => {
        const container = document.getElementById(`armor-set-${idx}`);
        if (!container) return;

        let totalBuy = 0;
        let totalVol = 0; // sum of all piece volumes
        let setSell = Number(latestData.data?.[set.setId]?.high) || 0;

        const pieceCards = container.querySelectorAll(".pieces-list .piece-card");

        pieceCards.forEach((pieceCard, i) => {
            const item = set.items[i];
            const low = Number(latestData.data?.[item.id]?.low || 0);
            const vol = Number(volumesData.data?.[item.id] || 0);

            totalBuy += low;
            totalVol += vol;

            const buyEl = pieceCard.querySelector(".piece-price-buy");
            if (buyEl) buyEl.textContent = low ? `Buy Price: ${formatNum(low)} gp` : "Buy Price: —";

            const volEl = pieceCard.querySelector(".piece-volume");
            if (volEl) volEl.textContent = vol ? `Daily vol: ${formatNum(vol)}` : "Daily vol: —";
        });

        // Update total buy cost
        const totalBuyEl = container.querySelector(".set-total-buy");
        if (totalBuyEl) totalBuyEl.textContent = `Total buy cost: ${formatNum(totalBuy)} gp`;

        // Update set sell price, profit, ROI
        const tax = Math.min(setSell * 0.02, 5_000_000);
        const gain = setSell - tax - totalBuy;

        const sellEl = container.querySelector(`#armor-setSell-${idx}`);
        if (sellEl) sellEl.textContent = `Sell price: ${formatNum(setSell)} gp`;

        const profitEl = container.querySelector(`#armor-setProfitRange-${idx}`);
        if (profitEl) {
            const gainColor = gain >= 0 ? "profit-positive" : "profit-negative";
            profitEl.innerHTML = `Set profit (after tax): <span class="${gainColor}">${formatNum(gain)} gp</span>`;
        }

        const roiEl = container.querySelector(`#armor-setROI-${idx}`);
        if (roiEl) {
            const roiAfterTax = totalBuy ? ((gain / totalBuy) * 100).toFixed(2) : 0;
            roiEl.textContent = `ROI (after tax): ${roiAfterTax}%`;
        }

        // Correct set volume
        const setVolEl = container.querySelector(`#armor-setVolume-${idx}`);
        if (setVolEl) setVolEl.textContent = `Set daily vol: ${formatNum(totalVol)}`;
    });
}


// --- Update Volumes for Pieces AND Sets ---
function updateVolumes() {
    armorSetsData.forEach((set, idx) => {
        // --- Update each piece's volume (unchanged) ---
        set.items.forEach(item => {
            const vol = Number(volumesData.data?.[item.id] || 0);

            const pieceCard = document.querySelector(
                `#armor-set-${idx} .piece-card img[alt="${item.name}"]`
            )?.closest(".piece-card");

            if (pieceCard) {
                const volEl = pieceCard.querySelector(".piece-volume");
                if (volEl) {
                    volEl.textContent = vol
                        ? `Daily vol: ${formatNum(vol)}`
                        : "Daily vol: —";
                }
            }
        });

        // --- Read the SET's own volume from its own ID (do NOT sum pieces) ---
        const setVol = Number(volumesData.data?.[set.setId] || 0);
        const setVolEl = document.getElementById(`armor-setVolume-${idx}`);

        if (setVolEl) {
            setVolEl.textContent = setVol
                ? `Set daily vol: ${formatNum(setVol)}`
                : `Set daily vol: —`;
        }
    });
}



// --- Apply F2P filter for both armor section and summary table ---
function applyF2PFilter(onlyF2P) {
    armorSetsData.forEach((set, idx) => {
        const el = document.getElementById(`armor-set-${idx}`);
        if (!el) return;
        el.style.display = (onlyF2P && !set.isF2P) ? "none" : "block";
    });

    document.querySelectorAll("#armorSummaryTable tbody tr").forEach(row => {
        const isF2P = row.getAttribute("data-f2p") === "true";
        row.style.display = (onlyF2P && !isF2P) ? "none" : "";
    });
}

// --- Initialize F2P checkbox ---
window.addEventListener("load", () => {
    const f2pCheckbox = document.getElementById("f2pFilter");
    if (f2pCheckbox) {
        const saved = localStorage.getItem("f2pFilter") === "true";
        f2pCheckbox.checked = saved;
        applyF2PFilter(saved);

        f2pCheckbox.addEventListener("change", () => {
            applyF2PFilter(f2pCheckbox.checked);
            localStorage.setItem("f2pFilter", f2pCheckbox.checked ? "true" : "false");
        });
    }
});

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
                <tr data-index="${l.index}" data-f2p="${armorSetsData[l.index].isF2P}">
                    <td>${l.name}</td>
                    <td class="${l.profit >= 0 ? 'profit-positive' : 'profit-negative'}">
                        ${formatNum(l.profit)} gp
                    </td>
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

            armorSetsData.forEach((s,i)=>{
                const el = document.getElementById(`armor-set-${i}`);
                if(el) el.style.display = i==idx?"block":"none";
            });

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
    armorSection.style.display = "none";

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
        mainContent.style.display = "block";
        armorSummary.style.display = "block";
        armorSection.style.display = "none";
        return;
    }

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

// Function to update back button visibility based on URL hash
const backBtn = document.getElementById('backBtn');

function updateBackButtonVisibility() {
    if (window.location.hash) {
        backBtn.style.display = 'inline-flex';
    } else {
        backBtn.style.display = 'none';
    }
}

// Show/hide on page load and hash change
window.addEventListener('DOMContentLoaded', updateBackButtonVisibility);
window.addEventListener('hashchange', updateBackButtonVisibility);

backBtn.addEventListener('click', () => {
    window.location.hash = '';
    updateBackButtonVisibility();
});
