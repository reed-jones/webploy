<template lang='pug'>
#landingPage
  h1 Landing Page
  router-link(:to=`{name: "login"}`) #[button Login]
  router-link(:to=`{name: "register"}`) #[button Register]
  router-link(:to=`{name: "dashboard"}`) #[button Dashboard]
</template>

<script>
export default {
  //
}
</script>