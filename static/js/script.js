document.addEventListener("DOMContentLoaded", () => {
    const cities = [
        { city: "New York", timezone: "America/New_York" },
        { city: "London", timezone: "Europe/London" },
        { city: "Tokyo", timezone: "Asia/Tokyo" },
    ];

    const clockContainer = document.getElementById("clock-container");

    function updateClocks() {
        clockContainer.innerHTML = "";
        cities.forEach(({ city, timezone }) => {
            fetch("/time", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, timezone }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const clock = document.createElement("div");
                    clock.className = "clock";
                    clock.innerHTML = `<h2>${city}</h2><p>${data.time}</p>`;
                    clockContainer.appendChild(clock);
                });
        });
    }

    updateClocks();
    setInterval(updateClocks, 1000);

    // AI Assistant
    const askButton = document.getElementById("ask-button");
    const userMessage = document.getElementById("user-message");
    const aiResponse = document.getElementById("ai-response");

    askButton.addEventListener("click", () => {
        fetch("/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage.value }),
        })
            .then((res) => res.json())
            .then((data) => {
                aiResponse.textContent = data.response;
            })
            .catch(() => {
                aiResponse.textContent = "Error fetching response. Try again.";
            });
    });
});
