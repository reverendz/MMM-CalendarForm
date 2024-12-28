Module.register("MMM-CalendarForm", {
    defaults: {
        calendarPath: "/path/to/your/specific/calendar.ics"
    },

    start() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    getDom() {
        // Your existing code for creating the UI
    },

    notificationReceived(notification, payload, sender) {
        if (notification === "ADD_EVENT") {
            this.sendSocketNotification("ADD_EVENT", payload);
        }
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "EVENT_ADDED") {
            Log.info("Event added successfully:", payload);
        } else if (notification === "EVENT_ADD_ERROR") {
            Log.error("Error adding event:", payload);
        }
    }
});
