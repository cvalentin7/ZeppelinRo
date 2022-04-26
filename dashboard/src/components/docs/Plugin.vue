<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else>
    <h1>{{ data.info.prettyName || data.name }}</h1>

    <!-- Description -->
    <MarkdownBlock :content="data.info.description" class="content"></MarkdownBlock>

    <div v-if="data.info.legacy">
      <div class="px-3 py-2 mb-4 rounded bg-gray-800 shadow-md inline-block flex">
        <div class="flex-none mr-2">
          <alert class="inline-icon mr-1 text-yellow-300" />
        </div>
        <div class="flex-auto">
          <strong>Notă!</strong> Acesta este un plugin vechi care nu mai este întreținut activ și poate fi eliminat într-o actualizare viitoare.
          <div v-if="typeof data.info.legacy === 'string'" class="mt-4">
            <MarkdownBlock v-if="typeof data.info.legacy === 'string'" :content="data.info.legacy"></MarkdownBlock>
          </div>
        </div>
      </div>
    </div>

    <Tabs>
      <Tab :active="tab === 'usage'">
        <router-link class="unstyled" v-bind:to="'/docs/plugins/' + pluginName + '/usage'">Utilizare</router-link>
      </Tab>
      <Tab :active="tab === 'configuration'">
        <router-link class="unstyled" v-bind:to="'/docs/plugins/' + pluginName + '/configuration'">Configurare</router-link>
      </Tab>
    </Tabs>

    <!-- Usage tab -->
    <div class="usage" v-if="tab === 'usage'">
      <h2 class="sr-only">Utilizare</h2>

      <div v-if="!hasUsageInfo">
        Acest plugin nu are informații de utilizare.
        Vezi <router-link v-bind:to="'/docs/plugins/' + pluginName + '/configuration'">Configurarea</router-link>.
      </div>

      <!-- Usage guide -->
      <div v-if="data.info.usageGuide">
        <MarkdownBlock :content="data.info.usageGuide" class="content" />
      </div>

      <!-- Command list -->
      <div v-if="data.commands.length">
        <h3 id="commands" class="text-2xl">Comenzi</h3>
        <div v-for="command in data.commands"
             class="command mb-4"
             v-bind:ref="getCommandSlug(command)" v-bind:class="{target: targetCommandId === getCommandSlug(command)}">
          <h4 class="text-xl font-semibold mb-0">
            <span v-for="(trigger, index) in getTriggers(command)"> <span class="text-gray-600" v-if="index > 0">/</span> !{{ trigger }} </span>
          </h4>
          <MarkdownBlock v-if="command.description"
                         :content="command.description"
                         class="content" />

          <div v-bind:class="{'-mt-2': command.description}">
            <div v-if="command.usage">
              <span class="font-semibold">Utilizare de bază:</span> <code class="inline-code">{{ command.usage }}</code>
            </div>
          </div>

          <Expandable class="mt-4">
            <template v-slot:title>Informații suplimentare</template>
            <template v-slot:content>
              <!--
              <div v-if="command.config.extra.info && command.config.extra.info.usageGuide">
                <div class="font-semibold">Usage guide:</div>
                <MarkdownBlock :content="command.config.extra.info.usageGuide"
                               class="content">
                </MarkdownBlock>
              </div>

              <div v-if="command.config.extra.info && command.config.extra.info.examples">
                <div class="font-semibold">Examples:</div>
                <MarkdownBlock :content="command.config.extra.info.examples"
                               class="content">
                </MarkdownBlock>
              </div>
              -->

              <p v-if="command.permission">
                <span class="font-semibold">Permisiune:</span>
                <code class="inline-code">{{ command.permission }}</code>
              </p>

              <div v-if="command.signature">
                <h5 class="font-semibold mb-2">Semnături:</h5>
                <ul class="list-none">
                  <li v-for="(signature, index) in getCommandSignatures(command)" v-bind:class="{'mt-8': index !== 0}">
                    <code class="inline-code bg-gray-900">
                      !{{ getTriggers(command)[0] }}
                      <span v-for="paramInfo in getSignatureParameters(signature)">{{ renderParameterOrOption(paramInfo.name, paramInfo.param) }} </span>
                    </code>

                    <div class="pl-4">
                      <div v-if="getSignatureParameters(signature).length">
                        <div class="font-semibold text-sm mt-2">Parametrii</div>
                        <ul>
                          <li v-for="paramInfo in getSignatureParameters(signature)">
                            <code>{{ renderParameter(paramInfo.name, paramInfo.param) }}</code>
                            <router-link :to="'/docs/reference/argument-types#' + (paramInfo.param.type || 'string')">{{ paramInfo.param.type || 'string' }}</router-link>
                            <MarkdownBlock v-if="paramInfo.param.description"
                                           :content="paramInfo.param.description"
                                           class="content">
                            </MarkdownBlock>
                          </li>
                        </ul>
                      </div>

                      <div v-if="getSignatureOptions(signature).length">
                        <div class="font-semibold text-sm mt-2">Opțiuni</div>
                        <ul>
                          <li v-for="optionInfo in getSignatureOptions(signature)">
                            <code>{{ renderOption(optionInfo.name, optionInfo.option) }}</code>
                            <router-link :to="'/docs/reference/argument-types#' + (optionInfo.option.type || 'string')">{{ optionInfo.option.type || 'string' }}</router-link>
                            <MarkdownBlock v-if="optionInfo.option.description"
                                           :content="optionInfo.option.description"
                                           class="content">
                            </MarkdownBlock>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </Expandable>
        </div>
      </div>
    </div>

    <!-- Configuration tab -->
    <div class="configuration" v-if="tab === 'configuration'">
      <!-- Basic config info -->
      <p>
        <strong>Nume în config:</strong> <code>{{ data.name }}</code><br>
        Pentru a activa acest plugin cu configurația implicită, adăugați <code>{{ data.name }}: {}</code> la <code>plugins</code> lista in config
      </p>

      <!-- Configuration guide -->
      <div v-if="data.info.configurationGuide">
        <h2 id="configuration-guide">Ghid de configurare</h2>
        <MarkdownBlock :content="data.info.configurationGuide" class="content"></MarkdownBlock>
      </div>

      <!-- Default configuration -->
      <h2 id="default-configuration">Configurație implicită</h2>
      <CodeBlock code-lang="yaml">{{ renderConfiguration(data.defaultOptions) }}</CodeBlock>

      <!-- Config schema -->
      <h2 id="config-schema">Schema de configurare</h2>
      <Expandable class="wide">
        <template v-slot:title>Faceți clic pentru a extinde</template>
        <template v-slot:content>
          <CodeBlock code-lang="plain">{{ data.configSchema }}</CodeBlock>
        </template>
      </Expandable>
    </div>
  </div>
