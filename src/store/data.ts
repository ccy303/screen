import { defineStore } from "pinia";
import { ref } from "vue";
export const useDataStore = defineStore("dataStore", () => {
    const data = ref({});

    const setData = (json: any) => {
        console.log("setjson", json);
        data.value = json;
    };

    return { data, setData: setData };
});
