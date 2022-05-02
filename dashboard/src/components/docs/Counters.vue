<template>
  <div>
    <h1>Counters</h1>
    <p>
      "Counters" este o funcție avansată din Aura care vă permite să urmăriți numerele per utilizator, pe canal sau globale și să declanșați acțiuni specifice pe baza acestui număr. Cazurile de utilizare obișnuite sunt punctele de infracțiune, sistemele XP, rolurile de activitate și așa mai departe.
    </p>
    <p>
      Acest ghid va fi extins în viitor. Deocamdată, conține exemple de cazuri comune de utilizare a contoarelor. Consultați, de asemenea, <router-link to="/docs/plugins/counters">documentația pentru pluginul Counters.</router-link>
    </p>

    <h2>Exemple</h2>

    <h3>Puncte de infracțiune</h3>
    <p>
      În acest exemplu, avertismentele, mute și kick acumulează „puncte de infracțiune” pentru un utilizator. Când utilizatorul atinge prea multe puncte, acestea sunt automat banati.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea un exemplu</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:

            counters:
              config:
                counters:

                  infraction_points:
                    per_user: true
                    triggers:
                      # Când un utilizator acumulează 50 sau mai multe (>=50) puncte de infracțiune, acest declanșator se va activa.
                      # Numerele de aici sunt arbitrare - puteți alege să utilizați 5 sau 500, în funcție de granularitatea dorită.
                      autoban:
                        condition: ">=50"
                    # Eliminați 1 punct de infracțiune în fiecare zi
                    decay:
                      amount: 1
                      every: 24h

            automod:
              config:
                rules:

                  add_infraction_points_on_warn:
                    triggers:
                      - warn: {}
                    actions:
                      add_to_counter:
                        counter: "infraction_points"
                        amount: 10

                  add_infraction_points_on_mute:
                    triggers:
                      - mute: {}
                    actions:
                      add_to_counter:
                        counter: "infraction_points"
                        amount: 20

                  add_infraction_points_on_kick:
                    triggers:
                      - kick: {}
                    actions:
                      add_to_counter:
                        counter: "infraction_points"
                        amount: 40

                  autoban_on_too_many_infraction_points:
                    triggers:
                      # Declanșatorul contor pe care l-am specificat mai sus, „autoban”, este folosit pentru a declanșa o regulă automod aici
                      - counter_trigger:
                          counter: "infraction_points"
                          trigger: "autoban"
                    actions:
                      ban:
                        reason: "Prea multe puncte de infracțiune"
        </CodeBlock>
      </template>
    </Expandable>

    <h3>Creșterea pedepselor automod</h3>
    <p>
      Acest exemplu permite utilizatorilor să declanșeze regula automată `some_infraction` de 3 ori. La a 4-a oară, acestea primesc mute automat.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea un exemplu</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:

            counters:
              config:
                counters:

                  automod_infractions:
                    per_user: true
                    triggers:
                      # Când un utilizator acumulează 100 sau mai multe (>=100) puncte de infracțiune a modului automat, acest declanșator se va activa
                      # Numerele de aici sunt arbitrare - puteți alege să utilizați 10 sau 1000 în schimb.
                      too_many_infractions:
                        condition: ">=100"
                    # Eliminați 100 de puncte de infracțiune automod pe oră
                    decay:
                      amount: 100
                      every: 1h

            automod:
              config:
                rules:

                  # Un exemplu de regulă automod care adaugă puncte de infracțiune automod
                  some_infraction:
                    triggers:
                      - match_words:
                          words: ['esti prost']

                    actions:
                      clean: true
                      reply: 'Nu insultați alți utilizatori'
                      add_to_counter:
                        counter: "automod_infractions"
                        amount: 25 # Această infracțiune adaugă 25 de puncte de infracțiune automod

                  # Un exemplu de regulă care este declanșată atunci când utilizatorul acumulează prea multe puncte de infracțiune automod
                  automute_on_too_many_infractions:
                    triggers:
                      - counter_trigger:
                          counter: "automod_infractions"
                          trigger: "too_many_infractions"

                    actions:
                      mute:
                        reason: "Ați primit mute pentru că ați declanșat prea multe filtre automod"
                        remove_roles_on_mute: true
                        restore_roles_on_mute: true
        </CodeBlock>
      </template>
    </Expandable>

    <h3>Sistem XP simplu</h3>
    <p>
      Acest exemplu creează un sistem XP în care fiecare mesaj trimis vă oferă 1 XP, maxim o dată pe minut. La 100, 250, 500 și 1000 XP sistemul acordă utilizatorului un nou rol.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea un exemplu</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:

            counters:
              config:
                counters:
                  xp:
                    per_user: true
                    triggers:
                      role_1:
                        condition: ">=100"
                      role_2:
                        condition: ">=250"
                      role_3:
                        condition: ">=500"
                      role_4:
                        condition: ">=1000"

            automod:
              config:
                rules:

                  accumulate_xp:
                    triggers:
                      - any_message: {}

                    actions:
                      log: false # Nu trimiteți spam în jurnalele cu modificări XP
                      add_to_counter:
                        counter: "xp"
                        amount: 1 # Fiecare mesaj adaugă 1 XP

                    cooldown: 1m # Numărați doar 1 mesaj pe minut

                  add_xp_role_1:
                    triggers:
                      - counter_trigger:
                          counter: "xp"
                          trigger: "role_1"

                    actions:
                      add_roles: ["955526681181978654"] # ID rol pentru rolul xp 1

                  add_xp_role_2:
                    triggers:
                      - counter_trigger:
                          counter: "xp"
                          trigger: "role_2"

                    actions:
                      add_roles: ["955526637003341884"] # ID rol pentru rolul xp 2

                  add_xp_role_3:
                    triggers:
                      - counter_trigger:
                          counter: "xp"
                          trigger: "role_3"

                    actions:
                      add_roles: ["955526471512911892"] # ID rol pentru rolul xp 3

                  add_xp_role_4:
                    triggers:
                      - counter_trigger:
                          counter: "xp"
                          trigger: "role_4"

                    actions:
                      add_roles: ["955526468434280458"] # ID rol pentru rolul xp 4
        </CodeBlock>
      </template>
    </Expandable>

    <h3>Rol de activitate („prezenta timpurie”)</h3>
    <p>
      Acest exemplu este similar cu sistemul XP, dar numărul scade și rolul acordat de sistem poate fi eliminat dacă activitatea utilizatorului scade.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea un exemplu</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:

            counters:
              config:
                counters:
                  activity:
                    per_user: true
                    triggers:
                      grant_role:
                        condition: ">=100"
                        # Am stabilit un prag separat pentru momentul în care rolul ar trebui eliminat. Acest lucru este astfel încât dezintegrarea să nu elimine imediat rolul de activitate.
                        # Dacă această valoare nu este setată, reverse_condition este implicit opusă condiției, adică „<100” în acest caz.
                        reverse_condition: "<50"
                    decay:
                      amount: 1
                      every: 1h

            automod:
              config:
                rules:

                  accumulate_activity:
                    triggers:
                      - any_message: {}

                    actions:
                      log: false # Nu trimiteți spam în jurnalele cu modificări de activitate
                      add_to_counter:
                        counter: "activity"
                        amount: 1 # Fiecare mesaj adaugă 1 la contor

                    cooldown: 1m # Numărați doar 1 mesaj pe minut

                  grant_activity_role:
                    triggers:
                      - counter_trigger:
                          counter: "activity"
                          trigger: "grant_role"

                    actions:
                      add_roles: ["955526458858668052"] # ID de rol pentru rolul de activitate

                  remove_activity_role:
                    triggers:
                      - counter_trigger:
                          counter: "activity"
                          trigger: "grant_role"
                          reverse: true # Aceasta indică faptul că dorim să folosim *inversul* declanșatorului specificat, vezi reverse_condition în contoarele de mai sus

                    actions:
                      remove_roles: ["955526458858668052"] # ID de rol pentru rolul de activitate
        </CodeBlock>
      </template>
    </Expandable>

    <h3>Dezactivați automat antiraid</h3>
    <p>
      Acest exemplu dezactivează antiraid după o anumită întârziere.
    </p>

    <Expandable class="wide">
      <template v-slot:title>Faceți clic pentru a vedea un exemplu</template>
      <template v-slot:content>
        <CodeBlock code-lang="yaml">
          plugins:

            counters:
              config:
                counters:

                  antiraid_decay:
                    triggers:
                      disable:
                        condition: "=0"
                    decay:
                      amount: 1
                      every: 1m

            automod:
              config:
                rules:

                  start_antiraid_timer_low:
                    triggers:
                      - antiraid_level:
                          level: "low"
                    actions:
                      set_counter:
                        counter: "antiraid_decay"
                        value: 10 # „Dezactivați după 10 minute”

                  start_antiraid_timer_high:
                    triggers:
                      - antiraid_level:
                          level: "high"
                    actions:
                      set_counter:
                        counter: "antiraid_decay"
                        value: 20 # „Dezactivați după 20 minute”

                  disable_antiraid_after_timer:
                    triggers:
                      - counter_trigger:
                          counter: "antiraid_decay"
                          trigger: "disable"
                    actions:
                      set_antiraid_level: null
        </CodeBlock>
      </template>
    </Expandable>
  </div>
</template>

<script>
import CodeBlock from "./CodeBlock";
import Expandable from "../Expandable";

export default {
  components: { CodeBlock, Expandable },
};
</script>
