const NodeHelper = require("node_helper");

let ical;
try {
    ical = require("ical-generator");
} catch (error) {
    console.error("Failed to load ical-generator module:", error);
    throw error;
}
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
                console.error("Error adding event to calendar:", err);
                this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
            });
        }
    },

    async addEventToCalendar(eventData) {
    try {
        const cal = ical({
            domain: "localhost",
            name: "MagicMirror",
        });

        // Validate input data
        if (!eventData.date || !eventData.time || !eventData.title) {
            throw new Error("Invalid event data");
        }

        // Create the event
        cal.createEvent({
            start: new Date(`${eventData.date}T${eventData.time}`),
            summary: eventData.title,
        });

        // Save the calendar to the file
        await new Promise((resolve, reject) => {
            cal.save(this.calendarPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        this.sendSocketNotification("EVENT_ADDED", eventData);
    } catch (err) {
        console.error("Error in addEventToCalendar:", err);
        this.sendSocketNotification("EVENT_ADD_ERROR", err.message);
        throw err;
    }
}
    
});
