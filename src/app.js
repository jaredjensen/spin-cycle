const state = {
  countdown: 10,
  intervalIndex: 0,
  secondsRemaining: 0,
  secondsToNextChange: 0,
  ticks: 0,
  workout: undefined,
};

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

function updateUI() {
  const interval = state.workout.intervals[state.intervalIndex];
  const nextInterval = state.intervalIndex < state.workout.intervals.length - 1 ? state.workout.intervals[state.intervalIndex + 1] : undefined;
  document.getElementById('countdown').textContent = state.countdown;
  document.getElementById('cadence').textContent = interval.c;
  document.getElementById('cadence_next').textContent = nextInterval ? nextInterval.c : '-';
  document.getElementById('resistance').textContent = interval.r;
  document.getElementById('resistance_next').textContent = nextInterval ? nextInterval.r : '-';
  document.getElementById('remaining').textContent = formatTime(state.secondsRemaining);
  document.getElementById('next_change').textContent = formatTime(state.secondsToNextChange);
}

function tick() {
  updateUI();

  const html = document.getElementsByTagName('html')[0];

  if (state.countdown >= 0) {

    // Countdown phase
    html.classList.add('in-countdown');
    state.countdown--;
    
  } else if (state.secondsRemaining > 0) {
    
    // Workout phase
    html.classList.remove('in-countdown');

    // Change interval?
    if (state.secondsToNextChange <= 1) {
      if (state.intervalIndex < state.workout.intervals.length - 1) {
        // Go to next interval
        state.intervalIndex++;
        state.secondsToNextChange = state.workout.intervals[state.intervalIndex].d;
      } else {
        // We're on the last interval
        state.secondsToNextChange = 0;
      }
    } else {
      state.secondsToNextChange--;
    }
    
    state.secondsRemaining--;
  }

  // Bail if we're done
  if (state.secondsRemaining > -1) {
    setTimeout(() => tick(), 1000);
  }
}

(() => {
  const key = window.location.hash ? window.location.hash.substring(1) : 'default';
  if (!Object.keys(workouts).includes(key)) {
    return alert(`Workout "${key}" is not defined.`);
  }

  state.workout = workouts[key];
  state.workout.intervals.forEach(x => state.secondsRemaining += x.d);
  state.secondsToNextChange = state.workout.intervals[0].d;

  tick();
})();