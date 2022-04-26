<template>
  <div>
    <h1>Tipuri de argumente</h1>
    <p>
      Această pagină detaliază diferitele tipuri de argumente disponibile pentru comenzi.
    </p>

    <h2 id="string">şir</h2>
    <p>
      Orice text
    </p>

    <h2 id="number">număr</h2>
    <p>
      Orice număr
    </p>

    <h2 id="user">utilizator</h2>
    <p>
      Orice lucru care identifică în mod unic un utilizator. Aceasta include:
    </p>
    <ul>
      <li>ID-ul de utilizator <code>401063006034984960</code></li>
      <li>Mențiune de utilizator <code>@valentin24#8389</code></li>
      <li>Mențiune liberă de utilizator <code>valentin24#8389</code></li>
    </ul>

    <h2 id="userId">ID-ul de utilizator</h2>
    <p>
      Un ID de utilizator valid, de ex. <code>401063006034984960</code>
    </p>

    <h2 id="channel">canal</h2>
    <p>
      Orice care identifică unic un canal. Aceasta include:
    </p>
    <ul>
      <li>ID canal <code>940059682897272832</code></li>
      <li>Mențiune de canal <code>#general</code></li>
    </ul>

    <h2 id="channelId">ID canal</h2>
    <p>
      Un ID de canal valid, de ex. <code>940059682897272832</code>
    </p>

    <h2 id="role">rol</h2>
    <p>
      Orice care identifică în mod unic un rol. Aceasta include:
    </p>
    <ul>
      <li>ID rol <code class="inline-code">938908779800584242</code></li>
      <li>Mențiune de rol <code>@admin</code></li>
    </ul>

    <h2 id="member">membru</h2>
    <p>
      Orice care identifică în mod unic un membru aflat în prezent pe server. Aceasta include:
    </p>
    <ul>
      <li>ID-ul de utilizator <code>401063006034984960</code></li>
      <li>Mențiune de utilizator <code>@valentin24#8389</code></li>
      <li>Mențiune liberă de utilizator <code>valentin24#8389</code></li>
    </ul>

    <h2 id="resolvedMember">resolvedMember</h2>
    <p>
      Vedeți <code>membru</code> mai sus
    </p>

    <h2 id="delay">întârziere</h2>
    <p>
      O întârziere este utilizată pentru a specifica o perioadă de timp. Folosește litere simple pentru a specifica duratele de timp.<br>. De exemplu, <code>2d15h27m3s</code> ar fi 2 zile, 15 ore, 27 minute și 3 secunde.
    </p>
    <p>
     Rețineți că întârzierea trebuie scrisă întotdeauna ca un cuvânt, fără spații!
    </p>

    <Expandable>
      <template v-slot:title>Additional information</template>
      <template v-slot:content>
        Durations:
        <ul>
          <li>
            <code>w</code> Săptămână
          </li>
          <li>
            <code>d</code> Zi
          </li>
          <li>
            <code>h</code> Ora
          </li>
          <li>
            <code>m</code> Minute
          </li>
          <li>
            <code>s</code> Secunde
          </li>
        </ul>
      </template>
    </Expandable>
  </div>
</template>

<script>
  import CodeBlock from "./CodeBlock";
  import Expandable from "../Expandable";

  export default {
    components: {
      CodeBlock,
      Expandable,
    },
  };
</script>
