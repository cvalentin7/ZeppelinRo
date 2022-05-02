<template>
  <div class="privacy-policy">
    <div class="wrapper">
      <h1>Politica de confidențialitate Aura</h1>

      <h2>Prezentare generală Aura</h2>
      <p>
        Aura este un bot de moderare pentru Discord care permite personalului serverului
        desfășurați acțiuni de moderator (avertizare, amutire, kick, ban, curățare mesaje, vizualizare
        informații despre utilizator etc.),
        ține evidența infracțiunilor, efectuează acțiuni automate ("automod", de ex.
        filtrarea mesajelor), postați jurnalele detaliate pe canalele de înregistrare și configurați
        sisteme precum rolurile de reacție.
        Botul include, de asemenea, un tablou de bord web la care administratorii de server se pot conecta prin Discord OAuth.
      </p>
      <p>
        Codul sursă al botului este disponibil la
        <a href="https://github.com/Dragory/ZeppelinBot">
          https://github.com/Dragory/ZeppelinBot
        </a>
      </p>

      <h2>Date stocate</h2>
      <p>
        Când Aura este utilizată de un server, următoarele categorii de date pot fi stocate de către bot.
        Categoriile specifice de date salvate pentru fiecare server depind de modul în care serverul a configurat Aura.
      </p>
      <ul>
        <li>
          Mesajele recente și modificările numelui de utilizator/poreclelor utilizatorilor implicați pe server
        </li>
        <li>Mesaje recente șterse în bloc</li>
        <li>
          Informații de bază despre utilizator, text introdus de moderator și arhive de mesaje relevante pentru înregistrările de infracțiuni
        </li>
        <li>
          Un subset de roluri și porecla deținute anterior pe server, care urmează să fie restaurate atunci când un utilizator se reunește
        </li>
        <li>Detaliile de bază ale serverului folosind botul</li>
      </ul>
      <p>
        În plus, atunci când un utilizator se conectează la tabloul de bord web, sunt stocate următoarele tipuri de date:
      </p>
      <ul>
        <li>Informații de bază despre utilizatorul Discord</li>
        <li>
          Ora și adresa IP de origine a autentificarii în scopuri de audit de securitate
        </li>
      </ul>

      <h2>Păstrarea datelor</h2>
      <ul>
        <li>
          Mesajele recente sunt stocate timp de 24 de ore
          <ul>
            <li>
              Mesajele șterse în acest interval de 24 de ore sunt șterse la 5 minute după ștergere
            </li>
          </ul>
        </li>
        <li>
          Cele mai recente 5 nume de utilizator și 10 cele mai recente porecle ale utilizatorilor implicați în chat sau canale vocale sunt stocate timp de 30 de zile
        </li>
        <li>Arhivele mesajelor șterse în bloc sunt stocate timp de 30 de zile</li>
        <li>
          Datele de înregistrare a infracțiunilor sunt păstrate până când serverul nu mai folosește Aura, dacă nu sunt șterse în mod explicit
        </li>
        <li>
          Rolurile și poreclele care sunt restaurate la reînregistrare sunt șterse atunci când utilizatorul se reunește
        </li>
        <li>
          Informațiile despre utilizatori conectați la dashboard-ul botului prin Discord OAuth sunt stocate atâta timp cât serverul folosește Aura
        </li>
      </ul>

      <h2>Cereri de acces la date și de ștergere</h2>
      <p>
        Pentru a solicita accesul la datele personale stocate despre dvs. sau pentru a solicita ștergerea acestora, în măsura permisă de GDPR, vă rugăm să trimiteți un e-mail la
        <a href="mailto:ticket@romaniasupport.site">ticket@romaniasupport.site</a>.
      </p>
    </div></div>
</template>

<script type="ts">
  import "../style/privacy-policy.pcss";
  export default {};
</script>
