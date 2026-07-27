window.SPIKE_SERIES_PLOT_SUMMARIES = Object.fromEntries(
  Object.entries(window.SPIKE_SERIES_ANALYSIS).map(([id, entry]) => [
    id,
    { summary: entry.plot, innovation: entry.innovation }
  ])
);
