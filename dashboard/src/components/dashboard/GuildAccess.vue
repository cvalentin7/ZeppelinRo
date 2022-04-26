<template>
  <div>
    <h1>Acces la dashboard</h1>
    <p>
      Pe această pagină puteți gestiona cine are acces la tabloul de bord Aura al serverului.
    </p>

    <h2 class="mt-8">Roluri</h2>
    <ul>
      <li>
        <strong>Proprietar:</strong> Toate permisiunile. Gestionat automat de bot.
      </li>
      <li>
        <strong>Manager bot:</strong> Poate gestiona utilizatorii tabloului de bord (inclusiv alți manageri de bot) și poate edita configurația serverului
      </li>
      <li>
        <strong>Operator bot:</strong> Poate edita configurația serverului
      </li>
    </ul>

    <h2 class="mt-8">Utilizatorii dashboard</h2>
    <div class="mt-4">
      <div v-if="permanentPermissionAssignments.length === 0">
        Fără utilizatori de tablou de bord
      </div>
      <ul v-if="permanentPermissionAssignments.length">
        <li v-for="perm in permanentPermissionAssignments">
          <div class="flex gap-4">
            <div>
              <strong>{{ perm.target_id }}</strong>
            </div>
            <div class="flex gap-4">
              <label class="block" v-if="isOwner(perm)">
                <input type="checkbox" checked="checked" disabled>
                Proprietar
              </label>
              <label class="block">
                <input
                  type="checkbox"
                  :checked="hasPermission(perm, 'MANAGE_ACCESS')"
                  @change="ev => setPermissionValue(perm, 'MANAGE_ACCESS', ev.target.checked)"
                  :disabled="hasPermissionIndirectly(perm, 'MANAGE_ACCESS')"
                >
                Manager de bot
              </label>
              <label class="block">
                <input
                  type="checkbox"
                  :checked="hasPermission(perm, 'EDIT_CONFIG')"
                  @change="ev => setPermissionValue(perm, 'EDIT_CONFIG', ev.target.checked)"
                  :disabled="hasPermissionIndirectly(perm, 'EDIT_CONFIG')"
                >
                Operator bot
              </label>
              <a href="#" v-on:click="deletePermissionAssignment(perm)" v-if="!isOwner(perm)">
                Delete
              </a>
            </div>
          </div>
        </li>
      </ul>
      <div class="mt-2">
        <a href="#" v-on:click="addPermissionAssignment()">
          Adăugați un utilizator nou
        </a>
      </div>
    </div>

    <h2 class="mt-8">Utilizatori temporari ai tabloului de bord</h2>
    <p>
      Puteți adăuga utilizatori temporari de tablou de bord la, de ex. solicitați ajutor de la o persoană din afara serverului dvs.<br>
      Utilizatorii temporari au întotdeauna permisiuni de <strong>operator bot</strong>.
    </p>
    <div v-if="temporaryPermissionAssignments.length === 0">
      Fără utilizatori temporari ai tabloului de bord
    </div>
    <ul v-if="temporaryPermissionAssignments.length">
      <li v-for="perm in temporaryPermissionAssignments">
        <div class="flex gap-4">
          <div>
            <strong>{{ perm.target_id }}</strong>
          </div>
          <div>
            Expira in {{ formatTimeRemaining(perm) }}
          </div>
          <div>
            <a href="#" v-on:click="deletePermissionAssignment(perm)">
              Șterge
            </a>
          </div>
        </div>
      </li>
    </ul>
    <div class="mt-2">
      <a href="#" v-on:click="addTemporaryPermissionAssignment()">
        Adăugați un utilizator temporar timp de 1 oră
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { ApiPermissions, hasPermission } from "@shared/apiPermissions";
import PermissionTree from "./PermissionTree.vue";
import { mapState } from "vuex";
import {
  GuildPermissionAssignment,
  GuildState,
  RootState
} from "../../store/types";
import humanizeDuration from "humanize-duration";
import moment from "moment";

