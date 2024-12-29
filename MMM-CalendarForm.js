Module.register("MMM-CalendarForm", {
    defaults: {
        calendarPath: "/path/to/your/specific/calendar.ics"
    },

    start() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    getDom() {
        // Create the main container
        const wrapper = document.createElement("div");

        // Title for the form - Commented out
       // const title = document.createElement("h2");
       // title.textContent = "Add Event to Calendar";
       // wrapper.appendChild(title);

        // Input for the event title
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Event Title";
        titleInput.id = "eventTitle";
        wrapper.appendChild(titleInput);

        // Line break
       // wrapper.appendChild(document.createElement("br"));

        // Input for the event date
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = "eventDate";
        wrapper.appendChild(dateInput);

        // Line break
        //wrapper.appendChild(document.createElement("br"));

        // Input for the event time
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.id = "eventTime";
        wrapper.appendChild(timeInput);

        // Line break
        //wrapper.appendChild(document.createElement("br"));

        // Button to add the event
        const addButton = document.createElement("button");
        addButton.textContent = "Add Event";
        addButton.addEventListener("click", () => {
            const title = document.getElementById("eventTitle").value;
            const date = document.getElementById("eventDate").value;
            const time = document.getElementById("eventTime").value;

            if (title && date && time) {
                this.sendSocketNotification("ADD_EVENT", { title, date, time });
            } else {
                alert("Please fill in all fields.");
            }
        });
        wrapper.appendChild(addButton);

        return wrapper;
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "EVENT_ADDED") {
            Log.info("Event added successfully:", payload);
            alert("Event added successfully!");
        } else if (notification === "EVENT_ADD_ERROR") {
            Log.error("Error adding event:", payload);
            alert(`Error adding event: ${payload}`);
        }
    }
});
