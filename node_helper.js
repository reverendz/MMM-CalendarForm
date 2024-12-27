const fs = require('fs');
const path = require("path");
const NodeHelper = require("node_helper");
const ical = require("ical-generator").default || require("ical-generator");
console.log("ical module type:", typeof ical); // Should now output 'function'

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-CalendarForm helper started...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "ADD_EVENT") {
            this.addEventToCalendar(payload);
        }
    },

    async addEventToCalendar(eventData) {
        try {
            const cal = ical({
                domain: "localhost",
                name: "MagicMirror",
            });

            // Add the event to the calendar
            cal.createEvent({
                start: new Date(`${eventData.date}T${eventData.time}`),
                summary: eventData.title,
            });

            // Generate the .ics content
            const icsContent = cal.toString();

            // Save the content to a file (in the backend)
            const calendarPath = path.resolve(__dirname, "calendar.ics");
            console.log("Saving calendar to path:", calendarPath);
            fs.writeFileSync(calendarPath, icsContent, 'utf-8');

            console.log("Event successfully added to calendar.");

            // Notify frontend of success
            this.sendSocketNotification("EVENT_ADDED", eventData);
        } catch (err) {
            console.error("Error adding event:", err);
            this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
        }
    }
});
