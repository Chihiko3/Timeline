window.SPIKE_SERIES_IMPACT = Object.fromEntries(
  Object.entries(window.SPIKE_SERIES_ANALYSIS).map(([id, entry]) => [id, entry.impact])
);
