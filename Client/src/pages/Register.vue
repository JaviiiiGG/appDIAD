<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">

      <div class="row">
        <h5 class="text-h5 text-grey q-my-md">Register</h5>
      </div>
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-input
          filled
          v-model="full_name"
          label="Nom Complet *"
          lazy-rules
          :rules="[ val => val && val.length > 0 && isValidName() || 'Escriu el teu nom complet']"
        >
          <q-icon name="text_format"/>
        </q-input>

        <q-input
          filled
          v-model="dni"
          label="DNI *"
          lazy-rules
          :rules="[ val => val && val.length > 0  && isValidDNI && val.length <= 9 || 'Escriu el dni']"
        >
          <q-icon name="credit_card"/>
        </q-input>

        <q-input
          filled
          v-model="username"
          label="Usuari *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu el usuari']"
        >
          <q-icon name="perm_identity"/>
      </q-input>

      <q-input
        filled
        type="password"
        v-model="password"
        label="Password *"
        lazy-rules
        :rules="[ val => val !== null && val !== '' || 'Escriu la contrasenya']"
      >
        <q-icon name="password"/>
      </q-input>

      <q-input
        filled
        type="password"
        v-model="passwordC"
        label="Confirm Password *"
        lazy-rules
        :rules="[ val => val == this.password || 'La contrasenya no es igual']"
      >
        <q-icon name="password"/>
      </q-input>

      <div>
        <q-btn label="Registrar" class="full-width" size="lg" type="submit" color="primary"/>
      </div>
    </q-card>

  </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      full_name: '',
      dni: '',
      username: '',
      password: '',
      passwordC: ''
    }
  },
  methods: {
    validLength () {
      const nomValid = this.names.length
      if (nomValid < 1) {

      }
    },
    isValidName () {
      var names = this.full_name.split(' ')
      return names.length >= 3 && names.filter(names > 0).length === names.length
    }
  },
  computed: {
    isValidDNI () {
      const regExp = new RegExp('[0-9]{8}[A-Z]')
      return regExp.test(this.dni)
    }
  }
}
</script>
