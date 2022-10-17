<template>
    <div class="reportContainer">
        <span class="reportLink" @click="toggleReport" v-show="!state.hideReport">
            Report</span>
        <div class=" activeReportContainer" v-if="state.reportActive">
            <div class="reportArea">
                <textarea v-model="state.reportContent" placeholder="What's wrong with this star?" />
            </div>
            <div class="buttonAlertContainer">
                <button class="primaryButton" @click="sendReport">Send</button>
            </div>
        </div>
        <span class="alert" v-if="state.alert != ''" v-html="state.alert" />
    </div>
</template>

<script setup lang="ts">
import MessageService from "@/services/MessageService";
import { onMounted, reactive, computed, watch } from "vue";
/* Data */
let state = reactive({
    reportActive: false,
    reportContent: "",
    hideReport: false,
    alert: ""
});

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits<{
    (event: 'reportActive', toggle: boolean): void
}>()

const starId = computed(() => props.id);

/* Mounted, Watcher ...*/
onMounted(() => {
});

watch(starId, (newId) => {
    if (newId) {
        state.reportActive = false;
        state.reportContent = "";
        state.alert = "";
        state.hideReport = false;
    }
});

/* Methods */
function sendReport() {
    MessageService.reportMessage(props.id, state.reportContent);
    state.reportActive = false;
    state.reportContent = "";
    state.hideReport = true;
    state.alert = "We've got star inspectors on the case!";
    emit("reportActive", false);
}

/* Methods */
function toggleReport() {
    state.reportActive = !state.reportActive
    emit("reportActive", state.reportActive);
}

</script>

<style scoped lang="scss">
textarea {
    height: 5rem;
}

.reportContainer {
    display: flex;
    flex-direction: column;
    row-gap: spacing(0.5);
    width: 80%;
}

.reportLink {
    color: $gray100;
    cursor: pointer;
    font-family: $techna;
    font-size: $fontSize1;
    opacity: 0.7;
}

.reportLink:hover {
    opacity: 1;
}
</style>
