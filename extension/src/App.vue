<template>
  <div class="app">
    <form>
      <div class="field-container">
        <input class="input-field host-field" placeholder="Host" v-focus v-model="host" type="text">
      </div>
      <div class="field-container">
        <input class="input-field login-field" placeholder="Login" v-model="login" type="text">
      </div>
      <div class="row field-container main-password-container">
        <input
          class="eight columns input-field main-password-input"
          v-model="mainPassword"
          :type="hidePassword ? 'password' : 'text'"
          placeholder="Main Password" />
        <div class="four columns" v-if="mainPassword.length > 0">
          <div class="main-password-icons-container">
            <div class="main-password-icons" @click="togglePasswordVisibility()">
              <div class="main-password-icon" v-for="icon in icons" :key="icon.value">
                <i :class="icon.value" :style="icon.color"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="generate-button field-container">
        <button type="button" @click="generate()">Generate</button>
      </div>

      <div class="generated-password-container">
        <button class="icon-button" type="button" @click="toggleGeneratedPasswordVisibility()"><i
            class="fas fa-eye"></i></button>
        <input v-model="generatedPassword" class="generated-password-field"
          :class="hideGeneratedPassword ? 'input-blur' : ''" id="generatedPassword" type="text" />
        <button class="icon-button" type="button" @click="copy"><i class="fas fa-copy"></i></button>
      </div>

    </form>
  </div>
</template>

<script>
import {
  sha512,
  sha512_256 as sha512256
} from 'js-sha512'
import iconList from './icons'

const characterSubsets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz', // 26
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // 26
  digits: '0123456789', // 10
  symbols: '.,_-!#$%&*+-/@[]~'
}
const hash = (data, characterRules, limitedLength = 20) => {
  let compiled = JSON.stringify(data)
  let shaSum = sha512256(compiled)
    .split('')
  let shaSumComponents = []
  let shaSumValue = null
  shaSum.forEach(char => {
    if (shaSumValue === null) {
      shaSumValue = parseInt(char, 16)
    } else {
      shaSumComponents.push(shaSumValue * parseInt(char, 16) + 5)
      shaSumValue = null
    }
  })

  let characterSet = Object.keys(characterSubsets)
    .filter(subset => characterRules.indexOf(subset) !== -1)
    .map(subset => characterSubsets[subset]).join('').split('')
  return [...shaSumComponents]
    .map(part => characterSet[part % characterSet.length])
    .join('')
    .substring(0, limitedLength)
}

export default {
  name: 'app',
  directives: {
    focus: {
      inserted: el => el.focus()
    }
  },
  data () {
    return { host: '', login: '', mainPassword: '', icons: [], hidePassword: true, generatedPassword: '', hideGeneratedPassword: false }
  },
  watch: {
    mainPassword (value) {
      if (value.length === 0) {
        this.icons = []
        return
      }
      let hash = sha512(value)
      if (!(hash.length % 2)) {
        hash = hash.substr(2)
      }
      let hashParts = 3
      let ratio = hash.length / hashParts
      let icons = []
      for (var i = 0; i < hashParts; i++) {
        let value = hash.substring(ratio * i, ratio * (i + 1))
        icons.push({
          value: iconList[parseInt(value, 16) % iconList.length],
          color: 'color: #' + value.substr(0, 6)
        })
      }
      this.icons = icons
    }
  },
  mounted () {
    console.log('mounted')
  },
  methods: {
    togglePasswordVisibility () {
      this.hidePassword = !this.hidePassword
    },
    toggleGeneratedPasswordVisibility () {
      this.hideGeneratedPassword = !this.hideGeneratedPassword
    },
    generate () {
      this.generatedPassword = hash([this.host, this.login, this.mainPassword], ['lowercase', 'uppercase', 'digits'])
      this.hideGeneratedPassword = true
      this.copy()
    },
    copy () {
      let generatedPasswordInput = document.querySelector('#generatedPassword')
      generatedPasswordInput.value = this.generatedPassword
      generatedPasswordInput.select()
      generatedPasswordInput.setSelectionRange(0, this.generatedPassword.length)
      document.execCommand('copy')
      generatedPasswordInput.focus()
    }
  }
}
</script>
