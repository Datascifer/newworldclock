document.addEventListener("DOMContentLoaded", () => {
    const cities = [
        { city: "London", timezone: "Europe/London" },
        { city: "Tokyo", timezone: "Asia/Tokyo" },
        { city: "New York", timezone: "America/New_York" },
    ];

    const clockContainer = document.getElementById("clock-container");

    // Update clocks dynamically
    function updateClocks() {
        cities.forEach(({ city, timezone }) => {
            const clockId = `clock-${city.replace(/\s+/g, '-')}`;
            let clock = document.getElementById(clockId);

            // Create clock if it doesn't exist
            if (!clock) {
                clock = document.createElement("div");
                clock.id = clockId;
                clock.className = "clock";
                clock.innerHTML = `<h2>${city}</h2><p id="time-${clockId}"></p>`;
                clockContainer.appendChild(clock);
            }

            // Update time
            fetch("/time", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city, timezone }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const timeElement = document.getElementById(`time-${clockId}`);
                    timeElement.textContent = data.time; // Update only the time
                });
        });
    }

    updateClocks();
    setInterval(updateClocks, 1000);

    // AI Assistant Logic
    const askButton = document.getElementById("ask-button");
    const userMessage = document.getElementById("user-message");
    const aiResponse = document.getElementById("ai-response");

    askButton.addEventListener("click", () => {
        const userMessageText = userMessage.value.trim();

        if (userMessageText) {
            aiResponse.textContent = "Thinking..."; // Show loading state
            fetch("/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessageText }),
            })
                .then((res) => res.json())
                .then((data) => {
                    aiResponse.textContent = data.response || "No response from AI.";
                })
                .catch(() => {
                    aiResponse.textContent = "Error fetching response. Try again.";
                });
        } else {
            aiResponse.textContent = "Please type a message.";
        }
    });
});
