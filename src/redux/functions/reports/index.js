export const updateFilter =  (state, action) => {
    const { filterName, option } = action.payload;
    // Assuming your filter structure is an array of options
    const existingOptionIndex = state.filters[filterName].findIndex(
      (o) => o.name === option.name
    );
    if (existingOptionIndex >= 0) {
      // Option already exists, remove it
      state.filters[filterName].splice(existingOptionIndex, 1);
    } else {
      // Option doesn't exist, add it
      state.filters[filterName].push(option);
    }
  }

  export const removeFilter = (state, action) => {
    const { filterName, optionToRemove } = action.payload;
    state.filters[filterName] = state.filters[filterName].filter(
      (option) => option.name !== optionToRemove.name
    );
  }

  export const setChartDataFunction = (state, action) => {
    state.filters["chartData"] = action.payload
  }