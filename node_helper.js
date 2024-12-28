const fs = require("fs");
const ical = require("ical-generator");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-CalendarForm helper started...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SET_CONFIG") {
            this.config = payload; // Store the config from the frontend
            console.log("Configuration received:", this.config);
        } else if (notification === "ADD_EVENT") {
            this.addEventToCalendar(payload);
        }
    },

    addEventToCalendar: function (eventData) {
        try {
            const calendarPath = this.config?.calendarPath;

            if (!calendarPath) {
                throw new Error("Calendar path is not specified in config.js");
            }

            console.log("Saving event to calendar at:", calendarPath);

            // Initialize the calendar
            let cal;
            if (fs.existsSync(calendarPath)) {
                const existingData = fs.readFileSync(calendarPath, "utf-8");
                cal = ical({ domain: "localhost", name: "MagicMirror" });
                cal.data(existingData); // Load existing calendar data
            } else {
                cal = ical({ domain: "localhost", name: "MagicMirror" });
            }

            // Add the event to the calendar
            cal.createEvent({
                start: new Date(`${eventData.date}T${eventData.time}`),
                summary: eventData.title,
            });

            // Save the updated calendar to the file
            fs.writeFileSync(calendarPath, cal.toString(), "utf-8");

            console.log("Event successfully added to the calendar.");

            // Notify frontend of success
            this.sendSocketNotification("EVENT_ADDED", eventData);
        } catch (err) {
            console.error("Error adding event:", err);
            this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
        }
    },
});
