import { useRouter, useRoute } from "vue-router"

export function useRouteQuery() {
    const route = useRoute()
    const router = useRouter()
    function getQueryValue<T>({
        queryKey,
        validateFn,
        parse,
        defaultValue
    }: {
        queryKey: string
        validateFn?: (query: string | string[]) => boolean
        parse?: (query: string | string[]) => T
        defaultValue: T
    }) {
        const query = route.query[queryKey] as string
        if (!query) {
            return defaultValue
        }
        const isValid = validateFn ? validateFn(query) : true
        if (!isValid) {
            return defaultValue
        }
        return parse ? parse(query) : query as T
    }
    function navigateTo(params: Record<string, any>) {
        router.replace({
            path: route.path,
            query: {
                ...route.query,
                ...params
            }
        })
    }
    return {
        getQueryValue,
        navigateTo
    }
}
