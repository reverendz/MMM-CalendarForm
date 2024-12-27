const NodeHelper = require("node_helper");
const ical = require("ical-generator").default || require("ical-generator");
console.log("ical module type:", typeof ical); // Should now output 'function'
const path = require("path");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for MMM-CalendarForm...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SETUP_CALENDAR") {
            this.calendarPath = path.resolve(__dirname, payload.calendarFile);
        } else if (notification === "ADD_EVENT") {
            this.addEventToCalendar(payload).catch((err) => {
                console.error("Error adding event:", err);
                this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
            });
        }
    },

    async addEventToCalendar(eventData) {
    try {
        // Create a calendar instance
        const cal = ical({
            domain: "localhost",
            name: "MagicMirror",
        });

        // Add the event to the calendar
        cal.createEvent({
            start: new Date(`${eventData.date}T${eventData.time}`),
            summary: eventData.title,
        });

        // Generate the .ics file content
        const icsContent = cal.toString();

        // Write the .ics content to a file
        fs.writeFileSync(this.calendarPath, icsContent, 'utf-8');

        // Notify frontend that the event was added successfully
        this.sendSocketNotification("EVENT_ADDED", eventData);
        } catch (err) {
        console.error("Error adding event:", err);
        this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
        }
    },
});
