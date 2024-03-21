<template>
    <div class="flex">
        <div class="left">
            <div class="title">字段</div>
            <div class="list-group">
                <draggable :list="data.axis" :group="{ name: 'xAxis', put: false, pull: 'clone' }" item-key="name" @end="onXAxisEnd">
                    <template #item="{ element }">
                        <div class="list-group-item">
                            {{ element.name }}
                        </div>
                    </template>
                </draggable>
                <draggable :list="data.data" :group="{ name: 'yAxis', put: false, pull: 'clone' }" item-key="name" @end="onYAxisEnd">
                    <template #item="{ element }">
                        <div class="list-group-item">
                            {{ element.name }}
                        </div>
                    </template>
                </draggable>
            </div>
        </div>

        <div class="right">
            <div class="list-group axis">
                <div class="title">横轴</div>
                <div class="drag">
                    <template v-if="!valueData?.xAxis?.length">
                        <span class="placeholder">尝试将文字字段拖到这里</span>
                    </template>
                    <draggable id="xAxis" style="flex: 1" :list="valueData.xAxis" :group="{ name: 'xAxis' }" item-key="name">
                        <template #item="{ element }">
                            <div class="list-group-item close">
                                {{ element.name }}
                                <div class="del" @click="() => del('xAxis', element.name)">删除</div>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>

            <div class="list-group axis">
                <div class="title">纵轴</div>
                <div class="drag">
                    <template v-if="!valueData?.yAxis?.length">
                        <span class="placeholder">尝试将数字字段拖到这里</span>
                    </template>
                    <draggable id="yAxis" style="flex: 1" :list="valueData.yAxis" group="yAxis" item-key="name">
                        <template #item="{ element }">
                            <div class="list-group-item close">
                                {{ element.name }}
                                <div class="del" @click="() => del('yAxis', element.name)">删除</div>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
            <div class="list-group axis">
                <div class="title">系列</div>
                <div class="drag">
                    <template v-if="!valueData?.legend?.length">
                        <span class="placeholder">尝试将文字字段拖到这里</span>
                    </template>
                    <draggable id="legend" style="flex: 1" :list="valueData.legend" group="xAxis" item-key="name">
                        <template #item="{ element }">
                            <div class="list-group-item">
                                {{ element.name }}
                                <div class="del" @click="() => del('legend', element.name)">删除</div>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ElMessage } from "element-plus";
    import { ref, watch } from "vue";
    import Draggable from "vuedraggable-es";

    const props = defineProps({ data: { default: {} } });

    const emit = defineEmits(["change"]);

    const valueData = ref({
        xAxis: [],
        yAxis: [],
        legend: []
    });

    watch(
        () => props.data.userDataSetSelect,
        n => {
            const { xAxis, yAxis, legend } = n || {};
            valueData.value.xAxis = xAxis;
            valueData.value.yAxis = yAxis;
            valueData.value.legend = legend;
        },
        { deep: true, immediate: true }
    );

    watch(valueData.value, n => {
        emit("change", n);
    });

    const del = (type, name) => {
        valueData.value[type] = valueData.value[type].filter(v => v.name != name);
    };

    const onXAxisEnd = evt => {
        const { to } = evt;
        if (to.id == "xAxis") {
            const arr = [];
            valueData.value.xAxis.map(item => {
                const target = arr.find(v => v.name == item.name);
                !target && arr.push(item);
            });
            valueData.value.xAxis = arr;
        }

        if (to.id == "legend") {
            const arr = [];
            valueData.value.legend.map(item => {
                const target = valueData.value.xAxis.find(v => v.name == item.name);
                const haveInsert = arr.find(v => v.name == target?.name);
                if (target && !haveInsert) {
                    arr.push(item);
                }
            });
            valueData.value.legend = arr;
        }
    };

    const onYAxisEnd = evt => {
        const { to } = evt;
        if (to.id == "yAxis") {
            const arr = [];
            valueData.value.yAxis.map(item => {
                const target = arr.find(v => v.name == item.name);
                !target && arr.push(item);
            });
            valueData.value.yAxis = arr;
        }
    };
</script>

<style lang="scss" scoped>
    .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 300px;
        .left,
        .right {
            width: 49%;
            height: 100%;
            display: flex;
            flex-direction: column;
            .title {
                padding: 0 8px;
                height: 25px;
                line-height: 25px;
                background: #c7ebf9;
            }
            .list-group {
                padding: 0 8px 8px;
                overflow: auto;
                .list-group-item {
                    cursor: move;
                    margin-bottom: 2px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .del {
                        cursor: pointer;
                        display: none;
                        font-size: 12px;
                        color: #ee2424;
                    }
                    &:hover {
                        .del {
                            display: block;
                        }
                    }
                }

                .placeholder {
                    color: #aaa;
                }
            }
            .axis {
                overflow: hidden;
                height: 97px;
                border: 1px solid #aaa;
                border-radius: 5px;
                padding: 0;
                display: flex;
                flex-direction: column;
                .drag {
                    height: 72px;
                    overflow: auto;
                    padding: 0 5px 5px;
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                }
            }
        }

        .left {
            border: 1px solid #aaa;
            border-radius: 5px;
            .list-group {
                flex: 1;
            }
        }

        .right {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
</style>
