<script setup lang="ts">
import { PromiseStatus, promiseWithStatus } from '@/utils/promiseWithStatus'
import { findAllForUser } from '@shared/manga/manga.api'
import type { GetMangaDto } from '@shared/manga/dto/getManga.dto'
import { ref } from 'vue'
import { isAxiosErrorWithMessage } from '@shared/utility'
import { findFlagUrlByIso2Code } from 'country-flags-svg'
import { Status } from '@shared/manga/manga.enum'

const books = ref<GetMangaDto[]>([])
const status = ref(PromiseStatus.Initial)
const errorMessage = ref('')

const getBooks = async () => {
  errorMessage.value = ''
  try {
    const { data } = await promiseWithStatus(findAllForUser(), status)
    books.value = data
  } catch (error) {
    if (isAxiosErrorWithMessage(error)) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}
getBooks()

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.OWNED:
      return 'green'
    case Status.ORDERED:
      return 'blue'
    case Status.ENQUIRY:
      return 'red'
    case Status.BORROWED:
      return 'yellow'
    default:
      return 'grey' // is a default necessary here?
  }
}
</script>

<template>
  <div class="my-books">
    <h1>This is a page for my books</h1>
    <div v-if="status === PromiseStatus.Pending">Loading...</div>
    <div v-if="status === PromiseStatus.Rejected">{{ errorMessage }}</div>
    <div v-if="books.length === 0">You have no books</div>
    <VContainer>
      <VRow justify="center">
        <VCol v-for="book in books" :key="book.id">
          <VCard
            height="500px"
            width="300px"
            hover
            class="mx-auto"
            :color="getStatusColor(book.status)"
          >
            <VImg
              :src="book.covers?.[0]"
              cover
              height="400px"
              lazy-src="https://picsum.photos/id/11/100/60"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template>
            </VImg>
            <VCardTitle>{{ book.title }}</VCardTitle>
            <VCardText>
              <VRow>
                <VCol align-self="center" class="text-center"> Vol: {{ book.volume }} </VCol>
                <VCol align-self="center">
                  {{ book.publishers?.[0] }}
                </VCol>
                <VCol align-self="center">
                  <VImg
                    max-width="50px"
                    :src="findFlagUrlByIso2Code(book.languages[0])"
                    class="mx-auto"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style></style>
