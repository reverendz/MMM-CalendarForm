const NodeHelper = require("node_helper");
const ical = require("ical-generator");
const path = require("path");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for MMM-CalendarForm...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SETUP_CALENDAR") {
            this.calendarPath = path.resolve(__dirname, payload.calendarFile);
        } else if (notification === "ADD_EVENT") {
            this.addEventToCalendar(payload);
        }
    },

    addEventToCalendar: function (eventData) {
        const cal = ical({
            domain: "localhost",
            name: "MagicMirror",
        });

        cal.createEvent({
            start: new Date(`${eventData.date}T${eventData.time}`),
            summary: eventData.title,
        });

        cal.save(this.calendarPath, (err) => {
            if (err) {
                console.error("Failed to save calendar:", err);
            } else {
                this.sendSocketNotification("EVENT_ADDED", eventData);
            }
        });
    },
});
