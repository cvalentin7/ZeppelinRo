<template>
  <div>
    <h1>Format de configurare</h1>
    <p>
      Acesta este formatul de bază al configurației bot pentru un server. Defalcarea de bază este:
    </p>

    <ul>
      <li>Prefix (adică ce caracter precede fiecare comandă)</li>
      <li>Niveluri de permisiuni (consultați <router-link to="/docs/configuration/permissions">Permisiuni</router-link> pentru mai multe informații)</li>
      <li>Configurație specifică pluginului (consultați <router-link to="/docs/configuration/plugin-configuration">Configurare plugin</router-link> pentru mai multe informații)</li>
    </ul>

    <CodeBlock code-lang="yaml" trim="start">
      prefix: "!"

      # role id: level
      levels:
        "938908779800584242": 100 # Exemplu de admin
        "938908815129190530": 50 # Exemplu de mod

      plugins:
        mod_plugin:
          config:
            kick_message: 'Ai fost dat afara'
            can_kick: false
          overrides:
            - level: '>=50'
              config:
                can_kick: true
            - level: '>=100'
              config:
                kick_message: 'Ai fost dat afara de un admin'
    </CodeBlock>
  </div>
</template>

<script lang="ts">
  import CodeBlock from "./CodeBlock.vue";

  export default {
    components: { CodeBlock },
  };
</script>
