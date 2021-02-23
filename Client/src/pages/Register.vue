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
          label="Nom Complet"
          clearable:false
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu algo']"
        >
          <q-icon name="text_format"/>
        </q-input>

        <q-input
          filled
          v-model="dni"
          label="DNI"
          clearable:false
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu el dni']"
        >
          <q-icon name="credit_card"/>
        </q-input>

        <q-input
          filled
          v-model="name"
          label="Usuari"
          clearable:false
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu el usuari']"
        >
          <q-icon name="perm_identity"/>
      </q-input>

      <q-input
        filled
        type="password"
        v-model="password"
        label="Password"
        clearable:true
        lazy-rules
        :rules="[ val => val !== null && val !== '' || 'Escriu la contrasenya']"
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
      password: ''
    }
  }
}
</script>
