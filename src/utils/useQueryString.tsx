import qs from "query-string";

const useQueryString = () => {
    return qs.parse(window.location.search)
}

export default useQueryString;