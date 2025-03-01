const activitiesDiv = document.getElementById('activities');
const progress = document.getElementById('progress');
const progressPercentage = document.getElementById('progress-percentage');
const currentDateElement = document.getElementById('current-date');
const daysLeftElement = document.getElementById('days-left');
const finalNote = document.getElementById('final-note');
const historySection = document.getElementById('history-section');
const historyContent = document.getElementById('history-content');

const submitDayBtn = document.getElementById('submit-day');
const viewHistoryBtn = document.getElementById('view-history');
const closeHistoryBtn = document.getElementById('close-history');

const addActivityBtn = document.getElementById('add-activity');

let activities = JSON.parse(localStorage.getItem('activities')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let currentDay = new Date();

function updateDateInfo() {
    const startOfYear = new Date(currentDay.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDay.getFullYear(), 11, 31);
    const daysPassed = Math.ceil((currentDay - startOfYear) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

    currentDateElement.textContent = `Today's Date: ${currentDay.toDateString()}`;
    daysLeftElement.textContent = `Days Left in 2025: ${totalDays - daysPassed}`;
    updateProgress(daysPassed, totalDays);
}

function updateProgress(completedDays, totalDays) {
    const percentage = Math.round((completedDays / totalDays) * 100);
    progress.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
}

function renderActivities() {
    activitiesDiv.innerHTML = '';
    activities.forEach((activity, index) => {
        const activityDiv = document.createElement('div');
        activityDiv.classList.add('activity');
        activityDiv.innerHTML = `
            <input type="checkbox" id="activity-${index}" ${activity.completed ? 'checked' : ''}>
            <label for="activity-${index}">${activity.name}</label>
            <button onclick="deleteActivity(${index})">Delete</button>
        `;
        activitiesDiv.appendChild(activityDiv);

        const checkbox = activityDiv.querySelector('input');
        checkbox.addEventListener('change', () => {
            activity.completed = checkbox.checked;
        });
    });
}

function deleteActivity(index) {
    activities.splice(index, 1);
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
}

function submitDay() {
    const todayData = {
        date: currentDay.toDateString(),
        activities: [...activities],
        finalNote: finalNote.value
    };
    history.push(todayData);
    localStorage.setItem('history', JSON.stringify(history));
    alert('Day submitted successfully!');
    activities = [];
    finalNote.value = '';
    renderActivities();
}

function renderHistory() {
    historyContent.innerHTML = '';
    history.forEach(entry => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.innerHTML = `
            <h3>${entry.date}</h3>
            <p><strong>Activities:</strong></p>
            <ul>
                ${entry.activities.map(a => `<li>${a.name} - ${a.completed ? 'Completed' : 'Not Completed'}</li>`).join('')}
            </ul>
            <p><strong>Final Note:</strong> ${entry.finalNote || 'No note'}</p>
        `;
        historyContent.appendChild(dayCard);
    });
}

addActivityBtn.addEventListener('click', () => {
    const activityName = prompt('Enter the activity name:');
    if (activityName) {
        activities.push({ name: activityName, completed: false });
        localStorage.setItem('activities', JSON.stringify(activities));
        renderActivities();
    }
});

submitDayBtn.addEventListener('click', submitDay);

viewHistoryBtn.addEventListener('click', () => {
    renderHistory();
    historySection.classList.remove('hidden');
});

closeHistoryBtn.addEventListener('click', () => {
    historySection.classList.add('hidden');
});

updateDateInfo();
renderActivities();