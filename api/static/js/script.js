document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const communeSelect = document.getElementById("commune-select");
    const anneeInput = document.getElementById("annee-input");
    const predictBtn = document.getElementById("predict-btn");
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");
    const themeBody = document.getElementById("theme-body");
    const chatbotSection = document.getElementById("chatbot-section");
    const tutorialSection = document.getElementById("tutorial-section");
    const graphSection = document.getElementById("graph-section");
    const historySection = document.getElementById("history-section");
    const chatbotLink = document.getElementById("chatbot-link");
    const chatbotLinkMobile = document.getElementById("chatbot-link-mobile");
    const tutorialLink = document.getElementById("tutorial-link");
    const tutorialLinkMobile = document.getElementById("tutorial-link-mobile");
    const graphLink = document.getElementById("graph-link");
    const graphLinkMobile = document.getElementById("graph-link-mobile");
    const historyLink = document.getElementById("history-link");
    const historyLinkMobile = document.getElementById("history-link-mobile");
    const historyList = document.getElementById("history-list");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat-btn");
    const filterCommune = document.getElementById("filter-commune");
    const filterAnnee = document.getElementById("filter-annee");
    const compareYear = document.getElementById("compare-year");
    const compareBtn = document.getElementById("compare-btn");
    const downloadPdfBtn = document.getElementById("download-pdf-btn");
    const toggleChartBtn = document.getElementById("toggle-chart-btn");
    const barChartSection = document.getElementById("bar-chart-section");
    const lineChartSection = document.getElementById("line-chart-section");
    const adviceList = document.getElementById("advice-list");
    const notification = document.getElementById("notification");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsPanel = document.getElementById("settings-panel");
    const languageSelect = document.getElementById("language-select");
    const resetHistory = document.getElementById("reset-history");
    const startTutorial = document.getElementById("start-tutorial");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const predictionTableBody = document.getElementById("prediction-table-body");

    let chartDoughnutInstance = null;
    let chartBarInstance = null;
    let chartLineInstance = null;
    let history = JSON.parse(localStorage.getItem("predictionHistory")) || [];
    let chartDataHistory = {};
    let currentChart = "doughnut";
    let language = "fr";

    // Initialisation du thème
    if (!themeBody) {
        console.error("Element #theme-body not found!");
        return;
    }
    if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        themeBody.classList.add("dark");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleMobile.innerHTML = '<i class="fas fa-moon mr-2"></i> Thème Clair';
    } else {
        themeBody.classList.remove("dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleMobile.innerHTML = '<i class="fas fa-sun mr-2"></i> Thème Sombre';
    }

    themeToggle.addEventListener("click", toggleTheme);
    themeToggleMobile.addEventListener("click", toggleTheme);

    function toggleTheme() {
        themeBody.classList.toggle("dark");
        const isDark = themeBody.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeToggleMobile.innerHTML = isDark ? '<i class="fas fa-moon mr-2"></i> Thème Clair' : '<i class="fas fa-sun mr-2"></i> Thème Sombre';
        // Forcer la mise à jour des styles Tailwind
        themeBody.classList.add("dark:bg-gray-900", "dark:text-gray-100");
        if (!isDark) themeBody.classList.remove("dark:bg-gray-900", "dark:text-gray-100");
    }

    languageSelect.value = language;
    languageSelect.addEventListener("change", () => {
        language = languageSelect.value;
        localStorage.setItem("language", language);
        updateLanguage();
    });

    function updateLanguage() {
        const translations = {
            fr: { predict: "Prédire", send: "Envoyer", tutorial: "Guide Utilisateur", graph: "Analyse Budgétaire", history: "Historique", start: "Démarrer le Tutoriel", compare: "Comparer", export: "Exporter PDF", toggle: "Changer Graphique", advice: "Conseils Budgétaires" },
            en: { predict: "Predict", send: "Send", tutorial: "User Guide", graph: "Budget Analysis", history: "History", start: "Start Tutorial", compare: "Compare", export: "Export PDF", toggle: "Change Chart", advice: "Budget Tips" },
            es: { predict: "Predecir", send: "Enviar", tutorial: "Guía de Usuario", graph: "Análisis Presupuestario", history: "Historial", start: "Iniciar Tutorial", compare: "Comparar", export: "Exportar PDF", toggle: "Cambiar Gráfico", advice: "Consejos Presupuestarios" }
        };
        predictBtn.innerHTML = `<i class="fas fa-search mr-2"></i> ${translations[language].predict}`;
        sendChatBtn.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> ${translations[language].send}`;
        tutorialLink.innerHTML = `<i class="fas fa-book mr-2"></i> ${translations[language].tutorial}`;
        tutorialLinkMobile.innerHTML = `<i class="fas fa-book mr-2"></i> ${translations[language].tutorial}`;
        graphLink.innerHTML = `<i class="fas fa-chart-pie mr-2"></i> ${translations[language].graph}`;
        graphLinkMobile.innerHTML = `<i class="fas fa-chart-pie mr-2"></i> ${translations[language].graph}`;
        historyLink.innerHTML = `<i class="fas fa-history mr-2"></i> ${translations[language].history}`;
        historyLinkMobile.innerHTML = `<i class="fas fa-history mr-2"></i> ${translations[language].history}`;
        chatbotLink.innerHTML = `<i class="fas fa-comments mr-2"></i> Chatbot`;
        chatbotLinkMobile.innerHTML = `<i class="fas fa-comments mr-2"></i> Chatbot`;
        startTutorial.innerHTML = `<i class="fas fa-play mr-2"></i> ${translations[language].start}`;
        compareBtn.innerHTML = `<i class="fas fa-plus mr-2"></i> ${translations[language].compare}`;
        downloadPdfBtn.innerHTML = `<i class="fas fa-file-pdf mr-2"></i> ${translations[language].export}`;
        toggleChartBtn.innerHTML = `<i class="fas fa-chart-line mr-2"></i> ${translations[language].toggle}`;
        document.querySelector("#graph-section h2").textContent = translations[language].graph;
        document.querySelector("#history-section h2").textContent = translations[language].history;
        document.querySelector("#tutorial-section h2").textContent = translations[language].tutorial;
        document.querySelector("#budget-advice h3").textContent = translations[language].advice;
    }

    // Navigation
    function hideAllSections() {
        chatbotSection.classList.add("hidden");
        tutorialSection.classList.add("hidden");
        graphSection.classList.add("hidden");
        historySection.classList.add("hidden");
        mobileMenu.classList.add("hidden");
    }

    chatbotLink.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); chatbotSection.classList.remove("hidden"); });
    chatbotLinkMobile.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); chatbotSection.classList.remove("hidden"); });
    tutorialLink.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); tutorialSection.classList.remove("hidden"); });
    tutorialLinkMobile.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); tutorialSection.classList.remove("hidden"); });
    graphLink.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); graphSection.classList.remove("hidden"); });
    graphLinkMobile.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); graphSection.classList.remove("hidden"); });
    historyLink.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); historySection.classList.remove("hidden"); displayHistory(); });
    historyLinkMobile.addEventListener("click", (e) => { e.preventDefault(); hideAllSections(); historySection.classList.remove("hidden"); displayHistory(); });

    mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.remove("hidden"));
    closeMenuBtn.addEventListener("click", () => mobileMenu.classList.add("hidden"));

    // Tutoriel interactif
    startTutorial.addEventListener("click", () => {
        let step = 0;
        const steps = document.querySelectorAll("#tutorial-section div");
        steps.forEach(s => s.classList.add("hidden"));
        function nextStep() {
            if (step < steps.length) {
                steps[step].classList.remove("hidden");
                step++;
                setTimeout(nextStep, 3000);
            } else {
                steps.forEach(s => s.classList.remove("hidden"));
            }
        }
        nextStep();
    });

    // Historique
    function displayHistory() {
        historyList.innerHTML = "";
        const communeFilter = filterCommune.value.toLowerCase();
        const anneeFilter = filterAnnee.value;
        history.forEach((entry, index) => {
            if ((!communeFilter || entry.commune.toLowerCase().includes(communeFilter)) && (!anneeFilter || entry.annee.toString().includes(anneeFilter))) {
                const div = document.createElement("div");
                div.className = "p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md hover:shadow-lg transition-all duration-200";
                div.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm sm:text-base"><strong>Commune:</strong> ${entry.commune}</p>
                            <p class="text-sm sm:text-base"><strong>Année:</strong> ${entry.annee}</p>
                            <p class="text-sm sm:text-base"><strong>Recettes:</strong> ${entry.recettes} M€</p>
                            <p class="text-sm sm:text-base"><strong>Dépenses:</strong> ${entry.depenses} M€</p>
                        </div>
                        <i class="fas fa-history text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                `;
                historyList.appendChild(div);
            }
        });
    }
    filterCommune.addEventListener("change", displayHistory);
    filterAnnee.addEventListener("input", displayHistory);

    // Fonction pour mettre à jour le tableau des prédictions
    function updatePredictionTable(commune, annee, data) {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200";
        row.innerHTML = `
            <td class="p-2 sm:p-3 text-sm sm:text-base">${commune}</td>
            <td class="p-2 sm:p-3 text-sm sm:text-base">${annee}</td>
            <td class="p-2 sm:p-3 text-sm sm:text-base">${data.recettes} M€</td>
            <td class="p-2 sm:p-3 text-sm sm:text-base">${data.depenses} M€</td>
        `;
        predictionTableBody.appendChild(row);
    }

    // Prédictions
    predictBtn.addEventListener("click", async () => {
        const commune = communeSelect.value;
        const annee = anneeInput.value;
        if (!annee || annee < 2024 || annee > 2050) {
            addMessage("bot", "Veuillez entrer une année valide (2024-2050).");
            return;
        }
        await handlePrediction(commune, annee);
    });

    sendChatBtn.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage("user", message);
            chatInput.value = "";
            const match = message.match(/prédire (\w+) pour (\d{4})/i);
            if (match) {
                const commune = match[1];
                const annee = match[2];
                if (annee >= 2024 && annee <= 2050) {
                    await handlePrediction(commune, annee);
                } else {
                    addMessage("bot", "Année invalide. Utilisez 2024-2050.");
                }
            } else {
                addMessage("bot", "Format incorrect. Exemple : 'prédire Paris pour 2026'");
            }
        }
    });

    async function handlePrediction(commune, annee) {
        addMessage("user", `Prédire ${commune} pour ${annee}`);
        try {
            const response = await fetch("/predict/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commune, annee }),
            });
            const data = await response.json();

            if (data.error) {
                addMessage("bot", `Erreur : ${data.error}`);
                return;
            }

            addMessage("bot", `Pour ${commune} en ${annee} :<br>Recettes : ${data.recettes} M€<br>Dépenses : ${data.depenses} M€`);
            history.push({ commune, annee, recettes: data.recettes, depenses: data.depenses });
            localStorage.setItem("predictionHistory", JSON.stringify(history));
            chartDataHistory[annee] = data.chart_data;

            // Conseils
            const advice = [];
            if (data.depenses > data.recettes) {
                advice.push("Réduisez les dépenses non essentielles pour équilibrer votre budget.");
            } else if (data.recettes > data.depenses) {
                advice.push("Investissez l'excédent dans des projets durables.");
            }
            adviceList.innerHTML = advice.map(item => `<li>${item}</li>`).join("");

            // Graphiques
            updateCharts(commune, annee, data);
            // Mettre à jour le tableau
            updatePredictionTable(commune, annee, data);
            notification.classList.remove("hidden");
            setTimeout(() => notification.classList.add("hidden"), 3000);

            hideAllSections();
            graphSection.classList.remove("hidden");
        } catch (error) {
            addMessage("bot", "Erreur lors de la prédiction.");
        }
    }

    function updateCharts(commune, annee, data) {
        // Doughnut Chart
        if (chartDoughnutInstance) chartDoughnutInstance.destroy();
        const ctxDoughnut = document.getElementById("budget-chart-doughnut").getContext("2d");
        chartDoughnutInstance = new Chart(ctxDoughnut, {
            type: "doughnut",
            data: { labels: data.chart_data.labels, datasets: [{ data: data.chart_data.datasets[0].data, backgroundColor: ["#4f46e5", "#ff80b5"], borderColor: ["#4338ca", "#db2777"], borderWidth: 2 }] },
            options: { responsive: true, plugins: { title: { text: `Répartition - ${commune} (${annee})`, color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 14, weight: "bold" } }, legend: { labels: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 12 } } } } }
        });
        document.getElementById("doughnut-results").innerHTML = `Recettes: ${data.chart_data.datasets[0].data[0]}% | Dépenses: ${data.chart_data.datasets[0].data[1]}%`;

        // Bar Chart
        if (chartBarInstance) chartBarInstance.destroy();
        const ctxBar = document.getElementById("budget-chart-bar").getContext("2d");
        const allYears = Object.keys(chartDataHistory);
        chartBarInstance = new Chart(ctxBar, {
            type: "bar",
            data: { labels: allYears, datasets: [{ label: "Recettes", data: allYears.map(y => chartDataHistory[y].datasets[0].data[0]), backgroundColor: "#4f46e5" }, { label: "Dépenses", data: allYears.map(y => chartDataHistory[y].datasets[0].data[1]), backgroundColor: "#ff80b5" }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, title: { text: "Pourcentage (%)", color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 12 } }, ticks: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 10 } } }, x: { ticks: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 10 } } } }, plugins: { title: { text: `Comparaison - ${commune}`, color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 14, weight: "bold" } }, legend: { labels: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 12 } } } } }
        });
        document.getElementById("bar-results").innerHTML = allYears.map(y => `${y}: Recettes ${chartDataHistory[y].datasets[0].data[0]}%, Dépenses ${chartDataHistory[y].datasets[0].data[1]}%`).join("<br>");

        // Line Chart
        if (chartLineInstance) chartLineInstance.destroy();
        const ctxLine = document.getElementById("budget-chart-line").getContext("2d");
        chartLineInstance = new Chart(ctxLine, {
            type: "line",
            data: { labels: allYears, datasets: [{ label: "Recettes", data: allYears.map(y => chartDataHistory[y].datasets[0].data[0]), borderColor: "#4f46e5", fill: false }, { label: "Dépenses", data: allYears.map(y => chartDataHistory[y].datasets[0].data[1]), borderColor: "#ff80b5", fill: false }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, title: { text: "Pourcentage (%)", color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 12 } }, ticks: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 10 } } }, x: { ticks: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 10 } } } }, plugins: { title: { text: `Évolution - ${commune}`, color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 14, weight: "bold" } }, legend: { labels: { color: themeBody.classList.contains("dark") ? "#f3f4f6" : "#1f2937", font: { size: 12 } } } } }
        });
        document.getElementById("line-results").innerHTML = allYears.map(y => `${y}: Recettes ${chartDataHistory[y].datasets[0].data[0]}%, Dépenses ${chartDataHistory[y].datasets[0].data[1]}%`).join("<br>");
    }

    compareBtn.addEventListener("click", () => {
        const year = compareYear.value;
        if (year && year >= 2024 && year <= 2050 && !chartDataHistory[year]) {
            handlePrediction(communeSelect.value, year);
        }
    });

    downloadPdfBtn.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const allYears = Object.keys(chartDataHistory);
        doc.text("Rapport Budgétaire", 10, 10);
        allYears.forEach((y, i) => {
            doc.text(`${y}: Recettes ${chartDataHistory[y].datasets[0].data[0]}%, Dépenses ${chartDataHistory[y].datasets[0].data[1]}%`, 10, 20 + i * 10);
        });
        doc.save(`budget_report_${new Date().toISOString().split("T")[0]}.pdf`);
    });

    toggleChartBtn.addEventListener("click", () => {
        barChartSection.classList.add("hidden");
        lineChartSection.classList.add("hidden");
        currentChart = currentChart === "doughnut" ? "bar" : currentChart === "bar" ? "line" : "doughnut";
        if (currentChart === "bar") barChartSection.classList.remove("hidden");
        else if (currentChart === "line") lineChartSection.classList.remove("hidden");
        toggleChartBtn.innerHTML = `<i class="fas fa-chart-${currentChart === "doughnut" ? "pie" : currentChart === "bar" ? "line" : "pie"} mr-2"></i> ${language === "fr" ? "Changer Graphique" : language === "en" ? "Change Chart" : "Cambiar Gráfico"}`;
    });

    resetHistory.addEventListener("click", () => {
        history = [];
        localStorage.setItem("predictionHistory", JSON.stringify(history));
        displayHistory();
        predictionTableBody.innerHTML = ""; // Réinitialiser le tableau lors de la réinitialisation de l'historique
    });

    settingsBtn.addEventListener("click", () => settingsPanel.classList.toggle("hidden"));

    function addMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${sender}-message flex items-start p-3 rounded-xl max-w-[90%] sm:max-w-[70%] mb-3 transition-all duration-200 ${sender === "bot" ? "bg-indigo-100 dark:bg-indigo-900" : "bg-pink-100 dark:bg-pink-900"} shadow-md hover:shadow-lg`;
        messageDiv.innerHTML = `
            <div class="flex items-start">
                ${sender === "bot" ? '<i class="fas fa-robot mr-2 mt-1 text-indigo-600 dark:text-indigo-400"></i>' : '<i class="fas fa-user mr-2 mt-1 text-pink-600 dark:text-pink-400"></i>'}
                <span class="break-words text-sm sm:text-base">${message.replace(/\n/g, "<br>")}</span>
            </div>
        `;
        messageDiv.style.alignSelf = sender === "bot" ? "flex-start" : "flex-end";
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Charger jsPDF et FontAwesome
    const scripts = [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", id: "jspdf" },
        { src: "https://kit.fontawesome.com/your-kit-id.js", id: "fontawesome" }
    ];
    scripts.forEach(s => {
        if (!document.getElementById(s.id)) {
            const script = document.createElement("script");
            script.src = s.src;
            script.id = s.id;
            document.head.appendChild(script);
        }
    });

    // Afficher le chat par défaut
    hideAllSections();
    chatbotSection.classList.remove("hidden");
});
