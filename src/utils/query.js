class QueryClient {
  constructor() {
    this.cache = new Map();
    this.subscribers = new Map();
    this.defaultOptions = {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    };
  }

  async query(queryKey, queryFn, options = {}) {
    const key = JSON.stringify(queryKey);
    const finalOptions = { ...this.defaultOptions, ...options };
    const cachedData = this.cache.get(key);

    // Check if we have fresh cached data
    if (
      cachedData &&
      Date.now() - cachedData.timestamp < finalOptions.staleTime
    ) {
      return cachedData.data;
    }

    // Set up promise for this query
    let attempt = 0;
    const makeRequest = async () => {
      try {
        const data = await queryFn();
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          error: null,
        });
        this.notifySubscribers(key);
        return data;
      } catch (error) {
        if (attempt < finalOptions.retry) {
          attempt++;
          await new Promise((resolve) =>
            setTimeout(resolve, finalOptions.retryDelay(attempt))
          );
          return makeRequest();
        }
        throw error;
      }
    };

    return makeRequest();
  }

  subscribe(queryKey, callback) {
    const key = JSON.stringify(queryKey);
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  notifySubscribers(key) {
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      const cachedData = this.cache.get(key);
      subscribers.forEach((callback) => callback(cachedData?.data));
    }
  }

  invalidateQueries(queryKey) {
    const key = JSON.stringify(queryKey);
    this.cache.delete(key);
    this.notifySubscribers(key);
  }

  prefetchQuery(queryKey, queryFn, options = {}) {
    return this.query(queryKey, queryFn, options);
  }

  clear() {
    this.cache.clear();
    this.subscribers.clear();
  }
}

// Hook-like function for components
function useQuery(queryClient, queryKey, queryFn, options = {}) {
  let state = {
    data: null,
    isLoading: true,
    error: null,
  };

  const setState = (newState) => {
    state = { ...state, ...newState };
    if (options.onSuccess && newState.data) {
      options.onSuccess(newState.data);
    }
    if (options.onError && newState.error) {
      options.onError(newState.error);
    }
  };

  const fetchData = async () => {
    setState({ isLoading: true });
    try {
      const data = await queryClient.query(queryKey, queryFn, options);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ error, isLoading: false });
    }
  };

  // Set up subscription
  const unsubscribe = queryClient.subscribe(queryKey, (data) => {
    setState({ data, isLoading: false, error: null });
  });

  // Initial fetch
  fetchData();

  return {
    get data() {
      return state.data;
    },
    get isLoading() {
      return state.isLoading;
    },
    get error() {
      return state.error;
    },
    refetch: fetchData,
    unsubscribe,
  };
}

export { QueryClient, useQuery };
