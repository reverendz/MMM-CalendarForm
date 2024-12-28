getDom() {
    const wrapper = document.createElement("div");

    // Title for the form
    const title = document.createElement("h2");
    title.textContent = "Add Event to Calendar";
    wrapper.appendChild(title);

    // Input for the event title
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Event Title";
    titleInput.id = "eventTitle";
    wrapper.appendChild(titleInput);

    // Input for the event date
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "eventDate";
    wrapper.appendChild(dateInput);

    // Input for the event time
    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.id = "eventTime";
    wrapper.appendChild(timeInput);

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
}
