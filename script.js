// --- Global Data ---
let latestData = {};
let volumesData = {};
let itemMapping = {};
let summaryVisible = true;
let refreshInterval = null;
let lastRefresh = Date.now(); // start with now instead of "Never"

// --- Sorting State ---
let summarySort = {
    column: "profit",
    direction: "desc"
};

// --- Utils ---
function formatNum(num) {
    return Number(num)?.toLocaleString() || '—';
}

function getF2PIcon(isF2P) {
    return isF2P
        ? `<img src="https://oldschool.runescape.wiki/images/F2P_icon.png" alt="F2P">`
        : '';
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

// --- Refresh / Ticker ---
function getFreshnessColor() {
    if (!lastRefresh) return "#888";
    const diff = (Date.now() - lastRefresh) / 1000;
    if (diff < 60) return "green";
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
    await fetchLatestPrices();
}

function startRefreshTicker() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(updateRefreshIndicator, 15000);
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
        div.style.display = "none";

        // Pieces
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

        const totalBuyDiv = `<div class="set-total-buy">Loading total buy cost...</div>`;

        const setBottom = `
            <div class="set-main-card">
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

// --- Update Armor Prices ---
function updateArmorPrices() {
    armorSetsData.forEach((set, idx) => {
        const container = document.getElementById(`armor-set-${idx}`);
        if (!container) return;

        let totalBuy = 0;
        const setSell = Number(latestData.data?.[set.setId]?.high) || 0;

        const pieceCards = container.querySelectorAll(".pieces-list .piece-card");
        pieceCards.forEach((pieceCard, i) => {
            const item = set.items[i];
            const low = Number(latestData.data?.[item.id]?.low || 0);
            const vol = Number(volumesData.data?.[item.id] || 0);

            totalBuy += low;

            const buyEl = pieceCard.querySelector(".piece-price-buy");
            if (buyEl) buyEl.textContent = low ? `Buy Price: ${formatNum(low)} gp` : "Buy Price: —";

            const volEl = pieceCard.querySelector(".piece-volume");
            if (volEl) volEl.textContent = vol ? `Daily vol: ${formatNum(vol)}` : "Daily vol: —";
        });

        const totalBuyEl = container.querySelector(".set-total-buy");
        if (totalBuyEl) totalBuyEl.textContent = `Total buy cost: ${formatNum(totalBuy)} gp`;

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
    });
}

// --- Update Volumes ---
function updateVolumes() {
    armorSetsData.forEach((set, idx) => {
        set.items.forEach(item => {
            const vol = Number(volumesData.data?.[item.id] || 0);
            const pieceCard = document.querySelector(
                `#armor-set-${idx} .piece-card img[alt="${item.name}"]`
            )?.closest(".piece-card");
            if (pieceCard) {
                const volEl = pieceCard.querySelector(".piece-volume");
                if (volEl) volEl.textContent = vol ? `Daily vol: ${formatNum(vol)}` : "Daily vol: —";
            }
        });

        const setVol = Number(volumesData.data?.[set.setId] || 0);
        const setVolEl = document.getElementById(`armor-setVolume-${idx}`);
        if (setVolEl) setVolEl.textContent = setVol ? `Set daily vol: ${formatNum(setVol)}` : "Set daily vol: —";
    });
}

// --- F2P Filter ---
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

// --- Summary Table Sorting ---
function getSortValue(col, row) {
    switch(col) {
        case "name": return row.name.toLowerCase();
        case "profit": return Number(row.profit);
        case "roi": return Number(row.roi);
        case "cost": return Number(row.totalCost);
        default: return row.name.toLowerCase();
    }
}

function sortSummary(list) {
    const { column, direction } = summarySort;
    return list.sort((a, b) => {
        let va = getSortValue(column, a);
        let vb = getSortValue(column, b);
        if (va < vb) return direction === "asc" ? -1 : 1;
        if (va > vb) return direction === "asc" ? 1 : -1;
        return 0;
    });
}
// --- Update header arrows ---
function updateSortArrows() {
    const headers = document.querySelectorAll("#armorSummaryTable thead th");
    headers.forEach(th => {
        const col = th.getAttribute("data-col");
        th.innerHTML = th.textContent.replace(/[\u25B2\u25BC]/g,''); // remove old arrows

        if (col === summarySort.column) {
            const arrow = summarySort.direction === "asc" ? ' \u25B2' : ' \u25BC'; // ▲ or ▼
            th.innerHTML += arrow;
        }
    });
}


