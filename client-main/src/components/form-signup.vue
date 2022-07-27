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
    signUp,
    signUpError,
    signupDone,
    signupLoading
} from "~/constants/query";

const props = defineProps<{ id?: string }>();

const error = ref("");
const firstname = ref("");
const lastname = ref("");
const password = ref("");

const router = useRouter();
function signup() {
    console.log(props.id);
}

async function signup1() {
    // const { firstname, lastname, password } = this.form
    if (!(firstname && lastname && password)) {
        error.value = "Please complete the form";
        return;
    }

    const { apolloClient } = await import("~/ApolloClient");
    apolloClient.clearStore();

    signUp({
        id: props.id,
        firstname: firstname.value,
        lastname: lastname.value,
        password: password.value
    });
}
signupDone(({ data: { signup } }) => {
    const id = signup.user.id;
    const token = signup.token;
    saveUserData(id, token);
    router.push("/w");
    console.log("success!"); // For now just print
});

signUpError(({ error }) => {
    error.value = "Something went wrong";
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
    <el-container>
        <el-header />
        <el-main>
            <div class="container-center">
                <div>Welcome to Holic! Finish setting up your account</div>
                <div v-if="error" class="error">
                    {{ error }}
                </div>
                <el-form ref="form">
                    <el-form-item>
                        <label>First name</label>
                        <el-input
                            v-model="firstname"
                            placeholder="Your first name"
                        />
                        <label>Last name</label>
                        <el-input
                            v-model="lastname"
                            placeholder="Your last name"
                        />
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
                            class="text-gray-500"
                            @click="signup1"
                        >
                            Complete
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<style lang="scss" scoped></style>
