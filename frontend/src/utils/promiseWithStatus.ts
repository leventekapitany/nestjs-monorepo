import type { Ref } from 'vue'

export enum PromiseStatus {
  Initial = 'initial',
  Pending = 'pending',
  Resolved = 'resolved',
  Rejected = 'rejected'
}

export const promiseWithStatus = <T>(promise: Promise<T>, status: Ref<PromiseStatus>) => {
  status.value = PromiseStatus.Pending
  promise
    .then((res) => {
      status.value = PromiseStatus.Resolved
      return res
    })
    .catch((err) => {
      status.value = PromiseStatus.Rejected
      throw err
    })
  return promise
}