// --- Render Summary Table with Sorting Arrows ---
function initSummaryTable() {
    const armorSummary = document.getElementById("armorSummary");
    if (!armorSummary) return;

    armorSummary.innerHTML = `
        <label style="display:block; margin-bottom:8px;">
            <input type="checkbox" id="f2pFilter"> Show only F2P sets
        </label>
        <table class="summary-table" id="armorSummaryTable">
            <thead>
                <tr>
                    <th data-col="name">Armor Set</th>
                    <th data-col="profit">Profit per set</th>
                    <th data-col="roi">ROI %</th>
                    <th data-col="cost">Total Pieces Cost</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

    // --- Column click to sort ---
    document.querySelectorAll("#armorSummaryTable thead th").forEach(th => {
        th.addEventListener("click", () => {
            const col = th.getAttribute("data-col");
            if (summarySort.column === col) {
                summarySort.direction = summarySort.direction === "asc" ? "desc" : "asc";
            } else {
                summarySort.column = col;
                summarySort.direction = "asc";
            }
            updateSummaryTableBody();
            updateSortArrows();
        });
    });

    // --- F2P filter ---
    const f2pFilter = document.getElementById("f2pFilter");
    const saved = localStorage.getItem("f2pFilter") === "true";
    f2pFilter.checked = saved;
    applyF2PFilter(saved);

    f2pFilter.addEventListener("change", function () {
        applyF2PFilter(this.checked);
        localStorage.setItem("f2pFilter", this.checked ? "true" : "false");
    });

    // --- Initial render ---
    updateSummaryTableBody();
    updateSortArrows(); // show arrow on initial load
}


function updateSummaryTableBody() {
    const tbody = document.querySelector("#armorSummaryTable tbody");
    if (!tbody) return;

    let list = armorSetsData.map((s, i) => {
        const calc = calculateArmorProfit(s) || {};
        return { ...calc, name: s.name, index: i };
    });

    list = sortSummary(list);

    tbody.innerHTML = list.map(l => `
        <tr data-index="${l.index}" data-f2p="${armorSetsData[l.index].isF2P}">
            <td>${l.name}</td>
            <td class="${l.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${formatNum(l.profit)} gp</td>
            <td>${l.roi}%</td>
            <td>${formatNum(l.totalCost)} gp</td>
        </tr>
    `).join("");

    tbody.querySelectorAll("tr").forEach(row => {
        row.addEventListener("click", () => {
            const idx = row.getAttribute("data-index");
            window.location.hash = `#${armorSetsData[idx].setImgName}`;
            document.querySelector(".main-content").style.display = "none";
            document.getElementById("armorSummary").style.display = "none";

            const armorSection = document.getElementById("armorSection");
            armorSection.style.display = "block";

            armorSetsData.forEach((s, i) => {
                const el = document.getElementById(`armor-set-${i}`);
                if (el) el.style.display = i == idx ? "block" : "none";
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

// --- Fetch Prices & Volumes ---
async function fetchLatestPrices() {
    try {
        const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/latest");
        latestData = await res.json();
        updateArmorPrices();
        updateSummaryTableBody();

        // Reapply F2P filter after prices are applied
        const savedF2P = localStorage.getItem("f2pFilter") === "true";
        applyF2PFilter(savedF2P);

        await fetchDailyVolumes();
    } catch(err) { console.warn("Failed to fetch latest prices", err); }
}

async function fetchDailyVolumes() {
    try {
        const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/volumes");
        volumesData = await res.json();
        updateVolumes();
    } catch(err) { console.warn("Failed to fetch volumes", err); }
}

// --- Hash Navigation & Back Button ---
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const armorSection = document.getElementById("armorSection");
    const mainContent = document.querySelector(".main-content");
    const armorSummary = document.getElementById("armorSummary");

    const backBtn = document.getElementById('backBtn');

    if (!hash) {
        mainContent.style.display = "block";
        armorSummary.style.display = "block";
        armorSection.style.display = "none";
        backBtn.style.display = 'none';
        return;
    }

    const idx = armorSetsData.findIndex(s => s.setImgName === hash);
    if (idx >= 0) {
        mainContent.style.display = "none";
        armorSummary.style.display = "none";
        armorSection.style.display = "block";
        backBtn.style.display = 'inline-flex';

        armorSetsData.forEach((s, i) => {
            const el = document.getElementById(`armor-set-${i}`);
            if (el) el.style.display = i === idx ? "block" : "none";
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

window.addEventListener('hashchange', handleHashChange);

document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.hash = '';
});

// --- Init ---
window.addEventListener("load", async () => {
    startRefreshTicker();
    updateRefreshIndicator();
    await fetchItemMappingOnce();
    createArmorSections();
    initSummaryTable();
    const armorSection = document.getElementById("armorSection");
    armorSection.style.display = "none";

    // Read saved F2P filter
    const savedF2P = localStorage.getItem("f2pFilter") === "true";

    const f2pCheckbox = document.getElementById("f2pFilter");
    if (f2pCheckbox) {
        f2pCheckbox.checked = savedF2P;
        f2pCheckbox.addEventListener("change", function () {
            applyF2PFilter(this.checked);
            localStorage.setItem("f2pFilter", this.checked ? "true" : "false");
        });
    }

    // Fetch latest prices and volumes
    await fetchLatestPrices();

    // Apply F2P filter **after** prices update
    applyF2PFilter(savedF2P);

    // Handle hash **after** everything is populated
    if (window.location.hash) {
        handleHashChange();
    }
});

