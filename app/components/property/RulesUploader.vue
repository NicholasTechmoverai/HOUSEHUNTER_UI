<template>
  <div class="p-4">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Property Rules</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Define rules that guests must follow. Required rules must be accepted by guests during booking.
      </p>
    </div>

    <!-- Main Editor Area -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rules Editor - Paste or type multiple rules here
        </label>
        <div class="flex items-center gap-2">
          <button 
            @click="showFormattingHelp = !showFormattingHelp"
            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ℹ️ Formatting help
          </button>
        </div>
      </div>

      <!-- Formatting Help -->
      <div v-if="showFormattingHelp" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
        <p class="font-medium mb-2">Quick formatting:</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
          <li>Start a line with <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">##</code> for a rule title</li>
          <li>Add <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">[Required]</code> or <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">[Optional]</code> after the title</li>
          <li>Add <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">(Category: Safety)</code> at the end</li>
          <li>Use blank lines to separate rules</li>
        </ul>
        <button 
          @click="insertSample"
          class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Insert sample rules →
        </button>
      </div>

      <!-- Bulk Rules Editor -->
      <div class="border border-gray-300 dark:border-gray-600 rounded-lg mb-4 overflow-hidden">
        <div class="flex border-b border-gray-300 dark:border-gray-600">
          <button 
            @click="activeTab = 'bulk'"
            :class="['px-4 py-2 text-sm font-medium', activeTab === 'bulk' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            📝 Bulk Edit
          </button>
          <button 
            @click="activeTab = 'preview'"
            :class="['px-4 py-2 text-sm font-medium', activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          >
            👁️ Preview
          </button>
        </div>

        <!-- Bulk Edit Tab -->
        <div v-if="activeTab === 'bulk'" class="p-4">
          <textarea
            v-model="bulkInput"
            placeholder="Example:
## No Smoking [Required] (Category: Safety)
This is a strictly non-smoking property.

## Check-in Time [Required] (Category: Check-in/out)
Check-in is available after 3:00 PM.

## Pet Policy [Optional] (Category: Pets)
Pets are allowed with approval."
            class="w-full h-64 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="parseBulkInput"
          ></textarea>
          
          <div class="flex justify-between items-center mt-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ parsedRules.length }} rules detected • {{ requiredCount }} required
            </div>
            <div class="flex gap-2">
              <button
                @click="clearBulkInput"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear
              </button>
              <button
                @click="applyBulkRules"
                :disabled="parsedRules.length === 0"
                :class="['px-3 py-1 text-sm rounded-lg', parsedRules.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed']"
              >
                Apply {{ parsedRules.length }} Rules
              </button>
            </div>
          </div>
        </div>

        <!-- Preview Tab -->
        <div v-if="activeTab === 'preview'" class="p-4">
          <div class="space-y-4 max-h-64 overflow-y-auto">
            <div v-for="(rule, index) in parsedRules" :key="index" class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ rule.title }}</h4>
                  <span :class="['text-xs px-2 py-0.5 rounded-full', rule.mandatory ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400']">
                    {{ rule.mandatory ? 'Required' : 'Optional' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ categoryLabels[rule.category] || rule.category }}
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ rule.content }}</p>
            </div>
            
            <div v-if="parsedRules.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500">
              No rules parsed yet. Switch to "Bulk Edit" tab to add rules.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Rules -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Current Rules</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ activeRules.length }} rules • {{ mandatoryCount }} required
          </p>
        </div>
        <button
          @click="exportRules"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          📋 Copy Rules
        </button>
      </div>

      <!-- Rules List -->
      <div v-if="activeRules.length > 0" class="space-y-3">
        <div 
          v-for="rule in activeRules" 
          :key="rule.id"
          class="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  v-model="rule.mandatory"
                  @change="markUnsaved"
                  class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ rule.title }}</h4>
                <span :class="['text-xs px-2 py-0.5 rounded-full', rule.mandatory ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400']">
                  {{ rule.mandatory ? 'Required' : 'Optional' }}
                </span>
              </div>
              
              <div class="flex items-center gap-3 mb-2">
                <select
                  v-model="rule.category"
                  @change="markUnsaved"
                  class="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getCategoryIcon(rule.category) }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-1">
              <button
                @click="editRule(rule)"
                class="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(rule.id)"
                class="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Rule Content Editor -->
          <UEditor
            v-model="rule.content"
            :toolbar="[
              ['bold', 'italic'],
              ['bulletList'],
              ['clearFormat']
            ]"
            :editor-class="[
              'text-sm',
              'min-h-[60px]',
              'p-2',
              'rounded',
              'border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-800',
              'focus:outline-none focus:ring-1 focus:ring-blue-500'
            ]"
            @update="() => updateRuleContent(rule.id, rule.content)"
            placeholder="Rule description..."
          />
          
          <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500 dark:text-gray-400">
              Created: {{ formatDate(rule.createdAt) }}
              <span v-if="rule.updatedAt"> • Updated: {{ formatDate(rule.updatedAt) }}</span>
            </span>
            <span v-if="rule.mandatory" class="flex items-center gap-1 text-red-600 dark:text-red-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Guests must accept
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <div class="text-gray-400 dark:text-gray-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400">No rules added yet</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Use the bulk editor above to add multiple rules at once</p>
      </div>
    </div>

    <!-- Additional Notes -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Additional Notes
      </label>
      <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <UEditor
          v-model="generalNotes"
          :toolbar="[['bold', 'italic'], ['bulletList'], ['clearFormat']]"
          :editor-class="[
            'min-h-[80px] p-3',
            'bg-white dark:bg-gray-800',
            'focus:outline-none'
          ]"
          placeholder="Any additional notes or information for guests..."
          @update="markUnsaved"
        />
      </div>
    </div>

    <!-- Save Section -->
    <div v-if="hasUnsavedChanges" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>You have unsaved changes</span>
        </div>
        <div class="flex gap-3">
          <button
            @click="discardChanges"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Discard
          </button>
          <button
            @click="saveRules"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div class="text-center mb-4">
          <div class="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Rule</h3>
          <p class="text-gray-500 dark:text-gray-400">Are you sure you want to delete this rule? This action cannot be undone.</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="deleteRule"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface PropertyRule {
  id: string
  title: string
  content: string
  category: string
  mandatory: boolean
  createdAt: string
  updatedAt?: string
}

