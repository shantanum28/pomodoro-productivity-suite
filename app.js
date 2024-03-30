document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const timerDisplay = document.getElementById('timer'); // Timer display
  const startButton = document.getElementById('start'); // Start/Pause button
  const resetButton = document.getElementById('reset'); // Reset button
  const workDurationInput = document.getElementById('work-duration'); // Work duration input field
  const breakDurationInput = document.getElementById('break-duration'); // Break duration input field
  const timerTitle = document.getElementById('timer-title'); // Timer title
  const progressBar = document.getElementById('progress'); // Progress bar
  const workCyclesDisplay = document.getElementById('work-cycles'); // Work cycles display

  // Variables to track timer state
  let timeLeft = workDurationInput.value * 60; // Time left in seconds
  let intervalId; // ID of the setInterval function
  let isRunning = false; // Flag to track whether the timer is running
  let isBreak = false; // Flag to track whether it's break time
  let workCycles = 0; // Number of work cycles completed

  // Function to update the timer display
  function updateTimer() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Function to update the progress bar
  function updateProgress() {
      const progress = ((isBreak ? breakDurationInput.value * 60 : workDurationInput.value * 60) - timeLeft) / (isBreak ? breakDurationInput.value * 60 : workDurationInput.value * 60) * 100;
      progressBar.style.width = `${progress}%`;
  }

  // Function to toggle the timer between start and pause
  function toggleTimer() {
      if (isRunning) {
          clearInterval(intervalId); // Stop the timer if it's running
          isRunning = false;
          startButton.textContent = isBreak ? 'Start Break' : 'Start'; // Change button text to 'Start Break' or 'Start' based on break/work time
          resetButton.disabled = false; // Enable the reset button when the timer is paused
      } else {
          intervalId = setInterval(() => { // Start the timer
              timeLeft--;
              updateTimer();
              updateProgress();
              if (timeLeft === 0) {
                  onTimerEnd(); // Call onTimerEnd() when timer reaches 0
              }
          }, 1000);
          isRunning = true;
          startButton.textContent = 'Pause'; // Change button text to 'Pause' when timer is running
          resetButton.disabled = true; // Disable the reset button while the timer is running
      }
  }

  // Function to reset the timer
  function resetTimer() {
      clearInterval(intervalId); // Stop the timer
      timeLeft = workDurationInput.value * 60; // Reset time left to initial work duration
      updateTimer(); // Update the timer display
      updateProgress(); // Update the progress bar
      isRunning = false;
      startButton.textContent = 'Start'; // Change button text to 'Start' after resetting
      resetButton.disabled = false; // Enable the reset button
  }

  // Function to reset the work cycles count
  function resetWorkCycles() {
      workCycles = 0; // Reset work cycles count to zero
      workCyclesDisplay.textContent = workCycles; // Update the work cycles display
  }

  // Function to handle timer end
  function onTimerEnd() {
      clearInterval(intervalId); // Stop the timer
      if (timeLeft === 0) { // Check if timer reached 0
          if (!isBreak) { // If it's not break time
              timerTitle.textContent = 'Break'; // Update timer title to 'Break'
              timeLeft = breakDurationInput.value * 60; // Set time left to break duration
          } else { // If it's break time
              timerTitle.textContent = 'Work'; // Update timer title to 'Work'
              timeLeft = workDurationInput.value * 60; // Set time left to work duration
              workCycles++; // Increment work cycles count
              workCyclesDisplay.textContent = workCycles; // Update the work cycles display
          }
          isBreak = !isBreak; // Toggle between break and work time
          toggleTimer(); // Start the next timer automatically
      }
  }

  // Event listeners for buttons
  startButton.addEventListener('click', toggleTimer); // Start/Pause button
  resetButton.addEventListener('click', resetTimer); // Reset button
  resetWorkCycleButton.addEventListener('click', resetWorkCycles); // Reset work cycle button

  // Event listeners for input fields
  workDurationInput.addEventListener('change', () => { // Work duration input field
      timeLeft = workDurationInput.value * 60;
      updateTimer();
      updateProgress();
  });

  breakDurationInput.addEventListener('change', () => { // Break duration input field
      if (isBreak) {
          timeLeft = breakDurationInput.value * 60;
          updateTimer();
          updateProgress();
      }
  });

  // Initialize the timer display and progress bar
  updateTimer();
  updateProgress();
});
