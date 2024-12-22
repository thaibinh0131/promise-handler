import { reactive, computed } from 'vue';

type PromiseStates = 'idle' | 'pending' | 'success' | 'error';

interface QueryOptions<TParams, TResult, TError> {
  promiseFn: (params: TParams, abortSignal?: AbortSignal) => Promise<TResult>;
  key: string;
  cancellable?: boolean;
  errorHandler?: (error: TError) => void;
}

const promiseStatesMap = reactive(new Map<string, PromiseStates>());
const cachedDataMap = reactive(new Map<string, unknown>());

export function usePromiseState(key: string) {
  function setState(state: PromiseStates) {
    promiseStatesMap.set(key, state);
  }
  function matches(state: PromiseStates) {
    return promiseStatesMap.get(key) === state;
  }
  const state = computed(() => promiseStatesMap.get(key) ?? 'idle');
  const isLoading = computed(() => matches('pending'));

  return {
    isLoading,
    state,
    setState,
    matches,
  };
}

export function useQuery<TParams = void, TResult = any, TError = any>({
  key,
  promiseFn,
  cancellable = true,
  errorHandler,
}: QueryOptions<TParams, TResult, TError>) {
  const { isLoading, state, setState } = usePromiseState(key);
  const abortController = cancellable ? new AbortController() : undefined;
  const data = computed<TResult | undefined>(
    () => cachedDataMap.get(key) as TResult
  );
  async function execute(params: TParams, forceUpdate = false) {
    try {
      setState('pending');

      if (cachedDataMap.get(key) && !forceUpdate) {
        setState('success');
        return Promise.resolve(cachedDataMap.get(key) as TResult);
      }
      cachedDataMap.set(key, await promiseFn(params, abortController?.signal));
      setState('success');
      return cachedDataMap.get(key) as TResult;
    } catch (err: any) {
      if (errorHandler) {
        errorHandler(err);
      }
      setState('error');
    }
  }
  async function abort(reason?: string) {
    if (cancellable) {
      return abortController?.abort(reason);
    }
  }
  async function refresh(params: TParams) {
    return execute(params, true);
  }
  function updateCachedData(value: TResult | undefined) {
    cachedDataMap.set(key, value);
  }
  return {
    loading: isLoading,
    isLoading,
    data,
    abort,
    execute,
    refresh,
    updateCachedData,
    state,
  };
}
