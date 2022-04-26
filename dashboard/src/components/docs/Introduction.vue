<template>
  <div>
    <h1>Introducere</h1>
    <p>
      Aura este un bot privat de moderare pentru Discord, aceasta instanta este un self host a Zeppelin.
    </p>

    <!-- WIP bar -->
    <div class="px-3 py-2 rounded bg-gray-800 shadow-md inline-block">
      <alert class="inline-icon mr-1 text-yellow-300" title="Note!" />
      Această documentație este o lucrare în curs.
    </div>

    <h2>Obținerea botului</h2>
    <p>
      Deoarece botul este în prezent privat, este necesar sa intrati in server-ul de discord pentru a cere acces la el.<br>
    </p>

    <h2>Configurare</h2>
    <p>
      Toată configurația Aura se face prin intermediul tabloului de bord prin editarea unui fișier de configurare YAML. În mod implicit, numai proprietarul serverului are acces la acest lucru, dar poate oferi altor utilizatori acces după cum consideră de cuviință. Consultați <router-link to="/docs/configuration/configuration-format">Format de configurare</router-link> pentru mai multe detalii.
    </p>

    <h2>Pluginuri</h2>
    <p>
      Aura este împărțită în pluginuri: funcționalități grupate care pot fi activate/dezactivate după cum este necesar și care au propriile configurații.
    </p>

    <h2>Commands</h2>
    <p>
      Comenzile pentru fiecare plugin sunt listate pe pagina pluginului (vezi „Plugin-uri” din meniu). Pe aceste pagini, se presupune că prefixul comenzii este <code>!</code>, dar acesta poate fi modificat pe server.
    </p>
  </div>
</template>

<script lang="ts">
  import Alert from 'vue-material-design-icons/Alert.vue';

  export default {
    components: { Alert },
  };
</script>
