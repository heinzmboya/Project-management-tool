<script setup lang="ts">
import {
    ElButton,
    ElContainer,
    ElForm,
    ElFormItem,
    ElHeader,
    ElInput,
    ElMain
} from "element-plus";

import {
    callLogin,
    loginError,
    loginDone,
    loginLoading
} from "~/constants/query";

const props = defineProps<{ id?: string }>();

let error = $ref("");
let email = $ref("");
let password = $ref("");

const router = useRouter();
function signup() {
    console.log(props.id);
}

function login() {
    const token = localStorage.getItem("user-token");
    console.log("🚀 ~ file: login.vue ~ line 32 ~ login ~ token", token);
}

async function login1() {
    // const { firstname, lastname, password } = this.form
    if (!(email && password)) {
        error = "Please complete the form";
        return;
    }

    const { apolloClient } = await import("~/ApolloClient")
    apolloClient.clearStore();

    callLogin({
        email,
        password
    });
}
loginDone(({ data: { data } }) => {
    const login = data.data.login;
    const id = login.user.id;
    const token = login.token;
    saveUserData(id, token);
    router.push("/w");
    console.log("success!"); // For now just print
});

loginError(({ error }) => {
    error = "Something went wrong";
    console.log(error);
});

function saveUserData(id, token) {
    localStorage.setItem("user-id", id);
    localStorage.setItem("user-token", token);
    const userId = localStorage.getItem("user-id");

    if (userId) {
        const user = useUserStore();
        user.userId = userId;
    }
}
</script>

<template>
    <div class="w-md mx-auto">
        <el-main>
            <div class="container-center">
                <h2>Log in</h2>

                <div v-if="error" class="error">
                    {{ error }}
                </div>
                <el-form ref="form">
                    <el-form-item>
                        <label>Email</label>
                        <el-input v-model="email" placeholder="Email" />
                        <label>Password</label>
                        <el-input
                            v-model="password"
                            type="password"
                            placeholder="Password"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            class="text-blue-500"
                            @click.once="login"
                        >
                            Log in
                        </el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <span>Don't have an account?</span>
                    <router-link to="'/home'" class="link text-blue-500">
                        Create an account
                    </router-link>
                </div>
            </div>
        </el-main>
    </div>
</template>

<style scoped></style>
