Module.register("MMM-CalendarForm", {
    defaults: {
        calendarFile: "calendar.ics", // Path to iCal file
    },

    start: function () {
        this.sendSocketNotification("SETUP_CALENDAR", this.config);
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "calendar-form";

        // Create the form
        const form = document.createElement("form");
        form.id = "calendar-form";

        // Title input
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Event Title";
        titleInput.name = "title";
        titleInput.className = "form-input";
        form.appendChild(titleInput);

        // Date input
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = "date";
        dateInput.className = "form-input";
        form.appendChild(dateInput);

        // Time input
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.name = "time";
        timeInput.className = "form-input";
        form.appendChild(timeInput);

        // Submit button
        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.innerHTML = "Add Event";
        submitButton.className = "form-button";

        // Add touch and click event listeners
        const addEvent = () => {
            const formData = {
                title: titleInput.value.trim(),
                date: dateInput.value,
                time: timeInput.value,
            };

            // Basic validation
            if (!formData.title || !formData.date || !formData.time) {
                alert("Please fill in all fields!");
                return;
            }

            this.sendSocketNotification("ADD_EVENT", formData);
        };

        submitButton.addEventListener("click", addEvent); // Mouse click
        submitButton.addEventListener("touchstart", (event) => {
            event.preventDefault(); // Prevent duplicate events
            addEvent();
        });

        form.appendChild(submitButton);

        wrapper.appendChild(form);
        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "EVENT_ADDED") {
            console.log("Event added:", payload);
            alert("Event added successfully!");
        } else if (notification === "EVENT_ADD_ERROR") {
            console.error("Error adding event:", payload);
            alert("Failed to add event: " + payload);
        }
    },
});
