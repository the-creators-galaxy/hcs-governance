<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Datepicker from "@vuepic/vue-datepicker";

type DialogResult = {
  startDate: Date;
  endDate: Date;
};
let resolveFn: ((value: DialogResult) => void) | null = null;
let rejectFn: ((value: string) => void) | null = null;

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 6);
const minStartingDate = ref(nextWeek);
const dateRange = ref<Date[]>();
const dialog = ref<any>();
const isInvalid = computed(() => {
  const list = dateRange?.value;
  if (list && list.length == 2) {
    return !(list[0] && list[1]);
  }
  return true;
});

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});

function promptForDateRange(
  startDate: Date | undefined,
  endDate: Date | undefined
): Promise<DialogResult> {
  return new Promise((resolve, reject) => {
    if (dialog.value.open) {
      reject("Dialog is Already Open");
    } else {
      resolveFn = resolve;
      rejectFn = reject;
      const dateList = [];
      if (startDate) {
        dateList.push(startDate);
        if (endDate) {
          dateList.push(endDate);
        }
      }
      dateRange.value = dateList;
      dialog.value.showModal();
    }
  });
}

function onCancel() {
  if (dialog.value.open) {
    dialog.value.close();
    if (rejectFn) {
      rejectFn("Dialog was closed without selecting a range.");
      resolveFn = null;
      rejectFn = null;
    }
  }
}

function onOk() {
  if (dialog.value.open) {
    dialog.value.close();
  }
  if (resolveFn) {
    resolveFn({
      startDate: new Date(dateRange.value![0]), // eslint-disable-line
      endDate: new Date(dateRange.value![1]), // eslint-disable-line
    });
    resolveFn = null;
    rejectFn = null;
  }
}

defineExpose({
  promptForDateRange,
});
</script>

<template>
  <dialog ref="dialog">
    <header>
      <div>Select a date range</div>
      <button class="close" v-on:click="onCancel"></button>
    </header>
    <div class="dlg-content">
      <Datepicker
        v-model="dateRange"
        :inline="true"
        :range="true"
        :utc="true"
        :minRange="5"
        :maxRange="90"
        :minDate="minStartingDate"
        :enableTimePicker="false"
        :dark="true"
        :autoApply="true"
      />
    </div>
    <footer>
      <button v-on:click="onCancel">Cancel</button>
      <button v-on:click="onOk" :disabled="isInvalid">OK</button>
    </footer>
  </dialog>
</template>

<style scoped>
.dlg-content {
  padding: 1.25rem 5.25rem;
}
@media (max-width: 540px) {
  .dlg-content {
    padding: 1.25rem 0;
  }
}
</style>
