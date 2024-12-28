const fs = require("fs");
const icalGenerator = require("ical-generator").default || require("ical-generator");
const icalParser = require("ical");
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
            let cal = icalGenerator({ domain: "localhost", name: "MagicMirror" });

            // If the file exists, parse the existing events and add them
            if (fs.existsSync(calendarPath)) {
                const existingData = fs.readFileSync(calendarPath, "utf-8");
                const parsedEvents = icalParser.parseICS(existingData);

                for (const key in parsedEvents) {
                    const event = parsedEvents[key];
                    if (event.type === "VEVENT") {
                        cal.createEvent({
                            start: event.start,
                            end: event.end,
                            summary: event.summary,
                            description: event.description,
                            location: event.location,
                        });
                    }
                }
            }

            // Add the new event to the calendar
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
