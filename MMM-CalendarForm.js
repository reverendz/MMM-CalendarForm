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
        form.appendChild(titleInput);

        // Date input
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = "date";
        form.appendChild(dateInput);

        // Time input
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.name = "time";
        form.appendChild(timeInput);

        // Submit button
        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.innerHTML = "Add Event";
        submitButton.addEventListener("click", () => {
            const formData = {
                title: titleInput.value,
                date: dateInput.value,
                time: timeInput.value,
            };
            this.sendSocketNotification("ADD_EVENT", formData);
        });
        form.appendChild(submitButton);

        wrapper.appendChild(form);
        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "EVENT_ADDED") {
            console.log("Event added:", payload);
        }
    },
});
