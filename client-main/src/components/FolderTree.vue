<script setup lang="ts">
import { useQuery, useMutation } from "@vue/apollo-composable";
import { DELETEFOLDERS, GETFOLDERS } from "~/constants/query";

const props = defineProps<{ model: any; team?: any }>();
const route = useRoute();
const emit = defineEmits(["open"]);

const user = useUserStore();
const activeWidget = $computed(() => user.activeWidget);

const { result, onError } = useQuery(GETFOLDERS, () => ({
    parent: props.model.id
}));

onError(error => {
    console.log(error);
    //   console.log(error.graphQLErrors)
    //   console.log(error.networkError)
});

let open = $ref(false);
let showModal = $ref(false);
let modalConfig = $ref<any>({});

const folders = $computed(() => result.value?.getFolders || []);
const isFolder = $computed(() => folders.length > 0);

function toggle() {
    if (isFolder) {
        open = !open;
    }
}
function openModal(mode) {
    user.changeActiveWidget(null);
    showModal = true;
    modalConfig = {
        parent: props.model.id
    };
}
function openArrow() {
    open = true;
    emit("open");
}

let deletedFolderId = $ref("");

const {
    mutate: deleteMessage,
    onDone: onDeleteFolder,
    onError: onDeleteError
} = useMutation(DELETEFOLDERS, () => ({
    // variables: {
    //     id
    // },

    // update: (cache, { data: { deleteFolder } }) => {
    //     let data = cache.readQuery({ query: GETFOLDERS }) as any;
    //     let indexOfDeletedFolder = data.getFolders.findIndex(
    //         o => o.id === deletedFolderId
    //     );
    //     data = JSON.parse(JSON.stringify(data));
    //     let deletedFolder = data.getFolders.splice(indexOfDeletedFolder, 1); //
    //     console.log(
    //         "🚀 ~ file: FolderTree.vue ~ line 57 ~ data",
    //         data,
    //         deletedFolder
    //     );
    //     cache.writeQuery({ query: GETFOLDERS, data });
    // }
    update: (cache, { data }) => {
        cache.modify({
            fields: {
                getFolders: (existingFolders, { readField }) => {
                    return existingFolders.filter(
                        folderRef =>
                            deletedFolderId !==
                            readField("id", folderRef)
                    );
                }
            }
        });
    }
}));

function deleteFolder() {
    const { id, parent } = props.model;
    console.log(id, parent);
    deletedFolderId = id;

    deleteMessage({ id: deletedFolderId });
}

onDeleteFolder(result => {
    console.log("delete sucess log", result.data);
});
onDeleteError(err => {
    console.log(err);
});

function onlog() {
    console.log(folders.length, isFolder);
}

onMounted(() => {
    // const id = route.params.id
    if (route.params.id === props.model.id) {
        emit("open");
    }
});

watch(route, (to, from) => {
    console.log(`route is:`, to, from);
    if (to.params.id === props.model.id) {
        emit("open");
    }
});
</script>
<template>
    <!-- <button @click="onlog">log tree</button> -->
    <li class="list-none mt-2">
        <div
            class="tree-item flex items-center text-start relative bg-red-500k space-x-2"
            @click.right.stop.prevent="
                user.changeActiveWidget(`folder${model.id}`)
            "
            @click.left.stop="
                $router.push({ name: 'w-folder-id', params: { id: model.id } })
            "
        >
            <!-- <span
                @click="toggle"
                class="fold-button h-full w-5 cursor-pointer"
                :class="{ 'active bg-white/20': $route.params.id === model.id }"
                v-bind:style="{ visibility: isFolder ? 'visible' : 'hidden' }"
            >
                <div
                    :class="`i-carbon-chevron-${open ? 'down' : 'right'}`"
                ></div>
            </span> -->
            <!-- {{open}} -->
            <!-- <div class="i-carbon-chevron-right"></div> -->
                <!-- :class="`i-carbon-chevron-${open ? 'down' : 'right'}`" -->
            <button
                @click="toggle"
                v-bind:style="{ visibility: isFolder ? 'visible' : 'hidden' }"
                class="fold-button w-10"
            >
            <div v-if="open" class="i-carbon-chevron-down"></div>
            <div v-else class="i-carbon-chevron-right"></div>
            </button>
            <!-- model.id: {{ model.id }}
            {{ user.activeWidget }} -->
            <div
                class="tree-plate cursor-pointer px-3 relative w-full"
                v-bind:class="{
                    'active bg-white/10': $route.params.id === model.id
                }"
            >
                <span class="folder no-select-color">{{ model.name }}</span>
                <div
                    class="dropdown-content - absolute right-0 text-sm bg-gray-600 top-0 left-10 z-10 rounded"
                    v-show="activeWidget === `folder${model.id}`"
                >
                    <div class="hover:bg-gray-700 px-2" @click="openModal">
                        Add Folder
                    </div>
                    <div class="hover:bg-gray-700 px-2" @click="deleteFolder">
                        Delete
                    </div>
                </div>
            </div>
        </div>
        <ul class="tree pl-4" v-show="open" v-if="isFolder">
            <FolderTree
                v-for="folder in folders"
                :key="folder.id"
                :model="folder"
                @open="openArrow"
            >
            </FolderTree>
        </ul>
        <FolderForm
            v-if="showModal"
            :config="modalConfig"
            @close="showModal = false"
        ></FolderForm>
    </li>
</template>

<style scoped></style>
