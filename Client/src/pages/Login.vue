<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Login</h5>
      </div>
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-input
          filled
          v-model="username"
          label="Usuari"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu algo']"
        >
          <q-icon name="perm_identity"/>
        </q-input>

        <q-input
          filled
          type="password"
          v-model="password"
          label="Password"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Escriu la contrasenya']"
        >
          <q-icon name="password"/>
        </q-input>

        <div>
          <q-btn label="Login" class="full-width" size="lg" type="submit" color="primary"/>
        </div>
        <q-card-section class="text-center q-pa-none">
          <p class="text-grey-6">No estas registrat? <a href="#/Register">Registrat</a></p>
        </q-card-section>
      </q-card>
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  }
}
</script>
