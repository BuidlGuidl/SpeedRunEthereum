export const SORTING_ORDER = {
  ascending: "sorting_ascending",
  descending: "sorting_descending",
};

export const byTimestamp = (a, b) => a.timestamp - b.timestamp;

export const bySubmittedTimestamp =
  (order = SORTING_ORDER.ascending) =>
  (a, b) =>
    (a.submittedTimestamp - b.submittedTimestamp) * (order === SORTING_ORDER.descending ? -1 : 1);
