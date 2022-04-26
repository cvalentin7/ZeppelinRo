<template>
  <div>
    <h1>Configurare plugin</h1>
    <p>
      Majoritatea pluginurilor din Aura au opțiuni configurabile. Valorile pentru aceste opțiuni provin din 3 locuri:
    </p>
    <ol>
      <li>
        <strong>Opțiuni implicite</strong>  (de la Aura)
      </li>
      <li>
        <strong>Opțiuni personalizate</strong> (setat de tine în configurare)
      </li>
      <li>
        <strong>Suprascrie</strong> (valori de configurare condiționate, vezi mai jos)
      </li>
    </ol>
    <p>
      Permisiunile sunt, de asemenea, doar opțiuni de configurare obișnuite cu o valoare <code>true</code>/<code>false</code> .
      <router-link to="/docs/configuration/permissions">Consultați pagina Permisiuni pentru mai multe informații.</router-link>
    </p>
    <p>
      Informații despre opțiunile fiecărui plugin pot fi găsite pe pagina pluginului, care poate fi accesată din bara laterală.
      <router-link to="/docs/configuration/configuration-format">Consultați pagina Format de configurare pentru un exemplu de configurare completă.</router-link>
    </p>

    <h2>Suprascrie</h2>
    <p>
      Suprascrierile sunt mecanismul principal de modificare a opțiunilor și a permisiunilor pe baza nivelurilor de permisiune, roluri, canale, ID-uri de utilizator etc.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea exemple de diferite tipuri de suprascrieri</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:
            example_plugin:
              config:
                can_kick: false
                kick_message: "Ai fost dat cu afara"
                nested:
                  value: "Hello"
                  other_value: "Foo"
              overrides:
                # Modificare simplă bazată pe nivel de permisiune pentru a permite lovitura numai pentru nivelurile 50 și mai mari
                - level: '>=50'
                  config:
                    can_kick: true
                    nested:
                      # Acest lucru afectează numai nested.other_value; nested.value este încă „Hello”
                      other_value: "Bar"
                # Suprascriere canal - nu permiteți lovirea pe canalul specificat
                - channel: "940059682897272832"
                  config:
                    can_kick: false
                # Nu permiteți lovirea în niciun fir
                - is_thread: true
                  config:
                    can_kick: false
                # Nu permiteți lovirea într-un anumit thread
                - thread_id: "967511008899891220"
                  config:
                    can_kick: false
                # La fel ca mai sus, dar pentru o categorie completă
                - category: "938909326888812635"
                  config:
                    can_kick: false
                # Canale multiple. Dacă oricare dintre ele se potrivește, se aplică această suprascriere.
                - channel: ["940059682897272832", "939287960552108102"]
                  config:
                    can_kick: false
                # Potrivire pe baza unui rol
                - role: "952961935316508722"
                  config:
                    can_kick: false
                # Potrivire bazată pe mai multe roluri. Utilizatorul trebuie să aibă TOATE rolurile menționate aici pentru ca această modificare să se aplice.
                - role: ["952961935316508722", "955526681181978654"]
                  config:
                    can_kick: false
                # Potrivire pe ID de utilizator
                - user: "401063006034984960"
                  config:
                    kick_message: "Ai fost dat cu piciorul de Valentin"
                # Se potrivește în mai multe condiții
                - channel: "940059682897272832"
                  role: "952961935316508722"
                  config:
                    can_kick: false
                # Se potrivește mai multor condiții
                - any:
                  - channel: "940059682897272832"
                  - role: "952961935316508722"
                  config:
                    can_kick: false
                # Potriviți în oricare dintre cele două condiții complexe
                - any:
                  - all:
                    - channel: "940059682897272832"
                      role: "952961935316508722"
                    - not:
                        role: "952961935316508722"
                  - channel: "940059682897272832"
                    role: "952961935316508722"
                  config:
                    can_kick: false
        </CodeBlock>
      </template>
    </Expandable>

    <h2>suprascrieri implicite</h2>
    <p>
      Multe plugin-uri au unele suprascrieri în mod implicit, de obicei pentru nivelul implicit de mod (50) și/sau nivelul implicit de administrator (100). Acestea sunt aplicate înaintea oricăror modificări personalizate în configurație.
    </p>
    <p>
      Puteți vedea suprascrierile implicite pentru fiecare plugin, verificând secțiunea<strong> Configurare implicită </strong>
      din fila <strong>Configurare de pe pagina de documentație a pluginului.</strong> 
    </p>
    <p>
      Pentru a înlocui complet suprascrierile implicite ale unui plugin, setați <code>replaceDefaultOverrides</code> la <code>true</code> în opțiunile de plugin, la același nivel cu <code>config</code> și <code>overrides</code>. În exemplul următor, orice suprascrieri implicite pe care pluginul le-a avut nu va mai avea efect:
    </p>

    <CodeBlock code-lang="yaml">
      example_plugin:
        config:
          can_kick: false
        replaceDefaultOverrides: true # <-- Aici
        overrides:
          - level: ">=25"
            config:
              can_kick: true
    </CodeBlock>
  </div>
</template>

<script lang="ts">
  import CodeBlock from "./CodeBlock.vue";
  import Expandable from "../Expandable.vue";

  export default {
    components: { CodeBlock, Expandable },
  };
</script>