export default {
    components: {PermissionTree},

    data() {
      return {
        managerPermissions: new Set([ApiPermissions.ManageAccess]),
      };
    },

    computed: {
      ...mapState({
        canManage(state: RootState): boolean {
          const guildPermissions = state.guilds.guildPermissionAssignments[this.$route.params.guildId] || [];
          const myPermissions = guildPermissions.find(p => p.type === "USER" && p.target_id === state.auth.userId) || null;
          return myPermissions && hasPermission(myPermissions.permissions, ApiPermissions.ManageAccess);
        },
      }),
      ...mapState<GuildState>("guilds", {
        permanentPermissionAssignments(guilds: GuildState): GuildPermissionAssignment[] {
          return (guilds.guildPermissionAssignments[this.$route.params.guildId] || []).filter(perm => perm.expires_at == null);
        },

        temporaryPermissionAssignments(guilds: GuildState): GuildPermissionAssignment[] {
          return (guilds.guildPermissionAssignments[this.$route.params.guildId] || []).filter(perm => perm.expires_at != null);
        },
      }),
    },

    async mounted() {
      await this.$store.dispatch("guilds/loadGuildPermissionAssignments", this.$route.params.guildId).catch(() => {});

      if (! this.canManage) {
        this.$router.push('/dashboard');
        return;
      }
    },
    methods: {
      isOwner(perm: GuildPermissionAssignment) {
        return perm.permissions.has(ApiPermissions.Owner);
      },

      hasPermission(perm: GuildPermissionAssignment, permissionName: ApiPermissions) {
        return hasPermission(perm.permissions, permissionName);
      },

      hasPermissionIndirectly(perm: GuildPermissionAssignment, permissionName: ApiPermissions) {
        return hasPermission(perm.permissions, permissionName) && ! perm.permissions.has(permissionName);
      },

      setPermissionValue(perm: GuildPermissionAssignment, permissionName: ApiPermissions, value) {
        if (value) {
          perm.permissions.add(permissionName);
        } else {
          perm.permissions.delete(permissionName);
        }

        this.$store.dispatch("guilds/setTargetPermissions", {
          guildId: this.$route.params.guildId,
          type: perm.type,
          targetId: perm.target_id,
          permissions: Array.from(perm.permissions),
          expiresAt: null,
        });

        this.$set(perm, "permissions", new Set(perm.permissions));
      },

      onTreeUpdate(targetPermissions) {
        this.$store.dispatch("guilds/setTargetPermissions", {
          guildId: this.$route.params.guildId,
          targetId: targetPermissions.target_id,
          type: targetPermissions.type,
          permissions: targetPermissions.permissions,
        });
      },

      formatTimeRemaining(perm: GuildPermissionAssignment) {
        const ms = Math.max(moment.utc(perm.expires_at).valueOf() - Date.now(), 0);
        return humanizeDuration(ms, { largest: 2, round: true });
      },

      addPermissionAssignment() {
        const userId = window.prompt("Introduceți ID-ul utilizatorului");
        if (!userId) {
          return;
        }

        this.$store.dispatch("guilds/setTargetPermissions", {
          guildId: this.$route.params.guildId,
          type: "USER",
          targetId: userId,
          permissions: [ApiPermissions.EditConfig],
          expiresAt: null,
        });
      },

      addTemporaryPermissionAssignment() {
        const userId = window.prompt("Introduceți ID-ul utilizatorului");
        if (!userId) {
          return;
        }

        const expiresAt = moment.utc().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
        this.$store.dispatch("guilds/setTargetPermissions", {
          guildId: this.$route.params.guildId,
          type: "USER",
          targetId: userId,
          permissions: [ApiPermissions.EditConfig],
          expiresAt,
        });
      },

      deletePermissionAssignment(perm: GuildPermissionAssignment) {
        const confirm = window.confirm(`Eliminați ${perm.target_id} de la utilizatorii dashboard?`);
        if (! confirm) {
          return;
        }

        this.$store.dispatch("guilds/setTargetPermissions", {
          guildId: this.$route.params.guildId,
          type: perm.type,
          targetId: perm.target_id,
          permissions: [],
          expiresAt: null,
        });
      },
    }
  }
</script>
