<script setup lang="ts">
import { ElButton, ElInput } from "element-plus"

const props = defineProps<{ folder: any }>()

function initializeShareWith(shareWith) {
    return shareWith.map(o => ({
        ...o,
        id: o.item,
        __typename: o.kind
    }))
}

const shareWith = $computed(() => initializeShareWith(props.folder.shareWith))

const shareInfo = $computed(() => {
    const share = shareWith
    if (!share) return "Private"
    if (share.length === 1) {
        if (share[0].__typename === "User") {
            return "Private"
        } else {
            return "Shared with 1 group"
        }
    } else {
        const users = share.filter(o => o.__typename === "User").length
        const groups = share.length - users
        if (!users) {
            return `Shared with ${groups} groups`
        } else if (!groups) {
            return `Shared with ${users} people`
        } else {
            return `Shared with ${groups} group${groups > 1 ? "s" : ""}
                  and ${users} ${users > 1 ? "people" : "person"}`
        }
    }
})

const groups = $computed(() => {
    //  return [this.getTeam].concat(this.getUsers).concat(this.getGroups)
    return []
})

const user = useUserStore()
const activeWidget = $computed(() => user.activeWidget)

const filteredGroups = $computed(() => [])

const folderName = $ref("ggg")
const searchGroup = $ref("")

const updateFolder = () => {}
const cancel = () => {}
const removeGroup = () => {}
const addGroup = () => {}

function getAvatarObj(obj) {
    if (!obj.kind) return obj
    return groups.find(o => o.id === obj.item)
}
</script>
<template>
    <!-- <div>
        folder detail: {{folder}}
    </div> -->
    <div class="white card max-height">
        <div class="folder-header">
            <form @submit.prevent="updateFolder">
                <input
                    class="no-outline header-title folder-name"
                    type="text"
                    name="taskname"
                    ref="taskname"
                    v-model="folderName"
                    @keyup.esc="cancel"
                />
                <!-- </input> -->
            </form>
        </div>
        <div class="folder-statebar">
            <div class="tooltip">
                <div
                    v-show="activeWidget === 'addFolderShareTooltip'"
                    class="tooltip-content bottom"
                    @click.stop=""
                >
                    <div class="group-field">
                        <div class="add-additional">
                            shareWith: {{ shareWith }}
                            <avatar
                                v-for="group in shareWith"
                                :key="group?.id"
                                class="member-avatar"
                                :kind="group.__typename"
                                :obj="getAvatarObj(group)"
                                :size="32"
                            >
                                <remove-button
                                    @click="removeGroup(group.id)"
                                ></remove-button>
                            </avatar>
                        </div>
                    </div>
                    <div>
                        <div class="search-input">
                            <div class="label">Share with:</div>
                            <el-input
                                type="text"
                                v-model="searchGroup"
                                placeholder="Add by name or email"
                                @keyup.esc="user.changeActiveWidget(null)"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="contact-picker-item-list">
                        <div
                            v-for="group in filteredGroups"
                            :key="group.id"
                            class="contact-picker-item"
                            @click.stop="addGroup(group)"
                        >
                            <div class="picker-item">
                                <div class="item">
                                    <!-- <avatar class="picker-avatar" :kind="group.__typename" :obj="group" :size="32"></avatar> -->
                                    <div>
                                        <div class="name">{{ group.name }}</div>
                                        <div class="email">
                                            {{ group.email }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-button
                    v-if="folder.parent"
                    class="black-text-button subfolder share-info"
                >
                    <!-- <i class="fas fa-share-alt"></i> -->
                    <span class="shared-with">{{ shareInfo }}</span>
                </el-button>
                <el-button
                    v-else
                    class="black-text-button share-info"
                    @click.stop="
                        user.changeActiveWidget('addFolderShareTooltip')
                    "
                >
                    <div class="i-carbon:share mr-2"></div>
                    <span class="shared-with">{{ shareInfo }}</span>
                </el-button>
            </div>
        </div>

        <!-- <DescriptionField :model="folder" kind="folder"></DescriptionField> -->
    </div>
</template>

<style scoped></style>