const props = defineProps<{
  modelValue?: string
  rules?: PropertyRule[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:rules': [rules: PropertyRule[]]
  'save': []
  'change': [hasChanges: boolean]
}>()

// State
const generalNotes = ref(props.modelValue || '')
const activeRules = ref<PropertyRule[]>(props.rules || [])
const unsavedChanges = ref(false)
const showDeleteConfirm = ref(false)
const showFormattingHelp = ref(false)
const activeTab = ref<'bulk' | 'preview'>('bulk')

// Bulk editing
const bulkInput = ref('')
const parsedRules = ref<PropertyRule[]>([])
const ruleToDelete = ref<string | null>(null)

// Categories
const categoryOptions = [
  { value: 'checkin', label: 'Check-in/out' },
  { value: 'safety', label: 'Safety' },
  { value: 'guest', label: 'Guest Rules' },
  { value: 'facility', label: 'Facilities' },
  { value: 'pet', label: 'Pets' },
  { value: 'payment', label: 'Payment' },
  { value: 'other', label: 'Other' }
]

const categoryLabels = {
  checkin: 'Check-in/out',
  safety: 'Safety',
  guest: 'Guest Rules',
  facility: 'Facilities',
  pet: 'Pets',
  payment: 'Payment',
  other: 'Other'
}

const categoryIcons = {
  checkin: '⏰',
  safety: '⚠️',
  guest: '👥',
  facility: '🏠',
  pet: '🐾',
  payment: '💰',
  other: '📝',
}

// Computed
const mandatoryCount = computed(() => activeRules.value.filter(r => r.mandatory).length)
const requiredCount = computed(() => parsedRules.value.filter(r => r.mandatory).length)
const hasUnsavedChanges = computed(() => unsavedChanges.value)

// Watchers
watch(generalNotes, () => {
  markUnsaved()
  emit('update:modelValue', generalNotes.value)
})

watch(activeRules, () => {
  markUnsaved()
  emit('update:rules', activeRules.value)
}, { deep: true })

// Functions
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Today'
  }
}

function getCategoryIcon(category: string) {
  return categoryIcons[category as keyof typeof categoryIcons] || '📝'
}

function markUnsaved() {
  unsavedChanges.value = true
  emit('change', true)
}

// Bulk editing functions
function parseBulkInput() {
  const lines = bulkInput.value.split('\n')
  const rules: PropertyRule[] = []
  let currentRule: Partial<PropertyRule> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.startsWith('## ')) {
      // Save previous rule if exists
      if (currentRule.title && currentRule.content) {
        rules.push(createRuleFromParsed(currentRule))
      }
      
      // Parse new rule header
      const header = trimmed.substring(3).trim()
      currentRule = parseRuleHeader(header)
    } else if (trimmed && currentRule.title) {
      // Add to current rule content
      currentRule.content = currentRule.content ? currentRule.content + ' ' + trimmed : trimmed
    } else if (!trimmed && currentRule.title && currentRule.content) {
      // Blank line - finish current rule
      rules.push(createRuleFromParsed(currentRule))
      currentRule = {}
    }
  }

  // Add last rule if exists
  if (currentRule.title && currentRule.content) {
    rules.push(createRuleFromParsed(currentRule))
  }

  parsedRules.value = rules
}

