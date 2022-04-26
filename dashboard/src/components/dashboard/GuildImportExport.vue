<template>
  <div>
    <h1>Import / Export</h1>
    <p>
      <strong>Notă!</strong>
      Această caracteristică este în prezent experimentală. Asigurați-vă că exportați întotdeauna o copie de rezervă înainte de a importa datele serverului. Dacă întâmpinați probleme, vă rugăm să le raportați pe [serverul RomaniaSupport](https://discord.gg/EnAbtd6zyf).
    </p>

    <h2>Exportați datele serverului</h2>
    <button class="inline-block bg-gray-700 rounded px-1 hover:bg-gray-800 hover:bg-gray-800" @click="runExport()" :disabled="exporting">Export de date</button>

    <p v-if="exporting">Export de date deschis în fereastră nouă!</p>
    <p v-else>&nbsp;</p>

    <h2>Importați datele serverului</h2>
    <p>
      <strong>Notă!</strong>
      Faceți întotdeauna o copie de rezervă a datelor existente de mai sus înainte de a importa.
    </p>
    <div class="mb-4">
      <h3>Fișier de import</h3>
      <input type="file" @change="selectImportFile($event.target.files[0])">
    </div>
    <div class="mb-4">
      <h3>Opțiuni de caz</h3>
      <label><input type="radio" v-model="importCaseMode" value="bumpImportedCases"> Lăsați numerele de cazuri existente, începeți cazurile importate de la sfârșit</label><br>
      <label><input type="radio" v-model="importCaseMode" value="bumpExistingCases"> Lăsați numerele de cazuri importate, renumerotați cazurile existente pentru a începe după cazurile importate</label><br>
      <label><input type="radio" v-model="importCaseMode" value="replace"> Înlocuiți cazurile existente (!! ACEST VOR ȘTERGE TOATE CAZURILE EXISTENTE !!)</label>
    </div>
    <button class="inline-block bg-gray-700 rounded px-1 hover:bg-gray-800" :class="{ 'bg-gray-800': importFile == null, 'hover:bg-gray-800': importFile != null }" @click="runImport()" :disabled="importFile == null">Importați fișierul selectat</button>

    <p v-if="importError">Eroare: {{ importError }}</p>
    <p v-else-if="importing">Se importă...</p>
    <p v-else>&nbsp;</p>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { ApiPermissions, hasPermission } from "@shared/apiPermissions";
import { AuthState, GuildState } from "../../store/types";
import { ApiError, formPost } from "../../api";
import moment from "moment";

export default {
  async mounted() {
    try {
      await this.$store.dispatch("guilds/loadGuild", this.$route.params.guildId);
    } catch (err) {
      if (err instanceof ApiError) {
        this.$router.push('/dashboard');
        return;
      }

      throw err;
    }

    if (this.guild == null) {
      this.$router.push('/dashboard');
      return;
    }

    this.loading = false;
  },
  computed: {
    ...mapState("guilds", {
      guild(guilds: GuildState) {
        return guilds.available.get(this.$route.params.guildId);
      },
    }),
  },
  data() {
    return {
      loading: true,

      importing: false,
      importError: null,
      importFile: null,
      importCaseMode: "bumpImportedCases",

      exporting: false,
    };
  },
  methods: {
    selectImportFile(file: File) {
      this.importFile = file;
    },
    async runImport() {
      if (this.importing) {
        return;
      }

      if (! this.importFile) {
        return;
      }

      this.importError = null;
      this.importing = true;

      try {
        await this.$store.dispatch("guilds/importData", {
          guildId: this.$route.params.guildId,
          data: JSON.parse(await (this.importFile as File).text()),
          caseHandlingMode: this.importCaseMode,
        });
      } catch (err) {
        this.importError = err.body?.error ?? String(err);
        return;
      } finally {
        this.importing = false;
        this.importFile = null;
      }

      window.alert("Datele au fost importate cu succes!");
    },
    async runExport() {
      if (this.exporting) {
        return;
      }

      this.exporting = true;

      formPost(`guilds/${this.$route.params.guildId}/export`, {}, { target: "_blank" });
    },
  },
};
</script>
