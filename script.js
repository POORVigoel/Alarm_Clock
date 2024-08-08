document.addEventListener('DOMContentLoaded', () => {
    const clockFace = document.getElementById('clock-face');
    const setAlarmButton = document.getElementById('set-alarm');
    const alarmsList = document.getElementById('alarms');
    const alarmSound = document.getElementById('alarm-sound'); // Get the audio element
    const stopButtonsContainer = document.getElementById('stop-buttons-container'); // Stop buttons container

    // Array to store alarms
    let alarms = [];

    // Function to update the clock every second
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockFace.textContent = `${hours}:${minutes}:${seconds}`;

        // Check if any alarm should go off
        checkAlarms(now);
    }

    // Function to check if any alarm matches the current time
    function checkAlarms(currentTime) {
        alarms.forEach(alarm => {
            let alarmHour = alarm.hours;
            if (alarm.period === 'PM' && alarmHour < 12) {
                alarmHour += 12;
            } else if (alarm.period === 'AM' && alarmHour === 12) {
                alarmHour = 0;
            }

            const alarmTime = new Date(currentTime);
            alarmTime.setHours(alarmHour, alarm.minutes, alarm.seconds, 0);

            if (currentTime >= alarmTime && currentTime < alarmTime.getTime() + 1000) {
                alert(`Alarm: ${alarm.hours}:${alarm.minutes}:${alarm.seconds} ${alarm.period}\nReminder: ${alarm.reminder}`);
                alarmSound.play(); // Play the alarm sound
                // Add a stop button to stop the alarm sound
                addStopButton(alarm);
            }
        });
    }

    // Function to add a stop button to stop the alarm sound
    function addStopButton(alarm) {
        // Remove existing stop buttons
        stopButtonsContainer.innerHTML = '';

        const li = document.createElement('li');
        li.textContent = `Stop alarm for ${alarm.hours}:${alarm.minutes}:${alarm.seconds} ${alarm.period}`;
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.classList.add('stop');
        stopButton.addEventListener('click', () => {
            alarmSound.pause(); // Pause the alarm sound
            alarmSound.currentTime = 0; // Reset the sound to the beginning
            stopButtonsContainer.innerHTML = ''; // Remove the stop button
        });
        li.appendChild(stopButton);
        stopButtonsContainer.appendChild(li);
    }

    // Function to update the list of alarms displayed on the page
    function updateAlarmsList() {
        alarmsList.innerHTML = '';
        alarms.forEach((alarm, index) => {
            const li = document.createElement('li');
            li.textContent = `${alarm.hours}:${alarm.minutes}:${alarm.seconds} ${alarm.period} - ${alarm.reminder}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                alarms.splice(index, 1);
                updateAlarmsList();
            });
            li.appendChild(deleteButton);
            alarmsList.appendChild(li);
        });
    }

    // Set up an event listener for the "Set Alarm" button
    setAlarmButton.addEventListener('click', () => {
        // Get the values from the input fields
        const hour = parseInt(document.getElementById('alarm-hour').value, 10);
        const minute = parseInt(document.getElementById('alarm-minute').value, 10);
        const second = parseInt(document.getElementById('alarm-second').value, 10);
        const period = document.getElementById('alarm-period').value;
        const reminder = document.getElementById('alarm-reminder').value;

        console.log(`Hour: ${hour}, Minute: ${minute}, Second: ${second}, Period: ${period}, Reminder: ${reminder}`);

        // Check if the input values are valid
        if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
            alarms.push({ hours: hour, minutes: minute, seconds: second, period, reminder });
            updateAlarmsList();
            console.log('Alarm set successfully.');
        } else {
            alert('Please enter valid time.');
        }
    });

    // Update the clock every second
    setInterval(updateClock, 1000);
});
