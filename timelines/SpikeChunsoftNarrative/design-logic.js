window.SPIKE_SERIES_DESIGN_LOGIC = Object.fromEntries(
  Object.entries(window.SPIKE_SERIES_ANALYSIS).map(([id, entry]) => [id, entry.logic])
);
