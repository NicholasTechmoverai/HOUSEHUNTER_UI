<template>
  <div class="p-1 md:p-4 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Property Rules</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Rules that guests must agree to before booking
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ activeRules.length }} rules • {{ mandatoryCount }} required
          </span>
        </div>
      </div>
    </div>

    <!-- Main Rules Editor -->
    <div class=" rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
      <!-- Editor Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="font-medium text-gray-900 dark:text-white">Rules Editor</h3>
            <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Click numbers to edit
            </span>
          </div>
          <button
            @click="addNewRule"
            class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Rule
          </button>
        </div>
      </div>

      <!-- Rules List in Single Editor -->
      <div class="p-1 md:p-4">
        <!-- Empty State -->
        <div v-if="activeRules.length === 0" class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-4">No rules added yet</p>
          <button
            @click="addNewRule"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create First Rule
          </button>
        </div>

        <!-- Rules List with Numbers -->
        <div v-else class="space-y-4">
          <div 
            v-for="(rule, index) in activeRules" 
            :key="rule.id"
            class="rule-item group border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
            :class="{ 'bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-500': editingRuleId === rule.id }"
          >
            <!-- Rule Header with Number -->
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- Rule Number -->
                  <div class="rule-number">
                    <button
                      @click="toggleEdit(rule.id)"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      :title="editingRuleId === rule.id ? 'Save changes' : 'Edit this rule'"
                    >
                      {{ index + 1 }}
                    </button>
                  </div>
                  
                  <!-- Rule Title -->
                  <div class="flex-1 min-w-0">
                    <div v-if="editingRuleId === rule.id" class="flex items-center gap-2">
                      <input
                        v-model="rule.title"
                        @input="markUnsaved"
                        class="text-lg font-semibold bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 w-full"
                        placeholder="Rule title"
                      />
                    </div>
                    <h3 v-else class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {{ rule.title || 'Untitled Rule' }}
                    </h3>
                  </div>
                </div>

                <!-- Required/Optional Toggle -->
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleMandatory(rule.id)"
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      rule.is_mandatory 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    ]"
                    :title="rule.is_mandatory ? 'Required - guests must accept' : 'Optional - informational only'"
                  >
                    {{ rule.is_mandatory ? 'Required' : 'Optional' }}
                    <span class="ml-1">
                      {{ rule.is_mandatory ? '✓' : '○' }}
                    </span>
                  </button>
                  
                  <!-- Delete Button -->
                  <button
                    @click="removeRule(rule.id)"
                    class="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete rule"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Rule Content -->
            <div class="p-4">
              <!-- Description Editor -->
              <div v-if="editingRuleId === rule.id" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rule Description
                </label>
                <UEditor
                  v-model="rule.description"
                  :toolbar="[
                    ['bold', 'italic'],
                    ['bulletList', 'orderedList'],
                    ['clearFormat']
                  ]"
                  :editor-class="[
                    'min-h-[120px] p-3',
                    'border border-gray-300 dark:border-gray-600 rounded-lg',
                    '',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ]"
                  placeholder="Describe the rule in detail..."
                  @update="() => updateRuleContent(rule.id, rule.description)"
                />
              </div>
              
              <!-- Read-only View -->
              <div v-else class="prose prose-sm dark:prose-invert max-w-none">
                <div v-if="rule.description" v-html="rule.description"></div>
                <div v-else class="text-gray-400 dark:text-gray-500 italic">
                  No description provided
                </div>
              </div>
            </div>

            <!-- Rule Footer -->
            <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex items-center justify-between text-xs">
              <div class="text-gray-500 dark:text-gray-400">
                <span>Rule #{{ index + 1 }}</span>
                <span class="mx-2">•</span>
                <span>{{ formatDate(rule.created_at) }}</span>
                <span v-if="rule.updated_at" class="ml-2">
                  • Updated: {{ formatDate(rule.updated_at) }}
                </span>
              </div>
              
              <div v-if="rule.is_mandatory" class="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Guests must accept
              </div>
            </div>
          </div>
        </div>

        <!-- Add Rule Button at Bottom -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="addNewRule"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Another Rule
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="  rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">Quick Templates</h4>
        <div class="space-y-2">
          <button
            v-for="template in quickTemplates"
            :key="template.title"
            @click="applyTemplate(template)"
            class="w-full text-left px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center justify-between">
              <span>{{ template.title }}</span>
              <span :class="['text-xs px-1.5 py-0.5 rounded', template.is_mandatory ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400']">
                {{ template.is_mandatory ? 'Required' : 'Optional' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div class=" rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">Import/Export</h4>
        <div class="space-y-2">
          <button
            @click="exportRules"
            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Export Rules
          </button>
          <button
            @click="importRules"
            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import Rules
          </button>
        </div>
      </div>

      <div class=" rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">Statistics</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">Total Rules</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ activeRules.length }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">Required Rules</span>
            <span class="font-semibold text-red-600 dark:text-red-400">{{ mandatoryCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">Optional Rules</span>
            <span class="font-semibold text-gray-600 dark:text-gray-400">{{ activeRules.length - mandatoryCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Section -->
    <div v-if="hasUnsavedChanges" class="sticky bottom-0 left-0 right-0  border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="font-medium">Unsaved Changes</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ activeRules.length }} rules will be saved
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="discardChanges"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Discard
          </button>
          <button
            @click="saveRules"
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Save All Rules
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class=" rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Import Rules</h3>
          <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <textarea
            v-model="importText"
            placeholder="Paste rules here (one per line):
1. No smoking [Required]
2. Check-in after 3 PM [Required]
3. Pets allowed [Optional]"
            class="w-full h-48 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg  focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="showImportModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="processImport"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Match the Django model structure
interface PropertyRule {
  id: string
  title: string | null
  description: string | null
  is_mandatory: boolean
  created_at: string
  updated_at?: string
}

const props = defineProps<{
  rules?: PropertyRule[]
}>()

const emit = defineEmits<{
  'update:rules': [rules: PropertyRule[]]
  'save': []
  'change': [hasChanges: boolean]
}>()

// State
const activeRules = ref<PropertyRule[]>(props.rules || [])
const unsavedChanges = ref(false)
const editingRuleId = ref<string | null>(null)
const showImportModal = ref(false)
const importText = ref('')

// Quick templates matching common property rules
const quickTemplates: PropertyRule[] = [
  {
    id: 'template-1',
    title: 'No Smoking',
    description: 'This is a strictly non-smoking property. Smoking is prohibited in all areas including balconies.',
    is_mandatory: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'template-2',
    title: 'Check-in Time',
    description: 'Check-in is available after 3:00 PM. Early check-in may be available upon request.',
    is_mandatory: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'template-3',
    title: 'Check-out Time',
    description: 'Check-out is required by 11:00 AM. Late check-out may be arranged with prior approval.',
    is_mandatory: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'template-4',
    title: 'Maximum Guests',
    description: 'Maximum occupancy is limited to the number of guests specified in the booking.',
    is_mandatory: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'template-5',
    title: 'No Parties',
    description: 'Parties and events are not permitted. Quiet hours are from 10:00 PM to 7:00 AM.',
    is_mandatory: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'template-6',
    title: 'Pet Policy',
    description: 'Pets are allowed with prior approval. Additional pet fee may apply.',
    is_mandatory: false,
    created_at: new Date().toISOString()
  }
]

// Computed
const mandatoryCount = computed(() => activeRules.value.filter(r => r.is_mandatory).length)
const hasUnsavedChanges = computed(() => unsavedChanges.value)

// Watchers
watch(activeRules, () => {
  markUnsaved()
  emit('update:rules', activeRules.value)
}, { deep: true })

// Functions
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Today'
  }
}

function markUnsaved() {
  unsavedChanges.value = true
  emit('change', true)
}

function addNewRule() {
  const newRule: PropertyRule = {
    id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: null,
    description: null,
    is_mandatory: true,
    created_at: new Date().toISOString()
  }
  
  activeRules.value.push(newRule)
  editingRuleId.value = newRule.id
  markUnsaved()
}

function toggleEdit(ruleId: string) {
  if (editingRuleId.value === ruleId) {
    // Save changes
    editingRuleId.value = null
  } else {
    // Start editing
    editingRuleId.value = ruleId
  }
}

function toggleMandatory(ruleId: string) {
  const rule = activeRules.value.find(r => r.id === ruleId)
  if (rule) {
    rule.is_mandatory = !rule.is_mandatory
    rule.updated_at = new Date().toISOString()
    markUnsaved()
  }
}

function updateRuleContent(ruleId: string, content: string) {
  const rule = activeRules.value.find(r => r.id === ruleId)
  if (rule) {
    rule.description = content
    rule.updated_at = new Date().toISOString()
    markUnsaved()
  }
}

function removeRule(ruleId: string) {
  if (confirm('Delete this rule?')) {
    const index = activeRules.value.findIndex(r => r.id === ruleId)
    if (index !== -1) {
      activeRules.value.splice(index, 1)
      if (editingRuleId.value === ruleId) {
        editingRuleId.value = null
      }
      markUnsaved()
    }
  }
}

function applyTemplate(template: PropertyRule) {
  const newRule: PropertyRule = {
    id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: template.title,
    description: template.description,
    is_mandatory: template.is_mandatory,
    created_at: new Date().toISOString()
  }
  
  activeRules.value.push(newRule)
  editingRuleId.value = newRule.id
  markUnsaved()
}

function exportRules() {
  const rulesText = activeRules.value.map((rule, index) => {
    const type = rule.is_mandatory ? '[Required]' : '[Optional]'
    return `${index + 1}. ${rule.title || 'Untitled Rule'} ${type}\n   ${rule.description || 'No description'}\n`
  }).join('\n')
  
  navigator.clipboard.writeText(rulesText).then(() => {
    alert(`${activeRules.value.length} rules copied to clipboard!`)
  })
}

function importRules() {
  showImportModal.value = true
  importText.value = ''
}

function processImport() {
  const lines = importText.value.split('\n').filter(line => line.trim())
  
  lines.forEach(line => {
    // Parse line like "1. No smoking [Required]"
    const match = line.match(/(\d+\.\s*)?(.+?)(?:\s+\[(Required|Optional)\])?$/i)
    
    if (match) {
      const [, , title, type] = match
      const description = '' // No description in simple import
      
      const newRule: PropertyRule = {
        id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title?.trim() || null,
        description: description,
        is_mandatory: type?.toLowerCase() !== 'optional',
        created_at: new Date().toISOString()
      }
      
      activeRules.value.push(newRule)
    }
  })
  
  showImportModal.value = false
  markUnsaved()
}

function discardChanges() {
  if (confirm('Discard all unsaved changes?')) {
    unsavedChanges.value = false
    editingRuleId.value = null
    // Could reset to original state here
  }
}

function saveRules() {
  unsavedChanges.value = false
  editingRuleId.value = null
  emit('save')
}
</script>

<style scoped>
.rule-item {
  transition: all 0.2s ease;
}

.rule-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.rule-number {
  position: relative;
}

.rule-number::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  transform: translate(-50%, -50%) scale(1.2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.rule-number:hover::before {
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .rule-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
</style>