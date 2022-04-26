<template>
  <div>
    <h1>Permisiuni</h1>
    <p>
      Permisiunile din Aura sunt pur și simplu valori în configurația pluginului care sunt verificate atunci când este utilizată comanda.
      Aceste valori pot fi modificate prin suprascrieri (consultați <router-link to="/docs/configuration/plugin-configuration">Configurarea pluginului</router-link> pentru mai multe informații)
      și poate depinde de ex. ID utilizator, ID rol, ID canal, ID categorie sau <strong>nivel de permisiune</strong>.
    </p>

    <h2>Niveluri de permisiune</h2>
    <p>
      Cel mai simplu mod de a controla accesul la comenzile și caracteristicile botului este prin intermediul nivelurilor de permisiune. Aceste niveluri sunt pur și simplu un număr (de obicei între 0 și 100), bazat pe rolurile utilizatorului sau pe ID-ul utilizatorului, care poate fi apoi utilizat în înlocuirea permisiunilor. În mod implicit, mai multe comenzi sunt „doar moderator” (nivelul 50 și mai sus) sau „doar admin” (nivelul 100 și mai sus).
    </p>
    <p>
      În plus, a avea un nivel de permisiune mai ridicat înseamnă că anumite comenzi (cum ar fi !ban) nu pot fi folosite împotriva ta de către utilizatorii cu un nivel de permisiune mai scăzut sau egal (de exemplu, moderatorii nu se pot interzice reciproc sau administratorii de deasupra lor).
    </p>
    <p>
      Nivelurile de permisiune sunt definite în configurația din secțiunea <strong>niveluri</strong>. De exemplu:
    </p>

    <CodeBlock code-lang="yaml">
      # „rol/id utilizator”: nivel
      levels:
        "938908779800584242": 100 # Exemplu de admin
        "938908815129190530": 50 # Exemplu de moderator
    </CodeBlock>

    <h2>Exemple</h2>

    <h3>Anulări de bază</h3>
    <p>
      Pentru acest exemplu, să presupunem că avem un plugin numit <code>cats</code> care are o comandă <code>!cat</code> blocată în spatele permisiunii <code>can_cat</code>. Să presupunem că în mod implicit, pluginul permite oricui să folosească <code>!cat</code>, dar dorim să-l restricționăm doar la moderatori.
    </p>
    <p>
      Iată cum ar arăta configurația pentru aceasta:
    </p>

    <CodeBlock code-lang="yaml">
      plugins:
        cats:
          config:
            can_cat: false # Aici setăm permisiunea false în mod implicit
          overrides:
            # În această înlocuire, can_cat este schimbat la „true” pentru oricine cu un nivel de permisiune de 50 sau mai mare
            - level: ">=50"
              config:
                can_cat: true
    </CodeBlock>

    <h3>Înlocuirea setărilor implicite</h3>
    <p class="mb-1">
      În acest exemplu, să presupunem că nu doriți să utilizați nivelurile de permisiuni implicite de 50 și 100 pentru mods și, respectiv, administratori. Să presupunem că folosiți mai multe niveluri incrementale: 10, 20, 30, 40, 50...<br>. Vrem să facem astfel încât comenzile moderatorului să fie disponibile începând de la nivelul 70. În plus, am dori să rezervăm interzicerea doar pentru nivelurile 90+. Pentru a face acest lucru, trebuie să <strong>înlocuim</strong> suprascrierile implicite care activează comenzile moderatorului la nivelul 50.
    </p>
    <p class="mb-1">
      Iată cum ar arăta configurația pentru aceasta:
    </p>

    <CodeBlock code-lang="yaml">
      plugins:
        mod_actions:
          replaceDefaultOverrides: true
          overrides: # „=" aici înseamnă „înlocuiește orice setări implicite”
            - level: ">=70"
              config:
                can_warn: true
                can_mute: true
                can_kick: true
            - level: ">=90"
              config:
                can_ban: true
    </CodeBlock>
  </div>
</template>

<script>
  import CodeBlock from "./CodeBlock";

  export default {
    components: { CodeBlock },
  };
</script>
