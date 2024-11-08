import { defineStore } from 'pinia'
import { Cron } from 'croner'
import { shallowRef } from 'vue'
import { getDBData, newWatchItem, updateWatchItem, deleteWatchItem } from '../apis/db.js'
import { message } from '@/common/providers.jsx'

export const useWatchStore = defineStore('watch', {
    state() {
        return {
            watchList: [],
            dataLoading: false,
            saveLoading: false,
            deleteLoading: false,
            cronJobs: shallowRef([]),
            autoRefresh: false,
        }
    },
    actions: {
        async onSearch() {
            try {
                this.dataLoading = true
                const dbData = await getDBData()
                this.watchList = dbData?.watchList ?? []
            } catch (err) {
                message.error(err.message)
            } finally {
                this.dataLoading = false
            }
        },
        async newWatchItem(item) {
            try {
                this.saveLoading = true
                await newWatchItem(item)
                await this.onSearch()
            } catch (err) {
                message.error(err.message)
            } finally {
                this.saveLoading = false
            }
        },
        async updateWatchItem(item) {
            try {
                this.saveLoading = true
                await updateWatchItem(item)
                await this.onSearch()
            } catch (err) {
                message.error(err.message)
            } finally {
                this.saveLoading = false
            }
        },
        async deleteWatchItem(item) {
            try {
                this.deleteLoading = true
                await deleteWatchItem(item)
                await this.onSearch()
            } catch (err) {
                message.error(err.message)
            } finally {
                this.deleteLoading = false
            }
        },
        startCronJobs() {
            this.cronJobs.push(
                ...[
                    new Cron('*/10 * * * * *', async () => {
                        if (this.autoRefresh) {
                            await this.onSearch()
                        }
                    }),
                ]
            )
        },
        stopCronJobs() {
            for (const job of this.cronJobs) {
                job.stop()
            }
            this.cronJobs.length = 0
        },
    },
})