function parseRuleHeader(header: string): Partial<PropertyRule> {
  const rule: Partial<PropertyRule> = {
    title: header,
    mandatory: true,
    category: 'other',
    content: ''
  }

  // Check for [Required] or [Optional]
  const requiredMatch = header.match(/\[(Required|Optional)\]/i)
  if (requiredMatch) {
    rule.mandatory = requiredMatch[1].toLowerCase() === 'required'
    rule.title = rule.title.replace(requiredMatch[0], '').trim()
  }

  // Check for category
  const categoryMatch = header.match(/\(Category:\s*([^)]+)\)/i)
  if (categoryMatch) {
    const categoryText = categoryMatch[1].trim().toLowerCase()
    rule.title = rule.title.replace(categoryMatch[0], '').trim()
    
    // Find matching category
    for (const option of categoryOptions) {
      if (categoryText.includes(option.label.toLowerCase()) || 
          option.value.toLowerCase() === categoryText) {
        rule.category = option.value
        break
      }
    }
  }

  return rule
}

function createRuleFromParsed(parsed: Partial<PropertyRule>): PropertyRule {
  const now = new Date().toISOString()
  return {
    id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: parsed.title || 'Untitled Rule',
    content: parsed.content || '',
    category: parsed.category || 'other',
    mandatory: parsed.mandatory ?? true,
    createdAt: now,
    updatedAt: now
  }
}

function applyBulkRules() {
  if (parsedRules.value.length === 0) return
  
  // Add parsed rules to active rules
  for (const rule of parsedRules.value) {
    // Check if similar rule already exists
    const existingIndex = activeRules.value.findIndex(r => 
      r.title.toLowerCase() === rule.title.toLowerCase()
    )
    
    if (existingIndex >= 0) {
      // Update existing rule
      activeRules.value[existingIndex] = {
        ...activeRules.value[existingIndex],
        ...rule,
        updatedAt: new Date().toISOString()
      }
    } else {
      // Add new rule
      activeRules.value.push(rule)
    }
  }
  
  // Clear bulk input
  bulkInput.value = ''
  parsedRules.value = []
  activeTab.value = 'preview'
  markUnsaved()
}

function insertSample() {
  bulkInput.value = `## No Smoking [Required] (Category: Safety)
This is a strictly non-smoking property. Smoking is prohibited in all areas including balconies.

## Check-in Time [Required] (Category: Check-in/out)
Check-in is available after 3:00 PM. Early check-in may be available upon request for an additional fee.

## Check-out Time [Required] (Category: Check-in/out)
Check-out is required by 11:00 AM. Late check-out may be arranged with prior approval.

## Maximum Guests [Required] (Category: Guest Rules)
Maximum occupancy is 6 guests. Additional visitors must be approved in advance.

## No Parties [Required] (Category: Safety)
Parties and events are not permitted. Quiet hours are from 10:00 PM to 7:00 AM.

## Pet Policy [Optional] (Category: Pets)
Pets are allowed with approval. Additional pet fee applies. Pets must be crated when alone.

## Parking [Optional] (Category: Facilities)
Two parking spaces are available in the driveway. Street parking is prohibited overnight.

## Damage Policy [Required] (Category: Payment)
Guests are responsible for any damage beyond normal wear and tear.`

  parseBulkInput()
}

function clearBulkInput() {
  bulkInput.value = ''
  parsedRules.value = []
}

function exportRules() {
  const text = activeRules.value.map(rule => {
    const category = categoryOptions.find(c => c.value === rule.category)?.label || rule.category
    const type = rule.mandatory ? 'Required' : 'Optional'
    return `## ${rule.title} [${type}] (Category: ${category})\n${rule.content}\n`
  }).join('\n')

  navigator.clipboard.writeText(text).then(() => {
    alert('Rules copied to clipboard!')
  })
}

// Rule management
function editRule(rule: PropertyRule) {
  // Create bulk input for editing
  const category = categoryOptions.find(c => c.value === rule.category)?.label || rule.category
  const type = rule.mandatory ? 'Required' : 'Optional'
  bulkInput.value = `## ${rule.title} [${type}] (Category: ${category})\n${rule.content}\n\n`
  activeTab.value = 'bulk'
  parseBulkInput()
  
  // Remove the rule being edited
  const index = activeRules.value.findIndex(r => r.id === rule.id)
  if (index >= 0) {
    activeRules.value.splice(index, 1)
  }
}

function updateRuleContent(ruleId: string, content: string) {
  const rule = activeRules.value.find(r => r.id === ruleId)
  if (rule) {
    rule.content = content
    rule.updatedAt = new Date().toISOString()
    markUnsaved()
  }
}

function confirmDelete(ruleId: string) {
  ruleToDelete.value = ruleId
  showDeleteConfirm.value = true
}

function cancelDelete() {
  showDeleteConfirm.value = false
  ruleToDelete.value = null
}

function deleteRule() {
  if (ruleToDelete.value) {
    const index = activeRules.value.findIndex(r => r.id === ruleToDelete.value)
    if (index !== -1) {
      activeRules.value.splice(index, 1)
      markUnsaved()
    }
  }
  cancelDelete()
}

function discardChanges() {
  if (confirm('Discard all unsaved changes?')) {
    unsavedChanges.value = false
    // Reset to original data if needed
  }
}

function saveRules() {
  unsavedChanges.value = false
  emit('save')
}
</script>