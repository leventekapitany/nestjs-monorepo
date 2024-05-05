<script setup lang="ts">
import { PromiseStatus, promiseWithStatus } from '@/utils/promiseWithStatus'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, watch } from 'vue'
import { isAxiosErrorWithMessage } from '../../../shared/dist/esm/utility'
import { findByISBN } from '@shared/book-api/book-api.api'
import { type GetBookWithDetailsDto } from '@shared/book-api/dto/getBookWithDetailsDto'
import { PHYSICAL_FORMAT } from '@shared/manga/manga.enum'

const dialog = ref(false)
watch(dialog, () => {
  if (!dialog.value) {
    book.value = undefined
    form.value.isbn = ''
  }
})

const form = ref({
  isbn: ''
})

const v$ = useVuelidate(
  {
    isbn: { required }
  },
  form
)

const book = ref<GetBookWithDetailsDto>()
const authors = ref<string[]>([])
const physicalFormat = ref<PHYSICAL_FORMAT>(PHYSICAL_FORMAT.PAPERBACK)

const status = ref(PromiseStatus.Initial)
const errorMessage = ref('')
const query = async () => {
  errorMessage.value = ''
  if (!(await v$.value.$validate())) return

  try {
    const { data } = await promiseWithStatus(findByISBN(form.value), status)
    book.value = data
    authors.value = data.authors.map((a) => a.name)
    physicalFormat.value = data.physical_format
  } catch (error) {
    if (isAxiosErrorWithMessage(error)) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}
</script>

<template>
  <VBtn prepend-icon="mdi-book-plus" variant="elevated" color="success">
    Add manga
    <VDialog v-model="dialog" activator="parent" maxWidth="1000px">
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <span>Query a manga now!</span>
          <VBtn icon @click="dialog = false" variant="plain">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        <VCardText class="pa-4">
          <VAlert class="mb-6" color="error" v-if="errorMessage">
            {{ errorMessage }}
          </VAlert>

          <VForm @submit.prevent="query">
            <VTextField
              class="mb-6"
              label="ISBN"
              variant="outlined"
              v-model="v$.isbn.$model"
              :errorMessages="v$.isbn.$errors.map((e) => e.$message as string)"
              placeholder="ISBN"
              persistentPlaceholder
              clearable
            >
              <template #prepend-inner>
                <VIcon>mdi-barcode</VIcon>
              </template></VTextField
            >
            <template v-if="book">
              <VContainer>
                <VRow>
                  <VCol>
                    <VTextField
                      class="mb-4"
                      label="Title"
                      variant="outlined"
                      v-model="book.title"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-format-title</VIcon>
                      </template>
                    </VTextField>

                    <VTextField
                      class="mb-4"
                      label="Number of pages"
                      variant="outlined"
                      v-model="book.number_of_pages"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-counter</VIcon>
                      </template>
                    </VTextField>
                    <VTextField
                      class="mb-4"
                      label="Publishers"
                      variant="outlined"
                      :modelValue="book.publishers?.join(', ')"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-domain</VIcon>
                      </template>
                    </VTextField>
                    <VTextField
                      class="mb-4"
                      label="Publish date"
                      variant="outlined"
                      v-model="book.publish_date"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-calendar-range</VIcon>
                      </template>
                    </VTextField>
                    <VTextField
                      v-if="authors.length < 2"
                      class="mb-4"
                      label="Author"
                      variant="outlined"
                      v-model="authors"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-account</VIcon>
                      </template>
                    </VTextField>
                    <VTextarea
                      v-else
                      class="mb-4"
                      label="Authors"
                      variant="outlined"
                      v-model="authors"
                      readonly
                    >
                      <template #prepend-inner>
                        <VIcon>mdi-account</VIcon>
                      </template>
                    </VTextarea>
                    <VSelect
                      class="mb-4"
                      label="Physical format"
                      variant="outlined"
                      v-model="physicalFormat"
                      :items="Object.values(PHYSICAL_FORMAT)"
                      readonly
                    ></VSelect>
                  </VCol>
                  <VCol>
                    <VImg
                      v-if="book.covers[0]"
                      :src="book.covers[0]"
                      height="653px"
                      width="456px"
                    />
                  </VCol>
                </VRow>
              </VContainer>
            </template>
            <input type="submit" hidden />
          </VForm>
        </VCardText>
        <VCardActions class="d-flex justify-end">
          <VSpacer />
          <VBtn
            color="primary"
            variant="flat"
            @click="query"
            :disabled="status === PromiseStatus.Pending"
            :loading="status === PromiseStatus.Pending"
          >
            Query
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VBtn>
</template>
