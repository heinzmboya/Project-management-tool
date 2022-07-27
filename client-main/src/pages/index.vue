<script setup lang="ts">
// import { reactive } from "vue";
// import { useQuery } from '@vue/apollo-composable'
// import gql from 'graphql-tag'
// import 'element-plus/es/components/message/style/css'
// import 'element-plus/es/components/button/style/index'
// import 'element-plus/lib/components/button/style/css'

import {
  captureEmailLoading,
  infoData,
  onDone,
  onError,
  sendMessage,
} from '~/constants/query'
import { validateEmail } from '~/helpers/helpers'

const user = useUserStore()
const name = $ref(user.savedName)

const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}

// const { result } = useQuery(gql`
//     query getInfo {
//         info
//     }
// `)
const info = computed(() => infoData.value?.info ?? 'test')

const email = ref('')
const error = ref('')
const submitted = ref(false)
const form = reactive({
  submitted: false,
  error: '',
  email: '',
})

function capture(mail) {
  console.log('capture', process.env)

  // const { email } = form;
  if (!mail || !validateEmail(mail)) {
    form.error = 'Please enter a valid email---------'
    return
  }

  sendMessage({ email: mail })
  onDone(() => {
    form.submitted = true
    form.error = ''
    form.email = ''
  })
  onError((error) => {
    // logErrorMessages(error)
    console.log(error)
  })
}
function setmail(val) {
  console.log('🚀 ~ file: index.vue ~ line 62 ~ setmail ~ val', val)
  form.email = val
}
</script>

<template>
  <div v-if="captureEmailLoading">
    Loading...
  </div>
  <div>
    {{ info }}
  </div>
  <div v-if="form.error" class="text-red-500">
    form error: {{ form.error }}
  </div>

  <!-- <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
  >
    <div class="max-w-2xl mx-auto sm:max-w-xl md:max-w-2xl">
      <div class="text-center">
        <div
          class="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12"
        >
          <div>
            <p
              class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-400"
            >
              Brand new
            </p>
          </div>
          <h2
            class="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto"
          >
            <span class="relative inline-block">
              <svg
                viewBox="0 0 52 24"
                fill="currentColor"
                class="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-600 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
              >
                <defs>
                  <pattern
                    id="b039bae0-fdd5-4311-b198-8557b064fce0"
                    x="0"
                    y="0"
                    width=".135"
                    height=".30"
                  >
                    <circle cx="1" cy="1" r=".7" />
                  </pattern>
                </defs>
                <rect
                  fill="url(#b039bae0-fdd5-4311-b198-8557b064fce0)"
                  width="52"
                  height="24"
                />
              </svg>
              <span class="relative">Welcome</span>
            </span>
            aboard
          </h2>
          <p class="text-base text-gray-700 md:text-lg">
            Enter your email address to start free trial
          </p>
        </div>
        <form
          class="flex flex-col items-center w-full mb-4 md:px-16"
          @submit.prevent
        >
          <div>{{ form.error }}</div>
          <input
            v-model="form.email"
            placeholder="Email"
            required=""
            type="text"
            class="flex-grow w-full h-12 px-4 mb-3 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none md:mr-2 focus:border-blue-400 focus:outline-none focus:shadow-outline"
          >

            <div v-if="form.submitted">
            <div>Thank you!</div>
            <div>Please check your email.</div>
          </div>
          <button
          v-else
            type="submit"
            class="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-blue-500 hover:bg-blue-700 focus:shadow-outline focus:outline-none"
            @click="capture"
          >
            Create my Holic account
          </button>

        </form>
        <span>Already have an enamel account?</span>
        <router-link to="/login" class="link">
          Log in
        </router-link>

        <a
          href="/"
          aria-label="Scroll down"
          class="flex items-center justify-center w-10 h-10 mx-auto text-gray-600 duration-300 transform border border-gray-400 rounded-full hover:text-purple-400 hover:border-purple-400 hover:shadow hover:scale-110 mt-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path
              d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div> -->

  <form-el :capture="capture" />
  <div v-if="form.submitted">
    <div>Thank you!</div>
    <div>Please check your email.</div>
  </div>
</template>

<route lang="yaml">
meta:
  # layout: home
  requiresAuth: true
</route>