</template>

<style scoped>
  .command.target {
    @apply mt-5 mb-3;
    @apply pt-2 pb-2 pl-4 pr-4;
    @apply border;
    @apply border-gray-400;
    @apply border-dashed;
    @apply rounded;
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {mapState} from "vuex";
  import yaml from "js-yaml";
  import CodeBlock from "./CodeBlock.vue";
  import MarkdownBlock from "./MarkdownBlock.vue";
  import Tabs from "../Tabs.vue";
  import Tab from "../Tab.vue";
  import Expandable from "../Expandable.vue";
  import { DocsState } from "../../store/types";
  import Alert from 'vue-material-design-icons/Alert.vue';

  const validTabs = ['usage', 'configuration'];
  const defaultTab = 'usage';

  export default {
    components: { CodeBlock, MarkdownBlock, Tabs, Tab, Expandable, Alert },

    async mounted() {
      this.loading = true;

      await this.$store.dispatch("docs/loadPluginData", this.pluginName);

      // If there's no usage info, use Configuration as the default tab
      if (!this.hasUsageInfo && ! this.$route.params.tab) {
        this.tab = 'configuration';
      }

      this.loading = false;

      this.$nextTick(() => {
        if (this.tab === "usage" && window.location.hash) {
          this.scrollToCommand(window.location.hash.slice(1));
        }
      });

      this.hashChangeListener = () => this.scrollToCommand(window.location.hash.slice(1));
      window.addEventListener('hashchange', this.hashChangeListener);
    },
    beforeDestroy() {
      window.removeEventListener('hashchange', this.hashChangeListener);
    },
    methods: {
      renderConfiguration(options) {
        return yaml.safeDump({
          [this.pluginName]: options,
        });
      },
      getTriggers(command) {
        return Array.isArray(command.trigger)
          ? command.trigger
          : [command.trigger];
      },
      getCommandSignatures(command) {
        if (!command.signature) {
          return [];
        }

        return Array.isArray(command.signature)
          ? command.signature
          : [command.signature];
      },
      getSignatureParameters(signature) {
        return Array.from(Object.entries(signature))
          .filter(([name, paramOrOption]) => !(paramOrOption as any).option)
          .map(([name, param]) => ({ name, param }));
      },
      getSignatureOptions(signature) {
        return Array.from(Object.entries(signature))
          .filter(([name, paramOrOption]) => Boolean((paramOrOption as any).option))
          .map(([name, option]) => ({ name, option }));
      },
      renderParameterOrOption(name, paramOrOption) {
        if (paramOrOption.option) {
          return this.renderOption(name, paramOrOption);
        }

        return this.renderParameter(name, paramOrOption);
      },
      renderParameter(name, param) {
        let str = name;
        if (param.rest) str += '...';
        if (param.required !== false) {
          return `<${str}>`;
        } else {
          return `[${str}]`;
        }
      },
      renderOption(name, opt) {
        let str = `-${name}`;
        if (opt.shortcut) {
          str += `|-${opt.shortcut}`;
        }
        if (opt.required) {
          return `<${str}>`;
        } else {
          return `[${str}]`;
        }
      },
      getCommandSlug(command) {
        const mainTrigger = this.getTriggers(command)[0];
        return 'command-' + mainTrigger.trim().toLowerCase().replace(/\s/g, '-');
      },
      scrollToCommand(hash) {
        if (this.$refs[hash]) {
          this.targetCommandId = hash;
          (this.$refs[hash][0] as Element).scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else {
          this.targetCommandId = null;
        }
      },
    },
    data() {
      return {
        loading: true,
        pluginName: this.$route.params.pluginName,
        tab: validTabs.includes(this.$route.params.tab)
          ? this.$route.params.tab
          : defaultTab,
        targetCommandId: null,
        hashChangeListener: null
      };
    },
    computed: {
      ...mapState("docs", {
        data(state: DocsState) {
          return state.plugins[this.pluginName];
        },
        hasUsageInfo() {
          if (!this.data) return true;
          if (this.data.commands.length) return true;
          if (this.data.info.usageGuide) return true;
          return false;
        },
      }),
    },
  }
</script>
