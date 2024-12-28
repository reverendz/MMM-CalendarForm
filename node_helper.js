const fs = require('fs');
const path = require('path');
const ical = require('ical-generator');
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

    async addEventToCalendar(eventData) {
        try {
            // Get the calendar path from the config
            const calendarPath = this.config?.calendarPath;

            if (!calendarPath) {
                throw new Error("Calendar path is not specified in config.js");
            }

            console.log("Saving event to calendar at:", calendarPath);

            // Load the existing calendar if it exists
            let cal;
            if (fs.existsSync(calendarPath)) {
                const existingData = fs.readFileSync(calendarPath, 'utf-8');
                cal = ical({ domain: "localhost", name: "MagicMirror" });
                cal.events(ical.parseICS(existingData));
            } else {
                cal = ical({ domain: "localhost", name: "MagicMirror" });
            }

            // Add the event to the calendar
            cal.createEvent({
                start: new Date(`${eventData.date}T${eventData.time}`),
                summary: eventData.title,
            });

            // Generate the updated .ics content
            const icsContent = cal.toString();

            // Save the updated calendar file
            fs.writeFileSync(calendarPath, icsContent, 'utf-8');

            console.log("Event successfully added to the calendar.");

            // Notify frontend of success
            this.sendSocketNotification("EVENT_ADDED", eventData);
        } catch (err) {
            console.error("Error adding event:", err);
            this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
        }
    }
});
