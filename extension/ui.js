const characterSubsets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz", // 26
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // 26
    digits: "0123456789", // 10
    symbols: ".,_-!#$%&*+-/@[]~"
};
const hash = (data, characterRules, limitedLength = 20) => {
    let compiled = JSON.stringify(data)
    let shaSum = sha512_256(compiled)
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

let App = new Vue({
  el: '#vue_app',
  directives: {
    focus: {
      inserted: el => el.focus()
    }
  },
  data() {
    return { host: '', login: '', mainPassword: '', icons: [], hidePassword: true, generatedPassword: '', hideGeneratedPassword: false }
  },
  watch: {
    mainPassword(value) {
      if (value.length === 0) {
        this.icons = []
        return;
      }
      let hash = sha512(value)
      if (!(hash.length % 2)) {
        hash = hash.substr(2)
      }
      let hashParts = 3
      let hashPartsValues = []
      let ratio = hash.length / hashParts
      let icons = []
      for (var i = 0; i < hashParts; i++) {
        let value = hash.substring(ratio * i, ratio * (i + 1))
        icons.push({
          value: window.iconList[parseInt(value, 16) % window.iconList.length],
          color: "color: #" + value.substr(0, 6)
        })
      }
      this.icons = icons
    }
  },
  mounted() {
    //chrome.extension.getBackgroundPage().console.log(document.getElementById('app'));

    console.log('mounted')
  },
  methods: {
    togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword
    },
    toggleGeneratedPasswordVisibility() {
      this.hideGeneratedPassword = !this.hideGeneratedPassword
    },
    generate() {
      this.generatedPassword = hash([this.host, this.login, this.mainPassword], ['lowercase', 'uppercase', 'digits'])
      this.hideGeneratedPassword = true
      this.copy()
    },
    copy() {
      let generatedPasswordInput = document.querySelector('#generatedPassword');
      generatedPasswordInput.value = this.generatedPassword
      generatedPasswordInput.select();
      generatedPasswordInput.setSelectionRange(0, this.generatedPassword.length);
      document.execCommand("copy");
      generatedPasswordInput.focus();
    }
  }
})