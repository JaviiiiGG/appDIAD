<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">

    <q-form
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="namec"
        label="Nom Complet"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Escriu el nom']"
      />

      <q-input
        filled
        v-model="dni"
        label="DNI"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Escriu el dni']"
      />

      <q-input
        filled
        v-model="name"
        label="Usuari"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Escriu el usuari']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Password"
        lazy-rules
        :rules="[ val => val !== null && val !== '' || 'Escriu la contrasenya']"
      />

      <div>
        <q-btn label="Registrar" class="full-width" size="lg" type="submit" color="primary"/>
      </div>
    </q-form>

  </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
