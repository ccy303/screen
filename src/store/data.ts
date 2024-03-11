import { defineStore } from "pinia";
import { ref } from "vue";
export const useDataStore = defineStore("dataStore", () => {
    const data = ref(null);

    const setData = (json: any) => {
        console.info("setData", json);
        data.value = json;
    };

    return { data, setData: setData };
});
