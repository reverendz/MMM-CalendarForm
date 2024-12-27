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
            this.addEventToCalendar(payload).catch((err) => {
                console.error("Error adding event:", err);
                this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
            });
        }
    },

    async addEventToCalendar(eventData) {
        try {
            // Create a new calendar instance
            const cal = ical({
                domain: "localhost",
                name: "MagicMirror",
            });

            // Validate eventData
            if (!eventData.title || !eventData.date || !eventData.time) {
                throw new Error("Missing event data fields (title, date, time)");
            }

            // Create an event in the calendar
            cal.createEvent({
                start: new Date(`${eventData.date}T${eventData.time}`),
                summary: eventData.title,
            });

            // Save the calendar to a file
            await new Promise((resolve, reject) => {
                cal.save(this.calendarPath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // Notify the frontend that the event was successfully added
            this.sendSocketNotification("EVENT_ADDED", eventData);
        } catch (err) {
            console.error("Error in addEventToCalendar:", err);
            throw err;
        }
    },
});
